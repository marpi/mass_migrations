var Ocean = function () {
    var groupHolder;


    var parameters = {
        width: 2000,
        height: 2000,
        widthSegments: 250,
        heightSegments: 250,
        depth: 1500,
        param: 4,
        filterparam: 1
    };

    function init() {

        //init event listeners
        events.on("postupdate", update);
        events.on("onBeat", onBeat);

        groupHolder = new THREE.Object3D();
        groupHolder.visible = true;
        VizHandler.getVizHolder().add(groupHolder);

        build()
        
        changeVisibility()
    }

    function build() {

        waterNormals = new THREE.TextureLoader().load('textures/waternormals.jpg');
        waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
        waterNormals.repeat.set(100, 100);

        water = new THREE.Water(VizHandler.getRenderer(), VizHandler.getCamera(), VizHandler.getScene(), {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: waterNormals,
            alpha: 1,//.7, //1, //.7, //1,//.71,
            sunDirection: VizHandler.getLight().position.clone().normalize(),
            sunColor: 0xffffff,
            waterColor: 0x7194c3,//0x333333,//0x7194c3,
            distortionScale: .3,//0,//50.0 / 20,
            side: THREE.DoubleSide,
            fog: true
        });


        mirrorMesh = new THREE.Mesh(
                //new THREE.CircleGeometry(parameters.width * .5),
                new THREE.PlaneBufferGeometry(parameters.width * 1, parameters.height * 1),
                water.material
                //new THREE.MeshPhongMaterial({map:waterNormals})
                );

        mirrorMesh.add(water);
        mirrorMesh.rotation.x = -Math.PI * 0.5;
        mirrorMesh.position.y = -20;
        //mirrorMesh.visible = ControlsHandler.fxParams.ocean;
        //mirrorMesh.scale.set(.015, .015, .015)
        //mirrorMesh.receiveShadow=true;
        groupHolder.add(mirrorMesh);
    }
    
    function onBeat() {
    }

    function changeVisibility() {
        groupHolder.visible = ControlsHandler.fxParams.ocean;
    }

    function hide() {
        groupHolder.visible = false;
    }

    function update() {
        if (mirrorMesh.visible) {
            water.material.uniforms.time.value += 1.0 / 60.0 / 5;
            water.render();
        }
    }
    function postupdate() {
        //mirrorMesh.visible = ControlsHandler.fxParams.ocean;
    }

    return {
        init: init,
        update: update,
        onBeat: onBeat,
        hide: hide,
        changeVisibility: changeVisibility
    }

}
();