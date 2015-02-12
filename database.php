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

// if (isset($_GET['action']) && $_GET['action'] == 'getRequirementsOld') {
// 	echo json_encode(db_get_requirements());
// }
if (isset($_GET['action']) && $_GET['action'] == 'retrieveDegreeRequirements') {
	echo json_encode(db_retrieve_requirements());
}
if (isset($_GET['action']) && $_GET['action'] == 'retrieveRules') {
	echo json_encode(db_retrieve_rules());
}
if (isset($_GET['action']) && $_GET['action'] == 'retrieveList') {
	echo json_encode(db_retrieve_list());
}
if (isset($_GET['action']) && $_GET['action'] == 'getRequirementModules') {
	echo json_encode(db_get_requirement_modules());
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

if (isset($_GET['action']) && $_GET['action'] == 'getTotalMCs') {
	echo json_encode(db_get_total_mcs());
}

// function db_get_requirements() {
// 	$degreeCode = $_GET['degreeCode'];
// 	$academicYear = $_GET['academicYear'];

// 	$query = "SELECT *
// 			FROM `Requirements`
// 			WHERE `Requirements`.`degreeCourseCode` = '".$degreeCode."'
// 			AND `Requirements`.`academicYear` = '".$academicYear."'
// 			AND `Requirements`.`specialization` = 'None'
// 			ORDER BY `Requirements`.`modularCredit` DESC";

// 	return getResultingArray($query);
// }

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

	$query = "SELECT `module`,`alternativeModule`,`alternativeModule2`,`alternativeModule3`
			FROM `list`
			WHERE `list`.`listName` = '".$listName."'";

	return getResultingArrayWithoutHead($query);
}

function mod_sort($a,$b) {
	$numbera = preg_replace('/[^0-9]/', '', $a['Code']);
	$numberb = preg_replace('/[^0-9]/', '', $b['Code']);
	$lettera = preg_replace('/[0-9]/', '', $a['Code']);
	$letterb = preg_replace('/[0-9]/', '', $b['Code']);
	$levela = substr($numbera, 0, 1);
	$levelb = substr($numberb, 0, 1);
	if ($levela == $levelb) {
		if ($lettera == $letterb) {
			return strcasecmp($numbera,$numberb);
		} else {
			return strcasecmp($lettera,$letterb);
		}
	} else {
		return strcasecmp($levela, $levelb);
	}
}

function db_get_requirement_modules() {
	if (isset($_GET['degreeCode'])) {
		$degreeCode = $_GET['degreeCode'];
	} else {
		$degreeCode = NULL;
	}
	
	$query = "SELECT `Code`,`Credit`,`Description`,`Examdate`,`Name`,`Preclude`,`Prereq`,`coursecode` AS `CourseCode`,`fulfil` AS `ModuleType`
			FROM `unicoursereq`,`Module`
			WHERE `unicoursereq`.`coursecode` = '".$degreeCode."'
			AND `unicoursereq`.`modulecode` = `Module`.`Code`
			ORDER BY `Module`.`Code`";

	$result = getResultingArray($query);
	usort($result,"mod_sort");
	return $result;
}

function db_get_all_modules() {
	
	$query = "SELECT *
			FROM `Module`";

	return getResultingArray($query);
}

function db_get_specializations() {
	$degreeCode = $_GET['degreeCode'];
	
	$query = "SELECT *
			FROM `Course_Specialization_List`
			WHERE `coursecode` = '".$degreeCode."'";
	
	return getResultingArray($query);
}

function db_get_specialization_modules() {
	$specialization = $_GET['specialization'];
	
	$query = "SELECT `Code`,`Credit`,`Description`,`Examdate`,`Name`,`Preclude`,`Prereq`,`specialization` AS `Specialization`,`fufil` AS `ModuleType`
				FROM `cegspecialization`, `Module`
				WHERE `cegspecialization`.`specialization` LIKE '%".$specialization."%'
				AND `cegspecialization`.`modulecode` = `Module`.`Code`";
	
	return getResultingArray($query);
}

function db_get_total_mcs() {
	$degreeCode = $_GET['degreeCode'];

	$query = "SELECT `totalMCs`
				FROM `Degrees`
				WHERE `Degrees`.`degreeCode` = '".$degreeCode."'";

	return getResultingArray($query);
}

?>
