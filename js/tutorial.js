var tutorialModeOn = true;
if (localStorage["beenBefore"] == undefined) {
	console.log("first time");
	tutorialModeOn = true;
	showTutorial(1);
} else {
	console.log("been here before");
	tutorialModeOn = false
}

function showTutorial(pageNumber) {console.log(pageNumber)
	if (tutorialModeOn) {
		$("#requirement-specification").css("z-index", "initial");
		$("#tutorial").css("z-index", 100);
		switch(pageNumber) {
			case 1:
				$(".ui.fixed.inverted.main.menu").after("<img id='tutorialImage1' src=img/tutorial1.png>");
				$("#tutorial").fadeTo(500,0.75);
			break;
			case 2:
				$("#tutorialImage1").remove();
				changeSlideFirst(function() {
					$("#bottom-container").before("<img id='tutorialImage2' src=img/tutorial2.png>");
					$("#requirement-specification").css("z-index", 102);
					chooseDegree();
				});
			break;
			case 3:
				$("#tutorialImage2").remove();
				$("#requirement-specification").css("z-index", "initial");
				changeSlide(function() {
					$("#bottom-container").before("<img id='tutorialImage3' src=img/tutorial3.png>");
					$("#bottom-container").before("<img id='tutorialImage3a' src=img/tutorial3a.png>");
					$("#requirementModules").css("z-index", 102);
					$("#semester-container .semester").css("z-index", 102);
				});
			break;
			case 4:
				$("#requirementModules").css("z-index", "initial");
				$("#semester-container .semester").css("z-index", "initial");
				$("#tutorialImage3").fadeOut(500, function() {
					$("#tutorialImage3").remove();
				});
				$("#tutorialImage3a").fadeOut(500, function() {
					$("#tutorialImage3a").remove();
					$("#top-container").after("<img id='tutorialImage4' src=img/done.png style='display:none'>");
					$("#tutorialImage4").fadeIn(500, function() {
						$("#tutorial").fadeTo(1500,0, function() {
							$("#tutorial").remove();
						});
						$("#tutorialImage4").fadeOut(1500);
					});
				});
				tutorialModeOn = false;
				localStorage["beenBefore"] = true;
			break;
		}
	}
}

function removeImage1() {
	$("#tutorialImage1").fadeOut(500);
}

function removeImage2() {
	$("#tutorialImage2").fadeOut(500);
}

function changeSlide(fn) {
	$("#tutorial").fadeTo(500,0,function() {
		fn();
	});
	$("#tutorial").fadeTo(500,0.75);
}

function changeSlideFirst(fn) {
	$("#tutorial").fadeTo(500,0);
	$("#tutorial").fadeTo(500,0.75, function() {
		fn();
	});
}