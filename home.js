document.addEventListener("DOMContentLoaded", bindButtons);

function bindButtons() {
	buildTable();
		
	document.getElementById("addWorkoutButton").addEventListener("click", function (event) {
		event.preventDefault();
		var req = new XMLHttpRequest();
		
		var url = createInsertURL(document.getElementById("workoutName").value, document.getElementById("workoutReps").value, 
		document.getElementById("workoutWeight").value, document.getElementById("workoutDate").value, document.getElementById("unitCheck").value);
		
		if (document.getElementById("workoutName").value != '') {
			
		req.open("GET", url, true);
		req.addEventListener("load", function() {
			if(req.status >= 200 && req.status < 400){
			var response = JSON.parse(req.responseText);
			console.log(response);
			buildTable();
			document.getElementById("workoutName").value='';
			document.getElementById("workoutReps").value='';
			document.getElementById("workoutWeight").value='';
			document.getElementById("workoutDate").value='mm/dd/yyyy';
			} else {
        console.log("Error in network request: " + req.statusText);
		}
		});
		req.send(null);
		}
    });
	
	document.getElementById("updateTableButton").addEventListener("click", function (event) {
		event.preventDefault();
		var req = new XMLHttpRequest();
		
		var url = createUpdateURL(document.getElementById("editingID").name, document.getElementById("workoutName").value, 
		document.getElementById("workoutReps").value, document.getElementById("workoutWeight").value, document.getElementById("workoutDate").value, 
		document.getElementById("unitCheck").value);
		
		if (document.getElementById("workoutName").value != '') {
			
		req.open("GET", url, true);
		req.addEventListener("load", function() {
			if(req.status >= 200 && req.status < 400){
			var response = JSON.parse(req.responseText);
			console.log(response);
			buildTable();
			document.getElementById("editingID").name='';
			document.getElementById("workoutName").value='';
			document.getElementById("workoutReps").value='';
			document.getElementById("workoutWeight").value='';
			document.getElementById("workoutDate").value='mm/dd/yyyy';
			} else {
        console.log("Error in network request: " + req.statusText);
		}
		});
		req.send(null);
		}
    });
	
	document.getElementById("resetTableButton").addEventListener("click", function(event){
		event.preventDefault();
		var req = new XMLHttpRequest();
		
		var url = 'http://flip3.engr.oregonstate.edu:51524/reset-table';
			
		req.open("GET", url, true);
		req.addEventListener("load", function() {
			if(req.status >= 200 && req.status < 400){
			var response = JSON.parse(req.responseText);
			console.log(response);
			buildTable();
			} else {
        console.log("Error in network request: " + req.statusText);
		}
		});
		req.send(null);		
    });
	
	
}

function createUpdateButton() {
	var updateButton = document.createElement('input');
	updateButton.setAttribute("type", "button");
	updateButton.setAttribute("value", "Update Workout");
	updateButton.setAttribute("onclick","updateWorkout(this)");
	return updateButton;
}

function createDeleteButton() {
	var deleteButton = document.createElement('input');
	deleteButton.setAttribute("type", "submit");
	deleteButton.setAttribute("value", "Delete Workout");
	deleteButton.setAttribute("onclick", "deleteWorkout(this)"); 
	return deleteButton;
}

function createInsertURL(name, reps, weight, date, lbs) {
	var url = 'http://flip3.engr.oregonstate.edu:51524/insert';
	if (name != '') {
		url += "?name=" + name;
	}
	if (reps != '') {
		url += "&reps=" + reps;
	}
	if (weight != '') {
		url += "&weight=" + weight;
	}
	if (date != '') {
		url += "&date=" + date;
	}
	if (lbs != '') {
		url+= "&lbs=" + lbs;
	}
	return url;
}

function createUpdateURL(id, name, reps, weight, date, lbs) {
	var url = 'http://flip3.engr.oregonstate.edu:51524/update';
	url += "?id=" + id;
	if (name != '') {
		url += "&name=" + name;
	}
	if (reps != '') {
		url += "&reps=" + reps;
	}
	if (weight != '') {
		url += "&weight=" + weight;
	}
	if (date != '') {
		url += "&date=" + date;
	}
	if (lbs != '') {
		url+= "&lbs=" + lbs;
	}
	return url;
}

function createRow(numCells){
	var row = document.createElement('tr');
	for (var i = 0; i < numCells; i++) {
		var cell = document.createElement('td');
		row.appendChild(cell);
	}
	return row;
}

