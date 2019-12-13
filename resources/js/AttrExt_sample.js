var panelDetectors;
var panelDashboard;
var panelAttributes;
var panelChart;
var panelMap;
var panel;
var panelViews;
var tree;
var detectors = [];
var viewer;
//var zoomToSensor = getParameter("SENSOR");
console.log('Attribute extension loaded');
//var cookies = decodeURIComponent(document.cookie);
//var array = cookies.split(';');
var array;

function getParameter(paramName) {
    if (array != undefined) {
        for (i = 0; i < array.length; i++) {
            var indexEqual = array[i].indexOf('=');
            var param = array[i].substring(0, indexEqual);
            param = param.replace(/\s/g, '');
            var value = array[i].substring(indexEqual + 1);
            value = value.replace(/\s/g, '');

            if (paramName == param) {
                //console.log("Parameter: " + param);
                //console.log("Value: " + value);
                return value;
            }
        }
    }
}

function AttributeExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
    panelMap = null;
    panelDetectors = null;
    panelDashboard = null;
    panelAttributes = null;
    panelChart = null;
    panelViews = null;
}

AttributeExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
AttributeExtension.prototype.constructor = AttributeExtension;

AttributeExtension.prototype.load = function () {
    console.log('AttributeExtension is loaded');
    viewer = this.viewer;

    this.onSelectionBinded = this.onSelectionEvent.bind(this);
    this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onSelectionBinded);
    this.onSelectionBinded = null;
    // var ext = this;

    Toolbar(viewer);

    viewer.addEventListener(Autodesk.Viewing.CAMERA_TRANSITION_COMPLETED, function () {
        var loop = 1;
        if (zoomToSensor !== undefined) {
            smoothCameraMove();

            function smoothCameraMove() {
                setTimeout(function () {
                    moveCamera(0.166);
                    loop++;
                    if (loop < 30) {
                        smoothCameraMove();
                    }
                }, 10);
            }
            zoomToSensor = undefined;
        }
    });

    viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, function () {
        console.log('Tree loaded');
        tree = viewer.model.getData().instanceTree;
        var rootId = this.rootId = tree.getRootId();

        tree.enumNodeChildren(rootId, function (childId) {
            var childName = tree.getNodeName(childId);
            detectors.push(childName);
        });

        detectors = getAlldbIds(rootId, tree);


        //-----Zoom to selected sensor-----
        if (getParameter('SENSOR') !== undefined) {
            var sensorId = getParameter('SENSOR');
            viewer.search(sensorId, SearchResult);

            function SearchResult(idArray) {
                viewer.fitToView(idArray);
            }
        }
    });
    return true;
};

AttributeExtension.prototype.onSelectionEvent = function () {
    var currentSelection = this.viewer.getSelection();
    var elementID = document.getElementById("elementID");
    //this.viewer.fitToView(currentSelection); // Scale screen to selected object!!!!
    var SelectedId = parseInt(currentSelection);

    getElementProperties(SelectedId);
};

