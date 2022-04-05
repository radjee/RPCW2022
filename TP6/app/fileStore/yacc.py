# 0 -> Falso | 1 -> Verdadeiro
#
# Intrucoes -> Instrucoes Instrucao
#           | €
#
# Instrucao -> Decl ';'
#           | Atrib ';'
#           | PRINT '(' Exp ')' ';'
#           | PRINT '(' str ')' ';'
#           | Read ';'
#           | IF '(' Exp ')' '{' Instrucoes '}'
#           | IF '(' Exp ')' '{' Instrucoes '}' ELSE '{' Instrucoes '}'
#           | FOR '(' Atribs ';' Exp ';' Atribs ')' '{' Instrucoes '}'
#
#
# Decl -> INT alfanum
#      | INT alfanum '=' Exp 
#      | INT alfanum '[' num ']'
#      | INT alfanum '[' num ']' '[' num ']'
#
#
# Atribs -> Atribs ',' Atrib
#        | Atrib
#
# Atrib -> alfanum '=' Exp 
#       | alfanum '[' Exp ']' '=' Exp 
#       | alfanum '[' Exp ']' '[' Exp ']' '=' Exp 
#
# Read -> READ alfanum
#       | READ alfanum '[' Exp ']'
#       | READ alfanum '[' Exp ']' '[' Exp ']'
#
# Precedence estabelece a ordem pela qual as operações vão ser executadas
#
# a+b - (a*b) -> OR
# a*b -> AND
#
# Exp -> Exp OR Exp
#      | Exp AND Exp
#      | Exp '+' Exp
#      | Exp '-' Exp
#      | Exp '*' Exp
#      | Exp '/' Exp
#      | Exp '%' Exp
#      | Exp '<' Exp
#      | Exp '>' Exp
#      | Exp EQ Exp
#      | Exp NEQ Exp
#      | Exp LE Exp
#      | Exp GE Exp
#      | '!' alfanum
#      | alfanum '[' Exp ']' '[' Exp ']'
#      | alfanum '[' Exp ']'
#      | alfanum
#      | num
#

import sys
import ply.yacc as yacc
from lex import tokens, literals

precedence = (
    ('left', 'OR'),
    ('left', 'AND'),
    ('left', '!'),
    ('left', '<', '>', 'EQ', 'NEQ', 'GE', 'LE'),
    ('left', '+', '-'),
    ('left', '*', '/', '%'),
)

# Instrucões definitions
def p_instrucoes(p):
    "Instrucoes : Instrucoes Instrucao"
    if p[1]:
        p[0] = p[1] + p[2]
    else:
        p[0] = p[2]

# Caso de paragem
def p_instrucoesV(p):
    "Instrucoes : "
    p[0] = ""


# Instrucao definitions

# Declaraçoes
def p_instrucao_decl(p):
    "Instrucao : Decl ';'"
    p[0] = p[1]

# Declaração de um inteiro
def p_decl(p):
    "Decl : INT alfanum"
    if p[2] not in p.parser.registers:
        p[0] = "PUSHI 0\n"
        p.parser.registers[p[2]] = p.parser.index
        p.parser.index += 1

# Declaração de um inteiro com valor
def p_declValor(p):
    "Decl : INT alfanum '=' Exp"
    if p[2] not in p.parser.registers:
        p[0] = p[4]
        p.parser.registers[p[2]] = p.parser.index
        p.parser.index += 1

# Declaração de um array
def p_array(p):
    "Decl : INT alfanum '[' num ']'"
    if p[2] not in p.parser.registers:
        p[0] = f"PUSHN {p[4]}\n"
        # ir à stack buscar o valor de p[4]
        p.parser.registers[p[2]] = p.parser.index
        p.parser.index += p[4]

# Declaração de um array de 2 dimensões
def p_array2d(p):
    "Decl : INT alfanum '[' num ']' '[' num ']'"
    if p[2] not in p.parser.registers:
        p[0] = f"PUSHN {p[4] * p[7]}\n"
        p.parser.registers[p[2]] = p.parser.index
        p.parser.index += p[4] * p[7]

#Atribuições
def p_instrucao_atrib(p):
    "Instrucao : Atrib ';'"
    p[0] = p[1]

