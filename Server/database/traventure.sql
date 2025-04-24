-- MariaDB dump 10.19  Distrib 10.4.24-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: traventure4
-- ------------------------------------------------------
-- Server version	10.4.24-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `blogposts`
--

DROP TABLE IF EXISTS `blogposts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blogposts` (
  `blog_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `intro` text NOT NULL,
  `content` text NOT NULL,
  `imageURL` varchar(500) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`blog_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogposts`
--

LOCK TABLES `blogposts` WRITE;
/*!40000 ALTER TABLE `blogposts` DISABLE KEYS */;
INSERT INTO `blogposts` VALUES (3,'Hiking in Sri Lanka: A guide to the country’s best treks','any','Can you go hiking in Sri Lanka? Surprisingly, yes! Most of us probably think of beaches and historical sites when we picture this tropical island, but Sri Lanka actually has a lot of great hikes. You may not believe me if you’re reading this from a plot of sand on the south coast, planning your next move, but I promise you it’s possible to be cold in this country. No, I swear.','Can you go hiking in Sri Lanka? Surprisingly, yes! Most of us probably think of beaches and historical sites when we picture this tropical island, but Sri Lanka actually has a lot of great hikes. You may not believe me if you’re reading this from a plot of sand on the south coast, planning your next move, but I promise you it’s possible to be cold in this country. No, I swear.\r\n\r\nThe four most popular places to hike in Sri Lanka are the mountains near Ella, Adam’s Peak Wilderness Sanctuary, Horton Plains National Park, and the Knuckles Mountain Range. The last three are located in Sri Lanka’s Central Province. Ella is nearby but technically located in Uva Province. \r\n\r\nMost of these places offer day hikes, but it’s possible to arrange multi-day treks in the Knuckles range.\r\n\r\nBelow I have outlined the best places to hike in Sri Lanka as well as how to get to each location.\r\n\r\nElla: Hiking in Sri Lanka’s most popular mountain town\r\nElla is a welcome break for many travelers, whether they’re coming from the coast or the North Central Province. If you’re coming from the beach, you’ll probably be thankful for the cool mountain air. (Well, at least in the evenings.) Travelers coming from Polonnaruwa, Anuradhapura, and other places packed with historical and cultural sights will likely welcome the chance to just relax and enjoy nature.  \r\nThere are two popular hikes in Ella: an easy hike to “Little Adam’s Peak,” and a slightly longer and more challenging climb to Ella Rock. \r\n\r\nLittle Adam’s Peak: Easy hiking in Sri Lanka\r\nIf you’re looking for a straightforward hike that isn’t too strenuous, Little Adam’s Peak is a great choice. Ella is on most people’s itineraries anyway, so you won’t have to travel out of your way. The hike itself only takes a couple of hours (roundtrip), and the views are phenomenal. \r\n\r\nThe trail to Little Adam’s Peak starts next to the small Flower Garden café. This is a 10-20 minute walk from most places in Ella. By scooter or tuk-tuk, you can drive an additional 700 meters from here as the first section is paved. \r\nLittle Adam’s Peak: Easy hiking in Sri Lanka\r\nIf you’re looking for a straightforward hike that isn’t too strenuous, Little Adam’s Peak is a great choice. Ella is on most people’s itineraries anyway, so you won’t have to travel out of your way. The hike itself only takes a couple of hours (roundtrip), and the views are phenomenal. \r\n\r\nThe trail to Little Adam’s Peak starts next to the small Flower Garden café. This is a 10-20 minute walk from most places in Ella. By scooter or tuk-tuk, you can drive an additional 700 meters from here as the first section is paved. \r\nThe path winds through beautiful tea farms, with a fantastic view of Ella Rock, before heading upward. There is a main peak and a secondary peak, both of which feature sweeping views of the surrounding valley and mountains in the distance. \r\n\r\nNote that there is very little shade on the hike, so start early. (I am not a morning person and did not heed this advice. It. Was. Sweltering. Very pretty though!) ','../../Public/Uploads/Mountain-vistas-on-Little-Adams-Peak-hike-in-Ella.jpg','2024-11-29 06:39:01','2024-11-29 06:39:01'),(4,'Surfing the Sri Lankan Coast','any','Sri Lanka\'s pristine beaches, warm Indian Ocean waters, and consistent waves make it a surfer\'s paradise. Whether you\'re a seasoned pro or a beginner looking to catch your first wave, Sri Lanka offers a variety of surf breaks to suit all skill levels.','Sri Lanka\'s south coast, particularly the areas around Arugam Bay and Mirissa, is renowned for its world-class surf spots. Arugam Bay, with its long, peeling waves, is a popular destination for experienced surfers. For beginners, Mirissa offers gentle, rolling waves ideal for learning the basics.\r\n\r\nBeyond the waves, Sri Lanka\'s surf culture is vibrant and welcoming. You can join surf camps, rent equipment, and take lessons from experienced instructors. After a day of surfing, unwind at beachside cafes, indulge in delicious seafood, and experience the warm hospitality of the locals.\r\n\r\n\r\n\r\n','../../Public/Uploads/surfing-sri-lanka-surf.jpg','2024-11-29 06:43:45','2024-11-29 06:43:45'),(5,'Trekking through the Hill Country','any','Sri Lanka\'s Hill Country, with its lush green tea plantations, misty mountains, and cascading waterfalls, is a hiker\'s dream. Embark on a trekking adventure through this breathtaking landscape and discover hidden gems, encounter diverse wildlife, and immerse yourself in the tranquility of nature.','The Hill Country offers a variety of trekking trails, from easy day hikes to challenging multi-day expeditions. Popular trails include the Adam\'s Peak pilgrimage, the Horton Plains National Park, and the Knuckles Mountain Range. Along the way, you\'ll encounter picturesque villages, ancient temples, and stunning viewpoints.\r\n\r\nAs you hike through the tea plantations, you\'ll witness the intricate process of tea production, from plucking the leaves to the final cup. Don\'t miss the opportunity to visit a tea factory and learn about the history and culture of tea in Sri Lanka.','../../Public/Uploads/trekking.jpg','2024-11-29 06:45:27','2024-11-29 06:45:27'),(6,'Wildlife Safari in Yala National Park','any','Yala National Park, one of Sri Lanka\'s most renowned wildlife sanctuaries, is home to a diverse range of animals, including leopards, elephants, bears, and a variety of bird species. Embark on a thrilling safari and witness these magnificent creatures in their natural habitat.','A safari in Yala National Park is an unforgettable experience. As you traverse the park\'s open grasslands and dense forests, keep your eyes peeled for leopards lounging on trees, elephants bathing in waterholes, and herds of deer grazing peacefully.\r\n\r\nThe park is also a birdwatcher\'s paradise, with over 200 species of birds, including the colorful peafowl and the elusive Sri Lankan junglefowl. Early morning and late afternoon safaris offer the best opportunities to spot wildlife, as animals are more active during these times.','../../Public/Uploads/safari.jpg','2024-11-29 06:46:44','2024-11-29 06:46:44'),(7,'Cultural Immersion in Kandy','any','Kandy, the cultural capital of Sri Lanka, is a city steeped in history and tradition. Explore its ancient temples, vibrant markets, and stunning botanical gardens to experience the rich heritage of this enchanting city.','The Temple of the Tooth Relic, one of the most sacred Buddhist sites in the world, is the heart of Kandy. This magnificent temple houses the sacred tooth relic of the Buddha and attracts pilgrims from all over the world.\r\n\r\nBeyond the temples, Kandy offers a variety of cultural experiences. Visit the Peradeniya Botanical Garden, one of the largest botanical gardens in Asia, and admire the diverse collection of plants and flowers. Explore the bustling Kandy market, where you can find everything from fresh produce to colorful handicrafts.','../../Public/Uploads/kandy.jpg','2024-11-29 06:48:41','2024-11-29 06:48:41'),(8,'Beach Bliss in Mirissa','any','Mirissa, a picturesque coastal town, is a popular destination for beach lovers and water sports enthusiasts. Relax on its pristine beaches, swim in the crystal-clear waters, or indulge in exciting water activities like whale watching and snorkeling.','Mirissa\'s main beach is a long stretch of golden sand, perfect for sunbathing, swimming, and building sandcastles. The calm waters are ideal for beginners to learn surfing, while experienced surfers can head to nearby Weligama for bigger waves.\r\n\r\nOne of the most popular activities in Mirissa is whale watching. From December to April, you can embark on a boat tour and witness majestic whales, including blue whales and sperm whales, breaching the surface of the ocean.\r\n\r\nFor underwater adventures, head to the nearby coral reefs for snorkeling and diving. Discover a vibrant underwater world teeming with colorful fish and marine life.','../../Public/Uploads/Palm-tree-grove-Mirissa.jpg','2024-11-29 06:49:39','2024-11-29 06:49:39');
/*!40000 ALTER TABLE `blogposts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bookings` (
  `bookingID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `start_station` int(11) NOT NULL,
  `destination_station` int(11) NOT NULL,
  `class` enum('first','secend','third') NOT NULL,
  `no_of_passengers` int(11) NOT NULL,
  `total_fare` decimal(10,2) NOT NULL,
  `paymentMethod` enum('Cash','Card') NOT NULL,
  `paymentStatus` enum('Paid','Pending') DEFAULT 'Pending',
  `bookingDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `kidsCount` int(11) DEFAULT 0,
  `trainID` int(11) NOT NULL,
  PRIMARY KEY (`bookingID`),
  KEY `bookings_ibfk_1` (`userID`),
  KEY `bookings_ibfk_3` (`start_station`),
  KEY `bookings_ibfk_4` (`destination_station`),
  KEY `bookings_ibfk_5` (`trainID`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `registereduser` (`userId`),
  CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`start_station`) REFERENCES `station` (`stationID`),
  CONSTRAINT `bookings_ibfk_4` FOREIGN KEY (`destination_station`) REFERENCES `station` (`stationID`),
  CONSTRAINT `bookings_ibfk_5` FOREIGN KEY (`trainID`) REFERENCES `train` (`trainID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,7,102,161,'',1,311.25,'Card','Pending','2025-04-23 04:08:46',0,51),(2,7,102,161,'',2,1200.00,'Card','Pending','2025-04-23 06:42:49',0,51),(3,7,102,161,'third',1,311.25,'Card','Pending','2025-04-23 06:51:37',0,51),(4,10,102,161,'',2,1200.00,'Card','Pending','2025-04-23 17:55:52',0,51);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contact` (
  `contactID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `phone` int(10) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  PRIMARY KEY (`contactID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact`
--

LOCK TABLES `contact` WRITE;
/*!40000 ALTER TABLE `contact` DISABLE KEYS */;
INSERT INTO `contact` VALUES (3,'Naveen Harinda',774554321,'naveenharinda2@gmail.com','This is a test contact form submission. Testing 1,2,3....');
/*!40000 ALTER TABLE `contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contentwriter`
--

DROP TABLE IF EXISTS `contentwriter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contentwriter` (
  `CWID` int(6) NOT NULL,
  `username` varchar(255) NOT NULL,
  `status` enum('Active','Inactive','') NOT NULL DEFAULT 'Active',
  PRIMARY KEY (`CWID`),
  KEY `cw_username` (`username`),
  CONSTRAINT `cw_username` FOREIGN KEY (`username`) REFERENCES `person` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contentwriter`
--

LOCK TABLES `contentwriter` WRITE;
/*!40000 ALTER TABLE `contentwriter` DISABLE KEYS */;
INSERT INTO `contentwriter` VALUES (10005,'dimuthu_cw','Active');
/*!40000 ALTER TABLE `contentwriter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `destination`
--

DROP TABLE IF EXISTS `destination`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `destination` (
  `destination_id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `nearestStation` int(11) NOT NULL,
  PRIMARY KEY (`destination_id`),
  KEY `fk_nearStation` (`nearestStation`),
  CONSTRAINT `fk_nearStation` FOREIGN KEY (`nearestStation`) REFERENCES `station` (`stationID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `destination`
--

LOCK TABLES `destination` WRITE;
/*!40000 ALTER TABLE `destination` DISABLE KEYS */;
INSERT INTO `destination` VALUES (1,'Galle Fort ','Galle Fort (Sinhala: ගාලු කොටුව Galu Kotuwa; Tamil: காலிக் கோட்டை, romanized: Kālik Kōṭṭai), in the Bay of Galle on the southwest coast of Sri Lanka, was built first in 1588 by the Portuguese, then extensively fortified by the Dutch during the 17th century from 1649 onwards. It is a historical, archaeological and architectural heritage monument, which even after more than 437 years maintains a polished appearance, due to extensive reconstruction work done by the Archaeological Department of Sri Lanka.\r\n\r\nThe fort has a colourful history, and today has a multi-ethnic and multi-religious population.The Sri Lankan government and many Dutch people who still own some of the properties inside the fort are looking at making this one of the modern wonders of the world.The heritage value of the fort has been recognized by the UNESCO and the site has been inscribed as a cultural heritage UNESCO World Heritage Site under criteria iv, for its unique exposition of \"an urban ensemble which illustrates the interaction of European architecture and South Asian traditions from the 16th to the 19th centuries.\"\r\n\r\nThe Galle Fort, also known as the Dutch Fort or the \"Ramparts of Galle\", withstood the Boxing Day tsunami of 2004 which damaged part of coastal area Galle town. It has since been restored.',161),(6,'Koggala','Koggala (Sinhala: කොග්ගල, romanized: Koggala; Tamil: கொக்கலை, romanized: Kokkalai) is a small coastal town, situated at the edge of a lagoon on the south coast of Sri Lanka, located in Galle District, Southern Province, Sri Lanka, governed by an Urban Council. Koggala is bounded on one side by a reef, and on the other by a large lake, Koggala Lake, into which the numerous tributaries of the Koggala Oya drain. It is approximately 139 kilometres (86 mi) south of Colombo and is situated at an elevation of 3 metres (9.8 ft) above sea level.\r\n\r\n',166),(7,'Richmond Castle ','Richmond Castle is an Edwardian mansion, located near Kalutara. Built between 1900 and 1910, it was formally the country seat of Mudaliyar Don Arthur de Silva Wijesinghe Siriwardena. The building is currently owned by the Public Trustee and open to the public.\r\n\r\nThe house sits on a hill 2 km (1.2 mi) from the Kalutara, adjoining the Kalu Ganga River at Palatota,on a 42 acres (17 ha) estate beside the Kalutara-Palatota Road.',123),(8,'Unawatuna Beach','Unawatuna Beach in Unawatuna, Sri Lanka, is a popular tourist destination known for its beautiful golden sands, vibrant atmosphere, and clear turquoise waters. It\'s a great spot for swimming, sunbathing, and enjoying the lively beach vibe. The beach is also known for its proximity to coral reefs and shipwrecks, making it a popular destination for snorkeling and diving. ',163),(9,'nvnhvnb','fjkbvsd',115),(11,'Mount Lavinia Beach ','Mount Lavinia Beach is located just out of the Colombo city. This beach strip has a lot to offer for the locals as well as the tourists visiting Colombo. Along the beach there are many nice restaurants pubs as well as relaxing areas. As a tourist who is visiting Colombo, Mount Lavinia Beach is a must visit. The weekends could be crowded with locals though, during the week it is relaxing and peaceful. If you would relax at a pool overlooking the ocean or the sunset, The Mount Lavinia Hotel terrace is recommended. You can use the Mount Lavinia Hotel pool for an affordable fee.',109),(12,'Barbaryn Lighthouse - Beruwala','Barberyn Lighthouse (also known as Beruwala Lighthouse) is a lighthouse located on Barberyn Island. Barberyn Island a 3.25 ha (8.0 acres) island situated 0.8 km (0.50 mi) offshore from the town of Beruwala on the south-west coast of Sri Lanka,56 km (35 mi) south of Colombo.The lighthouse is a 34 m (112 ft) high round white conical granite tower.\r\n\r\nThe lighthouse was completed in November 1889,and operated by the Imperial Lighthouse Service. In 1969 it was upgraded with the replacement of the old dioptric apparatus (produced by Chance Brothers) and with a pedestal rotating beacon (Pharos Marine PRB-21 sealed beam optic and drive pedestal). It was further modernised in 2000, with the introduction of a Differential Global Positioning System (DGPS) and is computer linked to the other major lighthouses around the country. The Barberyn Lighthouse is one of the four international lighthouses in Sri Lanka.',128),(14,'Hikkaduwa Coral Reef','Hikkaduwa National Park is one of the three marine national parks in Sri Lanka. It is home to some of the best coral gardens in Asia. The national park contains a fringing coral reef of a high degree of biodiversity. The area was declared a wildlife sanctuary on May 18, 1979. Hikkaduwa coral reef is a typical shallow fringing reef with an average depth of around 5 meters (16 ft).\r\n\r\nFoliaceous Montipora species dominate the coral reef. Encrusting and branching species are also present. Faviidae and Poritidae corals are contained in the inshore areas of the reef in massive colonies. Staghorn, elkhorn, cabbage, brain, table, and star corals are all present in the reef. Corals of 60 species belonging to 31 genera are recorded from the reef. The reef also recorded over 170 species of reef fish belonging to 76 genera.\r\n\r\nSeagrass and marine algae belonging to genera Halimeda and Caulerpa are common in the seabed depth ranging from 5–10 m. Seagrasses provide habitat to Dugong and sea turtles. Some species of prawns feed on the seagrass. Eight species of ornamental fishes also inhabit the reef, along with many vertebrates and invertebrates including crabs, prawns, shrimps, oysters, and sea worms. Porites desilveri is an endemic coral species of Sri Lanka. Chlorurus rhakoura and Pomacentrus proteus are two reef fish species confined to Sri Lanka. Blacktip reef shark is found along the outer slope of the reef. Three sea turtles that have been categorized threatened to visit the coral reef: the hawksbill turtle, green turtle, and Olive Ridley.',150);
/*!40000 ALTER TABLE `destination` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `destinationphotos`
--

DROP TABLE IF EXISTS `destinationphotos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `destinationphotos` (
  `destination` int(11) NOT NULL,
  `photoName` varchar(255) NOT NULL,
  KEY `fk_destination` (`destination`),
  CONSTRAINT `fk_destination` FOREIGN KEY (`destination`) REFERENCES `destination` (`destination_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `destinationphotos`
--

LOCK TABLES `destinationphotos` WRITE;
/*!40000 ALTER TABLE `destinationphotos` DISABLE KEYS */;
INSERT INTO `destinationphotos` VALUES (1,'Galle-Fort.jpg'),(9,'safari.jpg'),(11,'mount lavinia beach.jpg'),(12,'Barberyn-Island1.jpg'),(12,'Barbaryn.jpg'),(7,'richmondCastle.webp'),(7,'richmond-castle-kalutara-attractions.jpg'),(8,'michael-hacker-VCksv_sJ9hM-unsplash-980x735.jpg'),(8,'unawatuna-swing2-669x1024.jpg'),(14,'hikkaduwa-beach-drone-1.jpg'),(14,'hikkaduwa-coral-reef.jpg');
/*!40000 ALTER TABLE `destinationphotos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `destinationtypes`
--

DROP TABLE IF EXISTS `destinationtypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `destinationtypes` (
  `type_id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `photo` varchar(255) NOT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `destinationtypes`
--

LOCK TABLES `destinationtypes` WRITE;
/*!40000 ALTER TABLE `destinationtypes` DISABLE KEYS */;
INSERT INTO `destinationtypes` VALUES (1,'waterfall','waterfall.jpg'),(2,'mountain','mountain.jpg'),(3,'beach','beach.jpg'),(4,'forest','forest.jpg'),(5,'historical site','historical-site.jpg'),(6,'National Park','nationalpark.jpg');
/*!40000 ALTER TABLE `destinationtypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `desttypes`
--

DROP TABLE IF EXISTS `desttypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `desttypes` (
  `destination` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  KEY `destType_destination` (`destination`),
  KEY `destType_type` (`type`),
  CONSTRAINT `destType_destination` FOREIGN KEY (`destination`) REFERENCES `destination` (`destination_id`),
  CONSTRAINT `destType_type` FOREIGN KEY (`type`) REFERENCES `destinationtypes` (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `desttypes`
--

LOCK TABLES `desttypes` WRITE;
/*!40000 ALTER TABLE `desttypes` DISABLE KEYS */;
INSERT INTO `desttypes` VALUES (1,5),(6,3),(6,5),(7,5),(8,3),(11,3),(12,3),(12,5),(14,3),(14,6);
/*!40000 ALTER TABLE `desttypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `driver`
--

DROP TABLE IF EXISTS `driver`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `driver` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `assigned_station` int(11) NOT NULL,
  `availability` enum('Available','Unavailable') NOT NULL,
  `vehicleID` varchar(15) NOT NULL,
  `license` int(15) NOT NULL,
  `status` enum('Active','Inactive') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `driver_1` (`username`),
  KEY `driver_2` (`assigned_station`),
  CONSTRAINT `driver_1` FOREIGN KEY (`username`) REFERENCES `person` (`username`),
  CONSTRAINT `driver_2` FOREIGN KEY (`assigned_station`) REFERENCES `station` (`stationID`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `driver`
--

LOCK TABLES `driver` WRITE;
/*!40000 ALTER TABLE `driver` DISABLE KEYS */;
INSERT INTO `driver` VALUES (8,'dimuthuhhhh',105,'Available','VEH789',0,'Active'),(9,'dimuthuhhhh1',105,'Available','VEH789',0,'Active'),(10,'dimu2hh1',107,'Available','VEH789',0,'Active'),(11,'Array',105,'Available','123456',98765,'Active'),(12,'dim2hh1',107,'Available','VEH789',0,'Active'),(13,'dimu',106,'Available','56789',5678,'Active'),(14,'samanD',122,'Available','12345',12349,'Active');
/*!40000 ALTER TABLE `driver` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `driverrequests`
--

DROP TABLE IF EXISTS `driverrequests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `driverrequests` (
  `driverID` int(11) NOT NULL,
  `requestID` int(11) NOT NULL,
  PRIMARY KEY (`driverID`,`requestID`),
  KEY `requestID` (`requestID`),
  CONSTRAINT `driverrequests_ibfk_1` FOREIGN KEY (`driverID`) REFERENCES `driver` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `driverrequests_ibfk_2` FOREIGN KEY (`requestID`) REFERENCES `riderequests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `driverrequests`
--

LOCK TABLES `driverrequests` WRITE;
/*!40000 ALTER TABLE `driverrequests` DISABLE KEYS */;
INSERT INTO `driverrequests` VALUES (13,1);
/*!40000 ALTER TABLE `driverrequests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fare_rates`
--

DROP TABLE IF EXISTS `fare_rates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fare_rates` (
  `class` varchar(255) NOT NULL,
  `base_fare` decimal(10,2) NOT NULL,
  `per_km_rate` decimal(10,2) NOT NULL,
  PRIMARY KEY (`class`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fare_rates`
--

LOCK TABLES `fare_rates` WRITE;
/*!40000 ALTER TABLE `fare_rates` DISABLE KEYS */;
INSERT INTO `fare_rates` VALUES ('first',100.00,10.00),('second',50.00,5.00),('third',30.00,2.50);
/*!40000 ALTER TABLE `fare_rates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inactiveusers`
--

DROP TABLE IF EXISTS `inactiveusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inactiveusers` (
  `username` varchar(20) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contactNo` int(11) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inactiveusers`
--

LOCK TABLES `inactiveusers` WRITE;
/*!40000 ALTER TABLE `inactiveusers` DISABLE KEYS */;
/*!40000 ALTER TABLE `inactiveusers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `login` (
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `userType` varchar(255) NOT NULL,
  PRIMARY KEY (`username`,`email`),
  KEY `fk_email` (`email`),
  CONSTRAINT `fk_email` FOREIGN KEY (`email`) REFERENCES `person` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_username` FOREIGN KEY (`username`) REFERENCES `person` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login`
--

LOCK TABLES `login` WRITE;
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
INSERT INTO `login` VALUES ('admin1','kasun@email.com','$2y$10$b47l486puXc8AePZ54hTAeC0SHJOmIhfEimj32Zl1x8zLSaxh45lW','Admin'),('adminUser','dimuthuharshamal99@gmail.com','$2y$10$.8DbRDuO.LLt4XukC.jzx.MAs6tCiZItLnHzRzznMDzefj39AIVvq','Admin'),('Array','diuravi24@gmail.com','$2y$10$sgyKHVTLB0uW39p9Pu/fGuMZ4VW3tGFbL4uYFEv3Aeg3KDePYtkXO','Driver'),('chami','chami@gmail.com','$2y$10$hnSsc6F8M2ArftDqo0/IJuux4H1BKiqGwYBnbPzlMJxd/VyRn95U2','Traveller'),('dim2hh1','sachin.rijeer@example.com','$2y$10$3ecrSsG0/3ywdAMZI1mFHOzupb62ALB/HS/TFKob6R5bTyyrUVrvG','Driver'),('dimu','anurjja@gmail.com','$2y$10$a3VbKiFbCHajJhyqJIlbFOW9uvRq5Gr8Mb3Q9rRM3Y5JQ3F1wzBQC','Driver'),('dimu2hh1','sachin.drijeer@example.com','$2y$10$2KQCnhWO6KZExeqfYei2a./gREpzqyO4avVJiYcW0nG/O/5mCcJAq','Driver'),('dimuthuh','dimuthu@gmail.com','$2y$10$H6qBJaHHnPankeFWe8KYh.zQZqimJnkmG7SfZxcKBcfvMS.fJEt0q','Traveller'),('dimuthuhhhh','sachin.driver@example.com','$2y$10$n3DvrhXAjZ/y.RTrklbuiu8qD8EtNOOYERoj7SetEGbf6KJIlFNjy','Driver'),('dimuthuhhhh1','sachin.drijver@example.com','$2y$10$DKesV876ZDzkSDZQFffae.yOKOSJ.r5RF0YK/REwcKAPwe..qeGlm','Driver'),('dimuthu_cw','dimuravi4@gmail.com','$2y$10$/3wyBrKELgndqQ.bnrvrWeECRPVQsKJ.mOMig0/2eeMQR0MHceCw.','CW'),('exampleTSP','naveenharinda@gmail.com','$2y$10$x.9PMH7T6krydJ54.UhFD.bgyk4M2gXdtqNrYJOozaIRWWwTB90rS','tsp'),('imnot_naveen','naveenharinda2@gmail.com','$2y$10$p/VZt4fK0zsMBwTy41MgnuEKwObVltyOspSU5GZDAPK69Y.mjZUmO','Traveller'),('loki','loki@gmail.com','$2y$10$9bPv6pexdOxTeOV3ARSTluDlje8eLekwy8NfqImur6o.grSO//iby','Traveller'),('nadhiya','nadhiya@gmail.com','$2y$10$AfAVUQil64D4JRwKBEgn6u5c4wdKpb13nHZx8MWf10QT4zuNiZqpW','Traveller'),('newDimuthu','anura@gmail.com','$2y$10$AmvL3A/SNGWZmfxkq36fOuxh8f0nUD6Gbk2OYWSiVMszaFESTeari','Traveller'),('newq','dimuthuharshamal5@gmail.com','$2y$10$g2fLv2.F7CnhyYDUjJP3iu7QzXra0Z4FhoiLbymY11XL45EN2H1bC','Traveller'),('samanD','samankumara@gmail.com','$2y$10$HXcrzbaj5X/WaPHBy1pkJelTI8Q/rFoJZ/XcNDmVB.RkFHzcDNKnG','Driver'),('testUser','testuser@gmail.com','$2y$10$cFHboCuAq/34MhiakwRMmOU5t3.ksXcT1/qRQ7NpJp15UgkdK6bYW','Traveller'),('test_admin','test@admin.com','$2y$10$8sQmIRWfrcLtfGiZ0Jd2teXyp4K79GE9xBJjtwqc1Op9ZbVR.TrdK','Admin'),('test_cw','test@cw.com','$2y$10$4OjWaZptycct9o8WjrS41.OF99Donbx9bPJSgGfdnO4qi36BqEfTa','CW'),('test_tsp','test@test.com','$2y$10$XRcPo4XFfhroAoXk80iIQe3obfEmjLTxhH1ayW8dn8GSQrMstI6B2','TSP'),('tspp','dimuthuharshamal2@gmail.com','$2y$10$ItyRt.4dJ2cCbxaRNHjQYutSDnXRLYLiSSm3CJljshnAjwddwpJuu','TSP'),('tsp_new','dimuthu1@gmail.com','$2y$10$LFbYcWFkPWTa8gbPZHjQ2OYQcxzGmJO/WCOsN97Sieu6m.3f5PezC','tsp'),('user9','dimuthuharshamal@gmail.com','$2y$10$PGDwAsEBe52kxOBZDGSpT.2m7PucN9TEbi0PsOuz25Z2cx9COMLsC','Traveller'),('virat','virat@gmail.com','$2y$10$vKu9sxmufkPPqtvtFFrBSuIpfDts5zjsKBZy/UCkaM01QykUrsjDW','Traveller');
/*!40000 ALTER TABLE `login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `person` (
  `username` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `IDNumber` varchar(15) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contactNo` int(11) NOT NULL,
  `userType` varchar(255) NOT NULL,
  `profile_picture` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `IDNumber` (`IDNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
INSERT INTO `person` VALUES ('admin1','Kasun','Perera','200220300112','kasun@email.com',767676887,'Admin','','2025-04-22 19:06:36'),('adminUser','Dimuthu','Admin','200114900776','dimuthuharshamal99@gmail.com',750737255,'Admin','','2025-04-23 11:58:06'),('Array','Dimuthu','Harshamal','200114900665','diuravi24@gmail.com',774422774,'','','2025-04-23 12:45:46'),('chami','Chamikara','Bandara','200113700882','chami@gmail.com',771122331,'Traveller','','2025-04-23 17:52:50'),('dim2hh1','Sachijn','Fernajndo','20014500779','sachin.rijeer@example.com',711734567,'','','2025-04-23 12:47:06'),('dimu','Dimuthu','Harshamal','200108601700','anurjja@gmail.com',776665544,'','','2025-04-23 12:51:56'),('dimu2hh1','Sachijn','Fernajndo','200114500779','sachin.drijeer@example.com',711734567,'','','2025-04-23 10:42:57'),('dimuthuh','Dimuthu','Harinda','200145603215  ','dimuthu@gmail.com',774554321,'Traveller','','2025-04-22 17:42:12'),('dimuthuhhhh','Sachin','Fernando','200114900779','sachin.driver@example.com',771234567,'','','2025-04-23 10:28:49'),('dimuthuhhhh1','Sachijn','Fernajndo','200114000779','sachin.drijver@example.com',711234567,'','','2025-04-23 10:33:36'),('dimuthu_cw','Dimuthu','portf','','dimuravi4@gmail.com',750737223,'CW','','2025-04-23 03:50:38'),('exampleTSP','Chamikara','Harinda','199812304589  ','naveenharinda@gmail.com',778899112,'','','2025-04-22 17:42:12'),('imnot_naveen','Naveen ','Harinda','200112200946','naveenharinda2@gmail.com',774554321,'Traveller','','2025-04-22 17:42:12'),('loki','Loki','Odin','457846054V','loki@gmail.com',2147483647,'Traveller','','2025-04-22 17:42:12'),('nadhiya','Nadhiya','Nashath','200045600198  ','nadhiya@gmail.com',774554321,'Traveller','','2025-04-22 17:42:12'),('newDimuthu','Dimuthu','Sir','200114900773','anura@gmail.com',750737225,'Traveller','','2025-04-22 18:37:04'),('newq','dimuthu','harshamal','200114900774','dimuthuharshamal5@gmail.com',750737221,'Traveller','','2025-04-23 04:05:46'),('samanD','Saman','Kumara','196543455700','samankumara@gmail.com',771231239,'','','2025-04-23 13:05:16'),('SteveSmith','Steve','Smith ','9999999','stevesmith@gmail.com',774554321,'Traveller','','2025-04-22 17:42:12'),('testUser','Test','User','200167802134  ','testuser@gmail.com',1233456789,'Traveller','','2025-04-22 17:42:12'),('test_admin','test','tester','200011201145  ','test@admin.com',1234567890,'Admin','','2025-04-22 17:42:12'),('test_cw','test','tester','901234567V','test@cw.com',123456789,'CW','','2025-04-22 17:42:12'),('test_tsp','test','tester','925476138V  ','test@test.com',1234567890,'TSP','','2025-04-22 17:42:12'),('tspp','tsp','ranasinghe','1965342313','dimuthuharshamal2@gmail.com',750737221,'TSP','','2025-04-22 19:14:41'),('tsp_new','tspdimuthu','Harinda','784512637X  ','dimuthu1@gmail.com',778899001,'','','2025-04-22 17:42:12'),('user9','Pawan','Kumara','200509900778','dimuthuharshamal@gmail.com',787889900,'Traveller','','2025-04-23 13:56:46'),('virat','Virat','Kohli','234245898V','virat@gmail.com',1234567890,'Traveller','','2025-04-22 17:42:12');
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registereduser`
--

DROP TABLE IF EXISTS `registereduser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `registereduser` (
  `userId` int(6) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`userId`),
  KEY `registered_username` (`username`),
  CONSTRAINT `registered_username` FOREIGN KEY (`username`) REFERENCES `person` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registereduser`
--

LOCK TABLES `registereduser` WRITE;
/*!40000 ALTER TABLE `registereduser` DISABLE KEYS */;
INSERT INTO `registereduser` VALUES (8,'adminUser'),(10,'chami'),(3,'dimuthuh'),(4,'newDimuthu'),(7,'newq'),(6,'tspp'),(9,'user9');
/*!40000 ALTER TABLE `registereduser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `riderequests`
--

DROP TABLE IF EXISTS `riderequests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `riderequests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clientID` int(11) NOT NULL,
  `destination` int(11) NOT NULL,
  `stationID` int(11) NOT NULL,
  `status` enum('Pending','Accepted') NOT NULL DEFAULT 'Pending',
  `tripID` int(11) NOT NULL,
  `rideDate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `riderequest_1` (`clientID`),
  KEY `riderequest_3` (`destination`),
  KEY `riderequest_2` (`tripID`),
  KEY `riderequest_4` (`stationID`),
  CONSTRAINT `riderequest_1` FOREIGN KEY (`clientID`) REFERENCES `registereduser` (`userId`),
  CONSTRAINT `riderequest_2` FOREIGN KEY (`tripID`) REFERENCES `trip` (`tripID`),
  CONSTRAINT `riderequest_4` FOREIGN KEY (`stationID`) REFERENCES `station` (`stationID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `riderequests`
--

LOCK TABLES `riderequests` WRITE;
/*!40000 ALTER TABLE `riderequests` DISABLE KEYS */;
INSERT INTO `riderequests` VALUES (1,10,5,106,'Accepted',10,'2025-04-23 20:20:29'),(2,3,6,122,'Pending',14,'2025-04-23 20:31:33');
/*!40000 ALTER TABLE `riderequests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routes`
--

DROP TABLE IF EXISTS `routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `routes` (
  `routeName` varchar(255) NOT NULL,
  `startStation` int(11) NOT NULL,
  `endStation` int(11) NOT NULL,
  `orderedStations` text NOT NULL,
  PRIMARY KEY (`routeName`),
  KEY `fk_startStation` (`startStation`),
  KEY `fk_endStation` (`endStation`),
  CONSTRAINT `fk_endStation` FOREIGN KEY (`endStation`) REFERENCES `station` (`stationID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_startStation` FOREIGN KEY (`startStation`) REFERENCES `station` (`stationID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routes`
--

LOCK TABLES `routes` WRITE;
/*!40000 ALTER TABLE `routes` DISABLE KEYS */;
INSERT INTO `routes` VALUES ('Coastal',101,188,'101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188');
/*!40000 ALTER TABLE `routes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `station`
--

DROP TABLE IF EXISTS `station`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `station` (
  `stationID` int(4) NOT NULL,
  `city` varchar(20) NOT NULL,
  `name` varchar(20) NOT NULL,
  `distance_from_start` decimal(10,2) NOT NULL,
  PRIMARY KEY (`stationID`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `station`
--

LOCK TABLES `station` WRITE;
/*!40000 ALTER TABLE `station` DISABLE KEYS */;
INSERT INTO `station` VALUES (101,'Maradana','Maradana',1.50),(102,'Colombo','Colombo Fort',0.00),(103,'Colombo','Secretariat Halt',2.00),(104,'Kompanna Vidiya','Kompanna Vidiya',3.50),(105,'Kollupitiya','Kollupitiya',4.70),(106,'Bambalapitiya','Bambalapitiya',6.00),(107,'Wellawatta','Wellawatta',7.50),(108,'Dehiwala','Dehiwala',9.00),(109,'Mount Lavinia','Mount Lavinia',11.00),(110,'Ratmalana','Ratmalana',13.50),(111,'Angulana','Angulana',15.00),(112,'Lunawa','Lunawa',16.50),(113,'Moratuwa','Moratuwa',18.00),(114,'Koralawalla','Koralawalla',20.00),(115,'Egoda Uyana','Egoda Uyana',21.50),(116,'Bolgoda','Bolgoda Lake',23.00),(117,'Panadura','Panadura',25.00),(118,'Pinwatta','Pinwatta',28.50),(119,'Wadduwa','Wadduwa',31.00),(120,'Pothupitiya','Train Halt No 01',34.00),(121,'Kalutara North','Kalutara North',37.00),(122,'Kalutara','Kalu Ganga',39.00),(123,'Kalutara South','Kalutara South',41.00),(124,'Katukurunda','Katukurunda',44.00),(125,'Paiyagala North','Paiyagala North',47.00),(126,'Paiyagala South','Paiyagala South',51.00),(127,'Maggona','Maggona',53.00),(128,'Beruwala','Beruwala',55.00),(129,'Hettimulla','Hettimulla',58.00),(130,'Aluthgama','Aluthgama',60.00),(131,'Benthota','Benthota Ganga',60.50),(132,'Bentota','Bentota',62.00),(133,'Induruwa','Induruwa',63.00),(134,'Maha Induruwa','Maha Induruwa',64.00),(135,'Kosgoda','Kosgoda',66.00),(136,'Piyagama','Piyagama',68.00),(137,'Ahungalla','Ahungalla',70.00),(138,'Pathagangoda','Pathagangoda',71.00),(139,'Balapitiya','Balapitiya',74.00),(140,'Balapitiya','Madu Ganga',76.00),(141,'Andadola','Andadola',78.00),(142,'Kandegoda','Kandegoda',80.00),(143,'Ambalangoda','Ambalangoda',82.00),(144,'Madampe','Madampe Lagoon',84.00),(145,'Madampagama','Madampagama',86.00),(146,'Akurala','Akurala',88.00),(147,'Kahawa','Kahawa',90.00),(148,'Telwatta','Telwatta',92.00),(149,'Sinigama','Sinigama',93.00),(150,'Hikkaduwa','Hikkaduwa',94.00),(151,'Thiranagama','Thiranagama',96.00),(152,'Kumarakanda','Kumarakanda',98.00),(153,'Rathgama','Rathgama Lagoon',100.00),(154,'Dodanduwa','Dodanduwa',102.00),(155,'Rajgama','Rajgama',104.00),(156,'Boossa','Boossa',106.00),(157,'Boossa','Gin Ganga',108.00),(158,'Ginthota','Ginthota',110.00),(159,'Piyadigama','Piyadigama',110.50),(160,'Galle','Richmond Hill',111.50),(161,'Galle','Galle',112.50),(162,'Katugoda','Katugoda',114.00),(163,'Unawatuna','Unawatuna',116.00),(164,'Talpe','Talpe',118.00),(165,'Habaraduwa','Habaraduwa',120.00),(166,'Koggala','Koggala',122.00),(167,'Koggala','Koggala Lagoon',124.00),(168,'Kathaluwa','Kathaluwa',126.00),(169,'Ahangama','Ahangama',127.50),(170,'Midigama','Midigama',128.00),(171,'Kubalgama','Kubalgama',129.50),(172,'Weligama','Weligama',131.00),(173,'Polwatta','Polwatta Ganga',133.00),(174,'Polwathumodara','Polwathumodara',134.50),(175,'Mirissa','Mirissa',136.00),(176,'Kamburugamuwa','Kamburugamuwa',138.00),(177,'Walgama','Walgama',140.00),(178,'Matara','Matara',142.00),(179,'Piladuwa','Piladuwa',143.50),(180,'Nilwala','Nilwala Ganga',145.00),(181,'Weherahena','Weherahena',146.50),(182,'Nakuttiyagama','Nakuttiyagama Tunnel',138.00),(183,'Kekanadura','Kekanadura',140.00),(184,'Babarenda','Babarenda',143.50),(185,'Akurubebila','Akurubebila Tunnel',147.00),(186,'Wavurukannala','Wavurukannala',150.00),(187,'Dedduwawala','Dedduwawala',153.00),(188,'Beliatta','Beliatta',157.00);
/*!40000 ALTER TABLE `station` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `systemadmin`
--

DROP TABLE IF EXISTS `systemadmin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `systemadmin` (
  `adminID` int(6) NOT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`adminID`),
  KEY `admin_username` (`username`),
  CONSTRAINT `admin_username` FOREIGN KEY (`username`) REFERENCES `person` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `systemadmin`
--

LOCK TABLES `systemadmin` WRITE;
/*!40000 ALTER TABLE `systemadmin` DISABLE KEYS */;
INSERT INTO `systemadmin` VALUES (1,'admin1');
/*!40000 ALTER TABLE `systemadmin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `train`
--

DROP TABLE IF EXISTS `train`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `train` (
  `trainID` int(4) NOT NULL,
  `name` varchar(20) NOT NULL,
  `type` varchar(20) NOT NULL,
  `startStation` int(11) NOT NULL,
  `endStation` int(11) NOT NULL,
  `departureTime` time NOT NULL,
  `arrivalTime` time NOT NULL,
  `days` varchar(255) NOT NULL,
  `firstClassSeats` int(3) NOT NULL,
  `secondClassSeats` int(3) NOT NULL,
  PRIMARY KEY (`trainID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `train`
--

LOCK TABLES `train` WRITE;
/*!40000 ALTER TABLE `train` DISABLE KEYS */;
INSERT INTO `train` VALUES (1,'Colombo Commuter ','Commuter',101,104,'21:24:00','21:34:00','Weekdays',0,0),(2,'Colombo Commuter ','Express',101,103,'15:44:00','15:55:00','Daily',0,0),(3,'Blue Comet Express','Express',101,123,'06:00:00','08:30:00','Weekdays',0,0),(4,'Silver Streak Local','Local',102,121,'09:00:00','11:30:00','Daily',0,0),(5,'Golden Horizon Inter','Intercity',104,120,'14:00:00','16:30:00','Weekends',0,0),(6,'Emerald Coast Expres','Express',103,122,'12:00:00','14:45:00','Weekdays',0,0),(7,'Ruby Trail Local','Local',101,119,'07:00:00','09:30:00','Daily',0,0),(9,'Pacific Rush','Express',106,115,'05:45:00','08:15:00','Weekdays',0,0),(10,'Sunset Glide','Intercity',108,116,'10:00:00','12:30:00','Daily',0,0),(11,'Golden Gateway','Local',109,121,'13:00:00','15:30:00','Weekdays',0,0),(12,'Emerald Rush','Express',110,119,'16:00:00','18:30:00','Weekends',0,0),(13,'Ruby Stream','Intercity',111,122,'07:30:00','10:00:00','Daily',0,0),(14,'Silver Coast','Express',112,121,'11:00:00','13:30:00','Weekdays',0,0),(15,'Cobalt Voyager','Intercity',113,122,'06:45:00','09:15:00','Weekends',0,0),(16,'Ocean Breeze Express','Express',114,120,'09:00:00','11:30:00','Weekdays',0,0),(17,'Crystal Rail','Local',115,123,'13:00:00','15:30:00','Weekends',0,0),(18,'Mountain Stream','Intercity',116,119,'08:00:00','10:30:00','Daily',0,0),(19,'Sunrise Splendor','Express',117,121,'07:00:00','09:30:00','Weekdays',0,0),(20,'Golden Coast','Local',118,122,'10:15:00','12:45:00','Weekends',0,0),(21,'Moonlight Express','Intercity',119,120,'14:00:00','16:30:00','Weekdays',0,0),(22,'Westward Bound','Local',120,123,'15:30:00','18:00:00','Weekends',0,0),(23,'Rapid Phoenix','Express',121,124,'09:00:00','11:30:00','Weekdays',0,0),(24,'Silver Horizon','Intercity',122,125,'12:00:00','14:30:00','Daily',0,0),(25,'Starstream Express','Express',123,126,'08:00:00','10:30:00','Weekends',0,0),(26,'River Valley','Local',124,127,'10:30:00','13:00:00','Weekdays',0,0),(27,'Northern Lights','Intercity',125,128,'06:30:00','09:00:00','Weekends',0,0),(28,'Twilight Voyage','Express',126,129,'15:00:00','17:30:00','Weekdays',0,0),(29,'Pine Ridge','Local',127,130,'14:00:00','16:30:00','Daily',0,0),(30,'Crystal Falls','Intercity',128,131,'08:00:00','10:30:00','Weekends',0,0),(31,'Thunder Express','Express',101,115,'08:00:00','10:30:00','Weekdays',0,0),(32,'Silver Comet','Local',103,120,'09:30:00','12:00:00','Weekdays',0,0),(33,'Golden Falcon','Express',105,123,'07:45:00','10:15:00','Weekdays',0,0),(34,'Crimson Voyager','Local',108,116,'10:00:00','12:00:00','Weekdays',0,0),(36,'Midnight Express','Express',102,114,'22:00:00','23:30:00','Weekdays',0,0),(37,'Ocean Breeze','Local',104,118,'11:00:00','14:00:00','Weekdays',0,0),(38,'Starlight Journey','Express',106,122,'15:00:00','17:30:00','Weekdays',0,0),(39,'Desert Mirage','Local',109,117,'12:30:00','14:30:00','Weekdays',0,0),(41,'Rapid Thunder','Express',101,119,'06:00:00','08:30:00','Weekdays',0,0),(42,'Golden Horizon','Local',101,120,'09:00:00','11:00:00','Weekdays',0,0),(43,'Crimson Express','Express',101,123,'10:00:00','12:30:00','Weekdays',0,0),(44,'Emerald Wave','Local',101,118,'14:00:00','16:00:00','Weekdays',0,0),(45,'Silver Stream','Express',101,117,'16:00:00','18:00:00','Weekdays',0,0),(46,'Twilight Express','Local',101,121,'18:00:00','20:30:00','Weekdays',0,0),(47,'Sunset Voyager','Express',101,124,'19:00:00','21:30:00','Weekdays',0,0),(48,'Mountain Breeze','Local',101,125,'20:00:00','22:30:00','Weekdays',0,0),(49,'Galaxy Express','Express',101,126,'21:00:00','23:30:00','Weekdays',0,0),(50,'Aurora Line','Local',101,127,'22:00:00','00:30:00','Weekdays',0,0),(51,'Galle Express','Express',102,161,'09:10:00','12:10:00','Daily',0,0),(52,'Aluthgama Express','Express',102,130,'10:40:00','13:30:00','Daily',0,0),(53,'South Express ','Express',113,161,'13:30:00','13:40:00','Daily',0,0);
/*!40000 ALTER TABLE `train` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainfares`
--

DROP TABLE IF EXISTS `trainfares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `trainfares` (
  `Difference` int(11) NOT NULL,
  `FirstClass` int(11) NOT NULL,
  `SecondClass` int(11) NOT NULL,
  `ThirdClass` int(11) NOT NULL,
  PRIMARY KEY (`Difference`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainfares`
--

LOCK TABLES `trainfares` WRITE;
/*!40000 ALTER TABLE `trainfares` DISABLE KEYS */;
INSERT INTO `trainfares` VALUES (0,0,0,0),(1,100,50,20),(2,100,50,20),(3,100,50,20),(4,150,50,40),(5,150,100,40),(6,150,100,40),(7,200,100,60),(8,200,100,60),(9,200,100,60),(10,250,150,60),(11,250,150,80),(12,250,150,80),(13,300,150,80),(14,300,150,100),(15,300,200,100),(16,350,200,100),(17,350,200,120),(18,350,200,120),(19,400,200,120),(20,400,250,140),(21,400,250,140),(22,450,250,140),(23,450,250,160),(24,450,250,160),(25,500,300,160),(26,500,300,180),(27,500,300,180),(28,550,300,180),(29,550,300,200),(30,550,350,200),(31,600,350,200),(32,600,350,220),(33,600,350,220),(34,650,350,220),(35,650,400,240),(36,650,400,240),(37,700,400,240),(38,700,400,260),(39,700,400,260),(40,750,450,260),(41,750,450,280),(42,750,450,280),(43,800,450,280),(44,800,450,300),(45,800,500,300),(46,850,500,300),(47,850,500,320),(48,850,500,320),(49,900,500,320),(50,900,550,340),(51,900,550,340),(52,950,550,340),(53,950,550,360),(54,950,550,360),(55,1000,600,360),(56,1000,600,380),(57,1000,600,380),(58,1050,600,380),(59,1050,600,400),(60,1050,650,400),(61,1100,650,400),(62,1100,650,420),(63,1100,650,420),(64,1150,650,420),(65,1150,700,440),(66,1150,700,440),(67,1200,700,440),(68,1200,700,460),(69,1200,700,460),(70,1250,750,460),(71,1250,750,480),(72,1250,750,480),(73,1300,750,480),(74,1300,750,500),(75,1300,800,500),(76,1350,800,500),(77,1350,800,520),(78,1350,800,520),(79,1400,800,520),(80,1400,850,540),(81,1400,850,540),(82,1450,850,540),(83,1450,850,560),(84,1450,850,560),(85,1500,900,560),(86,1500,900,580),(87,1500,900,580),(88,1550,900,580),(89,1550,900,600),(90,1550,950,600),(91,1600,950,600),(92,1600,950,620),(93,1600,950,620),(94,1650,950,620),(95,1650,1000,640),(96,1650,1000,640),(97,1700,1000,640),(98,1700,1000,660),(99,1700,1000,660),(100,1750,1050,660);
/*!40000 ALTER TABLE `trainfares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainserviceprovider`
--

DROP TABLE IF EXISTS `trainserviceprovider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `trainserviceprovider` (
  `TSPID` int(6) NOT NULL,
  `username` varchar(255) NOT NULL,
  `status` enum('active','inactive','','') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`TSPID`),
  KEY `tsp_username` (`username`),
  CONSTRAINT `tsp_username` FOREIGN KEY (`username`) REFERENCES `person` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainserviceprovider`
--

LOCK TABLES `trainserviceprovider` WRITE;
/*!40000 ALTER TABLE `trainserviceprovider` DISABLE KEYS */;
INSERT INTO `trainserviceprovider` VALUES (200005,'exampleTSP','active'),(200012,'tsp_new','active');
/*!40000 ALTER TABLE `trainserviceprovider` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainstops`
--

DROP TABLE IF EXISTS `trainstops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `trainstops` (
  `trainID` int(4) NOT NULL,
  `stationid` int(4) NOT NULL,
  `arrivaltime` time NOT NULL,
  `departuretime` time NOT NULL,
  KEY `trainstops_stationid` (`stationid`),
  KEY `trainstops_triainid` (`trainID`),
  CONSTRAINT `trainstops_stationid` FOREIGN KEY (`stationid`) REFERENCES `station` (`stationID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trainstops_triainid` FOREIGN KEY (`trainID`) REFERENCES `train` (`trainID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainstops`
--

LOCK TABLES `trainstops` WRITE;
/*!40000 ALTER TABLE `trainstops` DISABLE KEYS */;
INSERT INTO `trainstops` VALUES (1,101,'21:20:00','21:24:00'),(1,102,'21:26:00','21:28:00'),(1,103,'21:30:00','21:31:00'),(1,104,'21:32:00','21:34:00'),(2,101,'15:44:00','15:46:00'),(2,102,'15:47:00','15:48:00'),(2,103,'15:55:00','15:56:00'),(3,105,'06:30:00','06:35:00'),(3,112,'07:15:00','07:20:00'),(3,119,'08:00:00','08:05:00'),(4,103,'09:30:00','09:35:00'),(4,108,'10:15:00','10:20:00'),(4,115,'11:00:00','11:05:00'),(5,107,'14:45:00','14:50:00'),(5,113,'15:30:00','15:35:00'),(5,118,'16:10:00','16:15:00'),(6,106,'12:40:00','12:45:00'),(6,110,'13:30:00','13:35:00'),(6,117,'14:20:00','14:25:00'),(7,102,'07:30:00','07:35:00'),(7,109,'08:15:00','08:20:00'),(7,114,'09:00:00','09:05:00'),(9,107,'06:15:00','06:20:00'),(9,111,'07:00:00','07:05:00'),(9,114,'08:00:00','08:05:00'),(10,109,'10:30:00','10:35:00'),(10,113,'11:15:00','11:20:00'),(10,117,'12:00:00','12:05:00'),(11,110,'13:30:00','13:35:00'),(11,114,'14:15:00','14:20:00'),(11,118,'15:00:00','15:05:00'),(12,111,'16:30:00','16:35:00'),(12,115,'17:15:00','17:20:00'),(12,120,'18:00:00','18:05:00'),(13,112,'08:00:00','08:05:00'),(13,116,'08:45:00','08:50:00'),(13,120,'09:30:00','09:35:00'),(14,113,'11:30:00','11:35:00'),(14,117,'12:15:00','12:20:00'),(14,120,'13:00:00','13:05:00'),(15,114,'07:15:00','07:20:00'),(15,118,'08:00:00','08:05:00'),(15,121,'08:45:00','08:50:00'),(16,115,'09:30:00','09:35:00'),(16,119,'10:15:00','10:20:00'),(16,121,'11:00:00','11:05:00'),(17,116,'13:30:00','13:35:00'),(17,120,'14:15:00','14:20:00'),(17,122,'15:00:00','15:05:00'),(18,117,'08:30:00','08:35:00'),(18,120,'09:15:00','09:20:00'),(18,122,'10:00:00','10:05:00'),(19,118,'07:30:00','07:35:00'),(19,120,'08:15:00','08:20:00'),(19,122,'09:00:00','09:05:00'),(20,119,'10:45:00','10:50:00'),(20,121,'11:30:00','11:35:00'),(20,123,'12:15:00','12:20:00'),(21,120,'14:30:00','14:35:00'),(21,121,'15:15:00','15:20:00'),(21,122,'16:00:00','16:05:00'),(22,121,'16:00:00','16:05:00'),(22,122,'16:45:00','16:50:00'),(22,123,'17:45:00','17:50:00'),(23,122,'09:30:00','09:35:00'),(23,123,'10:15:00','10:20:00'),(23,124,'11:00:00','11:05:00'),(24,123,'12:30:00','12:35:00'),(24,124,'13:15:00','13:20:00'),(24,125,'14:00:00','14:05:00'),(25,124,'08:30:00','08:35:00'),(25,125,'09:15:00','09:20:00'),(25,126,'10:00:00','10:05:00'),(26,125,'11:00:00','11:05:00'),(26,126,'11:45:00','11:50:00'),(26,127,'12:45:00','12:50:00'),(27,126,'07:00:00','07:05:00'),(27,127,'07:45:00','07:50:00'),(27,128,'08:30:00','08:35:00'),(28,127,'15:30:00','15:35:00'),(28,128,'16:15:00','16:20:00'),(28,129,'17:00:00','17:05:00'),(29,128,'14:30:00','14:35:00'),(29,129,'15:15:00','15:20:00'),(29,130,'16:00:00','16:05:00'),(30,129,'08:30:00','08:35:00'),(30,130,'09:15:00','09:20:00'),(30,131,'10:00:00','10:05:00'),(31,102,'08:15:00','08:20:00'),(31,110,'08:45:00','08:50:00'),(31,113,'09:15:00','09:20:00'),(31,115,'10:00:00','10:05:00'),(32,104,'09:45:00','09:50:00'),(32,110,'10:15:00','10:20:00'),(32,118,'11:00:00','11:05:00'),(32,120,'11:30:00','11:35:00'),(33,106,'08:00:00','08:05:00'),(33,110,'08:30:00','08:35:00'),(33,119,'09:00:00','09:05:00'),(33,123,'10:00:00','10:05:00'),(34,109,'10:10:00','10:15:00'),(34,110,'10:25:00','10:30:00'),(34,115,'11:00:00','11:05:00'),(34,116,'11:30:00','11:35:00'),(36,103,'22:15:00','22:20:00'),(36,110,'22:45:00','22:50:00'),(36,112,'23:10:00','23:15:00'),(36,114,'23:25:00','23:30:00'),(37,105,'11:15:00','11:20:00'),(37,110,'11:45:00','11:50:00'),(37,115,'12:30:00','12:35:00'),(37,118,'13:30:00','13:35:00'),(38,107,'15:15:00','15:20:00'),(38,110,'15:45:00','15:50:00'),(38,119,'16:15:00','16:20:00'),(38,122,'17:00:00','17:05:00'),(39,110,'12:45:00','12:50:00'),(39,111,'13:00:00','13:05:00'),(39,115,'13:30:00','13:35:00'),(39,117,'14:00:00','14:05:00'),(41,101,'06:00:00','06:05:00'),(41,110,'06:30:00','06:35:00'),(41,115,'07:15:00','07:20:00'),(41,119,'08:00:00','08:05:00'),(42,101,'09:00:00','09:05:00'),(42,110,'09:30:00','09:35:00'),(42,116,'10:00:00','10:05:00'),(42,120,'10:30:00','10:35:00'),(43,101,'10:00:00','10:05:00'),(43,110,'10:30:00','10:35:00'),(43,119,'11:00:00','11:05:00'),(43,123,'12:00:00','12:05:00'),(44,101,'14:00:00','14:05:00'),(44,110,'14:30:00','14:35:00'),(44,115,'15:00:00','15:05:00'),(44,118,'15:30:00','15:35:00'),(45,101,'16:00:00','16:05:00'),(45,110,'16:30:00','16:35:00'),(45,116,'17:00:00','17:05:00'),(45,117,'17:30:00','17:35:00'),(46,101,'18:00:00','18:05:00'),(46,110,'18:30:00','18:35:00'),(46,119,'19:15:00','19:20:00'),(46,121,'20:00:00','20:05:00'),(47,101,'19:00:00','19:05:00'),(47,110,'19:30:00','19:35:00'),(47,120,'20:00:00','20:05:00'),(47,124,'21:00:00','21:05:00'),(48,101,'20:00:00','20:05:00'),(48,110,'20:30:00','20:35:00'),(48,121,'21:00:00','21:05:00'),(48,125,'22:00:00','22:05:00'),(49,101,'21:00:00','21:05:00'),(49,110,'21:30:00','21:35:00'),(49,122,'22:00:00','22:05:00'),(49,126,'23:00:00','23:05:00'),(50,101,'22:00:00','22:05:00'),(50,110,'22:30:00','22:35:00'),(50,124,'23:00:00','23:05:00'),(50,127,'00:00:00','00:05:00'),(51,102,'09:00:00','09:10:00'),(51,106,'09:25:00','09:27:00'),(51,109,'09:38:00','09:45:00'),(51,113,'00:00:00','00:00:00'),(51,117,'10:20:00','10:25:00'),(51,123,'10:50:00','10:55:00'),(51,128,'11:05:00','11:06:00'),(51,143,'11:30:00','11:35:00'),(51,150,'11:45:00','11:46:00'),(51,161,'12:10:00','12:10:00'),(52,102,'10:20:00','10:40:00'),(52,105,'10:55:00','10:57:00'),(52,109,'11:12:00','11:14:00'),(52,113,'11:30:00','11:32:00'),(52,117,'11:45:00','11:47:00'),(52,123,'12:10:00','12:12:00'),(52,128,'12:35:00','12:37:00'),(53,113,'13:25:00','13:30:00'),(53,121,'13:50:00','13:52:00'),(53,128,'14:23:00','14:25:00'),(53,130,'14:40:00','14:42:00'),(53,143,'15:20:00','15:22:00'),(53,150,'15:50:00','15:52:00'),(53,161,'16:40:00','16:42:00');
/*!40000 ALTER TABLE `trainstops` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `traintrip`
--

DROP TABLE IF EXISTS `traintrip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `traintrip` (
  `trainID` int(4) NOT NULL,
  `tripID` int(10) NOT NULL,
  KEY `traintrip_trainid` (`trainID`),
  KEY `traintrip_tripid` (`tripID`),
  CONSTRAINT `traintrip_trainid` FOREIGN KEY (`trainID`) REFERENCES `train` (`trainID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `traintrip`
--

LOCK TABLES `traintrip` WRITE;
/*!40000 ALTER TABLE `traintrip` DISABLE KEYS */;
/*!40000 ALTER TABLE `traintrip` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trip`
--

DROP TABLE IF EXISTS `trip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `trip` (
  `tripID` int(10) NOT NULL AUTO_INCREMENT,
  `status` enum('active','removed','','') NOT NULL DEFAULT 'active',
  `username` varchar(255) NOT NULL,
  `startStation` int(4) NOT NULL,
  `endStation` int(11) NOT NULL,
  `departureTime` time NOT NULL,
  `arrivalTime` time NOT NULL,
  `no_of_members` int(2) NOT NULL,
  `number_of_adults` int(2) NOT NULL,
  `number_of_children` int(2) NOT NULL,
  `date` date NOT NULL,
  `ticket_class` enum('first','second','third','') NOT NULL,
  `adult_fare` int(11) NOT NULL,
  `child_fare` int(11) NOT NULL,
  `total_fare` int(11) NOT NULL,
  `booking_reference` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`tripID`),
  KEY `trip_sourceID` (`startStation`),
  KEY `trip_DestID` (`endStation`),
  KEY `trip_username` (`username`),
  CONSTRAINT `trip_DestID` FOREIGN KEY (`endStation`) REFERENCES `station` (`stationID`),
  CONSTRAINT `trip_sourceID` FOREIGN KEY (`startStation`) REFERENCES `station` (`stationID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trip`
--

LOCK TABLES `trip` WRITE;
/*!40000 ALTER TABLE `trip` DISABLE KEYS */;
INSERT INTO `trip` VALUES (10,'active','imnot_naveen',102,161,'00:00:09','00:00:16',4,3,1,'2025-04-19','second',600,420,2220,'TV-100485'),(11,'active','imnot_naveen',102,161,'09:10:00','12:10:00',4,2,2,'2025-04-21','second',600,420,2040,'TV-228031'),(12,'active','imnot_naveen',102,161,'09:10:00','16:40:00',5,4,1,'2025-04-22','second',600,420,2820,'TV-296662'),(13,'active','newq',102,161,'09:10:00','12:10:00',2,2,0,'2025-04-24','second',600,420,1200,'TV-381585'),(14,'active','newq',102,161,'09:10:00','12:10:00',2,2,0,'2025-04-24','second',600,420,1200,'TV-381810'),(15,'active','chami',102,161,'09:10:00','12:10:00',2,2,0,'2025-04-24','second',600,420,1200,'TV-430969');
/*!40000 ALTER TABLE `trip` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tripdestination`
--

DROP TABLE IF EXISTS `tripdestination`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tripdestination` (
  `tripID` int(11) NOT NULL,
  `destinationID` int(11) NOT NULL,
  KEY `td_tripID` (`tripID`),
  KEY `td_destination` (`destinationID`),
  CONSTRAINT `td_destination` FOREIGN KEY (`destinationID`) REFERENCES `destination` (`destination_id`),
  CONSTRAINT `td_tripID` FOREIGN KEY (`tripID`) REFERENCES `trip` (`tripID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tripdestination`
--

LOCK TABLES `tripdestination` WRITE;
/*!40000 ALTER TABLE `tripdestination` DISABLE KEYS */;
INSERT INTO `tripdestination` VALUES (10,11),(10,12),(11,11),(12,11),(12,12),(13,14),(14,14),(15,14);
/*!40000 ALTER TABLE `tripdestination` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tripsegments`
--

DROP TABLE IF EXISTS `tripsegments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tripsegments` (
  `tripID` int(11) NOT NULL,
  `startStation` int(4) NOT NULL,
  `endStation` int(4) NOT NULL,
  `trainID` int(11) NOT NULL,
  `departureTime` time NOT NULL,
  KEY `ts_tripID` (`tripID`),
  KEY `ts_trainID` (`trainID`),
  KEY `ts_startStation` (`startStation`),
  KEY `endstation` (`endStation`),
  CONSTRAINT `endstation` FOREIGN KEY (`endStation`) REFERENCES `station` (`stationID`),
  CONSTRAINT `ts_endStation` FOREIGN KEY (`endStation`) REFERENCES `station` (`stationID`),
  CONSTRAINT `ts_startStation` FOREIGN KEY (`startStation`) REFERENCES `station` (`stationID`),
  CONSTRAINT `ts_trainID` FOREIGN KEY (`trainID`) REFERENCES `train` (`trainID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tripsegments`
--

LOCK TABLES `tripsegments` WRITE;
/*!40000 ALTER TABLE `tripsegments` DISABLE KEYS */;
INSERT INTO `tripsegments` VALUES (10,102,161,51,'09:10:00'),(10,102,161,52,'11:14:00'),(10,102,161,53,'14:25:00'),(11,102,161,51,'09:10:00'),(11,102,161,52,'11:14:00'),(11,102,161,53,'14:25:00'),(11,102,161,51,'09:10:00'),(11,102,161,51,'09:10:00'),(11,102,161,51,'09:10:00'),(11,102,161,51,'09:10:00'),(11,102,161,51,'09:45:00'),(11,102,161,51,'09:10:00'),(11,102,161,51,'09:45:00'),(11,102,161,51,'09:45:00'),(12,102,161,51,'09:10:00'),(12,102,161,52,'11:14:00'),(12,102,161,53,'14:25:00'),(12,102,161,51,'09:10:00'),(12,102,161,51,'09:10:00'),(12,102,161,51,'09:10:00'),(12,102,161,51,'09:10:00'),(12,102,161,51,'09:45:00'),(12,102,161,51,'09:10:00'),(12,102,161,51,'09:45:00'),(12,102,161,51,'09:45:00'),(12,102,161,51,'09:10:00'),(12,102,161,52,'11:14:00'),(12,102,161,53,'14:25:00'),(13,102,161,51,'09:10:00'),(13,102,161,51,'09:45:00'),(13,102,161,51,'10:55:00'),(13,102,161,51,'09:10:00'),(13,102,161,51,'11:46:00'),(14,102,161,51,'09:10:00'),(14,102,161,51,'09:45:00'),(14,102,161,51,'10:55:00'),(14,102,161,51,'09:10:00'),(14,102,161,51,'11:46:00'),(15,102,161,51,'09:10:00'),(15,102,161,51,'09:45:00'),(15,102,161,51,'10:55:00'),(15,102,161,51,'09:10:00'),(15,102,161,51,'11:46:00'),(15,102,161,51,'09:10:00'),(15,102,161,51,'10:55:00'),(15,102,161,51,'10:55:00'),(15,102,161,51,'10:55:00'),(15,102,161,51,'09:10:00'),(15,102,161,51,'10:55:00'),(15,102,161,51,'09:10:00'),(15,102,161,51,'11:46:00'),(15,102,161,51,'09:10:00'),(15,102,161,51,'10:55:00'),(15,102,161,51,'09:10:00'),(15,102,161,51,'09:45:00'),(15,102,161,51,'09:10:00'),(15,102,161,51,'09:45:00'),(15,102,161,51,'09:10:00'),(15,102,161,51,'11:46:00'),(15,102,161,51,'11:46:00'),(15,102,161,51,'11:46:00'),(15,102,161,51,'11:46:00'),(15,102,161,51,'11:46:00'),(15,102,161,51,'09:10:00'),(15,102,161,51,'09:45:00'),(15,102,161,51,'09:10:00'),(15,102,161,51,'11:06:00'),(15,102,161,51,'09:10:00'),(15,102,161,51,'11:46:00'),(15,102,161,51,'09:10:00'),(15,102,161,51,'09:10:00'),(15,102,161,51,'11:46:00');
/*!40000 ALTER TABLE `tripsegments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userdestination`
--

DROP TABLE IF EXISTS `userdestination`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userdestination` (
  `username` varchar(255) NOT NULL,
  `prefferedDestination` int(11) NOT NULL,
  KEY `destination_prefdestID` (`prefferedDestination`),
  KEY `destination_username` (`username`),
  CONSTRAINT `destination_prefdestID` FOREIGN KEY (`prefferedDestination`) REFERENCES `destinationtypes` (`type_id`),
  CONSTRAINT `destination_username` FOREIGN KEY (`username`) REFERENCES `person` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userdestination`
--

LOCK TABLES `userdestination` WRITE;
/*!40000 ALTER TABLE `userdestination` DISABLE KEYS */;
INSERT INTO `userdestination` VALUES ('testUser',4),('testUser',5),('testUser',3),('nadhiya',3),('nadhiya',4),('nadhiya',2),('imnot_naveen',3),('SteveSmith',1),('SteveSmith',2),('newDimuthu',1),('newDimuthu',2),('admin1',1),('admin1',2),('tspp',3),('newq',6),('adminUser',2),('user9',1),('user9',2),('chami',2);
/*!40000 ALTER TABLE `userdestination` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userreviews`
--

DROP TABLE IF EXISTS `userreviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userreviews` (
  `username` varchar(255) NOT NULL,
  `destination` int(11) NOT NULL,
  `rating` float NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userreviews`
--

LOCK TABLES `userreviews` WRITE;
/*!40000 ALTER TABLE `userreviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `userreviews` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-24  9:40:28
