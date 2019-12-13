console.log('Occupancy script loaded');

var rooms=[];

function ShowOccupancy() {
    console.log("Show Occupancy");
    if (window.panelOccupancy == undefined) {
        window.panelOccupancy = new OccupancyPanel(
            viewer, viewer.container, 'occupancyPanel', 'Occupancy');
    }

    window.panelOccupancy.setVisible(!window.panelOccupancy.isVisible());
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
                utilisation: Math.random();
            }
            rooms.push(room);
        }
    });
}