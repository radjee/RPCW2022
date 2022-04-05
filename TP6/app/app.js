var express = require('express');
var logger = require('morgan');
var templates = require('./html-templates');
var jsonfile = require('jsonfile');
var fs = require('fs');

var multer = require('multer')
var upload = multer({dest: 'uploads'})

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.get('*', (req, res, next) => {
//   console.log("Recebi um GET!")
//   next()
// })

app.get('/', (req, res) => {
  var d = new Date().toISOString().substring(0, 16);
  var files = jsonfile.readFileSync('./dbFiles.json')
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
  res.write(templates.home(files, d))
  res.end()
})


app.post('/files', upload.single('myFile'), (req, res) => {
  let oldPath = __dirname + '/' + req.file.path
  let newPath = __dirname + '/fileStore/' + req.file.originalname

  fs.rename(oldPath, newPath, erro => {
      if(erro) throw erro
  })
  var d = new Date().toISOString().substring(0, 16);
  var files = jsonfile.readFileSync('./dbFiles.json')
  var id_f = files.length
  
  files.push({
    date: d,
    name: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    description: req.body.descricao,
    id: id_f + 1
  })

  jsonfile.writeFileSync('./dbFiles.json', files)

  res.redirect('/')
})

app.get("/style.css", (req, res) => {
  fs.readFile("./style.css", function(err, data) {
    res.writeHead(200, {'Content-type': 'text/css; charset=utf-8'})
    if(err) {res.write('<p> File reading error.</p>')} else {res.write(data)}
    res.end()
  })
});

app.post(/\/files\/delete\/[0-9]+/, (req, res) => {
  let id = req.url.split("/")[3]

  var files = jsonfile.readFileSync('./dbFiles.json')

  files.splice(id)
  
  jsonfile.writeFileSync('./dbFiles.json', files)

  res.redirect("/")
});

app.listen(4000, () => console.log("Servidor à escuta na porta 4000!"))

module.exports = app;
