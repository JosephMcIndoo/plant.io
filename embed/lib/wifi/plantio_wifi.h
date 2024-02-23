#ifndef PLANTIO_WIFI_H
#define PLANTIO_WIFI_H

#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/event_groups.h"
#include "esp_system.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_log.h"
#include "nvs_flash.h"

#include "lwip/err.h"
#include "lwip/sys.h"

//bit masks used to 
#define WIFI_CONNECTED_BIT (0<<1) // used to check bit postion 0 on whether it is set to 1 or 0, 1 indicated a success  
#define WIFI_FAIL_BIT      (1<<1) //used to check bit postion 1 on whether it is set to 1 or 0, 0 indicating a failure

#define ESP_WIFI_SSID      "Kensmojodojo"
#define ESP_WIFI_PASS      "whohatesiowa!"
#define ESP_MAXIMUM_RETRY  5

#define ESP_WIFI_SAE_MODE  "BOTH"
#define EXAMPLE_H2E_IDENTIFIER ""
#define ESP_WIFI_SCAN_AUTH_MODE_THRESHOLD "WPA2 PSK"

static void event_handler(void* arg, esp_event_base_t event_base, int32_t event_id, void* event_data);

void wifi_init_sta(void);

#endif //PLANTIO_WIFI_H