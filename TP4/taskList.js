var http = require('http')
var axios = require('axios')
var static = require('./static.js')

var { parse } = require('querystring')

// Funções auxiliares
function recuperaInfo(request, callback) {
    dat = new Date().toISOString().substring(0, 10)

    if (request.headers['content-type'] == 'application/x-www-form-urlencoded') {
        let body = ''
        request.on('data', bloco => {
            body += bloco.toString()
        })

        request.on('end', () => {
            console.log(body)
            body += "&data_post=" + dat
            body += "&type=porfazer"
            callback(parse(body))
        })
    }
}

function recuperaID(request, callback) {
    dat = new Date().toISOString().substring(0, 16)

    if (request.headers['content-type'] == 'application/x-www-form-urlencoded') {
        let body = ''
        request.on('data', bloco => {
            body += bloco.toString()
        })

        request.on('end', () => {
            console.log(body)
            callback(parse(body))
        })
    }
}


function callMainPage(res) {
    const req1 = axios.get("http://localhost:3000/tarefas?type=realizada")
    const req2 = axios.get("http://localhost:3000/tarefas?type=porfazer")

    axios.all([req1, req2])
        .then(axios.spread((...responses) => {

            const tf = responses[0];
            const tpf = responses[1];

            tasksF = tf.data;
            tasksPF = tpf.data;

            // Add code to render page with the student's list
            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
            res.write(geraMainPage(tasksF, tasksPF))
            res.end()
        }))

        .catch(function (erro) {
            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
            res.write("<p>Não foi possível obter a lista de tarefas...")
            res.end()
        })
}

function postForm(req, res){
    recuperaInfo(req, resultado => {
        console.log(resultado)
        console.log('POST de tarefa:' + JSON.stringify(resultado))
        axios.post('http://localhost:3000/tarefas', resultado)
            .then(resp => {
                callMainPage(res);
            })
            .catch(error => {
                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                res.write("<p>Erro no Post</p>")
                res.write('<p><a href="/tarefas">Voltar</a></p>')
                res.end()
            })
    })
}

function postDone(req, res){
    recuperaID(req, resultado => {
        console.log(resultado)
        console.log('POST de tarefa:' + JSON.stringify(resultado))

        id = resultado["id"];

        myurl = 'http://localhost:3000/tarefas/' + id

        axios.get(myurl)
            .then(function (resp) {
                task = resp.data;
                console.log(task);

                task.type = "realizada";

                axios.put(myurl, task)
                    .then(resp => {
                        callMainPage(res);
                    })
                    .catch(error => {
                        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                        res.write("<p>Erro no Post</p>")
                        res.write('<p><a href="/tarefas">Voltar</a></p>')
                        res.end()
                    })
            })
            .catch(error => {
                console.log(error);
            });
    })
}

function postDelete(req, res){
    recuperaID(req, resultado => {
        console.log(resultado)
        console.log('POST de tarefa:' + JSON.stringify(resultado))

        id = resultado["id"];

        myurl = 'http://localhost:3000/tarefas/' + id

        axios.delete(myurl, {})
            .then((resp) => {
                callMainPage(res);
            }).catch(error => {
                console.log(error);
            });
    })
}

function postEdit(req, res){
    recuperaID(req, resultado => {
        console.log(resultado)
        console.log('POST de tarefa:' + JSON.stringify(resultado))

        id = resultado["id"];

        myurl = 'http://localhost:3000/tarefas/' + id

        axios.get(myurl)
            .then(function (resp) {
                task = resp.data;
                console.log(task);

                task.type = "realizada";

                axios.put(myurl, task)
                    .then(resp => {
                        callMainPage(res);
                    })
                    .catch(error => {
                        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                        res.write("<p>Erro no Post</p>")
                        res.write('<p><a href="/tarefas">Voltar</a></p>')
                        res.end()
                    })
            })
            .catch(error => {
                console.log(error);
            });
    })
}

