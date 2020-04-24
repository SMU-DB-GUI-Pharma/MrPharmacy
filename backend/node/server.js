// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const mysql = require('mysql');
// const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');

// //mysql connection
// var connection = mysql.createConnection({
//   host: 'mysql',
//   port: '3306',
//   user: 'manager',
//   password: 'password',
//   database: 'MrPharma'
// });

// //set up some configs for express.
// const config = {
//   name: 'sample-express-app',
//   port: 8000,
//   host: '0.0.0.0',
// };

// //create the express.js object
// const app = express();

// //create a logger object.  Using logger is preferable to simply writing to the console.
// const logger = log({ console: true, file: false, label: config.name });

// app.use(bodyParser.json());
// app.use(cors({
//   origin: '*'
// }));
// app.use(ExpressAPILogMiddleware(logger, { request: true }));

// //Attempting to connect to the database.
// connection.connect(function (err) {
//   if (err){
// 	logger.error("Cannot connect to DB!");
//   }
//   else{
// 	logger.info("Connected to the DB!");
//   }
// });


// //GET /
// app.get('/', (req, res) => {
//   res.status(200).send('Go to 0.0.0.0:3000.');
// });

// //GET; return all of the prescription brands
// app.get('/prescriptionBrand', function (req, res) {
// 	connection.query("SELECT * FROM MrPharma.PrescriptionBrand", function (err, result, fields) {
// 		if (err) throw err;
// 		res.end(JSON.stringify(result)); // Result in JSON format
// 	});
// });

// //GET; return all of the insurances
// app.get('/insurances', function (req, res) {
// 	connection.query("SELECT * FROM Insurance", function (err, result, fields) {
// 		if (err) throw err;
// 		res.end(JSON.stringify(result)); // Result in JSON format
// 	});
// });

// //GET; return all of the Prescriptions
// app.get('/prescriptions', function (req, res) {
// 	connection.query("SELECT * FROM Prescription", function (err, result, fields) {
// 		if (err) throw err;
// 		res.end(JSON.stringify(result)); // Result in JSON format
// 	});
// });

// //GET; return all of the users
// app.get('/users', function (req, res) {
// 	connection.query("SELECT * FROM User", function (err, result, fields) {
// 		if (err) throw err;
// 		res.end(JSON.stringify(result)); // Result in JSON format
// 	});
// });

// //GET; for user/{username}, need to return their information
// app.get('/user/:username', function (req, res) {
// 	connection.query("SELECT * FROM user u where u.username = ?", [req.params.userName], function (err, result, fields) {
// 		if (err) throw err;
// 		res.end(JSON.stringify(result)); // Result in JSON format
// 	});
// });

// //GET; For getting all of payments
// app.get('/payments', function (req, res) {
// 	connection.query("SELECT * FROM payments", function (err, result, fields) {
// 		if (err) throw err;
// 		res.end(JSON.stringify(result)); // Result in JSON format
// 	});
// });

// //GET; For getting all of Pharmacy
// app.get('/pharmacy', function (req, res) {
// 	con.query("SELECT * FROM Pharmacy", function (err, result, fields) {
// 		if (err) { throw err;} 
// 		res.end(JSON.stringify(result)); // Result in JSON format
// 	});
// });

// //GET; For getting a specific pharmacy
// app.get('/pharmacy/:productCode', function (req, res) {
// 	con.query("SELECT * FROM pharmacy p WHERE p.pharmacyName = ?", [req.params.pharmacyName], function (err, result, fields) {
// 		if (err) throw err;
// 		res.end(JSON.stringify(result)); // Result in JSON format
// 	});
// });


// // POST; For adding a user
// app.post('/users', async (req, res) => {  
// 	var querystring = `INSERT INTO User VALUES ('${con.escape(req.params.userName)}', '${con.escape(req.params.userPassword)}', '${con.escape(req.params.pinCode)}', '${con.escape(req.params.totalCostPrescriptions)}', '${con.escape(req.params.monthlyCost)}')`;
// 	con.query(querystring, function (err, result, fields) {
// 		if (err) throw err;
// 		res.end(JSON.stringify(result)); // Result in JSON format
// 	});
// });

