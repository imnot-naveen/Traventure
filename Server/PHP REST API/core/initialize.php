<?php 

   // Define the directory separator
defined('DS') ? null : define('DS', DIRECTORY_SEPARATOR);

// Define the root path of your site
defined('SITE_ROOT') ? null : define('SITE_ROOT', DS . 'wamp64' . DS . 'www' . DS . 'traventure');

// Define the combined path for root and directory separator
defined('SITE_ROOT_DS') ? null : define('SITE_ROOT_DS', SITE_ROOT . DS);

// Now define INC_PATH and CORE_PATH
defined('INC_PATH') ? null : define('INC_PATH', SITE_ROOT_DS . 'includes');
defined('CORE_PATH') ? null : define('CORE_PATH', SITE_ROOT_DS . 'core');

//load the config file first
require_once(INC_PATH.DS."congif.php");

//core classes 
require_once(CORE_PATH.DS."post.php");


?>