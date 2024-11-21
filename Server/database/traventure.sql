-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 21, 2024 at 05:12 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

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
('exampleUser', 'john@gmail.com', '$2y$10$WuC8oD2QqXqyiRC.4brkwOAADS.E4Vk6uNbYRirSBUl2Ru1N5m.dC', ''),
('imnot_naveen', 'naveenharinda2@gmail.com', '$2y$10$V1gFv0ZxZJIlaH/oOG/OAuQFJfhKwyovsC8Km87zUjcqwX4wuYjIe', '');

-- --------------------------------------------------------

--
-- Table structure for table `person`
--

CREATE TABLE `person` (
  `username` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contactNo` int(11) NOT NULL,
  `userType` varchar(255) NOT NULL,
  `profile_picture` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `person`
--

INSERT INTO `person` (`username`, `firstName`, `lastName`, `email`, `contactNo`, `userType`, `profile_picture`) VALUES
('exampleUser', 'John', 'Doe', 'john@gmail.com', 123456789, 'Traveller', ''),
('imnot_naveen', 'Naveen ', 'Harinda', 'naveenharinda2@gmail.com', 774554321, 'Traveller', '');

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
-- Table structure for table `routes`
--

CREATE TABLE `routes` (
  `routeName` varchar(255) NOT NULL,
  `startStation` int(11) NOT NULL,
  `endStation` int(11) NOT NULL,
  `orderedStations` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `routes`
--

INSERT INTO `routes` (`routeName`, `startStation`, `endStation`, `orderedStations`) VALUES
('Coastal', 101, 188, '101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188');

-- --------------------------------------------------------

--
-- Table structure for table `station`
--

CREATE TABLE `station` (
  `stationID` int(4) NOT NULL,
  `city` varchar(20) NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `station`
--

INSERT INTO `station` (`stationID`, `city`, `name`) VALUES
(101, 'Maradana', 'Maradana'),
(102, 'Colombo', 'Colombo Fort'),
(103, 'Colombo', 'Secretariat Halt'),
(104, 'Kompanna Vidiya', 'Kompanna Vidiya'),
(105, 'Kollupitiya', 'Kollupitiya'),
(106, 'Bambalapitiya', 'Bambalapitiya'),
(107, 'Wellawatta', 'Wellawatta'),
(108, 'Dehiwala', 'Dehiwala'),
(109, 'Mount Lavinia', 'Mount Lavinia'),
(110, 'Ratmalana', 'Ratmalana'),
(111, 'Angulana', 'Angulana'),
(112, 'Lunawa', 'Lunawa'),
(113, 'Moratuwa', 'Moratuwa'),
(114, 'Koralawalla', 'Koralawalla'),
(115, 'Egoda Uyana', 'Egoda Uyana'),
(116, 'Bolgoda', 'Bolgoda Lake'),
(117, 'Panadura', 'Panadura'),
(118, 'Pinwatta', 'Pinwatta'),
(119, 'Wadduwa', 'Wadduwa'),
(120, 'Pothupitiya', 'Train Halt No 01'),
(121, 'Kalutara North', 'Kalutara North'),
(122, 'Kalutara', 'Kalu Ganga'),
(123, 'Kalutara South', 'Kalutara South'),
(124, 'Katukurunda', 'Katukurunda'),
(125, 'Paiyagala North', 'Paiyagala North'),
(126, 'Paiyagala South', 'Paiyagala South'),
(127, 'Maggona', 'Maggona'),
(128, 'Beruwala', 'Beruwala'),
(129, 'Hettimulla', 'Hettimulla'),
(130, 'Aluthgama', 'Aluthgama'),
(131, 'Benthota', 'Benthota Ganga'),
(132, 'Bentota', 'Bentota'),
(133, 'Induruwa', 'Induruwa'),
(134, 'Maha Induruwa', 'Maha Induruwa'),
(135, 'Kosgoda', 'Kosgoda'),
(136, 'Piyagama', 'Piyagama'),
(137, 'Ahungalla', 'Ahungalla'),
(138, 'Pathagangoda', 'Pathagangoda'),
(139, 'Balapitiya', 'Balapitiya'),
(140, 'Balapitiya', 'Madu Ganga'),
(141, 'Andadola', 'Andadola'),
(142, 'Kandegoda', 'Kandegoda'),
(143, 'Ambalangoda', 'Ambalangoda'),
(144, 'Madampe', 'Madampe Lagoon'),
(145, 'Madampagama', 'Madampagama'),
(146, 'Akurala', 'Akurala'),
(147, 'Kahawa', 'Kahawa'),
(148, 'Telwatta', 'Telwatta'),
(149, 'Sinigama', 'Sinigama'),
(150, 'Hikkaduwa', 'Hikkaduwa'),
(151, 'Thiranagama', 'Thiranagama'),
(152, 'Kumarakanda', 'Kumarakanda'),
(153, 'Rathgama', 'Rathgama Lagoon'),
(154, 'Dodanduwa', 'Dodanduwa'),
(155, 'Rajgama', 'Rajgama'),
(156, 'Boossa', 'Boossa'),
(157, 'Boossa', 'Gin Ganga'),
(158, 'Ginthota', 'Ginthota'),
(159, 'Piyadigama', 'Piyadigama'),
(160, 'Galle', 'Richmond Hill'),
(161, 'Galle', 'Galle'),
(162, 'Katugoda', 'Katugoda'),
(163, 'Unawatuna', 'Unawatuna'),
(164, 'Talpe', 'Talpe'),
(165, 'Habaraduwa', 'Habaraduwa'),
(166, 'Koggala', 'Koggala'),
(167, 'Koggala', 'Koggala Lagoon'),
(168, 'Kathaluwa', 'Kathaluwa'),
(169, 'Ahangama', 'Ahangama'),
(170, 'Midigama', 'Midigama'),
(171, 'Kubalgama', 'Kubalgama'),
(172, 'Weligama', 'Weligama'),
(173, 'Polwatta', 'Polwatta Ganga'),
(174, 'Polwathumodara', 'Polwathumodara'),
(175, 'Mirissa', 'Mirissa'),
(176, 'Kamburugamuwa', 'Kamburugamuwa'),
(177, 'Walgama', 'Walgama'),
(178, 'Matara', 'Matara'),
(179, 'Piladuwa', 'Piladuwa'),
(180, 'Nilwala', 'Nilwala Ganga'),
(181, 'Weherahena', 'Weherahena'),
(182, 'Nakuttiyagama', 'Nakuttiyagama Tunnel'),
(183, 'Kekanadura', 'Kekanadura'),
(184, 'Babarenda', 'Babarenda'),
(185, 'Akurubebila', 'Akurubebila Tunnel'),
(186, 'Wavurukannala', 'Wavurukannala'),
(187, 'Dedduwawala', 'Dedduwawala'),
(188, 'Beliatta', 'Beliatta');

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
  `type` varchar(20) NOT NULL,
  `startStation` int(11) NOT NULL,
  `endStation` int(11) NOT NULL,
  `departureTime` time NOT NULL,
  `arrivalTime` time NOT NULL
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
-- Indexes for table `routes`
--
ALTER TABLE `routes`
  ADD PRIMARY KEY (`routeName`),
  ADD KEY `fk_startStation` (`startStation`),
  ADD KEY `fk_endStation` (`endStation`);

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
  ADD CONSTRAINT `fk_email` FOREIGN KEY (`email`) REFERENCES `person` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_username` FOREIGN KEY (`username`) REFERENCES `person` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `registereduser`
--
ALTER TABLE `registereduser`
  ADD CONSTRAINT `registered_username` FOREIGN KEY (`username`) REFERENCES `person` (`username`);

--
-- Constraints for table `routes`
--
ALTER TABLE `routes`
  ADD CONSTRAINT `fk_endStation` FOREIGN KEY (`endStation`) REFERENCES `station` (`stationID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_startStation` FOREIGN KEY (`startStation`) REFERENCES `station` (`stationID`) ON DELETE CASCADE ON UPDATE CASCADE;

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
