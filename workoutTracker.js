var express = require('express');
var mysql = require('./public/js/dbcon.js');

var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('port', 51524);

app.use(express.static('public'));


app.use(function (req, res, next) {
	// Website sending requests
	res.setHeader('Access-Control-Allow-Origin', 'http://web.engr.oregonstate.edu');
	// Request method that you are allowing (we are using GET)
	res.setHeader('Access-Control-Allow-Methods', 'GET');
	// Request header types that are allowed
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	// The following is set to false since we won't be addressing cookies and sessions
	res.setHeader('Access-Control-Allow-Credentials', false);
	// Proceed to the next layer of middleware
	next();
});	

//Route to create/reset workouts table, grabbed from lecture
app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.send(context);
    })
  });
});


app.get('/',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
	console.log(context);
    res.send(context);
  });
});


app.get('/insert',function(req,res,next){
  var context = {};
  var newRow = {
	name: req.query.name,
	reps: req.query.reps,
	weight: req.query.weight,
	date: req.query.date,
	lbs: req.query.lbs
  };
  
  mysql.pool.query("INSERT INTO workouts SET ?", newRow, function(err, result){
    if(err){
      next(err);
	  context.results = 'Insert Failed';
	  res.send(context);
      return;
    }
	context.results = "Inserted workout ";
	console.log(context);
	res.send(context);
  });
});


app.get('/delete',function(req,res,next){
  var context = {};
  
  mysql.pool.query("DELETE FROM workouts WHERE id = ?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
	context.results = "Deleted Workout";
	console.log(context);
	res.send(context);
  });
});


app.get('/update',function(req,res,next){
  var context = {};
  
  mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ", 
  [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs, req.query.id], 
  function(err, result){
    if(err){
      next(err);
	  context.results = 'Update Failed';
	  res.send(context);
      return;
    }
	context.results = "Inserted update ";
	console.log(context);
	res.send(context);
  });
});




app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});