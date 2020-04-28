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

//GET 
app.get('/', (req, res) => {
  res.status(200).send('Go to 0.0.0.0:3000.');
});

///////////////////////////////////////////////// USER /////////////////////////////////////////////////////

//GET; return all of the Users
//http://localhost:8000/users
app.get('/users', function (req, res) {
  console.log("INSIDE USERS API CALL");
	connection.query('SELECT * FROM `MrPharma`.`User`;', function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

// 6.1 [CREATE] login with username and password
//http://localhost:8000/auth
app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
    	if (username && password) {
		connection.query('SELECT * FROM User WHERE Username = ? AND Password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
			        response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
       } else {
	    	response.send('Please enter Username and Password!');
                response.end();
    	}
});

//6.5 [READ] I want to be able to sign in to the app with a simple pin code
//http://localhost:8000/login
app.post('/login', function(request, response) {
	var pincode = request.body.pincode;
    	if (pincode) {
		connection.query('SELECT * FROM User WHERE PinCode = ? ', pincode, function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = "User " + pincode;
			        response.redirect('/home');
			} else {
				response.send('Incorrect Pin');
			}			
			response.end();
		});
       } else {
	    	response.send('Please enter you Pin!');
                response.end();
    	}
});

//redirect to home after login
app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

//sign out of the account
//http://localhost:8000/logout
app.get('/logout',function(req,res){    
    req.session.destroy(function(err){  
        if(err){  
            console.log(err);  
        }  
        else  
        {  
            res.redirect('/');  
        }  
   });  
});  

//[DELETE] User account with pin code
//http://localhost:8000/deleteUser/:pincode
app.delete('/deleteUser/:pincode', function(req, res) {
    var pincode = req.param('pincode');
    connection.query("DELETE FROM User WHERE PinCode = ?", pincode,function (err, result, fields) {
		if (err) 
		return console.error(error.message);
		res.end(JSON.stringify(result)); 
        });
});

//[UPDATE] I want to be able to update my monthly costs in advance
//http://localhost:8000/updateCost/:pincode
app.put('/updateCost/:pincode', async (req, res) => {
  var pincode = req.param('pincode');
		connection.query("UPDATE User SET MonthlyCost = TotalCostPrescriptions/12 WHERE PinCode = ?",pincode, function (err, result, fields) {
			if (err) throw err;
			console.log(result);
			res.end(JSON.stringify(result)); 
	});
	
});