function getAccessToken() {
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", 'application/models/oAuth.php', false /*forge viewer requires SYNC*/ );
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

//---Get properties from URN
function getElementProperties(selectedId) {

    if (isNaN(selectedId)) {
        return null;
    }
    var xmlHttpViewID = new XMLHttpRequest();
    xmlHttpViewID.open("GET", "https://developer.api.autodesk.com/modelderivative/v2/designdata/" + currentURN + "/metadata", false);
    xmlHttpViewID.setRequestHeader("Authorization", "Bearer " + getToken());
    xmlHttpViewID.send();

    var objViewId = JSON.parse(xmlHttpViewID.responseText);
    var GUID = objViewId.data.metadata[2].guid;
    console.log('Selected element GUID: ' + objViewId.data.metadata[0].guid);

    var xmlHttpProperties;
    if (GUID !== null) {
        xmlHttpProperties = new XMLHttpRequest();
        xmlHttpProperties.open("GET", "https://developer.api.autodesk.com/modelderivative/v2/designdata/" + currentURN + "/metadata/" + GUID + "/properties?objectid=" + selectedId, false);
        xmlHttpProperties.setRequestHeader("Authorization", "Bearer " + getToken());
        xmlHttpProperties.send();
    }

    // console.log("Response Text: " + xmlHttpProperties.responseText);
    var objProperties = JSON.parse(xmlHttpProperties.responseText);
    //console.log(objProperties.data);
    //console.log("Properties: " + xmlHttpProperties.status + " " + xmlHttpProperties.statusText + xmlHttpProperties.responseText);

    var propObjectId = document.getElementById("propObjectId");
    propObjectId.innerHTML = objProperties.data.collection[0].objectid;
    var propName = document.getElementById("propName");
    propName.innerHTML = objProperties.data.collection[0].name;
    //var propHidden = document.getElementById("propHidden");
    //propHidden.innerHTML = objProperties.data.collection[0].properties.Item.Hidden;
    //var propLayer = document.getElementById("propLayer");
    //propLayer.innerHTML = objProperties.data.collection[0].properties.Item.Layer;
    //var propMaterial = document.getElementById("propMaterial");
    //propMaterial.innerHTML = objProperties.data.collection[0].properties.Item.Material;
    //var propType = document.getElementById("propType");
    //propType.innerHTML = objProperties.data.collection[0].properties.Item.Type;

    var propHersteller = document.getElementById('propHersteller');
    //propHersteller.innerHTML = objProperties.data.collection[0].properties.Abhängigkeiten.Arbeitsebene;
    var propTypname = document.getElementById('propTypname');
    propTypname.innerHTML = objProperties.data.collection[0].properties["ID-Daten"].Typname;

    // console.log(   objProperties.data.collection[0].objectid + " | "
    //              + objProperties.data.collection[0].name + " | "
    //              + objProperties.data.collection[0].properties.Item.Hidden + " | ");

    var divChart = document.getElementById('temperatureGauge');
    var divGraph = document.getElementById('temperatureGraph');
    if (propName.innerHTML.contains("IoT")) {
        //console.log(propTypname.innerHTML);        
        divChart.height = 240;
        divChart.width = 560;
        divGraph.height = 240;
        divGraph.width = 560;
        getTemperatureData();
        getTemperatureGraphData();
    } else {
        //console.log('clear');
        divGraph.width = 0;
        divGraph.height = 0;
        divChart.height = 0;
        divChart.width = 0;
        var emptyHTML = ['<div></div>'];
        divChart.innerHTML = emptyHTML;
        divGraph.innerHTML = emptyHTML;
    }

    return xmlHttpProperties.status;
}

Autodesk.Viewing.theExtensionManager.registerExtension('AttributeExtension', AttributeExtension);

function ShowAttributes(viewer, container, id, title, option) {
    var content = document.createElement('div');
    if (panelAttributes === null) {
        panelAttributes = new PropertiesPanel(viewer.container, "Attributes", "Attributes List", 'Attributes');
    }
    panelAttributes.setVisible(!panelAttributes.isVisible());
}

//-----Properties Panel
function PropertiesPanel(parentContainer, id, title, content, options) {
    this.content = content;
    Autodesk.Viewing.UI.DockingPanel.call(this, parentContainer, id, options);

    // Auto-fit to the content and don't allow resize.  Position at the coordinates given.
    this.container.classList.add('docking-panel-container-solid-color-a');
    this.container.style.top = "30%";
    this.container.style.left = "60%";
    this.container.style.width = "auto";
    this.container.style.height = "auto";
    this.container.style.resize = "auto";

    //this.container.appendChild(this.content);
    this.initializeMoveHandlers(this.container);

    var scrollContainer = {
        left: false,
        heightAdjustment: 45,
        marginTop: 0
    };
    this.scrollcontainer = this.createScrollContainer(scrollContainer);

    var html = [
        '<div class="uicomponent-panel-controls-container">',
        '<div class="panel panel-default" style="margin:10px; display:inline-block;float:left; ">',
        '<table bgcolor="#red" class="table table-bordered table-inverse" id = "clashresultstable" >',
        '<thead bgcolor="#323232">',
        '<th>Atrtribute name</th><th>Value</th>',
        '</thead>',
        '<tbody bgcolor="#323232">'
    ].join('\n');

    //for (var i = 0; i < 10; i++) {
    // html += ['<tr><td>' + "Attribute" + '</td><td><div id="elementID">Ok</div></td><td><input type="text" name="fname"></td><td><button style="color: black">Save</button></td></tr>'].join('\n');
    // }

    html += ['<tr><td>' + "Object ID" + '</td><td><div id="propObjectId">-</div></td></tr>'].join('\n');
    html += ['<tr><td>' + "Name" + '</td><td><div id="propName">-</div></td></tr>'].join('\n');
    //html += ['<tr><td>' + "Hidden" + '</td><td><div id="propHidden">-</div></td></tr>'].join('\n');
    //html += ['<tr><td>' + "Layer" + '</td><td><div id="propLayer">-</div></td></tr>'].join('\n');
    //html += ['<tr><td>' + "Material" + '</td><td><div id="propMaterial">-</div></td></tr>'].join('\n');
    //html += ['<tr><td>' + "Type" + '</td><td><div id="propType">-</div></td></tr>'].join('\n');
    html += ['<tr><td>' + "Hersteller" + '</td><td><div id="propHersteller">-</div></td></tr>'].join('\n');
    html += ['<tr><td>' + "Typname" + '</td><td><div id="propTypname">-</div></td></tr>'].join('\n');
    html += ['</tbody></table>'].join('\n');

    html += ['<div id="temperatureGauge" style="background: #333; margin-top:1px"></div>'].join('\n');
    html += ['<div id="temperatureGraph" data-valueType=\"temperatureGraph\"></div>'].join('\n');
    $(this.scrollcontainer).append(html);
}
PropertiesPanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype);
PropertiesPanel.prototype.constructor = PropertiesPanel;

