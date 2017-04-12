var Generator = function () {
    var MAX_MATERIALS = 30;
    var materials, material, mainMaterial;

    var generatedName;

    var geo
    var geos
    var palette = []

    var lastShip;

    function init() {
        Math.seedrandomX('init')

        geo = new THREE.BoxGeometry(1, 1, 1)

        geos = [
            new THREE.BoxGeometry(1, 1, 1, 1, 1, 1), // boxes
            new THREE.OctahedronGeometry(1, 1),
            new THREE.TetrahedronGeometry(1, 2),
            new THREE.TetrahedronGeometry(1, 0),
            addGeom(Grid(new THREE.TetrahedronGeometry(.4, 1)), [0, 0, 0], [0, 0, 0], [1, 1, 1]), // bubbles
            new THREE.BoxGeometry(.4, 4, 1.5, 1, 1, 1), // wing
            addGeom(new THREE.CylinderGeometry(0, .3, 3, 3), [0, 0, 0], [0, 1.5, 0], [1, 1, 1]), // spike
            addGeom(Minerals(new THREE.TetrahedronGeometry(20, 0)), [0, 0, 0], [0, 0, 0], [1, 1, 1]), //horns
            addGeom(Minerals(new THREE.TetrahedronGeometry(20, 0)), [0, 0, Math.PI], [0, 0, 0], [1, 1, 1]) //bottom horns

        ]
        /*geos = [
         
         ]*/

        //

        var shininess = 50, specular = 0xffffff, bumpScale = .055, shading = THREE.SmoothShading;
        var reflectionCube = Assets.getMainCubeMap()
        reflectionCube.format = THREE.RGBFormat;
        var roughness = .7;
        var metalness = .7;
        var diffuseColor = new THREE.Color(1, 1, 1);

        if (document.getElementById('scheme')) {
            var image = document.getElementById('scheme')
            var colorThief = new ColorThief();
            palette = colorThief.getPalette(image, MAX_MATERIALS + 2);
            console.log(JSON.stringify(palette))
        } else {
            //red-gray palette = [[107,90,107],[16,12,15],[76,76,100],[210,89,57],[161,147,132],[202,198,171],[220,216,191],[146,124,119],[174,153,132],[192,171,143],[236,188,146],[244,212,173],[191,166,131],[175,169,150],[74,76,66],[241,232,210],[213,183,144],[185,68,56],[188,187,163],[91,85,98],[229,220,204],[65,56,82],[228,228,196],[100,76,108],[50,38,48],[164,172,153],[246,228,194],[237,196,148],[132,110,114],[122,108,112],[90,75,108],[84,67,92],[243,219,190],[132,140,120],[228,204,169],[76,63,88],[212,212,179],[42,39,64],[89,76,97],[220,200,167],[153,64,63],[75,66,100],[165,129,117],[252,235,211],[217,107,90],[198,180,156],[161,162,148],[124,99,110],[237,196,156],[220,220,204],[180,188,160],[164,140,108],[123,47,31],[215,176,132],[205,188,156],[128,128,115],[17,14,45],[52,46,72],[228,228,204],[64,50,60],[251,248,228],[150,130,132],[58,26,35],[100,75,97],[140,132,140],[70,53,68],[186,119,98],[105,50,51],[240,204,156],[111,73,93],[37,20,45],[132,116,132],[163,164,140],[141,108,111],[61,44,70],[148,93,92],[44,44,36],[172,155,148],[103,86,92],[188,180,148],[84,36,44],[85,62,76],[214,152,126],[162,140,116],[53,36,61],[251,252,217],[140,141,128],[118,99,124],[157,85,100],[108,96,84],[147,118,100],[188,156,156],[180,180,172],[244,228,180],[84,52,76],[86,63,68],[164,164,164],[140,100,102],[228,204,148],[196,212,188],[40,36,172]];
            palette = [
                [233, 234, 227],
                [117, 74, 47],
                [148, 138, 59],
                [123, 132, 133],
                [182, 124, 121],
                [54, 42, 36],
                [214, 179, 104],
                [164, 176, 161],
                [219, 68, 94],
                [162, 205, 53],
                [200, 200, 200],
                [202, 164, 144],
                [218, 177, 111],
                [226, 201, 133],
                [224, 219, 187],
                [113, 184, 195],
                [76, 91, 59],
                [80, 74, 96],
                [184, 200, 181],
                [200, 211, 186],
                [79, 110, 56],
                [246, 246, 184],
                [210, 185, 156],
                [248, 221, 185],
                [13, 9, 8],
                [221, 137, 59],
                [235, 208, 152],
                [137, 190, 213],
                [119, 21, 21],
                [216, 196, 166],
                [84, 132, 140]
            ]
        }
        //console.log(palette)

        materials = []
        for (var i = 0; i < MAX_MATERIALS; i++) {
            var tempmaterial = new THREE.MeshStandardMaterial({
                //bumpScale: bumpScale,
                color: diffuseColor,
                metalness: .4 + .3 * Math.randomX(), //metalness,
                roughness: .3 + .2 * Math.randomX(), //roughness,
                //metalness: .4,//.6 + .3 * Math.randomX(), //metalness,
                //roughness: .7,//.4 + .3 * Math.randomX(), //roughness,
                shading: THREE.FlatShading,
                envMap: reflectionCube,
                side: THREE.FrontSide,
                //depthWrite:false,
                //depthTest:false,
                //blendEquation:THREE.MinEquation
            })

            tempmaterial.color.setRGB(palette[i][0] / 255, palette[i][1] / 255, palette[i][2] / 255)

            if (i == 24) {
                //tempmaterial.color.setRGB(1,1,1)
                tempmaterial.metalness = 1;
                tempmaterial.roughness = 0;
            }
            if (i == 19) {
                tempmaterial.color.setRGB(1, 1, 1)
                tempmaterial.metalness = .8;
                tempmaterial.roughness = .2;
            }

            //console.log('%c ' + i, 'background: #' + tempmaterial.color.getHex().toString(16));
            //console.log(i,tempmaterial.color.getHex())

            /*tempmaterial.color.setHSL(Math.randomX(), .04 * Math.randomX(), .2 + .7 * Math.randomX())// color papers
             if (Math.randomX() < 1.2) {
             //tempmaterial.color.setHSL(Math.randomX(),.5, .5)
             tempmaterial.color.setHSL(Math.randomX() * .75, .5 * Math.randomX(), .2 + .8 * Math.randomX())// color papers
             }*/


            /*if (i == 0) {
             tempmaterial.color.setHSL(0, 0, 1)
             tempmaterial.roughness = 0
             tempmaterial.metalness = 0
             }*/

            /*if (Math.randomX() < 1.1) {
             tempmaterial.color.setHSL(Math.randomX(), .2, .8)// color papers
             } else if (Math.randomX() < .1) {
             tempmaterial.color.setHSL(0, Math.randomX(), Math.randomX())// dark red
             } else if (Math.randomX() < .2) {
             tempmaterial.color.setHSL(Math.randomX() * .1 + .9, Math.randomX() * .4, .6)//reds
             } else if (Math.randomX() < .2) {
             tempmaterial.color.setHSL(Math.randomX(),.5, .5)// colors
             } else {
             tempmaterial.color.setHSL(0, 0, Math.randomX())// greys
             }*/
            tempmaterial.materialID = i;
            //tempmaterial.color.setHSL(Math.random(), Math.random(),Math.random())
            materials.push(tempmaterial);
        }
        mergedMaterial = new THREE.MeshFaceMaterial(materials);
        //mainMaterial = materials[0]
    }

    function spaceship(pos, quality, doMerge, groupHolder, newName, skipMain, inverse) {
        var name = RandomName(2, 5);
        if (deeplinkName) {
            deeplinkName=deeplinkName.toString();
            name = deeplinkName.charAt(0).toUpperCase() + deeplinkName.slice(1).toLowerCase();
            deeplinkName = "";
        }
        if (newName)
            name = newName
        //console.log(1, name, 2, newName, 3, deeplinkName)
        Math.seedrandomX(name)
        if (!skipMain && !doMerge)
            generatedName = name;
        
        var scale = Math.randomX() / 5;//ControlsHandler.fxParams.time;
        var ship = new THREE.Object3D();

        ship.childrenLeft = []
        ship.childrenRight = []

        quality = Math.randomX() + .2
        var num = 5 * quality;
        for (var n = 0; n < num; n++) {

            var materialID = Math.floor(Math.randomX() * materials.length)
            var mat = materials[materialID]

            var max = (3 + 10 * scale + 10 * scale * Math.randomX()) * quality

            var cubesOnly = Math.randomX() < .2;
            var trianglesOnly = Math.randomX() < .2;
            //cubesOnly = trianglesOnly = false;

            var roz = 10
            var prevPos = new THREE.Vector3()
            if (!ControlsHandler.fxParams.center || ControlsHandler.fxParams.time > .1) {
                prevPos.x = 0//(Math.random() - .5) * roz * (scale * 2 + 1);
                prevPos.y = (Math.randomX() - .5) * roz * (scale * 2 + 1) / 2;
                prevPos.z = (Math.randomX() - .5) * roz * (scale * 2 + 1);
            }
            for (var i = 0; i < max; i++) {
                var geo = geos[Math.floor(Math.randomX() * geos.length)].clone();
                if (cubesOnly)
                    geo = geos[0].clone()
                if (trianglesOnly && geos[3])
                    geo = geos[3].clone()

                var groz = Math.randomX() * 1.1 + .7
                if (!cubesOnly) {
                    for (var j = 0; j < geo.vertices.length; j++) {
                        geo.vertices[j].x += (Math.randomX() - .5) * groz * Math.abs(geo.vertices[j].x) / 1;
                        geo.vertices[j].y += (Math.randomX() - .5) * groz * Math.abs(geo.vertices[j].y) / 1;
                        geo.vertices[j].z += (Math.randomX() - .5) * groz * Math.abs(geo.vertices[j].z) / 1;
                    }
                }

                var mesh = new THREE.Mesh(geo, mat);

                //var ran = (Math.randomX() * 2 + 2 + scale * 1) * (1 + (1 / quality) / 4);
                mesh.scale.set(
                        (Math.randomX() * 2 + 2 + scale * 1) * (1 + (1 / quality) / 4) * .8,
                        (Math.randomX() * 2 + 2 + scale * 1) * (1 + (1 / quality) / 4) * .8,
                        (Math.randomX() * 2 + 2 + scale * 1) * (1 + (1 / quality) / 4) * .8
                        );
                mesh.orgScale = (Math.randomX() * 2 + 2 + scale * 1) * (1 + (1 / quality) / 4) * .8

                var disVal = mesh.scale.x * 1.8;
                var u = Math.randomX() * Math.PI * 2;
                var v = Math.randomX() * Math.PI * 2;

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

                mesh.castShadow = true;
                mesh.receiveShadow = true;
                ship.add(mesh)
                ship.childrenLeft.push(mesh)

                //if (Math.randomX() < .9) {
                var mesh2 = mesh.clone()
                mesh2.orgScale = mesh.orgScale;
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
                //mesh.rotation.set(Math.randomX(),Math.randomX(),Math.randomX())
                //if (!cubesOnly) {


                if (!cubesOnly)
                    mesh.lookAt(new THREE.Vector3(0, 0, 0))

                mesh2.rotation.x = mesh.rotation.x
                mesh2.rotation.y = -mesh.rotation.y
                mesh2.rotation.z = -mesh.rotation.z

                mesh2.position.x = -mesh.position.x
                ship.add(mesh2)
                ship.childrenRight.push(mesh2)

                mesh2.opposite = mesh
                mesh.opposite = mesh2

                if (!doMerge) {
                    mesh.scale.set(0.000001, 0.000001, 0.000001)
                    mesh2.scale.set(0.000001, 0.000001, 0.000001)
                }
                //mesh.frustumCulled = false;
                //mesh2.frustumCulled = false;
                //}
            }
        }
        var animConnections = true;
        if (doMerge) {
            animConnections = false
        } else {
            objects = ship.children.slice(0);
        }
        connectPieces(ship, animConnections)

        ship.name = name;

        // MERGE

        if (doMerge) {
            ship = merge(ship)
        } else {
            lastShip = ship;
            requestAnimationFrame(animate);
        }

        if (!skipMain && !ControlsHandler.fxParams.installation && !ControlsHandler.fxParams.screensaver) {
            var desc = Generator.description(ship.name, doMerge, mat, inverse)
            ship.add(desc)
            ship.description = desc

        }
        //ship.description.visible=false

        //
        groupHolder.add(ship)
        ship.position.copy(pos)


        return ship;
    }

    function generateMesh(mat, scale, quality, prevPos) {
        if (!scale)
            scale = 1;
        if (!quality)
            quality = 1;
        if (!prevPos)
            prevPos = new THREE.Vector3()

        var cubesOnly = Math.randomX() < .2;
        var trianglesOnly = Math.randomX() < .2;

        var geo = geos[Math.floor(Math.randomX() * geos.length)].clone();
        if (cubesOnly)
            geo = geos[0].clone()
        if (trianglesOnly && geos[3])
            geo = geos[3].clone()

        var groz = Math.randomX() * 1.1 + .7
        if (!cubesOnly) {
            for (var j = 0; j < geo.vertices.length; j++) {
                geo.vertices[j].x += (Math.randomX() - .5) * groz * Math.abs(geo.vertices[j].x) / 1;
                geo.vertices[j].y += (Math.randomX() - .5) * groz * Math.abs(geo.vertices[j].y) / 1;
                geo.vertices[j].z += (Math.randomX() - .5) * groz * Math.abs(geo.vertices[j].z) / 1;
            }
        }

        var mesh = new THREE.Mesh(geo, mat);

        //var ran = (Math.randomX() * 2 + 2 + scale * 1) * (1 + (1 / quality) / 4);
        mesh.scale.set(
                (Math.randomX() * 2 + 2 + scale * 1) * (1 + (1 / quality) / 4) * .8,
                (Math.randomX() * 2 + 2 + scale * 1) * (1 + (1 / quality) / 4) * .8,
                (Math.randomX() * 2 + 2 + scale * 1) * (1 + (1 / quality) / 4) * .8
                );
        mesh.orgScale = (Math.randomX() * 2 + 2 + scale * 1) * (1 + (1 / quality) / 4) * .8

        var disVal = mesh.scale.x * 1.8;
        var u = Math.randomX() * Math.PI * 2;
        var v = Math.randomX() * Math.PI * 2;

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

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        //if (Math.randomX() < .9) {
        var mesh2 = mesh.clone()
        mesh2.orgScale = mesh.orgScale;
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
        //mesh.rotation.set(Math.randomX(),Math.randomX(),Math.randomX())
        //if (!cubesOnly) {


        if (!cubesOnly)
            mesh.lookAt(new THREE.Vector3(0, 0, 0))

        mesh2.rotation.x = mesh.rotation.x
        mesh2.rotation.y = -mesh.rotation.y
        mesh2.rotation.z = -mesh.rotation.z

        mesh2.position.x = -mesh.position.x
        return[mesh, mesh2]
    }

    function animate(ship) {
        if (!lastShip)
            return;
        var max = lastShip.children.length
        var scale
        for (var i = 0; i < max - 1; i++) {
            scale = 1
            if (lastShip.children[i].orgScale) {
                scale = lastShip.children[i].orgScale
                lastShip.children[i].scale.set(lastShip.children[i].orgScale, lastShip.children[i].orgScale, lastShip.children[i].orgScale)
            }

            TweenMax.from(lastShip.children[i].scale, 1, {
                delay: i / max / 2,
                ease: Back.easeOut,
                x: 0.0001, y: 0.0001, z: 0.0001
            })
        }
        lastShip = null;
    }

    function connectPieces(ship, anim) {
        if (ship.connectors) {
            for (var i = 0; i < ship.connectors.length; i++) {
                var connector = ship.connectors[i]
                ship.remove(connector)
                connector.geometry.dispose()
                connector = null;
            }
        }
        ship.connectors = []
        //var ship = flotilla[0]
        for (var i = 0; i < ship.childrenLeft.length; i++) {
            if (i > 0) {
                var piece = addPiece(ship.childrenLeft[i].position, ship.childrenLeft[i - 1].position, ship.childrenLeft[i].material, (ship.childrenLeft[i].orgScale + 2) / 3)
                ship.add(piece)
                ship.connectors.push(piece)
                if (anim) {
                    //piece.scale.set(0.000001, 0.000001, 0.000001);
                    //TweenMax.from(piece.scale,1,{delay:.1,x:0.000001,y:0.000001,z:0.000001})
                }
            }
        }
        for (var i = 0; i < ship.childrenRight.length; i++) {
            if (i > 0) {
                var piece = addPiece(ship.childrenRight[i].position, ship.childrenRight[i - 1].position, ship.childrenRight[i].material, (ship.childrenRight[i].orgScale + 2) / 3)
                ship.add(piece)
                ship.connectors.push(piece)
                if (anim) {
                    //piece.scale.set(0.000001, 0.000001, 0.000001);
                    //TweenMax.from(piece.scale,1,{delay:.1,x:0.000001,y:0.000001,z:0.000001})
                }
            }
        }


    }

    function addPiece(point, point2, material, i) {
        var middle = new THREE.Vector3();
        middle.x = (point.x + point2.x) / 2
        middle.y = (point.y + point2.y) / 2
        middle.z = (point.z + point2.z) / 2

        var distance = new THREE.Vector3();
        distance.x = point.x - point2.x;
        distance.y = point.y - point2.y;
        distance.z = point.z - point2.z;


        var mesh = new THREE.Mesh(geo, material)
        mesh.position.set(middle.x, middle.y, middle.z)
        mesh.scale.set(i, i, Math.sqrt(distance.x * distance.x + distance.y * distance.y + distance.z * distance.z))
        mesh.lookAt(point2)
        mesh.connecting = true;
        mesh.disabled = true;
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        return mesh;
    }



    function merge(ship) {
        var geom = new THREE.Geometry()
        var mat = mergedMaterial;
        var name = ship.name
        for (var i = 0; i < ship.children.length; i++) {
            if (ship.children[i].geometry) {
                ship.children[i].updateMatrix();
                var l = ship.children[i].geometry.faces.length
                for (var j = 0; j < l; j++) {
                    var id = 0
                    ship.children[i].geometry.faces[j].materialIndex = ship.children[i].material.materialID;
                }
                geom.merge(ship.children[i].geometry, ship.children[i].matrix, 0);
            }
        }
        ship = new THREE.Mesh(geom, mat);

        var vert = ship.geometry.vertices;
        for (var i = 0; i < vert.length; i++) {
            vert[i].ox = vert[i].x;
            vert[i].oy = vert[i].y;
            vert[i].oz = vert[i].z;
        }
        //ship.frustumCulled = false;
        ship.castShadow = true;
        ship.receiveShadow = true;
        ship.name = name

        return ship;
    }

    function description(name, doMerge, mat, inverse) {
        var simple = true

        var container = new THREE.Group()
        if (simple) {
            var canvas1 = document.createElement('canvas');
            var context1 = canvas1.getContext('2d');
            context1.fillStyle = "#000000";
            context1.fill();
            context1.font = "Bold 160px Arial";
            canvas1.width = context1.measureText(name).width + 60
            canvas1.height = 200
            context1.font = "Bold 160px Arial";
            context1.fillStyle = "rgba(255,255,255,1)";
            context1.fillText(name, 30, 160);

            // canvas contents will be used for a texture
            var texture1 = new THREE.Texture(canvas1)
            texture1.needsUpdate = true;

            var material1 = new THREE.MeshBasicMaterial({map: texture1, side: THREE.DoubleSide});
            //material1.transparent = true;

            var width = canvas1.width / 80
            var height = canvas1.height / 80
            var mesh1 = new THREE.Mesh(
                    new THREE.PlaneGeometry(width, height),
                    material1
                    );
        } else {
            var mesh1 = createText(name, mat)//mat)
            //var plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 3), new THREE.MeshBasicMaterial({color: 0}))
            //mesh1.add(plane)
        }
        mesh1.position.set(-2, -7, -15);
        mesh1.rotation.y = Math.PI;
        if (inverse) {
            mesh1.position.set(2, -7, 15);
            mesh1.rotation.y = 0
        }
        if (width)
            mesh1.position.x += width / 2
        //mesh1.rotation.x = -.2
        //mesh1.rotation.y = -.2
        mesh1.receiveShadow = true;
        mesh1.castShadow = true;
        
        mesh1.noOBJ = true;

        if (!doMerge) {
            TweenMax.from(mesh1.scale, 1, {
                delay: .3,
                ease: Expo.easeOut,
                x: 0.000001, y: 0.000001, z: 0.000001
            })
        }

        container.add(mesh1)
        //container.eulerOrder = 'ZYX';
        container.rotation.y = Math.PI
        container.visible=false;

        return container
    }

    function createText(text, material, depth) {
        if (!depth)
            depth = .2;
        /*var loader = new THREE.FontLoader();
         loader.load('fonts/' + fontName + '_' + fontWeight + '.typeface.json', function (response) {
         font = response;
         refreshText();
         });*/
        var height = depth
        var size = 1.5
        var bevelEnabled = false
        var textGeo = new THREE.TextGeometry(text, {
            font: dafont,
            size: size,
            height: height,
            curveSegments: 2,
            bevelThickness: 2,
            bevelSize: 1.5,
            bevelEnabled: bevelEnabled,
            material: 0,
            extrudeMaterial: 0
        });
        textGeo.computeBoundingBox();
        textGeo.computeVertexNormals();
        // "fix" side normals by removing z-component of normals for side faces
        // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)
        /*if (!bevelEnabled) {
         var triangleAreaHeuristics = 0.1 * (height * size);
         for (var i = 0; i < textGeo.faces.length; i++) {
         var face = textGeo.faces[ i ];
         if (face.materialIndex == 1) {
         for (var j = 0; j < face.vertexNormals.length; j++) {
         face.vertexNormals[ j ].z = 0;
         face.vertexNormals[ j ].normalize();
         }
         var va = textGeo.vertices[ face.a ];
         var vb = textGeo.vertices[ face.b ];
         var vc = textGeo.vertices[ face.c ];
         var s = THREE.GeometryUtils.triangleArea(va, vb, vc);
         if (s > triangleAreaHeuristics) {
         for (var j = 0; j < face.vertexNormals.length; j++) {
         face.vertexNormals[ j ].copy(face.normal);
         }
         }
         }
         }
         }*/
        var centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
        textMesh1 = new THREE.Mesh(textGeo, material);
        textMesh1.position.x = centerOffset;
        //textMesh1.position.y = hover;
        textMesh1.position.z = 0;
        textMesh1.rotation.x = 0;
        textMesh1.rotation.y = Math.PI * 2;
        return textMesh1;
    }

    function addGeom(geom, rotationArray, translationArray, scaleArray) {
        geom.applyMatrix(new THREE.Matrix4().scale(new THREE.Vector3(scaleArray[0], scaleArray[1], scaleArray[2])));
        geom.applyMatrix(new THREE.Matrix4().makeRotationX(rotationArray[0]));
        geom.applyMatrix(new THREE.Matrix4().makeRotationY(rotationArray[1]));
        geom.applyMatrix(new THREE.Matrix4().makeRotationZ(rotationArray[2]));
        geom.applyMatrix(new THREE.Matrix4().makeTranslation(translationArray[0], translationArray[1], translationArray[2]));
        return geom
    }

    function Wing() {
        var tentacleGeom = new THREE.SphereGeometry(15, 3, 4);
        var mesh = new THREE.Mesh(tentacleGeom, null);
        mesh.scale.z = 0.2;
        mesh.updateMatrix();
        mesh.geometry.applyMatrix(mesh.matrix);
        return(mesh.geometry);
    }

    function Minerals(geom, max) {
        if (!max)
            max = 4;
        var tentacleGeom = new THREE.Geometry();
        var dis = 0;
        for (var j = 0; j < max; j++) {
            var mesh = new THREE.Mesh(geom.clone(), null);
            mesh.position.set((25 - dis) / 3 / 20, dis / 2 / 20, 0);
            dis += 25 * (1 - (j + 1) / max);
            mesh.scale.set(
                    .07 * (1 - j / max),
                    .07 * (1 - j / max),
                    .07 * (1 - j / max)
                    );
            mesh.rotation.set(0, 0, 1.5 * j / max);
            mesh.updateMatrix();
            tentacleGeom.merge(mesh.geometry, mesh.matrix);
        }
        return(tentacleGeom);
    }

    function Grid(geom) {
        var tentacleGeom = new THREE.Geometry();
        for (var j = 0; j < 4; j++) {
            var geometry = geom;
            var mesh = new THREE.Mesh(geometry, null);
            if (j != 0)
                mesh.position.set(
                        1.5 * (Math.randomX() - .5),
                        1.5 * (Math.randomX() - .5),
                        1.5 * (Math.randomX() - .5)
                        );
            mesh.updateMatrix();
            tentacleGeom.merge(geometry, mesh.matrix);
        }
        return(tentacleGeom);
    }


    function setEnvMap(cubeMap) {
        //mainMaterial.envMap = cubeMap;
    }

    return {
        init: init,
        description: description,
        spaceship: spaceship,
        merge: merge,
        generateMesh: generateMesh,
        connectPieces: connectPieces,
        setEnvMap: setEnvMap,
        addPiece: addPiece,
        getMaterials: function () {
            return materials
        },
        getPalette: function () {
            return palette
        },
        getMergedMaterial: function () {
            return mergedMaterial
        },
        generatedName: function () {
            return generatedName;
        },
        createText: createText,
        forceName: function (name) {
            generatedName = name;
        }
    };
}();