/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

const express = require('express');
var http = require('http');
var path = require("path");
// var helmet = require('helmet');
// var rateLimit = require("express-rate-limit");

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// App
const app = express();
var server = http.createServer(app);
// const limiter = rateLimit({
//  windowMs: 15 * 60 * 1000,
//  max: 100
// });

const mysql = require('mysql');

const bodyParser = require("body-parser");
var con = mysql.createConnection({
  host: "testid.c9s268qmu83p.us-west-1.rds.amazonaws.com",
  user: "admin",
  password: "data_for_7?",
  database: 'insite_specs_test'
});



con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM specimens", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    var x = result[0].name;
  });
});

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'./')));
// app.use(helmet());
// app.use(limiter);

app.get('/', function(req,res) {

  res.sendFile(path.join(__dirname, './user-list.html'));
});


//add
app.post('/add', function(req,res){
    //var index = [];
    //con.query('SELECT * FROM index_spec', function(err, result, fields) {
    //  if (err) throw err;
    //  Object.keys(result).forEach(function(key){
    //    var val = result[key];
     //   var realvals = Object.values(val);
     //   index = realvals[1];
     //   return index;
     // });
    //});
    
    con.query('INSERT INTO specimens(row_names, specID, species,strain,date,lat,lon,storage) VALUES(default,default, ?,?,?,?,?,?)', [ req.body.species,req.body.strain,req.body.date,req.body.lat,req.body.long,req.body.store], function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("New specimen has been added");
      res.send("New specimen has been added into the database with ID = "+req.body.specID+ " and Name = "+req.body.strain);
    });
});

app.post('/user-list', (req, res) => {
  const sql = 'SELECT * FROM specimens';
  con.query(sql, (err, data) => {
    if (err) throw err;
    Object.keys(data).forEach(function(key){
          var val = data[key];
          var realvals = Object.values(val);

          let result = '<table>';
          for (let el in realvals) {
            result += "<tr><td>" + el + "</td><td>" + realvals[el] + "</td></tr>";
            
          }    
          result +='</table>';

            res.send(result);
        });

   
  //  res.render('user-list', { title: 'User List', userData: data });
  //  console.log(data);
  });
});

app.post('/view', (req, res) => {
  const sql = 'SELECT * FROM specimens';
  con.query(sql, (err, data) => {
    if (err) throw err;
    let result = '<table><tr><td></td><td>specID</td><td>species</td><td>strain</td><td>date</td><td>lat</td><td>long</td><td>storage</td></tr>';
    for (let el in data) {
          var val = data[el];
          console.log(`data: ${data}`);
          console.log(`val: ${val}`);
          var realvals = Object.values(val);
          console.log(`realvals: ${realvals}`);

          result += "<tr>"
        for (let jel in realvals) {
          result += "<td>" + realvals[jel] + "</td>";

            
          }
        result += "</tr>";
        }    
          result +='</table>';

          console.log(result);
          res.send(result);  
        });
       
      });
  
//View
//app.post('/view', function(req,res){
//    con.query('SELECT specID ID, species SPECIES FROM specimens',[req.body.doc_id_msgs], function(err,row){     //db.each() is only one which is funtioning while reading data from the DB
//      if(err){
//        res.send("Error encountered while displaying");
//        return console.error(err.message);
//      }
//
//      res.send(result);
//      console.log("Entry displayed successfully");
//      console.log(`${row.ID}`);
//      console.log(Object.values(row));
//      Object.keys(row).forEach(function(key){
//           var val = row[key];
//           var realvals = Object.values(val);
//           console.log(realvals);
//           return realvals;
//           res.send(realvals);
//         });
//    });
//  });

//UPDATE
app.post('/update', function(req,res){
    con.query('UPDATE specimens SET storage = ? WHERE specID = ?', [req.body.store2,req.body.specID], function(err){
      if(err){
        res.send("Error encountered while updating");
        return console.error(err.message);
      }
      res.send("Entry updated successfully");
      console.log("Entry updated successfully");
    });
  });
//DELETE
app.post('/delete', function(req,res){
    con.query('DELETE FROM specimens WHERE specID = ?', req.body.id, function(err) {
      if (err) {
        res.send("Error encountered while deleting");
        return console.error(err.message);
      }
      res.send("Entry deleted");
      console.log("Entry deleted");
    });
  });


app.get('/close', function(req,res){
  con.close((err) => {
    if (err) {
      res.send('There is some error in closing the database');
      return console.error(err.message);
    }
    console.log('Closing the database connection.');
    res.send('Database connection successfully closed');
  });
});


server.listen(3000,function(){ 
  console.log("Server listening on port: 3000");
})
  
// app.get('/', (req, res) => {
  
// var d_msg = "SELECT * FROM specimens";
// var d_msgs = [req.body.doc_id_msgs];
//  con.query(d_msg, d_msgs, (err, rows) => {
//    if(err){
//     console.log("error ", err);
//    } else {
//      res.send(rows);
//    }
//  });
//});

//app.listen(PORT, HOST);
//console.log(`Running on http://${HOST}:${PORT}`);