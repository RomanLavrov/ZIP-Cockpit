console.log('Occupancy script loaded');

var rooms=[];
var instanceTree;
//----
var _overlaySceneName = "overlay-room-geometry";
var _customMaterialPrefix = 'forge-material-face-';
var _materialArray = []; 


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

    CreateMeshMaterials(rooms);
    renderRoomShader( );
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
var _defaultFaceMaterial;
//-------------------------------------------------------
function renderRoomShader( )
    {
        console.log('room number in this specific floor:' 
            +  rooms.length);
    
        var  colorIndex = 0;
        $.each(rooms,
            function(num,room){
    
            console.log('room dbid:' + room.roomid);
            
            if(colorIndex > 5)
                colorIndex = 0;
    
            var faceMeshArray = [];
    
            var instanceTree =  viewer.model.getData().instanceTree; 
            instanceTree.enumNodeFragments(room.roomid, function(fragId){
                
                    var renderProxy = viewer.impl.getRenderProxy(
                         viewer.model,
                        fragId);
            
                    var matrix = renderProxy.matrixWorld;
                    var indices = renderProxy.geometry.ib;
                    var positions = renderProxy.geometry.vb;
                    var stride = renderProxy.geometry.vbstride;
                    var offsets = renderProxy.geometry.offsets;
                
                    if (!offsets || offsets.length === 0) {
                        offsets = [{start: 0, count: indices.length, index: 0}];
                    }
                
                    var vA = new THREE.Vector3();
                    var vB = new THREE.Vector3();
                    var vC = new THREE.Vector3();
        
    
                    for (var oi = 0, ol = offsets.length; oi < ol; ++oi) {
                
                        var start = offsets[oi].start;
                        var count = offsets[oi].count;
                        var index = offsets[oi].index;
                
                        var checkFace = 0;
        
                        for (var i = start, il = start + count; i < il; i += 3) {
                        
                            var a = index + indices[i];
                            var b = index + indices[i + 1];
                            var c = index + indices[i + 2];
                
                            vA.fromArray(positions, a * stride);
                            vB.fromArray(positions, b * stride);
                            vC.fromArray(positions, c * stride);
                    
                            vA.applyMatrix4(matrix);
                            vB.applyMatrix4(matrix);
                            vC.applyMatrix4(matrix);
                
                            var faceGeometry = createFaceGeometry(vA, vB, vC);
                            var faces = faceGeometry.faces;
        
                            for(var f = 0; f < faces.length; f++){
                                     var faceMesh = drawFaceMesh(faceGeometry,
                                      _overlaySceneName, 
                                      _materialArray[colorIndex],
                                      renderProxy);
                                    faceMeshArray.push(faceMesh); 
                            }
                        }
                    }
                });
    
            room.defaultcolor = _materialArray[colorIndex];
            room.facemeshes = faceMeshArray;
    
            colorIndex++;
        }); 
           
    }

 function CreateMeshMaterials() {  
        
    console.log("Create Mesh Material");
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
    viewer.impl.createOverlayScene(_overlaySceneName);
    
    //getRooms(); 
        
    console.log('RoomShader Extension loaded');

    return true;
};

function createFaceMaterial(colorhex, opacity, transparent) {
    
    var colorHexStr = colorhex;
    var colorThreeStr = colorHexStr.replace('#', '0x');
    var colorValue = parseInt(colorThreeStr, 16);

    var material = new THREE.MeshPhongMaterial({
        color: colorValue,
        opacity: opacity,
        transparent: transparent,
        side: THREE.DoubleSide
    });

    viewer.impl.matman().addMaterial(
       _customMaterialPrefix + newGUID(),
        material,
        true);

    return material;
}

function newGUID() {
    
    var d = new Date().getTime();

    var guid = 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(
        /[xy]/g,
        function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });

    return guid;
}