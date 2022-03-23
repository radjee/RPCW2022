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

router.get('/:id', function(req, res, next) {
	axios.get("http://localhost:3000/musicas/" + req.params.id)
    .then(response => {
        var dados = response.data
		title = "Musica: "+ req.params.id 
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
