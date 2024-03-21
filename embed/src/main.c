#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/event_groups.h"
#include "esp_system.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include "driver/gpio.h"
#include "esp_adc_cal.h"
#include "driver/adc.h"
#include <stdlib.h>
#include "esp_task_wdt.h"
#include "esp_http_server.h"
#include "lwip/err.h"
#include "lwip/sys.h"
#include "hal/gpio_types.h"

#include <mqtt_client.h>

#include "adc_config.h"
#include "broker_config.h"
#include "wifi_config.h"





//set macro values
// #if CONFIG_ESP_WPA3_SAE_PWE_HUNT_AND_PECK
// #define ESP_WIFI_SAE_MODE WPA3_SAE_PWE_HUNT_AND_PECK
// #define EXAMPLE_H2E_IDENTIFIER ""
// #elif CONFIG_ESP_WPA3_SAE_PWE_HASH_TO_ELEMENT
// #define ESP_WIFI_SAE_MODE WPA3_SAE_PWE_HASH_TO_ELEMENT
// #define EXAMPLE_H2E_IDENTIFIER CONFIG_ESP_WIFI_PW_ID
// #elif CONFIG_ESP_WPA3_SAE_PWE_BOTH
// #define ESP_WIFI_SAE_MODE WPA3_SAE_PWE_BOTH
// #define EXAMPLE_H2E_IDENTIFIER CONFIG_ESP_WIFI_PW_ID
// #endif
// #if CONFIG_ESP_WIFI_AUTH_OPEN
// #define ESP_WIFI_SCAN_AUTH_MODE_THRESHOLD WIFI_AUTH_OPEN
// #elif CONFIG_ESP_WIFI_AUTH_WEP
// #define ESP_WIFI_SCAN_AUTH_MODE_THRESHOLD WIFI_AUTH_WEP
// #elif CONFIG_ESP_WIFI_AUTH_WPA_PSK
// #define ESP_WIFI_SCAN_AUTH_MODE_THRESHOLD WIFI_AUTH_WPA_PSK
// #elif CONFIG_ESP_WIFI_AUTH_WPA2_PSK
// #define ESP_WIFI_SCAN_AUTH_MODE_THRESHOLD WIFI_AUTH_WPA2_PSK
// #elif CONFIG_ESP_WIFI_AUTH_WPA_WPA2_PSK
// #define ESP_WIFI_SCAN_AUTH_MODE_THRESHOLD WIFI_AUTH_WPA_WPA2_PSK
// #elif CONFIG_ESP_WIFI_AUTH_WPA3_PSK
// #define ESP_WIFI_SCAN_AUTH_MODE_THRESHOLD WIFI_AUTH_WPA3_PSK
// #elif CONFIG_ESP_WIFI_AUTH_WPA2_WPA3_PSK
// #define ESP_WIFI_SCAN_AUTH_MODE_THRESHOLD WIFI_AUTH_WPA2_WPA3_PSK
// #elif CONFIG_ESP_WIFI_AUTH_WAPI_PSK
// #define ESP_WIFI_SCAN_AUTH_MODE_THRESHOLD WIFI_AUTH_WAPI_PSK
// #endif

/* FreeRTOS event group to signal when we are connected*/
static EventGroupHandle_t s_wifi_event_group;

/* The event group allows multiple bits for each event, but we only care about two events:
 * - we are connected to the AP with an IP
 * - we failed to connect after the maximum amount of retries */

//bit masks used to 
#define WIFI_CONNECTED_BIT (0<<1) // used to check bit postion 0 on whether it is set to 1 or 0, 1 indicated a success  
#define WIFI_FAIL_BIT      (1<<1) //used to check bit postion 1 on whether it is set to 1 or 0, 0 indicating a failure

static const char *TAG = "wifi station";

//var to track number of wifi retry attempts
static int s_retry_num = 0;

//function that runs when an event is detected such as a wifi connection attempt  
static void event_handler(void* arg, esp_event_base_t event_base, int32_t event_id, void* event_data) {
    //check wheterh the event is a wifi event 
    if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_START) {
        esp_wifi_connect();
    } else if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_DISCONNECTED) {
        if (s_retry_num < ESP_MAXIMUM_RETRY) {
            esp_wifi_connect();
            s_retry_num++;
            ESP_LOGI(TAG, "retry to connect to the AP");
        } else {
            xEventGroupSetBits(s_wifi_event_group, WIFI_FAIL_BIT);
        }
        ESP_LOGI(TAG,"connect to the AP fail");
    } else if (event_base == IP_EVENT && event_id == IP_EVENT_STA_GOT_IP) {
        ip_event_got_ip_t* event = (ip_event_got_ip_t*) event_data;
        ESP_LOGI(TAG, "got ip:" IPSTR, IP2STR(&event->ip_info.ip));
        s_retry_num = 0;
        xEventGroupSetBits(s_wifi_event_group, WIFI_CONNECTED_BIT);
    }
}