function fillCells(response, row, i) {
	var cell = row.firstChild;
	cell.name = response.results[i].id;
	cell.className = 'id';
	cell.type = 'hidden';
	cell = cell.nextSibling;
	
	cell.textContent = response.results[i].name;
	cell.className = 'name';
	cell = cell.nextSibling;
	
	cell.textContent = response.results[i].reps;
	cell.className = 'reps';
	cell = cell.nextSibling;
	
	cell.textContent = response.results[i].weight;
	cell.className = 'weight';
	cell = cell.nextSibling;
							
	cell.textContent = response.results[i].date.split('T')[0];;
	cell.className = 'date';
	cell = cell.nextSibling;
	
	if (response.results[i].lbs == 1)
		cell.textContent = 'lbs';
	else
		cell.textContent = 'kgs';
	cell.className = 'lbs';
	cell = cell.nextSibling;
	
	var updateButton = createUpdateButton();
	updateButton.setAttribute("name", row.firstChild.name);
	cell.appendChild(updateButton);		
	cell = cell.nextSibling;
	
	
	var deleteButton = createDeleteButton();
	deleteButton.setAttribute("name", row.firstChild.name);
	cell.appendChild(deleteButton);
	return row;
}


function buildTable () {
	var newTable = document.createElement('table');
	newTable.id = "exerciseTable";
	
	var headerRow = document.createElement('tr');
	
	var IDcell = document.createElement('td');
	IDcell.type = "hidden";
	headerRow.appendChild(IDcell);
	
	var nameCell = document.createElement('td');
	nameCell.textContent = "Workout Name";
	headerRow.appendChild(nameCell);
	
	var repsCell = document.createElement('td');
	repsCell.textContent = "Reps";
	headerRow.appendChild(repsCell);
	
	var weightCell = document.createElement('td');
	weightCell.textContent = "Weight";
	headerRow.appendChild(weightCell);
	
	var dateCell = document.createElement('td');
	dateCell.textContent = "Date";
	headerRow.appendChild(dateCell);
	
	var lbsCell = document.createElement('td');
	lbsCell.textContent = "Lbs/Kgs";
	headerRow.appendChild(lbsCell);
	
	var updateButtonCell = document.createElement('td');
	updateButtonCell.textContent = "Update";
	headerRow.appendChild(updateButtonCell);
	
	var deleteButtonCell = document.createElement('td');
	deleteButtonCell.textContent = "Delete";
	headerRow.appendChild(deleteButtonCell);
	
	newTable.appendChild(headerRow);
	
	var tableDiv = document.getElementById("exerTable");
	while(tableDiv.firstChild){
		tableDiv.removeChild(tableDiv.firstChild);
	}
	tableDiv.appendChild(newTable);
		
	var req = new XMLHttpRequest();
	req.open("GET", 'http://flip3.engr.oregonstate.edu:51524/', true);
	req.addEventListener('load', function() {
		var response = JSON.parse(req.responseText);
			
		for (var i in response.results) {
			var row = createRow(8);			
			row = fillCells(response, row, i);
			
			table = document.getElementById('exerciseTable');
			table.appendChild(row);
		}
	
});
req.send(null);
}


function updateWorkout(updateButton) {
	/*var req = new XMLHttpRequest();
	
	req.open("GET", "http://flip3.engr.oregonstate.edu:51524/select-where?id=" + updateButton.name, true);
	
	req.addEventListener('load', function() {
		var response = JSON.parse(req.responseText);
		document.getElementById("workoutName").value=response.results.name;
		document.getElementById("workoutReps").value=response.results.reps;
		document.getElementById("workoutWeight").value=response.results.weight;
		document.getElementById("workoutDate").value=response.results.date;
	});
	req.send(null);*/
	children = updateButton.parentNode.parentNode.childNodes;
	document.getElementById("editingID").name=updateButton.name;
	document.getElementById("workoutName").value=children[1].textContent;
	document.getElementById("workoutReps").value=children[2].textContent;
	document.getElementById("workoutWeight").value=children[3].textContent;
	document.getElementById("workoutDate").value=children[4].textContent;
	if (children[5].textContent = 'lbs')
		document.getElementById("unitCheck").value= 1;
	else
		document.getElementById("unitCheck").value= 0;
}

function deleteWorkout(deleteButton){
	var req = new XMLHttpRequest();
	req.open("GET", "http://flip3.engr.oregonstate.edu:51524/delete?id=" + deleteButton.name, true);
	
	req.addEventListener('load', function() {
		var response = JSON.parse(req.responseText);
		buildTable();
	});
	req.send(null);
	
}