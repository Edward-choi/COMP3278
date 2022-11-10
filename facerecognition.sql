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
    PRIMARY KEY (`class_id`),
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
    `day_of_week` Int,
    `start_time` TIME,
    `end_time` TIME,
    PRIMARY KEY (
        `class_id`,
        `day_of_week`,
        `start_time`,
        `end_time`
    ),
    FOREIGN KEY (`class_id`) REFERENCES `Classes`(`class_id`)
);
CREATE TABLE `Information` (
    `class_id` Int,
    `Week` Int,
    `classroom_address` VARCHAR(100),
    `teacher_message` VARCHAR(200),
    `link_of_zoom` VARCHAR(200),
    `link_of_lecture_notes` VARCHAR(200),
    PRIMARY KEY (`class_id`, `Week`),
    FOREIGN KEY (`class_id`) REFERENCES `Classes`(`class_id`)
);
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;