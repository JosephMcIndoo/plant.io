// #include "esp_http_server.h"
// #include "esp_log.h"
// #include "freertos/FreeRTOS.h"
// #include "freertos/task.h"
// #include "mqtt_client.h"
// #include "broker_config.h"
// esp_mqtt_client_handle_t client;

// static esp_err_t http_get_handler(httpd_req_t *req){
//     // Handle GET request here
//     return ESP_OK;
// }

// static esp_err_t mqtt_event_handler(esp_mqtt_event_handle_t event){
//     // Handle MQTT events here
//     return ESP_OK;
// }

// void http_server_task(void *pvParameters){
//     httpd_handle_t server = NULL;
//     httpd_config_t config = HTTPD_DEFAULT_CONFIG();

//     httpd_uri_t uri_get = {
//         .uri       = "/get",
//         .method    = HTTP_GET,
//         .handler   = http_get_handler,
//         .user_ctx  = NULL
//     };

//     if (httpd_start(&server, &config) == ESP_OK) {
//         httpd_register_uri_handler(server, &uri_get);
//     }

//     while(1) {
//         vTaskDelay(1000 / portTICK_PERIOD_MS);
//     }
// }

// void app_main(void){
//     esp_mqtt_client_config_t mqtt_cfg = {
//         .broker.address.uri = "mqtt://mqtt.eclipse.org",
//         .credentials.authentication.password = MQTT_PASS,
//         .credentials.username = MQTT_USER,
//     };

//     client = esp_mqtt_client_init(&mqtt_cfg);
//     esp_mqtt_client_start(client);

//     xTaskCreate(&http_server_task, "http_server", 4096, NULL, 5, NULL);
// }