// // POST; for adding a pharmacy
// app.post('/pharmacy', async (req, res) => {  
// 	var querystring = `INSERT INTO pharmacy VALUES ('${con.escape(req.params.PharmacyName)}', '${con.escape(req.params.AddressLine1)}', '${con.escape(req.params.AddressLine2)}', '${con.escape(req.params.City)}', '${con.escape(req.params.State)}', '${con.escape(req.params.PostalCode)}', '${con.escape(req.params.Country)}', '${con.escape(req.params.Phone)}', '${con.escape(req.params.InsuranceID)}', '${con.escape(req.params.CodePin)}')`;
// 	con.query(querystring, function (err, result, fields) {
// 		if (err) throw err;
// 		res.end(JSON.stringify(result)); // Result in JSON format
// 	});
// });

// // POST; for adding a pharmacy brand
// app.post('/pharmacyBrand', async (req, res) => {  
// 	var querystring = `INSERT INTO PharmacyBrand VALUES ('${con.escape(req.params.BrandName)}', '${con.escape(req.params.Description)}', '${con.escape(req.params.image)}')`;
// 	con.query(querystring, function (err, result, fields) {
// 		if (err) throw err;
// 		res.end(JSON.stringify(result)); // Result in JSON format
// 	});
// });

// // POST; for adding a prescription
// app.post('/prescription', async (req, res) => {  
// 	var querystring = `INSERT INTO Prescription VALUES ('${con.escape(req.params.PrescriptionName)}', '${con.escape(req.params.StartDate)}', '${con.escape(req.params.isRefillable)}', '${con.escape(req.params.isRecurring)}', '${con.escape(req.params.PrescriptionDescription)}', '${con.escape(req.params.Comments)}', '${con.escape(req.params.BrandName)}', '${con.escape(req.params.EndDate)}', '${con.escape(req.params.BuyPrice)}', '${con.escape(req.params.RefillDate)}', '${con.escape(req.params.RefillCount)}', '${con.escape(req.params.PausePrescription)}', '${con.escape(req.params.code_pin)}')`;
// 	con.query(querystring, function (err, result, fields) {
// 		if (err) throw err;
// 		res.end(JSON.stringify(result)); // Result in JSON format
// 	});
// });

// // POST; for adding an insurance
// app.post('/insurance', async (req, res) => {  
// 	var querystring = `INSERT INTO Insurance VALUES ('${con.escape(req.params.Company)}', '${con.escape(req.params.AddressLine1)}', '${con.escape(req.params.AddressLine2)}', '${con.escape(req.params.City)}', '${con.escape(req.params.State)}', '${con.escape(req.params.PostalCode)}', '${con.escape(req.params.Country)}', '${con.escape(req.params.PhoneNumber)}', '${con.escape(req.params.Email)}', '${con.escape(req.params.code_pin)}')`;
// 	con.query(querystring, function (err, result, fields) {
// 		if (err) throw err;
// 		res.end(JSON.stringify(result)); // Result in JSON format
// 	});
// });

// //POST /setupdb
// app.post('/setupdb', (req, res) => {
//   connection.query('drop table if exists test_table', function (err, rows, fields) {
//     if (err)
//       logger.error("Can't drop table");
//   });
//   connection.query('CREATE TABLE `db`.`test_table` (`id` INT NOT NULL AUTO_INCREMENT, `value` VARCHAR(45), PRIMARY KEY (`id`), UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);', function (err, rows, fields) {
//     if (err)
//       logger.error("Problem creating the table test_table");
//   });
//   connection.query('INSERT INTO `db`.`test_table` (`value`) VALUES (\'4\');', function(err, rows, fields) {
//       if(err)
//         logger.error('adding row to table failed');
//   });
//   res.status(200).send('created the table');
// });

