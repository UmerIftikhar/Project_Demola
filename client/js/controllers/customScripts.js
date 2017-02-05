var socket = io();
//this is pinged inorder to delete the old HTML element and update with the new element
socket.on("prop_Changed", function (data) {
	// For the scalable things, which are mainly the pictures the element is not changed instead their objects are just replaced.				
	if (double_Click.getAttribute('data-type') != 'scalable') {
		//remove the older element
		double_Click.remove();
		double_Click.innerHTML = data.objectHtml;
		//replace with the newer element
		$("#drop-target-one").append(double_Click);
	} else if (double_Click.getAttribute('data-type') == 'scalable') {
		switch (double_Click.getAttribute('data-objectid')) {
			case 'image':
				double_Click.firstChild.src = data.url;
				break;
			case 'panel':
				double_Click.firstChild.style.backgroundColor = data.backgroundColor;
				break;
		}
	}
});

window.onload = function () {

	/**
	*
	*	Demo 1: Elements
	*
	*/
	var dropZoneOne = document.querySelector('#drop-target-one');
	var dropZoneDelete = document.querySelector('#drop-target-delete');
	var dragElements = document.querySelectorAll('#drag-elements1 li');
	var xhttp = new XMLHttpRequest();

	var dragCharts = $("[fusioncharts='']");
	var dragDeleteElements = new Array();
	var elementDeleteDragged = null;

	var angular_elements = document.querySelectorAll('#angular_elements p');

	for (var i = 0; i < dragElements.length; i++) {
		dragElements[i].addEventListener('dragstart', function (e) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text', this.innerHTML);
			elementDragged = this;
		});
		dragElements[i].addEventListener('dragend', function (e) {
		});
	};

	for (var i = 0; i < angular_elements.length; i++) {
		var chart_real = angular_elements[i];
		chart_real.addEventListener('dragstart', function (e) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text', this.innerHTML);
			elementDragged = this;
		});
	}

	///////////////////////////////////////////////////////////////////////////////////	
	for (var i = 0; i < dragDeleteElements.length; i++) {

		// Event Listener for when the drag interaction starts.
		dragDeleteElements[i].addEventListener('dragstart', function (e) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text', this.innerHTML);
			elementDeleteDragged = this;
		});

		// Event Listener for when the drag interaction finishes.
		dragDeleteElements[i].addEventListener('dragend', function (e) {
		});
	};
	///////////////////////////////////////////////////////////////////////////////////	

	// Event Listener for when the dragged element is over the drop zone.
	dropZoneOne.addEventListener('dragover', function (e) {
		if (e.preventDefault) {
			e.preventDefault();
		}

		e.dataTransfer.dropEffect = 'move';

		return false;
	});

	// Event Listener for when the dragged element enters the drop zone.
	dropZoneOne.addEventListener('dragenter', function (e) {
		this.className = "over";
	});

	// Event Listener for when the dragged element leaves the drop zone.
	dropZoneOne.addEventListener('dragleave', function (e) {
		this.className = "";
	});

	// Event Listener for when the dragged element dropped in the drop zone.
	dropZoneOne.addEventListener('drop', function (e) {
		var isAngular = false;
		var angular_to_be_sent;
		var dataSource;
		var dataSource_gauge;
		var dataSource_cylinder;
		var ess = window.event;
		if (e.preventDefault) e.preventDefault();
		if (e.stopPropagation) e.stopPropagation();


		this.className = "";
		var nodes_test = document.getElementById("drop-target-one");
		var nodes = document.getElementById("drop-target-one").childNodes;
		var cln = elementDragged.cloneNode(true);
		cln.removeAttribute("draggable");
		cln.style.top = (ess.clientY - 60) + "px";
		cln.style.left = (ess.clientX - 140) + "px";

		//it removes the selection of the components 
		if (left_global != undefined) {
			var remove_el = $(left_global);
			$(remove_el.children()[0]).css("outline", "");
		}

		// This closes the property panel for other elements 
		socket.emit("panelVisibilityOnClick", {});

		//Functionality specifically for image type of element 
		switch (cln.getAttribute("data-objectid")) {
			case 'panel':
				var panel = cln.childNodes[0];
				panel.textContent = "";
				break;
			case "image":
				//Change the picture and size of the image when the image object is dragged and dropped
				var img = cln.childNodes[0];
				img.setAttribute("src", "../images/leanware-logo.png");
				img.setAttribute("width", "100px");
				img.setAttribute("height", "100px");
				break;
			case "bar-chart":
				//Change the size of the image when the line Chart object is dragged and dropped
				var chrt = cln.childNodes[0];
				chrt.setAttribute("width", "300px");
				chrt.setAttribute("height", "300px");
				break;
			case "candle-chart":
				//Change the size of the image when the candle Chart object is dragged and dropped
				var chrt = cln.childNodes[0];
				chrt.setAttribute("width", "400px");
				chrt.setAttribute("height", "250px");
				break;
			case "line-chart":
				//Change the size of the image when the line Chart object is dragged and dropped
				var chrt = cln.childNodes[0];
				chrt.setAttribute("width", "400px");
				chrt.setAttribute("height", "250px");
				break;
		}
		cln.setAttribute("oncontextmenu", "showCustomMenu(this)");
		cln.setAttribute("ondblclick", "showDoubleMenu(this)");
		cln.setAttribute("onclick", "singleDotted(this)");
		nodes_test.appendChild(cln);
		var cln_test = $(cln);
		//==================================
		if ($(elementDragged).parent().attr("id") == "drag-elements1") {
			$(cln).droppable({
				drop: function (event, ui) {
					/*$(this).append(ui.draggable.context);
					ui.draggable.css({
						position: 'absolute',
						cursor: 'pointer'
					});*/
				},
				out: function (event, ui) {
					/*$("#drop-target-one").append(ui.draggable.context);
					ui.draggable.css({
						position: 'absolute',
						cursor: 'pointer'
					});*/
				}
			});
			if ($(elementDragged).attr("data-type") == "scalable") {
				$(cln).resizable({});

				$(cln).css('width', "100px");
				$(cln).css('height', "100px");
			}
			cln_test.css({
				position: 'absolute',
				cursor: 'pointer'
			});
		}
		//=========================
		//cln_test.css({
		//	position: 'absolute',
		//	cursor: 'pointer'
		//});
		var $draggables_p = $("#drop-target-one");
		var $draggables = $draggables_p.children();
		var id, $draggableItem;
		for (var i = 0; i < $draggables.length; i++) {
			var $my_test_array = new Array();
			for (var j = 0; j < $draggables.length; j++) {
				if ($draggables.eq(i)[0] != $draggables.eq(j)[0]) {
					$draggableItem = $draggables.eq(j);
					$my_test_array.push($draggableItem);
				}
			}

			$($draggables.eq(i)).draggable({
				obstacle: $my_test_array,
				preventCollision: true,
				containment: "#drop-target-one",
				stop: function (event, ui) {

				},
				drag: function (event, ui) {
					var movedObjectJson = { 'currentId': this.id, 'positionX': ui.position.left, 'positionY': ui.position.top };
					angular.element($("#my_body")).scope().objectMoved(movedObjectJson);
				}
			});
		}
		var aaa
		xhttp.onreadystatechange = function () {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				aaa = xhttp.responseText;
				cln.setAttribute("id", JSON.parse(aaa));
				//Generate the json to be sent to Angular
				var objectJson = { 'currentHtml': cln.outerHTML, 'id': xhttp.responseText, 'objectId': cln.getAttribute("data-objectid"), 'objectHtml': cln.innerHTML, 'positionX': cln.style.left, 'positionY': cln.style.top, 'dataType': cln.getAttribute("data-type") };
				angular.element($("#my_body")).scope().addObject(objectJson);
			}
		};

		xhttp.open('POST', '/getNewObject', true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send();

		elementDragged = null;

		return false;
	});
};

