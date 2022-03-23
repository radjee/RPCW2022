import re
import json

lista = []

id = 1

with open('./app/data.json', 'w') as f:
    f.write('''{
        "musicas": [\n''')

    with open('arq-son-EVO.json') as file:
        lines = file.readlines()

        for line in range(len(lines)-1):
            f.write(lines[line][:-2] + f', "id":"{id}"}},\n')
            id+=1

        f.write(lines[-1])

    f.write(''']}''')