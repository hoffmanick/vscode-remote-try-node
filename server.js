/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

const express = require('express');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// App
const app = express();

const mysql = require('mysql');

const con = mysql.createConnection({
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
  });
});

app.get('/', (req, res) => {
	res.send('Hello remote world!\n');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);