//-----Toolbar Methods-----
function Toolbar(viewer) {
    var toolbarDivHtml = document.createElement('div');
    toolbarDivHtml.setAttribute('id', 'divToolbar');
    $(viewer.container).append(toolbarDivHtml);
    var toolbar = new Autodesk.Viewing.UI.ToolBar(true);
    var ctrlGroup = new Autodesk.Viewing.UI.ControlGroup("Autodesk.ADN.Viewing.Extension.Toolbar.ControlGroup2");
    
    /*
    var buttonMap = new Autodesk.Viewing.UI.Button('toolbar-button-Map');
    buttonMap.addClass('toolbar-button-Map');
    buttonMap.setToolTip('Show Map');
    buttonMap.onClick = function (e) {
        ShowMap(viewer, viewer.container);
    };*/
    
    var buttonDetectors = new Autodesk.Viewing.UI.Button('Detector', 'toolbar-button');
    buttonDetectors.addClass('toolbar-button');
    buttonDetectors.setToolTip('Show Detectors');
    buttonDetectors.onClick = function () {
        ShowDetectors(viewer, viewer.container);
    }

    var buttonOccupancy = new Autodesk.Viewing.UI.Button('Occupancy', 'toolbar-button');
    buttonOccupancy.addClass('toolbar-button');
    buttonOccupancy.setToolTip('Show occupancy');
    buttonOccupancy.onClick = function(){
        ShowOccupancy(viewer, viewer.container);
    }

    /*
    var buttonMarks = new Autodesk.Viewing.UI.Button('toolbar-button-Mark');
    buttonMarks.addClass('toolbar-button-Mark');
    buttonMarks.setToolTip('Show Marks');
    buttonMarks.onClick = function (e) {
        ShowLabels();
    };

    var buttonMeter = new Autodesk.Viewing.UI.Button('toolbar-button-Meter');
    buttonMeter.addClass('toolbar-button-Meter');
    buttonMeter.setToolTip('Show Dashboard');
    buttonMeter.onClick = function (e) {
        ShowDashboard(viewer, viewer.container);
    };

    var buttonChart = new Autodesk.Viewing.UI.Button('toolbar-button-Chart');
    buttonChart.addClass('toolbar-button-Chart');
    buttonChart.setToolTip('Show Chart');
    buttonChart.onClick = function (e) {
        ShowChart(viewer, viewer.container);
    };

    var buttonAttributes = new Autodesk.Viewing.UI.Button('toolbar-button-Attributes');
    buttonAttributes.addClass('toolbar-button-Attributes');
    buttonAttributes.setToolTip('Show Attributes');
    buttonAttributes.onClick = function (e) {
        ShowAttributes(viewer, viewer.container);
    };

    var buttonIsolate = new Autodesk.Viewing.UI.Button('toolbar-button-Isolate');
    buttonIsolate.addClass('toolbar-button-Isolate');
    buttonIsolate.setToolTip('Toggle Visibility');
    buttonIsolate.onClick = function (e) {
        IsolateLevel(viewer, viewer.container);
    };

    var buttonViews = new Autodesk.Viewing.UI.Button('toolbar-button-Views');
    buttonViews.addClass('toolbar-button-Views');
    buttonViews.setToolTip('Predefined Views');
    buttonViews.onClick = function (e) {
        ShowViewsTree(viewer, viewer.container);
    };
    /*
    ctrlGroup.addControl(buttonMap);
    ctrlGroup.addControl(buttonDetectors);
    ctrlGroup.addControl(buttonMarks);
    ctrlGroup.addControl(buttonMeter);
    ctrlGroup.addControl(buttonChart);
    ctrlGroup.addControl(buttonAttributes);
    ctrlGroup.addControl(buttonIsolate);
    ctrlGroup.addControl(buttonViews);*/
    ctrlGroup.addControl(buttonDetectors);
    ctrlGroup.addControl(buttonOccupancy);

    toolbar.addControl(ctrlGroup);
    console.log("Toolbar added");
    $('#divToolbar')[0].appendChild(toolbar.container);
}

