var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var cors       = require('cors')
var morgan     = require('morgan');
var http = require('http');

//Configure Express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

var router = express.Router();

// Root URI.
router.get('/', function(req, res) {
        res.json( {message: 'REST PROXY' });
});

router.route('/status/devices')		// Sample path
    .get( function(req, res) {

	// Define the proxy authentication credentials
        var username = 'proxy_user';
        var password = 'proxy_user_password';
        var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
        
        var options = {
                host: "proxy_machine_ip_or_address",				// The Proxy machine address: Ex: 10.10.1.1 or proxy.mydomain.com
                port: 3128,							// The proxy port
                path: "http://rest_host/api/status/devices",			// The remote host REST server FULL Path
                headers: {
                        Host: "rest_host.fqdn",					// The remote host FQDN
                        "Proxy-Authorization": auth				// The proxy authorization token
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

