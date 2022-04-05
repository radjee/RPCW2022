from lark import Discard
from lark import Lark,Token
from lark.tree import pydot__tree_to_png
from lark.visitors import Interpreter

credito = 0

class MyInterpreter (Interpreter):

    def __init__(self):
        self.valor_total = 0  
        self.movesCredito = 0
        self.contasDebito = []
        self.datas = {}

    def start(self, tree):
        r = self.visit(tree.children[0])

        return self.valor_total, self.movesCredito, self.contasDebito, self.datas

    def transacoes(self, tree):
        for transacao in tree.children:
            if(transacao.data == 'movimentos'):
                r = self.visit(transacao)
        return self

    def movimentos(self, tree):
        for movimento in tree.children:
            if(movimento.data == 'move'):
                r = self.visit(movimento)
        return self

    def move(self, tree):
        for move in tree.children:
            credito = -1
            data = ""
            if(move.data == 'data'):
                r = self.visit(move)
                if(r):
                    data = r
            if(move.data == 'cntDestino'):
                r = self.visit(move)
                self.datas[data] = r
            if(move.data == 'sinal'):
                r = self.visit(move)
                credito = r
                if (credito == 1):
                    self.contasDebito.pop()
            if(move.data == 'quantia'):
                if (credito == 1):
                    self.valor_total += self.visit(move)
                else:
                    r = self.visit(move)
            if(move.data == 'cntOrdenante'):
                r = self.visit(move)
            if(move.data == 'descr'):
                r = self.visit(move)
        return self

    def data(self, tree):
        r = self.visit_children(tree)
        if(r[0].type == 'STR'):
            self.datas.append(r[0])
        return self

    def cntDestino(self, tree):
        r = self.visit_children(tree)
        if(r[0].type == 'ID'):
            self.contasDebito.append(r[0])
        return self

    def sinal(self, tree):
        r = self.visit_children(tree)
        if(r[0].type == 'CREDITO'):
            credito = 1
            self.movesCredito += 1
        elif(r[0].type == 'DEBITO'):
            credito = 0
        return credito

    def quantia(self, tree):
        r = self.visit_children(tree)
        if(r[0].type == 'NUM'):
            return int(r[0])

    def cntOrdenante(self, tree):
        r = self.visit_children(tree)
        if(r[0].type == 'ID'):
            return r[0]

    def descr(self, tree):
        r = self.visit_children(tree)
        if(r[0].type == 'STR'):
            return r[0]
    


grammar = '''
start: transacoes
transacoes: BTASK movimentos ETASK
movimentos: (move)+ "."
move: data ";" cntDestino ";" sinal ";" quantia ";" cntOrdenante ";" descr
cntDestino: ID
sinal: CREDITO | DEBITO
quantia: NUM
cntOrdenante: ID
descr: STR
data: STR
'''

frase = ""
p = Lark(grammar)
parse_tree = p.parse(frase)

data = MyInterpreter().visit(parse_tree)
print("")