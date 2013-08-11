$ = require('jquery');


var mangaFox = {}


mangaFox.getDetails = function(id, callback){
	$.post('http://mangafox.me/ajax/series.php', {sid:id},function(data){
		(callback||function(){})(data);
	}, 'json');
}

mangaFox.getManga = function(callback){
	$.get('http://mangafox.me/manga/',function(data){
		var list = [];
		
		$(data).find('.manga_list li a').each(function(index, d){
			var b = $(d);			
			list.push({id:b.attr('rel'), title:b.text()})
		});
		
		(callback||function(){})(i);
	});
}





module.exports = mangaFox;