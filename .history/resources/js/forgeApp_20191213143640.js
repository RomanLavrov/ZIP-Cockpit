require('./bootstrap');
window.currentURN;
window.viewerDocument;
window.viewer;
window.model;

$(document).ready(function () {
    console.log('Forge Started');
    var forgeDiv = document.getElementById('forgeDiv');
    window.token = forgeDiv.dataset.token;
    //console.log(token);
    //window.currentURN = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWlvdC9JUFoyLnJ2dA'; //Sensors Drawing
    window.currentURN = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWlvdC9JUFpfSExLU18yMC5ud2Q'; //Rooms Drawing
    window.currentURN = "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWlvdC9JUFpfSExLU18yMC5ydnQ"

    var viewer;
    var options = {
        env: 'AutodeskProduction',
        accessToken: token,
        api: 'derivativeV2' // for models uploaded to EMEA change this option to 'derivativeV2_EU'
    };
    var documentId = 'urn:' + currentURN;
    Autodesk.Viewing.Initializer(options, function onInitialized() {
        Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure)
    });
    /**
     * Autodesk.Viewing.Document.load() success callback.
     * Proceeds with model initialization.
     */
    function onDocumentLoadSuccess(doc) {
        //console.log(doc);
        window.viewerDocument = doc;
        // A document contains references to 3D and 2D geometries.
        var geometries = doc.getRoot().search({
            'type': 'geometry'
        });
        if (geometries.length === 0) {
            console.error('Document contains no geometries.');
            return;
        }

        // Choose any of the avialable geometries
        var initGeom = geometries[0];

        // Create Viewer instance
        var viewerDiv = forgeDiv;
        var config = {
            //extensions: initGeom.extensions() || []
            extensions: ["AttributeExtension"]
        };
        viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv, config);

        // Load the chosen geometry
        var svfUrl = doc.getViewablePath(initGeom);
        var modelOptions = {
            sharedPropertyDbPath: doc.getPropertyDbPath()
        };
        viewer.start(svfUrl, modelOptions, onLoadModelSuccess, onLoadModelError);
    }

    /**
     * Autodesk.Viewing.Document.load() failure callback.
     */
    function onDocumentLoadFailure(viewerErrorCode) {
        console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
    }

    /**
     * viewer.loadModel() success callback.
     * Invoked after the model's SVF has been initially loaded.
     * It may trigger before any geometry has been downloaded and displayed on-screen.
     */
    function onLoadModelSuccess(model) {
        //console.log('onLoadModelSuccess()!');
        console.log('Validate model loaded: ' + (viewer.model === model));
        //console.log("MODEL");
        //console.log(model);
        window.model = model;
        window.viewer = viewer;
        //console.log("SCENE");
        //console.log(viewer.impl.scene);

      
/*
        viewer.addEventListener(
            Autodesk.Viewing.SELECTION_CHANGED_EVENT,
            onItemSelected);*/

    }

    /**
     * viewer.loadModel() failure callback.
     * Invoked when there's an error fetching the SVF file.
     */
    function onLoadModelError(viewerErrorCode) {
        console.error('onLoadModelError() - errorCode:' + viewerErrorCode);
    }

    //------------------------Markup

    var detectors = [];
/*
    function onItemSelected(event) {
        var bBox = getModifiedWorldBoundingBox(
            event.fragIdsArray,
            viewer.model.getFragmentList()
        );
        console.log("B-BOX");
        console.log(bBox);
        // drawBox(bBox.min, bBox.max);
    }*/

   
    function getModifiedWorldBoundingBox(fragIds, fragList) {

        var fragbBox = new THREE.Box3();
        var nodebBox = new THREE.Box3();

        fragIds.forEach(function (fragId) {

            fragList.getWorldBounds(fragId, fragbBox);
            nodebBox.union(fragbBox);
        });
        console.log(nodebBox);
        //detectors.push(nodebBox);

        //viewer.loadExtension("markup3d");
        //initializeMarkup(detectors);

        return nodebBox;
    }
   
   
    
    
});