def p_instrucao_atribs(p):
    "Atribs : Atribs ',' Atrib"
    p[0] = p[1] + \
           p[3]

def p_instrucao_atribV(p):
    "Atribs : Atrib"
    p[0] = p[1]

# Associação de variavel -> Exp
def p_assoc(p):
    "Atrib : alfanum '=' Exp"
    p[0] = p[3] + \
        f"STOREL {p.parser.registers[p[1]]}\n"

# Associação de posArray -> Exp
def p_assocA(p):
    "Atrib : alfanum '[' Exp ']' '=' Exp"
    
    # Offset do inicio do array
    offset = p.parser.registers.get(p[1])

    p[0] = "PUSHFP\n" + \
           f"PUSHI {offset}\n" + \
           "PADD\n" + \
           p[3] + \
           p[6] + \
           "STOREN\n"

def p_assocA2D(p):
    "Atrib : alfanum '[' Exp ']' '[' Exp ']' '=' Exp"
    
    # Offset do inicio do array
    offset = p.parser.registers.get(p[1])

    p[0] = "PUSHFP\n" + \
           f"PUSHI {offset}\n" + \
           "PADD\n" + \
           p[3] + \
           p[6] + \
           "MUL\n" + \
           p[6] + \
           "ADD\n" + \
           p[9] + \
           "STOREN\n"


# Leituras
def p_instrucao_read(p):
    "Instrucao : Read ';'"
    p[0] = p[1]

# Leitura de input e guardar numa variável
def p_readVar(p):
    "Read : READ alfanum"
    p[0] = "READ\n" + \
           "ATOI\n" + \
           f"STOREL {p.parser.registers[p[2]]}\n"

def p_readA(p):
    "Read : READ alfanum '[' Exp ']'"
    
    # Offset do inicio do array
    offset = p.parser.registers.get(p[2])

    p[0] = "PUSHFP\n" + \
           f"PUSHI {offset}\n" + \
           "PADD\n" + \
           p[4] + \
           "READ\n" + \
           "ATOI\n" + \
           "STOREN\n"

def p_readA2D(p):
    "Read : READ alfanum '[' Exp ']' '[' Exp ']'"
    
    # Offset do inicio do array
    offset = p.parser.registers.get(p[1])

    p[0] = "PUSHFP\n" + \
           f"PUSHI {offset}\n" + \
           "PADD\n" + \
           p[4] + \
           p[7] + \
           "MUL\n" + \
           p[7] + \
           "ADD\n" + \
           "READ\n" + \
           "ATOI\n" + \
           "STOREN\n"

# Print
def p_print(p):
    "Instrucao : PRINT '(' Exp ')' ';'"
    p[0] = p[3] + \
        "WRITEI\n"

def p_printStr(p):
    "Instrucao : PRINT '(' str ')' ';'"
    p[0] = f"PUSHS {p[3]}\n" + \
        "WRITES\n"

# if
def p_if(p):
    "Instrucao : IF '(' Exp ')' '{' Instrucoes '}'"
    label = newlabelfim(p)
    p[0] = p[3] + \
        f"JZ {label}" + "\n" + \
        p[6] + \
        f"{label}:\n"

# if else
def p_ifelse(p):
    "Instrucao : IF '(' Exp ')' '{' Instrucoes '}' ELSE '{' Instrucoes '}'"
    elselabel = newlabelelse(p)
    endlabel = newlabelfim(p)
    p[0] = p[3] + \
        f"JZ {elselabel}" + "\n" + \
        p[6] + \
        f"JUMP {endlabel}" + "\n" + \
        f"{elselabel}:" + "\n" + \
        p[10] + \
        f"{endlabel}:\n"


# for
def p_for(p):            # 1       exp       2               body
    "Instrucao : FOR '(' Atribs ';' Exp ';' Atribs ')' '{' Instrucoes '}'"

    # Declaração de inicial de i -> 1
    looplabel = newlabelfor(p)
    endlabel = newlabelfim(p)
    p[0] = p[3] + \
           f"{looplabel}:\n" + \
           p[5] + \
           f"JZ {endlabel}\n" + \
           p[10] + \
           p[7] + \
           f"JUMP {looplabel}\n" + \
           f"{endlabel}:\n"