function ShowMap() {
    var content = document.createElement('div');

    if (panelMap === null) {
        panelMap = new MapPanel(viewer, viewer.container, 'Map', 'Map Selection', content, 20, 20);
    }
    panelMap.setVisible(!panelMap.isVisible());
}

function ShowDetectors(viewer, container, id, title, options) {
    console.log("DETECTORS INIT");

    if (panelDetectors === null) {
        panelDetectors = new DetectorsPanel(viewer, viewer.container, 'awesomeExtensionPanel', 'Detectors');
    }
    // show/hide docking panel
    panelDetectors.setVisible(!panelDetectors.isVisible());
}

//-----Show Labels
function initMarkup() {
    var dummyData = [];
    for (let i = 0; i < 20; i++) {
        dummyData.push({
            icon: Math.round(Math.random() * 3),
            x: Math.random() * 300 - 150,
            y: Math.random() * 50 - 20,
            z: Math.random() * 150 - 300
        });
    }
    window.dispatchEvent(new CustomEvent('newData', {
        'detail': dummyData
    }));
}

function ShowLabels(viewer, options) {
    console.log("LABELS INIT");
}
ShowLabels.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
ShowLabels.prototype.constructor = ShowLabels;

function ShowDashboard(viewer, container, id, title, options) {
    console.log("Dashboard init");

    if (panelDashboard === null) {
        panelDashboard = new DashboardPanel(viewer, viewer.container,
            'awesomeExtensionPanel2', 'Dashboard');
    }
    // show/hide docking panel
    panelDashboard.setVisible(!panelDashboard.isVisible());
}

