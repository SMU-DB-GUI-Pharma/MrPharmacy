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
  database: 'MrPharma',
  // socketPath: '/var/run/mysqld/mysqld.sock'
});

//set up some configs for express.
const config = {
  name: 'sample-express-app',
  port: 8000,
  host: '0.0.0.0',
};

//create the express.js object
const app = express();
//const router = express.Router()

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
    console.log(err);
  }
  else{
    logger.info("Connected to the DB!");
  }
});

//GET /

app.get('/', (req, res) => {
  res.status(200).send('Go to 0.0.0.0:3000.');
});

///////////////////////////////////////////////// USER /////////////////////////////////////////////////////

//get all user information - http://localhost:8000/users
app.get('/users', function (req, res) {
  console.log("INSIDE USERS API CALL");
	connection.query('SELECT * FROM `MrPharma`.`User`;', function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

/////////////////////////////////////////////// INSURANCE //////////////////////////////////////////////////

//return all insurance info - http://localhost:8000/insurances
app.get('/insurances', function (req, res) {
  console.log("INSIDE Insurances API CALL");
	connection.query('SELECT * FROM `MrPharma`.`Insurance`;', function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//User Story 3.3 [CREATE] - I want to be able to update my insurance information in my profile

//http://localhost:8000/addInsurance/:pinCode?insuranceName=Molina Healthcare
//http://localhost:8000/addInsurance/:pinCode?insuranceName=Blue Cross Blue Shield
//replace ':username' with username from User table, replace everything after = to an InsuranceName
app.put('/updateInsurance/:username', async (req, res) => {
  var username = req.param('username');
  var insuranceName = req.param('insuranceName');
  connection.query("Update User SET Insurance = ? WHERE User.Username = ?;", [insuranceName,username], function (err, result, fields) {
    if (err) throw err;
	  res.end(JSON.stringify(result)); // Result in JSON format
  });
});

//User Story 6.3 [CREATE] I want to be given the option of adding my insurance
//http://localhost:8000/addInsurance/:pinCode?insuranceName=UnitedHealth
//replace ':pinCode' with PinCode from User table, replace everything after = to an InsuranceName
app.post('/addInsurance', async (req, res) => {
  var company = req.param('company');
  var address1 = req.param('address1');
  var address2 = req.param('address2');
  var city = req.param('city');
  var state = req.param('state');
  var postalCode = req.param('postalCode');
  var country = req.param('country');
  var phone = req.param('phone');
  var email = req.param('email');
  connection.query("Insert INTO Insurance (Company, AddressLine1, AddressLine2, City, State, PostalCode, Country, PhoneNumber,Email) VALUES (?, ?, ?, ? ,? ,?, ?, ?, ?)", [company, address1, address2, city, state, postalCode, country, phone, email], function (err, result, fields) {
    if (err) throw err;
	  res.end(JSON.stringify(result)); // Result in JSON format
  });
});

//User Story 6.4 [DELETE] Insurance information - this request is a PUT and not DELETE because we are only updating the user's insurance to NULL, not deleting entire user
//http://localhost:8000/insurance/:username
app.put('/insurance/:username', async (req, res) => {
  var username = req.param('username');
  connection.query("Update User SET Insurance = NULL WHERE User.Username = ?;", [username], function (err, result, fields) {
    if (err) throw err;
	  res.end(JSON.stringify(result)); // Result in JSON format
  });
});

/////////////////////////////////////////////// PHARMACY //////////////////////////////////////////////////

//get all pharmacy information - http://localhost:8000/pharmacy
app.get('/pharmacy', function (req, res) {
  console.log("INSIDE PHARMACY API CALL");
	connection.query('SELECT * FROM `MrPharma`.`Pharmacy`;', function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//User Story 5.2 [READ] - I want to be able to compare pharmacies (replace ':pharm#' with a PharmacyID)
//http://localhost:8000/comparepharmacy/:pharm1/:pharm2/:pharm3
app.get('/comparepharmacy/:pharm1/:pharm2/:pharm3', function (req, res) {
  console.log("INSIDE compare pharmacy API CALL");
  var pharmacyName1 = req.param('pharm1');
  var pharmacyName2 = req.param('pharm2');
  var pharmacyName3 = req.param('pharm3');
  connection.query("SELECT * FROM `MrPharma`.`Pharmacy` WHERE PharmacyID = ? UNION SELECT * FROM `MrPharma`.`Pharmacy` WHERE PharmacyID = ? UNION SELECT * FROM `MrPharma`.`Pharmacy` WHERE PharmacyID = ?;", 
    [pharmacyName1, pharmacyName2, pharmacyName3], function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

// User Story 5.3 [READ] I want to be able to choose a pharmacy for myself (replace ':pharmacy' with a PharmacyName)
//http://localhost:8000/choosepharmacy/:pharmacy
app.get('/choosepharmacy/:pharmacy', function (req, res) {
  console.log("INSIDE choose pharmacy API CALL");
  var pharmacyName1 = req.param('pharmacy');
  connection.query("SELECT * FROM `MrPharma`.`Pharmacy` WHERE PharmacyName = ? ;", [pharmacyName1], function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//User Story 5.4 [READ] I want to be able to contact pharmacies (replace ':pharmacy' with a PharmacyName)
//http://localhost:8000/contactpharmacy/:pharmacyName
app.get('/contactpharmacy/:pharmacyName', function (req, res) {
  console.log("INSIDE contact pharmacy API CALL");
  var pharmacyName1 = req.param('pharmacyName');
  connection.query("SELECT PharmacyName, Phone FROM `MrPharma`.`Pharmacy` WHERE PharmacyName = ? ;", [pharmacyName1], function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//User Story 5.5 [READ] I want to be able to search for pharmacies based on insurance accepted (replace ':insuranceChoice#' with an InsuranceName)
//refer to database schema to see which pharmacies match to which insurances
http://localhost:8000/searchpharmacies?insuranceChoice1=Humana&insuranceChoice2=UnitedHealth
app.get('/searchpharmacies', function (req, res) {
  console.log("INSIDE filter pharmacy API CALL");
  var insurance1 = req.param('insuranceChoice1');
  var insurance2 = req.param('insuranceChoice2');
  connection.query("SELECT DISTINCT p.PharmacyName FROM Pharmacy p JOIN  Insurance i on p.InsuranceID1 = i.InsuranceID join Insurance i2 on p.InsuranceID2 = i2.InsuranceID WHERE i.Company = ? OR i2.Company = ? ;", [insurance1, insurance2], function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

////////////////////////////////////////// PRESCRIPTION BRANDS ////////////////////////////////////////////

//get all prescription brand information - http://localhost:8000/prescriptionbrands
app.get('/prescriptionbrands', function (req, res) {
  console.log("INSIDE PRESCRIPTION BARNDS API CALL");
	connection.query('SELECT * FROM `PrescriptionBrand`;', function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

/////////////////////////////////////////// PRESCRIPTION ////////////////////////////////////////////////

//get all prescription information - http://localhost:8000/prescriptions
app.get('/prescriptions', function (req, res) {
  console.log("INSIDE PRESCRIPTION API CALL");
	connection.query('SELECT * FROM `Prescription`;', function (err, result, fields) {
		if (err) throw err;
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