# Exp Definitions
def p_Exp_And(p):
    "Exp : Exp AND Exp"
    p[0] = p[1] + \
           p[3] + \
           "MUL\n"

def p_Exp_Or(p):
    "Exp : Exp OR Exp"
    p[0] = p[1] + \
           p[3] + \
           "ADD\n" + \
           p[1] + \
           p[3] + \
           "MUL\n" + \
           "SUB\n"

def p_Exp_add(p):
    "Exp : Exp '+' Exp"
    p[0] = p[1] + \
        p[3] + \
        "ADD\n"

def p_Exp_sub(p):
    "Exp : Exp '-' Exp"
    p[0] = p[1] + \
        p[3] + \
        "SUB\n"


def p_Exp_mul(p):
    "Exp : Exp '*' Exp"
    p[0] = p[1] + \
        p[3] + \
        "MUL\n"


def p_Exp_div(p):
    "Exp : Exp '/' Exp"
    if p[3] != 0:
        p[0] = p[1] + \
            p[3] + \
            "DIV\n"


def p_Exp_mod(p):
    "Exp : Exp '%' Exp"
    p[0] = p[1] + \
        p[3] + \
        "MOD\n"


def p_Exp_menor(p):
    "Exp : Exp '<' Exp"
    p[0] = p[1] + \
        p[3] + \
        "INF\n"


def p_Exp_maior(p):
    "Exp : Exp '>' Exp"
    p[0] = p[1] + \
        p[3] + \
        "SUP\n"


def p_Exp_equal(p):
    "Exp : Exp EQ Exp"
    p[0] = p[1] + \
        p[3] + \
        "EQUAL\n"


def p_Exp_nequal(p):
    "Exp : Exp NEQ Exp"
    p[0] = p[1] + \
        p[3] + \
        "EQUAL\n" + \
        "NOT\n"

def p_Exp_lequal(p):
    "Exp : Exp LE Exp"
    p[0] = p[1] + \
        p[3] + \
        "INFEQ\n"


def p_Exp_gequal(p):
    "Exp : Exp GE Exp"
    p[0] = p[1] + \
        p[3] + \
        "SUPEQ\n"

def p_Exp_Not(p):
    "Exp : '!' alfanum"
    p[0] = f"PUSHL {p.parser.registers[p[2]]}\n" + \
           f"PUSHI 0\n" + \
           f"EQUAL\n"

# Valor de uma posiçao de um array de 2D
def p_Exp_alfanum2D(p):
    "Exp : alfanum '[' Exp ']' '[' Exp ']'"
    offset = p.parser.registers.get(p[1])
    p[0] = "PUSHFP\n" + \
           f"PUSHI {offset}\n" + \
           "PADD\n" + \
           p[3] + \
           p[6] + \
           "MUL\n" + \
           p[6] + \
           "ADD\n" + \
           "LOADN\n"

# Valor de uma posiçao de um array
def p_Exp_alfanumA(p):
    "Exp : alfanum '[' Exp ']'"
    offset = p.parser.registers.get(p[1])
    p[0] = "PUSHFP\n" + \
           f"PUSHI {offset}\n" + \
           "PADD\n" + \
           p[3] + \
           "LOADN\n"

# Valor dentro de uma variavel
def p_Exp_alfanum(p):
    "Exp : alfanum"
    p[0] = f"PUSHL {p.parser.registers[p[1]]}\n"


def p_Exp_num(p):
    "Exp : num"
    p[0] = f"PUSHI {p[1]}\n"

# Error
def p_error(p):
    print("Syntax error in input : ", p)


def newlabelfim(p):
    p.parser.labelindexfim += 1
    return f"fim{p.parser.labelindexfim}"

def newlabelelse(p):
    p.parser.labelindexelse += 1
    return f"else{p.parser.labelindexelse}"

def newlabelfor(p):
    p.parser.labelindexfor += 1
    return f"for{p.parser.labelindexfor}"


# build the parser
parser = yacc.yacc()

# Index
parser.index = 0

# label index
parser.labelindexfim = 0
parser.labelindexelse = 0
parser.labelindexfor = 0

# Dicionario -> i -> fp[x] -> i:x
parser.registers = {}

# reading input
result = ""

for linha in sys.stdin:
    result = result + linha

output = parser.parse(result)  
print(output)