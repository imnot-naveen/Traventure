<?php 
// Enable error reporting 
ini_set('display_errors', 1); 
ini_set('display_startup_errors', 1); 
error_reporting(E_ALL);  

// Headers 
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST'); 
header('Content-Type: application/json');  

// Include database and login class 
include_once('../core/initialize.php');  

// Instantiate login object 
$login = new Login($db);  

//get raw posted data 
$data = json_decode(file_get_contents("php://input"));  

//check if data is null  
if ($data === null) {     
    http_response_code(400);     
    echo json_encode([
        'success' => false,          
        'message' => 'Invalid JSON format'
    ]);     
    exit(); 
}  

//check the validity of data 
if (empty($data->password) || (empty($data->username) && empty($data->email))) {     
    http_response_code(400);     
    echo json_encode([
        'success' => false,         
        'message' => 'Invalid input'
    ]);     
    exit(); 
} 

// Set properties
if (isset($data->username)) {     
    $login->username = $data->username; 
}  
if (isset($data->email)) {     
    $login->email = $data->email; 
}  
$login->password = $data->password;    

// Execute login and get result
$result = $login->loginUser(); 

// Send response (result is already an array, just encode it once)
echo json_encode($result);
exit;
?>