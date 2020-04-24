CREATE DATABASE IF NOT EXISTS MrPharma;
USE MrPharma;

-- create Users table
CREATE TABLE IF NOT EXISTS `MrPharma`.`User` (
    `PinCode` INT NOT NULL AUTO_INCREMENT,
	  PRIMARY KEY (PinCode),
    `Username` VARCHAR(45),
    `Password` VARCHAR(45),
    `TotalCostPrescriptions` DECIMAL(10,2) NOT NULL, 
    `MonthlyCost` DECIMAL(10,2) NOT NULL,
    `FinancialReport` MEDIUMBLOB NULL
);

-- populate Users with dummy data
INSERT INTO `User` (Username, Password, TotalCostPrescriptions, MonthlyCost, FinancialReport)
VALUES
('throwerslug','password1', '100.00', '33.2', NULL),
('gorebland','password2', '200.00', '11.04', NULL),
('edenheight','password3',  '300.00', '08.77', NULL),
('drugsarefun','password4', '250.00',  '10.04', NULL),
('concoction','password5', '180.00', '09.44', NULL),
('bigpharmacy','password6', '400.70',  '03.06', NULL),
('bigpharmacy','password6', '400.70',  '03.06', NULL),
('mypharm','password7',  '550.00', '08.99', NULL),
('joe','password8', '50.00',  '08.20', NULL),
('steve','password9', '80.00', '10.44', NULL),
('larry','password10', '364.70',  '05.06', NULL);

-- create Insurance table
CREATE TABLE IF NOT EXISTS `MrPharma`.`Insurance` (
    `InsuranceID` INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (InsuranceID),
    `Company` VARCHAR(45),
    `AddressLine1` VARCHAR(45),
    `AddressLine2` VARCHAR(45),
    `City` VARCHAR(45),
    `State` VARCHAR(45),
    `PostalCode` INT,
    `Country` VARCHAR(45),
    `PhoneNumber` BIGINT,
    `Email` VARCHAR(45),
    `Code_Pin` INT DEFAULT NULL,
    FOREIGN KEY (Code_Pin) REFERENCES `MrPharma`.`User` (`PinCode`),
    INDEX `PinCode_Index` (`Code_Pin`)
);

-- populate Insurance table with dummy data
INSERT INTO `Insurance` 
(Company, AddressLine1, AddressLine2, City, State, PostalCode, Country, PhoneNumber, Email, Code_Pin)
VALUES
('Blue Cross Blue Shield', '8364 Dyer Street', NULL, 'Dallas', 'Texas',  '75205', 'United States','4534126683', 'blue@email.com', 1),
('Humana','1111 Krome Avenue', NULL,  'Miami', 'Florida', '33101', 'United States','2025550104', 'humana@email.com', 2),
('UnitedHealth', '7434 Southampton Rd', '#2243','Minnetonka', 'Minnesota', '49009', 'United States', '7313741730', 'unitedhealth@email.com', 3),
('California Physicians Service', '1 Old Golf Dr', NULL, 'Los Angeles', 'California', '90274', 'United States', '5639735475', 'cps@email.com', 4),
('MetLife', '8845 Sycamore Lane', NULL,  'New York', 'New York', '60089',  'United States','3968131162', 'metro@email.com', 5),
('Highmark Group', '35 North Mulberry Street', '#1001', ' Pittsburgh', 'Pennsylvania',  '37601', 'United States', '8462420038','highmark@email.com', 6),
('Kaiser Foundation', '7030 S Yale Ave', '#600', 'Tulsa', 'Oklahoma', '74136', 'United States', '9183921612', 'kaiserhealth@email.com', 7),
('Cigna Health', '1640 Dallas Pkwy', NULL, 'Plano', 'Texas', '75093', 'United States', '9724745638', 'cignahealth@email.com', 8),
('Molina Healthcare', '5605 N MacArthur Blvd', '#400', 'Irving', 'Texas', '75038', 'United States', '2144376289', 'molina@email.com', 9),
('Independence Health Group Inc', '1901 Market Street', NULL, 'Philadelphia', 'Pennyslvania', '19103', 'United States', '4125392254', 'independencehealth@email.com', 10);

