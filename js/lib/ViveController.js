THREE.ViveController = function (id) {

    THREE.Object3D.call(this);

    this.matrixAutoUpdate = false;
    this.standingMatrix = new THREE.Matrix4();

    this.scaleMod = new THREE.Vector3(40, 40, 40)
    this.camera = new THREE.Object3D()

    this.materialId = -1
    this.mesh = new THREE.BoxGeometry(6, 6, 6)


    this.prevPosition = new THREE.Vector3();
    this.prevClonePosition = new THREE.Vector3();

    this.geo = new THREE.BoxGeometry(1, 1, 1)
    this.waitingForNext = false
    this.released = false;
    this.time = 0
    this.swiping = new THREE.Vector2(-10, -10)

    this.mainRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0 * Math.PI, 0));
    this.lastPressedPosition = new THREE.Vector3()

    var scope = this;

    function removeElement(element) {
        //console.log(element.geometry)
        element.geometry.dispose()
        //console.log(element.geometry)
        element.parent.remove(element)
    }

    function postponeRelease() {
        NavHandler.goTo(NavHandler.CREATE)
        NavHandler.killDelayedCalls()
        if (!ControlsHandler.fxParams.graffiti)
            TweenMax.delayedCall(10, NavHandler.setfree)
    }

    function update() {

        requestAnimationFrame(update);

        var gamepad = navigator.getGamepads()[ id ];

        if (gamepad && gamepad.buttons && gamepad.pose && gamepad.pose.position) {// 

            var pose = gamepad.pose;

            scope.position.fromArray(pose.position);
            scope.quaternion.fromArray(pose.orientation);
            scope.matrix.compose(scope.position, scope.quaternion, scope.scale);
            scope.matrix.multiplyMatrices(scope.standingMatrix, scope.matrix);

            var translation = new THREE.Vector3(), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3()
            scope.matrix.decompose(scope.position, scope.quaternion, scope.scale);
            scope.rotation.setFromQuaternion(scope.quaternion, 'XYZ')
            scope.rotation.x += scope.time
            scope.rotation.y += scope.time
            //scope.rotation.z+=scope.time
            scope.position.y -= 1.3;
            scope.position.x *= scope.scaleMod.x
            scope.position.y *= scope.scaleMod.y
            scope.position.z *= scope.scaleMod.z
            scope.position.applyQuaternion(scope.camera.quaternion.clone())
            scope.scale.x = scope.scaleMod.x//+(Math.sin(scope.time*10))*25
            scope.scale.y = scope.scaleMod.y//+(Math.sin(scope.time*10))*25
            scope.scale.z = scope.scaleMod.z//+(Math.sin(scope.time*10))*25
            scope.matrix.compose(scope.position, scope.quaternion, scope.scale);


            //console.log(scope.matrix)
            //scope.matrix.copy(scope.matrix.clone().scale(new THREE.Vector3(50,50,50)))
            //console.log(scope.matrix)

            /*scope.position.fromArray(pose.position);
             scope.quaternion.fromArray(pose.orientation);
             //scope.matrix.compose( scope.position, scope.quaternion, scope.scale );
             //scope.matrix.multiplyMatrices( scope.standingMatrix, scope.matrix );
             var translation = new THREE.Vector3(), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3()
             scope.standingMatrix.decompose(translation, quaternion, scale)
             
             scope.position.add(translation.negate());
             scope.quaternion.multiply(quaternion);
             
             scope.position.x *= scope.scaleMod.x
             scope.position.y *= scope.scaleMod.y
             scope.position.z *= scope.scaleMod.z
             
             scope.scale.x = scope.scaleMod.x
             scope.scale.y = scope.scaleMod.y
             scope.scale.z = scope.scaleMod.z*/
            //scope.matrix.scale(new THREE.Vector3(5,5,5))
            /*scope.position.fromArray(pose.position)//.multiply((new THREE.Vector3().setFromMatrixPosition(scope.standingMatrix).negate()));
             scope.scale.x = scope.scaleMod.x
             scope.scale.y = scope.scaleMod.y
             scope.scale.z = scope.scaleMod.z
             
             //scope.position.y -= 1.3;
             
             scope.position.x *= scope.scaleMod.x
             scope.position.y *= scope.scaleMod.y
             scope.position.z *= scope.scaleMod.z
             
             //var translation = new THREE.Vector3(), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3()
             //scope.standingMatrix.decompose(translation, quaternion, scale)
             
             //translation.negate().applyQuaternion(quaternion)
             
             //scope.position.x -= translation.x*scope.scaleMod.x
             //scope.position.y -= translation.y*scope.scaleMod.y
             //scope.position.z -= translation.z*scope.scaleMod.z
             
             scope.position.applyQuaternion(scope.camera.quaternion.clone())//.multiply(scope.mainRotation)
             scope.quaternion.fromArray(pose.orientation)
             scope.matrix.compose(scope.position, scope.quaternion, scope.scale);*/

            scope.matrixWorldNeedsUpdate = true;

            scope.visible = true;

            if (NavHandler.currentPage() == NavHandler.CREATE) {
                VizHandler.getControls().zoomOut(1.0015)
            }
            if (gamepad.buttons[0].pressed) {
                if (gamepad.axes[0] != 0 || gamepad.axes[1] != 0) {
                    VizHandler.getControls().rotateLeft(gamepad.axes[0] / 100)
                    VizHandler.getControls().rotateUp(-gamepad.axes[1] / 200)

                    postponeRelease()

                    VizHandler.getControls().autoRotate = true;

                    scope.swiping.x = -10
                    scope.swiping.y = -10
                }
            } else {
                if (gamepad.axes[0] != 0 || gamepad.axes[1] != 0) {
                    if (scope.swiping.x != -10) {
                        var difx = gamepad.axes[0] - scope.swiping.x
                        var dify = gamepad.axes[1] - scope.swiping.y
                        VizHandler.getControls().rotateLeft(difx / 3)
                        VizHandler.getControls().rotateUp(-dify / 3)
                    }
                    scope.swiping.x = gamepad.axes[0]
                    scope.swiping.y = gamepad.axes[1]

                    VizHandler.getControls().autoRotate = false;

                    postponeRelease()
                } else {
                    VizHandler.getControls().autoRotate = true;

                    scope.swiping.x = -10
                    scope.swiping.y = -10
                }
            }
            if (gamepad.buttons[3].pressed) {
                if (!scope.waitingForNext) {
                    Create.generate()
                    VizHandler.getControls().autoRotateSpeed = .5 * (Math.random() - .5);
                    //Create.getMainShip().description.visible = false
                    scope.waitingForNext = true;
                }
                postponeRelease()
            } else {
                scope.waitingForNext = false;
            }
            //console.log(scope.released)
            if (gamepad.buttons[1].pressed) {

                scope.time += .01

                //console.log(scope.lastPressedPosition.distanceTo(scope.position))
                var distanceToLast = scope.lastPressedPosition.distanceTo(scope.position);
                if (distanceToLast > 2.5 || scope.released) {

                    var scale = (distanceToLast - 2) / 3
                    if (scope.released)
                        scale = .25
                    if (scale < .25)
                        scale = .25
                    if (scale > .75)
                        scale = .75;


                    scope.lastPressedPosition.copy(scope.position);

                    var ship = Create.getMainShip();

                    var mesh = new THREE.Mesh(scope.mesh, Generator.getMaterials()[ scope.materialId ]);
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                    mesh.position.copy(scope.position);
                    //mesh.rotation.set(Math.random(), Math.random(), Math.random())
                    mesh.rotation.copy(scope.rotation)
                    mesh.scale.set(scale * 4 + 1, scale * 4 + 1, scale * 4 + 1);
                    //console.log(scope.materialId, scope.position)
                    //mesh.matrix=scope.matrix.clone()
                    //mesh.matrixWorldNeedsUpdate = true;
                    //VizHandler.getVizHolder().add(mesh)
                    var connectorSize = scale * 2 + 1;
                    if (!scope.released && distanceToLast > 3) {
                        var connector = Generator.addPiece(mesh.position, scope.prevPosition, mesh.material, connectorSize)
                        ship.add(connector)
                        ship.childrenLeft.push(connector)
                        TweenMax.from(connector.scale, .3, {x: 0.001, y: 0.001, z: 0.001, ease: Back.easeOut})
                    }

                    ship.add(mesh)
                    ship.childrenLeft.push(mesh)
                    scope.prevPosition.copy(mesh.position)

                    var clone = new THREE.Mesh(scope.mesh2, Generator.getMaterials()[ scope.materialId])
                    clone.castShadow = true;
                    clone.receiveShadow = true;

                    clone.position.copy(scope.position)
                    clone.rotation.x = mesh.rotation.x
                    clone.rotation.y = -mesh.rotation.y
                    clone.rotation.z = -mesh.rotation.z
                    clone.scale.copy(mesh.scale)
                    clone.position.x = -clone.position.x

                    if (!scope.released && distanceToLast > 3) {
                        var connectorClone = Generator.addPiece(clone.position, scope.prevClonePosition, clone.material, connectorSize)
                        ship.add(connectorClone)
                        ship.childrenRight.push(connectorClone)
                        TweenMax.from(connectorClone.scale, .3, {x: 0.001, y: 0.001, z: 0.001, ease: Back.easeOut})
                    }

                    ship.add(clone)
                    ship.childrenRight.push(clone)
                    scope.prevClonePosition.copy(clone.position)

                    TweenMax.from(mesh.scale, .3, {x: 0.001, y: 0.001, z: 0.001, ease: Back.easeOut})
                    TweenMax.from(clone.scale, .3, {x: 0.001, y: 0.001, z: 0.001, ease: Back.easeOut})

                    scope.released = false;
                    //Generator.connectPieces(ship, false)
                    if (ship.childrenLeft.length > 650) {
                        var left = ship.childrenLeft.shift()
                        var right = ship.childrenRight.shift()
                        TweenMax.to(left.scale, 1, {x: 0.001, y: 0.001, z: 0.001, onComplete: removeElement, onCompleteParams: [left], ease: Expo.easeIn})
                        TweenMax.to(right.scale, 1, {x: 0.001, y: 0.001, z: 0.001, onComplete: removeElement, onCompleteParams: [right], ease: Expo.easeIn})

                        //connectors
                        var left = ship.childrenLeft.shift()
                        var right = ship.childrenRight.shift()
                        TweenMax.to(left.scale, 1, {x: 0.001, y: 0.001, z: 0.001, onComplete: removeElement, onCompleteParams: [left], ease: Expo.easeIn})
                        TweenMax.to(right.scale, 1, {x: 0.001, y: 0.001, z: 0.001, onComplete: removeElement, onCompleteParams: [right], ease: Expo.easeIn})

                        for (var i = 0; i < ship.connectors.length; i++) {
                            TweenMax.to(ship.connectors[i], 1, {x: 0.001, y: 0.001, z: 0.001, onComplete: removeElement, onCompleteParams: [ship.connectors[i]], ease: Expo.easeIn})
                        }
                        ship.connectors = []
                    }
                }

                postponeRelease()

            } else {
                if (!scope.released) {
                    scope.released = true;

                    while (scope.children.length > 0) {
                        scope.remove(scope.children[0])
                    }
                    scope.materialId = Math.floor(Math.random() * Generator.getMaterials().length)
                    var genMesh = Generator.generateMesh(Generator.getMaterials()[ scope.materialId])
                    scope.mesh = genMesh[0].geometry
                    scope.mesh2 = genMesh[1].geometry

                    var mesh = new THREE.Mesh(scope.mesh, Generator.getMaterials()[ scope.materialId])
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;

                    mesh.scale.set(.1 / 2, .1 / 2, .1 / 2)
                    scope.add(mesh)

                    scope.prevPosition = new THREE.Vector3()
                    scope.prevClonePosition = new THREE.Vector3()
                }
            }
            /*scope.position.applyAxisAngle(new THREE.Vector3(1,0,0),scope.camera.rotation.x)
             scope.position.applyAxisAngle(new THREE.Vector3(0,1,0),scope.camera.rotation.y)
             scope.position.applyAxisAngle(new THREE.Vector3(0,0,1),scope.camera.rotation.z)*/


            //scope.matrix.makeRotationY( 0 );
            //scope.matrix.multiplyMatrices( scope.camera.matrix, scope.matrix );
            //scope.matrix.multiplyMatrices( scope.standingMatrix.matrix, scope.matrix );

        } else {

            scope.visible = false;

        }

    }

    update();

};

THREE.ViveController.prototype = Object.create(THREE.Object3D.prototype);
THREE.ViveController.prototype.constructor = THREE.ViveController;
