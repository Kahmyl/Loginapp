var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const bcrypt = require('bcrypt');





var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'Loginapp'
});


var app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());



app.get('/register', function(req, resp){
    
    resp.sendFile('./Sound/register.html', {root: __dirname});
});



app.post('/register', function(request, response) {
    var username = request.body.username;
    var email = request.body.email;
	var password = request.body.password;
	
bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
		if (username && password) {
			connection.query('INSERT INTO users (username, email, password) values (?,?,?)', [username,email, hash], function(error, results, fields) {
				if (error) {
					console.log("error ocurred",error);
					response.send('invalid email !');
				}else{
					request.session.username = username
					response.send('<h1 style=" border-radius:3px; background:lavender; text-align:center; font-family:"Times new romans" font-size:20px;>Welcome</h1><br>, ' + request.session.username + '!' + '<br> <button style="background:lavender;"><a style=" border-radius: 5px; color:black; text-decoration: none;" href="/Home-L">Continue to Homepage</a></button>');
	 
					console.log('The solution is: ', results);
				}		
				response.end();
			});
		} else {
			response.send('Please enter Username and Password!');
			response.end();
		}		
	});
});	
	
});
app.get('/login', function(req, resp){
    
    resp.sendFile('./Sound/login.html', {root: __dirname});
});

app.post('/login', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM users WHERE username = ? ', [username], function(error, results, fields) {
			if(error) {
				response.send('unauthorised access')
			}else{
				bcrypt.compare(password, results[0].password, function(error,results) {
					if(results){
						request.session.loggedin = true;
						request.session.username = username;
						response.sendFile('./Sound/Home-L.html', {root: __dirname});
						
					}else{
						response.send('<h6 style=" color:red; text-align:center; font-family:calibri; font-size:100%;">Incorrect Username and/or Password!</h6>'+'<html><head><meta charset="utf-8"><title>Login</title><style>.login-form {width: 300px;margin: 0 auto;font-family: Tahoma, Geneva, sans-serif;}.login-form h1 {text-align: center;color: #4d4d4d;font-size: 24px;padding: 20px 0 20px 0;}.login-form input[type="password"],.login-form input[type="text"] {width: 100%;padding: 15px;border: 1px solid #dddddd;margin-bottom: 15px;box-sizing:border-box;}.login-form input[type="submit"] {width: 100%;padding: 15px;background-color: #535b63;border: 0;box-sizing: border-box;cursor: pointer;font-weight: bold;color: #ffffff;}button a{text-decoration: none;color:black;justify-content: right;}button a:hover{background-color: lavender;animation-delay: 3s}</style></head><body><button style="background: lavender ; border-radius: 5px;"><a href="http://localhost:3000/register">Sign Up</a></button><div class="login-form"><h1>Login </h1><form action="login" method="POST"><input type="text" name="username" placeholder="Username" required><input type="password" name="password" placeholder="Password" required><input type="submit"></form></div></body></html>');
					    
					}
				})
			}
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});


