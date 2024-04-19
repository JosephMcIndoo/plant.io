#ifndef AUTOMATION_H
#define AUTOMATION_H
// typedef unsigned long u32_t;
typedef unsigned long value_t;
typedef unsigned char byte_t;
// #define value_t u32_t

static value_t Stack[32];
static int SP = 0;
#define PUSH(val) Stack[SP++]=val // TODO: ensure index safety
#define POP() Stack[--SP]

#define FP_COUNT 10

// static void (*actions[FP_COUNT])(void); // function pointers hadsoimoismdcoisdjfaosmcoisdf
// static int (*sensors[FP_COUNT])(void);
typedef struct {
    void* fn;
    int arity;
    int returns; // bool
} fn_meta;
static fn_meta fn_table[FP_COUNT];

// implement n-arity later
// #define MAX_ARGS 4;
// static uint32_t ArgBuf[4];
// static uint32_t RetVal;

// static void

static void no_op() {}
static int zero() {return 0;}
void blink(int times);
void blink5();

void function_pointer_init();
int hex_to_bytes(const char* hex_string, byte_t* bytes, int max_bytes);
void interpret(const byte_t* bytecode, int bc_length); // given a stream of bytes, attempt to interpret and execute
int read_15();

enum Opcode {
    OP_NONE =  '\0',
    OP_PUSH, // read next 4 bytes from input, push to stack
    OP_POP,
    OP_EXEC, // always push the return value. user can throw it away
    OP_EXECIF,
    // OP_GETFP, // obsolete // look up function pointer given index
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

#endif // AUTOMATION_H