function ShowChart(viewer, container, id, title, options) {
    console.log("Chart init");

    if (panelChart === null) {
        panelChart = new ChartPanel(viewer, viewer.container,
            'awesomeExtensionPanel3', 'Chart');
    }
    // show/hide docking panel
    panelChart.setVisible(!panelChart.isVisible());
}

function ShowViewsTree(viewer, container) {
    console.log('Views init');

    if (panelViews === null) {
        panelViews = new ViewsPanel(viewer, viewer.container, 'extensionPanel4', 'Predefined Views');
    }
    panelViews.setVisible(!panelViews.isVisible());
}

//-----Map Panel
function MapPanel(viewer, container, id, title, options) {
    this.viewer = viewer;
    Autodesk.Viewing.UI.DockingPanel.call(this, container, id, title, options);

    this.container.classList.add('docking-panel-container-solid-color-a');
    this.container.style.top = "10%";
    this.container.style.left = "10%";
    this.container.style.width = "auto";
    this.container.style.height = "auto";
    this.container.style.resize = "both";

    var div = document.createElement('div');

    getCity();

    google.charts.setOnLoadCallback(drawRegionsMap);
    var html = ['<div id="regions_div" style="width: 900px; height: 500px;"></div>'].join('\n');
    div.innerHTML = html;
    this.container.appendChild(div);
}
MapPanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype);
MapPanel.prototype.constructor = MapPanel;

//-----Detectors List-----
function DetectorsPanel(viewer, container, id, title, options) {
    this.viewer = viewer;
    Autodesk.Viewing.UI.DockingPanel.call(this, container, id, title, options);

    // the style of the docking panel
    // use this built-in style to support Themes on Viewer 4+
    this.container.classList.add('docking-panel-container-solid-color-a');
    this.container.style.top = "30%";
    this.container.style.left = "60%";
    this.container.style.width = "auto";
    this.container.style.height = "auto";
    this.container.style.resize = "both";

    // this is where we should place the content of our panel
    var div = document.createElement('div');
    div.style.margin = '20px';

    var html = [
        '<div class="uicomponent-panel-controls-container">',
        '<div class="panel panel-default">',
        '<table bgcolor="#00FF00" class="table table-bordered table-inverse" id = "clashresultstable">',
        '<thead bgcolor="#323232">',
        '<th>Detector name</th>',
        '</thead>',
        '<tbody bgcolor="#323232">'
    ].join('\n');

    for (var i = 0; i < detectors.length; i++) {
        html += ['<tr><td><button class="btn btn-primary" style="color: white" onclick="showElement(' + i + ');">' + detectors[i] + '</button></td></tr>'].join('\n');
    }

    html += ['</tbody>',
        '</table>',
        '</div>',
        '</div>'
    ].join('\n');

    // and may also append child elements...
    div.innerHTML = html;
    this.container.appendChild(div);
}
DetectorsPanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype);
DetectorsPanel.prototype.constructor = DetectorsPanel;

//-----Dashboard Panel-----
function DashboardPanel(viewer, container, id, title, options) {
    this.viewer = viewer;
    Autodesk.Viewing.UI.DockingPanel.call(this, container, id, title, options);
    this.container.classList.add('docking-panel-container-solid-color-a');
    this.container.style.top = "30%";
    this.container.style.left = "80px";
    this.container.style.width = "640px";
    this.container.style.height = "270px";
    this.container.style.resize = "both";

    // this is where we should place the content of our panel
    var div = document.createElement('div');
    div.style.margin = '20px';

    //Temperature
    var html = ["<div id=\"viewerGauge\"><div>" + "Temperatur" + "</div>"].join('\n');
    html += ["<div id=\"dashboard_div\"></div></div>"].join('\n');

    //Pressure
    html += ["<div id=\"viewerGauge\"><div>" + "Luftdruck" + "</div>"].join('\n');
    html += ["<div id=\"dashboard_div1\"></div></div>"].join('\n');

    //Humidity
    html += ["<div id=\"viewerGauge\"><div>" + "Feuchte" + "</div>"].join('\n');
    html += ["<div id=\"dashboard_div2\"></div></div>"].join('\n');

    //-------------------------------------

    google.charts.load('current', {
        'packages': ['gauge']
    });
    google.charts.setOnLoadCallback(drawDash);

    //--------------------------------------
    div.innerHTML = html;
    this.container.appendChild(div);
}