app.get('/dome', function(request, response) {
	if (request.session.loggedin) {
		response.send('<h1 style=" border-radius:3px; background:lavender; text-align:center; font-family:"Times new romans" font-size:20px;>Welcome back</h1><br>, ' + request.session.username + '!' + '<br> <button style="background:lavender;"><a style=" border-radius: 5px; color:black; text-decoration: none;" href="/Home">Continue to Homepage</a></button>');
	        
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.get('/Home', function(req, resp){
    resp.sendFile('./Sound/Home.html', {root: __dirname});
});

app.get('/Home-L', function(req, resp){
    resp.sendFile('./Sound/Home-L.html', {root: __dirname});
});

app.get('/Menu-L', function(req, resp){
    resp.sendFile('./Sound/Menu-L.html', {root: __dirname});
});

app.get('/Search-L', function(req, resp){
    resp.sendFile('./Sound/search-L.html', {root: __dirname});
});

app.get('/Tracker-L', function(req, resp){
    resp.sendFile('./Sound/Tracker-L.html', {root: __dirname});
});

app.get('/Order-L', function(req, resp){
    resp.sendFile('./Sound/Ordernow-L.html', {root: __dirname});
});

app.get('/Table-L', function(req, resp){
    resp.sendFile('./Sound/Table-L.html', {root: __dirname});
});

app.get('/Delivery-L', function(req, resp){
    resp.sendFile('./Sound/Delivery-L.html', {root: __dirname});
});

app.get('/nogo', function(req, resp){
    resp.sendFile('./Images/logo.ico', {root: __dirname});
});

app.get('/logo', function(req, resp){
    resp.sendFile('./Images/Castorlogo.jpg', {root: __dirname});
});

app.get('/page', function(req, resp){
    resp.sendFile('./Images/Homepage.jpg', {root: __dirname});
});

app.get('/Menu', function(req, resp){
    resp.sendFile('./Sound/Menu.html', {root: __dirname});
});

app.get('/Order', function(req, resp){
    resp.sendFile('./Sound/Ordernow.html', {root: __dirname});
});

app.get('/Search', function(req, resp){
    resp.sendFile('./Sound/Search.html', {root: __dirname});
});

app.get('/delivery', function(req, resp){
    resp.sendFile('./Sound/Delivery.html', {root: __dirname});
});

app.get('/table', function(req, resp){
    resp.sendFile('./Sound/Table.html', {root: __dirname});
});

app.get('/Tracker', function(req, resp){
    resp.sendFile('./Sound/Tracker.html', {root: __dirname});
});

app.post('/Tracker', function(request, response) {
    var number = request.body.number;
    var address = request.body.address;
	
    if (number && address) {
		connection.query('INSERT INTO track (number, address) values (?,?)', [number, address], function(error, results, fields) {
			if (error) {
				console.log("error ocurred",error);
				response.send('invalid number !');
			}else{
				console.log('The solution is: ', results);
				response.send('<p>Your order will be ready in 15mins,</p><br> '+' '+'<h5>You order will be delivered to:</h5>'+request.body.address+'  '+'<br><h5>This number:'+"  "+request.body.number+"  "+'will be called for further info.</h5> ' +  '<br> <button style="background:lavender;"><a style=" border-radius: 5px; color:black; text-decoration: none;" href="/Home-L">Go back to Homepage</a></button>');
			}	
			response.end();
		});
	}	
});	
app.get('/sbfsuya', function(req, resp){
    resp.sendFile('./Images/beefsuya.jpg', {root: __dirname});
});

app.get('/schpie', function(req, resp){
    resp.sendFile('./Images/chickenpie.jpg', {root: __dirname});
});

app.get('/smpie', function(req, resp){
    resp.sendFile('./Images/meatpie.jpg', {root: __dirname});
});

app.get('/smokie', function(req, resp){
    resp.sendFile('./Images/smokie.jpg', {root: __dirname});
});

app.get('/mbbqchicken', function(req, resp){
    resp.sendFile('./Imagem/bbqchicken.jpg', {root: __dirname});
});

app.get('/mpproni', function(req, resp){
    resp.sendFile('./Imagem/pepperoni.jpg', {root: __dirname});
});

app.get('/mmpie', function(req, resp){
    resp.sendFile('./Imagem/meatpie.jpg', {root: __dirname});
});

app.get('/mchpie', function(req, resp){
    resp.sendFile('./Imagem/chickenpie.jpg', {root: __dirname});
});

app.get('/meatza', function(req, resp){
    resp.sendFile('./Imagel/bbqchicken.jpg', {root: __dirname});
});

app.get('/lchsuya', function(req, resp){
    resp.sendFile('./Imagel/chickensuya.jpg', {root: __dirname});
});

app.get('/deluxe', function(req, resp){
    resp.sendFile('./Imagel/Deluxe.jpg', {root: __dirname});
});

app.get('/sweetie', function(req, resp){
    resp.sendFile('./Imagel/Sweetie.jpg', {root: __dirname});
});

app.listen(3000, 
    console.log('server is listening at 3000')
    );