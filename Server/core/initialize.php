<?php 

   // Define the directory separator
defined('DS') ? null : define('DS', DIRECTORY_SEPARATOR);

// Define the root path of your site
defined('SITE_ROOT') ? null : define('SITE_ROOT', DS . 'xampp' . DS . 'htdocs' . DS . 'traventure');

// Define the combined path for root and directory separator
defined('SITE_ROOT_DS') ? null : define('SITE_ROOT_DS', SITE_ROOT . DS);

// Now define INC_PATH and CORE_PATH
defined('INC_PATH') ? null : define('INC_PATH', SITE_ROOT_DS . 'server' . DS . 'includes');
defined('CORE_PATH') ? null : define('CORE_PATH', SITE_ROOT_DS . 'server' . DS . 'core');

//load the config file first
require_once(INC_PATH.DS."config.php");

//core classes 
require_once(CORE_PATH.DS."person.php");
require_once(CORE_PATH.DS. "login.php");
require_once(CORE_PATH.DS. "train.php");
require_once(CORE_PATH.DS. "blogpost.php");
?>