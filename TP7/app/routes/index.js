var express = require('express');
var axios = require('axios');
var router = express.Router();

const apiKey = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNGNiYTg0OWJhYmI2NjdjYmZkYzE2ZSIsImlhdCI6MTY0OTE5NTY1MiwiZXhwIjoxNjUxNzg3NjUyfQ.EuvH713Qr6IZ073-5FMF6j5p_3tb6Trv0TOOF5ZHWOPUlCBqKU1H9DTo_ueoCyWhPbEd6F8xzNvn-UkG3J8Ppq65xF8uukoElnSIsi3kldXI2E_EHMv5ETIq-2SGpiBmLyv1zu2broi-nXw18XwKM-WWpoumw5mZacg1qyj4kokGm--WzPIDD15Uibu2ObsDfeHpbDt81Npq-WgEVe56F5w0TdAvY_b-Xvm77hXI4MuaatL9bsOtYEyiepLuBelDyVWjAIoon3-7tB1lwrPnC0OJ_cxKUyCdqx8sZPkmciyTmBsV8fDTyvTP1ibiryAQsDRK5TrG83CcWmStZyDnoQ'


/* GET processo da homepage*/
router.get('/', (req, res, next) => {
  axios.get('http://clav-api.di.uminho.pt/v2/classes?nivel=1&apikey=' + apiKey)
    .then(resp => {
      data = {
        title: "Página Inicial",
        description: "Página com a lista de classes de nível 1"
      }
      data['list'] = resp.data
      res.render('index', data)
    })
    .catch(erro => {
      res.status(500).jsonp(erro)
    })
})

/* GET processo com um determinado ID. */
router.get('/:id', function(req, res, next) {
  axios.get('http://clav-api.di.uminho.pt/v2/classes/c' + req.params.id + '?apikey=' + apiKey)
    .then(resp => {
      console.log(resp.data)
      res.render('process', resp.data)
    })
    .catch(erro => {
      res.status(501).jsonp(erro)
    })
});

router.get('/queries/q1', function(req, res, next) {
  axios.get('http://clav-api.di.uminho.pt/v2/classes?nivel=3&apikey=' + apiKey)
      .then(resp => {
          counter = 0;
          descendentes = [];

          resp.data.forEach(processo => {
              paiID = processo.codigo.split('.')
              if (paiID[0] == '750') {
                  counter += 1;
                  descendentes.push(processo)
              }
          })
          res.render('query', {title: 'Query 1', description: 'Processos pertencentes à descendência da classe 750: ' + counter + ' processos', dados: descendentes});
      })
      .catch(erro => {
          console.log(erro)
      })
});

// Query 2
router.get('/queries/q2', (req, res, next) => {
  axios.get('http://clav-api.di.uminho.pt/v2/classes?nivel=4&apikey=' + apiKey)
    .then(resp => {
      total = resp.data.length
      res.render('query', {title: 'Query 2', description: 'Total de subprocessos: ' + total, dados: resp.data});
    })
    .catch(erro => {
      console.log(erro)
    })
})

router.get('/queries/q3', (req, res, next) => {
  axios.get('http://clav-api.di.uminho.pt/v2/classes/c750.30/descendencia?nivel=3&apikey=' + apiKey)
    .then(resp => {
      total = resp.data.length
      res.render('query', {title: 'Query 3', description: 'Total de subprocessos: ' + total, dados: resp.data});
    })
    .catch(erro => {
      console.log(erro)
    })
})

router.get('/queries/q4', (req, res, next) => {
  axios.get('http://clav-api.di.uminho.pt/v2/classes/c750.30.001/procRel?nivel=3&apikey=' + apiKey)
    .then(resp => {
      total = resp.data.length
      res.render('query', {title: 'Query 4', description: 'Total de subprocessos: ' + total, dados: resp.data});
    })
    .catch(erro => {
      console.log(erro)
    })
})


module.exports = router;
