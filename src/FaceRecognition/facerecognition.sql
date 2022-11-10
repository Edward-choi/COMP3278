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
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!40101 SET NAMES utf8mb4 */
;
--
-- Database: `facerecognition`
--

-- --------------------------------------------------------
-- Create table structures
CREATE TABLE `Users` (
    `user_id` Int,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`user_id`),
    UNIQUE(`email`)
);
CREATE TABLE `Students` (
    `user_id` Int,
    `year` Int NOT NULL,
    `major` VARCHAR(100),
    PRIMARY KEY (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`)
);
CREATE TABLE `Teachers` (
    `user_id` Int,
    `faculty` VARCHAR(100) NOT NULL,
    `department` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`)
);
CREATE TABLE `Classes` (
    `class_id` Int,
    `teacher_id` Int NOT NULL,
    `course_name` VARCHAR(100) NOT NULL,
    `semester` Int NOT NULL,
    `academic_year` INT NOT NULL,
    `description` VARCHAR(255),
    PRIMARY KEY (`class_id`, `academic_year`),
    FOREIGN KEY (`teacher_id`) REFERENCES `Teachers`(`user_id`),
    CONSTRAINT chk_semester CHECK(
        semester = 1
        OR semester = 2
    )
);
CREATE TABLE `Login_Hist` (
    `login_id` Int NOT NULL auto_increment,
    `user_id` Int NOT NULL,
    `login_time` DATETIME NOT NULL,
    `logout_time` DATETIME NOT NULL,
    PRIMARY KEY (`user_id`, `login_id`),
    FOREIGN KEY (`user_id`) REFERENCES Users(`user_id`)
);
CREATE TABLE `Students_Take_Classes` (
    `user_id` Int,
    `class_id` Int,
    `year` Int,
    PRIMARY KEY (`user_id`, `class_id`, `year`),
    FOREIGN KEY (`user_id`) REFERENCES `Students`(`user_id`),
    FOREIGN KEY (`class_id`, `year`) REFERENCES `Classes`(`class_id`, `academic_year`)
);
CREATE TABLE `Class_Time` (
    `class_id` Int,
    `year` INT,
    `day_of_week` Int,
    `start_time` TIME,
    `end_time` TIME,
    PRIMARY KEY (
        `class_id`,
        `day_of_week`,
        `start_time`,
        `end_time`
    ),
    FOREIGN KEY (`class_id`, `year`) REFERENCES `Classes`(`class_id`, `academic_year`)
);
CREATE TABLE `Information` (
    `class_id` Int,
    `year` Int,
    `Week` Int,
    `classroom_address` VARCHAR(100),
    PRIMARY KEY (`class_id`, `year`, `Week`),
    FOREIGN KEY (`class_id`, `year`) REFERENCES `Classes`(`class_id`, `academic_year`)
);
CREATE TABLE IF NOT EXISTS `TeacherMessage`(
    `class_id` INT NOT NULL,
    `year` INT NOT NULL,
    `week` INT NOT NULL,
    `message_id` INT NOT NULL,
    `sendAt` DATETIME NOT NULL,
    `subject` VARCHAR(100) NOT NULL,
    `content` VARCHAR(255) NOT NULL,
    `from_id` INT NOT NULL,
    PRIMARY KEY(`class_id`, `year`, `week`, `message_id`),
    CONSTRAINT teacher_message_fk FOREIGN KEY (`class_id`, `year`, `week`) REFERENCES Information(`class_id`, `year`, `Week`)
);
CREATE TABLE IF NOT EXISTS `CourseMaterial`(
    `class_id` INT NOT NULL,
    `year` INT NOT NULL,
    `week` INT NOT NULL,
    `file_link` VARCHAR(255) NOT NULL,
    `file_name` VARCHAR(100) NOT NULL,
    PRIMARY KEY(`class_id`, `year`, `week`, `file_link`),
    CONSTRAINT course_material_fk FOREIGN KEY (`class_id`, `year`, `week`) REFERENCES Information(`class_id`, `year`, `Week`)
);
CREATE TABLE IF NOT EXISTS `ZoomLink`(
    `class_id` INT NOT NULL,
    `year` INT NOT NULL,
    `week` INT NOT NULL,
    `link` VARCHAR(255) NOT NULL,
    `meeting_id` VARCHAR(100),
    `passcode` VARCHAR(100),
    PRIMARY KEY(`class_id`, `year`, `week`, `link`),
    CONSTRAINT zoom_link_fk FOREIGN KEY (`class_id`, `year`, `week`) REFERENCES Information(`class_id`, `year`, `Week`)
);
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;