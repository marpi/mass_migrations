var Gallery = function () {

    var groupHolder;
    var flotilla = []
    var padding = 50;

    var state = 0;
    var rotateStart = new THREE.Vector2();
    var rotateEnd = new THREE.Vector2();

    var dollyStart = new THREE.Vector2();
    var dollyEnd = new THREE.Vector2();
    var dollyDelta = new THREE.Vector2();

    var delta = 0
    var timeSin = 0
    var touching = false;

    var max = {x: 3, y: 3}

    var camera, scene
    var angle = new THREE.Euler()

    var q0
    var mouse
    var rotY = []
    var i, old, ang, q, change, ship
    var animating = false;

    function init() {

        if (isMobile.any)
            max.x = 1;

        events.on("update", update);

        groupHolder = new THREE.Object3D();
        VizHandler.getVizHolder().add(groupHolder);

        document.body.addEventListener('touchstart', touchstart, false);
        document.body.addEventListener('touchend', touchend, false);
        document.body.addEventListener('touchmove', touchmove, false);
        document.body.addEventListener('mousemove', mousemove, false);
        document.body.addEventListener('mousewheel', onMouseWheel, false);
        window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);

        camera = VizHandler.getCamera();
        scene = VizHandler.getScene();
    }

    function onDeviceOrientationChangeEvent(e) {
        if (!e.alpha)
            return;
        q0 = new THREE.Quaternion();
        var q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis
        var zee = new THREE.Vector3(0, 0, 1);
        angle.set(e.beta / 180 * Math.PI, e.alpha / 180 * Math.PI, -e.gamma / 180 * Math.PI, 'YXZ');
        q0.setFromEuler(angle);
        q0.multiply(q1);
        /*var rotation = new THREE.Euler().setFromQuaternion(q0, 'XYZ');
         rotY[0] = rotation.x
         rotY[1] = rotation.y
         rotY[2] = rotation.z*/
        //rotY = [e.beta / 180 * Math.PI,-e.gamma / 180 * Math.PI,(e.alpha-180)/ 180 * Math.PI]
        //TweenMax.to(groupHolder.rotation, 1, {x: 0, y: -e.gamma / 180 * Math.PI, z: 0})
    }

    function show() {
        animating = true;
        var move = [padding * Math.random(), 0, padding * Math.random()]
        if (max.x == 1)
            move = [0, 0, 0]
        for (var x = 0; x < max.x; x++) {
            for (var y = 0; y < max.y; y++) {
                var pos = new THREE.Vector3(-padding * max.x / 2 + padding / 2 + x * padding, x * 2 - padding + y * padding + move[x])
                var newName = null;
                if (y == 1 && x == (max.x / 2 - .5))
                    newName = Generator.generatedName()
                var ship = Generator.spaceship(pos, 0, true, groupHolder, newName)
                ship.disabled = false;
                if (q0)
                    ship.quaternion.copy(q0)
                flotilla.push(ship)
            }
        }
        Create.setObjects(flotilla)

        requestAnimationFrame(animate);
    }
    function animate() {
        TweenMax.to(VizHandler.getControls().target, 2, {x: 0, y: 0, z: 0});

        VizHandler.getControls().enabled = false;
        var directionalLight = VizHandler.getLight();

        if (!isMobile.any) {
            var time = 2
            TweenMax.to(directionalLight, time * .2, {delay: 0, intensity: 0})
            TweenMax.to(directionalLight.position, 0, {delay: time * .2, x: 1, y: 1, z: -10})
            TweenMax.to(directionalLight, time * .8, {delay: time * .2, intensity: 1})

            TweenMax.to(camera.position, time, {delay: 0, x: -mouse.x * 10 + Math.sin(1 + timeSin / 10) * 10, y: -mouse.y * 10 + Math.sin(timeSin / 10 * 1.1) * 4, z: -65, onUpdate: look, onComplete: completeAnimation});
        } else {
            TweenMax.to(camera.position, time, {delay: 0, x: -mouse.x * 10 + Math.sin(1 + timeSin / 10) * 10, y: -mouse.y * 10 + Math.sin(timeSin / 10 * 1.1) * 4, z: -50, onUpdate: look, onComplete: completeAnimation});
        }
    }
    function look() {
        camera.lookAt(VizHandler.getControls().target)
    }
    function completeAnimation() {
        animating = false
    }

    function disable() {
        for (var i = 0; i < flotilla.length; i++) {
            remove(flotilla[i])
            flotilla[i] = null;
        }
        flotilla = [];
    }

    function remove(ship) {
        groupHolder.remove(ship)
        ship.children[0].children[0].geometry.dispose();
        //ship.children[0].children[0].material.map.dispose();
        //ship.children[0].children[0].material.dispose();
        ship.geometry.dispose();
    }

    function onMouseWheel(event) {
        event.preventDefault();
        event.stopPropagation();
        if (event.wheelDelta !== undefined) { // WebKit / Opera / Explorer 9
            delta = event.wheelDelta;
        } else if (event.detail !== undefined) { // Firefox
            delta = -event.detail * 20;
        }

        if (window.devicePixelRatio)
            delta *= window.devicePixelRatio;
        delta /= 5000;
    }

    function touchstart(event) {
        switch (event.touches.length) {
            case 1:
                state = 1;
                touching = true;
                rotateStart.set(event.touches[ 0 ].pageX, event.touches[ 0 ].pageY);
                break;
            case 2:
                state = 2;
                break;
            case 3:
                break;
            default:
                state = 0;
        }

    }
    function mousemove(event) {
        mouse = {x: event.clientX / window.innerWidth - .5, y: event.clientY / window.innerHeight - .5};
    }

    function touchmove(event) {
        if (!touching)
            return;
        event.preventDefault();
        event.stopPropagation();
        switch (event.touches.length) {
            case 1:
                if (state !== 1)
                    return;
                rotateEnd.set(event.touches[ 0 ].pageX, event.touches[ 0 ].pageY);
                delta = -(rotateStart.y - rotateEnd.y) / 500;
                deltaX = (rotateStart.x - rotateEnd.x) / 500;
                rotateStart.set(event.touches[ 0 ].pageX, event.touches[ 0 ].pageY);

                break;
            case 2:
                if (state !== 2)
                    return;
                break;
            case 3:
                break;
            default:
                state = 0;
        }

    }

    function touchend( ) {
        state = 0;
    }
    function update() {
        if (NavHandler.currentPage() != NavHandler.GALLERY)
            return;

        if (!animating) {
            TweenMax.to(camera.position, 2, {x: -mouse.x * 10 + Math.sin(1 + timeSin / 10) * 10, y: -mouse.y * 10 + Math.sin(timeSin / 10 * 1.1) * 4})
            camera.lookAt(VizHandler.getControls().target)
        }

        delta -= delta / 15
        timeSin += .02
        //console.log(delta)
        for (i = 0; i < flotilla.length; i++) {
            old = flotilla[i]
            ang = {
                x: Math.sin(i + timeSin * .2) / 20,
                y: Math.sin(i + timeSin) / 10,
            }
            if (mouse.x) {
                ang.y += mouse.x
                ang.x -= mouse.y
            }

            if (q0) {
                /*TweenMax.to(old.quaternion, 0, {
                 x: q0.x, y: q0.y, z: q0.z, w: q0.w
                 })*/
                old.quaternion.x = q0.x;
                old.quaternion.y = q0.y;
                old.quaternion.z = q0.z;
                old.quaternion.w = q0.w;
                
                old.description.visible=false;
            } else {
                TweenMax.to(old.rotation, 1.5 + Math.sin(i + timeSin), {x: ang.x, y: ang.y})

                q = old.quaternion.clone().inverse()
                TweenMax.to(old.description.quaternion, 1, {
                    x: q.x, y: q.y, z: q.z, w: q.w
                })
            }


            if (delta != 0) {
                old.position.y -= delta * 100 + Math.sin(i + timeSin) / 30
                change = false
                if (old.position.y > padding * max.y / 2) {
                    old.position.y -= padding * max.y
                    change = true
                } else if (old.position.y < -padding * max.y / 2) {
                    old.position.y += padding * max.y
                    change = true
                }
                if (change) {
                    ship = Generator.spaceship(old.position, 0, true, groupHolder)
                    flotilla[i] = ship
                    flotilla[i].position.copy(old.position)
                    flotilla[i].rotation.copy(old.rotation)
                    remove(old)
                    Create.setObjects(flotilla)
                }
            }
        }
    }

    return {
        init: init,
        update: update,
        show: show,
        disable: disable,
        getGroupHolder:function(){
            return groupHolder;
        }
    };

}();