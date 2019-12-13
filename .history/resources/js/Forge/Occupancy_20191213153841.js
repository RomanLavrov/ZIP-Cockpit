console.log('Occupancy script loaded');

var rooms=[];
var instanceTree;

function ShowOccupancy() {
    console.log("Show Occupancy");
    if (window.panelOccupancy == undefined) {
        window.panelOccupancy = new OccupancyPanel(
            viewer, viewer.container, 'occupancyPanel', 'Occupancy');
    }

    window.panelOccupancy.setVisible(!window.panelOccupancy.isVisible());
   
    //viewer.select([rooms[0]['id']]);
    rooms.forEach(room=>{
       changeRoomColor(room);
    });
}

export {
    ShowOccupancy
};

function OccupancyPanel(viewer, container, id, title, options) {
    Autodesk.Viewing.UI.DockingPanel.call(this, container, id, title, options);

    this.container.classList.add('docking-panel-container-solid-color-a');
    this.container.style.top = "50px";
    this.container.style.left = "240px";
    this.container.style.width = "fit-content";
    this.container.style.height = "640px";
    this.container.style.resize = "auto";
    this.container.dockRight = true;
    this.container.dockBottom = true;

    getRooms(viewer);
   

    var panelContainer = document.createElement('div');
    panelContainer.className = 'uicomponent-panel-controls-container';
    panelContainer.style.padding = '10px';
    panelContainer.style.overflowY = "scroll";
    panelContainer.style.height="80%";

    var panel = document.createElement('div');
    var table = document.createElement('table');
    table.className = 'table table-bordered table-inverse';
    table.setAttribute('id', 'occupancyTable');

    var header = document.createElement('thead');
    var body = document.createElement('tbody')

    var headerTitle = document.createElement('th');
    headerTitle.innerHTML = "Rooms";

    var headerType = document.createElement('th');
    headerType.innerHTML = "Utilization";
  
    rooms.forEach(room => {
        var row = document.createElement('tr');
        row.onclick = function(){           
            viewer.hide(viewer.model.getData().instanceTree.getRootId());
            viewer.show(room['id']);
            viewer.fitToView(room['id']);
        }
        var roomName = document.createElement('td');
        roomName.innerHTML = room['name'];

        var roomUtilization = document.createElement('td');
        roomUtilization.innerHTML = room['utilisation'];

        row.appendChild(roomName);
        row.appendChild(roomUtilization);
        body.appendChild(row);

    });

    header.appendChild(headerTitle);
    header.appendChild(headerType);
    table.appendChild(header);
    table.appendChild(body);
    panel.appendChild(table);
    panelContainer.appendChild(panel);
    this.container.appendChild(panelContainer);
}

OccupancyPanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype);
OccupancyPanel.prototype.constructor = OccupancyPanel;


function getRooms(viewer){
    rooms=[];
    var tree = viewer.model.getData().instanceTree;
    var root = tree.getRootId();

    var listViewElements = [];
    var queue = [];
    queue.push(root);
    while(queue.length>0){
        var node = queue.shift();
        listViewElements.push(node);

        tree.enumNodeChildren(node, function(childrenIds){
            queue.push(childrenIds);
        });
    }

    listViewElements.forEach(id => {
        if (tree.getNodeName(id).includes('Room')){
            var room = {
                name: tree.getNodeName(id),
                id: id,
                utilisation: Math.round(Math.random()*100) + "%"
            }
            rooms.push(room);
        }
    });
}
var overlayName = "temporary-colored-overlay";

function changeRoomColor(room){

    var color= 0x00ff00;
    var material = addMaterial(color);
    //viewer.impl.setSelectionColor(new THREE.Color(0,1,0))
   
    var tree = viewer.model.getData().instanceTree;

    var fragIds = [];
    var fragList = viewer.model.getFragmentList();
    console.log(fragList);

    tree.enumNodeFragments(room['id'], function (fragId) {
        fragIds.push(fragId);
        console.log("FRAG");
        console.log(fragId);
    })    


    console.log(fragIds);
   /*
    tree.enumNodeFragments(room['id'], function (fragId) {
        console.log(room['id']);
                    
        var renderProxy = viewer.impl.getRenderProxy(viewer.model, fragId);
        
        renderProxy.meshProxy = new THREE.Mesh(renderProxy.geometry, renderProxy.material);

        renderProxy.meshProxy.matrix.copy(renderProxy.matrixWorld);
        renderProxy.meshProxy.matrixWorldNeedsUpdate = true;
        renderProxy.meshProxy.matrixAutoUpdate = false;
        renderProxy.meshProxy.frustumCulled = false;

        viewer.impl.addOverlay(overlayName, renderProxy.meshProxy);
        viewer.impl.invalidate(true);
        
    }, false);*/
   
}

function addMaterial(color) {
    var material = new THREE.MeshPhongMaterial({
        color: color
    });
    //viewer.impl.matman().addMaterial(newGuid(), material);
    viewer.impl.createOverlayScene(overlayName, material, material);
    return material;
}

//-------------------------------------------------------
this.load = function() {  
        

    //create a default face material 
    _defaultFaceMaterial =  createFaceMaterial("#b4ff77", 0.9, true);

    //hex color array for different rooms
    var colorHexArray = ["#ff77b4", "#b4ff77", "#77b4ff", "#c277ff", "#ffc277", "#f8ff77"];
    for(var k = 0; k < colorHexArray.length; k++){
        //create some materials with specific colors
        var material = createFaceMaterial(colorHexArray[k], 0.9, true);
        _materialArray.push(material);
    } 

      //create a layer
    _viewer.impl.createOverlayScene(_overlaySceneName);
    
    getRooms(); 

    
    console.log('RoomShader Extension loaded');

    return true;
};