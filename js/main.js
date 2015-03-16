//Initialize UI elements
$(document).ready(function(){
	//Initialize dropdown
	$('.ui.dropdown').dropdown();
	$('#course-selection').dropdown({
		onChange: function(value) {
			chooseDegree(value);
		}
	});

	//Initialize popup
	$('.popup').popup();

	//Initialize modal
	$('.modal').modal();
	$('.standard.modal').modal('attach events', '.standard.demo.button');
	$('.basic.modal').modal('attach events', '.minimal.demo.button');
	$('.fullscreen.modal').modal('attach events', '.fullscreen.demo.button');

	//Initialize active class
    InitializeActiveClass();
    
});

function chooseDegree(value) {
	var degreeCode = "";
	switch(value) {
		case "computer engineering":
			degreeCode = "CEG";
			break;
		case "political science(honours)":
			degreeCode = "PS_HONS";
			break;
	}
	initializeRequirementModules(degreeCode);
}

function InitializeActiveClass() {
	$('.menu a.item').on('click', function() {
    	if(!$(this).hasClass('dropdown')) {
          $(this).addClass('active').closest('.ui.menu').find('.item').not($(this)).removeClass('active');
        }
	});
}

function InitializeSearchContent() {
	$('.ui.search').search({
		searchFields: ["title"],
    	source: allModuleListSearch,
    	searchDelay: 100,
    	transition: "slide down"
    });
}

var qwe;
var noOfSems = 8;

//Initialize storage structure
var defaultUserSavedModules = {};
for (var i = 1; i <= noOfSems; i++) {
	defaultUserSavedModules["semester" + i] = {};
	defaultUserSavedModules["semester" + i].modules = [];
	defaultUserSavedModules["semester" + i].mcs = 0;
}
defaultUserSavedModules.course = "CEG";
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
				<ul class="ui selection list module-list"></ul>\
				<div class="ui bottom right attached label">MCs: 0</div>\
			</div>\
		</div>');
	semesterContainer.css("min-width", noOfSems * 11.3 + "rem");
}


//Insert Requirement Module List
requirementContainer.append(
	'<div id="requirementModules" class="semester">\
		<div class="ui segment">\
			<div class="ui top attached label">\
				Requirement Modules\
			</div>\
			<ul class="ui selection list module-list"></ul>\
			<div class="ui bottom right attached label">0/0</div>\
		</div>\
	</div>');

//Insert Requirement Specifications
requirementContainer.append(
	'<div id="requirement-specification" class="semester">\
		<div class="ui segment">\
			<div class="ui top attached label">\
				Requirements\
			</div>\
			<ul class="ui secondary pointing vertical menu module-list"></ul>\
			<div class="ui bottom right attached label">0/0</div>\
		</div>\
	</div>');


//Insert Selection
requirementContainer.append(
	'<div id="selection" class="semester">\
		<div class="ui segment">\
			<div class="ui top attached label">\
				Selection\
				<div class="ui search">\
				<div class="ui icon input">\
					<input class="prompt" type="text" placeholder="Search Modules">\
					<i class="search icon"></i>\
				</div>\
				<div class="results"></div>\
				</div>\
			</div>\
			<ul class="ui selection list module-list">\
			</ul>\
			<div class="ui bottom right attached label">MCs:0</div>\
		</div>\
	</div>');

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