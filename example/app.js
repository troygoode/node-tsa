var express = require('express')
  , personGuard = require('./guards/person');

var app = express.createServer();
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.bodyParser());
  app.use(app.router);
});

app.get('/', function(req, res){
  res.render('index', {result: null, errors: []});
});

app.post('/', personGuard.middleware(), function(req, res){
  res.render('index', {result: JSON.stringify(req.body), errors: []});
});

app.error(function(err, req, res, next){
  res.render('index', {result: null, errors: err});
});

app.listen(3000, function(){
  console.log('Express server listening on port 3000.');
});
