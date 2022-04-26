var express = require('express');
var router = express.Router();

var Para = require('../controllers/para');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/para', function(req, res, next) {
  Para.listar()
    .then(dados => {
      res.status(200).jsonp(dados);
    })
    .catch(error => {
      console.log(error)
      res.status(501).json(err)
    })
});

router.post('/para', function(req, res, next) {
  Para.inserir(req.body)
    .then(dados => {
      res.status(201).jsonp(dados)
    })
    .catch(err => {
      console.log(err)
      res.status(502).jsonp(err)
    })
});

router.delete('/para', function(req, res, next) {
  Para.apagar(req.body)
    .then(dados => {
      res.status(202).jsonp(dados)
    })
    .catch(err => {
      res.status(503).jsonp(err)
    })
});

router.put('/para', function(req, res, next) {
  var d = new Date().toISOString().substring(0,16)
  paraEdit = {
    _id: req.body._id,
    para: req.body.para,
    editado: d
  }
  Para.atualizar(paraEdit)
    .then(dados => {
      res.status(201).jsonp(dados)
    })
    .catch(err => {
      console.log(err)
      res.status(504).jsonp(err)
    })
});

module.exports = router;
