<?php 

// Define the directory separator
defined('DS') ? null : define('DS', DIRECTORY_SEPARATOR);

// Define the root path of your site dynamically
$docRoot = $_SERVER['DOCUMENT_ROOT'] ?? '';
$wampRoot = $docRoot . DS . 'Traventure';
defined('SITE_ROOT') ? null : define('SITE_ROOT', (!empty($docRoot) && is_dir($wampRoot)) ? $wampRoot : dirname(__DIR__, 2));

// Define the includes and core paths
defined('INC_PATH') ? null : define('INC_PATH', SITE_ROOT . DS . 'Server' . DS . 'includes');
defined('CORE_PATH') ? null : define('CORE_PATH', SITE_ROOT . DS . 'Server' . DS . 'core');

// Load the config file first
require_once(INC_PATH . DS . "config.php");

// Core framework & systems infrastructure
require_once(CORE_PATH . DS . "ApiResponse.php");
require_once(CORE_PATH . DS . "RateLimiter.php");

// Core classes
require_once(CORE_PATH . DS . "person.php");
require_once(CORE_PATH.DS. "login.php");
require_once(CORE_PATH.DS. "blogpost.php");
require_once(CORE_PATH.DS. "tsp.php");
require_once(CORE_PATH.DS. "train.php");
require_once(CORE_PATH.DS. "contentWriter.php");
require_once(CORE_PATH.DS. "bookings.php");
require_once(CORE_PATH.DS. "station.php");
require_once(CORE_PATH.DS. "fare.php");
require_once(CORE_PATH.DS. "user.php");
require_once(CORE_PATH.DS. "admin.php");
require_once(CORE_PATH.DS. "destinationtypes.php");
require_once(CORE_PATH.DS. "driver.php");
require_once(CORE_PATH.DS. "riderequests.php");
require_once(CORE_PATH.DS. "trip.php");
require_once(CORE_PATH.DS. "blogs.php");
require_once(CORE_PATH.DS. "comments.php");
?>