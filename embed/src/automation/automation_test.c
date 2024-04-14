#include <string.h>
#include <stdio.h>
// #include "freertos/FreeRTOS.h"
// #include "freertos/task.h"
// #include "freertos/event_groups.h"
// #include "esp_system.h"
// #include "esp_wifi.h"
// #include "esp_event.h"
// #include "esp_log.h"
// #include "nvs_flash.h"
// #include "driver/gpio.h"
// #include "esp_adc_cal.h"

// #include "lwip/err.h"
// #include "lwip/sys.h"
// #include "hal/gpio_types.h"

// plantio libraries
#include "automation_test.h"

#include <stdlib.h>
#include <ctype.h>

// blinks led `count` many times
// requires that gpio stuff is all set up
void blink(int count) {
    printf("blinking %d", count);
    // for (int i=0; i<count; ++i) {
    //     gpio_set_level(GPIO_NUM_2, 1);
    //     vTaskDelay(125 / portTICK_PERIOD_MS);
    //     gpio_set_level(GPIO_NUM_2, 0);
    //     vTaskDelay(125 / portTICK_PERIOD_MS);
    // }
}
void blink5() {blink(5);}

int read_15() {
    // return gpio_get_level(GPIO_NUM_15);
    printf("reading 15");
    return 1;
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

void interpret(const char* bytecode, int bc_length) {
    char* curr = bytecode;
    char* end = bytecode + bc_length*sizeof(char);
    for (char* curr = bytecode; curr<end; curr++) {
        value arg1,arg2,arg3,arg4;
        switch (*curr) {
            case OP_NONE: break;
            case OP_PUSH:
                // big endian: int32_t val = ((int32_t*) curr); // TODO: endianness?
                // need to do it this way bc little endian
                value val = 0;
                for (int i=0; i<4; ++i) {
                    val <<= 8;
                    val += (value) *(++curr); // darn i hope this works
                }
                PUSH(val);
                break;
            case OP_POP: arg1 = POP(); break; // assignment to arg1 is soleley to appease compiler
            case OP_EXECIF:
                if (POP() == 0) {
                    fn_meta* meta = &fn_table[POP()]; // takes function as an index into the fn table
                    for (int i = 0; i < meta->arity; ++i) {
                        arg1 = POP(); // the atmosphere is nature's bin
                    }
                }; // otherwise flow down
            case OP_EXEC:
                fn_meta* meta = &fn_table[POP()];
                value ret = 0;
                if (meta->arity == 0) {
                    value (*fun)() = meta->fn;
                    ret = fun();
                } else if (meta->arity == 1) {
                    value (*fun)(value) = meta->fn; 
                    arg1 = POP();
                    ret = fun(arg1);
                } else if (meta->arity == 2) {
                    value (*fun)(value, value) = meta->fn;
                    arg2 = POP(); arg1 = POP();
                    ret = fun(arg1, arg2);
                } else if (meta->arity == 3) {
                    value (*fun)(value, value, value) = meta->fn;
                    arg3 = POP(); arg2 = POP(); arg1 = POP();
                    ret = fun(arg1, arg2, arg3);
                } else if (meta->arity == 4) {
                    value (*fun)(value, value, value, value) = meta->fn;
                    arg4 = POP(); arg3 = POP(); arg2 = POP(); arg1 = POP();
                    ret = fun(arg1, arg2, arg3, arg4);
                } // TODO: error handle if arity out of range?
                if (meta->returns) {
                    PUSH(ret);
                }
                break;
            case OP_LT:
                arg2 = POP(); arg1 = POP();
                PUSH(arg1 < arg2); // note: the 2nd pop is actually lhs
                break;
            case OP_EQ:
                arg2 = POP(); arg1 = POP();
                PUSH(arg1 == arg2);
                break;
            case OP_GT:
                arg2 = POP(); arg1 = POP();
                PUSH(arg1 > arg2);
                break;
            case OP_LEQ:
                arg2 = POP(); arg1 = POP();
                PUSH(arg1 <= arg2);
                break;
            case OP_NEQ:
                arg2 = POP(); arg1 = POP();
                PUSH(arg1 != arg2);
                break;
            case OP_GEQ:
                arg2 = POP(); arg1 = POP();
                PUSH(arg1 >= arg2);
                break;
            case OP_ADD:
                arg2 = POP(); arg1 = POP();
                PUSH(arg1 + arg2);
                break;
            case OP_SUB:
                arg2 = POP(); arg1 = POP();
                PUSH(arg1 - arg2);
                break;
            case OP_MULT:
                arg2 = POP(); arg1 = POP();
                PUSH(arg1 * arg2);
                break;
            case OP_DIV:
                arg2 = POP(); arg1 = POP();
                PUSH(arg1 / arg2);
                PUSH(arg1 % arg2);
                break;
        }
    }
}

// given hex string, transforms hex string into bytestring
// returns length of bytestring
int hex_to_bytes(const char* hex_string, char* bytes, int max_bytes) {
    int doub_len = strlen(hex_string);
    int len = doub_len / 2;
    if (doub_len % 2 == 1) return -1; // perhaps remove later for speed
    if (len > max_bytes) return -1;
    for (int i = 0; i < len; ++i) {
        char byte = 0;
        char h1 = hex_string[2*i];
        if (h1 >= 'a') {
            byte += h1-'a';
        } else if (h1 >= '0') {
            byte += h1-'0';
        } // TODO: could be more robust, or error more vocally
        byte <<= 4;
        char h2 = hex_string[2*i+1];
        if (h2 >= 'a') {
            byte += h1-'a';
        } else if (h2 >= '0') {
            byte += h2-'0';
        }
        bytes[i] = byte;
    }
    return len;
}

void function_pointer_init() {
    for (int i=0; i<FP_COUNT; ++i) {
        // fn_table[i] = {.fn = &no_op, .arity = 0, .returns = 0};
        fn_table[i].fn = &no_op;
        fn_table[i].arity = 0;
        fn_table[i].returns = 0;
    }
}