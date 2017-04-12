var BG = function () {

    var groupHolder;
    var material;
    var planeMaterial
    var spd = 0;

    var shapes = [];

    var cubeMesh, cubeShader, skyBox

    function init() {

        //console.log("BG")

        //init event listeners


        groupHolder = new THREE.Object3D();
        VizHandler.getVizHolder().add(groupHolder);

        var cubeMapId = 23//4//28//23//20//16//7;//9
        //4,,23,16,9,,28,20
        cubeMap = Assets.getMainCubeMap();

        /*cubeShader = THREE.ShaderLib['cube'];
         cubeShader.uniforms['tCube'].value = cubeMap;
         
         var skyBoxMaterial = new THREE.ShaderMaterial({
         fragmentShader: cubeShader.fragmentShader,
         vertexShader: cubeShader.vertexShader,
         uniforms: cubeShader.uniforms,
         depthWrite: false,
         side: THREE.DoubleSide
         });*/


        var materialArray = [];
        for (var i = 0; i < 6; i++)
            materialArray.push(new THREE.MeshBasicMaterial({
                map: cubeMap.image[ i ],
                side: THREE.BackSide, fog: false
            }));

        var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
        skyBox = new THREE.Mesh(
                new THREE.CubeGeometry(1500, 1500, 1500),
                skyMaterial
                );
        skyBox.noOBJ = true;

        /*skyBox = new THREE.Mesh(
         new THREE.SphereGeometry(1500),
         new THREE.MeshBasicMaterial({
         map: new THREE.TextureLoader().load("textures/sky2_09.jpg"),
         side: THREE.BackSide, fog: false, depthWrite:false
         })
         );*/

        if (ControlsHandler.fxParams.smoothBg) {
            var geometry = new THREE.OctahedronGeometry(1500, 1)

            for (var i = 0; i < geometry.faces.length; i++) {

                var face = geometry.faces[ i ];
                var temp = face.a;
                face.a = face.c;
                face.c = temp;

            }

            geometry.computeFaceNormals();
            geometry.computeVertexNormals();

            var faceVertexUvs = geometry.faceVertexUvs[ 0 ];
            for (var i = 0; i < faceVertexUvs.length; i++) {

                var temp = faceVertexUvs[ i ][ 0 ];
                faceVertexUvs[ i ][ 0 ] = faceVertexUvs[ i ][ 2 ];
                faceVertexUvs[ i ][ 2 ] = temp;

            }

            var material = new THREE.MeshStandardMaterial({
                roughness: 0,
                metalness: 0.5,
                side: THREE.DoubleSide,
                depthWrite: false,
                fog: false,
                emissive: 0x666666,
                color: 0xFFFFFF * Math.random(),
                side: THREE.DoubleSide
            })

            skyBox = new THREE.Mesh(
                    geometry,
                    //skyBoxMaterial
                    material
                    );
            skyBox.scale.y = -1;
        }

        groupHolder.add(skyBox);
    }

    function updateSkyboxTextures() {
        if (!skyBox.material.materials)
            return;
        var materialArray = [];
        for (var i = 0; i < 6; i++) {
            skyBox.material.materials[i].map = new THREE.Texture(cubeMap.image[ i ])
            skyBox.material.materials[i].map.needsUpdate = true;
        }
    }

    function setEnvMap(cubeMap) {
        if (cubeShader)
            cubeShader.uniforms['tCube'].value = cubeMap;
    }
    function setColor(color) {
        return;
        if (skyBox.material.color)
            skyBox.material.color.setHex(color)
    }

    function changeVisibility() {
        groupHolder.visible = ControlsHandler.fxParams.bg;
    }

    function generate() {
        skyBox.rotation.y = Math.randomX() * Math.PI * 2;

        /*if (skyBox.material.color) {
         var palette = Generator.getPalette()
         var color = palette[Math.floor(Math.randomX() * palette.length)]
         skyBox.material.color.setRGB(color[0] / 255, color[1] / 255, color[2] / 255)
         }*/
    }

    return {
        init: init,
        setEnvMap: setEnvMap,
        setColor: setColor,
        changeVisibility: changeVisibility,
        generate: generate,
        updateSkyboxTextures: updateSkyboxTextures
    };

}();