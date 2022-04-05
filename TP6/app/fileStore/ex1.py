from lark import Discard
from lark import Lark,Token
from lark.tree import pydot__tree_to_png
from lark.visitors import Interpreter

class MyInterpreter (Interpreter):

    def __init__(self):
        self.ifs = 0
        self.vars = {}

    def start(self, tree):
        print("Entrei no start")
        print(tree.pretty())
        r = self.visit(tree.children[0])

        return self.ifs, self.vars
        

    def instrucoes(self, tree):
        print("Entrei nas instrucoes")

        for instrucao in tree.children:
            print("Cada instrucao")
            if (instrucao.data == 'instrucao'):
                r = self.visit(instrucao)
        return self

    def instrucao(self, tree):
        print("Entrei na instrucao")
        for ins in tree.children:
            print("Instrucao: ")
            if(ins.data == 'decl'):
                r = self.visit(ins)
            elif (ins.data == 'atrib'):
                r = self.visit(ins)
            elif (ins.data == 'myif'):
                r = self.visit(ins)
            elif (ins.data == 'ifelse'):
                r = self.visit(ins)
            elif (ins.data == 'myfor'):
                r = self.visit(ins)


    def decl(self, tree):
        print("Entrei na declaração")
        print(tree)
        r = self.visit_children(tree)

        # Add var to dictionary
        if len(r) == 3:
            self.vars[r[1]] = (r[0], r[2])
        else:
            self.vars[r[1]] = (r[0])


    def myif(self, tree):
        print("Entrei no if")

        for ins in tree.children:
            print(ins)

        r = self.visit_children(tree)

    def ifelse(self, tree):
        print("Entrei no ifelse")
        return self

    def conds(self, tree):
        print("Entrei nas conds")

    def cond(self, tree):
        print("Entrei na cond")

    def atribs(self, tree):
        print("Entrei nas atribs")
        return self

    def atrib(self, tree):
        print("Entrei na atrib")
        print(tree)
        r = self.visit_children(tree)


    def exp(self, tree):
        print("Entrei na exp")
        print(tree)
        r = self.visit_children(tree)

        print(r)
        if(r[0].type == 'REL'):
            return r[0]

        elif(r[0].type == 'ALFANUM'):
            return r[0].value

        elif(r[0].type == 'NUM'):
            return int(r[0].value)
        
    
    def int(self, tree):
        print("entrei int")
        pass

    def vir(self, tree):
        pass


grammar = '''
start: instrucoes
instrucoes: instrucao (instrucao)*
instrucao: (decl | atrib) ";"
    | myif
    | ifelse
    | myfor

decl: INT ALFANUM
    | INT ALFANUM "=" exp

atribs: atrib (VIR atrib)*
atrib: ALFANUM "=" exp

exp: exp REL exp
    | ALFANUM
    | NUM

myif: IF "(" exp ")" "{" instrucoes "}"
ifelse: IF "(" exp ")" "{" instrucoes "}" "else" "{" instrucoes "}"
myfor: "for" "(" atribs ";" exp ";" atribs ")" "{" instrucoes "}"

REL: /(==)|(!=)|(>=)|(<=)|[+-<>\/*=%]/
OR: "||"
AND: "&&"
ALFANUM: ("a".."z")/\w*/
NUM: "0".."9"+
INT: "int"
VIR: ","
IF: "if"

%import common.WS
%ignore WS
'''

frase1 = '''
int x = 5;
int i;
'''

frase2 = '''
x = 5;
'''

frase2_1 = '''
if (x <= 5){
    x = 10;
}
'''

frase3 = '''
int x = 5;
int i;

if (x <= 5){
    x = 10;
    if(z > 5){
        i = 10;
    }
}
'''

frase4 = '''
int x = 5;
int i;

if (x <= 5){
    x = 10;
    if(z > 5){
        i = 10;
    }
}

for(i = 0 ; i < x; i = i + 1){
    if(i < 10){
        x = x - 1;
    }
}
'''

p = Lark(grammar)
parse_tree = p.parse(frase2_1)

data = MyInterpreter().visit(parse_tree)
print(data)