void wifi_init_sta(void)
{
    s_wifi_event_group = xEventGroupCreate();

    //error check does similar function as assert, except it checks against a esp_err_t value to see if it returns esp_ok
    //if failure then abort() is called and error message is printed

    // esp_netif_init() to create an LwIP core task and initialize LwIP-related work.
    ESP_ERROR_CHECK(esp_netif_init());

    // The main task calls esp_event_loop_create_defualt() to create a system Event task and initialize an application event’s callback function.
    ESP_ERROR_CHECK(esp_event_loop_create_default());

    //esp_netif_create_default_wifi_sta() to create default network interface instance binding station or AP with TCP/IP stack
    esp_netif_create_default_wifi_sta();

    //alyways use WIFI_INIT_CONFIG_DEGAULT() when initializing config, is possible to overrwite values
    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    //starts wifi task
    ESP_ERROR_CHECK(esp_wifi_init(&cfg));

    esp_event_handler_instance_t instance_any_id;
    esp_event_handler_instance_t instance_got_ip;
    ESP_ERROR_CHECK(esp_event_handler_instance_register(WIFI_EVENT, ESP_EVENT_ANY_ID, &event_handler, NULL, &instance_any_id));
    ESP_ERROR_CHECK(esp_event_handler_instance_register(IP_EVENT, IP_EVENT_STA_GOT_IP, &event_handler, NULL,&instance_got_ip));

    //TODO work on the macro definitions
    wifi_config_t wifi_config = {
        .sta = {
            .ssid = ESP_WIFI_SSID,
            .password = ESP_WIFI_PASS,
            /* Authmode threshold resets to WPA2 as default if password matches WPA2 standards (pasword len => 8).
             * If you want to connect the device to deprecated WEP/WPA networks, Please set the threshold value
             * to WIFI_AUTH_WEP/WIFI_AUTH_WPA_PSK and set the password with length and format matching to
             * WIFI_AUTH_WEP/WIFI_AUTH_WPA_PSK standards.
             */
            .threshold.authmode = 0,
            .sae_pwe_h2e = 0,
            .sae_h2e_identifier = EXAMPLE_H2E_IDENTIFIER,
        },
    };
    ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA) );
    ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_STA, &wifi_config) );
    ESP_ERROR_CHECK(esp_wifi_start() );

    ESP_LOGI(TAG, "wifi_init_sta finished.");

    /* Waiting until either the connection is established (WIFI_CONNECTED_BIT) or connection failed for the maximum
     * number of re-tries (WIFI_FAIL_BIT). The bits are set by event_handler() (see above) */
    EventBits_t bits = xEventGroupWaitBits(s_wifi_event_group, WIFI_CONNECTED_BIT | WIFI_FAIL_BIT, pdFALSE, pdFALSE, portMAX_DELAY);

    /* xEventGroupWaitBits() returns the bits before the call returned, hence we can test which event actually
     * happened. */
    if (bits & WIFI_CONNECTED_BIT) {
        ESP_LOGI(TAG, "connected to ap SSID:%s password:%s",ESP_WIFI_SSID, ESP_WIFI_PASS);
    } else if (bits & WIFI_FAIL_BIT) {
        ESP_LOGI(TAG, "Failed to connect to SSID:%s, password:%s", ESP_WIFI_SSID, ESP_WIFI_PASS);
    } else {
        ESP_LOGE(TAG, "UNEXPECTED EVENT");
    }
}

static const char *CHARACTERIZATION_TAG = "Characterization Status";
static const char *READING = "Reading/Result";
static const char *MQTT = "MQTT Status";
static bool mqtt_connected = false;
static const char *TEST = "TEST";
static esp_err_t mqtt_event_handler(esp_mqtt_event_handle_t event)
{
    switch (event->event_id) {
        case MQTT_EVENT_CONNECTED:
            mqtt_connected = true;
            break;
        case MQTT_EVENT_DISCONNECTED:
            mqtt_connected = false;
            break;
        // Handle other events...
        default:
            ESP_LOGE(TAG, "UNEXPECTED EVENT");
    }
    return ESP_OK;
}


