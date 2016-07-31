<?php
$request = file_get_contents('php://input');

$input = json_decode($request);

if (!empty($input->ss_id)){
$ss_id = $input->ss_id;
}
if (!empty($input->movie_id)){
$movie_id = $input->movie_id;
}

define('DB_HOST', getenv('OPENSHIFT_MYSQL_DB_HOST'));
define('DB_PORT',getenv('OPENSHIFT_MYSQL_DB_PORT')); 
define('DB_USER',getenv('OPENSHIFT_MYSQL_DB_USERNAME'));
define('DB_PASS',getenv('OPENSHIFT_MYSQL_DB_PASSWORD'));
define('DB_NAME',getenv('OPENSHIFT_GEAR_NAME'));

if (!empty($ss_id)){

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// prepare and bind
if (empty($movie_id)){
$stmt = $conn->prepare("select movie_id, count(*) as viewCount from view_data where ss_id = ? group by movie_id order by view_start_time desc");
$stmt->bind_param("s", $ss_id);
}else{
	$stmt = $conn->prepare("select last_view_time from view_data where movie_id = ? and ss_id = ?");
	$stmt->bind_param("ss", $ss_id, $movie_id);
}


// set parameters and execute
$stmt->execute();

/* bind result variables */
$stmt->bind_result($movie_id, $viewCount);

/* fetch values */
$jsonResult = "";
$stmt->store_result();
$rows_num = $stmt->num_rows;

//echo $rows_num;
$i = 0;
$jsonResult = "[";
while ($stmt->fetch()) {
	
	$jsonResult .=  "{" . "\"movie_id\":\"" . $movie_id . "\",\"viewCount\":\"" . $viewCount . "\"" . "}";
	if ($i < $rows_num - 1){
		$jsonResult .= ",";
	}
	$i++;
}
$jsonResult .= "]";
$stmt->close();
$conn->close();


echo $jsonResult;
// view_end_time, last_view_time, finished_flag
}
?>