var fs = require('fs');
var url = require('url');
var path = require('path');
var http = require('http');

var port = 8001;

http.createServer(function(req,res){
	var uri = req.url.replace(/\?.*$/,'');
	if(uri=='/'){
		uri = '/index.html';
	}
	//console.log(__dirname+uri);
	if(fs.existsSync(__dirname+uri)){
		var ext = path.extname(url.parse(uri).pathname).toLowerCase();
		var contentType = 'text/html', encoding = {encoding:'utf-8'};
		if(ext == '.js'){
			contentType = 'text/javascript';
		}else if(ext == '.css'){
			contentType = 'text/css';
		}else if(ext == '.jpg'){
			contentType = 'image/jpeg';
			encoding = null;
		}else if(ext == '.png'){
			contentType = 'image/png';
			encoding = null;
		}else if(ext == '.swf'){
			contentType = 'application/swf';
			encoding = null;
		}
		var file = fs.readFileSync(__dirname+uri,encoding);
		res.writeHead(200, {'Content-Type':contentType});
		res.end(file);
	}else{
		console.log(404,req.url);
		res.end();
	}
}).listen(port,function(){console.log('listening '+port+'...')});