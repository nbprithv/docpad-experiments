
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , item = require('./routes/item')
  , category = require('./routes/category')
  , http = require('http')
  , path = require('path');

var hbs = require('hbs');
var fs = require('fs');

var partialsDir = __dirname + '/views/partials';

var filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
  var matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  var name = matches[1];
  var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  hbs.registerPartial(name, template);
});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/category/create/*', category.create);
app.get('/item/create/*', item.create);
app.post('/item/create/*', item.create);
app.post('/item/submit/*', item.submit);

app.use(express.bodyParser({uploadDir: './src/files'}));

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Add DocPad to our Application
var docpadInstanceConfiguration = {
  // Give it our express application and http server
  serverExpress: app,
  serverHttp: server,
  // Tell it not to load the standard middlewares (as we handled that above)
  middlewareStandard: false
};
var docpadInstance = require('docpad').createInstance(docpadInstanceConfiguration, function(err){
  if (err)  return console.log(err.stack);
  // Tell DocPad to perform a generation, extend our server with its routes, and watch for changes
  docpad.action('generate server watch', function(err){
      if (err)  return console.log(err.stack);
  });
});

app.get('/alias-for-home', function(req, res, next) {
  var document;
  req.templateData = {
    weDidSomeCustomRendering: true
  };
  document = docpadInstance.getFile({
    relativePath: 'home.html.md'
  });
  return docpadInstance.serveDocument({
    document: document,
    req: req,
    res: res,
    next: next
  });
});

