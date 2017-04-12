var Heart = function () {

    var groupHolder;
    var material;

    var drewNewShape = false;

    var scl = 0;
    var dae;
    var spd = 0;
    var mod = 0;

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
        if (dae) {
            groupHolder.remove(dae);
            dae.geometry.dispose();
            dae = null;
        }

        var models = ['models/heart.dae']//,'models/deer_spider.dae']
        var random = Math.floor(Math.random() * models.length)

        var loader = new THREE.ColladaLoader();
        loader.options.convertUpAxis = true;
        loader.load(models[random], function colladaReady(collada) {

            dae = collada.scene.children[0].children[0];
            if (!dae)
                dae = collada.scene.children[0]
            if (!dae)
                dae = collada.scene

            dae.scale.x = dae.scale.y = dae.scale.z = 400//.1;
            //dae.position.y=-25
            //dae.position.x=23
            dae.material = material//=new THREE.MeshBasicMaterial( { envMap:textureCube,shading: THREE.FlatShading});
            //dae.material=customMaterial
            //dae.updateMatrix();
            //dae.castShadow = true
            //dae.receiveShadow = true;

            var vert = dae.geometry.vertices
            for (var i = 0; i < vert.length; i++) {
                vert[i].ox = vert[i].x;
                vert[i].oy = vert[i].y;
                vert[i].oz = vert[i].z;
            }
            dae.rotation.x = Math.PI / 2
            dae.position.z = -10
            groupHolder.add(dae);

            console.log(dae)
        });

        // Materials

        var imgTexture = new THREE.TextureLoader().load("textures/white.jpg");
        imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;
        //imgTexture = null;

        var shininess = 50, specular = 0xffffff, bumpScale = 1, shading = THREE.SmoothShading;

        var materials = [];
        
        var reflectionCube = Assets.getCubeMap(29)
        reflectionCube.format = THREE.RGBFormat;

        var roughness = 0;
        var diffuseColor = new THREE.Color(1,1,1);
        var metalness = .9;
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
    }

    function update() {
        if (!dae)
            return;
        if (ControlsHandler.fxParams.heart) {
            groupHolder.visible = true;
        } else {
            groupHolder.visible = false;
            return;
        }

        //if(Math.random()<.01)reload()

        var magn = .2;
        var time = Date.now();
        var max = 2;
        var vert = dae.geometry.vertices
        for (var i = 0; i < vert.length; i++) {
            var mod = 0.2;
            if (vert[i].oz > -2)
                mod = 1;
            var j = Math.floor(i + mod) % 8;
            var scales = (AudioHandler.getLevelsData()[j] * AudioHandler.getLevelsData()[j] + 0.01) * 2;
            mod *= scales
            //vert[i].x=vert[i].ox+mod*Math.max(-max,Math.min(max,Math.sin( i*.96+time/113)*magn))
            //vert[i].y=vert[i].oy+mod*Math.max(-max,Math.min(max,Math.sin( i*1.23+time/122)*magn))
            //vert[i].z=vert[i].oz+mod*Math.max(-max,Math.min(max,Math.sin(-i*1.4+time/135)*magn))
            /*if(i>vert.length/2){
             vert[i].x+=5
             }else{
             vert[i].x-=5
             }*/

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
        ;
        dae.geometry.verticesNeedUpdate = true;
        dae.geometry.normalsNeedUpdate = true;
        dae.geometry.computeFaceNormals();
        dae.geometry.computeVertexNormals();

        groupHolder.rotation.y += .01;
        var gotoScale = AudioHandler.getVolume() * 1.2 + .1;
        scl += (gotoScale - scl) / 3;
        groupHolder.scale.x = groupHolder.scale.y = groupHolder.scale.z = .1//scl/2;
    }

    function onBeat() {
        mod = Date.now() / 1000;
        if (Math.random() < .05)
            spd = (Math.random() - .5) * 1

        if (ControlsHandler.fxParams.wireframe) {
            material.wireframe = true;
            material.wireframe = true;
        } else {
            material.wireframe = false;
            material.wireframe = false;
        }

        var basic = [.25 + ControlsHandler.fxParams.colorProgress * .5, .25 + ControlsHandler.fxParams.colorProgress * .5, .25 + (1 - ControlsHandler.fxParams.colorProgress) * .5]
        material.color.setRGB(basic[0] + Math.random() / 2, basic[1] + Math.random() / 2, basic[2] + Math.random() / 2);
        if (ControlsHandler.fxParams.black)
            material.color.setRGB(.2, .2, .2);
    }

    return {
        init: init,
        update: update,
        onBeat: onBeat,
    };

}();