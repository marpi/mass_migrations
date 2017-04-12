var VizHandler = function () {

    var camera, scene, renderer, controls, controlsCamera, deviceControls;
    var cubeCameraRead, cubeCameraWrite;
    var vizHolder;

    var BG_COLOR = 0xbacee6;//0xFFFFFF//0xffe7a7;//0xFFFFFF * Math.random();
    var directionalLight;
    var shotCount = 0;
    var newVal = null;

    var randomOne;
    var timeout
    var ambientLight, ambientColor = 0x999999;
    var controls

    function init() {

        //EVENT HANDLERS
        events.on("update", update);
        events.on("onBeat", onBeat);
        events.on("resize", resize);

        renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: false, antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (!isMobile.any)
            renderer.shadowMap.enabled = true;

        document.body.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, .1, 1700);
        camera.position.y = -10
        camera.position.x = 100
        camera.position.z = -100//    135

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.update();
        controls.minPolarAngle = 1 / 4 * Math.PI
        controls.maxPolarAngle = 3 / 4 * Math.PI
        controls.autoRotate = true;
        controls.enablePan = false;
        controls.autoRotateSpeed = .6;
        controls.minDistance = 25;
        controls.maxDistance = 70;
        if (ControlsHandler.fxParams.graffiti) {
            controls.maxDistance = 100;
        }
        controls.enabled = false;

        scene = new THREE.Scene();
        scene.add(camera);

        scene.fog = new THREE.Fog(BG_COLOR, 0, 750);

        Assets.init();
        Tools.init();
        Generator.init()

        vizHolder = new THREE.Object3D();
        scene.add(vizHolder);

        directionalLight = new THREE.DirectionalLight(0xaaaaaa, 1);
        directionalLight.position.x = 1;
        directionalLight.position.z = 1;
        directionalLight.position.y = 10;

        directionalLight.castShadow = true;

        var roz = 8
        directionalLight.shadow.camera.near = -roz
        directionalLight.shadow.camera.far = roz
        directionalLight.shadow.camera.left = -roz
        directionalLight.shadow.camera.right = roz
        directionalLight.shadow.camera.top = roz
        directionalLight.shadow.camera.bottom = -roz
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.bias = 0;
        scene.add(directionalLight);

        ambientLight = new THREE.AmbientLight(ambientColor)
        scene.add(ambientLight)

        activeViz = [Gallery, Mountains, Create, Crystals, BG]

        for (var j = 0; j < activeViz.length; j++) {
            activeViz[j].init();
        }

        Assets.updateCubeMap()

        window.addEventListener('deviceorientation', initControls, false);
    }

    function changeShot() {
        if (NavHandler.currentPage() != NavHandler.STORY)
            return;
        var kaleidoscope = ControlsHandler.fxParams.kaleidoscopeJump
        var scale = .3;//ControlsHandler.fxParams.time;
        camera.position.copy(new THREE.Vector3())
        controls.target.copy(new THREE.Vector3())
        while (camera.position.distanceTo(scene.position) < 20) {
            camera.position.x = (Math.random() - .5) * 80;
            camera.position.y = (Math.random() * .5) * 40 - 14;//(Math.random() * .5) * 20;
            if (kaleidoscope)
                camera.position.y = (Math.random() - .5) * 80
            camera.position.z = (Math.random() - .5) * 80;
        }
        if (!ControlsHandler.fxParams.center) {
            while (controls.target.distanceTo(scene.position) < 5) {
                controls.target.x = (Math.random() - .5) * 40;
                controls.target.y = (Math.random() * .5) * 40;
                if (kaleidoscope)
                    controls.target.y = (Math.random() - .5) * 40;
                controls.target.z = (Math.random() - .5) * 40;
            }
        } else if (ControlsHandler.fxParams.army && Math.random() < .3) {
            ///randomOne = Create.getRandomOne()
            //controls.target.copy(randomOne.position)
        } else {
            //controls.target.copy(new THREE.Vector3())
        }

        if (NavHandler.currentPage() == NavHandler.STORY) {
            controls.autoRotateSpeed = (Math.random() - .5) * 3 * scale;
            if (kaleidoscope != -1) {
                controls.autoRotateSpeed *= 2
            }
        }
        controls.update();
        camera.lookAt(controls.target)
    }

    function changeShotCreate() {
        controls.autoRotateSpeed = (Math.randomX() - .5) * 2
        controls.rotateLeft(Math.randomX() * Math.PI * 2);
        controls.update();
    }

    function initControls(event) {
        return;
        if (event.alpha) {
            window.removeEventListener('deviceorientation', initControls, false);
            //renderer.domElement.addEventListener('click', fullscreen, false);

            //controls.enabled = false;
            deviceControls.enabled = true
            ControlsHandler.fxParams.camJump = false;
            controls.target.set(0, 0, 0)

            deviceControls.connect();
            deviceControls.update();
        }
    }

    function update() {
        if (FXHandler.vrEnabled())
            return;

        if (ControlsHandler.fxParams.center && ControlsHandler.fxParams.army && randomOne) {
            controls.target.copy(randomOne.position)
        }

        var roz = camera.position.distanceTo(controls.target) * 1
        if (roz < 3)
            roz = 3;
        if (NavHandler.currentPage() == NavHandler.GALLERY) {
            roz = 80;
        }
        directionalLight.shadow.camera.near = -roz//-roz * 2;
        directionalLight.shadow.camera.far = roz * 115;
        directionalLight.shadow.camera.left = -roz;
        directionalLight.shadow.camera.right = roz;
        directionalLight.shadow.camera.top = roz;
        directionalLight.shadow.camera.bottom = -roz;
        directionalLight.shadow.camera.updateProjectionMatrix()

        controls.update();
    }

    function onBeat() {
        if (controls.state() != -1)
            return;

        if (shotCount > ControlsHandler.fxParams.jumpCount) {
            shotCount = 0;

            if (ControlsHandler.fxParams.camJump) {
                changeShot();
            }
        }
        shotCount++
    }

    function updateColor(color) {
        BG_COLOR = color;
        //renderer.setClearColor(color)
        BG.setColor(color)
        scene.fog.color = new THREE.Color(color)
    }


    function resize() {

        var renderW = window.innerWidth;
        var renderH = window.innerHeight;

        if (ControlsHandler.vizParams.fullSize) {
            var renderW = window.innerWidth;
            var renderH = window.innerHeight;

            if (ControlsHandler.vizParams.showControls) {
                renderW -= 250;
            }
            $('#viz').css({position: 'relative', top: 0});

        } else {
            //vertically center viz output
            $('#viz').css({position: 'relative', top: window.innerHeight / 2 - FIXED_SIZE_H / 2});
        }
    }

    function remoteValues(val) {
        newVal = val
    }

    return {
        init: init,
        update: update,
        onBeat: onBeat,
        changeShot: changeShot,
        changeShotCreate: changeShotCreate,
        updateColor: updateColor,
        getVizHolder: function () {
            return vizHolder;
        },
        getCamera: function () {
            return camera;
        },
        getScene: function () {
            return scene;
        },
        getLight: function () {
            return directionalLight;
        },
        getControls: function () {
            return controls;
        },
        getControlsCamera: function () {
            return controlsCamera;
        },
        getRenderer: function () {
            return renderer;
        },
        getCubeCameras: function () {
            return [cubeCameraRead, cubeCameraWrite]
        },
        remoteValues: remoteValues,
        addAmbientLight: function () {
            ambientLight.color = new THREE.Color(ambientColor)
        },
        removeAmbientLight: function () {
            ambientLight.color = new THREE.Color(0x111111)
        },
    };

}();