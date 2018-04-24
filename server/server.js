const https = require('https');
const http = require('http');
const fs = require('fs');

const dataUrl = 'https://www.alphavantage.co/query' +
                '?apikey=IOLSWR1H68PRHI6T' +
                '&function=TIME_SERIES_DAILY_ADJUSTED' +
                '&symbol=MSFT';

const host = 'localhost';
const port = 3000;

let server = http.createServer((req, res) => {

    let responses = [];
    let jsondata = "";
    
    fs.readFile('./app/app.html', function(err, html) {


        https.get(dataUrl, response => {

            response.setEncoding("utf8");

            response.on("data", data => { jsondata += data; });

            response.on("end", () => {
                responses['/'] = '<a href="/app">View App</a><br>' +
                                 '<a href="/jsondata">View JSON</a>';
                responses['/app'] = html;
                responses['/undefined'] = 'URL undefined!';
                responses['/jsondata'] = jsondata;
                res.end(responses[req.url] || responses['/undefined']);
            }); // routes

        }); // data

    }); // html app

    fs.readFile('./app/lib/angularjs-v1.6.9.min.js', function(err, lib) {
        responses['/app/lib/angularjs-v1.6.9.min.js'] = lib;
    }); // lib angular

    fs.readFile('./app/js/app.js', function(err, js) {
        responses['/app/js/app.js'] = js;
    }); // js app

});

server.listen(port, host, () => {
    console.log(`Server: http://${host}:${port}`);
});