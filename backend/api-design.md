# Microcontroller API
### Resources to expose:
- Sensor
    - unique id (unique among all other sensors connected to this microcontroller)
    - product number
    - short nickname
    - sensor type (moisture? light?)
    - sensor value metadata
        - return type
        - min/max value (perhaps?)
    - sensor value
- Actuator
    - unique id (unique among all other actuators connected to this microcontroller)
    - product number
    - short nickname
    - actuator type (pump? lamp?)
    - actuator state type (binary on/off? continuous?)
    - actuator state/value
- Automations [VERY SUBJECT TO CHANGE. DO NOT IMPLEMENT]
    - unique id
    - automation name
    - code of some kind (pure c code? add a layer of indirection/abstraction? could we use a small interpreted language to avoid the need to recompile whenever an automation is reloaded? However, we *can* apparently reflash the ESP32s over wifi)
- Microcontroller
    - unique id (unique among all microcontrollers)
    - product number
    - short nickname
    - List of sensors
    - List of actuators
    - List of automations

### Relevant URIs:
- Sensor
    - /sensors          
    - /sensors/{id}
    - /sensors/{id}/brief 
    - /sensors/brief    // (optional, may help us make fewer network requests. perhaps leave as enhancement)
- Actuator
    - /actuators
    - /actuators/{id}
    - /actuators/{id}/brief 
- Microcontroller
    - /microcontroller

# Backend API
### Resources to expose:
// - System                                   // can do this later. for now, assume just 1 system
//     - unique id
//     - list of microcontrollers
- Microcontroller
- Sensor
- Actuator


### Relevant URIs
- Microcontroller
    - /microcontrollers
    - /microcontrollers/{id}
- Sensor
    - /microcontrollers/{id}/sensors
    - /microcontrollers/{id}/sensors/{id}
- Actuator
    - /microcontrollers/{id}/actuators
    - /microcontrollers/{id}/actuators/{id}