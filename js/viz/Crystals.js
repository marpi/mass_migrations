var Crystals = function () {
    var groupHolder;

    var drewNewShape = false;
    var scl = 0;
    var dae;
    var spd = 0;
    var mod = 0;
    var speed = .035;
    var back = false;
    var main;
    var timeout
    var flotilla = []
    var isMobile = {any: false};
    var plane;
    var material
    var distance = 80
    var timeout;
    var mergedGeometry;


    var geos = [
        new THREE.TetrahedronGeometry(1, 0)
    ]

    function init() {

        //init event listeners

        var radius = 1000;
        groupHolder = new THREE.Object3D();
        Crystals.changeVisibility();
        VizHandler.getVizHolder().add(groupHolder);

    }

    function reload() {
        if (dae) {
            groupHolder.remove(dae);
            dae.geometry.dispose();
            dae = null;
        }

        generate();
    }

    function generate() {
        Math.seedrandomX(Generator.generatedName())

        var materials = Generator.getMaterials()
        material = materials[Math.floor(Math.randomX() * materials.length)]

        for (var i = 0; i < flotilla.length; i++) {
            groupHolder.remove(flotilla[i])
            flotilla[i] = null;
        }
        flotilla = [];
        var ship = spaceship();
        flotilla.push(ship);
        //clearTimeout(timeout);
        //timeout = setTimeout(generate, 15000)
    }


    function spaceship(pos) {
        var scale = Math.randomX() / 5 + .9 * ControlsHandler.fxParams.time
        var ship = new THREE.Object3D();
        var centerPos = new THREE.Vector3();

        var mat = material//.clone()
        var smax = 350 + 300 * Math.randomX()
        for (var n = 0; n < smax; n++) {
            //console.log(n)
            var max = 1//3 + 20 * scale + 20 * scale * Math.randomX()

            var cubesOnly = Math.randomX() < .3;
            var trianglesOnly = Math.randomX() < .3;
            cubesOnly = trianglesOnly = false;

            var roz = 200
            var prevPos = new THREE.Vector3()
            prevPos.x = (Math.randomX() - .5) * roz;
            prevPos.y = (Math.randomX() - .5) * roz;
            prevPos.z = (Math.randomX() - .5) * roz;

            for (var i = 0; i < max; i++) {
                var geo = geos[Math.floor(Math.randomX() * geos.length)].clone();
                if (cubesOnly)
                    geo = geos[0].clone()
                if (trianglesOnly)
                    geo = geos[3].clone()
                var groz = Math.randomX() * 1.1 + .7
                if (!cubesOnly && !trianglesOnly) {
                    for (var j = 0; j < geo.vertices.length; j++) {
                        geo.vertices[j].x += (Math.randomX() - .5) * groz;
                        geo.vertices[j].y += (Math.randomX() - .5) * groz;
                        geo.vertices[j].z += (Math.randomX() - .5) * groz;
                    }
                }

                var mesh = new THREE.Mesh(geo, mat);
                var ran = .1
                var disVal = ran * 1.3;
                var u = Math.randomX() * Math.PI * 2;
                var v = Math.randomX() * Math.PI * 2;

                var dis = new THREE.Vector3();
                //if (i != 0) {
                dis.x = disVal * Math.sin(u) * Math.sin(v) * 1.5;
                dis.y = disVal * Math.cos(v);
                dis.z = disVal * Math.cos(u) * Math.sin(v);
                //}

                var roz = 10;
                mesh.position.x = prevPos.x + dis.x;
                mesh.position.y = prevPos.y + dis.y;
                mesh.position.z = prevPos.z + dis.z;
                //console.log(prevPos.x, dis.x)
                ran = .1 + mesh.position.distanceTo(ship.position) / 100
                if (Math.randomX() > .4) {
                    ran *= 1 + Math.randomX() * 4
                }
                mesh.scale.set(ran, ran, ran);

                mesh.lookAt(prevPos);
                prevPos = mesh.position.clone();

                mesh.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(mesh.rotation.x));
                mesh.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(mesh.rotation.y));
                mesh.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(mesh.rotation.z));
                mesh.rotation.set(0, 0, 0);

                mesh.castShadow = true;
                mesh.receiveShadow = true;
                ship.add(mesh)

                /*//if (Math.randomX() < .9) {
                 var mesh2 = mesh.clone()
                 mesh2.geometry = mesh2.geometry.clone()
                 for (var j = 0; j < mesh2.geometry.vertices.length; j++) {
                 mesh2.geometry.vertices[j].x = -mesh2.geometry.vertices[j].x
                 }
                 
                 for (var j = 0; j < mesh2.geometry.faces.length; j++) {
                 var a = mesh2.geometry.faces[j].a
                 mesh2.geometry.faces[j].a = mesh2.geometry.faces[j].b
                 mesh2.geometry.faces[j].b = a
                 }
                 //mesh2.geometry.applyMatrix(new THREE.Matrix4().makeScale(-1,1,1))
                 
                 mesh2.position.x = -mesh.position.x
                 shipRight.add(mesh2)
                 //mesh.frustumCulled = false;
                 //mesh2.frustumCulled = false;
                 //}*/
            }
        }
        // MERGE

        //*/
        var geom = new THREE.Geometry()
        for (var i = 0; i < ship.children.length; i++) {
            ship.children[i].updateMatrix();
            geom.merge(ship.children[i].geometry, ship.children[i].matrix);
        }
        ship = new THREE.Mesh(geom, mat);
        mergedGeometry = geom;

        /*var vert = ship.geometry.vertices
         for (var i = 0; i < vert.length; i++) {
         vert[i].ox = vert[i].x;
         vert[i].oy = vert[i].y;
         vert[i].oz = vert[i].z;
         }*/
        //ship.frustumCulled = false;
        ship.castShadow = true;
        ship.receiveShadow = true;
        //*/

        //

        groupHolder.add(ship)

        return ship;
    }

    function animate(hitPosition) {
    }

    function setEnvMap(cubeMap) {
        material.envMap = cubeMap;
    }

    function changeVisibility() {
        groupHolder.visible = ControlsHandler.fxParams.crystals;
    }

    return {
        init: init,
        generate: generate,
        setEnvMap: setEnvMap,
        changeVisibility: changeVisibility,
        mergedGeometry: function () {
            return mergedGeometry
        }
    }

}
();