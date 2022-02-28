var http = require('http')
var url = require('url')
var fs = require('fs')

function sendNotFound(res){
    res.writeHead(404, {"Content-Type" : "text/html"})
    res.write("<p>Page not Found</p>")
}

http.createServer(function (req, res){
    var q = url.parse(req.url, true)

    var dir = q.pathname.split("/")

    path = ""

    console.log(dir)

    if (dir.length == 0)
        sendNotFound(res)

    else {
        switch(dir[1]) {
            case "filmes":
                if(dir.length == 2)
                    path = "./htmls/index.html"

                else if(dir.length == 3 && dir[2][0] == "f"){
                    path = "./htmls/filmes/"+dir[2]+".html"
                }

                else { 
                    sendNotFound(res)
                    return
                }
                break
            
            case "atores":
                if (dir.length == 2)
                    path = "./htmls/atores.html"
                    
                else if(dir.length == 3 && dir[2][0] == "a")
                    path = "./htmls/atores/"+dir[2]+".html"
                
                else { 
                    sendNotFound(res)
                    return
                }
                break

            case "w3":
                path = "./w3.css"
                break

            case "style":
                path = "./style.css"
                break

            default:
                sendNotFound(res)
                return
        }

        fs.readFile(path, function(err, data) {
            if(err){
                res.write("<p>Erro na leitura de ficheiro...</p>")
                console.log(err)
            }
            else{
                switch (req.url) {
                    case "/w3":
                        res.writeHead(200, {"Content-Type": "text/css"})
                        break
                
                    case "/style":
                        res.writeHead(200, {"Content-Type": "text/css"})
                        break
                
                    default:
                        res.writeHead(200, {"Content-Type": "text/html"})
                }
                res.write(data)
            }
            res.end()
        })
    }
}).listen(7777)

console.log('Servidor à escuta na porta 7777...')