void adc_task(void *pvParameters) { // Recommended value of SAMPING_INTERVAL is 1000, and of NO_OF_SAMPLES is 16, 32, or 64 
    float result = 0;
    static esp_adc_cal_characteristics_t *adc_chars;
    esp_mqtt_client_config_t mqtt_cfg = {
        .broker.address.uri = MQTT_URL,
        .credentials.username = MQTT_USER,
        .credentials.authentication.password = MQTT_PASS,
    };

    esp_mqtt_client_handle_t client = esp_mqtt_client_init(&mqtt_cfg);

    esp_err_t mqtt_start_result = esp_mqtt_client_start(client);

    if (mqtt_start_result == ESP_OK) {
        ESP_LOGI(MQTT, "MQTT client started successfully.\n");
    } else {
        ESP_LOGI(MQTT, "MQTT client failed to start.\n");
    }
    // Implemented configuration within task to consolidate code/make it less messy

    if (ADC_UNIT_1 == ADC_UNIT) { // Is the unit being used ADC1?
        adc1_config_width(ADC_WIDTH);
        adc1_config_channel_atten(ADC_CHANNEL, ADC_ATTEN);
    } else {
        adc2_config_channel_atten((adc2_channel_t)ADC_CHANNEL, ADC_ATTEN); 
    }

    adc_chars = calloc(1, sizeof(esp_adc_cal_characteristics_t)); //
    esp_adc_cal_value_t val_type = esp_adc_cal_characterize(ADC_UNIT, ADC_ATTEN, ADC_WIDTH, DEFAULT_VREF, adc_chars); // esp_adc_cal_characterize calibrates the ADC according to the parameters given. Very abstracted.

    if (val_type) {
        ESP_LOGI(CHARACTERIZATION_TAG, "ADC characterization successful.\n");
    } else {
        ESP_LOGI(CHARACTERIZATION_TAG,"ADC characterization failed. Default parameters will be used instead.\n");

    }

    while(1) {
        uint32_t adc_reading = 0;
        for (int i = 0; i < NO_OF_SAMPLES; i++) {
            if (ADC_UNIT == ADC_UNIT_1) {
                adc_reading += adc1_get_raw((adc1_channel_t)ADC_CHANNEL);
            } else { 
                int raw;
                adc2_get_raw((adc2_channel_t)ADC_CHANNEL, ADC_WIDTH, &raw);
                adc_reading += raw;
            }
        }
        adc_reading /= NO_OF_SAMPLES; // Average of the collected converted reading 
        //Convert adc_reading to voltage in mV
        result = ((int)adc_reading / MAX_RAW) * 100;
        uint32_t voltage = esp_adc_cal_raw_to_voltage(adc_reading, adc_chars);        
        ESP_LOGI(READING, "Raw: %lu\t Voltage: %lumV Result: %0.1f%%", adc_reading, voltage, result);
        char result_str[10];
        snprintf(result_str, sizeof(result_str), "%.1f", result);
        esp_mqtt_client_publish(client, "/topic/humidity", result_str, strlen(result_str), 1, 0);

        vTaskDelay(pdMS_TO_TICKS(SAMPLING_INTERVAL)); // This controls the interval of the 'sips'
    }
}


void app_main(void){


    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
      ESP_ERROR_CHECK(nvs_flash_erase());
      ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);

    ESP_LOGI(TAG, "ESP_WIFI_MODE_STA");
    wifi_init_sta();

    xTaskCreate(&adc_task, "adc_task", 2048, NULL, 5, NULL);
    // vTaskDelay(pdMS_TO_TICKS(5000));
    // vTaskDelete(handle_adc);
    
    //Initialize NVS
    

    gpio_config_t output_config = {
        .pin_bit_mask = (1ULL << GPIO_NUM_2),
        .mode = GPIO_MODE_OUTPUT,
        .pull_up_en = GPIO_PULLUP_DISABLE,
        .pull_down_en = GPIO_PULLDOWN_DISABLE,
        .intr_type = GPIO_INTR_DISABLE
    };
    gpio_config(&output_config);

    while (1) {
        gpio_set_level(GPIO_NUM_2, 1); // Set pin high
        vTaskDelay(1000 / portTICK_PERIOD_MS); // Delay 1 second
        gpio_set_level(GPIO_NUM_2, 0); // Set pin low
        vTaskDelay(1000 / portTICK_PERIOD_MS); // Delay 1 second
    }
}