//========================Jquery Scripts=====================//
$(document).ready(function () {

	// jQuery methods go here...	

	$("#LeftPanAdjustButton").click(function () {
		socket.emit("panelVisibilityOnClick", {});
		$("#LeftPan").animate({
			left: "-15%",
		}, 500);
		$("#main_ui").animate({
			left: "0%",
		}, 500);
		$('#LeftPanAdjustButton2').removeClass('not');
	});

	$("#LeftPanAdjustButton2").click(function () {
		socket.emit("panelVisibilityOnClick", {});
		$("#LeftPan").animate({
			left: "0%",
		}, 500);
		$("#main_ui").animate({
			left: "15%",
		}, 500);
		$('#LeftPanAdjustButton2').addClass('not');
	});

});

//========================================================//

//Function that shows the menu on right click
function showCustomMenu(currElement) {
	right_global = currElement;
	var e = window.event;
	var i = document.getElementById("menu").style;
	var posX = e.clientX;
	var posY = e.clientY;
	menu(posX, posY, i);
	e.preventDefault();
}

// Function which calculates the right click display menu position
function menu(x, y, i) {
	i.top = y + "px";
	i.left = x + "px";
	i.visibility = "visible";
	i.opacity = "1";
}

// Function that closes the right click display menu 
function removeCustomMenu(currElement) {
	angular.element($("#my_body")).scope().deleteObject(right_global);
	right_global.remove();
	var e = window.event;
	var i = document.getElementById("menu").style;
	i.opacity = "0";
	setTimeout(function () {
		i.visibility = "hidden";
	});
	right_global = null;
}

// Function that pings the angular controller to show the angular element property panel
function showDoubleMenu(currElement) {
	var socket = io();
	if ((currElement.id != null) && (currElement.id != "")) {
		double_Click = currElement;
		socket.emit("panelVisibility", { 'elementId': currElement.id });
	} else if ((right_global != null) && (right_global != undefined)) {
		double_Click = right_global;
		socket.emit("panelVisibility", { 'elementId': right_global.id });
	}
}

//Function which shows the selected object with a 	
function singleDotted(currElement) {
	if (left_global != undefined) {
		var remove_el = $(left_global);
		$(remove_el.children()[0]).css("outline", "");
	}
	var inner_el = $(currElement);
	$(inner_el.children()[0]).css("outline", "red dashed");
	left_global = currElement;
}

//Function that rotates the object
function showValue(newValue) {
	var degree = newValue;
	var svg_el = $(double_Click);
	//Rotation is added for both the child and the parent element
	if ((svg_el.attr("data-objectid") == 'svg-square') || (svg_el.attr("data-objectid") == 'svg-circle') || (svg_el.attr("data-objectid") == 'svg-path')) {
		$(svg_el.children()[0]).css('-moz-transform', 'rotate(' + degree + 'deg)')
		$(svg_el.children()[0]).css('-webkit-transform', 'rotate(' + degree + 'deg)');
		$(svg_el.children()[0]).css('-o-transform', 'rotate(' + degree + 'deg)');
		$(svg_el.children()[0]).css('-ms-transform', 'rotate(' + degree + 'deg)');
	}
	svg_el.css('-moz-transform', 'rotate(' + degree + 'deg)');
	svg_el.css('-webkit-transform', 'rotate(' + degree + 'deg)');
	svg_el.css('-o-transform', 'rotate(' + degree + 'deg)');
	svg_el.css('-ms-transform', 'rotate(' + degree + 'deg)');
}

