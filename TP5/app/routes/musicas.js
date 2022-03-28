var express = require('express');
var router = express.Router();
var axios = require('axios')

var d = new Date().toLocaleDateString("pt-PT");

/* GET users listing. */
router.get('/', function(req, res, next) {
	axios.get("http://localhost:3000/musicas")
		.then(response => {
			var lista = response.data
			res.render('musicas', {title: "Lista de Música", musicas: lista, data: d});
		})
		.catch(function(erro){
			res.render('error', {error: erro});
			console.log(erro)
		})
});

router.get('/inserir', function(req, res, next) {
	title = "Registar Música";
	res.render('registar', {title: title, data: d})
});

router.post('/inserir', function (req, res) {
	prov = req.body.prov;
	local = req.body.local;
    tit = req.body.tit;
	musico = req.body.musico;
	obs = req.body.obs;
	obsFilesAll = req.body.obsFiles;

	r = obsFilesAll.split(",");

	console.log(r)

	obsFiles = []
	
	r.forEach(file => {
		data = {}
		split = file.split('.')
		data = {"file" : file, "fileType" : (split[1]).toUpperCase()}
		obsFiles.push(data)
	})
	
	file = req.body.file;
	fileType = (file.split(".")[1]).toUpperCase();
	
	duracao = req.body.duracao;

	musica = {prov : prov, local: local, tit: tit,
		musico: musico, obs: obs, obsFiles: obsFiles, file: file, 
		fileType: fileType, duracao: duracao}

	axios.post("http://localhost:3000/musicas", musica)
	.then(resp => {
		res.redirect('/musicas')
	}).catch(error => {
		console.log(error);
	});
});

router.get('/:id', function(req, res, next) {
	axios.get("http://localhost:3000/musicas/" + req.params.id)
    .then(response => {
        var dados = response.data
		title = "Musica: " + req.params.id ;
        res.render('musica', {title: title, musica: dados, data: d});
    })
    .catch(function(erro){
		res.render('error', {error: erro});
		console.log(erro)
    })
});

router.get('/prov/:provid', function(req, res, next) {
	axios.get("http://localhost:3000/musicas?prov=" + req.params.provid)
    .then(response => {
        var dados = response.data
		title = "Lista de Musicas da Província de: " + req.params.provid 
        res.render('musicas', {title: title, musicas: dados, data: d});
    })
    .catch(function(erro){
		res.render('error', {error: erro});
		console.log(erro)
    })
});

module.exports = router;
