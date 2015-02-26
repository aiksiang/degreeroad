var requirementSpecification = $("#requirement-specification .module-list");

function displayRequirements() {
	requirementSpecification.html("");

	for (var i in requirements) {
		requirementSpecification.append(listItem("item",'<div>'+ requirements[i].ruleName + ' (' + ((requirements[i].inequality=="ALL")?requirements[i].inequality:(requirements[i].inequality + " " + requirements[i].number + " " + requirements[i].quantifier) + "s") + " from " + requirements[i].includeType + ')</div>'));
		if (requirements[i].hasOwnProperty("children")) {
			for (var j in requirements[i].children) {
				requirementSpecification.append(listItem("item",'<div>&nbsp&nbsp&nbsp&nbsp'+ requirements[i].children[j].ruleName + ' (' + ((requirements[i].inequality=="ALL")?requirements[i].inequality:(requirements[i].inequality + " " + requirements[i].number + " " + requirements[i].quantifier) + "s") + " from " + requirements[i].includeType + ')</div>'));
			}
		}
	}

}


function listItem(className, text) {
	return "<a class='"+ className +"'>"+ text +"</a>";
}