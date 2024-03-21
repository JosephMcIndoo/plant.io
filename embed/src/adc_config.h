#define DEFAULT_VREF    3300    // Default reference voltage of 1100 mV b/c ESP32's nominal value of internal voltage is 1.1V
#define ADC_WIDTH       ADC_WIDTH_BIT_10    // 10 bit res (width of each 'sip')
#define ADC_ATTEN       ADC_ATTEN_DB_0  // 0 attentuation (scales voltage level down to a range within limits of ADC)
#define ADC_CHANNEL     ADC1_CHANNEL_6 // Choose desired ADC channel to corresponding GPIO pin
#define ADC_UNIT        ADC_UNIT_1
#define NO_OF_SAMPLES 64 // n
#define SAMPLING_INTERVAL 1000 // ms
#define MAX_RAW 1023 