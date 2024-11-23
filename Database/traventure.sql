-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 23, 2024 at 06:17 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `traventure`
--

-- --------------------------------------------------------

--
-- Table structure for table `blogpost`
--

CREATE TABLE `blogpost` (
  `PostID` int(6) NOT NULL,
  `title` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `intro` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `bookingID` int(10) NOT NULL,
  `userID` int(6) NOT NULL,
  `no_of_passengers` int(2) NOT NULL,
  `paymentMethod` varchar(10) NOT NULL,
  `paymentStatus` varchar(20) NOT NULL,
  `bookingDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contentwriter`
--

CREATE TABLE `contentwriter` (
  `CWID` int(6) NOT NULL,
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `userType` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`username`, `email`, `password`, `userType`) VALUES
('chamikara01', 'chamikara@gmail.com', '$2y$10$.i43IQSmFElGzM2XU51B3OQSdJy/qIzNPSAbpanVDkTWtWKhmxVg2', ''),
('dimuthuh', 'dimuthu@gmail.com', '$2y$10$OvCiFWnGM/ay2SM8QQfx.uFuX.Nn2Bl88PmqTG1/SnSan7dLpxmSq', ''),
('exampleUser ', 'john.doe@example.com', '$2y$10$1HCPGzP9NnmiRopDgETaveO2CBZvG6b0AdXYhNfIvDR2jol9wRJji', ''),
('imnot_naveen', 'naveenharinda2@gmail.com', '$2y$10$2k2KH3nXeK2miUeGxb5VFuOWhB.tXNhDospqgFsHuHCaF.vOMYYsO', ''),
('nadhiya', 'nadhiya@gmail.com', '$2y$10$bVdZHoPBOi30bzymDQ0jDO0rXhisWcydCyAubD25QFBEUjrBo44TK', '');

-- --------------------------------------------------------

--
-- Table structure for table `person`
--

CREATE TABLE `person` (
  `username` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contactNo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `person`
--

INSERT INTO `person` (`username`, `firstName`, `lastName`, `email`, `contactNo`) VALUES
('chamikara01', 'Chamikara', 'Malinda', 'chamikara@gmail.com', 771234567),
('dimuthuh', 'Dimuthu', 'Harshamal', 'dimuthu@gmail.com', 779876543),
('exampleUser ', 'John', 'Doe', 'john.doe@example.com', 1234567890),
('imnot_naveen', 'Naveen', 'Harinda', 'naveenharinda2@gmail.com', 774554321),
('nadhiya', 'Nadhiya', 'Nashath', 'nadhiya@gmail.com', 774554321);

-- --------------------------------------------------------

--
-- Table structure for table `registereduser`
--

CREATE TABLE `registereduser` (
  `userId` int(6) NOT NULL,
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `station`
--

CREATE TABLE `station` (
  `stationID` int(4) NOT NULL,
  `city` varchar(20) NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `systemadmin`
--

CREATE TABLE `systemadmin` (
  `adminID` int(6) NOT NULL,
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `train`
--

CREATE TABLE `train` (
  `trainID` int(4) NOT NULL,
  `name` varchar(20) NOT NULL,
  `type` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trainserviceprovider`
--

CREATE TABLE `trainserviceprovider` (
  `TSPID` int(6) NOT NULL,
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trainstops`
--

CREATE TABLE `trainstops` (
  `trainID` int(4) NOT NULL,
  `stationid` int(4) NOT NULL,
  `arrivaltime` time NOT NULL,
  `departuretime` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `traintrip`
--

CREATE TABLE `traintrip` (
  `trainID` int(4) NOT NULL,
  `tripID` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trip`
--

CREATE TABLE `trip` (
  `tripID` int(10) NOT NULL,
  `userID` int(6) NOT NULL,
  `sourceID` int(4) NOT NULL,
  `no_of_members` int(2) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tripdestination`
--

CREATE TABLE `tripdestination` (
  `tripID` int(10) NOT NULL,
  `destination` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `userdestination`
--

CREATE TABLE `userdestination` (
  `userId` int(6) NOT NULL,
  `prefferedDestination` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blogpost`
--
ALTER TABLE `blogpost`
  ADD PRIMARY KEY (`PostID`);

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`bookingID`),
  ADD KEY `booking_userid` (`userID`);

--
-- Indexes for table `contentwriter`
--
ALTER TABLE `contentwriter`
  ADD PRIMARY KEY (`CWID`),
  ADD KEY `cw_username` (`username`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`username`,`email`),
  ADD KEY `fk_email` (`email`);

--
-- Indexes for table `person`
--
ALTER TABLE `person`
  ADD PRIMARY KEY (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `registereduser`
--
ALTER TABLE `registereduser`
  ADD PRIMARY KEY (`userId`),
  ADD KEY `registered_username` (`username`);

--
-- Indexes for table `station`
--
ALTER TABLE `station`
  ADD PRIMARY KEY (`stationID`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `systemadmin`
--
ALTER TABLE `systemadmin`
  ADD PRIMARY KEY (`adminID`),
  ADD KEY `admin_username` (`username`);

--
-- Indexes for table `train`
--
ALTER TABLE `train`
  ADD PRIMARY KEY (`trainID`);

--
-- Indexes for table `trainserviceprovider`
--
ALTER TABLE `trainserviceprovider`
  ADD PRIMARY KEY (`TSPID`),
  ADD KEY `tsp_username` (`username`);

--
-- Indexes for table `trainstops`
--
ALTER TABLE `trainstops`
  ADD KEY `trainstops_triainid` (`trainID`),
  ADD KEY `trainstops_stationid` (`stationid`);

--
-- Indexes for table `traintrip`
--
ALTER TABLE `traintrip`
  ADD KEY `traintrip_trainid` (`trainID`),
  ADD KEY `traintrip_tripid` (`tripID`);

--
-- Indexes for table `trip`
--
ALTER TABLE `trip`
  ADD PRIMARY KEY (`tripID`),
  ADD KEY `trip_userID` (`userID`),
  ADD KEY `trip_sourceID` (`sourceID`);

--
-- Indexes for table `tripdestination`
--
ALTER TABLE `tripdestination`
  ADD KEY `tripdestination_tripid` (`tripID`);

--
-- Indexes for table `userdestination`
--
ALTER TABLE `userdestination`
  ADD KEY `destination_userid` (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `registereduser`
--
ALTER TABLE `registereduser`
  MODIFY `userId` int(6) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `booking_userid` FOREIGN KEY (`userID`) REFERENCES `registereduser` (`userId`);

--
-- Constraints for table `contentwriter`
--
ALTER TABLE `contentwriter`
  ADD CONSTRAINT `cw_username` FOREIGN KEY (`username`) REFERENCES `person` (`username`);

--
-- Constraints for table `login`
--
ALTER TABLE `login`
  ADD CONSTRAINT `fk_email` FOREIGN KEY (`email`) REFERENCES `person` (`email`),
  ADD CONSTRAINT `fk_username` FOREIGN KEY (`username`) REFERENCES `person` (`username`);

--
-- Constraints for table `registereduser`
--
ALTER TABLE `registereduser`
  ADD CONSTRAINT `registered_username` FOREIGN KEY (`username`) REFERENCES `person` (`username`);

--
-- Constraints for table `systemadmin`
--
ALTER TABLE `systemadmin`
  ADD CONSTRAINT `admin_username` FOREIGN KEY (`username`) REFERENCES `person` (`username`);

--
-- Constraints for table `trainserviceprovider`
--
ALTER TABLE `trainserviceprovider`
  ADD CONSTRAINT `tsp_username` FOREIGN KEY (`username`) REFERENCES `person` (`username`);

--
-- Constraints for table `trainstops`
--
ALTER TABLE `trainstops`
  ADD CONSTRAINT `trainstops_stationid` FOREIGN KEY (`stationid`) REFERENCES `station` (`stationID`),
  ADD CONSTRAINT `trainstops_triainid` FOREIGN KEY (`trainID`) REFERENCES `train` (`trainID`);

--
-- Constraints for table `traintrip`
--
ALTER TABLE `traintrip`
  ADD CONSTRAINT `traintrip_trainid` FOREIGN KEY (`trainID`) REFERENCES `train` (`trainID`),
  ADD CONSTRAINT `traintrip_tripid` FOREIGN KEY (`tripID`) REFERENCES `trip` (`tripID`);

--
-- Constraints for table `trip`
--
ALTER TABLE `trip`
  ADD CONSTRAINT `trip_sourceID` FOREIGN KEY (`sourceID`) REFERENCES `station` (`stationID`),
  ADD CONSTRAINT `trip_userID` FOREIGN KEY (`userID`) REFERENCES `registereduser` (`userId`);

--
-- Constraints for table `tripdestination`
--
ALTER TABLE `tripdestination`
  ADD CONSTRAINT `tripdestination_tripid` FOREIGN KEY (`tripID`) REFERENCES `trip` (`tripID`);

--
-- Constraints for table `userdestination`
--
ALTER TABLE `userdestination`
  ADD CONSTRAINT `destination_userid` FOREIGN KEY (`userId`) REFERENCES `registereduser` (`userId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
