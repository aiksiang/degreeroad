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

if (isset($_GET['action']) && $_GET['action'] == 'getSpecializations') {
	echo json_encode(db_get_specializations());
}

if (isset($_GET['action']) && $_GET['action'] == 'getSpecializationModules') {
	echo json_encode(db_get_specialization_modules());
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

function db_get_specializations() {
	if (isset($_GET['degreeCode'])) {
		$degreeCode = $_GET['degreeCode'];
	} else {
		$degreeCode = NULL;
	}
	global $mysqli;
	$query = "SELECT *
				FROM `Course_Specialization_List`
				WHERE `coursecode` = '".$degreeCode."'";
	$result = array();
	if ($queryResult = $mysqli->query($query)) {
		while ($entry = $queryResult->fetch_assoc()) {
			array_push($result, $entry);
		}
	}
	return $result;
}

function db_get_specialization_modules() {
	if (isset($_GET['specialization'])) {
		$specialization = $_GET['specialization'];
	} else {
		$specialization = NULL;
	}
	global $mysqli;
	$query = "SELECT `Code`,`Credit`,`Description`,`Examdate`,`Name`,`Preclude`,`Prereq`,`specialization` AS `Specialization`,`fufil` AS `ModuleType`
				FROM `cegspecialization`, `Module`
				WHERE `cegspecialization`.`specialization` LIKE '%".$specialization."%'
				AND `cegspecialization`.`modulecode` = `Module`.`Code`";
	$result = array();
	if ($queryResult = $mysqli->query($query)) {
		while ($entry = $queryResult->fetch_assoc()) {
			array_push($result, $entry);
		}
	}
	return $result;
}


?>
