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
	if (isset($_GET['degreeCode'])) {
		$degreeCode = $_GET['degreeCode'];
	} else {
		$degreeCode = NULL;
	}
	global $mysqli;
	// $query = "SELECT *
	// 			FROM `Module`,`Degrees`,`DegreeModuleLink`
	// 			WHERE `Degrees`.`degreeName` =  '".$degreeName."'
	// 			AND `Degrees`.`degreeName` = `DegreeModuleLink`.`degreeName`
	// 			AND `Module`.`Code` = `DegreeModuleLink`.`moduleCode`";
	$query = "SELECT `Code`,`Credit`,`Description`,`Examdate`,`Name`,`Preclude`,`Prereq`,`coursecode` AS `CourseCode`,`fulfil` AS `ModuleType`
					FROM `unicoursereq`,`Module`
					WHERE `unicoursereq`.`coursecode` = '".$degreeCode."'
					AND `unicoursereq`.`modulecode` = `Module`.`Code`";
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
