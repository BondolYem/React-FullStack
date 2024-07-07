
-- Role 

CREATE TABLE `Role` (
  `Id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `Name` VARCHAR(120) NOT NULL,
  `Code` VARCHAR(120) NOT NULL
);


CREATE TABLE `User` (
  `Id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `RoleId` INT(11),
  `Username` VARCHAR(120),
  `Password` VARCHAR(11),
  `IsActive` TINYINT(1),
  `CreateBy` VARCHAR(120) DEFAULT NULL,
  `CreateAt` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (RoleId) REFERENCES Role(Id) -- add FK
);

CREATE TABLE `Category` (
  `Id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `Name` VARCHAR(120) NOT NULL UNIQUE,
  `Description` TEXT DEFAULT NULL,
  `ParentId` INT(11) DEFAULT 0,
  `Image` VARCHAR(255) DEFAULT NULL,
  `IsActive` TINYINT(1) DEFAULT 1,
  `CreateBy` VARCHAR(120) DEFAULT NULL,
  `CreateAt` TIMESTAMP NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE `Teacher` (
  `Id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `FirstName` VARCHAR(120) NOT NULL,
  `LastName` VARCHAR(120) NOT NULL,
  `Gender` TINYINT(1) DEFAULT 1,
  `Dob` DATETIME DEFAULT NULL,
  `Tel` VARCHAR(18) NOT NULL UNIQUE,
  `Image` VARCHAR(255) DEFAULT NULL,
  `Email` VARCHAR(120) DEFAULT NULL UNIQUE,
  `Current_Address` TEXT DEFAULT NULL,
  `Note` TEXT DEFAULT NULL,
  `IsActive` TINYINT(1) DEFAULT 1,
  `CreateBy` VARCHAR(120) DEFAULT NULL,
  `CreateAt` TIMESTAMP NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE `Student` (
  `Id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `FirstName` VARCHAR(120) NOT NULL,
  `LastName` VARCHAR(120) NOT NULL,
  `Gender` TINYINT(1) DEFAULT 1,
  `Dob` DATETIME DEFAULT NULL,
  `Tel` VARCHAR(18) NOT NULL UNIQUE,
  `Image` VARCHAR(255) DEFAULT NULL,
  `Email` VARCHAR(120) DEFAULT NULL UNIQUE,
  `Current_Address` TEXT DEFAULT NULL,
  `Note` TEXT DEFAULT NULL,
  `IsActive` TINYINT(1) DEFAULT 1,
  `CreateBy` VARCHAR(120) DEFAULT NULL,
  `CreateAt` TIMESTAMP NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE `Course` (
  `Id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `CategoryId` INT(11),
  `Name` VARCHAR(120) NOT NULL UNIQUE,
  `Description` TEXT DEFAULT NULL,
  `Image` INT(11) DEFAULT NULL,
  `TotalHour` DECIMAL(4,2) DEFAULT 0,
  `Price` DECIMAL(4,2) DEFAULT 0,
  `IsActive` TINYINT(1) DEFAULT 1,
  `CreateBy` VARCHAR(120) DEFAULT NULL,
  `CreateAt` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (CategoryId) REFERENCES Category(Id)
); 
-- Course_Relate, Course_Content, Course_Content_Student_Work, 


CREATE TABLE `ClassRoom` (
  `Id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `TeacherId` INT(11),
  `CourseId` INT(11),
  `CourseGeneration` INT(5),
  `Course_Price` DECIMAL(6,2) DEFAULT 0,
  `Class_Discount` DECIMAL(6,2) DEFAULT 0,
  `Class_Discount_Price` DECIMAL(6,2) DEFAULT 0,
  `Class_Price` DECIMAL(6,2) DEFAULT 0,
  `LearningType` VARCHAR(120) NOT NULL, -- Learn In Class, Online Class,  By Videos
  `ClassStatus` VARCHAR(120) NOT NULL, -- Pending, Active, Closed
  `ClassShiff` VARCHAR(120) NOT NULL, -- Morning, Afternoon, Evening
  `StartTime` DATETIME DEFAULT NULL,
  `EndTime` DATETIME DEFAULT NULL,
  `StartDate` DATETIME DEFAULT NULL,
  `EndDate` DATETIME DEFAULT NULL,
  `IsActive` TINYINT(1) DEFAULT 1,
  `Note` TEXT DEFAULT 1,
  `CreateBy` VARCHAR(120) DEFAULT NULL,
  `CreateAt` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (TeacherId) REFERENCES Teacher(Id),
  FOREIGN KEY (CourseId) REFERENCES Course(Id)
);

CREATE TABLE `StudentRegister` (
  -- `Id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `ClassRoomId` INT(11),
  `StudentId` INT(11),
  `Discount` DECIMAL(6,2) DEFAULT 0,
  `Discount_Price` DECIMAL(6,2) DEFAULT 0,
  `TotalToPay` DECIMAL(6,2) DEFAULT 0,
  `IsCompletedPaid` TINYINT(1) DEFAULT 0,
  `Note` TEXT DEFAULT NULL,
  `RegisterAt` VARCHAR(120) DEFAULT NULL,
  `CreateBy` VARCHAR(120) DEFAULT NULL,
  `CreateAt` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (ClassRoomId,StudentId),
  FOREIGN KEY (ClassRoomId) REFERENCES ClassRoom(Id),
  FOREIGN KEY (StudentId) REFERENCES Student(Id)
);



CREATE TABLE `StudentPayment` (
  `Id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `ClassRoomId` INT(11),
  `StudentId` INT(11),
  `Payment` DECIMAL(6,2) DEFAULT 0,
  `PaymentMethod` VARCHAR(120) NOT NULL, -- ABA Bank, Wing, True , AC
  `PaymentDate` DATETIME NOT NULL,
  `ImageRef` VARCHAR(255) DEFAULT NULL,
  `Note` TEXT DEFAULT NULL,
  `CreateBy` VARCHAR(120) DEFAULT NULL,
  `CreateAt` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (ClassRoomId) REFERENCES ClassRoom(Id),
  FOREIGN KEY (StudentId) REFERENCES Student(Id)
);


INSERT INTO role (Name,Code) VALUES 
('Admin','admin'),
('Teacher','teacher'),
('Student','student');


INSERT INTO `User`( `RoleId`, `Username`, `Password`, `IsActive`) 
VALUES 
(1,'Admin101','1234',1);

-- ALTER TABLE `employee`
--   ADD CONSTRAINT `fk_role` FOREIGN KEY (`RoleId`) REFERE-NCES `role` (`Id`);

-- Create Enrollment table (Junction table)
-- CREATE TABLE Enrollment (
--     student_id INT,
--     course_id INT,
--     PRIMARY KEY (student_id, course_id),
--     FOREIGN KEY (student_id) REFERENCES Students(student_id),
--     FOREIGN KEY (course_id) REFERENCES Courses(course_id)
-- );