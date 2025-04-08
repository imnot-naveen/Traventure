<?php 

// Define the directory separator
defined('DS') ? null : define('DS', DIRECTORY_SEPARATOR);

// Define the root path of your site dynamically
defined('SITE_ROOT') ? null : define('SITE_ROOT', $_SERVER['DOCUMENT_ROOT']. DS . 'Traventure');

// Define the includes and core paths
defined('INC_PATH') ? null : define('INC_PATH', SITE_ROOT . DS . 'Server' . DS . 'includes');
defined('CORE_PATH') ? null : define('CORE_PATH', SITE_ROOT . DS . 'Server' . DS . 'core');

// Load the config file first
require_once(INC_PATH . DS . "config.php");

// Core classes
require_once(CORE_PATH . DS . "person.php");
require_once(CORE_PATH.DS. "login.php");
require_once(CORE_PATH.DS. "blogpost.php");
require_once(CORE_PATH.DS. "tsp.php");
require_once(CORE_PATH.DS. "train.php");
require_once(CORE_PATH.DS. "booking.php");
require_once(CORE_PATH.DS. "contentWriter.php");
require_once(CORE_PATH.DS. "bookings.php");
require_once(CORE_PATH.DS. "station.php");
require_once(CORE_PATH.DS. "fare.php");
require_once(CORE_PATH.DS. "payment.php");
?>