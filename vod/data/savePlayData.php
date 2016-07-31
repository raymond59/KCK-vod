<?php

$request = file_get_contents('php://input');

$input = json_decode($request);

define('DB_HOST', getenv('OPENSHIFT_MYSQL_DB_HOST'));
define('DB_PORT',getenv('OPENSHIFT_MYSQL_DB_PORT')); 
define('DB_USER',getenv('OPENSHIFT_MYSQL_DB_USERNAME'));
define('DB_PASS',getenv('OPENSHIFT_MYSQL_DB_PASSWORD'));
define('DB_NAME',getenv('OPENSHIFT_GEAR_NAME'));

/*
$servername = "127.0.250.1";
$username = "adminQ1gwtfb";
$password = "MDZi48KsgFxb";
$dbname = "raymondk";
*/

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// prepare and bind
$stmt = $conn->prepare("INSERT INTO view_data (ss_id, movie_id, view_start_time) VALUES (?, ?, NOW())");
$stmt->bind_param("ss", $ss_id, $movie_id);

// set parameters and execute
if (!empty($input->ss_id) && !empty($input->movie_id)){

$ss_id = $input->ss_id;
$movie_id = $input->movie_id;
$stmt->execute();

$stmt->close();
$conn->close();
}
// view_end_time, last_view_time, finished_flag

?>