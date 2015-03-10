<?php

$host = "localhost";
$db = "degreeroad";
$user = "root";
$pw = "a0082903";
$port = 8889;

$mysqli = new mysqli($host, $user, $pw, $db);

if ($mysqli->connect_errno) {
	echo "Failed to connect to MySQL";
}

if (isset($_GET['action']) && $_GET['action'] == 'retrieveDegreeRequirements') {
	echo json_encode(db_retrieve_requirements());
}
if (isset($_GET['action']) && $_GET['action'] == 'retrieveRules') {
	echo json_encode(db_retrieve_rules());
}
if (isset($_GET['action']) && $_GET['action'] == 'retrieveList') {
	echo json_encode(db_retrieve_list());
}
if (isset($_GET['action']) && $_GET['action'] == 'getAllModuleList') {
	echo json_encode(db_get_all_modules());
}

function getResultingArray($query) {
	global $mysqli;
	$result = array();
	if ($queryResult = $mysqli->query($query)) {
		while ($entry = $queryResult->fetch_assoc()) {
			array_push($result, $entry);
		}
	}
	return $result;
}

function getResultingArrayWithoutHead($query) {
	global $mysqli;
	$result = array();
	if ($queryResult = $mysqli->query($query)) {
		while ($entry = $queryResult->fetch_row()) {
			array_push($result, $entry);
		}
	}
	return $result;
}

function getResult($query) {
	global $mysqli;
	return $mysqli->query($query)->fetch_assoc();
}

function db_retrieve_requirements() {
	$academicYear = $_GET['academicYear'];
	$degreeCode = $_GET['degreeCode'];
	$specialProgramme = $_GET['specialProgramme'];
	if ($specialProgramme == "None") {
		$query = "SELECT *
			FROM `degree_requirements`
			WHERE `degree_requirements`.`academicYear` = ".$academicYear."
			AND `degree_requirements`.`degreeCode` = '".$degreeCode."'";
	} else {	
		$query = "SELECT *
				FROM `degree_requirements`
				WHERE `degree_requirements`.`academicYear` = ".$academicYear."
				AND `degree_requirements`.`degreeCode` = '".$degreeCode."'
				AND `degree_requirements`.`specialProgramme` = ".$specialProgramme."";
	}

	return getResult($query);
}

function db_retrieve_rules() {
	$requirementIds = $_GET['requirementIds'];
	$requirementIdArray = explode(",", $requirementIds);
	$result = Array();
	foreach($requirementIdArray as $requirementId) {
		$query = "SELECT *
				FROM `major_requirement`,`rules`
				WHERE `major_requirement`.`requirementId` = ".$requirementId."
				AND `major_requirement`.`ruleId` = `rules`.`ruleId`";
		
		array_push($result,getResult($query));
	}
	return $result;
}

function db_retrieve_list() {
	$listName = $_GET['listName'];

	$query = "SELECT `module`
			FROM `list`
			WHERE `list`.`listName` = '".$listName."'";
	
	return getResultingArray($query);
}

function db_get_all_modules() {
	
	$query = "SELECT *
			FROM `Module`";

	return getResultingArray($query);
}

?>
