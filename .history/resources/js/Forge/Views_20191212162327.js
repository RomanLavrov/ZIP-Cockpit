function ShowViews(viewer, container, panelViews) {
    console.log("Show Views");

    if (window.panelViews === undefined) {
        window.panelViews = new ViewsPanel(viewer, viewer.container, 'viewsPanel', 'Views');
    }
    // show/hide docking panel
    
    window.panelViews.setVisible(!window.panelViews.isVisible());
}

function ViewsPanel(viewer, container, id, title, options) {

    Autodesk.Viewing.UI.DockingPanel.call(this, container, id, title, options);

    this.container.classList.add('docking-panel-container-solid-color-a');
    this.container.style.top = "50px";
    this.container.style.left = "340px";
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
    //panel.className = ('panel panel-default');

    var table = document.createElement('table');
    table.className = 'table table-bordered table-inverse';
    table.setAttribute('id', 'viewsTable');

    var header = document.createElement('thead');
    var body = document.createElement('tbody')

    var headerTitle = document.createElement('th');
    headerTitle.innerHTML = "Views";

    var headerType = document.createElement('th');
    headerType.innerHTML = "Type";

    var views = getViews();
    var index = 0;
    views.forEach(element => {
        //console.log(element);
        var row = document.createElement('tr');
        row.dataset.viewId = index;

        var dataName = document.createElement('td');
        dataName.innerHTML = element['name'];

        var dataType = document.createElement('td');
        dataType.innerHTML = element['role'];

        row.onclick = function () {
            loadView(viewer, row.dataset.viewId)
        };
        index++;
        row.appendChild(dataName);
        row.appendChild(dataType);
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
ViewsPanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype);
ViewsPanel.prototype.constructor = ViewsPanel;

function getViews() {
    var xmlHttpViews = new XMLHttpRequest();
    var link = 'https://developer.api.autodesk.com/modelderivative/v2/designdata/' + window.currentURN + '/metadata';
    console.log(link);
    xmlHttpViews.open('GET', 'https://developer.api.autodesk.com/modelderivative/v2/designdata/' + window.currentURN + '/metadata', false);

    xmlHttpViews.setRequestHeader("Authorization", "Bearer " + window.token, );
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

function loadView(viewer, index) {
    viewer.tearDown();
    viewer.start();
    var geometries = window.viewerDocument.getRoot().search({'type':'geometry'});
    const path =window.viewerDocument.getViewablePath(geometries[index]);
    viewer.loadModel(path)
}

export {
    ShowViews
};
