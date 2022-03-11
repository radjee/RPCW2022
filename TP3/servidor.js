var http = require('http')
var url = require('url')
var fs = require('fs');
const axios = require('axios');

function sendNotFound(res){
    res.writeHead(404, {"Content-Type" : "text/html"})
    res.write("<p>Page not Found</p>")
}

function generateMainPage()
{
    page = `
    <!DOCTYPE html>
    <html>
        <title>Main Page</title>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" href="/w3">
            <link rel="stylesheet" href="/style">
        </head>

        <style>
            body {
                font-family: "Times New Roman", Georgia, Serif;
            }

            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
                font-family: "Playfair Display";
                letter-spacing: 5px;
            }
        </style>

        <body>
            <!-- Top of Page -->
            <a name="top"></a>

            <!-- Navbar -->
            <div class="w3-top">
                <div class="w3-bar w3-white w3-padding w3-card" style="letter-spacing:4px;">
                    <a href="#top" class="w3-bar-item w3-button">Home</a>
                </div>
            </div>

            <br/>
            <br/>
            <br/>
            <br/>

            <!-- Page Content -->
            <!-- Title -->
            <div class="container">
                <p><b>Main Page</b></p>
            </div>

            <!-- HTMLS -->
            <div style="margin:auto; width:100%; text-align:center;">
                <div>
                    <a class="info" href="/alunos">Lista de Alunos</a>
                    <a class="info" href="/cursos">Lista de Cursos</a>
                    <a class="info" href="/instrumentos">Lista de Instrumentos</a>
                </div>
            </div>
        </body>
    </html>
    `
    
    return page;
}

function generatePage(type, elems)
{
    page = `
    <!DOCTYPE html>
    <html>
        <title>Página de ${type}</title>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" href="/w3">
            <link rel="stylesheet" href="/style">
        </head>

        <style>
            body {
                font-family: "Times New Roman", Georgia, Serif;
            }

            table, th, td {
                border: 1px solid black;
                text-align: center;
            }

            .center {
                margin-left: auto;
                margin-right: auto;
            }

            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
                font-family: "Playfair Display";
                letter-spacing: 5px;
            }
        </style>

        <body>
            <!-- Top of Page -->
            <a name="top"></a>

            <!-- Navbar -->
            <div class="w3-top">
                <div class="w3-bar w3-white w3-padding w3-card" style="letter-spacing:4px;">
                    <a href="#top" class="w3-bar-item w3-button">Home</a>
                </div>
            </div>

            <br/>
            <br/>
            <br/>
            <br/>

            <!-- Page Content -->
            <!-- Title -->
            <div class="container">
                <p><b>Lista de ${type}</b></p>
            </div>

            <!-- HTMLS -->
            <div style="margin:auto; width: 100%;">
                <div>
                    <table style= "width=100%" class="center">
`
    console.log("Entrei " + type)
    switch (type){
        case "Alunos":
            page +=`
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Data Nascimento</th>
                <th>Curso</th>
                <th>Ano do Curso</th>
                <th>Instrumento</th>
            </tr>
            `

            elems.forEach(p => {
                page += `<tr>
                <td>${p.id}</td>
                <td>${p.nome}</td>
                <td>${p.dataNasc}</td>
                <td>${p.curso}</td>
                <td>${p.anoCurso}</td>
                <td>${p.instrumento}</td>
                </tr>\n`
            });
            break;

        case "Cursos":
            page +=`
            <tr>
                <th>ID</th>
                <th>Designação</th>
                <th>Duração</th>
                <th>ID Instrumento</th>
                <th>Nome do Instrumento</th>
            </tr>
            `
            elems.forEach(p => {
                page += `<tr>
                <td>${p.id}</td>
                <td>${p.designacao}</td>
                <td>${p.duracao}</td>
                <td>${p.instrumento.id}</td>
                <td>${p.instrumento["#text"]}</td>
                </tr>\n`
            });
            break;

        case "Instrumentos":
            page +=`
            <tr>
                <th>ID</th>
                <th>Nome do Instrumento</th>
            </tr>
            `
            elems.forEach(p => {
                page += `<tr>
                <td>${p.id}</td>
                <td>${p["#text"]}</td>
                </tr>\n`
            });
            break;
    }

    page +=`
                    </table>
                </div>
            </div>
        </body>
    </html>
    `   
    return page;
}

function generateGeral(res, type)
{
    myurl = 'http://localhost:3000/' + type;

    axios.get(myurl)
    .then(function (resp) {
        elems = resp.data;

        page = generatePage(type, elems)

        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.write(page);
        res.end();
    })
    .catch(error => {
        if (error.response) {
            //The response status is an error code
            console.log(error.response.status);
        }
        else if (error.request) {
            //Response not received though the request was sent
            console.log(error.request);
        }
        else {
            //An error occurred when setting up the request
            console.log(error.message);
        }
    });
}

myserver = http.createServer(function (req, res) {       
    var myurl = url.parse(req.url, true).pathname

    switch(myurl){
        case "/":
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.write(generateMainPage());
            res.end();
            break;

        case "/alunos":
            generateGeral(res, "Alunos");
            break;

        case "/cursos":
            generateGeral(res, "Cursos");
            break;

        case "/instrumentos":
            generateGeral(res, "Instrumentos");
            break;

        case "/w3":
            fs.readFile("./w3.css", function(err, data) {
                if(err){
                    res.write("<p>Erro na leitura de Ficheiro</p>")
                    console.log(err)
                }
                else {
                    res.writeHead(200, {"Content-Type": "text/css"})
                    res.write(data);
                }
                res.end();
            })
            break;

        case "/style":
            fs.readFile("./style.css", function(err, data) {
                if(err){
                    res.write("<p>Erro na leitura de Ficheiro</p>")
                    console.log(err)
                }
                else {
                    res.writeHead(200, {"Content-Type": "text/css"})
                    res.write(data);
                }
                res.end();
            })
            break;
        
        default:
            sendNotFound(res)
            return
    }
})

myserver.listen(4000)
console.log('Servidor à escuta na porta 4000...')