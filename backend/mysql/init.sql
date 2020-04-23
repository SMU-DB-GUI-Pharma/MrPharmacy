USE MrPharma;

--create user table
CREATE TABLE IF NOT EXISTS `MrPharma`.`User` (
    InsuranceID INT NOT NULL AUTO_INCREMENT,
	  PRIMARY KEY (InsuranceID),
    Username VARCHAR(45),
    Password VARCHAR(45),
    PinCode INT,
    --'PharmacyID' INT,
    TotalCostPrescriptions DECIMAL, 
    MonthlyCost DECIMAL
);


--populate users with dummy data
INSERT INTO `User` (Username, Password, PinCode, TotalCostPrescriptions,MonthlyCost)
VALUES
('throwerslug','password1', '1111', '100.00', '33.2'),
('gorebland','password2', '2222', '200.00', '11.04'),
('edenheight','password3', '3333', '300.00', '08.77'),
('drugsarefun','password4', '4444', '250.00',  '10.04'),
('concoction','password5', '5555', '180.00', '09.44'),
('bigpharmacy','password6', '6666', '400.70',  '03.06');

--create pharmacy table
CREATE TABLE IF NOT EXISTS `MrPharma`.`Pharmacy` (
  PharmacyID INT NOT NULL AUTO_INCREMENT,
   PRIMARY KEY (`PharmacyID`),
  PharmacyName VARCHAR(50) NOT NULL,
  AddressLine1 VARCHAR(50) NOT NULL,
  AddressLine2 VARCHAR(50) NULL DEFAULT NULL,
  City VARCHAR(50) NOT NULL,
  State VARCHAR(50) NULL DEFAULT NULL,
  PostalCode VARCHAR(50) NULL DEFAULT NULL,
  Country VARCHAR(50) NULL DEFAULT NULL,
  Phone VARCHAR(50) NOT NULL,
  InsuranceID INT DEFAULT NULL,
  CodePin INT DEFAULT NULL,
--   FOREIGN KEY (`insurance_id`) REFERENCES `Insurance` (`InsuranceID`),
--   INDEX `idInsurance_idx` (`insurance_id`),
--   FOREIGN KEY (`code_pin`) REFERENCES `MrPharma`.`User` (`PinCode`),
--   INDEX `pinCode_idx` (`code_pin`)
);

--populate pharmacy table with dummy data
INSERT INTO `Pharmacy` 
(PharmacyName, AddressLine1, AddressLine2, City, State, PostalCode, Country,Phone, InsuranceID,CodePin)
VALUES
('The Plano Pharmacy', '8364 Draper Street', NULL, 'Dallas', 'Texas', '75023', 'United States', '6505555787',1, 1),
('CVS','1111 Old Country Rd', 'Dallas', 'Texas', NULL, '75251', 'United States', '4155551450',2 , 2),
('Walgreens', '38 University Avenue', NULL, 'Brookline', 'Massachusetts', '02446', 'United States', '2125557413',3,  3),
('Rite Aid','51 Stillwater Street', 'Yuma', 'Arizona', NULL, '85365', 'United States', '266427555',4,  4),
('Kaiser Permanente', '578 Trenton Dr', NULL, 'West Warwick', 'Rhode Island', '02893', 'United States','0395204555', 5,  5),
('Thrive Apothecary','212 Carroll S', 'Fort Worth', 'Texas', NULL, '76107', 'United States','8174807098', 6,  6);

--create user prescription brand table
CREATE TABLE IF NOT EXISTS `MrPharmy`.`PrescriptionBrand` (
  `BrandID` INT NOT NULL AUTO_INCREMENT,
  `BrandName` VARCHAR(50) NULL,
  `Description` TEXT NULL,
  `Image` MEDIUMBLOB NULL,
  PRIMARY KEY (`BrandID`)
);

--populate prescription brand with dummy data
INSERT INTO `PrescriptionBrand` 
(BrandName, Description, image)
VALUES
('Pfizer', 'an American multinational pharmaceutical corporation headquartered in New York City', NULL),
('Medtronic','a medical device company that  an operational and executive headquarters in Fridley, Minnesota in the U.S.', NULL),
('Abott Labs', 'an American medical devices and health care company with headquarters in Lake Bluff, Illinois, United States.', NULL),
('Johnson & Johnson', 'an American multinational corporation founded in 1886 that develops medical devices, pharmaceutical and consumer packaged goods', NULL),
('Bayer AG', 'a German company with core competencies in the fields of healthcare, agriculture and high-tech polymer materials.', NULL),
('Seattle Genetics', ' biotechnology company focused on developing and commercializing innovative, empowered monoclonal antibody-based therapies for the treatment of cancer', NULL);

