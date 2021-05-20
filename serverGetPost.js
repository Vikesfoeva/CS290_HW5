// Brandon Lenz
// CS 290 Section 400
// Homework 5


let express = require('express');
let app = express();
let handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

// Reusable function for parsing out paramaters passed in the URL & other commonalites
// This will get used in both the GET and POST
function processURL(req, res) {

  let context = {};
  context.method = req.method;

  let params = [];
  for (let valPair in req.query) {
    params.push({ 'name': valPair, 'value': req.query[valPair] })
  }
  if (params.length == 0) {
    params.push({ 'name': 'No URL Parameters Sent', 'value': '' })
  }
  context.urlParams = params;
  return context;
}

// Defaults to showing the body as no body sent
app.get('/', function (req, res) {
  let context = processURL(req, res);
  let bodyParams = [];
  bodyParams.push({ 'name': 'No body sent', 'value': '' })
  context.body = bodyParams;
  res.render('home', context);
});

// Inlcudes logic for processing the body
app.post('/', function (req, res) {
  let context = processURL(req, res);
  let bodyParams = [];
  for (let bodyPair in req.body) {
    bodyParams.push({ 'name': bodyPair, 'value': req.body[bodyPair] })
  }
  context.body = bodyParams;

  res.render('home', context);
});


app.use(function (req, res) {
  res.status(404);
  res.render('404');
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function () {
  console.log('Express started on a host at port ' + app.get('port') + '; press Ctrl-C to terminate.');
});