function drawDash() {
    getTemperatureData("dashboard_div");
    getPressureData("dashboard_div1");
    getHumidityData("dashboard_div2");
}
DashboardPanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype);
DashboardPanel.prototype.constructor = DashboardPanel;

//-----Chart Panel-----
function ChartPanel(viewer, container, id, title, options) {
    this.viewer = viewer;
    Autodesk.Viewing.UI.DockingPanel.call(this, container, id, title, options);

    // the style of the docking panel
    // use this built-in style to support Themes on Viewer 4+
    this.container.classList.add('docking-panel-container-solid-color-a');
    this.container.style.top = "0%";
    this.container.style.left = "80px";
    this.container.style.width = "auto";
    this.container.style.height = "100%";
    this.container.style.resize = "both";

    // this is where we should place the content of our panel
    var div = document.createElement('div');
    div.style.margin = '20px';
    div.style.width = '560px';

    //Temperature
    var html = ["<div id=\"viewerGraph\"><div>" + "Temperatur" + "</div>"].join('\n');
    html += ["<div class='spinner'><div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div></div>"].join('\n');
    html += [" <div id=\"chartTemperature\" data-valueType=\"temperatureGraph\"></div></div>"].join('\n');
    getTemperatureGraphData("day", "chartTemperature");


    //Pressure
    html += ["<div id=\"viewerGraph\"><div >" + "Luftdruck" + "</div>"].join('\n');
    html += ["<div id=\"chartPressure\" data-valueType=\"pressureGraph\"></div></div>"].join('\n');

    //Humidity
    html += ["<div id=\"viewerGraph\" ><div>" + "Feuchte" + "</div>"].join('\n');
    html += ["<div id=\"chartHumidity\" data-valueType=\"humidityGraph\"></div></div>"].join('\n');


    getTemperatureGraphData("day", "chartTemperature");
    getPressureGraphData("day", "chartPressure");
    getHumidityGraphData("day", "chartHumidity");

    div.innerHTML = html;
    this.container.appendChild(div);
}
ChartPanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype);
ChartPanel.prototype.constructor = ChartPanel;



function showElement(value) {

    var detectorName = detectors[value];
    var index = detectorName.indexOf("[");

    var detectorId = detectorName.substring(index + 1, detectorName.length - 1);

    //console.log("DetectorID: " + detectorId);
    viewer.search(detectorId, SearchResult);

    function SearchResult(idArray) {
        viewer.fitToView(idArray);
    }
}

function IsolateLevel(viewer, container) {

    var instanceTree = viewer.model.getData().instanceTree;
    var rootId = instanceTree.getRootId();

    if (viewer.areAllVisible()) {
        viewer.hide(rootId); // hidding root node will hide whole model ...
    } else {
        viewer.show(rootId);
    }
}

//-----Get elements from viewer
function getAlldbIds(rootId, tree) {
    console.log("SearchSensor");
    var allDBId = [];
    var elementsNames = [];

    if (!rootId) {
        return allDBId;
    }

    var queue = [];
    queue.push(rootId);
    while (queue.length > 0) {
        var node = queue.shift();
        allDBId.push(node);
        tree.enumNodeChildren(node, function (childrenIds) {
            queue.push(childrenIds);
        });
    }

    for (var i = 0; i < allDBId.length; i++) {
        if (tree.getNodeName(allDBId[i]).includes('RIN_IoT') && tree.getNodeName(allDBId[i]).includes('[')) {
            elementsNames.push(tree.getNodeName(allDBId[i]));
        }
    }
    return elementsNames;
}

