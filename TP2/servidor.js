var http = require('http')
var url = require('url')
var fs = require('fs')

http.createServer(function (req, res){
    var q = url.parse(req.url, true);

    var dir = q.pathname.split("/");

    if(dir[1] == "filmes"){
        if(dir.length == 3 && dir[2][0] == "f"){
            path = "./htmls/filmes/"+dir[2]+".html"
        }
        else path = "./htmls/index.html"
    }

    else if(dir[1] == "atores"){
        if(dir.length == 3 && dir[2][0] == "a")
            path = "./htmls/atores/"+dir[2]+".html"
        else path = "./htmls/atores.html"
    }

    else path = ""

    fs.readFile(path, function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        if(err){
            res.write("<p>Erro na leitura de ficheiro...</p>")
        }
        else{
            res.write(data)
        }
        res.end()
    })
}).listen(7777)

console.log('Servidor à escuta na porta 7777...')