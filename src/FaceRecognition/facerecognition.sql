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
CREATE DATABASE IF NOT EXISTS `facerecognition`;
USE `facerecognition`;
-- Create table structures
CREATE TABLE IF NOT EXISTS `Users` (
    `user_id` Int UNSIGNED AUTO_INCREMENT,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100),
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`user_id`),
    UNIQUE(`email`)
);
CREATE TABLE IF NOT EXISTS `Students` (
    `user_id` Int UNSIGNED AUTO_INCREMENT,
    `year` Int UNSIGNED NOT NULL,
    `major` VARCHAR(100),
    PRIMARY KEY (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`)
);
CREATE TABLE IF NOT EXISTS `Teachers` (
    `teacher_id` Int UNSIGNED,
    `faculty` VARCHAR(100) NOT NULL,
    `department` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`teacher_id`),
    FOREIGN KEY (`teacher_id`) REFERENCES `Users`(`user_id`)
);
CREATE TABLE IF NOT EXISTS `Classes` (
    `class_id` Int UNSIGNED AUTO_INCREMENT,
    `teacher_id` Int UNSIGNED NOT NULL,
    `course_code` VARCHAR(100) NOT NULL,
    `course_name` VARCHAR(100) NOT NULL,
    `academic_year` INT UNSIGNED NOT NULL COMMENT "first semester if academic_year is even;seoncd semester if academic_year is odd;",
    `description` VARCHAR(1000),
    PRIMARY KEY (`class_id`),
    UNIQUE unique_index (`course_code`, `academic_year`),
    FOREIGN KEY (`teacher_id`) REFERENCES `Teachers`(`teacher_id`)
);
CREATE TABLE IF NOT EXISTS `Login_Hist` (
    `user_id` Int UNSIGNED NOT NULL,
    `login_time` DATETIME NOT NULL,
    `logout_time` DATETIME,
    PRIMARY KEY (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES Users(`user_id`)
) ENGINE = MyISAM;
CREATE TABLE IF NOT EXISTS `Students_Take_Classes` (
    `user_id` Int UNSIGNED,
    `class_id` Int UNSIGNED,
    `year` Int UNSIGNED,
    PRIMARY KEY (`user_id`, `class_id`),
    FOREIGN KEY (`user_id`) REFERENCES `Students`(`user_id`),
    FOREIGN KEY (`class_id`) REFERENCES `Classes`(`class_id`)
);
CREATE TABLE IF NOT EXISTS `Class_Time` (
    `class_id` Int UNSIGNED,
    `day_of_week` Int UNSIGNED,
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
CREATE TABLE IF NOT EXISTS `Information` (
    `class_id` Int UNSIGNED,
    `date` DATE,
    `course_number` Int UNSIGNED,
    `venue` VARCHAR(100),
    PRIMARY KEY (`class_id`, `course_number`),
    FOREIGN KEY (`class_id`) REFERENCES `Classes`(`class_id`)
);
CREATE TABLE IF NOT EXISTS `TeacherMessage`(
    `class_id` INT UNSIGNED NOT NULL,
    `course_number` INT UNSIGNED NOT NULL,
    `message_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `send_at` DATETIME NOT NULL,
    `subject` VARCHAR(100) NOT NULL,
    `content` VARCHAR(255) NOT NULL,
    `from_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY(`class_id`, `course_number`, `message_id`),
    CONSTRAINT teacher_message_fk FOREIGN KEY (`class_id`, `course_number`) REFERENCES Information(`class_id`, `course_number`),
    FOREIGN KEY(`from_id`) REFERENCES Teachers(`teacher_id`)
) ENGINE = MyISAM;
CREATE TABLE IF NOT EXISTS `CourseMaterial`(
    `class_id` INT UNSIGNED NOT NULL,
    `course_number` INT UNSIGNED NOT NULL,
    `file_link` VARCHAR(255) NOT NULL,
    `file_name` VARCHAR(100),
    PRIMARY KEY(`class_id`, `course_number`, `file_link`),
    CONSTRAINT course_material_fk FOREIGN KEY (`class_id`, `course_number`) REFERENCES Information(`class_id`, `course_number`)
);
CREATE TABLE IF NOT EXISTS `ZoomLink`(
    `class_id` INT UNSIGNED NOT NULL,
    `course_number` INT UNSIGNED NOT NULL,
    `link` VARCHAR(255) NOT NULL,
    `meeting_id` VARCHAR(100),
    `passcode` VARCHAR(100),
    PRIMARY KEY(`class_id`, `course_number`, `link`),
    CONSTRAINT zoom_link_fk FOREIGN KEY (`class_id`, `course_number`) REFERENCES Information(`class_id`, `course_number`)
);
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;
