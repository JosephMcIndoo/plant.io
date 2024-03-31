#ifndef AUTOMATION_H
#define AUTOMATION_H
#define value u32_t

static value Stack[32];
static int SP = 0;
#define PUSH(val) Stack[SP++]=val // TODO: ensure index safety
#define POP() Stack[--SP]

#define FP_COUNT 10

static void (*actions[FP_COUNT])(void); // function pointers hadsoimoismdcoisdjfaosmcoisdf
static int (*sensors[FP_COUNT])(void);

// implement n-arity later
// #define MAX_ARGS 4;
// static u32_t ArgBuf[4];
// static u32_t RetVal;

// static void

void no_op() {}
int zero() {return 0;}
void blink(int times);
void blink5();

typedef struct {
    void* fn;
    u32_t arity;
    // u32_t returns; // bool
} fn_meta;

void function_pointer_init();

// given a stream of bytes, attempt to interpret and execute
void interpret(char* bytecode, int bc_length);
int read_15();

enum Opcode {
    OP_NONE =  '\0',
    OP_PUSH, // read next 4 bytes from input, push to stack
    OP_POP,
    OP_EXEC, // always push the return value. user can throw it away
    OP_EXECIF,
    OP_GETFP, // look up function pointer given index
    OP_LT,
    OP_EQ,
    OP_GT,
    OP_LEQ,
    OP_NEQ,
    OP_GEQ,
    OP_ADD,
    OP_SUB,
    OP_MULT,
    OP_DIV,
};

#endif