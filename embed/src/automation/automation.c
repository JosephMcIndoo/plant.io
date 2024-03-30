#include "automation.h"

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

#include "lwip/err.h"
#include "lwip/sys.h"
#include "hal/gpio_types.h"

#include <stdlib.h>
#include <ctype.h>

// blinks led `count` many times
// requires that gpio stuff is all set up
void blink(int count) {
    for (int i=0; i<count; ++i) {
        gpio_set_level(GPIO_NUM_2, 1);
        vTaskDelay(125 / portTICK_PERIOD_MS);
        gpio_set_level(GPIO_NUM_2, 0);
        vTaskDelay(125 / portTICK_PERIOD_MS);
    }
}
void blink5() {blink(5);}

int read_15() {
    return gpio_get_level(GPIO_NUM_15);
}


// i: if
// s: sensor
// a: action
// c: comparator (assumes int)
    // c<, c>, c<=, c>=, c=
// v: value (an int)
    // 
// e: end
// () parens
//  : null/empty/ignore

// VERY SCUFFED
void interpret(char bytecode[], int bc_len) {
    SP = 0;
    // "i c= s1 v1 a1" // prefix-order
    // bytecode = "a0 s0 v1 c= i "; // stack-based/reverse polish notation
    for (int i=0; i<bc_len; ++i) {
        switch (bytecode[i]) {
            case 'a': // push action to stack
               int action_num = bytecode[++i]-'0'; // TODO: decode this better in the future
               PUSH(actions[action_num]); // note: function pointer is also 32-bit, so we can push to stack

            break;
            case 's': // push sensor reading to stack
                int sensor_num = bytecode[++i]-'0';
                PUSH(sensors[sensor_num]());

            break;
            case 'v': // push value (0-9) to stack (TODO: extend)
                int value = bytecode[++i]-'0';
                PUSH(value);

            break;
            case 'c': // for time being, just assume comparison is ==
                char comparator = bytecode[++i];
                int rhs = POP();
                int lhs = POP();
                switch (comparator) {
                    case '=':
                        PUSH(lhs == rhs);
                    break;
                    default:
                        PUSH(-1);
                }

            break;
            case 'i': // if condition then response
                int condition = POP();
                void (*response)(void) = (void*) POP();
                if (condition) {
                    response();
                }

            break;
        }
    }
}

// void parse_int(char* s, int left)

void function_pointer_init() {
    for (int i=0; i<FP_COUNT; ++i) {
        actions[i] = &no_op;
        sensors[i] = &zero;
    }
}