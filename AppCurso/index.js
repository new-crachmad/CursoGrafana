var express = require('express');
var client = require('prom-client');
const register = client.register;

var app = express();


const counter = new client.Counter({
  name: 'teste_request_total',
  help: 'contador de requests',
  labelNames: ['statusCode'],
});


const gauge = new client.Gauge({
  name: 'teste_free_bytes',
  help: 'exemplo de gauge'
});

const histogram = new client.Histogram({
  name: 'teste_time_seconds',
  help: 'Tempo de resposta da API',
  buckets: [0.1, 0.2, 0.3, 0.4, 0.5],
});

const Summary = new client.Summary({
  name: 'teste_sumary_seconds',
  help: 'Tempo de resposta da API',
  percentiles: [0.01, 0.1, 0.9, 0.99],
});

app.get('/', function(req, res) {
    counter.labels(res.statusCode).inc();  
    gauge.set(100 * Math.random());
    histogram.observe(Math.random());
    Summary.observe(Math.random());        

    res.send('hello word nessa bagaça kkkk');
});

app.get('/metrics', async function(req, res){
    res.set('Content-type', register.contentType);
    res.end(await register.metrics());
});

app.listen(300, () => {
    console.log('Servidor rodando em http://localhost:300');
});
