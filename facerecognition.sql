-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 17, 2020 at 09:41 PM
-- Server version: 5.7.28-0ubuntu0.18.04.4
-- PHP Version: 7.2.24-0ubuntu0.18.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `facerecognition`
--

-- --------------------------------------------------------


-- Create table structures
CREATE TABLE `Users` (
	`UserID` Int,
    PRIMARY KEY (`UserID`)
);

CREATE TABLE `Students` (
	`UserID` Int,
    `name` VARCHAR(100) NOT NULL,
    `year` Int NOT NULL,
    `major` VARCHAR(100),
    PRIMARY KEY (`UserID`),
    FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`)
);

CREATE TABLE `Teachers` (
	`UserID` Int,
    `name` VARCHAR(100) NOT NULL,
    `faculty` VARCHAR(100) NOT NULL,
    `department` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`UserID`),
    FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`)
);

CREATE TABLE `Classes` (
	`ClassID` Int,
    `UserID` Int NOT NULL,
    `course_name` VARCHAR(100) NOT NULL,
    `semester` Int NOT NULL,
    PRIMARY KEY (`ClassID`),
    FOREIGN KEY (`UserID`) REFERENCES `Teachers`(`UserID`)
);

CREATE TABLE `Login_Hist` (
	`loginID` Int,
    `UserID` Int NOT NULL,
    `login_time` DATETIME NOT NULL,
    `logout_time` DATETIME NOT NULL,
    PRIMARY KEY (`loginID`),
    FOREIGN KEY (`UserID`) REFERENCES Users(`UserID`)
);

CREATE TABLE `Students_Take_Classes` (
	`UserID` Int,
    `ClassID` Int,
    PRIMARY KEY (`UserID`, `ClassID`),
    FOREIGN KEY (`UserID`) REFERENCES `Students`(`UserID`),
    FOREIGN KEY (`ClassID`) REFERENCES `Classes`(`ClassID`)
);

CREATE TABLE `Class_Time` (
	`ClassID` Int,
    `time.day_of_week` Int,
    `time.start_time` TIME,
    `time.end_time` TIME,
    PRIMARY KEY (`ClassID`, `time.day_of_week`, `time.start_time`, `time.end_time`),
    FOREIGN KEY (`ClassID`) REFERENCES `Classes`(`ClassID`)
);

CREATE TABLE `Information` (
	`ClassID` Int,
    `Week` Int,
    `classroom_address` VARCHAR(100),
    `teacher_message` VARCHAR(200),
    `link_of_zoom` VARCHAR(200),
    `link_of_lecture_notes` VARCHAR(200),
    PRIMARY KEY (`ClassID`, `Week`),
    FOREIGN KEY (`ClassID`) REFERENCES `Classes`(`ClassID`)
);


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
