var Mountains = function () {
    var groupHolder;

    var dae;
    var timeout
    var flotilla = []
    var material
    var mergedGeometry;
    var mountains

    var cubesOnly, trianglesOnly, noRotation

    var geos = [
        new THREE.BoxGeometry(1, 1, 1, 1, 1, 1), // boxes
        new THREE.OctahedronGeometry(.7, 1),
        new THREE.TetrahedronGeometry(1, 2),
        new THREE.TetrahedronGeometry(1, 0),
        new THREE.BoxGeometry(.1, 2, 1, 1, 1, 1) // wing
    ]

    function init() {
        
        var radius = 1000;
        groupHolder = new THREE.Object3D();
        VizHandler.getVizHolder().add(groupHolder);
        //reload()
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
        //console.log("Mountains.generate()")
        Math.seedrandomX(Generator.generatedName())

        for (var f = 0; f < flotilla.length; f++) {
            groupHolder.remove(flotilla[f])
            flotilla[f] = null;
        }
        flotilla = [];
        if (mountains) {
            groupHolder.remove(mountains)
            mountains.geometry.dispose()
            mountains = null;
        }

        var dmax = 60//20 + 30 * Math.randomX()
        var dmax2 = 3//1 + 3 * Math.randomX()

        var materials = Generator.getMaterials()

        for (var d = 0; d < dmax2; d++) {

            var mat = materials[Math.floor(Math.randomX() * materials.length)]

            cubesOnly = Math.randomX() < .3;
            trianglesOnly = Math.randomX() < .1;

            noRotation = false
            if (cubesOnly) {
                noRotation = Math.randomX() < .5;
            }
            var absmax = dmax / dmax2
            for (var a = 0; a < absmax; a++) {
                var distance = 150 + Math.randomX() * 250;
                var sin = a / absmax * Math.PI * 2
                var sin2 = Math.randomX() * Math.PI * 2
                var mainPos = new THREE.Vector3(
                        distance * Math.cos(sin) * Math.sin(sin2),
                        -Math.abs(distance * Math.sin(sin) * Math.sin(sin2))*.5,
                        distance * Math.cos(sin2)
                        )

                //

                var scale = Math.randomX() / 5 + .5
                var ship = new THREE.Object3D();

                for (var n = 0; n < 1; n++) {
                    //console.log(n)
                    //var mat = material//.clone()
                    var max = 3 + 3 * scale + 3 * scale * Math.randomX()

                    var roz = 30
                    var prevPos = new THREE.Vector3()
                    prevPos.x = 0//(Math.randomX() - .5) * roz * (scale * 2 + 1);
                    prevPos.y = (Math.randomX() - .5) * roz * (scale * 2 + 1) / 2;
                    prevPos.z = (Math.randomX() - .5) * roz * (scale * 2 + 1);

                    for (var i = 0; i < max; i++) {
                        var geo = geos[Math.floor(Math.randomX() * geos.length)].clone();
                        if (cubesOnly) {
                            geo = geos[0].clone()
                        } else if (trianglesOnly) {
                            geo = geos[3].clone()
                        }
                        var groz = Math.randomX() * 1.1 + .7
                        if (!cubesOnly) {
                            for (var j = 0; j < geo.vertices.length; j++) {
                                geo.vertices[j].x += (Math.randomX() - .5) * groz;
                                geo.vertices[j].y += (Math.randomX() - .5) * groz;
                                geo.vertices[j].z += (Math.randomX() - .5) * groz;
                            }
                        }

                        var mesh = new THREE.Mesh(geo, mat);

                        var ran = 10 * (Math.randomX() * 1.5 + 1.5 + scale * 1) + mainPos.distanceTo(new THREE.Vector3()) / 15;
                        mesh.scale.set(ran, ran, ran);

                        //while (mesh.position.distanceTo(new THREE.Vector3())<50*ran){

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
                        mesh.position.x = mainPos.x+prevPos.x + dis.x;
                        mesh.position.y = mainPos.y+prevPos.y + dis.y;
                        mesh.position.z = mainPos.z+prevPos.z + dis.z;
                        //}
                        //console.log(mesh.position.distanceTo(new THREE.Vector3()),ran/2)
                        while (mesh.position.distanceTo(new THREE.Vector3()) < ran *2.7) {
                            //console.log(a,i,mesh.position.distanceTo(new THREE.Vector3()), ran)
                            mesh.position.x *= 1.1
                            mesh.position.y *= 1.1
                            mesh.position.z *= 1.1
                        }

                        if (!noRotation)
                            mesh.lookAt(prevPos);
                        prevPos = new THREE.Vector3(prevPos.x + dis.x,prevPos.y + dis.y,prevPos.z + dis.z)

                        mesh.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(mesh.rotation.x));
                        mesh.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(mesh.rotation.y));
                        mesh.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(mesh.rotation.z));
                        mesh.rotation.set(0, 0, 0);

                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        ship.add(mesh)
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

                ship.castShadow = true;
                ship.receiveShadow = true;
                //*/

                //

                //groupHolder.add(ship)

                //

                flotilla.push(ship);
            }
        }

        var geom = new THREE.Geometry()
        for (var f = 0; f < flotilla.length; f++) {
            var l = flotilla[f].geometry.faces.length
            for (var j = 0; j < l; j++) {
                var id = 0
                flotilla[f].geometry.faces[j].materialIndex = flotilla[f].material.materialID;
            }
            flotilla[f].updateMatrix();
            geom.merge(flotilla[f].geometry, flotilla[f].matrix, 0);
        }
        mountains = new THREE.Mesh(geom, Generator.getMergedMaterial());
        mountains.castShadow = true;
        mountains.receiveShadow = true;
        //mountains.rotation.y = Math.PI * Math.randomX() * 2
        groupHolder.add(mountains)
        mergedGeometry = geom;

        //clearTimeout(timeout);
        //timeout = setTimeout(generate, 15000)
    }

    function changeVisibility() {
        groupHolder.visible = ControlsHandler.fxParams.mountains;
    }

    function hide() {
        groupHolder.visible = false;
    }

    function animate(hitPosition) {
    }

    function setEnvMap(cubeMap) {
        material.envMap = cubeMap;
    }

    return {
        init: init,
        generate: generate,
        setEnvMap: setEnvMap,
        mergedGeometry: function () {
            return mergedGeometry
        },
        changeVisibility: changeVisibility,
    }

}
();