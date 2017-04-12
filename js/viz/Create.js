var Create = function () {
    var groupHolder;
    var dae;
    var mod = 0;
    var speed = .035;
    var timeout
    var flotilla = []
    var isMobile = {any: false};
    var plane;
    var distance = 120
    var objects = []

    var camera, controls
    var container;

    var plane = new THREE.Plane();
    var raycaster = new THREE.Raycaster();
    var renderer;
    var mouse = new THREE.Vector2(),
            offset = new THREE.Vector3(),
            intersection = new THREE.Vector3(),
            INTERSECTED, SELECTED;
    var mainShip;
    var shaderMesh, shaderMeshEnabled = false;
    var angle = new THREE.Euler()
    var startPoint = new THREE.Vector2(0, 0)
    var title;
    var f, ship;
    var animateDelay = 0
    var time = 7;

    var group = new THREE.Group();

    function init() {
        events.on("update", update);
        events.on("onBeat", onBeat);

        groupHolder = new THREE.Object3D();
        VizHandler.getVizHolder().add(groupHolder);

        camera = VizHandler.getCamera()
        controls = VizHandler.getControls();
        renderer = VizHandler.getRenderer()
        container = renderer.domElement;
    }

    function onDeviceOrientationChangeEvent(e) {
        //console.log(e)
        if (!e.alpha)
            return;
        console.log(e.gamma, (-e.gamma / 180 * Math.PI))
        if (groupHolder)
            groupHolder.rotation.y = -e.gamma / 180 * Math.PI//TweenMax.to(groupHolder.rotation, 1, {x: 0, y: (-e.gamma / 180 * Math.PI), z: 0})
    }

    function toggleVisibility() {
        if (mainShip)
            mainShip.visible = ControlsHandler.fxParams.mainShip
    }

    function toggleArmyVisibility() {
        if (ControlsHandler.fxParams.army) {
            for (var i = 0; i < flotilla.length; i++) {
                flotilla[i].visible = true;
            }
        } else {
            for (var i = 0; i < flotilla.length; i++) {
                flotilla[i].visible = false;
            }
        }
    }

    function generate(mx, my, mz, skipMain, newName) {

        if (ControlsHandler.fxParams.screensaver && !isMobile.any && !newName) {
            TweenMax.killDelayedCallsTo(regenerate)
            TweenMax.delayedCall(5, regenerate)
            $('#nav').hide();
            $('#footer').hide();
            $('#bottomnav').hide();
            $('#about').hide();
            $('#leftnav').html();
            $('#bottommid').hide();
        }

        disable();

        if (!mx)
            mx = 0
        if (!my)
            my = 0
        if (!mz)
            mz = 0

        flotilla = []
        var quality = 1;

        for (var x = -mx; x <= mx; x++) {
            for (var y = 0; y <= my; y++) {
                for (var z = -mz; z <= mz; z++) {
                    var pos = {x: x * distance + 0 * (Math.random() - .5) * distance / 2, y: y * distance + 0 * Math.random() * distance / 4, z: z * distance + 0 * (Math.random() - .5) * distance / 2}
                    /*if (x != 0)
                     quality = .1*/
                    var merge = true
                    if (x == 0 && y == 0 && z == 0) {
                        merge = false;
                    } else {
                        var roz = .5
                        x += (Math.randomX() - .5) * roz
                        y += (Math.randomX() - .5) * roz
                        z += (Math.randomX() - .5) * roz
                    }
                    if (skipMain && x == 0 && y == 0 && z == 0) {

                    } else {
                        var inverse = true;
                        var ship = Generator.spaceship(pos, quality, merge, groupHolder, newName, skipMain, inverse)
                        flotilla.push(ship)
                        if (x == 0 && y == 0 && z == 0) {
                            mainShip = ship
                            mainShip.arrayPosition = flotilla.length - 1;
                            setObjects(mainShip.children)
                            //console.log(mainShip)
                        }
                    }
                }
            }
        }

        ControlsHandler.fxParams.army = false;
        toggleArmyVisibility()
        toggleVisibility()

        if (!skipMain) {
            Mountains.generate();
            Crystals.generate()
            BG.generate()
            VizHandler.changeShotCreate();
        }

    }

    function show() {
        if (shaderMesh) {
            shaderMesh.visible = false;
            //console.warn(shaderMesh)
            groupHolder.remove(shaderMesh)
            shaderMesh.geometry.dispose()
            shaderMesh = null
        }

        animateDelay = 3;
        requestAnimationFrame(animate);
    }
    function animate() {
        //console.log('animate()', animateDelay)
        if (animateDelay > 0) {
            animateDelay--
            requestAnimationFrame(animate);
        } else {
            var directionalLight = VizHandler.getLight();
            TweenMax.to(VizHandler.getControls().target, time, {x: 0, y: 0, z: 0});
            if (!isMobile.any) {
                TweenMax.to(camera.position, time, {delay: 0, x: 0, y: -10, z: -35, onUpdate: look, onComplete: animateComplete});
            } else {
                TweenMax.to(camera.position, time, {delay: 0, x: 0, y: -10, z: -55, onUpdate: look, onComplete: animateComplete});
            }
            TweenMax.to(directionalLight, time * .2, {delay: 0, intensity: 0})
            TweenMax.to(directionalLight.position, 0, {delay: time * .2, x: 1, y: 10, z: -5})
            TweenMax.to(directionalLight, time * .8, {delay: time * .2, intensity: 1})
            time = 1
        }
    }
    function animateComplete() {
        VizHandler.getControls().enabled = true;
    }
    function look() {
        camera.lookAt(VizHandler.getControls().target)
    }

    function unlock() {
        if (mainShip) {
            groupHolder.remove(mainShip)
            mainShip = null;
        }

        $('#preloader').fadeOut()

        renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
        renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
        renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
        renderer.domElement.addEventListener('touchstart', onDocumentTouchStart, false);
        renderer.domElement.addEventListener('touchmove', onDocumentTouchMove, false);
        renderer.domElement.addEventListener('touchend', onDocumentTouchEnd, false);
    }

    function credits() {
        camera.add(title)
        TweenMax.to(title.position, 15, {delay: 1, z: -12})
    }

    function lock() {
        controls.enabled = true;

        groupHolder.remove(mainShip)
        mainShip = Generator.merge(mainShip);

        generate(2, 2, 2, true);

        $('#preloader').css("top", "90%");
        $('#preloader').css("width", "100px");
        $('#preloader').css("margin-left", "-50px");
        document.getElementById("progress").style.width = "0px"
        document.getElementById('preloader').removeEventListener('click', seek, false);
        document.getElementById('preloader').addEventListener('click', seek, false);
        document.getElementById('preloader').style.cursor = 'pointer';

        if (ControlsHandler.fxParams.festival) {
            $('#title').fadeOut();
            $('#about').fadeOut();
            $('#header').fadeOut();
            $('#leftnav').fadeOut();
            $('#bottomnav').fadeOut();
            $('#bottommid').fadeOut();
            $('#footer').fadeOut();
        } else {
            if (!ControlsHandler.fxParams.screensaver && !ControlsHandler.fxParams.installation) {
                $('#leftnav').fadeIn();
                $('#preloader').fadeIn();
            }
        }


        flotilla[mainShip.arrayPosition] = mainShip;
        groupHolder.add(mainShip)

        if (!ControlsHandler.fxParams.installation && !ControlsHandler.fxParams.screensaver) {
            shaderMesh = Explosion.explosion(mainShip)
            shaderMesh.visible = false;
            groupHolder.add(shaderMesh)

            var directionalLight = new THREE.DirectionalLight(0xaaaaaa, 1);
            directionalLight.position.x = -10
            directionalLight.position.z = -1
            directionalLight.position.y = -1
            shaderMesh.add(directionalLight)
        }

        title = Generator.createText('MASS MIGRATIONS', new THREE.MeshPhongMaterial({shading: THREE.FlatShading, color: 0xFFFFFF}), 1)
        THREE.BAS.Utils.separateFaces(title.geometry);
        for (var i = 0; i < title.geometry.vertices.length; i++) {
            var v = title.geometry.vertices[i]
            v.x += v.x * v.x * v.x / 10000 * (Math.random() - .5) * 2
            v.y += v.x * v.x * v.x / 10000 * (Math.random() - .5) * 2
            v.z += v.x * v.x * v.x / 10000 * (Math.random() - .5) * 2
        }
        title.position.x = -10;
        title.position.y = -1;
        title.position.z = 0;

        renderer.domElement.removeEventListener('mousedown', onDocumentMouseDown, false);
        renderer.domElement.removeEventListener('mousemove', onDocumentMouseMove, false);
        renderer.domElement.removeEventListener('mouseup', onDocumentMouseUp, false);
        renderer.domElement.removeEventListener('touchstart', onDocumentTouchStart, false);
        renderer.domElement.removeEventListener('touchmove', onDocumentTouchMove, false);
        renderer.domElement.removeEventListener('touchend', onDocumentTouchEnd, false);
    }

    function seek(e) {
        AudioHandler.seekTo(e.layerX / 100)
    }

    function anim(dae) {
        if (!dae.geometry)
            return;
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
        if (FXHandler.vrEnabled()) {
            for (var f = 0; f < flotilla.length; f++) {
                var ship = flotilla[f]
                if (ship != mainShip) {
                    ship.position.z -= .05 + Math.sin(f) / 50
                    if (ship.position.z < -distance * 3)
                        ship.position.z += distance * 3 * 2;
                }
            }
            mainShip.position.y = 10;

            return;
        }

        speed += .01;

        if (NavHandler.currentPage() == NavHandler.CREATE) {
            group.lookAt(camera.position)
            if (mainShip.description) {
                TweenMax.to(mainShip.description.quaternion, .5, {
                    x: group.quaternion.x, y: group.quaternion.y, z: group.quaternion.z, w: group.quaternion.w
                })
            }
            for (f = 0; f < flotilla.length; f++) {
                ship = flotilla[f]

                if (controls.enabled)
                    ship.position.y += Math.sin(speed + f) / 100;
            }
        }

        if (NavHandler.currentPage() == NavHandler.STORY) {
            if (ControlsHandler.fxParams.meshReact)
                anim(mainShip)

            if (ControlsHandler.fxParams.fly) {
                for (f = 0; f < flotilla.length; f++) {
                    ship = flotilla[f]
                    ship.position.z -= .05 + Math.sin(f) / 50
                    if (ship.position.z < -distance * 3)
                        ship.position.z += distance * 3 * 2;
                }
                mainShip.position.z -= .05
            }
        }
    }

    function onBeat() {
        if (shaderMesh && ((shaderMesh.visible && Math.random() < .25 && ControlsHandler.fxParams.time < .925) || (ControlsHandler.fxParams.time > .925 && ControlsHandler.fxParams.time < .935))) {
            shaderMesh.material.uniforms['uTime'].value = 0
            TweenMax.killTweensOf(shaderMesh.material.uniforms['uTime'])
            TweenMax.to(shaderMesh.material.uniforms['uTime'], 12, {value: 1, ease: Expo.easeIn})//, ease: Expo.easeIn
        }
        if (mainShip && ControlsHandler.fxParams.army && NavHandler.currentPage() == NavHandler.STORY) {
            var roz = 50;
            mainShip.position.set((Math.random() - .5) * roz, (Math.random() - .5) * roz, (Math.random() - .5) * roz)
        }
    }

    function prerender() {
    }

    function postrender() {
    }

    function getRandomOne() {
        return flotilla[Math.floor(Math.random() * flotilla.length)]
    }

    function destroy() {
        if (groupHolder) {
            events.off("update", update);
            events.off("onBeat", onBeat);
        }
    }

    function onDocumentMouseMove(event) {
        if(FXHandler.vrEnabled())return
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        if (SELECTED && SELECTED.opposite) {
            if (raycaster.ray.intersectPlane(plane, intersection)) {
                SELECTED.position.copy(intersection.sub(offset));
                SELECTED.opposite.position.x = -SELECTED.position.x
                SELECTED.opposite.position.y = SELECTED.position.y
                SELECTED.opposite.position.z = SELECTED.position.z
                Generator.connectPieces(mainShip)
            }
            return;
        }
        var intersects = raycaster.intersectObjects(objects);
        //console.log(intersects)
        if (intersects.length > 0 && intersects[ 0 ].object.disabled != true) {
            if (INTERSECTED != intersects[ 0 ].object) {
                INTERSECTED = intersects[ 0 ].object;
                plane.setFromNormalAndCoplanarPoint(
                        camera.getWorldDirection(plane.normal),
                        INTERSECTED.position);
            }
            container.style.cursor = 'pointer';
        } else {
            INTERSECTED = null;
            container.style.cursor = 'auto';
        }
    }
    function onDocumentMouseDown(event) {
        if(FXHandler.vrEnabled())return
        event.preventDefault();
        startPoint.x = (event.clientX / window.innerWidth) * 2 - 1;
        startPoint.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(objects);
        if (intersects.length > 0 && intersects[ 0 ].object.disabled != true) {
            controls.enabled = false;
            SELECTED = intersects[ 0 ].object;
            if (NavHandler.currentPage() != NavHandler.CREATE)
                return;
            document.getElementById('nav').style.pointerEvents = 'none';
            if (raycaster.ray.intersectPlane(plane, intersection)) {
                offset.copy(intersection).sub(SELECTED.position);
            }
            container.style.cursor = 'move';
        }
    }
    function onDocumentMouseUp(event) {
        event.preventDefault();
        //console.log(startPoint.distanceTo(mouse), startPoint, mouse)
        if (NavHandler.currentPage() == NavHandler.GALLERY && SELECTED && SELECTED.name && startPoint.distanceTo(mouse) < .1) {
            controls.enabled = true;
            //if (INTERSECTED) {
            document.getElementById('nav').style.pointerEvents = 'auto';
            //}
            container.style.cursor = 'auto';
            NavHandler.goTo(NavHandler.CREATE, SELECTED.name);
            SELECTED = null;
            return;
        }
        if (NavHandler.currentPage() != NavHandler.CREATE)
            return;

        controls.enabled = true;
        //if (INTERSECTED) {
        SELECTED = null;
        document.getElementById('nav').style.pointerEvents = 'auto';
        //}
        container.style.cursor = 'auto';
    }

    function regenerate() {
        if (NavHandler.currentPage() != NavHandler.CREATE)
            return;

        generate();
    }

    function onDocumentTouchMove(event) {
        if (event.touches[ 1 ]) {
            onDocumentTouchEnd(event)
            return;
        }
        event.clientX = event.touches[ 0 ].pageX;
        event.clientY = event.touches[ 0 ].pageY;
        onDocumentMouseMove(event)
    }

    function onDocumentTouchStart(event) {
        if (event.touches[ 1 ]) {
            onDocumentTouchEnd(event)
            return;
        }
        event.clientX = event.touches[ 0 ].pageX;
        event.clientY = event.touches[ 0 ].pageY;
        onDocumentMouseMove(event)
        onDocumentMouseDown(event)

    }
    function onDocumentTouchEnd(event) {
        //if (NavHandler.currentPage() != NavHandler.CREATE)
        //    return;
        onDocumentMouseUp(event)
    }

    function disable() {
        for (var i = 0; i < flotilla.length; i++) {
            remove(flotilla[i])
            flotilla[i] = null;
        }
        flotilla = [];
    }
    function remove(ship) {
        while (ship.children.length) {
            if (ship.children[0].children && ship.children[0].children.length > 0) {
                ship.children[0].children[0].geometry.dispose();
                ship.children[0].children[0].geometry = null;
                ship.children[0].remove(ship.children[0].children[0])
                /*while (ship.children[0].children.length) {
                 ship.children[0].children[0].geometry.dispose();
                 ship.children[0].remove(ship.children[0].children[0])
                 }*/
            }
            if (ship.children[0].geometry) {
                ship.children[0].geometry.dispose();
                ship.children[0].geometry = null;
                //ship.children[i].material.dispose();
            }
            ship.remove(ship.children[0])
        }
        if (ship.geometry) {
            ship.geometry.dispose();
            ship.geometry = null;
        }
        groupHolder.remove(ship)
        //console.log('geometries', VizHandler.getRenderer().info.memory.geometries)
    }

    function setObjects(array) {
        objects = array.slice(0)
    }

    return {
        init: init,
        update: update,
        onBeat: onBeat,
        generate: generate,
        toggleArmyVisibility: toggleArmyVisibility,
        toggleVisibility: toggleVisibility,
        prerender: prerender,
        postrender: postrender,
        getRandomOne: getRandomOne,
        destroy: destroy,
        lock: lock,
        unlock: unlock,
        disable: disable,
        setObjects: setObjects,
        show: show,
        getMainShip: function () {
            return mainShip;
        },
        hideShaderMesh: function () {
            if (shaderMesh)
                shaderMesh.visible = false
        },
        showShaderMesh: function () {
            if (shaderMesh && shaderMeshEnabled)
                shaderMesh.visible = true
        },
        enableShaderMesh: function () {
            shaderMeshEnabled = true;
        },
        disableShaderMesh: function () {
            shaderMeshEnabled = false
        },
        credits: credits
    }

}
();