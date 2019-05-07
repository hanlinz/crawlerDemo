const http = require('http');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const open = require('open');
const address = require('address');
const iconv = require('iconv-lite');


var port = '8888'
var page = 1498508

function getHTML(id=1498508){
	return new Promise((resolve, reject) => {
		var url = `http://www.biquge.cm/2/2561/${id}.html`;
		page = id
		http.get(url, function(res){
			var html = [];
			res.on('data', function(data){html.push(data)})
			res.on('end', function(){
				resolve(end(iconv.decode(Buffer.concat(html), 'GBK')))
			}).on('error', function(){
				resolve('链接失败')
			})
		})
	})
}

function end(html){
	var $ = cheerio.load(html);
	var str = `<script>
		var page = parseInt(window.location.pathname.slice(1)) || 0;
		var btn1 = document.createElement("button");
		var btn2 = document.createElement("button");
		btn1.innerText = "pre";btn2.innerText = "next";
		btn1.addEventListener('click', function(){
			window.location.href= window.location.origin + '/' + (page - 1)
		})
		btn2.addEventListener('click', function(){
			window.location.href= window.location.origin + '/' + (page + 1)
		})
		document.body.append(btn1);
		document.body.append(btn2);
	</script>`
	if($('#content').length == 0) return `<!DOCTYPE HTML><html><head></head><body>链接失败</body>${str}</html>`
	$('head').html('<meta http-equiv="Content-Type" content="text/html; charset=gbk">');
	$('script, link').remove();
	$('body').html($('#content').html()).append(str);
	return $.html()
}

function done(html){
	
}
app.get('/:id', function(req, res){
	getHTML(req.params.id).then(resolve=>res.send(resolve))
	// res.send(html);
}).listen(port)
open('http://'+address.ip() + ':' + port + '/' + page, 'chrome')