var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var cors       = require('cors')
var morgan     = require('morgan');
var http = require('http');

//Configure Express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(cors());
var router = express.Router();

// Root URI.
router.get('/', function(req, res) {
        res.json( {message: 'REST PROXY' });
});


router.route('/status/devices')				// Sample path
    .get( function(req, res) {

        var options = {
                host: "rest_host",			// Remote REST server address.
                port: 80,				// Remote REST server port.
                path: "/status/devices",		// Rest Path
                headers: {
                        Host: "rest_host.fqdn",		// Remote Host FQDN.
                }
        };

        var callback = function(response) {

                res.writeHead(response.statusCode, response.headers);
                response.on('data', function (chunk) {
                        res.write(chunk);
                });
                response.on('end', function() {
                         res.end();
                });
        };

        var request = http.request(options, callback);

        req.on('data', function (chunk) {
                request.write(chunk);
        });

        req.on('end', function() {
                request.end();
        });

    });

// Our base url is /api
app.use('/api', router);
app.listen(3001);

var datenow = new Date();
console.log("========================================");
console.log("REST Proxy Server started at " + datenow );
console.log("Api endpoint available at http://localhost:3001/api");
