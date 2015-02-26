//Initialize UI elements
$(document).ready(function(){
	//Initialize dropdown
	$('.ui.dropdown').dropdown();
	$('.ui.menu .dropdown').dropdown({on: 'hover'});

	//Initialize popup
	$('.popup').popup();

	//Initialize modal
	$('.modal').modal();
	$('.standard.modal').modal('attach events', '.standard.demo.button');
	$('.basic.modal').modal('attach events', '.minimal.demo.button');
	$('.fullscreen.modal').modal('attach events', '.fullscreen.demo.button');
});

var noOfSems = 8;

//Initialize storage structure
var defaultUserSavedModules = {};
for (var i = 1; i <= noOfSems; i++) {
	defaultUserSavedModules["semester" + i] = {};
	defaultUserSavedModules["semester" + i].modules = [];
	defaultUserSavedModules["semester" + i].mcs = 0;
}
defaultUserSavedModules.course = "CEG";
defaultUserSavedModules.specialization = "None";
defaultUserSavedModules.chosenModules = {};


var userSavedModules = defaultUserSavedModules;
var storage;
var year = 0;
var semestersInAYear = 2;
var semesterContainer = $("#semester-container");
var topContainer = $("#top-container");
var requirementContainer = $("#requirement-container");

//Insert semesters
for (var i = 1; i <= noOfSems; i++) {
	year = Math.floor((i-1) / semestersInAYear) + 1;
	var semesterNo = ((i-1) % semestersInAYear) + 1;
	semesterContainer.append(
		'<div id="semester' + i + '" class="semester">\
			<div class="ui segment">\
				<div class="ui top attached label">\
					Year ' + year + ' Semester ' + semesterNo + '\
				</div>\
				<ul class="ui selection list module-list">\
					<a class="item module">CS1234 The Most Important Module Ever In The History of NUS</a>\
					<a class="item module">Selection</a>\
					<a class="item module">Selection</a>\
				</ul>\
				<div class="ui bottom right attached label">MCs: 0</div>\
			</div>\
		</div>');
	semesterContainer.css("min-width", noOfSems * 11.3 + "rem");
}


var bottomIds = ["requirement", "requirement-specification", "selection"];

for (var id in bottomIds) {
	var title = {"requirement": "Requirement Modules",
		"requirement-specification": "Requirements",
		"selection": "Selection"
	}
	requirementContainer.append(
	'<div id="'+ bottomIds[id] +'" class="semester">\
		<div class="ui segment">\
			<div class="ui top attached label">\
				'+title[bottomIds[id]]+'\
			</div>\
			<ul class="ui selection list module-list">\
				<a class="item module">CS1234 The Most Important Module Ever In The History of NUS</a>\
				<a class="item module">Selection</a>\
				<a class="item module">Selection</a>\
			</ul>\
			<div class="ui bottom right attached label">0/10</div>\
		</div>\
	</div>');
}

//Drag Scrolling
var reqContainerClicked = false;
var mouseXPos, left;
topContainer.on({
	'mousedown': function(e) {
		e.preventDefault();
		reqContainerClicked = true;
		if (topContainer.width() < semesterContainer.width()){
			$(this).css("cursor","-webkit-grabbing");
			mouseXPos = e.pageX;
			left = topContainer.scrollLeft();
		}
	},
	'mouseup': function(e) {
		reqContainerClicked = false;
		if (topContainer.width() < semesterContainer.width())
			$(this).css("cursor","-webkit-grab");
	},
	'mousemove': function(e) {
		if (reqContainerClicked) {
			var newX = e.pageX;
			topContainer.scrollLeft(left - e.pageX + mouseXPos);
		}
	},
	'mouseleave': function(e) {
		reqContainerClicked = false;
		$(this).css("cursor","default");
	},
	'mouseenter': function(e) {
		if (topContainer.width() < semesterContainer.width())
			$(this).css("cursor","-webkit-grab");
	}
});