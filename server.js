
/**
 * Module dependencies.
 */

;// the console of awesome 

var express = require('express'),
  logger = require('node-codein'),
  http = require('http'),
  path = require('path'),
  url = require('url'),
  ElasticSearchClient = require('elasticsearchclient');
var mongoose = require('mongoose');
var Item = mongoose.model('Item', {name: String, detail: [], created : { type : Date, default: Date.now } });
var serverUrl =  url.parse(process.env.SEARCHBOX_URL || 'http://localhost:9200');
console.log(serverUrl);
var serverOptions = {
    host: serverUrl.hostname,
    port:  serverUrl.port
};

var elasticSearchClient = new ElasticSearchClient(serverOptions);

	var _index = 'item';
	var _type = 'document';
	
var app = express();

//remember mongoJs is different from mongoose

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname);
	//app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	
	app.use(express.static(__dirname));
	app.engine('html', require('ejs').renderFile);
	//app.set('view engine', '');
	var mongoURL = process.env.MONGOLAB_URI || 'mongodb://localhost/test';
	mongoose.connect( mongoURL);
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

app.get('/', function(req, res){
	res.render('retriver-template.html');
});
//post to item adds by default
app.post('/add', function(req, res){
	console.log(req.body);
	
	//todo: only add to the database if it is indexed by elasticsearch and vice versa
	var item = new Item({ name: req.body.name, detail: req.body.detail});
	item.save(
		function(err){
			 
			if (err) {
				console.log(err);
			}
			else{	
				res.json( {dbId: item._id});
				res.end();
				
				var commands = [];
				var _index = 'item';
				var _type = 'document';
				commands.push({ 
					"index":{
						"_index":_index, 
						"_type":_type, 
						"_id":item._id
				}});
				commands.push({'name': item.name, 'detail': item.detail});
				elasticSearchClient.bulk(commands, {})
					.on('data', function (data) {
					})
					.on('error', function (error) {
						console.log(error);
						//todo: roll back DB transaction
						//notify user
					})
					.exec();
			}
		} 
	);
});

app.put('/items/:dbId', function(req, res){
	Item.findById(req.params.dbId, function (error, item) {
		if(!error){
		item.name = req.body.name;
			item.detail = req.body.detail;
			item.save(function (err) {
				if (!err) {
				
					res.json( {dbId: item._id});
					res.end();
					
					var commands = [];
					commands.push({ 
						"index":{
							"_index":_index, 
							"_type":_type, 
							"_id":item._id
					}});
					commands.push({'name': item.name, 'detail': item.detail});
					elasticSearchClient.bulk(commands, {})
						.on('data', function (data) {
							//everything was happy
						})
						.on('error', function (error) {
							console.log(error);
							//todo: roll back DB transaction
							//notify user
						}).exec();
				} else {
					console.log(err);
				}
			});
		}
		else{
			console.log(error);
		}
	});
});

app.get('/items/:dbId', function(req, res){
	Item.findById(req.params.dbId, function (err, item) {
		if (!err) {
			res.send(item);
		} else {
			console.log(err);
		}
	});
});

app.get('/items', function(req, res){
console.log('get all');
	Item.find({},function (err, items) {
		if (!err) {
			res.send(items);
		} else {
			console.log(err);
		}
	});
});

app.get('/search/:query', function(req, res){
console.log(req.params.query);
//note this is failing
	var qryObj = {
        "match_all" : {}
	}
	elasticSearchClient.search(_index, _type, qryObj)
		.on('data', function(data) {
			console.log(JSON.parse(data))
			res.json(data);
			res.end();
		})
		.on('done', function(){
			//always returns 0 right now
		})
		.on('error', function(error){
			console.log(error)
		})
		.exec();
	
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server now listening on port " + app.get('port'));
});

