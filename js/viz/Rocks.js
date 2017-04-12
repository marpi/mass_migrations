var Rocks = function () {

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

        var reflectionCube = Assets.getCubeMap(8)
        reflectionCube.format = THREE.RGBFormat;

        var cubeWidth = 15000;
        var numberOfSphersPerSide = 10;
        var sphereRadius = (cubeWidth / numberOfSphersPerSide) * 0.8 * 0.5;
        var stepSize = 1.0 / numberOfSphersPerSide;

        //var geometry = new THREE.SphereBufferGeometry(sphereRadius, 3, 2);
        var geometry = new THREE.TetrahedronGeometry(500)
        //var geometry = new THREE.BoxGeometry(sphereRadius, sphereRadius, sphereRadius, 1, 1, 1);

        var roughness = .5;
        var diffuseColor = new THREE.Color(1, 1, 1);
        var metalness = 1;
        var material = new THREE.MeshStandardMaterial({
            //map: imgTexture, 
            bumpMap: imgTexture,
            bumpScale: bumpScale,
            color: diffuseColor,
            metalness: metalness,
            roughness: roughness,
            shading: THREE.SmoothShading,
            envMap: reflectionCube,
            shading: THREE.FlatShading
        })

        for (var alpha = 0, alphaIndex = 0; alpha <= 1.0; alpha += stepSize, alphaIndex++) {

            for (var beta = 0; beta <= 1.0; beta += stepSize) {
                for (var gamma = 0; gamma <= 1.0; gamma += stepSize) {

                    // basic monochromatic energy preservation
                    var mesh = new THREE.Mesh(geometry, material);

                    mesh.position.x = alpha * cubeWidth - cubeWidth / 2 - stepSize * cubeWidth;
                    mesh.position.y = beta * cubeWidth - cubeWidth / 2 - stepSize * cubeWidth;
                    mesh.position.z = gamma * cubeWidth - cubeWidth / 2 - 4000 + Math.random() * 2000;
                    mesh.rotation.x = Math.random() * 3;
                    mesh.rotation.y = Math.random() * 3;

                    objects.push(mesh);

                    groupHolder.add(mesh);
                }
            }
        }
    }

    function update() {
        for (var i = 0; i < objects.length; i++) {
            var o = objects[i]
            o.rotation.x += .01
            o.rotation.y += .01

            o.position.z += 10
            if (o.position.z > 0) {
                o.position.z -= 10000;
            }
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