-- create Pharmacy table
CREATE TABLE IF NOT EXISTS `MrPharma`.`Pharmacy` (
  `PharmacyID` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`PharmacyID`),
  `PharmacyName` VARCHAR(50) NOT NULL,
  `AddressLine1` VARCHAR(50) NOT NULL,
  `AddressLine2` VARCHAR(50) NULL DEFAULT NULL,
  `City` VARCHAR(50) NOT NULL,
  `State` VARCHAR(50) NULL DEFAULT NULL,
  `PostalCode` VARCHAR(50) NULL DEFAULT NULL,
  `Country` VARCHAR(50) NULL DEFAULT NULL,
  `Phone` VARCHAR(50) NOT NULL,
  `InsuranceID` INT DEFAULT NULL,
  `Code_Pin` INT DEFAULT NULL,
  FOREIGN KEY (`InsuranceID`) REFERENCES Insurance (`InsuranceID`),
  INDEX InsuranceID_Index (`InsuranceID`),
  FOREIGN KEY (`Code_Pin`) REFERENCES MrPharma.User (`PinCode`),
  INDEX `PinCode_Index` (`Code_Pin`)
);

-- populate Pharmacy with dummy data
INSERT INTO `Pharmacy` 
(PharmacyName, AddressLine1, AddressLine2, City, State, PostalCode, Country,Phone, InsuranceID,Code_Pin)
VALUES
('The Plano Pharmacy', '8364 Draper Street', NULL, 'Dallas', 'Texas', '75023', 'United States', '6505555787',1, 1),
('CVS','1111 Old Country Rd', 'Dallas', 'Texas', NULL, '75251', 'United States', '4155551450',2 , 2),
('Walgreens', '38 University Avenue', NULL, 'Brookline', 'Massachusetts', '02446', 'United States', '2125557413',3,  3),
('Rite Aid','51 Stillwater Street', 'Yuma', 'Arizona', NULL, '85365', 'United States', '266427555',4,  4),
('Kaiser Permanente', '578 Trenton Dr', NULL, 'West Warwick', 'Rhode Island', '02893', 'United States','0395204555', 5,  5),
('Thrive Apothecary','212 Carroll S', NULL, 'Fort Worth', 'Texas', '76107', 'United States','8174807098', 6,  6),
('Baylor Scott & White Pharmacy', '3600 Gaston Ave', '#109', 'Dallas', 'Texas', '74246', 'United States', '2145328290', 7, 7),
('Pride Pharmacy', '4015 Lemmon Ave', NULL, 'Dallas', 'Texas', '75219', 'United States', '2149547389', 8, 8),
('Omega Pharmacy', '4507 Maple Ave', '#100', 'Dallas', 'Texas', '75219', 'United States', '2145998844', 9, 9),
('SMU Health Center Pharmacy', '6004 Hillcrest Ave', NULL, 'Dallas', 'Texas', '75275', 'United States', '2147682149', 10, 10);

-- create user PrescriptionBrand table
CREATE TABLE IF NOT EXISTS `MrPharma`.`PrescriptionBrand` (
  BrandID INT NOT NULL AUTO_INCREMENT,
  BrandName VARCHAR(50) NULL,
  Description TEXT NULL,
  Image MEDIUMBLOB NULL,
  PRIMARY KEY (BrandID)
);

-- populate PrescriptionBrand with dummy data
INSERT INTO `PrescriptionBrand` 
(BrandName, Description, image)
VALUES
('Pfizer', 'an American multinational pharmaceutical corporation headquartered in New York City', NULL),
('Medtronic','a medical device company that  an operational and executive headquarters in Fridley, Minnesota in the U.S.', NULL),
('Abott Labs', 'an American medical devices and health care company with headquarters in Lake Bluff, Illinois, United States.', NULL),
('Johnson & Johnson', 'an American multinational corporation founded in 1886 that develops medical devices, pharmaceutical and consumer packaged goods', NULL),
('Bayer AG', 'a German company with core competencies in the fields of healthcare, agriculture and high-tech polymer materials.', NULL),
('Seattle Genetics', ' biotechnology company focused on developing and commercializing innovative, empowered monoclonal antibody-based therapies for the treatment of cancer', NULL);

