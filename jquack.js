$ = new function (a){

	var m  = function(b){
		return m.cheerio(b);
	}
	
	m.get = function(url, callback, c){
		var cb = (callback||function(){});

		var data = '';
		var r = m.request(url).pipe(m.zlib.createGunzip());

		r.on('data', function(body){
			data += body;
		});

		r.on('finish', function(){
			if(c){
				data = m.cheerio(data);
			}

			cb(data);
		});
	};
	
	m.post = function(url, body, callback, c){
		var cb = (callback||function(){});
		var r = m.request.post({
			headers: {'content-type' : 'application/x-www-form-urlencoded'},
			url:     url,
			body:    m.query(body)
		}, function(error, response, data){
			cb(c ? m.cheerio(data):data);
		});

		
	};
	
	m.request = require('request');
	
	m.cheerio = require('cheerio');

	m.zlib = require('zlib');
	
	m.query = require('querystring').stringify;
	
	return m;

}
 module.exports = $;