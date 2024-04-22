# Welcome to Ember
**Ember** is the small intepreted stack-based language that [I'm](https://github.com/superstealthysheep) writing for plant.io. It's fairly new still, so I may make some breaking changes in the future, but this is how it works for the time being.

You supply Ember with a table of "hardware driver" functions (written in C) and an array of Ember bytecode ("charcode"), and together this specifies an Ember program.

To explain Ember, I'll walk you through it running the following short script.

Here is pseudocode of the script:
```python
pin_15_value = read_pin_15()
if pin_15_value == 0:
    blink_led(10)
```

As I've written it out in Ember, we run this as
```c
// Load driver functions (more on this later)
fn_table[0] = (fn_meta){.fn = &blink5, .arity = 0, .returns = 0};
fn_table[1] = (fn_meta){.fn = &read_15, .arity = 0, .returns = 1};
fn_table[2] = (fn_meta){.fn = &blink, .arity = 1, .returns = 0};

// specify script as string
char* hexcode =
"010000000a" // OP_PUSH 10
"0100000002" // OP_PUSH 2 // blink(int)
"0100000001" // OP_PUSH 1
"0100000001" // OP_PUSH 1 // read_15()
"03"         // OP_EXEC
"0c"         // OP_SUB
"04";        // OP_EXECIF

// preprocess script
int bc_length = hex_to_bytes(hexcode, bytes, 64); 

// run!
interpret(bytes, bc_length);
```

### Notes on representing binary code
Ember digests arrays of bytes. It is annoying, however, to type arrays of raw bytes: 
```c
byte_t annoying_bytecode[] = {0x01, 0x00, 0x00, 0x00, 0x0a}; // PUSH 10
```
so I have provided a utility function for current developers/tinkerers:
```c
int hex_to_bytes(char* hexcode, byte_t* bytes, int max_bytes)
```

`hex_to_bytes()` takes a string of hexadecimal characters (`0`-`f`), two characters at a time, and converts it into binary bytecode, which it writes into the array specified by the output parameter `bytes`. It writes no more than `max_bytes` bytes into `bytes`. Finally, it returns the number of bytes it converted. For example, we can remake `annoying_bytecode` using a friendly ASCII string like so:
```c
byte_t less_annoying_bytecode[5];
hex_to_bytes("010000000a", less_annoying_bytecode, 5);
```

### The stack and the `OP_PUSH` operation
In Ember, there are no variables. All of the data generated during the running of a script is stored on the **stack** as 4-byte values.
```
Stack
-
```

We can push values to the stack with the `OP_PUSH` operation, which has the opcode `0x01`. In our script, the `OP_PUSH` operation pushes the following 4 bytes of bytecode onto the stack. For instance, after running the lines
```c
"010000000a" // OP_PUSH 10
"0100000002" // OP_PUSH 2 // blink(int)
"0100000001" // OP_PUSH 1
"0100000001" // OP_PUSH 1 // read_15()
```
The stack looks like
```
Stack
10
2
1
1
-
```

(Additional note: there is a `OP_POP` operation (opcode `0x02`) that discards items from the stack, but we have no need for it at the moment.)

### The `OP_EXEC` operation
Using the `OP_EXEC` operation, we can call C functions from within Ember. For our purposes, this is useful because it allows us to read from sensors or trigger actuators.

For instance, the driver function `void blink(int count)` blinks the LED on the ESP32 `count` times. Another example is `int read_15()`, which returns the current state of GPIO pin 15 (`1` if it's high, `0` if it's low).

In Ember, we refer to these driver functions by number using the array `fn_table`. Before running the script, we assign each function a slot in the table. We also specify how many arguments the function takes and whether it returns a value:
```c
// Load driver functions
fn_table[0] = (fn_meta){.fn = &blink5, .arity = 0, .returns = 0};
fn_table[1] = (fn_meta){.fn = &read_15, .arity = 0, .returns = 1};
fn_table[2] = (fn_meta){.fn = &blink, .arity = 1, .returns = 0};
```

What does the `OP_EXEC` operator do?
1. The `OP_EXEC` operator first pops a number off the stack. This number determines what function is to be executed. 
2. It then pops values off the stack to fill the arguments of the function (in reverse order). 
3. It executes the C function
4. If the function returns a value, the return value is pushed to the stack

Returning to our example, recall that our stack looks like
```
Stack
10
2
1
1
-
```

When the following instruction is executed, 
```c
"03"         // OP_EXEC
```
1. The `1` is popped off the stack, which according to `fn_table` means that the function is `int read_15()`.
```
Stack
10
2
1
-
```
2. `read_15()` takes no arguments, so nothing more is popped off the stack.
3. `read_15()` is run, and let's say it returns a `0` (the pin is low).
4. Since `read_15()` returns a value, it is pushed onto the stack:
```
Stack
10
2
1
0
-
```

### Arithmetic operations
Ember natively supports a few arithmetic and logical operations, such as addition, subtraction, multiplication, division, and comparisons. They interact with the stack in the exact same way as ordinary functions.

\[Perhaps do some more explaining]

In our example, we use the `OP_SUB` operation, which has opcode `0x0c`.
```
Stack
10
2
1
0
-
```
```c
"0c"         // OP_SUB
```
This pops the values `0` and `1` off the stack. (Note: *right hand value is popped off first, then left hand value*.)
```
Stack
10
2
-
```
Then the result of `1-0` is pushed to the stack.
```
Stack
10
2
1
-
```

For the time being, all arithmetic operations assume unsigned 4-bit integers. It is not difficult, however, to add operations to support signed operations or operations on floating point numbers if the need presents itself.

### Conditional execution with the `OP_EXECIF` operation
The `OP_EXECIF` operation behaves almost exactly the same as `OP_EXEC`. The only difference is that before execing, it pops an extra value of the stack. If the value is nonzero, it proceeds with execing as normal. If the value is `0`, the function is not executed, and all the function's arguments are cleared away from the stack. 

Let's see an example! We left off with the stack like:
```
Stack
10
2
1
-
```
When we run the line
```c
"04";        // OP_EXECIF
```
0. Pop the `1` off the stack. Since it's nonzero, proceed.
```
Stack
10
2
-
```
1. Pop the `2` off the stack, which indicates the function `void blink(int count)`
```
Stack
10
-
```
2. Pop the `10` off the stack to fill the `count` argument
```
Stack
-
```
3. Call `blink(10)`. The LED flashes 10 times!
4. Since `blink(int count)` doesn't return, nothing more is pushed onto the stack.
```
Stack
-
```

This behavior is exactly the same as `OP_EXEC`. For a more interesting example, consider if the stack looked like this.
```
Stack
10
2
0
-
```
When we run the line
```c
"04";        // OP_EXECIF
```
0. Pop the `0` off the stack. Since it's nonzero, this means the function won't be executed.
```
Stack
10
2
-
```
1. Pop the `2` off the stack, which indicates the function `void blink(int count)`
```
Stack
10
-
```
2. Pop the `10` off the stack since it would fill the `count` argument
```
Stack
-
```
3. DO NOT call `blink(10)`. The LED remains dark.
4. Nothing was called, so nothing more is pushed to the stack
```
Stack
-
```

### Congratulations!
This concludes my introduction to Ember. To see the full list of opcodes, look in `embed/include/automation.h`. Otherwise feel free to poke around in `embed/src/automation/automation.c` if you want to see how this is implemented. 

The script demonstrated here is currently (at time of writing) residing in `embed/src/main.c`, so if you flash it to your ESP32, you should be able to watch it run. To lower pin 15 and trigger the blinking light, use a piece of metal to bridge pins `D15` and `GND`. (I chose pin 15 so that it'd be easy to bridge to ground even without wire/any fancy tools.)

### Extra: additional discussion of driver functions
- Types

The Ember stack holds 4 bytes of arbitrary binary values. Behind the scenes, the values are manipulated as 4-byte unsigned ints, but this should pose no issue if your function's arguments/return types fit within 4 bytes.

- Arity

Presently, the Ember interpreter only supports functions with up to 4 arguments. This is not due to technical limitations, but it's just because adding different arities requires some (afaik unavoidable) copy/paste programming. 4 is reasonable for now, but if it turns out we need more arguments, the update is trivial to make.