//7.2 [READ] I want to be able to see my monthly costs in advance
//http://localhost:8000/Cost/:pincode
app.get('/Cost/:pincode', function (req, res) {
var pincode = req.param('pincode');
	connection.query('SELECT MonthlyCost FROM User WHERE PinCode = ?', pincode, function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});


//[UPDATE] I want to be able to update my total prescriptions cost
//http://localhost:8000/updateTotalCost/:pincode (replace ':pincode' with PinCode from User table)
app.put('/updateTotalCost/:pincode', async (req, res) => {
  var pincode = req.param('pincode');
        connection.query("SELECT SUM(buyPrice) as totalCost FROM Prescription WHERE Code_Pin = ?", pincode, function (err, result, fields) {
	if (err) throw err;
		connection.query("UPDATE User SET TotalCostPrescriptions = ? ", result[0].totalCost, function (err, result, fields) {
			if (err) throw err;
			console.log(result);
			res.end(JSON.stringify(result)); 
		});
	});
	
});


//7.1 [READ] I want to be able to see a running total of what I have spent on different prescriptions
//http://localhost:8000/TotalCost/:pincode
app.get('/TotalCost/:pincode', function (req, res) {
var pincode = req.param('pincode');
	connection.query('SELECT TotalCostPrescriptions FROM User WHERE PinCode = ?', pincode, function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});


//6.1 [CREATE] I want to set my own username and password
//http://localhost:8000/register
app.post('/register', function(req, res) {

	var users={
	 PinCode  :req.body.pincode,
         Username :req.body.username,
         Password :req.body.password
      };
    connection.query('INSERT INTO User SET ?', users, function (error, results, fields) {
      if (error) {
        res.json({
            status:false,
            message:'there are some error with query'
        })
      }else{
          res.json({
            status:true,
            data:results,
            message:'user registered sucessfully'
        })
      }
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
//http://localhost:8000/updateInsurance/:username?insuranceName=Humana
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
  connection.query("SELECT DISTINCT p.PharmacyName, i.Company FROM Pharmacy p JOIN  Insurance i on p.InsuranceID1 = i.InsuranceID join Insurance i2 on p.InsuranceID2 = i2.InsuranceID WHERE i.Company = ? OR i2.Company = ? ;", [insurance1, insurance2], function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//User Story 5.5 [READ] I want to be able to search for pharmacies based on price of prescriptions (replace ':price' with a price and ':prescription' with a PrescriptionName)
// http://localhost:8000/searchpharmacies/:price/:prescription
app.get('/searchpharmacies/:price/:prescription', function (req, res) {
  console.log("inside filter price API call");
  var price = req.param('price');
  var prescription = req.param('prescription');
  connection.query("SELECT DISTINCT p.PharmacyName, ps.PrescriptionName, ps.BuyPrice FROM Pharmacy p JOIN PrescriptionBrand pb on p.BrandID1 = pb.BrandID JOIN Prescription ps on ps.Brand_ID = pb.BrandID WHERE ps.BuyPrice < ? AND ps.PrescriptionName = ? ;", [price, prescription], function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

//User Story 5.5 [READ] I want to be able to search for prescription based on pharmacy (replace ':prescription' with a PrescriptionName)
//http://localhost:8000/searchpharmacies/:prescription
app.get('/searchpharmacies/:prescription', function (req, res) {
  console.log("inside filter prescription API call");
  var prescription = req.param('prescription');
  connection.query("select p.PharmacyName, ps.PrescriptionName from Pharmacy p inner join PrescriptionBrand pb on p.BrandID1 = pb.BrandID inner join PrescriptionBrand pb2 on p.BrandID2 = pb2.BrandID inner join PrescriptionBrand pb3 on p.BrandID3 = pb3.BrandID inner join Prescription ps on ps.Brand_ID = pb.BrandID OR ps.Brand_ID = pb2.BrandID OR ps.Brand_ID = pb3.BrandID WHERE ps.PrescriptionName = ? ;", [prescription], function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); // Result in JSON format
	});
});

////////////////////////////////////////// PRESCRIPTION BRANDS ////////////////////////////////////////////

 //GET; return all of the Prescription Brands
//http://localhost:8000/prescriptionbrands
app.get('/prescriptionbrands', function (req, res) {;
  connection.query("Select * from PrescriptionBrand;", function (err, result, fields) {
      if (err) throw err;
      res.end(JSON.stringify(result)); // Result in JSON format
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
VALUES (?, ?, ?);`, [brandName, descript, pic], function (err, result, fields) {
          if (err) throw err;
          res.end(JSON.stringify(result)); // Result in JSON format
     });
});

//http://localhost:8000/addprescriptionbrand/withoutimage/:name/:description
app.post('/addprescriptionbrand/withoutimage/:name/:description', async(req, res) => {
  var brandName = req.param('name')
  var descript = req.param('description')
  connection.query(`INSERT INTO PrescriptionBrand (BrandName, Description, Image) 
  VALUES (?, ?, NULL);`, [brandName, descript], function (err, result, fields) {
            if (err) throw err;
            res.end(JSON.stringify(result)); // Result in JSON format
       });
  });

//[DELETE] a prescription brand
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
app.get('/prescriptionbrand/search/:name', function (req, res) {
var search = req.param('name')
connection.query("Select * From PrescriptionBrand WHERE BrandName = ?;",search, function (err, result, fields) {
      if (err) throw err; //Need to figure out how to add if doesn't exist
      res.end(JSON.stringify(result)); // Result in JSON format
  });
});

/////////////////////////////////////////// PRESCRIPTION ////////////////////////////////////////////////

 //GET; return all of the Prescriptions
//http://localhost:8000/prescriptions
app.get('/prescriptions', function (req, res) {
  connection.query("Select * from Prescription;", function (err, result, fields) {
      if (err) throw err;
      res.end(JSON.stringify(result)); // Result in JSON format
  });
 });


//1.1 [CREATE] non-recurring prescription
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
  Code_Pin) VALUES (?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, NULL, ?);`, [prescriptName, start, refillable, descript, comment, brand, end, cost, refillDate, refillCount, code], function (err, result, fields) {
          if (err) throw err;
          res.end(JSON.stringify(result)); // Result in JSON format
     });
  });

//1.2 [READ] prescriptions that run out and are no longer eligible for refills
//to be designated as a past prescription
//http://localhost:8000/prescriptionOutOfUse
app.get('/prescriptionOutOfUse', function (req, res) {
  connection.query("Select * from Prescription WHERE isRefillable = 0 AND EndDate < CURDATE();", function (err, result, fields) {
      if (err) throw err;
      res.end(JSON.stringify(result)); // Result in JSON format
  });
 });

//1.3 [UPDATE] I want to be able to edit a prescription that I have entered
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


//1.3 [UPDATE] I want to be able to edit a prescription that I have entered
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


//1.3 [UPDATE] I want to be able to edit a prescription that I have entered
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

//1.3 [UPDATE] I want to be able to edit a prescription that I have entered
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

//1.3 [UPDATE] I want to be able to edit a prescription that I have entered
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

//1.3 [UPDATE] I want to be able to edit a prescription that I have entered
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


//1.3 [UPDATE] I want to be able to edit a prescription that I have entered
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


//1.3 [UPDATE] I want to be able to edit a prescription that I have entered
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


//1.3 [UPDATE] I want to be able to edit a prescription that I have entered
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


//1.3 [UPDATE] I want to be able to edit a prescription that I have entered
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


//1.3 [UPDATE] I want to be able to edit a prescription that I have entered
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


//1.3 [UPDATE] I want to be able to edit a prescription that I have entered
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


//1.4 [READ] I want to sort prescriptions by the date they were added
//http://localhost:8000/prescriptionSortByAddDate
app.get('/prescriptionSortByAddDate', function (req, res) {
    connection.query("Select * from Prescription order by StartDate;", function (err, result, fields) {
        if (err) throw err;
        res.end(JSON.stringify(result)); // Result in JSON format
    });
   });


//1.5 [DELETE] non-recurring prescription
// http://localhost:8000/deleteprescription/:name
app.delete('/deleteprescription/:name', async (req, res) => {
	var prescriptionName = req.param('name')
	connection.query("DELETE FROM Prescription WHERE PrescriptionName = ?;", prescriptionName,function (err, result, fields) {
		if (err) 
			return console.error(error.message);
		res.end(JSON.stringify(result)); 
	  });

});

//1.6 I want to be able to search my prescription by name out of all my prescriptions
//http://localhost:8000/prescriptionsearch/:name
app.get('/prescriptionsearch/:name', function (req, res) {
  var search = req.param('name')
  connection.query("Select * From Prescription WHERE PrescriptionName = ?;",search, function (err, result, fields) {
        if (err) throw err; //Need to figure out how to add if doesn't exist
        res.end(JSON.stringify(result)); // Result in JSON format
    });
   });



//1.7 I want to be able to filter prescriptions by recurring and non-recurring
//http://localhost:8000/prescriptionShowRecurring
 app.get('/prescriptionShowRecurring', function (req, res) { //Case statement
    connection.query('Select * From Prescription WHERE isRecurring = 1;', function (err, result, fields) {
        if (err) throw err;
        res.end(JSON.stringify(result)); // Result in JSON format
    });
   });

//http://localhost:8000/prescriptionShowNonRecurring
app.get('/prescriptionShowNonRecurring', function (req, res) { //Case statement
      connection.query('Select * From Prescription WHERE isRecurring = 0;', function (err, result, fields) {
          if (err) throw err;
          res.end(JSON.stringify(result)); // Result in JSON format
      });
     });

//1.8 [UPDATE] comment on a prescription by adding one on
//Update comment of the prescription, adding a semi-colon and space before it
//Parameters; Name = name of prescription; Comment = new comment adding on
//http://localhost:8000/prescription/updatewithadditionalcomment/:name/:comment
app.put('/prescription/updatewithadditionalcomment/:name/:comment', async (req, res) => {
  var prevName = req.param('name')
  var newComment = req.param('comment')
  connection.query(`UPDATE Prescription Set Comments = Concat(Concat(Comments,"; "), ?) WHERE PrescriptionName = ?;`, [newComment, prevName], function(err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result)); 
	});
});


// 1.9 [DELETE] comment on a prescription
//http://localhost:8000/prescription/deletecomment/:name
app.delete('/prescription/deletecomment/:name', async (req, res) => {
	var prescriptionName = req.param('name')
	connection.query(`UPDATE Prescription SET Comments = ' ' WHERE PrescriptionName = ?;`, prescriptionName,function (err, result, fields) {
		if (err) 
			return console.error(error.message);
		res.end(JSON.stringify(result)); 
	  });

});

// 2.1 I want medications that are recurring to be distinguished from the rest
//See 1.7

//2.2 [CREATE] recurring medication
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
    Code_Pin) VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, NULL, ?);`, [prescriptName, start, refillable, descript, comment, brand, end, cost, refillDate, refillCount, code], function (err, result, fields) {
        if (err) throw err;
        res.end(JSON.stringify(result)); // Result in JSON format
      });
    });


// 2.3 [UPDATE] I want to change recurring information of added medications
// See 1.3

// 2.4 I want to pause a recurring medication for a period of time.
//See 1.3

// 2.5 [DELETE] recurring medication
//See 1.5

// 3.1 I want to distinguish my prescriptions that need to be refilled from the rest
//http://localhost:8000/refillables
app.get('/refillables', function (req, res) {
  connection.query("Select * from Prescription where isRefillable = 1;", function (err, result, fields) {
        if (err) throw err; //Need to figure out how to add if doesn't exist
        res.end(JSON.stringify(result)); // Result in JSON format
    });
   });

// 3.2 I want a prescription that is about to run out to be able to be distinguished from the others
//http://localhost:8000/refillables
app.get('/prescriptiondistinguishrunout', function (req, res) {
    connection.query("Select * From Prescription  WHERE EndDate < (CURDATE() + 14) Order by RefillDate asc, EndDate asc;", function (err, result, fields) {
          if (err) throw err; //Need to figure out how to add if doesn't exist
          res.end(JSON.stringify(result)); // Result in JSON format
      });
     });

// 3.4 I want to see a recommended refill date for eligible prescriptions
//http://localhost:8000/prescription/recommendedrefilldate/:prescriptionname
app.get('/prescription/recommendedrefilldate/:prescriptionname', function (req, res) {
  var prescriptionName = req.param('prescriptionname')
  connection.query("Select RefillDate as RecommendedRefillDate From Prescription where PrescriptionName = ?;", prescriptionName, function (err, result, fields) {
        if (err) throw err; //Need to figure out how to add if doesn't exist
        res.end(JSON.stringify(result)); // Result in JSON format
    });
   });


// 3.5 [READ] remaining refills
//http://localhost:8000/prescription/remainingrefills/:prescriptionname
app.get('/prescription/remainingrefills/:prescriptionname', function (req, res) {
  var prescriptionName = req.param('prescriptionname')
  connection.query("Select RefillCount as RemainingRefills From Prescription where PrescriptionName = ?;", prescriptionName, function (err, result, fields) {
        if (err) throw err; //Need to figure out how to add if doesn't exist
        res.end(JSON.stringify(result)); // Result in JSON format
    });
   });

// 4.1 [READ] dosage frequency
//Same as remaining refills?

// 4.2 [READ] potential medication interactions
// Same as 4.5

// 4.3 [READ] medication ingredients
//http://localhost:8000/prescription/ingredients/:prescriptionname
app.get('/prescription/ingredients/:prescriptionname', function (req, res) {
  var prescriptionName = req.param('prescriptionname')
  connection.query("Select PrescriptionDescription as Ingredients From Prescription where PrescriptionName = ?;", prescriptionName, function (err, result, fields) {
        if (err) throw err; //Need to figure out how to add if doesn't exist
        res.end(JSON.stringify(result)); // Result in JSON format
    });
   });

// 4.4 [READ] medication shelf life
//http://localhost:8000/prescription/shelflife/:prescriptionname
app.get('/prescription/shelflife/:prescriptionname', function (req, res) {
  var prescriptionName = req.param('prescriptionname')
  connection.query("Select EndDate as ShelfLife From Prescription where PrescriptionName = ?;", prescriptionName, function (err, result, fields) {
        if (err) throw err; //Need to figure out how to add if doesn't exist
        res.end(JSON.stringify(result)); // Result in JSON format
    });
   });

// 4.5 [READ] medication effects
//http://localhost:8000/prescription/effects/:prescriptionname
app.get('/prescription/effects/:prescriptionname', function (req, res) {
  var prescriptionName = req.param('prescriptionname')
  connection.query("Select PrescriptionDescription as Effects From Prescription where PrescriptionName = ?;", prescriptionName, function (err, result, fields) {
        if (err) throw err; //Need to figure out how to add if doesn't exist
        res.end(JSON.stringify(result)); // Result in JSON format
    });
   });

//connecting the express object to listen on a particular port as defined in the config object.
app.listen(config.port, config.host, (e) => {
  if (e) {
    throw new Error('Internal Server Error');
  }
  logger.info(`${config.name} running on ${config.host}:${config.port}`);
});
