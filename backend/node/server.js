const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');
const Router = express.Router();

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

//GET; return all of the Users
app.get('/users', function (req, res) {
  console.log("INSIDE USERS API CALL");
	connection.query('SELECT * FROM `MrPharma`.`User`;', function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

/////////////////////////////////////////////// INSURANCE //////////////////////////////////////////////////

//GET; return all of the Insurances
app.get('/insurances', function (req, res) {
  console.log("INSIDE Insurances API CALL");
	connection.query('SELECT * FROM `MrPharma`.`Insurance`;', function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});



/////////////////////////////////////////////// PHARMACY //////////////////////////////////////////////////

// GET; For getting all of Pharmacy
app.get('/pharmacy', function (req, res) {
  console.log("INSIDE PHARMACY API CALL");
	connection.query('SELECT * FROM `MrPharma`.`Pharmacy`;', function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//User Story 5.2 [READ] - I want to be able to compare pharmacies
app.get('/comparepharmacies/:pharm1/:pharm2', function (req, res) {
  console.log("INSIDE compare pharmacy API CALL");
  var pharmacyName1 = req.param('pharm1');
  var pharmacyName2 = req.param('pharm2');
  connection.query("SELECT * FROM `MrPharma`.`Pharmacy` WHERE PharmacyName = ? UNION SELECT * FROM `MrPharma`.`Pharmacy` WHERE PharmacyName = ?;", 
    [pharmacyName1, pharmacyName2], function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//User Story 5.3 [READ] I want to be able to choose a pharmacy for myself
app.get('/choosepharmacy/:pharmacy', function (req, res) {
  console.log("INSIDE choose pharmacy API CALL");
  var pharmacyName1 = req.param('pharmacy');
  connection.query("SELECT * FROM `MrPharma`.`Pharmacy` WHERE PharmacyName = ? ;", [pharmacyName1], function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//User Story 5.4 [READ] I want to be able to contact pharmacies
app.get('/contactpharmacy/:pharmacy', function (req, res) {
  console.log("INSIDE choose pharmacy API CALL");
  var pharmacyName1 = req.param('pharmacy');
  connection.query("SELECT Phone FROM `MrPharma`.`Pharmacy` WHERE PharmacyName = ? ;", [pharmacyName1], function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//User Story 5.5 [READ] I want to be able to search for pharmacies based on insurance accepted, prices, etc
app.get('/searchpharmacies/:insuranceID', function (req, res) {
  console.log("INSIDE filter pharmacy API CALL");
  var insurance = req.param('insuranceID');
  connection.query("SELECT ALL PharmacyName FROM `MrPharma`.`Pharmacy` WHERE InsuranceID = ? ;", insurance, function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//////////////////////////////////////// PRESCRIPTION BRANDS ////////////////////////////////////////////
 //GET; return all of the Prescription Brands
//http://localhost:8000/prescriptionbrands
app.get('/prescriptionbrands', function (req, res) {;
    connection.query("Select * from PrescriptionBrand;", function (err, result, fields) {
        if (err) throw err;
        res.end(JSON.stringify(result)); // Result in JSON format
    });
   });


//Create a prescription brand
//Sample parameters below, used in filling in the required parameters listed
//BrandName VARCHAR(50) NULL,
//Description TEXT NULL,
//Image
//('Pfizer', 'an American multinational pharmaceutical corporation headquartered in New York City', NULL)
//http://localhost:8000/addprescriptionbrand/withimage/:name/:description/:image
app.post('/addprescriptionbrand/withimage/:name/:description/:image', async(req, res) => {
  var brandName = req.param('name')
  var descript = req.param('description')
  var pic = req.param('image')
  connection.query(`INSERT INTO PrescriptionBrand (BrandName, Description, Image) 
  VALUES (?, ?, ?);`, [brandName, descript, pic], function (err, result, fields) {
            if (err) throw err;
            res.end(JSON.stringify(result)); // Result in JSON format
       });
  });

//http://localhost:8000/addprescriptionbrand/withoutimage/:name/:description
  app.post('/addprescriptionbrand/withoutimage/:name/:description', async(req, res) => {
    var brandName = req.param('name')
    var descript = req.param('description')
    connection.query(`INSERT INTO PrescriptionBrand (BrandName, Description, Image) 
    VALUES (?, ?, NULL);`, [brandName, descript], function (err, result, fields) {
              if (err) throw err;
              res.end(JSON.stringify(result)); // Result in JSON format
         });
    });

//[DELETE] a prescription brand
//http://localhost:8000/deleteprescriptionbrand/:name
app.delete('/deleteprescriptionbrand/:name', async (req, res) => {
	var prescriptionName = req.param('name')
	connection.query("DELETE FROM PrescriptionBrand WHERE BrandName = ?;", prescriptionName,function (err, result, fields) {
		if (err) 
			return console.error(error.message);
		res.end(JSON.stringify(result)); 
	  });

});

//[READ] search for a prescription brand
//http://localhost:8000/prescriptionbrand/search/:name
app.get('/prescriptionbrand/search/:name', function (req, res) {
  var search = req.param('name')
  connection.query("Select * From PrescriptionBrand WHERE BrandName = ?;",search, function (err, result, fields) {
        if (err) throw err; //Need to figure out how to add if doesn't exist
        res.end(JSON.stringify(result)); // Result in JSON format
    });
  });

///////////////////////////////////////// PRESCRIPTION ////////////////////////////////////////////////
 //GET; return all of the Prescriptions
//http://localhost:8000/prescriptions
app.get('/prescriptions', function (req, res) {
  connection.query("Select * from Prescription;", function (err, result, fields) {
      if (err) throw err;
      res.end(JSON.stringify(result)); // Result in JSON format
  });
 });


//1.1 [CREATE] non-recurring prescription
//http://localhost:8000/prescription/addnonrecurring/:name/:startdate/:isrefillable/:description/:comments/:brand_id/:enddate/:price/:refilldate/:refillcount/:code_pin
//Sample parameters below, used in filling in the required parameters listed
        // "PrescriptionName": "Inserting Dummy",
        // "StartDate": "2020-02-20T00:00:00.000Z",
        // "isRefillable": 0,
        // "PrescriptionDescription": "This is a dummy insert",
        // "Comments": "Dummy prescript is good",
        // "Brand_ID": 5,
        // "EndDate": "2025-02-20T00:00:00.000Z",
        // "BuyPrice": 100,
        // "RefillDate": "2022-02-20T00:00:00.000Z",
        // "RefillCount": 5,
        // "Code_Pin": 2
app.post('/prescription/addnonrecurring/:name/:startdate/:isrefillable/:description/:comments/:brand_id/:enddate/:price/:refilldate/:refillcount/:code_pin', async(req, res) => {
  var prescriptName = req.param('name')
  var start = req.param('startdate')
  var refillable = req.param('isrefillable')
  var descript = req.param('description')
  var comment = req.param('comments')
  var brand = req.param('brand_id')
  var end = req.param('enddate')
  var cost = req.param('price')
  var refillDate = req.param('refilldate')
  var refillCount = req.param('refillcount')
  var code = req.param('code_pin')
  connection.query(`INSERT INTO Prescription (PrescriptionName, StartDate, isRefillable, isRecurring, 
  PrescriptionDescription, Comments, Brand_ID, EndDate, BuyPrice, RefillDate, RefillCount, PausePrescription, 
  Code_Pin) VALUES (?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, NULL, ?);`, [prescriptName, start, refillable, descript, comment, brand, end, cost, refillDate, refillCount, code], function (err, result, fields) {
          if (err) throw err;
          res.end(JSON.stringify(result)); // Result in JSON format
     });
  });

//1.2 [READ] prescriptions that run out and are no longer eligible for refills
//to be designated as a past prescription
//http://localhost:8000/prescriptionOutOfUse
app.get('/prescriptionOutOfUse', function (req, res) {
  connection.query("Select * from Prescription WHERE isRefillable = 0 AND EndDate < '2020-04-25';", function (err, result, fields) {
      if (err) throw err;
      res.end(JSON.stringify(result)); // Result in JSON format
  });
 });

//1.3 [UPDATE] I want to be able to edit a prescription that I have entered
//Update the name of the prescription
//Parameters; Old name = old prescription name; New name = new prescription name
//http://localhost:8000/prescription/updatename/:oldname/:newname
app.put('/prescription/updatename/:oldname/:newname', async (req, res) => {
  var prevName = req.param('oldname')
  var newName = req.param('newname')
  connection.query("UPDATE Prescription Set PrescriptionName = ? WHERE PrescriptionName = ?;", [newName, prevName], function(err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); 
	});
});


//1.3 [UPDATE] I want to be able to edit a prescription that I have entered
//Update the StartDate of the prescription
//Parameters; Name = name of prescription; New date = new start date
//http://localhost:8000/prescription/updatestartdate/:name/:newdate
app.put('/prescription/updatestartdate/:name/:newdate', async (req, res) => {
  var prevName = req.param('name')
  var newName = req.param('newdate')
  connection.query("UPDATE Prescription Set StartDate = ? WHERE PrescriptionName = ?;", [newName, prevName], function(err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); 
	});
});


//1.3 [UPDATE] I want to be able to edit a prescription that I have entered
//Update whether the prescription is refillable
//Parameters; Name = name of prescription; Refillable = new is refillable
//http://localhost:8000/prescription/updaterefillable/:name/:refillable
app.put('/prescription/updaterefillable/:name/:refillable', async (req, res) => {
  var prevName = req.param('name')
  var refill = req.param('refillable')
  connection.query("UPDATE Prescription Set isRefillable = ? WHERE PrescriptionName = ?;", [refill, prevName], function(err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); 
	});
});

//1.3 [UPDATE] I want to be able to edit a prescription that I have entered
//Update whether the prescription is recurring
//Parameters; Name = name of prescription; Recurr = new is recurring value
//http://localhost:8000/prescription/updaterecurring/:name/:recurr
app.put('/prescription/updaterecurring/:name/:recurr', async (req, res) => {
  var prevName = req.param('name')
  var recurring = req.param('recurr')
  connection.query("UPDATE Prescription Set isRecurring = ? WHERE PrescriptionName = ?;", [recurring, prevName], function(err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); 
	});
});

//1.3 [UPDATE] I want to be able to edit a prescription that I have entered
//Update description of the prescription
//Parameters; Name = name of prescription; Descript = new description
//http://localhost:8000/prescription/updatedescript/:name/:descript
app.put('/prescription/updatedescript/:name/:descript', async (req, res) => {
  var prevName = req.param('name')
  var description = req.param('descript')
  connection.query("UPDATE Prescription Set PrescriptionDescription = ? WHERE PrescriptionName = ?;", [description, prevName], function(err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); 
	});
});

//1.3 [UPDATE] I want to be able to edit a prescription that I have entered
//Update comment of the prescription
//Parameters; Name = name of prescription; Comment = new comment
//http://localhost:8000/prescription/updatecomment/:name/:comment
app.put('/prescription/updatecomment/:name/:comment', async (req, res) => {
  var prevName = req.param('name')
  var newComment = req.param('comment')
  connection.query("UPDATE Prescription Set Comments = ? WHERE PrescriptionName = ?;", [newComment, prevName], function(err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); 
	});
});


//1.3 [UPDATE] I want to be able to edit a prescription that I have entered
//Update EndDate of the prescription
//Parameters; Name = name of prescription; Enddate = new end date
//http://localhost:8000/prescription/updateenddate/:name/:enddate
app.put('/prescription/updateenddate/:name/:enddate', async (req, res) => {
  var prevName = req.param('name')
  var endDate = req.param('enddate')
  connection.query("UPDATE Prescription Set EndDate = ? WHERE PrescriptionName = ?;", [endDate, prevName], function(err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); 
	});
});


//1.3 [UPDATE] I want to be able to edit a prescription that I have entered
//Update Buy Price of the prescription
//Parameters; Name = name of prescription; Price = new buy price
//http://localhost:8000/prescription/updatebuyprice/:name/:price
app.put('/prescription/updatebuyprice/:name/:price', async (req, res) => {
  var prevName = req.param('name')
  var buyPrice = req.param('price')
  connection.query("UPDATE Prescription Set BuyPrice = ? WHERE PrescriptionName = ?;", [buyPrice, prevName], function(err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); 
	});
});


//1.3 [UPDATE] I want to be able to edit a prescription that I have entered
//Update Refill date of the prescription
//Parameters; Name = name of prescription; Refill Date = new refill date
//http://localhost:8000/prescription/updaterefilldate/:name/:refilldate
app.put('/prescription/updaterefilldate/:name/:refilldate', async (req, res) => {
  var prevName = req.param('name')
  var refillDate = req.param('refilldate')
  connection.query("UPDATE Prescription Set RefillDate = ? WHERE PrescriptionName = ?;", [refillDate, prevName], function(err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); 
	});
});


//1.3 [UPDATE] I want to be able to edit a prescription that I have entered
//Update Refill count of the prescription
//Parameters; Name = name of prescription; Refill Count = new refill count
//http://localhost:8000/prescription/updaterefillcount/:name/:refillcount
app.put('/prescription/updaterefillcount/:name/:refillcount', async (req, res) => {
  var prevName = req.param('name')
  var refillCount= req.param('refillcount')
  connection.query("UPDATE Prescription Set RefillCount = ? WHERE PrescriptionName = ?;", [refillCount, prevName], function(err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); 
	});
});


//1.3 [UPDATE] I want to be able to edit a prescription that I have entered
//Update pause prescription
//Parameters; Name = name of prescription; Pause date = new pause prescription date
//http://localhost:8000/prescription/pauseprescription/:name/:pausedate
app.put('/prescription/pauseprescription/:name/:pausedate', async (req, res) => {
  var prevName = req.param('name')
  var pauseDate = req.param('pausedate')
  connection.query("UPDATE Prescription Set PausePrescription = ? WHERE PrescriptionName = ?;", [pauseDate, prevName], function(err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); 
	});
});


//1.3 [UPDATE] I want to be able to edit a prescription that I have entered
//Update paused prescription so it is not paused
//Parameters; Name = name of prescription
//http://localhost:8000/prescription/unpauseprescription/:name
app.put('/prescription/unpauseprescription/:name', async (req, res) => {
  var prevName = req.param('name')
  connection.query("UPDATE Prescription Set PausePrescription = NULL WHERE PrescriptionName = ?;", prevName, function(err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); 
	});
});


//1.4 [READ] I want to sort prescriptions by the date they were added
//http://localhost:8000/prescriptionSortByAddDate
app.get('/prescriptionSortByAddDate', function (req, res) {
    connection.query("Select * from Prescription order by StartDate;", function (err, result, fields) {
        if (err) throw err;
        res.end(JSON.stringify(result)); // Result in JSON format
    });
   });


//1.5 [DELETE] non-recurring prescription
// http://localhost:8000/deleteprescription/:name
app.delete('/deleteprescription/:name', async (req, res) => {
	var prescriptionName = req.param('name')
	connection.query("DELETE FROM Prescription WHERE PrescriptionName = ?;", prescriptionName,function (err, result, fields) {
		if (err) 
			return console.error(error.message);
		res.end(JSON.stringify(result)); 
	  });

});

//1.6 I want to be able to search my prescription by name out of all my prescriptions
//http://localhost:8000/prescriptionsearch/:name
app.get('/prescriptionsearch/:name', function (req, res) {
  var search = req.param('name')
  connection.query("Select * From Prescription WHERE PrescriptionName = ?;",search, function (err, result, fields) {
        if (err) throw err; //Need to figure out how to add if doesn't exist
        res.end(JSON.stringify(result)); // Result in JSON format
    });
   });



//1.7 I want to be able to filter prescriptions by recurring and non-recurring
//http://localhost:8000/prescriptionShowRecurring
 app.get('/prescriptionShowRecurring', function (req, res) { //Case statement
    connection.query('Select * From Prescription WHERE isRecurring = 1;', function (err, result, fields) {
        if (err) throw err;
        res.end(JSON.stringify(result)); // Result in JSON format
    });
   });

//http://localhost:8000/prescriptionShowNonRecurring
app.get('/prescriptionShowNonRecurring', function (req, res) { //Case statement
      connection.query('Select * From Prescription WHERE isRecurring = 0;', function (err, result, fields) {
          if (err) throw err;
          res.end(JSON.stringify(result)); // Result in JSON format
      });
     });

//1.8 [UPDATE] comment on a prescription
//Think I need to change this one


// 1.9 [DELETE] comment on a prescription
//http://localhost:8000/prescription/deletecomment/:name
app.delete('/prescription/deletecomment/:name', async (req, res) => {
	var prescriptionName = req.param('name')
	connection.query(`UPDATE Prescription SET Comments = ' ' WHERE PrescriptionName = ?;`, prescriptionName,function (err, result, fields) {
		if (err) 
			return console.error(error.message);
		res.end(JSON.stringify(result)); 
	  });

});

// 2.1 I want medications that are recurring to be distinguished from the rest
//See 1.7

//2.2 [CREATE] recurring medication
//Sample parameters below, used in filling in the required parameters listed
        // "PrescriptionName": "Inserting Dummy",
        // "StartDate": "2020-02-20T00:00:00.000Z",
        // "isRefillable": 0,
        // "PrescriptionDescription": "This is a dummy insert",
        // "Comments": "Dummy prescript is good",
        // "Brand_ID": 5,
        // "EndDate": "2025-02-20T00:00:00.000Z",
        // "BuyPrice": 100,
        // "RefillDate": "2022-02-20T00:00:00.000Z",
        // "RefillCount": 5,
        // "Code_Pin": 2
//http://localhost:8000/prescription/addrecurring/:name/:startdate/:isrefillable/:description/:comments/:brand_id/:enddate/:price/:refilldate/:refillcount/:code_pin
app.post('/prescription/addrecurring/:name/:startdate/:isrefillable/:description/:comments/:brand_id/:enddate/:price/:refilldate/:refillcount/:code_pin', async(req, res) => {
    var prescriptName = req.param('name')
    var start = req.param('startdate')
    var refillable = req.param('isrefillable')
    var descript = req.param('description')
    var comment = req.param('comments')
    var brand = req.param('brand_id')
    var end = req.param('enddate')
    var cost = req.param('price')
    var refillDate = req.param('refilldate')
    var refillCount = req.param('refillcount')
    var code = req.param('code_pin')
    connection.query(`INSERT INTO Prescription (PrescriptionName, StartDate, isRefillable, isRecurring, 
    PrescriptionDescription, Comments, Brand_ID, EndDate, BuyPrice, RefillDate, RefillCount, PausePrescription, 
    Code_Pin) VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, NULL, ?);`, [prescriptName, start, refillable, descript, comment, brand, end, cost, refillDate, refillCount, code], function (err, result, fields) {
        if (err) throw err;
        res.end(JSON.stringify(result)); // Result in JSON format
      });
    });

// 2.3 [UPDATE] I want to change recurring information of added medications
// See 1.3

// 2.4 I want to pause a recurring medication for a period of time.
//See 1.3



// 2.5 [DELETE] recurring medication
//See 1.5

// 3.1 I want to distinguish my prescriptions that need to be refilled from the rest
//http://localhost:8000/refillables
app.get('/refillables', function (req, res) {
  connection.query("Select * from Prescription where isRefillable = 1;", function (err, result, fields) {
        if (err) throw err; //Need to figure out how to add if doesn't exist
        res.end(JSON.stringify(result)); // Result in JSON format
    });
   });

// 3.2 I want a prescription that is about to run out to be able to be distinguished from the others
//http://localhost:8000/refillables
app.get('/prescriptiondistinguishrunout', function (req, res) {
    connection.query("Select * From Prescription Order by RefillDate asc, EndDate asc;", function (err, result, fields) {
          if (err) throw err; //Need to figure out how to add if doesn't exist
          res.end(JSON.stringify(result)); // Result in JSON format
      });
     });

// 3.4 I want to see a recommended refill date for eligible prescriptions
//http://localhost:8000/prescription/recommendedrefilldate/:prescriptionname
app.get('/prescription/recommendedrefilldate/:prescriptionname', function (req, res) {
  var prescriptionName = req.param('prescriptionname')
  connection.query("Select RefillDate as RecommendedRefillDate From Prescription where PrescriptionName = ?;", prescriptionName, function (err, result, fields) {
        if (err) throw err; //Need to figure out how to add if doesn't exist
        res.end(JSON.stringify(result)); // Result in JSON format
    });
   });


// 3.5 [READ] remaining refills
//http://localhost:8000/prescription/remainingrefills/:prescriptionname
app.get('/prescription/remainingrefills/:prescriptionname', function (req, res) {
  var prescriptionName = req.param('prescriptionname')
  connection.query("Select RefillCount as RemainingRefills From Prescription where PrescriptionName = ?;", prescriptionName, function (err, result, fields) {
        if (err) throw err; //Need to figure out how to add if doesn't exist
        res.end(JSON.stringify(result)); // Result in JSON format
    });
   });

// 4.1 [READ] dosage frequency
//Same as remaining refills?

// 4.2 [READ] potential medication interactions
// Same as 4.5

// 4.3 [READ] medication ingredients
//http://localhost:8000/prescription/ingredients/:prescriptionname
app.get('/prescription/ingredients/:prescriptionname', function (req, res) {
  var prescriptionName = req.param('prescriptionname')
  connection.query("Select PrescriptionDescription as Ingredients From Prescription where PrescriptionName = ?;", prescriptionName, function (err, result, fields) {
        if (err) throw err; //Need to figure out how to add if doesn't exist
        res.end(JSON.stringify(result)); // Result in JSON format
    });
   });

// 4.4 [READ] medication shelf life
//http://localhost:8000/prescription/shelflife/:prescriptionname
app.get('/prescription/shelflife/:prescriptionname', function (req, res) {
  var prescriptionName = req.param('prescriptionname')
  connection.query("Select EndDate as ShelfLife From Prescription where PrescriptionName = ?;", prescriptionName, function (err, result, fields) {
        if (err) throw err; //Need to figure out how to add if doesn't exist
        res.end(JSON.stringify(result)); // Result in JSON format
    });
   });

// 4.5 [READ] medication effects
//http://localhost:8000/prescription/effects/:prescriptionname
app.get('/prescription/effects/:prescriptionname', function (req, res) {
  var prescriptionName = req.param('prescriptionname')
  connection.query("Select PrescriptionDescription as Effects From Prescription where PrescriptionName = ?;", prescriptionName, function (err, result, fields) {
        if (err) throw err; //Need to figure out how to add if doesn't exist
        res.end(JSON.stringify(result)); // Result in JSON format
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


//connecting the express object to listen on a particular port as defined in the config object.
app.listen(config.port, config.host, (e) => {
  if (e) {
    throw new Error('Internal Server Error');
  }
  logger.info(`${config.name} running on ${config.host}:${config.port}`);
});
