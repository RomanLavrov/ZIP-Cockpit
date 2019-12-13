AutodeskNamespace("Autodesk.ADN.Viewing.Extension");
Autodesk.ADN.Viewing.Extension.Color = function (viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
    var overlayName = "temporary-colored-overlay";
    var _self = this;
    _self.load = function () {

        function addMaterial(color) {
            var material = new THREE.MeshPhongMaterial({
                color: color,
                ambient: 0xffffff,
                emissive: 0x111111,
                specular: 0x000000,
                flatShading: false,
                transparent: false,
                opacity: 0.5,
                wireframe: false,
                shininess: 0.5,
                vertexColors: THREE.NoColors              
            });

            viewer.impl.createOverlayScene(overlayName, material, null);
            return material;
        }

        Autodesk.Viewing.Viewer3D.prototype.setColorMaterial = function (objectIds, color) {
            var material = addMaterial(color);

            for (var i = 0; i < objectIds.length; i++) {
                var dbid = objectIds[i];

                //from dbid to node, to fragid
                var it = viewer.model.getData().instanceTree;

                it.enumNodeFragments(dbid, function (fragId) {
                    var renderProxy = viewer.impl.getRenderProxy(viewer.model, fragId);
                    renderProxy.meshProxy = new THREE.Mesh(renderProxy.geometry, renderProxy.material);
                    renderProxy.meshProxy.matrix.copy(renderProxy.matrixWorld);
                    //renderProxy.meshProxy.matrixWorldNeedsUpdate = true;
                    renderProxy.meshProxy.matrixAutoUpdate = false;
                    renderProxy.meshProxy.frustumCulled = false;
                    //renderProxy.meshProxy.color = 0xff0000;                    

                    viewer.impl.addOverlay(overlayName, renderProxy.meshProxy);
                    //viewer.impl.invalidate(true);  
                    //---------------------------------------------------------------------------------------------


                }, false);
            }
        }

        /*
        Autodesk.Viewing.Viewer3D.prototype.restoreColorMaterial = function (objectIds) {           

            for (var i = 0; i < objectIds.length; i++) {

                var dbid = objectIds[i];

                //from dbid to node, to fragid
                var it = viewer.model.getData().instanceTree;

                it.enumNodeFragments(dbid, function (fragId) {

                    var renderProxy = viewer.impl.getRenderProxy(viewer.model, fragId);

                    if (renderProxy.meshProxy) {

                        //remove all overlays with same name
                        viewer.impl.clearOverlay(overlayName);

                        //viewer.impl.removeOverlay(overlayName, renderProxy.meshProxy);
                        delete renderProxy.meshProxy;

                        //refresh the sence
                        viewer.impl.invalidate(true);
                    }

                }, true);
            }
        }*/

        _self.unload = function () {
            console.log('Autodesk.ADN.Viewing.Extension.Color unloaded');
            return true;
        };
        return true;
    }
};

jQuery.loadScript = function (url, callback) {
    jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
        async: true
    });
}

Autodesk.ADN.Viewing.Extension.Color.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
Autodesk.ADN.Viewing.Extension.Color.prototype.constructor = Autodesk.ADN.Viewing.Extension.Color;
Autodesk.Viewing.theExtensionManager.registerExtension('Autodesk.ADN.Viewing.Extension.Color', Autodesk.ADN.Viewing.Extension.Color);