-- create Prescription table
CREATE TABLE IF NOT EXISTS `MrPharma`.`Prescription` (
  `PrescriptionID` INT NOT NULL AUTO_INCREMENT,
  `PrescriptionName` VARCHAR(50) NOT NULL,
  `StartDate` DATE NOT NULL,
  `isRefillable` TINYINT NOT NULL,
  `isRecurring` TINYINT NOT NULL,
  `PrescriptionDescription` TEXT NOT NULL,
  `Comments` TEXT NULL,
  `Brand_ID` INT NOT NULL,
  `EndDate` DATE NULL DEFAULT NULL,
  `BuyPrice` DECIMAL(10,2) NOT NULL,
  `RefillDate` DATE NULL DEFAULT NULL,
  `RefillCount` INT NULL DEFAULT 0,
  `PausePrescription` DATETIME NULL,
  `Code_Pin` INT NOT NULL,
  PRIMARY KEY (`PrescriptionID`),
  FOREIGN KEY (`Code_Pin`) REFERENCES `MrPharma`.`User` (`PinCode`),
  INDEX `PinCode_Index` (`Code_Pin`),
  FOREIGN KEY (`Brand_ID`) REFERENCES `MrPharma`.`PrescriptionBrand` (`BrandID`),
  INDEX `PrescriptionBrand_Index` (`Brand_ID`)
);

-- populate Prescription table with dummy data
INSERT INTO `Prescription` 
(PrescriptionName, StartDate, isRefillable, isRecurring, PrescriptionDescription, Comments,
Brand_ID, EndDate, BuyPrice, RefillDate, RefillCount, PausePrescription, Code_Pin)
VALUES
('Hydrocodone', '2020-11-17', 1,1, 'An opioid used to treat severe pain of a prolonged duration, if other measures are not sufficient', 'I like this drug', 1 , '2020-02-17', '34.52', '2020-02-05', 4, NULL, 1),
('Lisinopril', '2020-02-20', 0,1, 'An ACE inhibitor, used to treat high blood pressure (hypertension)' ,'I dont like this drug', 1, '2020-03-20', '58.12', '2020-03-10', 3, NULL, 1),
('Amoxicillin', '2020-04-18', 1,0, 'A penicillin antibiotic that fights bacteria' , 'This drug is okay', 1, '2020-06-17', '45.02', '2020-05-05', 1, NULL, 2),
('Azithromycin', '2020-01-01', 0,1, 'An antibiotic that can treat various types of infections, including pink eye', 'I can not spell this drug', 1, '2020-03-01', '25.25', '2020-02-02', 1, NULL,2),
('Xanax', '2020-11-11', 1,1, 'A benzodiazepine that can treat anxiety and panic disorder', 'This drug is expensive', 1, '2020-11-13', '60.80', '2020-11-12', 4, NULL, 6),
('Promethazine', '2020-06-06', 1,0, 'An antihistamine that can treat allergies and motion sickness', 'This drug makes me feel tired', 1 , '2020-07-06', '02.99', '2020-07-05', 6, NULL, 5),
('Lipitor', '2020-04-24' , 0, 1, 'A statin medication used to prevent cardiovascular disease in those at high risk and treat abnormal lipid levels', 'This drug has improved my cardiovascular health', 1, '2020-05-24', '5.99', '2020-04-24', 4, NULL, 3),
('Prednisone', '2020-02-14', 1, 1, 'A glucocorticoid medication mostly used to suppress the immune system and decrease inflammation in conditions such as asthma, COPD, and rheumatologic diseases', 'This medicine makes me feel nauseous', 1, '2020-08-24', '10.99', '2020-06-24', 3, NULL, 4),
('Gabapentin', '2020-03-15', 1, 0, 'An anticonvulsant medication used to treat partial seizures, neuropathic pain, hot flashes, and restless legs syndrome', 'This medicine helps me with my issues', 1, '2020-05-24', '12.99', '2020-09-01', 5, NULL, 8);

-- create user called `manager` with password `Password`
CREATE USER 'manager'@'%' IDENTIFIED BY 'Password';

-- give access to manager on db
GRANT ALL PRIVILEGES ON MrPharma.* TO 'manager'@'%';

-- set password method to native password for mysql workbench access (mysql 8 issue)
ALTER USER 'manager'@'%' IDENTIFIED WITH MYSQL_NATIVE_PASSWORD BY 'Password';

-- flush them privileges
FLUSH PRIVILEGES;