// Template para a página com a lista de alunos ------------------
function geraMainPage(tasksF, tasksPF) {
    console.log("entrei Main Page")

    let pagHTML = `
    <!DOCTYPE html>
    <html>

    <head>
        <title>Task List</title>
        <meta charset="utf-8" />
        <link rel="icon" href="favicon.png" />
        <link rel="stylesheet" href="w3.css" />
        <style>
            * {
                box-sizing: border-box;
            }

            table {
                font-family: arial, sans-serif;
                border-collapse: collapse;
                width: 100%;
            }
            
            td, th {
              border: 1px solid #dddddd;
              text-align: left;
              padding: 8px;
            }
            
            tr:nth-child(even) {
              background-color: #dddddd;
            }

            input[type=text],
            select,
            textarea {
                width: 100%;
                padding: 12px;
                border: 1px solid #ccc;
                border-radius: 4px;
                resize: vertical;
            }

            textarea {
                min-height: 270px;
            }

            label {
                padding: 12px 12px 12px 0;
                display: inline-block;
            }

            input[type=submit] {
                background-color: #04AA6D;
                color: white;
                padding: 12px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                float: right;
            }

            input[type=submit]:hover {
                background-color: #45a049;
            }

            .container {
                border-radius: 5px;
                background-color: #f2f2f2;
                padding: 20px;
            }

            .ator {
                float: left;
                width: 100%;
            }

            .data {
                float: left;
                width: 100%;
            }

            .tasks {
                width: 100%;
                padding: 5px;
                border: 1px solid #ccc;
                background-color: white;
                border-radius: 4px;
                min-height: 20px;
            }

            .item {
                display: flex;
                justify-content: space-between; 
                margin: -3px;
                padding: 2px;
                align-items: center;
            }

            .flex-container {
                display: flex;
                flex-direction: column;

            }

            .main_panel {
                float: left;
                width: 70%;
                margin-top: 6px;
            }

            .side_panel {
                float: right;
                width: 30%;
                height: 200px;
                margin-top: 6px;
            }

            .div_central {
                width: 49.5%;
                min-height: 200px;
                margin-top: 6px;
            }

            .row:before {
                content: "";
                display: table;
                clear: both;
            }

            .row:after {
                content: "";
                display: table;
                clear: both;
            }

        </style>
    </head>

    <body>
        <div class="container">
            <form action="/" method="POST">
                <div class="main_panel">
                    <textarea id="description" name="description" placeholder="Descrição da tarefa..."
                        style="height:270px; width:95%" required="true"></textarea>

                </div>
                <div class="side_panel">
                    <p>Tipo da tarefa </p>
                    <div>
                        <select id="categoria" name="categoria" required="true">
                            <option value="" selected disabled hidden>Selecione uma das opções</option>
                            <option value="universidade">Universidade</option>
                            <option value="doméstico">Doméstico</option>
                            <option value="hobby">Hobby</option>
                            <option value="side project">Side Project</option>
                        </select>
                    </div>

                    <p>Pessoa a cumprir a tarefa </p>
                    <div class="ator">
                        <input type="text" id="ator" name="ator" required="true" placeholder="Nome da pessoa..."
                            required="true"></input>
                    </div>

                    <div class="data">
                        <p>Data Limite</p>
                        <input type="date" id="data_limite" name="data_limite" required="true" />
                    </div>
                </div>

                <div class="row">
                    <input type="submit" value="Registar" />
                </div>
            </form>
        </div>

        <div>

            <div class="div_central" style="float:left">
                <p style="text-align:center">Tarefas Por Fazer</p>
                <div class="container">
                    <div class="tasks" id="tasks">
                    <table>
                        <colgroup>
                            <col span="1" style="width: 20%;">
                            <col span="1" style="width: 8%;">
                            <col span="1" style="width: 8%;">
                            <col span="1" style="width: 10%;">
                            <col span="1" style="width: 10%;">
                        </colgroup>
                        
                        <tbody>
                            <tr>
                                <th style="text-align:center">Descrição</th>
                                <th style="text-align:center">Categoria</th>
                                <th style="text-align:center">Ator</th>
                                <th style="text-align:center">Data Limite</th>
                                <th></th>
                            </tr>
        `

    tasksPF.forEach(t => {
        pagHTML += `
                <div class="item" id="${t.id}">

                    <tr style="height:50px">
                        <td>${t.description}</td>
                        <td style="text-align:center">${t.categoria}</td>
                        <td style="text-align:center">${t.ator}</td>
                        <td style="text-align:center">${t.data_limite}</td>
                    
                        <td style="text-align:right">
                            <div>
                                <form action="/tarefas/edit" method="POST" style="display:inline-block">
                                    <input type="hidden" name="id" value="${t.id}"/>
                                    <button type="submit" style="height: 40px; border-radius:70%; outline: none"> 
                                        <img src="edit.png" style="width:100%; float:center; text-align: center" />
                                    </button>
                                </form>
                                <form action="/tarefas/delete" method="POST" style="display:inline-block">
                                    <input type="hidden" name="id" value="${t.id}"/>
                                    <button type="submit" style="height: 40px; border-radius:70%; outline: none"> 
                                        <img src="trash.png" style="width:100%; float:center; text-align: center" />
                                    </button>
                                </form>
                                <form action="/tarefas/completa" method="POST" style="display:inline-block">
                                    <input type="hidden" name="id" value="${t.id}"/>
                                    <button type="submit" style="height: 40px; border-radius:70%; outline: none"> 
                                        <img src="checkmark.png" style="width:100%; float:center; text-align: center" />
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                </div>
            `
    });

    pagHTML += `            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="div_central" style="float:right">
                <p style="text-align:center">Tarefas Feitas</p>
                <div class="container">
                    <div class="tasks" id="tasksF">
                        <table>
                            <colgroup>
                                <col span="1" style="width: 25%;">
                                <col span="1" style="width: 8%;">
                                <col span="1" style="width: 8%;">
                                <col span="1" style="width: 10%;">
                                <col span="1" style="width: 5%;">
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th style="text-align:center">Descrição</th>
                                    <th style="text-align:center">Categoria</th>
                                    <th style="text-align:center">Ator</th>
                                    <th style="text-align:center">Data Limite</th>
                                    <th></th>
                                </tr>
                            
                        
    `

    tasksF.forEach(t => {
        console.log(t)
        pagHTML += `
            <div class="item" id=${t.id}>
                <tr style="height:50px">
                    <td style="width:5%">${t.description}</td>
                    <td style="width:10%;text-align:center">${t.categoria}</td>
                    <td style="width:1%;text-align:center">${t.ator}</td>
                    <td style="width:5%;text-align:center">${t.data_limite}</td>
                
                    <td style="text-align:right; width: 5%">
                        <div style="float:right;">
                            <form action="/tarefas/delete" method="POST" style="display:inline-block">
                                <input type="hidden" name="id" value="${t.id}"/>
                                <button style="height: 40px; border-radius:70%; outline: none" onclick="myFunction()"> 
                                    <img src="trash.png" style="width:100%; float:center; text-align: center" />
                                </button>
                            </form>
                        </div>
                    </td>
                </tr>
            </div>     
    `
    });

    pagHTML += `                </tbody>
                            </table> 
                        </div>
                    </div>
                </div>
            </div>
        </body>
    </html>
    `

    return pagHTML
}

// Criação do servidor
var taskList = http.createServer(function (req, res) {
    // Logger: que pedido chegou e quando
    var dat = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + dat)

    // Tratamento do pedido
    if (static.recursoEstatico(req)) {
        static.sirvoRecursoEstatico(req, res)
    }

    else {
        switch (req.method) {
            case "GET":
                // GET /alunos --------------------------------------------------------------------
                if ((req.url == "/")) {
                    callMainPage(res)
                }
                else {
                    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                    res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>")
                    res.end()
                }
                break

            case "POST":
                if (req.url == '/') {
                    postForm(req, res)
                }

                else if (req.url == ('/tarefas/completa')) {
                    postDone(req, res)
                }

                else if (req.url == ('/tarefas/delete')) {
                    postDelete(req, res)
                }

                else if (req.url == ('/tarefas/edit')) {
                    postEdit(req, res)
                }

                else {
                    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                    res.write("<p>Recebi um POST não suportado.</p>")
                    res.write('<p><a href="/">Voltar</a></p>')
                    res.end()
                }
                break

            default:
                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                res.write("<p>" + req.method + " não suportado neste serviço.</p>")
                res.end()
        }
    }
})

taskList.listen(4000)
console.log('Servidor à escuta na porta 4000...')