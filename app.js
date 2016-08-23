var express = require('express');
var path = require('path');
var mongo = require('mongodb');
var app = express();
var api = require('./api.js');
var dotenv=require('dotenv').config({
  silent: true
});
var port = process.env.PORT || 8080;
var url = process.env.MONGOLAB_URI || "mongodb://liketaurus-fcc-back-full-3539759:27017/liketaurusurls";

//app.engine('html', require('ejs').renderFile);

// app.route('/')
//     .get(function(req, res) {
//      res.sendFile(process.cwd() + '/ui/index.html');
//     });
    
// app.route('/new')
//     .get(function(req, res) {
//       res.render(process.cwd() + '/ui/error.html', {
//         err: "You need to add a proper url after the '/new/' url portion"
//       });
//     });

mongo.MongoClient.connect(url, function(err, db) {

  if (err) {
    throw new Error('Database failed to connect!');
  } else {
    console.log('Successfully connected to MongoDB on port 27017.');
  }
 

  db.createCollection("queries", {
    capped: true,
    size: 5000000,
    max: 5000
  });
  
  console.log(process.env.MONGOLAB_URI);
  api(app, db);
  
});


app.listen(port, function() {
    console.log('Application started on port ' + port);
});