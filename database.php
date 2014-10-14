<?php

$host = "localhost";
$db = "degreeroad";
$user = "root";
$pw = "a0082903";

$mysqli = new mysqli($host, $user, $pw, $db);

if ($mysqli->connect_errno) {
	echo "Failed to connect to MySQL";
}

if (isset($_GET['action']) && $_GET['action'] == 'getRequirements') {
	echo json_encode(db_get_requirements());
}

if (isset($_GET['action']) && $_GET['action'] == 'getAllModuleList') {
	echo json_encode(db_get_all_modules());
}

function db_get_requirements() {
	if (isset($_GET['degreeName'])) {
		$degreeName = $_GET['degreeName'];
	} else {
		$degreeName = NULL;
	}
	global $mysqli;
	$query = "SELECT *
				FROM `Module`,`Degrees`,`DegreeModuleLink`
				WHERE `Degrees`.`degreeName` =  '".$degreeName."'
				AND `Degrees`.`degreeName` = `DegreeModuleLink`.`degreeName`
				AND `Module`.`Code` = `DegreeModuleLink`.`moduleCode`";
	$result = array();
	if ($queryResult = $mysqli->query($query)) {
		while ($entry = $queryResult->fetch_assoc()) {
			array_push($result, $entry);
		}
	}
	return $result;
}

function db_get_all_modules() {
	global $mysqli;
	$query = "SELECT *
				FROM `Module`";
	$result = array();
	if ($queryResult = $mysqli->query($query)) {
		while ($entry = $queryResult->fetch_assoc()) {
			array_push($result, $entry);
		}
	}
	return $result;
}


?>