//-----Views Panel-----
function ViewsPanel(viewer, container, id, title, options) {
    Autodesk.Viewing.UI.DockingPanel.call(this, container, id, title, options);
    this.container.classList.add('docking-panel-container-solid-color-a');
    this.container.style.top = "0%";
    this.container.style.left = "80px";
    this.container.style.width = "300px";
    this.container.style.height = "auto";
    this.container.style.resize = "both";

    // this is where we should place the content of our panel
    var div = document.createElement('divViews');
    div.style.width = '560px';
    var html = ['<div style = "margin:10px"><table class="table table-bordered table-inverse" id = "clashresultstable"><th>View Name</th><th>Type</th>'].join('\n');
    getViews().forEach(function (item, index) {
        html += ['<tr><td><button class="btn btn-primary" onclick="loadPredefinedView(' + index + ')">' + item.name + '</button></td><td>' + item.role + '</td></tr>'].join('\n');
        //alert(index + item.name + item.guid + item.role);
    });
    html += ['</tbody></table></div>'];
    div.innerHTML = html;
    this.container.appendChild(div);
}
ViewsPanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype);
ViewsPanel.prototype.constructor = ChartPanel;

function getViews() {
    this.viewer = viewer;
    var urn = "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Zm9yZ2VhcHAxOWJhNGVmMmViNjA0YWI0OTZjMWY4ZDJhZDAyNmNlMS81MDE3LjA0NV8wOV9CRU1fRUlOLnJ2dA==";

    var xmlHttpViews = new XMLHttpRequest();
    xmlHttpViews.open('GET', 'https://developer.api.autodesk.com/modelderivative/v2/designdata/' + currentURN + '/metadata', false);

    xmlHttpViews.setRequestHeader("Authorization", "Bearer " + getToken());
    xmlHttpViews.send();
    var Views = JSON.parse(xmlHttpViews.responseText);
    //console.log(Views);

    var listView = [];

    var length = Views.data.metadata.length;
    for (var i = 0; i < length; i++) {
        listView.push(Views.data.metadata[i]);
    }
    return listView;
}

function loadPredefinedView(index) {
    var viewables = viewerApp.bubble.search({
        'type': 'geometry'
    });
    viewerApp.selectItem(viewables[index].data, onItemLoadSuccess, onItemLoadFail);
}

function moveCamera(distance) {
    //console.log("MoveCamera");
    var nav = viewer.navigation;
    var pos = nav.getPosition();
    var target = nav.getTarget();
    var viewdir = new THREE.Vector3();
    viewdir.subVectors(pos, target).normalize();

    // zooms out by 100 along the view direction
    viewdir.multiplyScalar(distance);
    pos.add(viewdir);
    nav.setPosition(pos);
}

function getCity() {
    var cities = [];
    var cityDiv = document.getElementById('cities');
    var cityArray = ['Aarau', 'Basel', 'Bern-Mattenhof', 'Geneve', 'Lausanne', 'Lugano', 'Luzern', 'Olten', 'St.Gallen', 'Zurich'];
    var sortArray = [];

    $.get("application/models/dataCity.php", function (result) {
        cities = JSON.parse(result);

        cities.forEach(element => {
            for (let city of cityArray) {
                if (element.CityName.includes(city)) {
                    if (!sortArray.includes(city)) {
                        sortArray.push(city);
                        cityDiv.innerHTML += '<div class="city" data-value=' + element.CityName + ' data-location=' + element.Location + ' onclick="citySelected(this)">' + city.replace("Zurich", "Zürich") + '</div>';
                        break;
                    }
                }
            }
        });
    });
}
