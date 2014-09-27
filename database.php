<?php

$host = "localhost";
$db = "degreeroad";
$user = "root";
$pw = "a0082903";

$mysqli = new mysqli($host, $user, $pw, $db);

if ($mysqli->connect_errno) {
	echo "<!--Failed to connect to MySQL-->";
}

if (isset($_GET['action']) && $_GET['action'] == 'getModules') {
	echo json_encode(db_get_modules());
}

function db_get_modules() {
	global $mysqli;
	$query = "SELECT * FROM `Modules`";
	$result = array();
	if ($queryResult = $mysqli->query($query)) {
		while ($entry = $queryResult->fetch_assoc()) {
			array_push($result, $entry);
		}
	}
	return $result;
}



?>