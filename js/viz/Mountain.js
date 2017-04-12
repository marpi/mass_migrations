var Mountain = function () {

    var groupHolder;
    var material;

    var drewNewShape = false;

    var scl = 0;
    var dae;
    var spd = 0;
    var mod = 0;
    var objects = [];

    function init() {

        //init event listeners
        events.on("update", update);
        events.on("onBeat", onBeat);


        var radius = 1000;
        groupHolder = new THREE.Object3D();
        VizHandler.getVizHolder().add(groupHolder);


        //material = new THREE.MeshBasicMaterial( { envMap: VizHandler.getCubeCameras()[1].renderTarget,reflectivity:.5, blending: THREE.AdditiveBlending,shading: THREE.FlatShading } );//,shading: THREE.FlatShading
        material = new THREE.MeshBasicMaterial({
            envMap: Assets.textureCube(),
            reflectivity: 1,
            blending: THREE.AdditiveBlending,
            shading: THREE.FlatShading
        });//,shading: THREE.FlatShading

        reload()
    }

    function reload() {

        var imgTexture = new THREE.TextureLoader().load("textures/white.jpg");
        imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;
        //imgTexture = null;

        var shininess = 50, specular = 0xffffff, bumpScale = 1, shading = THREE.SmoothShading;

        var reflectionCube = Assets.getCubeMap(2)
        reflectionCube.format = THREE.RGBFormat;

        var cubeWidth = 15000;
        
        //var geometry = new THREE.SphereBufferGeometry(sphereRadius, 3, 2);
        var geometry = new THREE.CylinderGeometry(0,500,1000,3)
        //var geometry = new THREE.BoxGeometry(sphereRadius, sphereRadius, sphereRadius, 1, 1, 1);

        var roughness = .9;
        var diffuseColor = new THREE.Color(.9,.9,.9);
        var metalness = 1;
        var material = new THREE.MeshStandardMaterial({
            map: imgTexture, 
            bumpMap: imgTexture,
            bumpScale: bumpScale,
            color: diffuseColor,
            metalness: metalness,
            roughness: roughness,
            shading: THREE.SmoothShading,
            envMap: reflectionCube,
            //shading: THREE.FlatShading
        })

        // basic monochromatic energy preservation
        var mesh = new THREE.Mesh(geometry, material);

        objects.push(mesh);

        groupHolder.add(mesh);
    }

    function update() {
        for (var i = 0; i < objects.length; i++) {
            var o = objects[i]
            o.rotation.y += .01
        }
    }

    function onBeat() {
    }

    return {
        init: init,
        update: update,
        onBeat: onBeat,
    };

}();