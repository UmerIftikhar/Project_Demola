// server.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var jsdom = require("node-jsdom");
var uuid = require('node-uuid');
var http = require('http');
var fs = require('fs');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var restClient = require('node-rest-client').Client;
var favicon = require('serve-favicon');
var mailer = require("nodemailer");

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var client = new restClient();

var configDB = require('./config/database.js');
app.use(favicon(__dirname + '/client/images/favicon.ico'));
app.use('/js', express.static(__dirname + '/client/js'));
app.use('/css', express.static(__dirname + '/client/css'));
app.use('/images', express.static(__dirname + '/client/images'));
app.use('/fonts', express.static(__dirname + '/client/fonts'));
app.use('/styles', express.static(__dirname + '/public/stylesheets'));

//:::::::::::::::::::::::::::::::::::Balaji:::::::::::::::::::::::::::::::::::::

// Variables ===================================================================



//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// configuration ===============================================================

var options = {
    db: { native_parser: true },
    server: { poolSize: 5 },
    replset: { rs_name: 'myReplicaSetName' },
    user: 'admin',
    pass: 'admin'
};

mongoose.connect(configDB.url, options);
require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================

//:::::::::::::::::::::::::::::::::::Balaji:::::::::::::::::::::::::::::::::::::

// REST Methods=================================================================


var dataPoints = [];

var dpParents = [];

/**
* Get the list of data and its types via REST service from MES
* Sort them with respect to data type
* Hint: Every sorting is done here inorder to let the client be light weight and faster
*/
function initialConfig() {

	client.get("http://localhost:3080/mes/datapoints", function (data, response) {
	// Assign it directly for all data types
	dataPoints = data;
	//Going through each array of data
	for (incDP = 0; lenDP = data.length, incDP < lenDP; incDP++) {
		dpParents.push(data[incDP].id);
	}	
	//push the details for the charts
	var  overall = {
			data: {
				demandVsProd: "verBarChart",
				stockValue: "candleChart",
				phaseProd: "barChart"
			},
			id: "overall",
			url: "http://localhost:3080/mes/datapoints?phase=2"
		};
	dataPoints.push(overall);	
	//Emit the datat to the admin screen
	io.sockets.emit('all_DataPoint', dataPoints);
	//call the function to register for all the events
	eventRegister();
	});
}

//Calling the function to get the data point and associate them
initialConfig();

function eventRegister() {
	//Register to all the events from the server
	for (incDP = 0; lenDP = dataPoints.length, incDP < lenDP; incDP++) {
		var args = {
			data: { "id": "client", "destUrl": "http://localhost:" + server_port + "/" + dataPoints[incDP].id + "/notifs" },
			headers: { "Content-Type": "application/json" }
		};
		//Array for getting the keys under 'data' in JSON message
		client.post(dataPoints[incDP].url, args, function (data, response) {
		});
	}
}


app.post('/:parent/notifs', function (req, res) {
	io.sockets.emit('mes_data', req.body);
    res.send({});
});
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//-----------------------------------------------------------------------------//


////////////////////////////////////////////////////////////////////////////////////////////EMAIL.
app.post('/sendemail', function (request, response) {

    var send_to = request.body.email;
	console.log(request.body);
	var user_Id = request.body.user;
    // Use Smtp Protocol to send Email
    var smtpTransport = mailer.createTransport("SMTP", {
        service: "Gmail",
		//host: 'smtp.yourprovider.org',		//yourprovider = > gmail
        auth: {
            user: "factory.visualization@gmail.com",
            pass: "factory&1"
        }
    });

	var mail = {
        from: "factory.visualization@gmail",
        //to: "soccer_fan23@hotmail.com",
        to: send_to,
		subject: "Factory Visualization",
        text: "UserName: admin\nPassword: admin",
        html: "<b>You have been granted an access to FV Software.</b><br><p>UserName: " + user_Id + "<br>Password: reqPwd123#</p><br><p>http://leanware-baltor.rhcloud.com</p>"
    }

    smtpTransport.sendMail(mail, function (error, response) {
        if (error) {
			//response.send('Username: ' + request.body.loggedinUser);
            console.log(error);
        } else {
			//response.send('Username: ' + request.query['username']);

            console.log("Message sent: " + response.message);
        }

        smtpTransport.close();
    });

	response.send("An email has been sent at your respective address.");


});

////////////////////////////////////////////////////////////////////////////////////////////EMAIL.


//////////////////////////////////////////////////////////////////////////////////get the item being added.
app.post('/getNewObject', function (req, res) {
	var curr_id = uuid.v1();
	res.json(curr_id);
});

//////////////////////////////////////////////////////////////////////////////////get the item being added.

//////////////////////////////////////////////////////////////////////////////////move the item being added.

//Using Sockets the Copy the above code.

io.on("connection", function (socket) {

	socket.on('propChanged', function (data) {
		io.sockets.emit('prop_Changed', data);
	});

	socket.on('initialConfig', function (data) {
		//Calling the function to get the data point and associate them
		initialConfig();
	});

	//masking the panel visible on double clicks
	socket.on('panelVisibilityOnClick', function (data) {
		io.sockets.emit('panel_Visibility_OnClick', data);
	});

	//masking the panel visible on double clicks
	socket.on('panelVisibility', function (data) {
		io.sockets.emit('panel_Visibility', data);
	});

	socket.on('createScreen', function (data) {
		//Initially Get the elements
        var elementsReceived = data.objects;
        // then get the name and background image url
        var pageName = data.name + ".ejs";
        var background = data.backGroundUrl;

        var htmlSource = fs.readFileSync("./views/basePage.ejs", "utf8");

        var jsdom_d = jsdom.jsdom;
        var document = jsdom_d(htmlSource);

        var window = document.defaultView;

        jsdom.jQueryify(window, "http://code.jquery.com/jquery.js", function () {
            var $ = window.$;
			//Set the attrbutes for the background
			 for (i = 0; len = elementsReceived.length, i < len; i++) {
                var $jQueryObject = $($.parseHTML(elementsReceived[i].finalHtml));
                $('body').append(elementsReceived[i].finalHtml);
            }
            //save the file
            fs.writeFile('./views/' + pageName, $('html')[0].outerHTML,
                function (error) {
                    if (error) throw error;
                });
			io.sockets.emit('creation_Success', { 'pageId': pageName.replace('.ejs', '') });
        });
	});
});

app.get('/:file', function (req, res) {
	res.render(req.params.file);
});

server.listen(server_port);

console.log('The magic happens on port ' + server_port);

///////////////////////////////////////////////////////////////////////////////////////////