--create prescription table
CREATE TABLE IF NOT EXISTS `MrPharma`.`Prescription` (
  `PrescriptionID` INT NOT NULL AUTO_INCREMENT,
  `PrescriptionName` VARCHAR(50) NOT NULL,
  `StartDate` DATE NOT NULL,
  `isRefillable` TINYINT NOT NULL,
  `isRecurring` TINYINT NOT NULL,
  `PrescriptionDescription` TEXT NOT NULL,
  `Comments` TEXT NULL,
  `BrandID` INT NOT NULL,
  `EndDate` DATE NULL DEFAULT NULL,
  `BuyPrice` DECIMAL(10,2) NOT NULL,
  `RefillDate` DATE NULL DEFAULT NULL,
  `RefillCount` INT NULL DEFAULT 0,
  `PausePrescription` DATETIME NULL,
  `code_pin` INT NOT NULL,
  PRIMARY KEY (`idPrescription`),
  FOREIGN KEY (`code_pin`) REFERENCES `mrpharma`.`User` (`pinCode`),
  INDEX `pinCode_idx` (`code_pin`),
  FOREIGN KEY (`brand_id`) REFERENCES `mrpharma`.`PrescriptionBrand` (`idBrand`),
  INDEX `PrescriptionBrand_idx` (`brand_id`)
);

--populate prescription table with dummy data
INSERT INTO `Prescription` 
(PrescriptionName, StartDate, isRefillable, isRecurring, PrescriptionDescription, Comments,
BrandName, EndDate, BuyPrice, RefillDate, RefillCount, PausePrescription, code_pin)
VALUES
('Hydrocodone', '2020-11-17', 1,1, 'An opioid used to treat severe pain of a prolonged duration, if other measures are not sufficient', 'I like this drug', 1 , '2020-02-17', '34.52', '2020-02-05', 4, NULL, 1),
('Lisinopril', '2020-02-20', 0,1, 'An ACE inhibitor, used to treat high blood pressure (hypertension)' ,'I dont like this drug', 1 , '2020-03-20', '58.12', '2020-03-10', 3, NULL, 1),
('Amoxicillin', '2020-04-18', 1,0, 'A penicillin antibiotic that fights bacteria' , 'This drug is okay', 1 , '2020-06-17', '45.02', '2020-05-05', 2, NULL, 2),
('Azithromycin', '2020-01-01', 0,1, 'An antibiotic that can treat various types of infections, including pink eye', 'I can not spell this drug', 1 , '2020-03-01', '25.25', '2020-02-02', 1, NULL,2),
('Xanax', '2020-11-11', 1,1, 'A benzodiazepine that can treat anxiety and panic disorder', 'This drug is expensive', 1 , '2020-11-13', '60.80', '2020-11-12', 4, NULL, 6),
('Promethazine', '2020-06-06', 1,0, 'An antihistamine that can treat allergies and motion sickness', 'This drug makes me feel tired', 1 , '2020-07-06', '02.99', '2020-07-05', 6, NULL, 5);


--create insurance table
CREATE TABLE IF NOT EXISTS `MrPharma`.`Insurance` (
    InsuranceID INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (InsuranceID),
    Company VARCHAR(45),
    AddressLine1 VARCHAR(45),
    AddressLine2 VARCHAR(45),
    City VARCHAR(45),
    State VARCHAR(45),
    PostalCode INT,
    Country VARCHAR(45),
    PhoneNumber INT,
    Email VARCHAR(45)
    FOREIGN KEY (`Code_Pin`) REFERENCES `MrPharma`.`User` (`PinCode`),
    INDEX `PinCode_Index` (`Code_Pin`)
);

--populate insurance table with dummy data
INSERT INTO `Insurance` 
(Company, AddressLine1, AddressLine2, City, State, PostalCode, Country, PhoneNumber, Email, Code_Pin)
VALUES
('Blue Cross Blue Shield', '8364 Dyer Street', NULL, 'Dallas', 'Texas',  '75205', 'United States','4534126683', 'blue@email.com', 1),
('Humana','1111 Krome Avenue', NULL,  'Miami', 'Florida', '33101', 'United States','2025550104', 'humana@email.com', 2),
('UnitedHealth', '7434 Southampton Rd', '#2243','Minnetonka', 'Minnesota', '49009', 'United States', '7313741730', 'unitedhealth@email.com', 3),
('California Physicians Service', '1 Old Golf Dr', NULL, 'Los Angeles', 'California', '90274', 'United States', '5639735475', 'cps@email.com', 4),
('MetLife', '8845 Sycamore Lane', NULL,  'New York', 'New York', '60089',  'United States','3968131162', 'metro@email.com', 5),
('Highmark Group', '35 North Mulberry Street', '#1001', ' Pittsburgh', 'Pennsylvania',  '37601', 'United States', '8462420038','highmark@email.com',  6);

-- create user called `manager` with password `Password`
CREATE USER 'manager'@'%' IDENTIFIED BY 'password';

-- give access to manager on db
GRANT ALL PRIVILEGES ON MyPharma.* TO 'manager'@'%';

-- set password method to native password for mysql workbench access (mysql 8 issue)
ALTER USER 'manager'@'%' IDENTIFIED WITH MYSQL_NATIVE_PASSWORD BY 'password';

-- flush them privileges
FLUSH PRIVILEGES;

