#ifndef AUTOMATION_H
#define AUTOMATION_H

static int Stack[32];
static int SP = 0;
#define PUSH(val) Stack[SP++]=val // TODO: ensure index safety
#define POP() Stack[--SP]

#define FP_COUNT 10

static void (*actions[FP_COUNT])(void); // function pointers hadsoimoismdcoisdjfaosmcoisdf
static int (*sensors[FP_COUNT])(void);

void no_op() {}
int zero() {return 0;}
void blink(int times);
void blink5();

void function_pointer_init();
void interpret(char bytecode[], int bc_length);
int read_15();

#endif