// //POST /multplynumber
// app.post('/multplynumber', (req, res) => {
//   console.log(req.body.product);

//   connection.query('INSERT INTO `db`.`test_table` (`value`) VALUES(\'' + req.body.product + '\')', function (err, rows, fields) {
//     if (err){
//       logger.error("Problem inserting into test table");
//     }
//     else {
//       res.status(200).send(`added ${req.body.product} to the table!`);
//     }
//   });
// });

// //GET /checkdb
// app.get('/values', (req, res) => {
//   connection.query('SELECT value from test_table', function (err, rows, fields) {
//     if (err) {
//       logger.error("Error while executing Query");
//       res.status(400).json({
//         "data": [],
//         "error": "MySQL error"
//       })
//     }
//     else{
//       res.status(200).json({
//         "data": rows
//       });
//     }
//   });
// });

// //connecting the express object to listen on a particular port as defined in the config object.
// app.listen(config.port, config.host, (e) => {
//   if (e) {
//     throw new Error('Internal Server Error');
//   }
//   logger.info(`${config.name} running on ${config.host}:${config.port}`);
// });




const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');

//mysql connection
var connection = mysql.createConnection({
  host: 'backend-db',
  port: '3306',
  user: 'manager',
  password: 'Password',
  database: 'db'
});

//set up some configs for express.
const config = {
  name: 'sample-express-app',
  port: 8000,
  host: '0.0.0.0',
};

//create the express.js object
const app = express();

//create a logger object.  Using logger is preferable to simply writing to the console.
const logger = log({ console: true, file: false, label: config.name });

app.use(bodyParser.json());
app.use(cors({
  origin: '*'
}));
app.use(ExpressAPILogMiddleware(logger, { request: true }));

//Attempting to connect to the database.
connection.connect(function (err) {
  if (err){
	logger.error("canNOT connect to DB");
  }
	else{
		logger.info("Connected to DB!");
	}
});

//GET /
app.get('/', (req, res) => {
  res.status(200).send('Go to 0.0.0.0:3000.');
});

//GET; For getting all of Pharmacy
app.get('/pharmacy', function (req, res) {
	con.query("SELECT * FROM Pharmacy", function (err, result, fields) {
		if (err) { throw err;} 
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//POST /reset
app.post('/reset', (req, res) => {
  connection.query('drop table if exists test_table', function (err, rows, fields) {
    if (err)
      logger.error("Can't drop table");
  });
  connection.query('CREATE TABLE `db`.`test_table` (`id` INT NOT NULL AUTO_INCREMENT, `value` VARCHAR(45), PRIMARY KEY (`id`), UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);', function (err, rows, fields) {
    if (err)
      logger.error("Problem creating the table test_table");
  });
  res.status(200).send('created the table');
});

//POST /multplynumber
app.post('/multplynumber', (req, res) => {
  console.log(req.body.product);

  connection.query('INSERT INTO `db`.`test_table` (`value`) VALUES(\'' + req.body.product + '\')', function (err, rows, fields) {
    if (err){
      logger.error("Problem inserting into test table");
    }
    else {
      res.status(200).send(`added ${req.body.product} to the table!`);
    }
  });
});

//GET /checkdb
app.get('/values', (req, res) => {
  connection.query('SELECT value FROM `db`.`test_table`', function (err, rows, fields) {
    if (err) {
      logger.error("Error while executing Query");
      res.status(400).json({
        "data": [],
        "error": "MySQL error"
      })
    }
    else{
      res.status(200).json({
        "data": rows
      });
    }
  });
});

//connecting the express object to listen on a particular port as defined in the config object.
app.listen(config.port, config.host, (e) => {
  if (e) {
    throw new Error('Internal Server Error');
  }
  logger.info(`${config.name} running on ${config.host}:${config.port}`);
});