console.log('Attribute extension loaded');
var viewer;
var tree;
window.panelDetectors;
window.panelViews;
window.panelOccupancy;
window.panelSensors;

import { ShowDetectors } from './Forge/Detectors.js';
import { ShowOccupancy } from './Forge/Occupancy.js';
import { ShowViews } from './Forge/Views.js';
import {ShowSensors} from './Forge/Sensors.js';

function AttributeExtension(_viewer, options) {
    viewer = _viewer;
    Autodesk.Viewing.Extension.call(this, viewer, options);
}

AttributeExtension.prototype.load = function () {
    console.log('AttributeExtension is loaded');
    viewer = this.viewer;

    //this.onSelectionBinded = this.onSelectionEvent.bind(this);
    //this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onSelectionBinded);
    this.onSelectionBinded = null;
    // var ext = this;

    Toolbar(viewer);
    /*
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
    });*/

    AttributeExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
    AttributeExtension.prototype.constructor = AttributeExtension;
    
    viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, function () {
        console.log('Tree loaded');
        tree = viewer.model.getData().instanceTree;
        var rootId = this.rootId = tree.getRootId();

        tree.enumNodeChildren(rootId, function (childId) {
            var childName = tree.getNodeName(childId);
            //detectors.push(childName);
        });

        //detectors = getAlldbIds(rootId, tree);


        //-----Zoom to selected sensor-----
        /*
        if (getParameter('SENSOR') !== undefined) {
            var sensorId = getParameter('SENSOR');
            viewer.search(sensorId, SearchResult);

            function SearchResult(idArray) {
                viewer.fitToView(idArray);
            }
        }*/
    });
    return true;
};

/*
AttributeExtension.prototype.onSelectionEvent = function () {
    var currentSelection = this.viewer.getSelection();
    var elementID = document.getElementById("elementID");
    //this.viewer.fitToView(currentSelection); // Scale screen to selected object!!!!
    var SelectedId = parseInt(currentSelection);

    getElementProperties(SelectedId);
};*/

//-----Toolbar Methods-----
function Toolbar(viewer) {
    var toolbarDivHtml = document.createElement('div');
    toolbarDivHtml.setAttribute('id', 'divToolbar');
    $(viewer.container).append(toolbarDivHtml);
    var toolbar = new Autodesk.Viewing.UI.ToolBar(true);
    var ctrlGroup = new Autodesk.Viewing.UI.ControlGroup("Autodesk.ADN.Viewing.Extension.Toolbar.ControlGroup2");
        
    var buttonDetectors = new Autodesk.Viewing.UI.Button('Detector', 'toolbar-button');
    buttonDetectors.addClass('toolbar-button');
    buttonDetectors.setToolTip('Show Detectors');
    buttonDetectors.onClick = function () {
        ShowSensors(viewer, viewer.container);
    }

    var buttonOccupancy = new Autodesk.Viewing.UI.Button('Occupancy', 'toolbar-button');
    buttonOccupancy.addClass('toolbar-button');
    buttonOccupancy.setToolTip('Show occupancy');
    buttonOccupancy.onClick = function(){
        ShowOccupancy(viewer, viewer.container);
    }

    var buttonViews = new Autodesk.Viewing.UI.Button('Views', 'toolbar-button');
    buttonViews.setToolTip('Show views');
    buttonViews.onClick = function(){
        ShowViews(viewer, viewer.container);
    }

    ctrlGroup.addControl(buttonDetectors);
    ctrlGroup.addControl(buttonOccupancy);
    ctrlGroup.addControl(buttonViews);

    toolbar.addControl(ctrlGroup);
    console.log("Toolbar added");
    $('#divToolbar')[0].appendChild(toolbar.container);
}

Autodesk.Viewing.theExtensionManager.registerExtension('AttributeExtension', AttributeExtension);

