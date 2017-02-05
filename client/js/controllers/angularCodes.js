var xsd;
var mychart;
var app = angular.module("myApp", ['ui.bootstrap']);

app.factory('httpReq', function ($http, $q) {
	return {
		monitorScreen: function (dataObj) {
            return $http.get('/monitor', dataObj)
				.then(function (response) {
					return response.data;
				}, function (response) {
					return $q.reject(response.data);
				});
        }
	}
});

app.factory('socket', function ($rootScope) {
	var socket = io.connect('http://localhost:8080');
	return {
		on: function (eventName, callback) {
			socket.on(eventName, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		},
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			})
		}
	};
});

app.controller('MyController', function ($scope, socket, $window, httpReq, $location) {
	//:::::::::::::::::::::::::::::::Balaji:::::::::::::::::::::::::::::

	//Variables=========================================================

	$scope.allDP = [];
	$scope.testObject = '';
	$scope.currentObject = '';
	$scope.screenName = '';

	$scope.initialPanel = true;

	$scope.confirmButton = false;

	$scope.settings = true;

	$scope.gaugeValue = 50;

    $scope.imagepath = '../images/custbg.png';

	$scope.newimagepath = {
		url: ''
	};

	$scope.creationPanel = {
		panelShow: false
	}

	$scope.mainPanelStyle = {
		'background': 'url(' + $scope.imagepath + ')',
		'background-size': '100% 100%',
		'background-repeat': 'no-repeat'
	};

	$scope.settingPanel = {
		panelShow: false
	}

	//All the variables with respect to the property panel are available here
	$scope.propertyPanel = {
		panel: false,
		minimize: false,
		// variables with respect to button styles
		generalButtonStyle: {
			'color': 'hsla(43, 100%, 50%, 1.0)',
			'background-color': '#000',
			'border': '5px solid hsla(43, 100%, 50%, 1.0)'
		},
		fontButtonStyle: {
			'color': 'hsla(43, 100%, 50%, 1.0)',
			'background-color': '#000',
			'border': '5px solid hsla(43, 100%, 50%, 1.0)'
		},
		shapeButtonStyle: {
			'color': 'hsla(43, 100%, 50%, 1.0)',
			'background-color': '#000',
			'border': '5px solid hsla(43, 100%, 50%, 1.0)'
		},
		specialButtonStyle: {
			'color': 'hsla(43, 100%, 50%, 1.0)',
			'background-color': '#000',
			'border': '5px solid hsla(43, 100%, 50%, 1.0)'
		},
		dpButtonStyle: {
			'color': 'hsla(43, 100%, 50%, 1.0)',
			'background-color': '#000',
			'border': '5px solid hsla(43, 100%, 50%, 1.0)'
		},
		bgButtonStyle: {
			'color': 'hsla(43, 100%, 50%, 1.0)',
			'background-color': '#000',
			'border': '5px solid hsla(43, 100%, 50%, 1.0)'
		},
		connectionButtonStyle: {
			'color': 'hsla(43, 100%, 50%, 1.0)',
			'background-color': '#000',
			'border': '5px solid hsla(43, 100%, 50%, 1.0)'
		},
		//Variabels with repect to the showing the required individuals based on the property selected
		generalShow: false,
		fontShow: false,
		shapeShow: false,
		specialShow: false,
		dpShow: false,
		bgShow: false,
		connectionShow: false,
		//Variables with respect to button visibility
		generalOption: false,
		fontOption: false,
		shapeOption: false,
		dpOption: false,
		specialOption: false,
		bgOption: false,
		connectionOption: false,
		//Object properties
		name: '',
		parent: '',
		dataPoint: '',
		degree: 0,
		height: 100,
		radius: 30,
		width: 100,
		zoom: 100,
		rowNos: 2,
		url: '',
		nomValue: 0,
		nomLabel: 'Nominal',
		nomColorLabel: 'Nom-Color',
		nomColor: 'green',
		minValue: 0,
		minLabel: 'Minimum',
		minColorLabel: 'Min-Color',
		minColor: 'red',
		maxValue: 0,
		maxLabel: 'Maximum',
		maxColorLabel: 'Max-Color',
		maxColor: 'orange',
		checkBoxLabel: 'Unfix Array',
		backgroundColor: 'Background-Color : white',
		font: 'Font-Family : Verdana',
		color: 'Font-Color : black',
		fontSize: 14,
		minMaxPresence: false,
		checkBoxState: false,
		//variables for individuals	
		colorList: ['red', 'orange', 'blue', 'green', 'black', 'white', 'transparent'],
		fontList: ['Font-Family : Arial', 'Font-Family : Impact', 'Font-Family : Times New Roman', 'Font-Family : Verdana', 'Font-Family : Tahoma'],//variables with respect to items visibility as per Object type
		imageProp: false,
		widthHeightShow: false,
		radiusShow: false,
		zoomShow: false,
		listShow: false,
		minShow: true,
		checkBoxShow: false,
		textBox: false,
		custButtonLabel: 'Map',
		gaugeShow: false,
		units: '',
		pageUrl: '',
		dpList: []
	};

	//Object Variables
	$scope.objectProperties = {
		finalHtml: '',
		id: '',
		url: '',
		objectId: '',
		dataType: '',
		posX: '',
		posY: '',
		parent: '',
		dataPoint: '',
		html: '',
		objectHtml: '',
		name: '',
		rowNos: 2,
		font: 'Verdana',
		color: 'black',
		backgroundColor: 'white',
		fontSize: '14px',
		minMaxPresence: false,
		typeMap: false,
		checkBoxState: true,
		nomvValue: 0,
		maxColor: 'red',
		minColor: 'orange',
		nomColor: 'green',
		maxValue: 75,
		degree: 0,
		height: 100,
		radius: 30,
		width: 100,
		zoom: 100,
		minValue: 35,
		pageUrl: '',
		units: ''
	};

	//Property panel style when button enabled 
	$scope.propButtonEnabledStyle = {
		'color': '#000',
		'background-color': 'hsla(43, 100%, 50%, 1.0)',
		'border': '5px solid #000',
	};

	// Variables with respect to grid
	$scope.gridDetails = {
		value: 'Hide Grid',
		hide: false,
		colorSelect: 'Grid Color: BLACK',
		color: 'rgba(0, 0, 0, .20)' // Lalter the opacity of the color also can be modified
	};

	// Variables with main drag drop panel
	$scope.dropTargetOne = {
		style: {
			'background-color': 'transparent',
			'background-image': 'linear-gradient(0deg, transparent 24%, ' + $scope.gridDetails.color + ' 25%, ' + $scope.gridDetails.color + ' 26%, transparent 27%, transparent 74%, ' + $scope.gridDetails.color + ' 75%, ' + $scope.gridDetails.color + ' 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, ' + $scope.gridDetails.color + ' 25%, ' + $scope.gridDetails.color + ' 26%, transparent 27%, transparent 74%, ' + $scope.gridDetails.color + ' 75%, ' + $scope.gridDetails.color + ' 76%, transparent 77%, transparent)',
			'background-size': '30px 30px'
		}
	};

	// Variables with respect to Datapoint based Object selection panel 
	$scope.dpSelectPanel = {
		parentSelect: '',
		dpSelect: '',
		dpList: [],
		booleanShow: false,
		integerShow: false,
		doubleShow: false,
		stringShow: false,
		longShow: false,
		arrayShow: false,
		barChartShow: false,
		candleChartShow: false,
		verBarChartShow: false
	};

	//Object details with its properties
	$scope.objectDetails = [];

	//Initialization Functions===========================================

	$scope.initializeObjectDisplay = function () {
		$scope.dpSelectPanel.booleanShow = false;
		$scope.dpSelectPanel.integerShow = false;
		$scope.dpSelectPanel.doubleShow = false;
		$scope.dpSelectPanel.stringShow = false;
		$scope.dpSelectPanel.longShow = false;
		$scope.dpSelectPanel.arrayShow = false;
		$scope.dpSelectPanel.mapShow = false;
		$scope.dpSelectPanel.barChartShow = false;
		$scope.dpSelectPanel.candleChartShow = false;
		$scope.dpSelectPanel.verBarChartShow = false;
	};

	$scope.initializeObjectProperties = function () {
		$scope.objectProperties = {
			finalHtml: '',
			id: '',
			url: '',
			objectId: '',
			posX: '',
			posY: '',
			parent: '',
			dataPoint: '',
			html: '',
			objectHtml: '',
			dataType: '',
			name: '',
			rowNos: 2,
			font: 'Verdana',
			color: 'black',
			backgroundColor: 'white',
			fontSize: '14px',
			minMaxPresence: false,
			typeMap: false,
			checkBoxState: true,
			nomvValue: 0,
			maxColor: 'red',
			minColor: 'orange',
			nomColor: 'green',
			maxValue: 75,
			degree: 0,
			height: 100,
			radius: 30,
			width: 100,
			zoom: 100,
			minValue: 35,
			pageUrl: '',
			units: ''
		};
	};

	$scope.initializeProperyitems = function () {
		$scope.propertyPanel = {
			panel: false,
			minimize: false,
			// variables with respect to button styles
			generalButtonStyle: {
				'color': 'hsla(43, 100%, 50%, 1.0)',
				'background-color': '#000',
				'border': '5px solid hsla(43, 100%, 50%, 1.0)'
			},
			fontButtonStyle: {
				'color': 'hsla(43, 100%, 50%, 1.0)',
				'background-color': '#000',
				'border': '5px solid hsla(43, 100%, 50%, 1.0)'
			},
			shapeButtonStyle: {
				'color': 'hsla(43, 100%, 50%, 1.0)',
				'background-color': '#000',
				'border': '5px solid hsla(43, 100%, 50%, 1.0)'
			},
			specialButtonStyle: {
				'color': 'hsla(43, 100%, 50%, 1.0)',
				'background-color': '#000',
				'border': '5px solid hsla(43, 100%, 50%, 1.0)'
			},
			dpButtonStyle: {
				'color': 'hsla(43, 100%, 50%, 1.0)',
				'background-color': '#000',
				'border': '5px solid hsla(43, 100%, 50%, 1.0)'
			},
			bgButtonStyle: {
				'color': 'hsla(43, 100%, 50%, 1.0)',
				'background-color': '#000',
				'border': '5px solid hsla(43, 100%, 50%, 1.0)'
			},
			connectionButtonStyle: {
				'color': 'hsla(43, 100%, 50%, 1.0)',
				'background-color': '#000',
				'border': '5px solid hsla(43, 100%, 50%, 1.0)'
			},
			//Variabels with repect to the showing the required individuals based on the property selected
			generalShow: false,
			fontShow: false,
			shapeShow: false,
			specialShow: false,
			dpShow: false,
			bgShow: false,
			connectionShow: false,
			//Variables with respect to button visibility
			generalOption: false,
			fontOption: false,
			shapeOption: false,
			dpOption: false,
			specialOption: false,
			bgOption: false,
			connectionOption: false,
			//Object properties
			name: '',
			parent: '',
			dataPoint: '',
			degree: 0,
			height: 100,
			radius: 30,
			width: 100,
			zoom: 100,
			rowNos: 2,
			url: '',
			nomValue: 0,
			nomLabel: 'Nominal',
			nomColorLabel: 'Nom-Color',
			nomColor: 'green',
			minValue: 0,
			minLabel: 'Minimum',
			minColorLabel: 'Min-Color',
			minColor: 'red',
			maxValue: 0,
			maxLabel: 'Maximum',
			maxColorLabel: 'Max-Color',
			maxColor: 'orange',
			checkBoxLabel: 'Unfix Array',
			backgroundColor: 'Background-Color : white',
			font: 'Font-Family : Verdana',
			color: 'Font-Color : black',
			fontSize: 14,
			minMaxPresence: false,
			checkBoxState: false,
			//variables for individuals	
			colorList: ['red', 'orange', 'blue', 'green', 'black', 'white', 'transparent'],
			fontList: ['Font-Family : Arial', 'Font-Family : Impact', 'Font-Family : Times New Roman', 'Font-Family : Verdana', 'Font-Family : Tahoma'],//variables with respect to items visibility as per Object type
			imageProp: false,
			widthHeightShow: false,
			radiusShow: false,
			zoomShow: false,
			listShow: false,
			minShow: true,
			checkBoxShow: false,
			custButtonLabel: 'Map',
			gaugeShow: false,
			textBox: false,
			units: '',
			pageUrl: '',
			dpList: []
		};
	};

	/**
	 * Function that initializes the buttons to the normal state
	 */
	$scope.initializePropButtons = function () {
		$scope.propertyPanel.generalButtonStyle = {
			'color': 'hsla(43, 100%, 50%, 1.0)',
			'background-color': '#000',
			'border': '5px solid hsla(43, 100%, 50%, 1.0)'
		};
		$scope.propertyPanel.specialButtonStyle = {
			'color': 'hsla(43, 100%, 50%, 1.0)',
			'background-color': '#000',
			'border': '5px solid hsla(43, 100%, 50%, 1.0)'
		};
		$scope.propertyPanel.dpButtonStyle = {
			'color': 'hsla(43, 100%, 50%, 1.0)',
			'background-color': '#000',
			'border': '5px solid hsla(43, 100%, 50%, 1.0)'
		};
		$scope.propertyPanel.shapeButtonStyle = {
			'color': 'hsla(43, 100%, 50%, 1.0)',
			'background-color': '#000',
			'border': '5px solid hsla(43, 100%, 50%, 1.0)'
		};
		$scope.propertyPanel.fontButtonStyle = {
			'color': 'hsla(43, 100%, 50%, 1.0)',
			'background-color': '#000',
			'border': '5px solid hsla(43, 100%, 50%, 1.0)'
		};
		$scope.propertyPanel.bgButtonStyle = {
			'color': 'hsla(43, 100%, 50%, 1.0)',
			'background-color': '#000',
			'border': '5px solid hsla(43, 100%, 50%, 1.0)'
		};
		$scope.propertyPanel.connectionButtonStyle = {
			'color': 'hsla(43, 100%, 50%, 1.0)',
			'background-color': '#000',
			'border': '5px solid hsla(43, 100%, 50%, 1.0)'
		};
		$scope.propertyPanel.generalShow = false;
		$scope.propertyPanel.fontShow = false;
		$scope.propertyPanel.shapeShow = false;
		$scope.propertyPanel.dpShow = false;
		$scope.propertyPanel.specialShow = false;
		$scope.propertyPanel.bgShow = false;
		$scope.propertyPanel.connectionShow = false;
	}

	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	//:::::::::::::::::::::::::::::::Balaji:::::::::::::::::::::::::::::

	//-------------------------------Socket Functions-------------------

	// Initially contatct the initial configuration socket for getting the each individual type data points
	// The reply will also be using socket.io
	socket.emit('initialConfig', {
		'hi': 'hello',
	});

	//All data point socket
	socket.on('all_DataPoint', function (data) {
		$scope.allDP = data;
	});

	// Socket Function which makes the property panel visible
	socket.on('panel_Visibility_OnClick', function (data) {
		$scope.propertyPanel.panel = false;
		$scope.propertyPanel.minimize = false;
	});

	// Socket Function which makes the property panel visible and assign the default values
	socket.on('panel_Visibility', function (data) {
		$scope.initializeProperyitems();
		$scope.propertyPanel.panel = true;
		$scope.propertyPanel.minimize = false;
		for (i = 0; len = $scope.objectDetails.length, i < len; i++) {
			//Check the element Id and assign the properties to the options in properties panel
			//If the property has already been assigned earlier it displays them elase it displays the default values.
			if ($scope.objectDetails[i].id === "\"" + data.elementId + "\"") {
				$scope.propertyPanel.parent = "Parent : " + $scope.objectDetails[i].parent;
				//TODO:replace Temproary
				k = i;
				$scope.generatePropDP();
				//TODO:replace Temproary
				i = k;
				$scope.propertyPanel.dataPoint = "DP : " + $scope.objectDetails[i].dataPoint;
				//Whatever the object maybe, it always has an General 'name' element
				$scope.propertyPanel.name = $scope.objectDetails[i].name;
				$scope.propertyPanel.generalOption = true;
				$scope.propertyPanel.connectionOption = true;
				$scope.propertyPanel.pageUrl = $scope.objectDetails[i].pageUrl;
				$scope.showGeneral();
				switch ($scope.objectDetails[i].objectId) {
					case 'label':
						//Incase of label enable just the font and BackGround properties. As it will not have any special DPs
						$scope.propertyPanel.fontOption = true;
						$scope.propertyPanel.bgOption = true;
						//Defaultly General Tab will be shown 						
						$scope.propertyPanel.font = "Font-Family : " + $scope.objectDetails[i].font;
						$scope.propertyPanel.fontSize = parseInt($scope.objectDetails[i].fontSize.replace("px", ""));
						$scope.propertyPanel.color = "Font-Color : " + $scope.objectDetails[i].color;
						$scope.propertyPanel.backgroundColor = "Background-Color : " + $scope.objectDetails[i].backgroundColor;
						break;
					case 'panel':
						$scope.propertyPanel.bgOption = true;
						$scope.propertyPanel.backgroundColor = "Background-Color : " + $scope.objectDetails[i].backgroundColor;
						break;
					case 'textBox':
						//Incase of textbox enable font properties, DP and special properties. As it will not have any special DPs
						$scope.propertyPanel.fontOption = true;
						$scope.propertyPanel.bgOption = true;
						$scope.propertyPanel.dpOption = true;
						$scope.propertyPanel.specialOption = true;
						$scope.propertyPanel.textBox = true;
						$scope.propertyPanel.minMaxPresence = true;
						$scope.propertyPanel.checkBoxShow = $scope.objectDetails[i].checkBoxState;
						$scope.propertyPanel.checkBoxLabel = 'Just Value';
						$scope.propertyPanel.nomLabel = 'Highest Value';
						$scope.propertyPanel.maxLabel = 'Maximum %';
						$scope.propertyPanel.minLabel = 'Minimum %';
						$scope.propertyPanel.checkBoxState = $scope.objectDetails[i].checkBoxState;
						$scope.propertyPanel.font = "Font-Family : " + $scope.objectDetails[i].font;
						$scope.propertyPanel.fontSize = parseInt($scope.objectDetails[i].fontSize.replace("px", ""));
						$scope.propertyPanel.color = "Font-Color : " + $scope.objectDetails[i].color;
						$scope.propertyPanel.backgroundColor = "Background-Color : " + $scope.objectDetails[i].backgroundColor;
						$scope.propertyPanel.nomValue = $scope.objectDetails[i].nomValue;
						$scope.propertyPanel.nomColor = 'Nom-Color : ' + $scope.objectDetails[i].nomColor;
						$scope.propertyPanel.maxValue = $scope.objectDetails[i].maxValue;
						$scope.propertyPanel.maxColor = 'Max-Color : ' + $scope.objectDetails[i].maxColor;
						$scope.propertyPanel.minValue = $scope.objectDetails[i].minValue;
						$scope.propertyPanel.minColor = 'Min-Color : ' + $scope.objectDetails[i].minColor;
						break;
					case 'listBox':
						$scope.propertyPanel.fontOption = true;
						$scope.propertyPanel.bgOption = true;
						$scope.propertyPanel.dpOption = true;
						$scope.propertyPanel.specialOption = true;
						$scope.propertyPanel.listShow = true;
						if (!$scope.objectDetails[i].typeMap) {
							$scope.propertyPanel.custButtonLabel = 'Map';
							$scope.propertyPanel.checkBoxShow = true;
							$scope.propertyPanel.minMaxPresence = false;
						} else {
							$scope.propertyPanel.custButtonLabel = 'Array';
							$scope.propertyPanel.checkBoxShow = false;
							$scope.propertyPanel.minMaxPresence = true;
						}
						$scope.propertyPanel.maxLabel = 'Success Pos Value';
						$scope.propertyPanel.minLabel = 'Danger Pos Value';
						$scope.propertyPanel.nomLabel = 'Normal Pos Value';
						$scope.propertyPanel.maxColorLabel = 'Success-Color';
						$scope.propertyPanel.minColorLabel = 'Danger-Color';
						$scope.propertyPanel.nomColorLabel = 'Normal-Color';
						$scope.propertyPanel.color = 'Font-Color : ' + $scope.objectDetails[i].color;
						$scope.propertyPanel.font = 'Font-Family : ' + $scope.objectDetails[i].font;
						$scope.propertyPanel.fontSize = parseInt($scope.objectDetails[i].fontSize.replace("px", ""));
						$scope.propertyPanel.rowSelectionShow = !$scope.objectDetails[i].typeMap;
						$scope.propertyPanel.backgroundColor = 'Background-Color : ' + $scope.objectDetails[i].backgroundColor;
						$scope.propertyPanel.minMaxShow = $scope.objectDetails[i].minMaxPresence;
						$scope.propertyPanel.nomValue = $scope.objectDetails[i].nomValue;
						$scope.propertyPanel.maxColor = 'Success-Color : ' + $scope.objectDetails[i].maxColor;
						$scope.propertyPanel.maxValue = $scope.objectDetails[i].maxValue;
						$scope.propertyPanel.minColor = 'Danger-Color : ' + $scope.objectDetails[i].minColor;
						$scope.propertyPanel.minValue = $scope.objectDetails[i].minValue;
						$scope.propertyPanel.nomColor = 'Normal-Color : ' + $scope.objectDetails[i].nomColor;
						break;
					case 'image':
						$scope.propertyPanel.bgOption = true;
						$scope.propertyPanel.shapeOption = true;
						$scope.propertyPanel.imageProp = true;
						$scope.propertyPanel.widthHeightShow = true;
						$scope.propertyPanel.url = $scope.objectDetails[i].url;
						//Before assigning the value for degree from the object array, it si first checked what is the div element value
						//The reason being that the user may just rotate and may not click on OK and when he again looks for the property, it will be 0 since it will be assigned form the object array
						//Hence it is first got from the div element. Incase the Div element transform is empty, then it is given as zero. 
						var parentElement = angular.element(document.getElementById(data.elementId));
						var transform = parentElement[0].style.transform;
						if (transform !== '') {
							$scope.propertyPanel.degree = parseInt(transform.substring(transform.indexOf("(") + 1, transform.indexOf("deg)")));
						} else {
							$scope.propertyPanel.degree = 0;
						}
						//get the current width and height after resizing and store it to the object details
						var currHeight = parentElement[0].style.height;
						var currWidth = parentElement[0].style.width;
						if (currWidth != '') {
							$scope.objectDetails[i].width = currWidth;
							$scope.propertyPanel.width = parseInt(currWidth.replace("px", ""));
						}
						if (currHeight != '') {
							$scope.objectDetails[i].height = currHeight;
							$scope.propertyPanel.height = parseInt(currHeight.replace("px", ""));
						}
						break;
					case 'svg-square':
						$scope.propertyPanel.bgOption = true;
						$scope.propertyPanel.dpOption = true;
						$scope.propertyPanel.shapeOption = true;
						$scope.propertyPanel.widthHeightShow = true;
						$scope.propertyPanel.specialOption = true;
						$scope.propertyPanel.minMaxPresence = true;
						$scope.propertyPanel.checkBoxShow = $scope.objectDetails[i].checkBoxState;
						$scope.propertyPanel.checkBoxLabel = 'Just Panel';
						$scope.propertyPanel.nomLabel = 'Nominal Value';
						$scope.propertyPanel.maxLabel = 'Danger Value';
						$scope.propertyPanel.nomColorLabel = 'Nom-Color';
						$scope.propertyPanel.maxColorLabel = 'Danger-Color';
						$scope.propertyPanel.minShow = false;
						$scope.propertyPanel.backgroundColor = "Background-Color : " + $scope.objectDetails[i].backgroundColor;
						$scope.propertyPanel.checkBoxState = $scope.objectDetails[i].checkBoxState;
						$scope.propertyPanel.width = $scope.objectDetails[i].width;
						$scope.propertyPanel.height = $scope.objectDetails[i].height;
						$scope.propertyPanel.nomColor = 'Nom-Color : ' + $scope.objectDetails[i].nomColor;
						$scope.propertyPanel.maxColor = 'Danger-Color : ' + $scope.objectDetails[i].maxColor;
						//Before assigning the value for degree from the object array, it si first checked what is the div element value
						//The reason being that the user may just rotate and may not click on OK and when he again looks for the property, it will be 0 since it will be assigned form the object array
						//Hence it is first got from the div element. Incase the Div element transform is empty, then it is given as zero. 
						var transform = angular.element(document.getElementById(data.elementId))[0].style.transform;
						if (transform !== '') {
							$scope.propertyPanel.degree = parseInt(transform.substring(transform.indexOf("(") + 1, transform.indexOf("deg)")));
						} else {
							$scope.propertyPanel.degree = 0;
						}
						break;
					case 'svg-circle':
						$scope.propertyPanel.bgOption = true;
						$scope.propertyPanel.dpOption = true;
						$scope.propertyPanel.shapeOption = true;
						$scope.propertyPanel.radiusShow = true;
						$scope.propertyPanel.specialOption = true;
						$scope.propertyPanel.minMaxPresence = true;
						$scope.propertyPanel.checkBoxShow = $scope.objectDetails[i].checkBoxState;
						$scope.propertyPanel.checkBoxLabel = 'Just Panel';
						$scope.propertyPanel.nomLabel = 'Nominal Value';
						$scope.propertyPanel.maxLabel = 'Danger Value';
						$scope.propertyPanel.nomColorLabel = 'Nom-Color';
						$scope.propertyPanel.maxColorLabel = 'Danger-Color';
						$scope.propertyPanel.minShow = false;
						$scope.propertyPanel.backgroundColor = "Background-Color : " + $scope.objectDetails[i].backgroundColor;
						$scope.propertyPanel.checkBoxState = $scope.objectDetails[i].checkBoxState;
						$scope.propertyPanel.radius = $scope.objectDetails[i].radius;
						$scope.propertyPanel.nomColor = 'Nom-Color : ' + $scope.objectDetails[i].nomColor;
						$scope.propertyPanel.maxColor = 'Danger-Color : ' + $scope.objectDetails[i].maxColor;
						//Before assigning the value for degree from the object array, it si first checked what is the div element value
						//The reason being that the user may just rotate and may not click on OK and when he again looks for the property, it will be 0 since it will be assigned form the object array
						//Hence it is first got from the div element. Incase the Div element transform is empty, then it is given as zero. 
						var transform = angular.element(document.getElementById(data.elementId))[0].style.transform;
						if (transform !== '') {
							$scope.propertyPanel.degree = parseInt(transform.substring(transform.indexOf("(") + 1, transform.indexOf("deg)")));
						} else {
							$scope.propertyPanel.degree = 0;
						}
						break;
					case 'svg-path':
						$scope.propertyPanel.bgOption = true;
						$scope.propertyPanel.dpOption = true;
						$scope.propertyPanel.shapeOption = true;
						$scope.propertyPanel.zoomShow = true;
						$scope.propertyPanel.specialOption = true;
						$scope.propertyPanel.minMaxPresence = true;
						$scope.propertyPanel.checkBoxShow = $scope.objectDetails[i].checkBoxState;
						$scope.propertyPanel.checkBoxLabel = 'Just Panel';
						$scope.propertyPanel.nomLabel = 'Nominal Value';
						$scope.propertyPanel.maxLabel = 'Danger Value';
						$scope.propertyPanel.nomColorLabel = 'Nom-Color';
						$scope.propertyPanel.maxColorLabel = 'Danger-Color';
						$scope.propertyPanel.backgroundColor = "Background-Color : " + $scope.objectDetails[i].backgroundColor;
						$scope.propertyPanel.minShow = false;
						$scope.propertyPanel.checkBoxState = $scope.objectDetails[i].checkBoxState;
						$scope.propertyPanel.zoom = $scope.objectDetails[i].zoom;
						$scope.propertyPanel.nomColor = 'Nom-Color : ' + $scope.objectDetails[i].nomColor;
						$scope.propertyPanel.maxColor = 'Danger-Color : ' + $scope.objectDetails[i].maxColor;
						//Before assigning the value for degree from the object array, it si first checked what is the div element value
						//The reason being that the user may just rotate and may not click on OK and when he again looks for the property, it will be 0 since it will be assigned form the object array
						//Hence it is first got from the div element. Incase the Div element transform is empty, then it is given as zero. 
						var transform = angular.element(document.getElementById(data.elementId))[0].style.transform;
						if (transform !== '') {
							$scope.propertyPanel.degree = parseInt(transform.substring(transform.indexOf("(") + 1, transform.indexOf("deg)")));
						} else {
							$scope.propertyPanel.degree = 0;
						}
						break;
					case 'gauge-1':
						$scope.propertyPanel.fontOption = true;
						$scope.propertyPanel.specialOption = true;
						$scope.propertyPanel.dpOption = true;
						$scope.propertyPanel.gaugeShow = true;
						$scope.propertyPanel.font = "Font-Family : " + $scope.objectDetails[i].font;
						$scope.propertyPanel.fontSize = parseInt($scope.objectDetails[i].fontSize.replace("px", ""));
						$scope.propertyPanel.color = "Font-Color : " + $scope.objectDetails[i].color;
						$scope.propertyPanel.units = $scope.objectDetails[i].units;
						var parentElement = angular.element(document.getElementById(data.elementId));
						//get the current width and height after resizing and store it to the object details
						var currHeight = parentElement[0].style.height;
						var currWidth = parentElement[0].style.width;
						if (currWidth != '') {
							$scope.objectDetails[i].width = currWidth;
						}
						if (currHeight != '') {
							$scope.objectDetails[i].height = currHeight;
						}
						break;
					case 'gauge-2':
						$scope.propertyPanel.fontOption = true;
						$scope.propertyPanel.specialOption = true;
						$scope.propertyPanel.dpOption = true;
						$scope.propertyPanel.gaugeShow = true;
						$scope.propertyPanel.font = "Font-Family : " + $scope.objectDetails[i].font;
						$scope.propertyPanel.fontSize = parseInt($scope.objectDetails[i].fontSize.replace("px", ""));
						$scope.propertyPanel.color = "Font-Color : " + $scope.objectDetails[i].color;
						$scope.propertyPanel.units = $scope.objectDetails[i].units;
						var parentElement = angular.element(document.getElementById(data.elementId));
						//get the current width and height after resizing and store it to the object details
						var currHeight = parentElement[0].style.height;
						var currWidth = parentElement[0].style.width;
						if (currWidth != '') {
							$scope.objectDetails[i].width = currWidth;
						}
						if (currHeight != '') {
							$scope.objectDetails[i].height = currHeight;
						}
						break;
					case 'gauge-3':
						$scope.propertyPanel.dpOption = true;
						$scope.propertyPanel.specialOption = true;
						$scope.propertyPanel.minMaxPresence = true;
						$scope.propertyPanel.gaugeShow = true;
						$scope.propertyPanel.nomLabel = 'Nom-Value (Not required)';
						$scope.propertyPanel.minLabel = 'Min-Value-Start';
						$scope.propertyPanel.maxLabel = 'Max-Value-Start';
						$scope.propertyPanel.units = $scope.objectDetails[i].units;
						$scope.propertyPanel.nomValue = $scope.objectDetails[i].nomValue;
						$scope.propertyPanel.nomColor = 'Nom-Color : ' + $scope.objectDetails[i].nomColor;
						$scope.propertyPanel.maxValue = $scope.objectDetails[i].maxValue;
						$scope.propertyPanel.maxColor = 'Max-Color : ' + $scope.objectDetails[i].maxColor;
						$scope.propertyPanel.minValue = $scope.objectDetails[i].minValue;
						$scope.propertyPanel.minColor = 'Min-Color : ' + $scope.objectDetails[i].minColor;
						var parentElement = angular.element(document.getElementById(data.elementId));
						//get the current width and height after resizing and store it to the object details
						var currHeight = parentElement[0].style.height;
						var currWidth = parentElement[0].style.width;
						if (currWidth != '') {
							$scope.objectDetails[i].width = currWidth;
						}
						if (currHeight != '') {
							$scope.objectDetails[i].height = currHeight;
						}
						break;
					case 'bar-chart':
						$scope.propertyPanel.dpOption = true;
						var parentElement = angular.element(document.getElementById(data.elementId));
						//get the current width and height after resizing and store it to the object details
						var currHeight = parentElement[0].style.height;
						var currWidth = parentElement[0].style.width;
						if (currWidth != '') {
							$scope.objectDetails[i].width = currWidth;
						}
						if (currHeight != '') {
							$scope.objectDetails[i].height = currHeight;
						}
						break;
					case 'line-chart':
						$scope.propertyPanel.dpOption = true;
						var parentElement = angular.element(document.getElementById(data.elementId));
						//get the current width and height after resizing and store it to the object details
						var currHeight = parentElement[0].style.height;
						var currWidth = parentElement[0].style.width;
						if (currWidth != '') {
							$scope.objectDetails[i].width = currWidth;
						}
						if (currHeight != '') {
							$scope.objectDetails[i].height = currHeight;
						}
						break;
					case 'candle-chart':
						$scope.propertyPanel.dpOption = true;
						var parentElement = angular.element(document.getElementById(data.elementId));
						//get the current width and height after resizing and store it to the object details
						var currHeight = parentElement[0].style.height;
						var currWidth = parentElement[0].style.width;
						if (currWidth != '') {
							$scope.objectDetails[i].width = currWidth;
						}
						if (currHeight != '') {
							$scope.objectDetails[i].height = currHeight;
						}
						break;
					case 'ver-bar-chart':
						$scope.propertyPanel.dpOption = true;
						var parentElement = angular.element(document.getElementById(data.elementId));
						//get the current width and height after resizing and store it to the object details
						var currHeight = parentElement[0].style.height;
						var currWidth = parentElement[0].style.width;
						if (currWidth != '') {
							$scope.objectDetails[i].width = currWidth;
						}
						if (currHeight != '') {
							$scope.objectDetails[i].height = currHeight;
						}
						break;
				}
			}
		}
		$scope.currentObject = data.elementId;
	});

	socket.on('creation_Success', function (data) {
		$scope.createPanelClose();
		$window.open('http://localhost:8080/' + data.pageId);
	});

	//------------------------------------------------------------------



	//----------------------General Functions (Accessed by Javascript)------------------

	//Function which sets the background

	$scope.objectProperties.finalHtml = "<div id='backgroundDiv' class='ScreenAdj' style='background-image:url(" + $scope.imagepath + ");'></div>";
	$scope.objectProperties.objectId = "background";
	$scope.objectDetails.push($scope.objectProperties);

	//Function which adds the dragged objects to the objectDetails array
	$scope.addObject = function (data) {
		$scope.initializeObjectProperties();
		dummyflag = false;
		//Check if the object exists and enable the flag 
		for (i = 0; addObjLen = 0, addObjLen = $scope.objectDetails.length, i < addObjLen; i++) {
			if ($scope.objectDetails[i].id === data.id) {
				dummyflag = true;
			}
		}
		// if the object is not ther then add it with the properties obtained from the java script json
		if (!dummyflag) {
			$scope.objectProperties.id = String(data.id);
			$scope.objectProperties.objectId = data.objectId;
			$scope.objectProperties.html = data.currentHtml;
			$scope.objectProperties.originalHtml = data.objectHtml;
			$scope.objectProperties.objectHtml = data.objectHtml;
			$scope.objectProperties.posX = data.positionX;
			$scope.objectProperties.posY = data.positionY;
			$scope.objectProperties.dataType = data.dataType;
			$scope.objectDetails.push($scope.objectProperties);
		}
	};

	//Function which deletes the objects
	$scope.deleteObject = function (data) {
		var index = -1;
		var dataElement = angular.element(data);
		for (i = 0; len = $scope.objectDetails.length, i < len; i++) {
			//Check the element Id and assign the properties to the options in properties panel
			//If the property has already been assigned earlier it displays them elase it displays the default values.
			if ($scope.objectDetails[i].id === "\"" + dataElement[0].id + "\"") {
				index = i;
			}
		}
		//Removing the element from array
		if (index > -1) {
			$scope.objectDetails.splice(index, 1);
		}
	};

	//Function which modify the Object detail properties when it is moven in the HTML
	$scope.objectMoved = function (data) {
		for (i = 0; len = $scope.objectDetails.length, i < len; i++) {
			//Get the latest position of the object and add them to the Object Detail arrays final elements
			if ($scope.objectDetails[i].id === "\"" + data.currentId + "\"") {
				$scope.objectDetails[i].posX = data.positionX;
				$scope.objectDetails[i].posY = data.positionY;
				if ($scope.objectDetails[i].finalHtml != '') {
					var finalElement = angular.element($scope.objectDetails[i].finalHtml);
					finalElement[0].style.left = $scope.objectDetails[i].posX;
					finalElement[0].style.top = $scope.objectDetails[i].posY;
					$scope.objectDetails[i].finalHtml = finalElement[0].outerHTML;
				}
			}
		}
	};

	//------------------------------------------------------------------------------------

	//-----------------------------Tab Alert Function-------------------

	// Function that generates alert when the Object Tab is clicked				
	$scope.tabAlert = function () {
		setTimeout(function () {
			$window.alert('The Objects will be displayed based on the Datapoint you select');
		});
	};

	//------------------------------------------------------------------

	//-----------------------------Object left Panel Functions-------------------

	// Function that generates the list of Data points based on the parent (Phase) selection				
	$scope.generateDP = function () {
		$scope.dpSelectPanel.dpList.length = 0;
		if ($scope.dpSelectPanel.parentSelect !== '') {
			for (i = 0; len = $scope.allDP.length, len > i; i++) {
				if ($scope.allDP[i].id === $scope.dpSelectPanel.parentSelect) {
					$scope.dpSelectPanel.dpList = Object.keys($scope.allDP[i].data);
				}
			}
		}
	};


	// Function that generates the list of Objects based on the DataPoint selection				
	$scope.generateObject = function () {
		if (($scope.dpSelectPanel.parentSelect !== '') && ($scope.dpSelectPanel.dpSelect !== '')) {
			for (i = 0; len = $scope.allDP.length, len > i; i++) {
				if ($scope.allDP[i].id === $scope.dpSelectPanel.parentSelect) {
					switch ($scope.allDP[i].data[$scope.dpSelectPanel.dpSelect]) {
						case 'boolean':
							$scope.initializeObjectDisplay();
							$scope.dpSelectPanel.booleanShow = true;
							break;
						case 'integer':
							$scope.initializeObjectDisplay();
							$scope.dpSelectPanel.integerShow = true;
							break;
						case 'string':
							$scope.initializeObjectDisplay();
							$scope.dpSelectPanel.doubleShow = true;
							break;
						case 'double':
							$scope.initializeObjectDisplay();
							$scope.dpSelectPanel.longShow = true;
							break;
						case 'long':
							$scope.initializeObjectDisplay();
							$scope.dpSelectPanel.stringShow = true;
							break;
						case 'array(string)':
							$scope.initializeObjectDisplay();
							$scope.dpSelectPanel.arrayShow = true;
							break;
						case 'map':
							$scope.initializeObjectDisplay();
							$scope.dpSelectPanel.mapShow = true;
							break;
						case 'verBarChart':
							$scope.initializeObjectDisplay();
							$scope.dpSelectPanel.verBarChartShow = true;
							break;
						case 'candleChart':
							$scope.initializeObjectDisplay();
							$scope.dpSelectPanel.candleChartShow = true;
							break;
						case 'barChart':
							$scope.initializeObjectDisplay();
							$scope.dpSelectPanel.barChartShow = true;
							break;
						default:
							$scope.initializeObjectDisplay();
							break;
					}
				}
			}
		}
	};

	//------------------------------------------------------------------

	//----------------------------Overview Panel Functions------------------------

	$scope.overviewPanelClose = function () {
		$scope.initialPanel = false;
	}

	//-----------------------------------------------------------------------------

	//-----------------------------left Panel Functions-------------------

	//Function that shows or hides the grid depending upon the user requirements
	$scope.showHideGrid = function () {
		if ($scope.gridDetails.hide) {
			$scope.dropTargetOne.style = {};
			$scope.gridDetailsnomValue = 'Show Grid';
		} else {
			$scope.dropTargetOne.style = {
				'background-color': 'transparent',
				'background-image': 'linear-gradient(0deg, transparent 24%, ' + $scope.gridDetails.color + ' 25%, ' + $scope.gridDetails.color + ' 26%, transparent 27%, transparent 74%, ' + $scope.gridDetails.color + ' 75%, ' + $scope.gridDetails.color + ' 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, ' + $scope.gridDetails.color + ' 25%, ' + $scope.gridDetails.color + ' 26%, transparent 27%, transparent 74%, ' + $scope.gridDetails.color + ' 75%, ' + $scope.gridDetails.color + ' 76%, transparent 77%, transparent)',
				'background-size': '30px 30px'
			};
			$scope.gridDetailsnomValue = 'Hide Grid';
		}
	};

	//Function that changes the grid color
	$scope.gridColorChange = function () {
		if ($scope.gridDetails.colorSelect === 'Grid Color: BLACK') {
			$scope.gridDetails.color = 'rgba(0, 0, 0, .20)';
			$scope.dropTargetOne.style = {
				'background-color': 'transparent',
				'background-image': 'linear-gradient(0deg, transparent 24%, ' + $scope.gridDetails.color + ' 25%, ' + $scope.gridDetails.color + ' 26%, transparent 27%, transparent 74%, ' + $scope.gridDetails.color + ' 75%, ' + $scope.gridDetails.color + ' 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, ' + $scope.gridDetails.color + ' 25%, ' + $scope.gridDetails.color + ' 26%, transparent 27%, transparent 74%, ' + $scope.gridDetails.color + ' 75%, ' + $scope.gridDetails.color + ' 76%, transparent 77%, transparent)',
				'background-size': '30px 30px'
			};
		} else {
			$scope.gridDetails.color = 'rgba(255, 255, 255, .20)';
			$scope.dropTargetOne.style = {
				'background-color': 'transparent',
				'background-image': 'linear-gradient(0deg, transparent 24%, ' + $scope.gridDetails.color + ' 25%, ' + $scope.gridDetails.color + ' 26%, transparent 27%, transparent 74%, ' + $scope.gridDetails.color + ' 75%, ' + $scope.gridDetails.color + ' 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, ' + $scope.gridDetails.color + ' 25%, ' + $scope.gridDetails.color + ' 26%, transparent 27%, transparent 74%, ' + $scope.gridDetails.color + ' 75%, ' + $scope.gridDetails.color + ' 76%, transparent 77%, transparent)',
				'background-size': '30px 30px'
			};
		}
	};

	//Function that changes the background image depending on the user configurations
	$scope.setBackground = function () {
		$scope.imagepath = $scope.newimagepath.url;
		$scope.mainPanelStyle = {
			'background': 'url(' + $scope.imagepath + ')',
			'background-size': '100% 100%',
			'background-repeat': 'no-repeat'
		};
		for (i = 0; len = $scope.objectDetails.length, i < len; i++) {
			if ($scope.objectDetails[i].objectId === "background") {
				$scope.objectDetails[i].finalHtml = "<div id='backgroundDiv' class='ScreenAdj' style='background-image:url(" + $scope.imagepath + ");'></div>";
			}
		}

	};

	//----------------------------- Property Panel Functions-------------------

	// Function that generates the list of Data points based on the parent (Phase) selection				
	$scope.generatePropDP = function () {
		$scope.propertyPanel.dpList.length = 0;
		if (($scope.propertyPanel.parent !== '') && ($scope.currentObject !== '')) {
			var objectId = '';
			for (i = 0; len = $scope.objectDetails.length, i < len; i++) {
				if ($scope.objectDetails[i].id === "\"" + $scope.currentObject + "\"") {
					objectId = $scope.objectDetails[i].objectId;
				}
			}
			for (i = 0; len = $scope.allDP.length, len > i; i++) {
				if ("Parent : " + $scope.allDP[i].id === $scope.propertyPanel.parent) {
					switch (objectId) {
						case 'label':
							break;
						case 'textBox':
							var dataPointArray = [];
							dataPointArray = Object.keys($scope.allDP[i].data);
							for (j = 0; lenJ = dataPointArray.length, lenJ > j; j++) {
								if (($scope.allDP[i].data[dataPointArray[j]] === 'string') || ($scope.allDP[i].data[dataPointArray[j]] === 'integer') || ($scope.allDP[i].data[dataPointArray[j]] === 'double') || ($scope.allDP[i].data[dataPointArray[j]] === 'long')) {
									$scope.propertyPanel.dpList.push(dataPointArray[j]);
								}
							}
							break;
						case 'listBox':
							var dataPointArray = [];
							dataPointArray = Object.keys($scope.allDP[i].data);
							for (j = 0; lenJ = dataPointArray.length, lenJ > j; j++) {
								if ($scope.propertyPanel.custButtonLabel === 'Map') {
									if ($scope.allDP[i].data[dataPointArray[j]] === 'array(string)') {
										$scope.propertyPanel.dpList.push(dataPointArray[j]);
									}
								} else if ($scope.propertyPanel.custButtonLabel === 'Array') {
									if (
										$scope.allDP[i].data[dataPointArray[j]] === 'map') {
										$scope.propertyPanel.dpList.push(dataPointArray[j]);
									}
								}
							}
							break;
						case 'svg-square':
							var dataPointArray = [];
							dataPointArray = Object.keys($scope.allDP[i].data);
							for (j = 0; lenJ = dataPointArray.length, lenJ > j; j++) {
								if (($scope.allDP[i].data[dataPointArray[j]] === 'boolean')) {
									$scope.propertyPanel.dpList.push(dataPointArray[j]);
								}
							}
							break;
						case 'svg-circle':
							var dataPointArray = [];
							dataPointArray = Object.keys($scope.allDP[i].data);
							for (j = 0; lenJ = dataPointArray.length, lenJ > j; j++) {
								if (($scope.allDP[i].data[dataPointArray[j]] === 'boolean')) {
									$scope.propertyPanel.dpList.push(dataPointArray[j]);
								}
							}
							break;
						case 'svg-path':
							var dataPointArray = [];
							dataPointArray = Object.keys($scope.allDP[i].data);
							for (j = 0; lenJ = dataPointArray.length, lenJ > j; j++) {
								if (($scope.allDP[i].data[dataPointArray[j]] === 'boolean')) {
									$scope.propertyPanel.dpList.push(dataPointArray[j]);
								}
							}
							break;
						case 'gauge-1':
							var dataPointArray = [];
							dataPointArray = Object.keys($scope.allDP[i].data);
							for (j = 0; lenJ = dataPointArray.length, lenJ > j; j++) {
								if (($scope.allDP[i].data[dataPointArray[j]] === 'double') || ($scope.allDP[i].data[dataPointArray[j]] === 'integer')) {
									$scope.propertyPanel.dpList.push(dataPointArray[j]);
								}
							}
							break;
						case 'gauge-2':
							var dataPointArray = [];
							dataPointArray = Object.keys($scope.allDP[i].data);
							for (j = 0; lenJ = dataPointArray.length, lenJ > j; j++) {
								if (($scope.allDP[i].data[dataPointArray[j]] === 'double') || ($scope.allDP[i].data[dataPointArray[j]] === 'integer')) {
									$scope.propertyPanel.dpList.push(dataPointArray[j]);
								}
							}
							break;
						case 'gauge-3':
							var dataPointArray = [];
							dataPointArray = Object.keys($scope.allDP[i].data);
							for (j = 0; lenJ = dataPointArray.length, lenJ > j; j++) {
								if (($scope.allDP[i].data[dataPointArray[j]] === 'double') || ($scope.allDP[i].data[dataPointArray[j]] === 'integer')) {
									$scope.propertyPanel.dpList.push(dataPointArray[j]);
								}
							}
							break;
						case 'bar-chart':
							var dataPointArray = [];
							dataPointArray = Object.keys($scope.allDP[i].data);
							for (j = 0; lenJ = dataPointArray.length, lenJ > j; j++) {
								if (($scope.allDP[i].data[dataPointArray[j]] === 'barChart')) {
									$scope.propertyPanel.dpList.push(dataPointArray[j]);
								}
							}
							break;
						case 'line-chart':
							var dataPointArray = [];
							dataPointArray = Object.keys($scope.allDP[i].data);
							for (j = 0; lenJ = dataPointArray.length, lenJ > j; j++) {
								if (($scope.allDP[i].data[dataPointArray[j]] === 'candleChart')) {
									$scope.propertyPanel.dpList.push(dataPointArray[j]);
								}
							}
							break;
						case 'candle-chart':
							var dataPointArray = [];
							dataPointArray = Object.keys($scope.allDP[i].data);
							for (j = 0; lenJ = dataPointArray.length, lenJ > j; j++) {
								if (($scope.allDP[i].data[dataPointArray[j]] === 'candleChart')) {
									$scope.propertyPanel.dpList.push(dataPointArray[j]);
								}
							}
							break;
						case 'ver-bar-chart':
							var dataPointArray = [];
							dataPointArray = Object.keys($scope.allDP[i].data);
							for (j = 0; lenJ = dataPointArray.length, lenJ > j; j++) {
								if (($scope.allDP[i].data[dataPointArray[j]] === 'verBarChart')) {
									$scope.propertyPanel.dpList.push(dataPointArray[j]);
								}
							}
							break;
						default:
							$scope.propertyPanel.dpList = Object.keys($scope.allDP[i].data);
							break;
					}
				}
			}
		}
	};

	//function that registers the data points to the variable
	$scope.assignProperties = function () {
		if ($scope.currentObject !== '') {
			for (i = 0; len = $scope.objectDetails.length, i < len; i++) {
				if ($scope.objectDetails[i].id === "\"" + $scope.currentObject + "\"") {
					dummyName = 'empty';
					//Assign the selected configuration values to the object details					
					$scope.objectDetails[i].parent = $scope.propertyPanel.parent.replace("Parent : ", "");
					$scope.objectDetails[i].dataPoint = $scope.propertyPanel.dataPoint.replace("DP : ", "");
					$scope.objectDetails[i].name = $scope.propertyPanel.name;
					//Get the Element to get position
					var currentElement = angular.element(document.getElementById($scope.currentObject));
					$scope.objectDetails[i].posX = currentElement[0].style.left;
					$scope.objectDetails[i].posY = currentElement[0].style.top;
					//convert 'ObjectHTML' String to HTML DOM Element
					var htmlElement = angular.element($scope.objectDetails[i].objectHtml);
					$scope.clean(htmlElement[0]);
					if ($scope.propertyPanel.name !== '') {
						dummyName = $scope.propertyPanel.name;
					}
					//Assign values for DOM elements					
					switch ($scope.objectDetails[i].objectId) {
						case 'label':
							$scope.objectDetails[i].font = $scope.propertyPanel.font.replace("Font-Family : ", "");
							$scope.objectDetails[i].color = $scope.propertyPanel.color.replace("Font-Color : ", "");
							$scope.objectDetails[i].backgroundColor = $scope.propertyPanel.backgroundColor.replace("Background-Color : ", "");
							$scope.objectDetails[i].fontSize = $scope.propertyPanel.fontSize + "px";
							//Label Assigns Name, color and Font family
							htmlElement[0].innerHTML = dummyName;
							htmlElement[0].style.fontFamily = $scope.objectDetails[i].font;
							htmlElement[0].style.color = $scope.objectDetails[i].color;
							htmlElement[0].style.fontSize = $scope.objectDetails[i].fontSize;
							htmlElement[0].style.backgroundColor = $scope.objectDetails[i].backgroundColor;
							//Generate the Final HTML
							var finalElement = angular.element(htmlElement[0].outerHTML);
							finalElement[0].style.outline = null;
							finalElement[0].setAttribute("class", "ScreenAdj");
							finalElement[0].style.left = $scope.objectDetails[i].posX;
							finalElement[0].style.top = $scope.objectDetails[i].posY;
							finalElement[0].style.position = 'absolute';
							$scope.objectDetails[i].finalHtml = finalElement[0].outerHTML;
							break;
						case 'panel':
							$scope.objectDetails[i].backgroundColor = $scope.propertyPanel.backgroundColor.replace("Background-Color : ", "");
							$scope.objectDetails[i].width = currentElement[0].style.width;
							$scope.objectDetails[i].height = currentElement[0].style.height;
							htmlElement[0].style.backgroundColor = $scope.objectDetails[i].backgroundColor;
							var finalElement = angular.element(htmlElement[0].outerHTML);
							finalElement[0].style.outline = null;
							finalElement[0].setAttribute("class", "drag-elements-li ScreenAdj");
							finalElement[0].style.left = $scope.objectDetails[i].posX;
							finalElement[0].style.top = $scope.objectDetails[i].posY;
							finalElement[0].style.width = $scope.objectDetails[i].width;
							finalElement[0].style.height = $scope.objectDetails[i].height;
							finalElement[0].style.position = 'absolute';
							$scope.objectDetails[i].finalHtml = finalElement[0].outerHTML;
							break;
						case 'textBox':
							$scope.objectDetails[i].font = $scope.propertyPanel.font.replace("Font-Family : ", "");
							$scope.objectDetails[i].color = $scope.propertyPanel.color.replace("Font-Color : ", "");
							$scope.objectDetails[i].fontSize = $scope.propertyPanel.fontSize + "px";
							$scope.objectDetails[i].backgroundColor = $scope.propertyPanel.backgroundColor.replace("Background-Color : ", "");
							//Textbox Assigns properties to DOM
							htmlElement[0].innerHTML = dummyName;
							htmlElement[0].style.fontFamily = $scope.objectDetails[i].font;
							htmlElement[0].style.color = $scope.objectDetails[i].color;
							htmlElement[0].style.fontSize = $scope.objectDetails[i].fontSize;
							$scope.objectDetails[i].checkBoxState = $scope.propertyPanel.checkBoxState;
							if (!$scope.objectDetails[i].checkBoxState) {
								$scope.objectDetails[i].nomValue = $scope.propertyPanel.nomValue;
								$scope.objectDetails[i].maxColor = $scope.propertyPanel.maxColor.replace("Max-Color : ", "");
								$scope.objectDetails[i].maxValue = $scope.propertyPanel.maxValue;
								$scope.objectDetails[i].minColor = $scope.propertyPanel.minColor.replace("Min-Color : ", "");
								$scope.objectDetails[i].minValue = $scope.propertyPanel.minValue;
								$scope.objectDetails[i].nomColor = $scope.propertyPanel.nomColor.replace("Nom-Color : ", "");
							} else {
								htmlElement[0].style.backgroundColor = $scope.objectDetails[i].backgroundColor;
							}
							//Generate the Final HTML
							var finalElement = angular.element(htmlElement[0].outerHTML);
							finalElement[0].setAttribute("class", "ScreenAdj");
							finalElement[0].style.outline = null;
							finalElement[0].style.width = "auto";
							finalElement[0].textContent = "{{" + $scope.objectDetails[i].parent + "." + $scope.objectDetails[i].dataPoint + "}}";
							//if it has a data point assign it to the child element else leave it
							if (!$scope.objectDetails[i].checkBoxState) {
								finalElement[0].setAttribute("fv-label", "");
								finalElement[0].setAttribute("fv-label-nom-color", $scope.objectDetails[i].nomColor);
								finalElement[0].setAttribute("fv-label-max-color", $scope.objectDetails[i].maxColor);
								finalElement[0].setAttribute("fv-label-min-color", $scope.objectDetails[i].minColor);
								finalElement[0].setAttribute("fv-label-range-low", parseInt(($scope.objectDetails[i].minValue / 100) * $scope.propertyPanel.nomValue));
								finalElement[0].setAttribute("fv-label-range-high", parseInt(($scope.objectDetails[i].maxValue / 100) * $scope.propertyPanel.nomValue));
								finalElement[0].setAttribute("fv-label-value", "{{" + $scope.objectDetails[i].parent + "." + $scope.objectDetails[i].dataPoint + "}}");
							}
							finalElement[0].textContent = "{{values." + $scope.objectDetails[i].parent + "." + $scope.objectDetails[i].dataPoint + "}}";
							//Assign position
							finalElement[0].style.left = $scope.objectDetails[i].posX;
							finalElement[0].style.top = $scope.objectDetails[i].posY;
							finalElement[0].style.position = 'absolute';	
							$scope.objectDetails[i].finalHtml = finalElement[0].outerHTML;
							break;
						case 'image':
							$scope.objectDetails[i].width = $scope.propertyPanel.width + "px";
							$scope.objectDetails[i].height = $scope.propertyPanel.height + "px";
							$scope.objectDetails[i].url = $scope.propertyPanel.url;
							$scope.objectDetails[i].degree = $scope.propertyPanel.degree;
							//Assign image properties to DOM 
							htmlElement[0].src = $scope.objectDetails[i].url;
							htmlElement[0].width = $scope.objectDetails[i].width.replace("px", "");
							htmlElement[0].height = $scope.objectDetails[i].height.replace("px", "");
							//Generate the Final HTML
							var finalElement = angular.element(htmlElement[0].outerHTML);
							finalElement[0].setAttribute("class", "ScreenAdj");
							finalElement[0].style.outline = null;
							finalElement[0].style.left = $scope.objectDetails[i].posX;
							finalElement[0].style.top = $scope.objectDetails[i].posY;
							finalElement[0].style.position = 'absolute';
							finalElement[0].setAttribute("height", $scope.objectDetails[i].height);
							finalElement[0].setAttribute("width", $scope.objectDetails[i].width);
							if ($scope.propertyPanel.degree > 0) {
								finalElement[0].style.mozTransform = 'rotate(' + $scope.propertyPanel.degree + 'deg)';
								finalElement[0].style.webkitTransform = 'rotate(' + $scope.propertyPanel.degree + 'deg)';
								finalElement[0].style.msTransform = 'rotate(' + $scope.propertyPanel.degree + 'deg)';
								finalElement[0].style.OTransform = 'rotate(' + $scope.propertyPanel.degree + 'deg)';
							}
							$scope.objectDetails[i].finalHtml = finalElement[0].outerHTML;
							break;
						case 'listBox':
							$scope.clean(htmlElement[0]);
							$scope.objectDetails[i].font = $scope.propertyPanel.font.replace("Font-Family : ", "");
							$scope.objectDetails[i].color = $scope.propertyPanel.color.replace("Font-Color : ", "");
							$scope.objectDetails[i].backgroundColor = $scope.propertyPanel.backgroundColor.replace("Background-Color : ", "");
							$scope.objectDetails[i].fontSize = $scope.propertyPanel.fontSize + "px";
							$scope.objectDetails[i].rowNos = $scope.propertyPanel.rowNos;
							$scope.objectDetails[i].fixRow = $scope.propertyPanel.checkBoxState;
							//Identify if it is a 'map' or an 'array'
							//After identifying, modify the properties of the DOM element and assign properties to the 'objectDetails' variable 
							if ($scope.propertyPanel.custButtonLabel === 'Map') {
								$scope.objectDetails[i].typeMap = false;
								htmlElement[0].style.backgroundColor = $scope.objectDetails[i].backgroundColor;
								if ((!$scope.objectDetails[i].fixRow) && ($scope.objectDetails[i].rowNos > htmlElement[0].childNodes.length)) {
									var childIncNos = ($scope.objectDetails[i].rowNos - htmlElement[0].childNodes.length);
									for (child = 0; childLen = childIncNos, childLen > child; child++) {
										var node = document.createElement("LI");                 // Create a <li> node
										var textnode = document.createTextNode("Item" + htmlElement[0].childNodes.length);         // Create a text node
										node.appendChild(textnode);                              // Append the text to <li>
										htmlElement[0].appendChild(node);     // Append <li> to <ul> with id="myList"
									}
								} else if ((!$scope.objectDetails[i].fixRow) && ($scope.objectDetails[i].rowNos < htmlElement[0].childNodes.length)) {
									var childIncNos = htmlElement[0].childNodes.length - $scope.objectDetails[i].rowNos;
									for (child = 0; childLen = childIncNos, childLen > child; child++) {
										var node = htmlElement[0].lastChild;
										htmlElement[0].removeChild(node);
									}
								} else if ($scope.objectDetails[i].fixRow) {
									htmlElement = angular.element($scope.objectDetails[i].originalHtml);
								}
							} else if ($scope.propertyPanel.custButtonLabel === 'Array') {
								$scope.objectDetails[i].typeMap = true;
								//Assign property values to the variable
								$scope.objectDetails[i].maxColor = $scope.propertyPanel.maxColor.replace("Success-Color : ", "");
								$scope.objectDetails[i].maxValue = $scope.propertyPanel.maxValue;
								$scope.objectDetails[i].minColor = $scope.propertyPanel.minColor.replace("Danger-Color : ", "");
								$scope.objectDetails[i].minValue = $scope.propertyPanel.minValue;
								$scope.objectDetails[i].nomColor = $scope.propertyPanel.nomColor.replace("Normal-Color : ", "");
								$scope.objectDetails[i].nomValue = $scope.propertyPanel.nomValue;
								//Since there will be no appearence changes to be displayed as in case of 'Map' the original DOM element can besupplkied to the viewer. 
								htmlElement = angular.element($scope.objectDetails[i].originalHtml);
							}
							htmlElement[0].style.fontFamily = $scope.objectDetails[i].font;
							htmlElement[0].style.color = $scope.objectDetails[i].color;
							htmlElement[0].style.fontSize = $scope.objectDetails[i].fontSize + "px";
							//Generate the Final HTML
							var finalElement = angular.element(htmlElement[0].outerHTML);
							finalElement[0].setAttribute("class", "ScreenAdj");
							finalElement[0].style.outline = null;
							finalElement[0].style.width = "auto";
							//Create a new child element
							var liElement = document.createElement("li");
							if ($scope.propertyPanel.custButtonLabel === 'Map') {
								//Assign the angular Data Points 
								if ($scope.propertyPanel.checkBoxState) {
									liElement.setAttribute("ng-repeat", "i in values." + $scope.objectDetails[i].parent + "." + $scope.objectDetails[i].dataPoint);
								} else {
									liElement.setAttribute("ng-repeat", "i in values." + $scope.objectDetails[i].parent + "." + $scope.objectDetails[i].dataPoint + " | limitTo:" + $scope.objectDetails[i].rows);
								}
								liElement.textContent = "{{i}}";
							} else if ($scope.propertyPanel.custButtonLabel === 'Array') {
								//Set ng-repeat as for the number of data in the data point 
								liElement.setAttribute("ng-repeat", "i in values." + $scope.objectDetails[i].parent + "." + $scope.objectDetails[i].dataPoint);
								//Assign all the values.
								liElement.setAttribute("fv-map", "");
								liElement.setAttribute("fv-map-nom-color", $scope.objectDetails[i].nomColor);
								liElement.setAttribute("fv-map-suc-color", $scope.objectDetails[i].maxColor);
								liElement.setAttribute("fv-map-dangr-color", $scope.objectDetails[i].minColor);
								liElement.setAttribute("fv-map-nom-value", $scope.objectDetails[i].nomValue);
								liElement.setAttribute("fv-map-suc-value", $scope.objectDetails[i].maxValue);
								liElement.setAttribute("fv-map-dangr-value", $scope.objectDetails[i].minValue);
								liElement.setAttribute("fv-map-status", "{{i.status}}");
								liElement.style.backgroundColor = "green";
								liElement.style.border = "1px solid black";
								liElement.textContent = "{{i.id}}";
							}
							finalElement[0].innerHTML = liElement.outerHTML;
							var divElement = document.createElement("div");	
							divElement.setAttribute("class", "ScreenAdj");
							//Assign position
							divElement.style.left = $scope.objectDetails[i].posX;
							divElement.style.top = $scope.objectDetails[i].posY;
							divElement.style.position = 'absolute';						
							divElement.innerHTML = finalElement[0].outerHTML;
							$scope.objectDetails[i].finalHtml = divElement.outerHTML;
							break;
						case 'svg-square':
							$scope.objectDetails[i].checkBoxState = $scope.propertyPanel.checkBoxState;
							$scope.objectDetails[i].backgroundColor = $scope.propertyPanel.backgroundColor.replace("Background-Color : ", "");
							$scope.objectDetails[i].width = $scope.propertyPanel.width;
							$scope.objectDetails[i].height = $scope.propertyPanel.height;
							$scope.objectDetails[i].nomColor = $scope.propertyPanel.nomColor.replace("Nom-Color : ", "");
							$scope.objectDetails[i].maxColor = $scope.propertyPanel.maxColor.replace("Danger-Color : ", "");
							$scope.objectDetails[i].degree = $scope.propertyPanel.degree;
							// Incase of the SVG element , the transform has to be added to the SVG box inorder to make them rotatable
							if ($scope.objectDetails[i].degree > 0) {
								htmlElement[0].style.mozTransform = 'rotate(' + $scope.objectDetails[i].degree + 'deg)';
								htmlElement[0].style.webkitTransform = 'rotate(' + $scope.objectDetails[i].degree + 'deg)';
								htmlElement[0].style.msTransform = 'rotate(' + $scope.objectDetails[i].degree + 'deg)';
								htmlElement[0].style.OTransform = 'rotate(' + $scope.objectDetails[i].degree + 'deg)';
							}
							//Initially set the values of the SVG Box
							htmlElement[0].width.baseVal.value = $scope.objectDetails[i].width + 1;
							htmlElement[0].height.baseVal.value = $scope.objectDetails[i].height + 1;
							//Then set the values of svg element
							var innerElement = "<rect width=" + $scope.objectDetails[i].width + " height=" + $scope.objectDetails[i].height + " fill=" + $scope.objectDetails[i].backgroundColor + " />";
							htmlElement[0].innerHTML = innerElement;
							//Generate the Final HTML
							var finalElement = angular.element(htmlElement[0].outerHTML);
							finalElement[0].setAttribute("class", "ScreenAdj");
							finalElement[0].style.outline = null;
							//Assign position
							finalElement[0].style.left = $scope.objectDetails[i].posX;
							finalElement[0].style.top = $scope.objectDetails[i].posY;
							finalElement[0].style.position = 'absolute';
							//if it has a data point assign it to the child element else leave it
							if (!$scope.objectDetails[i].checkBoxState) {
								var childElement = angular.element(finalElement[0].innerHTML);
								childElement[0].setAttribute("fv-svg", "");
								childElement[0].setAttribute("fv-svg-nom-color", $scope.objectDetails[i].nomColor);
								childElement[0].setAttribute("fv-svg-danger-color", $scope.objectDetails[i].maxColor);
								childElement[0].setAttribute("fv-svg-status", "{{values." + $scope.objectDetails[i].parent + "." + $scope.objectDetails[i].dataPoint + "}}");
								finalElement[0].innerHTML = childElement[0].outerHTML;
							}
							$scope.objectDetails[i].finalHtml = finalElement[0].outerHTML;
							break;
						case 'svg-circle':
							$scope.objectDetails[i].checkBoxState = $scope.propertyPanel.checkBoxState;
							$scope.objectDetails[i].backgroundColor = $scope.propertyPanel.backgroundColor.replace("Background-Color : ", "");
							$scope.objectDetails[i].radius = $scope.propertyPanel.radius;
							$scope.objectDetails[i].nomColor = $scope.propertyPanel.nomColor.replace("Nom-Color : ", "");
							$scope.objectDetails[i].maxColor = $scope.propertyPanel.maxColor.replace("Danger-Color : ", "");
							$scope.objectDetails[i].degree = $scope.propertyPanel.degree;
							// Incase of the SVG element , the transform has to be added to the SVG box inorder to make them rotatable
							if ($scope.objectDetails[i].degree > 0) {
								htmlElement[0].style.mozTransform = 'rotate(' + $scope.objectDetails[i].degree + 'deg)';
								htmlElement[0].style.webkitTransform = 'rotate(' + $scope.objectDetails[i].degree + 'deg)';
								htmlElement[0].style.msTransform = 'rotate(' + $scope.objectDetails[i].degree + 'deg)';
								htmlElement[0].style.OTransform = 'rotate(' + $scope.objectDetails[i].degree + 'deg)';
							}
							//Initially set the values of the SVG Box
							htmlElement[0].width.baseVal.value = $scope.objectDetails[i].radius * 2;
							htmlElement[0].height.baseVal.value = $scope.objectDetails[i].radius * 2;
							//Then set the values of svg element
							var innerElement = "<circle cx=" + $scope.objectDetails[i].radius + " cy=" + $scope.objectDetails[i].radius + " r=" + $scope.objectDetails[i].radius + " fill=" + $scope.objectDetails[i].backgroundColor + " />";
							htmlElement[0].innerHTML = innerElement;
							//Generate the Final HTML
							var finalElement = angular.element(htmlElement[0].outerHTML);
							finalElement[0].setAttribute("class", "ScreenAdj");
							//Assign position
							finalElement[0].style.left = $scope.objectDetails[i].posX;
							finalElement[0].style.top = $scope.objectDetails[i].posY;
							finalElement[0].style.position = 'absolute';
							//if it has a data point assign it to the child element else leave it
							if (!$scope.objectDetails[i].checkBoxState) {
								var childElement = angular.element(finalElement[0].innerHTML);
								childElement[0].setAttribute("fv-svg", "");
								childElement[0].setAttribute("fv-svg-nom-color", $scope.objectDetails[i].nomColor);
								childElement[0].setAttribute("fv-svg-danger-color", $scope.objectDetails[i].maxColor);
								childElement[0].setAttribute("fv-svg-status", "{{values." + $scope.objectDetails[i].parent + "." + $scope.objectDetails[i].dataPoint + "}}");
								finalElement[0].innerHTML = childElement[0].outerHTML;
							}
							$scope.objectDetails[i].finalHtml = finalElement[0].outerHTML;
							break;
						case 'svg-path':
							$scope.objectDetails[i].checkBoxState = $scope.propertyPanel.checkBoxState;
							$scope.objectDetails[i].backgroundColor = $scope.propertyPanel.backgroundColor.replace("Background-Color : ", "");
							$scope.objectDetails[i].zoom = $scope.propertyPanel.zoom;
							$scope.objectDetails[i].nomColor = $scope.propertyPanel.nomColor.replace("Nom-Color : ", "");
							$scope.objectDetails[i].maxColor = $scope.propertyPanel.maxColor.replace("Danger-Color : ", "");
							$scope.objectDetails[i].degree = $scope.propertyPanel.degree;
							// Incase of the SVG element , the transform has to be added to the SVG box inorder to make them rotatable
							if ($scope.objectDetails[i].degree > 0) {
								htmlElement[0].style.mozTransform = 'rotate(' + $scope.objectDetails[i].degree + 'deg)';
								htmlElement[0].style.webkitTransform = 'rotate(' + $scope.objectDetails[i].degree + 'deg)';
								htmlElement[0].style.msTransform = 'rotate(' + $scope.objectDetails[i].degree + 'deg)';
								htmlElement[0].style.OTransform = 'rotate(' + $scope.objectDetails[i].degree + 'deg)';
							}
							//Initially set the values of the SVG Box
							//In here particularly it is got from the zoom % and then assigned
							var calcPixWidth = Math.round(htmlElement[0].width.baseVal.value * ($scope.objectDetails[i].zoom / 100));
							var calcPixHeight = Math.round(htmlElement[0].height.baseVal.value * ($scope.objectDetails[i].zoom / 100));
							htmlElement[0].width.baseVal.value = calcPixWidth;
							htmlElement[0].height.baseVal.value = calcPixHeight;
							htmlElement[0].style.zoom = $scope.objectDetails[i].zoom + "%";
							//Set the color for the Svg element (if it is just panel, then color varies else it is black)
							var innerElement = angular.element(htmlElement[0].innerHTML);
							innerElement[0].style.fill = $scope.objectDetails[i].backgroundColor;
							htmlElement[0].innerHTML = innerElement[0].outerHTML;
							//Generate the Final HTML
							var finalElement = angular.element(htmlElement[0].outerHTML);
							finalElement[0].setAttribute("class", "ScreenAdj");
							finalElement[0].style.outline = null;
							//Assign position
							finalElement[0].style.left = $scope.objectDetails[i].posX;
							finalElement[0].style.top = $scope.objectDetails[i].posY;
							finalElement[0].style.position = 'absolute';
							//if it has a data point assign it to the child element else leave it
							if (!$scope.objectDetails[i].checkBoxState) {
								var childElement = angular.element(finalElement[0].innerHTML);
								childElement[0].setAttribute("fv-svg", "");
								childElement[0].setAttribute("fv-svg-nom-color", $scope.objectDetails[i].nomColor);
								childElement[0].setAttribute("fv-svg-danger-color", $scope.objectDetails[i].maxColor);
								childElement[0].setAttribute("fv-svg-status", "{{values." + $scope.objectDetails[i].parent + "." + $scope.objectDetails[i].dataPoint + "}}");
								finalElement[0].innerHTML = childElement[0].outerHTML;
							}
							$scope.objectDetails[i].finalHtml = finalElement[0].outerHTML;
							break;
						case 'gauge-3':
							var parentElement = angular.element(document.getElementById($scope.currentObject));
							//get the current width and height after resizing and store it to the object details
							var currHeight = parentElement[0].style.height;
							var currWidth = parentElement[0].style.width;
							if (currWidth != '') {
								$scope.objectDetails[i].width = currWidth;
							}
							if (currHeight != '') {
								$scope.objectDetails[i].height = currHeight;
							}
							$scope.objectDetails[i].units = $scope.propertyPanel.units;
							$scope.objectDetails[i].maxValue = $scope.propertyPanel.maxValue;
							$scope.objectDetails[i].maxColor = $scope.generateHexCode($scope.propertyPanel.maxColor.replace("Max-Color : ", ""));
							$scope.objectDetails[i].minValue = $scope.propertyPanel.minValue;
							$scope.objectDetails[i].minColor = $scope.generateHexCode($scope.propertyPanel.minColor.replace("Min-Color : ", ""));
							$scope.objectDetails[i].nomColor = $scope.generateHexCode($scope.propertyPanel.nomColor.replace("Nom-Color : ", ""));
							var gaugeElement = document.createElement("canvas");
							gaugeElement.setAttribute("class", "ScreenAdj");
							gaugeElement.setAttribute("canvas-gauge", "");
							gaugeElement.setAttribute("id", $scope.currentObject);
							gaugeElement.setAttribute("width", parseInt($scope.objectDetails[i].width.replace("px", "")));
							gaugeElement.setAttribute("height", parseInt($scope.objectDetails[i].height.replace("px", "")));
							gaugeElement.setAttribute("data-title", $scope.objectDetails[i].name);
							//TODO: Hardcoded for the time being later get it from the properties
							gaugeElement.setAttribute("data-min-value", 0);
							gaugeElement.setAttribute("data-max-value", 100);
							gaugeElement.setAttribute("data-title", $scope.objectDetails[i].name);
							gaugeElement.setAttribute("data-units", $scope.objectDetails[i].units);
							gaugeElement.style.position = 'absolute';
							gaugeElement.setAttribute("data-major-ticks", "0 10 20 30 40 50 60 70 80 90 100");
							gaugeElement.setAttribute("data-highlights", "0 " + $scope.objectDetails[i].minValue + " " + $scope.objectDetails[i].minColor + ", " + $scope.objectDetails[i].minValue + " " + $scope.objectDetails[i].maxValue + " " + $scope.objectDetails[i].nomColor + ", " + $scope.objectDetails[i].maxValue + " 100 " + $scope.objectDetails[i].maxColor);
							gaugeElement.setAttribute("data-value", "{{values." + $scope.objectDetails[i].parent + "." + $scope.objectDetails[i].dataPoint + "}}");
							gaugeElement.style.left = $scope.objectDetails[i].posX;
							gaugeElement.style.top = $scope.objectDetails[i].posY;
							$scope.objectDetails[i].finalHtml = gaugeElement.outerHTML;
							break;
						case 'bar-chart':
							var parentElement = angular.element(document.getElementById($scope.currentObject));
							//get the current width and height after resizing and store it to the object details
							var currHeight = parentElement[0].style.height;
							var currWidth = parentElement[0].style.width;
							if (currWidth != '') {
								$scope.objectDetails[i].width = currWidth;
							}
							if (currHeight != '') {
								$scope.objectDetails[i].height = currHeight;
							}
							var divElement = document.createElement("div");
							divElement.setAttribute("class", "ScreenAdj");
							divElement.style.left = $scope.objectDetails[i].posX;
							divElement.style.top = $scope.objectDetails[i].posY;
							divElement.style.position = "absolute";
							divElement.setAttribute("id", $scope.currentObject);
							divElement.style.width = $scope.objectDetails[i].width;
							divElement.style.height = $scope.objectDetails[i].height;
							var nvd3Element = document.createElement("nvd3");
							nvd3Element.setAttribute("options", "chrtOption." + $scope.objectDetails[i].dataPoint + ".options");
							nvd3Element.setAttribute("data", "values." + $scope.objectDetails[i].parent + "." + $scope.objectDetails[i].dataPoint + ".data");
							divElement.innerHTML = nvd3Element.outerHTML;
							$scope.objectDetails[i].finalHtml = divElement.outerHTML;
							break;
						case 'ver-bar-chart':
							var parentElement = angular.element(document.getElementById($scope.currentObject));
							//get the current width and height after resizing and store it to the object details
							var currHeight = parentElement[0].style.height;
							var currWidth = parentElement[0].style.width;
							if (currWidth != '') {
								$scope.objectDetails[i].width = currWidth;
							}
							if (currHeight != '') {
								$scope.objectDetails[i].height = currHeight;
							}
							var divElement = document.createElement("div");
							divElement.style.position = "absolute";
							divElement.setAttribute("class", "ScreenAdj");
							divElement.style.left = $scope.objectDetails[i].posX;
							divElement.style.top = $scope.objectDetails[i].posY;
							divElement.setAttribute("id", $scope.currentObject);
							divElement.style.width = $scope.objectDetails[i].width;
							divElement.style.height = $scope.objectDetails[i].height;
							var nvd3Element = document.createElement("nvd3");
							nvd3Element.setAttribute("options", "chrtOption." + $scope.objectDetails[i].dataPoint + ".options");
							nvd3Element.setAttribute("data", "values." + $scope.objectDetails[i].parent + "." + $scope.objectDetails[i].dataPoint + ".data");
							divElement.innerHTML = nvd3Element.outerHTML;
							$scope.objectDetails[i].finalHtml = divElement.outerHTML;
							break;
						case 'candle-chart':
							var parentElement = angular.element(document.getElementById($scope.currentObject));
							//get the current width and height after resizing and store it to the object details
							var currHeight = parentElement[0].style.height;
							var currWidth = parentElement[0].style.width;
							if (currWidth != '') {
								$scope.objectDetails[i].width = currWidth;
							}
							if (currHeight != '') {
								$scope.objectDetails[i].height = currHeight;
							}
							var divElement = document.createElement("div");
							divElement.style.position = "absolute";
							divElement.setAttribute("class", "ScreenAdj");
							divElement.style.left = $scope.objectDetails[i].posX;
							divElement.style.top = $scope.objectDetails[i].posY;
							divElement.style.width = $scope.objectDetails[i].width;
							divElement.style.height = $scope.objectDetails[i].height;
							divElement.setAttribute("id", $scope.currentObject);
							var nvd3Element = document.createElement("nvd3");
							nvd3Element.setAttribute("options", "chrtOption." + $scope.objectDetails[i].dataPoint + ".options");
							nvd3Element.setAttribute("data", "values." + $scope.objectDetails[i].parent + "." + $scope.objectDetails[i].dataPoint + ".data");
							divElement.innerHTML = nvd3Element.outerHTML;
							$scope.objectDetails[i].finalHtml = divElement.outerHTML;
							break;

					}
					// If a connecting URL has been assigned for the 
					if ($scope.propertyPanel.pageUrl !== '') {
						$scope.objectDetails[i].pageUrl = $scope.propertyPanel.pageUrl;
						var assignElement = angular.element($scope.objectDetails[i].finalHtml);
						assignElement[0].setAttribute("ng-click", "forwardTo('" + $scope.propertyPanel.pageUrl + "')");
						assignElement[0].style.cursor = "pointer";
						$scope.objectDetails[i].finalHtml = assignElement[0].outerHTML;
					}
					//convert HTML DOM Element to String and assign it to 'ObjectHTML'
					$scope.objectDetails[i].objectHtml = htmlElement[0].outerHTML;
					//Emit the event to Server indicating that the properties has changed
					socket.emit('propChanged', $scope.objectDetails[i]);
				}
			}
		}
		console.log($scope.objectDetails);
		$scope.propertyPanelMinimize();
	};

	//Function populates the data points in the selection box according to the option (map|array) selected
	// this is only executred for the cases of 'List box'
	$scope.arrayMapDPGenerate = function (data) {
		//change the alue of the selection button to indicate what to be switched too
		if (data === 'Array') {
			$scope.propertyPanel.custButtonLabel = 'Map';
			$scope.propertyPanel.checkBoxShow = true;
		} else if (data === 'Map') {
			$scope.propertyPanel.custButtonLabel = 'Array';
			$scope.propertyPanel.checkBoxShow = false;

		}
	};

	//Cleaning the unnecessary linebreaks in the Node
	$scope.clean = function (node) {
		for (var n = 0; n < node.childNodes.length; n++) {
			var child = node.childNodes[n];
			if ((child.nodeType === 8) || (child.nodeType === 3 && !/\S/.test(child.nodeValue))) {
				node.removeChild(child);
				n--;
			}
			else if (child.nodeType === 1) {
				$scope.clean(child);
			}
		}
	}

	//create the Monitoring screen 
	$scope.createScreen = function () {
		//Since there might be changes before create screen and after assigning properties,
		//the position, width, height must be calculated again
		for (i = 0; len = $scope.objectDetails.length, i < len; i++) {
			if (($scope.objectDetails[i].objectId !== 'background') && ($scope.objectDetails[i].finalHtml !== '')) {
				var lastElement = angular.element(document.getElementById($scope.objectDetails[i].id.replace(/['"]+/g, '')));
				$scope.objectDetails[i].posX = lastElement[0].style.left;
				$scope.objectDetails[i].posY = lastElement[0].style.top;
				var lastFinalElement = angular.element($scope.objectDetails[i].finalHtml);
				console.log(lastFinalElement);
				lastFinalElement[0].style.left = $scope.objectDetails[i].posX;
				lastFinalElement[0].style.top = $scope.objectDetails[i].posY;
				//Incase of height and width, just the scallable things are modified
				if ($scope.objectDetails[i].dataType === 'scalable') {
					$scope.objectDetails[i].width = lastElement[0].style.width;
					$scope.objectDetails[i].height = lastElement[0].style.height;
					lastFinalElement[0].style.width = $scope.objectDetails[i].width;
					lastFinalElement[0].style.height = $scope.objectDetails[i].height;
				}
				$scope.objectDetails[i].finalHtml = lastFinalElement[0].outerHTML;
			}
		}
		var dataObj = {
			'name': $scope.screenName,
			'objects': $scope.objectDetails,
			'backGroundUrl': $scope.imagepath
		}
		console.log(dataObj);
		socket.emit('createScreen', dataObj);
	}

	//Make the Propertries panel visible 

	$scope.propertyPanelShow = function () {
		$scope.propertyPanel.panel = true;
		$scope.propertyPanel.minimize = false;
	};

	//Close the Propertries panel visible 

	$scope.propertyPanelClose = function () {
		$scope.propertyPanel.panel = false;
		$scope.propertyPanel.minimize = false;
	};

	//Minimize the Propertries panel visible 

	$scope.propertyPanelMinimize = function () {
		$scope.propertyPanel.panel = false;
		$scope.propertyPanel.minimize = true;
	};

	/**
	 * Function which enables the General individuals
	 */
	$scope.showGeneral = function () {
		$scope.initializePropButtons();
		$scope.propertyPanel.generalButtonStyle = $scope.propButtonEnabledStyle;
		$scope.propertyPanel.generalShow = true;
	};

	/**
	 * Function which enables the font individuals
	 */
	$scope.showFont = function () {
		$scope.initializePropButtons();
		$scope.propertyPanel.fontButtonStyle = $scope.propButtonEnabledStyle;
		$scope.propertyPanel.fontShow = true;
	};

	/**
	 * Function which enables the Shape individuals
	 */
	$scope.showShape = function () {
		$scope.initializePropButtons();
		$scope.propertyPanel.shapeButtonStyle = $scope.propButtonEnabledStyle;
		$scope.propertyPanel.shapeShow = true;
	};

	/**
	 * Function which enables the Datapoint individuals
	 */
	$scope.showDP = function () {
		$scope.initializePropButtons();
		$scope.propertyPanel.dpButtonStyle = $scope.propButtonEnabledStyle;
		$scope.propertyPanel.dpShow = true;
	};

	/**
	 * Function which enables the Special individuals
	 */
	$scope.showSpecial = function () {
		$scope.initializePropButtons();
		$scope.propertyPanel.specialButtonStyle = $scope.propButtonEnabledStyle;
		$scope.propertyPanel.specialShow = true;
	};

	/**
	 * Function which enables the Special individuals
	 */
	$scope.showConnection = function () {
		$scope.initializePropButtons();
		$scope.propertyPanel.connectionButtonStyle = $scope.propButtonEnabledStyle;
		$scope.propertyPanel.connectionShow = true;
	};

	/**
	 * Function which enables the Background individuals
	 */
	$scope.showBG = function () {
		$scope.initializePropButtons();
		$scope.propertyPanel.bgButtonStyle = $scope.propButtonEnabledStyle;
		$scope.propertyPanel.bgShow = true;
	};

	/**
	 * function that provides hex codes for the color 
	 * Add the hex of further colors here if you want to create the codes
	 */
	$scope.generateHexCode = function (color) {
		var retHex = '#000000';
		switch (color) {
			case 'red':
				retHex = '#FF0000';
				break;
			case 'orange':
				retHex = '#FF8000';
				break;
			case 'green':
				retHex = '#00CC00';
				break;
			case 'blue':
				retHex = '#0000FF';
				break;
			case 'white':
				retHex = '#FFFFFF';
				break;
			case 'yellow':
				retHex = '#FFFF00';
				break;
		}
		return retHex;
	}

	//-----------------------------Functions with respect To Menu-------------------


	//Make the Creation Screen panel visible 

	$scope.createPanelShow = function () {
		$scope.creationPanel.panelShow = true;
	};

	//Close the Creation Screen panel 

	$scope.createPanelClose = function () {
		$scope.creationPanel.panelShow = false;
	};

	//Make the Setting Screen panel visible 

	$scope.settingPanelShow = function () {
		$scope.settingPanel.panelShow = true;
	};

	//Close the Setting Screen panel 

	$scope.settingPanelClose = function () {
		$scope.settingPanel.panelShow = false;
	};

	//----------------------------------------------------------------------------------

	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::



});