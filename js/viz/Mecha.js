var Mecha = function () {
    var groupHolder;
    var multiMaterial

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
    var distance = 100
    var timeout;
    function init() {

        //init event listeners
        events.on("update", update);
        events.on("onBeat", onBeat);
        groupHolder = new THREE.Object3D();
        VizHandler.getVizHolder().add(groupHolder);
        reload()
    }

    function reload() {
        if (dae) {
            groupHolder.remove(dae);
            dae.geometry.dispose();
            dae = null;
        }

        var shininess = 50, specular = 0xffffff, bumpScale = .055, shading = THREE.SmoothShading;
        var reflectionCube = Assets.getCubeMap(31)
        reflectionCube.format = THREE.RGBFormat;
        var roughness = .7;
        var metalness = .7;
        var diffuseColor = new THREE.Color(1, 1, 1);
        material = new THREE.MeshStandardMaterial({
            bumpScale: bumpScale,
            color: diffuseColor,
            metalness: metalness,
            //fog: false,
            roughness: roughness,
            shading: THREE.FlatShading,
            envMap: reflectionCube,
            side: THREE.FrontSide,
            //depthWrite:false,
            //depthTest:false,
            //blendEquation:THREE.MinEquation
        })

        generate();
    }

    function generateArmy() {
        if (ControlsHandler.fxParams.time > .4) {
            generate(2, 2, 2)
        } else {
            generate(3, 3, 3)

        }
    }

    function generate(mx, my, mz) {
        //console.log('gen'+Math.random())
        //console.log('AA')
        if (!mx)
            mx = 0
        if (!my)
            my = 0
        if (!mz)
            mz = 0
        for (var i = 0; i < flotilla.length; i++) {
            groupHolder.remove(flotilla[i])
            flotilla[i] = null;
        }
        flotilla = []
        var quality = 1;

        /*material.color.setHSL(Math.random(), 0, Math.random());
        if (ControlsHandler.fxParams.envMap >= 5)
            material.color.setHSL(Math.random(), .4, .8);*/
        
        material.color.setHSL(Math.random(),.2,.8)

        for (var x = -mx; x <= mx; x++) {
            for (var y = 0; y <= my; y++) {
                for (var z = -mz; z <= mz; z++) {
                    var pos = {x: x * distance + 0 * (Math.random() - .5) * distance / 2, y: y * distance + 0 * Math.random() * distance / 4, z: z * distance + 0 * (Math.random() - .5) * distance / 2}
                    if (x != 0)
                        quality = .1
                    var ship = spaceship(pos, quality)
                    flotilla.push(ship)
                }
            }
        }
        //clearTimeout(timeout);
        //timeout = setTimeout(generate, 15000)
    }


    function spaceship(pos, quality) {
        var scale = Math.random() / 5;//ControlsHandler.fxParams.time;
        var ship = new THREE.Object3D();

        var mat = material//.clone()
        //mat.color = new THREE.Color(Math.random() * 0xFFFFFF)
        //mat.color.setHSL(Math.random(), .2, .8)
        if (quality == 1)
            quality = .1 + .9 * ControlsHandler.fxParams.time;
        var num = 5 * quality;
        for (var n = 0; n < num; n++) {
            //console.log(n)
            //mat.color.setHSL(Math.random(), 0, Math.random() * .3 + .7)
            var max = (3 + 10 * scale + 10 * scale * Math.random()) * quality

            var cubesOnly = Math.random() < .3;
            var trianglesOnly = Math.random() < .3;
            cubesOnly = trianglesOnly = false;

            var roz = 10
            var prevPos = new THREE.Vector3()
            if (!ControlsHandler.fxParams.center || ControlsHandler.fxParams.time > .1) {

                prevPos.x = 0//(Math.random() - .5) * roz * (scale * 2 + 1);
                prevPos.y = (Math.random() - .5) * roz * (scale * 2 + 1) / 2;
                prevPos.z = (Math.random() - .5) * roz * (scale * 2 + 1);
            }
            var geos = [
                new THREE.BoxGeometry(1, 1, 1, 1, 1, 1),
                new THREE.OctahedronGeometry(1, 1),
                new THREE.TetrahedronGeometry(1, 2),
                new THREE.TetrahedronGeometry(1, 0)
            ]

            for (var i = 0; i < max; i++) {
                var geo = geos[Math.floor(Math.random() * geos.length)].clone();
                if (cubesOnly)
                    geo = geos[0].clone()
                if (trianglesOnly)
                    geo = geos[3].clone()
                var groz = Math.random() * 1.1 + .7
                if (!cubesOnly && !trianglesOnly) {
                    for (var j = 0; j < geo.vertices.length; j++) {
                        geo.vertices[j].x += (Math.random() - .5) * groz;
                        geo.vertices[j].y += (Math.random() - .5) * groz;
                        geo.vertices[j].z += (Math.random() - .5) * groz;
                    }
                }

                var mesh = new THREE.Mesh(geo, mat);

                var ran = (Math.random() * 2 + 2 + scale * 1) * (1 + (1 / quality) / 4);
                mesh.scale.set(ran, ran, ran);

                var disVal = ran * 1.3;
                var u = Math.random() * Math.PI * 2;
                var v = Math.random() * Math.PI * 2;

                var dis = new THREE.Vector3();
                //if (i != 0) {
                dis.x = disVal * Math.sin(u) * Math.sin(v) * 1.5;
                dis.y = disVal * Math.cos(v);
                dis.z = disVal * Math.cos(u) * Math.sin(v) * 1.5;
                //}

                var roz = 10;

                mesh.position.x = prevPos.x + dis.x;
                mesh.position.y = prevPos.y + dis.y;
                mesh.position.z = prevPos.z + dis.z;

                //mesh.lookAt(prevPos);
                prevPos = mesh.position.clone();

                /*mesh.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(mesh.rotation.x));
                 mesh.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(mesh.rotation.y));
                 mesh.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(mesh.rotation.z));
                 mesh.rotation.set(0, 0, 0);*/

                mesh.castShadow = true;
                mesh.receiveShadow = true;
                ship.add(mesh)

                //if (Math.random() < .9) {
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
                ship.add(mesh2)
                //mesh.frustumCulled = false;
                //mesh2.frustumCulled = false;
                //}
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

        var vert = ship.geometry.vertices
        for (var i = 0; i < vert.length; i++) {
            vert[i].ox = vert[i].x;
            vert[i].oy = vert[i].y;
            vert[i].oz = vert[i].z;
        }
        //ship.frustumCulled = false;
        ship.castShadow = true;
        ship.receiveShadow = true;
        //*/

        //

        groupHolder.add(ship)
        ship.position.set(pos.x, pos.y + 1, pos.z)

        return ship;
    }

    function anim(dae) {
        var vert = dae.geometry.vertices
        for (var i = 0; i < vert.length; i++) {
            var j = Math.floor(i + mod) % 8;
            var scales = (AudioHandler.getLevelsData()[j] * AudioHandler.getLevelsData()[j]) * .5 - .08;


            if (Math.abs(vert[i].x) * 1 < Math.abs(vert[i].ox * (1 + scales))) {
                vert[i].x = vert[i].ox * (1 + scales)
                vert[i].y = vert[i].oy * (1 + scales)
                vert[i].z = vert[i].oz * (1 + scales)
            } else {
                vert[i].x -= (vert[i].x - vert[i].ox) / 25
                vert[i].y -= (vert[i].y - vert[i].oy) / 25
                vert[i].z -= (vert[i].z - vert[i].oz) / 25

            }

        }
        dae.geometry.verticesNeedUpdate = true;
        //dae.geometry.normalsNeedUpdate = true;
        //dae.geometry.computeFaceNormals();
        //dae.geometry.computeVertexNormals();
    }




    function update() {
        speed += .01
        for (var f = 0; f < flotilla.length; f++) {
            var ship = flotilla[f]
            //flotilla[i].position.y = Math.sin(speed + i) / 1 + 5 + 5 * Math.sin(i * 10)
            if (ControlsHandler.fxParams.fly) {
                ship.position.z -= .05
                if (ship.position.z < -distance * 3)
                    ship.position.z += distance * 3 * 2;
            }

            if (ControlsHandler.fxParams.center && !ControlsHandler.fxParams.army)
                ship.position.set(0, 0, 0)

            if (ControlsHandler.fxParams.meshReact && ship.position.distanceTo(VizHandler.getCamera().position) < 280)
                anim(flotilla[f])
        }



        var scale = ControlsHandler.fxParams.time

        /*for (var i = 0; i < flotilla.length; i++) {
         var ship = flotilla[i]
         //for (var j = 0; j < ship.children.lenght; j++) {
         //var side = ship.children[j]
         for (var k = 0; k < ship.children.length; k++) {
         var piece = ship.children[k]
         //console.log(piece)
         piece.position.x *= 1 + scale / 600
         piece.position.y *= 1 + scale / 600
         piece.position.z *= 1 + scale / 600
         piece.rotation.x += Math.sin(k) * scale / 300
         piece.rotation.y += Math.sin(k) * scale / 300
         
         }
         //}
         }*/

        /*if (!dae)
         return;
         
         speed -= speed / 70;
         if (speed > .015)
         return;
         var tspeed = 0
         if (back) {
         for (var i = 0; i < dae.children.length; i++) {
         var c = dae.children[i]
         var spd = 3
         if (spd < 1)
         spd = 1;
         c.position.x -= (c.position.x - c.orgPosition.x) / spd;
         c.position.y -= (c.position.y - c.orgPosition.y) / spd;
         c.position.z -= (c.position.z - c.orgPosition.z) / spd;
         c.rotation.x -= c.rotation.x / spd;
         c.rotation.y -= c.rotation.y / spd;
         c.rotation.z -= c.rotation.z / spd;
         }
         } else {
         for (var i = 0; i < dae.children.length; i++) {
         var c = dae.children[i]
         c.position.x += c.speed.x;
         c.position.y += c.speed.y;
         c.position.z += c.speed.z;
         c.rotation.x += c.rotationSpeed.x
         c.rotation.y += c.rotationSpeed.y
         c.rotation.z += c.rotationSpeed.z
         c.speed.x -= c.speed.x / 15
         c.speed.y -= c.speed.y / 15
         c.speed.z -= c.speed.z / 15
         c.rotationSpeed.x -= c.rotationSpeed.x / 15
         c.rotationSpeed.y -= c.rotationSpeed.y / 15
         c.rotationSpeed.z -= c.rotationSpeed.z / 15
         }
         }*/
    }

    function onBeat() {
        /*if (Math.random() < .2) {
         goBack();
         return;
         }
         var point = new THREE.Vector3()
         var s = Math.random() * Math.PI
         var t = Math.random() * Math.PI
         var r = 4;
         point.x = r * Math.cos(s) * Math.sin(t)
         point.y = r * Math.sin(s) * Math.sin(t)
         point.z = r * Math.cos(t)
         animate(point)*/
    }

    function prerender() {
        //plane.visible = false;
    }

    function postrender() {
        //plane.visible = true;
    }

    function setEnvMap(cubeMap) {
        if(material)material.envMap = cubeMap;
    }
    function getRandomOne() {
        return flotilla[Math.floor(Math.random() * flotilla.length)]
    }

    return {
        init: init,
        update: update,
        onBeat: onBeat,
        generate: generate,
        generateArmy: generateArmy,
        prerender: prerender,
        postrender: postrender,
        setEnvMap: setEnvMap,
        getRandomOne: getRandomOne,
    }

}
();