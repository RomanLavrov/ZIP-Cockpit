console.log('Sensors script loaded');

var detectors = [];
var detectorNameToSearch = 'E_GAU';

function ShowSensors() {
    console.log("Show Sensors");
    if (window.panelSensors == undefined) {
        window.panelSensors = new SensorsPanel(
            viewer, viewer.container, 'sensorsPanel', 'Sensors');
    }

    window.panelSensors.setVisible(!window.panelSensors.isVisible());  
}

function SensorsPanel(viewer, container, id, title, options) {
    Autodesk.Viewing.UI.DockingPanel.call(this, container, id, title, options);

    getDetectors(viewer);
    this.container.classList.add('docking-panel-container-solid-color-a');
    this.container.style.top = "50px";
    this.container.style.left = "80px";
    this.container.style.width = "fit-content";
    this.container.style.height = "640px";
    this.container.style.resize = "auto";
    this.container.dockRight = true;
    this.container.dockBottom = true;

    var panelContainer = document.createElement('div');
    panelContainer.className = 'uicomponent-panel-controls-container';
    panelContainer.style.padding = '10px';
    panelContainer.style.overflowY = "scroll";
    panelContainer.style.height="80%";

    var panel = document.createElement('div');
    var table = document.createElement('table');
    table.className = 'table table-bordered table-inverse';
    table.setAttribute('id', 'detectorsTable');
    var header = document.createElement('thead');
    var body = document.createElement('tbody');
    var headerTitle = document.createElement('th');
    headerTitle.innerHTML = "Detector Name";

    getDetectors(viewer);
    detectors.forEach(element => {
      var row = document.createElement('tr');
      row.onclick = function () {
          zoomToSensor(viewer, element['id']);
      }
      var data = document.createElement('td');
      data.innerHTML = element['name'];

      row.appendChild(data);
      body.appendChild(row);
  });

    header.appendChild(headerTitle);
    table.appendChild(header);
    table.appendChild(body);
    panel.appendChild(table);
    panelContainer.appendChild(panel);
    this.container.appendChild(panelContainer);

    viewer.loadExtension("markup3d");
    console.log(detectors);
    initializeMarkup(detectors);
}

SensorsPanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype);
SensorsPanel.prototype.constructor = SensorsPanel;

function getDetectors(viewer) {
      detectors = [];
      var tree = viewer.model.getData().instanceTree;
      var root = tree.getRootId();
  
      var allDBId = [];
      var queue = [];
      queue.push(root);
      while (queue.length > 0) {
          var node = queue.shift();
          allDBId.push(node);
  
          tree.enumNodeChildren(node, function (childrenIds) {
              queue.push(childrenIds);
          });
      }
  
       allDBId.forEach(id => {
          if (tree.getNodeName(id).includes(detectorNameToSearch) /*&& tree.getNodeName(id).includes('[', ']')*/) {
  
              var fragIds = [];
              var fragList = viewer.model.getFragmentList();
              tree.enumNodeFragments(id, function (fragId) {
                  fragIds.push(fragId)
              })            
  
              var fragbBox = new THREE.Box3();
              var nodebBox = new THREE.Box3();
  
              fragIds.forEach(function (fragId) {  
                  fragList.getWorldBounds(fragId, fragbBox);
                  nodebBox.union(fragbBox);
              });
              
              //------Get Sensor List-----
              var sensor = {
                  name: tree.getNodeName(id),
                  id: id,
                  coordinates: fragbBox['max'],
                  state: 'active'
              };
              detectors.push(sensor);
              viewer.model.getProperties(id, function (result) {
                  //console.log(result.properties);
              });
          }
          //console.log(tree.getNodeName(id));
      })
  
      //console.log(detectors);
  }

  function zoomToSensor(viewer, id) {
      //viewer.search(id, SearchResult);
      viewer.fitToView([id]);
  }

  function initializeMarkup(detectors) {
      var detectorsData = [];  
  
      detectors.forEach(detector => {
          var iconState;
  
          switch (detector['state']) {
              case 'active':
                  iconState = 0;
                  break;
  
              case 'inactive':
                  iconState = 1;
                  break;
  
              case 'warning':
                  iconState = 2;
                  break;
  
              default:
                  iconState = 3;
                  break;
          }
  
          detectorsData.push({
              icon: iconState,
              x: detector['coordinates']['x'],
              y: detector['coordinates']['y'],
              z: detector['coordinates']['z']
          });
      });
  
      window.dispatchEvent(new CustomEvent('newData', {
          'detail': detectorsData
      }));
      var elem = document.getElementById('label');
  
      function moveLabel(p) {
          
          elem.style.left = ((p.x  + 1) / 2 * window.innerWidth) + 'px';
          elem.style.top = (-(p.y - 1) / 2 * window.innerHeight) + 'px';
      }
      // listen for the 'Markup' event, to re-position our <DIV> POPUP box
      
      window.addEventListener("onMarkupMove", e=>{moveLabel(e.detail)}, false)
      window.addEventListener("onMarkupClick", e=>{
          elem.innerHTML = "";
          elem.style.display = "block";
          moveLabel(e.detail);
          var labelHeader = document.createElement('div');
          var headerIcon = document.createElement('img');
          headerIcon.src = '/images/sensors.svg';
          headerIcon.style.width = '28px';
          var headerText = document.createTextNode(" " + detectors[e.detail.id]['name']);
          var separator = document.createElement('hr');
          separator.style.background = 'white';
          
          labelHeader.appendChild(headerIcon);
          labelHeader.appendChild(headerText);
          labelHeader.appendChild(separator);
  
          var labelBody = document.createElement('div');
          var stateIcon = document.createElement('img');
          stateIcon.src = '/images/stateActive.svg';
          stateIcon.style.width = '10px';
          stateIcon.style.margin = '0 2px 0 5px';
          var stateTitle = document.createTextNode('State:');
    
          var stateValue = document.createTextNode(detectors[e.detail.id]['state']);
  
          labelBody.appendChild(stateTitle);
  
          labelBody.appendChild(stateIcon);
          labelBody.appendChild(stateValue);
  
          elem.appendChild(labelHeader);
          elem.appendChild(labelBody);
      }, false);
  }

  export {
      ShowSensors
};