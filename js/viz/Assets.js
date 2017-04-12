var Assets = function () {

    var textureCube;
    var mainCubeMap;

    function init() {
        mainCubeMap = getCubeMap(23)
    }

    function destroy(object, textureToo) {
        if (object.children.length > 0) {
            var objects = [object.children[1], object.children[0]]

            object.remove(objects[0]);
            object.remove(objects[1]);

            destroyMesh(objects[0], textureToo)
            destroyMesh(objects[1], textureToo)
        } else {
            destroyMesh(object, textureToo)
        }
        //object=null;
    }
    function getCubeMap(i) {
        var cubeMap = new THREE.Texture([]);
        cubeMap.format = THREE.RGBFormat;
        cubeMap.flipY = false;

        var envMaps = [
            {file: "textures/sunset_simple.jpg", size: 1024, glow: .45}, //_blur
            {file: "textures/otherworld.jpg", size: 512, glow: .7},
            {file: "textures/shinyblue.jpg", size: 1024, glow: 0},
            {file: "textures/op.png", size: 1024, glow: 0.1},
            {file: "textures/stormydays_large.jpg", size: 1024, glow: .1},
            {file: "textures/fog.jpg", size: 512, glow: .75},
            {file: "textures/bonemap.jpg", size: 512, glow: .45}, //_blur
            {file: "textures/stormydays_large.jpg", size: 1024, glow: .45}, //_blur
            {file: "textures/browncloud.png", size: 1024, glow: .35}, //_blur
            {file: "textures/bluecloud.png", size: 1024, glow: .35}, //_blur
            {file: "textures/yellowcloud.png", size: 1024, glow: .35}, //_blur
            {file: "textures/graycloud.png", size: 1024, glow: .35}, //_blur
            {file: "textures/violentdays_large.jpg", size: 1024, glow: .2},
            {file: "textures/interstellar_large.jpg", size: 1024, glow: .1},
            {file: "textures/miramar_large.jpg", size: 1024, glow: .45},
            {file: "textures/clear.png", size: 1024, glow: 0.1},
            {file: "textures/clean.png", size: 1024, glow: .2},
            {file: "textures/snow.jpg", size: 512},
            {file: "textures/vivd.jpg", size: 256},
            {file: "textures/desert.jpg", size: 512},
            {file: "textures/grimmnight_large.jpg", size: 1024},
            {file: "textures/skyboxsun5deg2.png", size: 1024},
            {file: "textures/meh.jpg", size: 256},
            {file: "textures/Above_The_Sea.jpg", size: 1024},
            {file: "textures/orange_space.jpg", size: 512},
            {file: "textures/fairy.jpg", size: 512},
            {file: "textures/frozen.jpg", size: 512},
            {file: "textures/game.jpg", size: 512},
            {file: "textures/darkness.png", size: 1024},
            {file: "textures/forest.png", size: 1024},
            {file: "textures/forest2.png", size: 1024},
            {file: "textures/stormydays_small.jpg", size: 256, glow: .1},
        ];

        var loader = new THREE.ImageLoader();
        var file = envMaps[i].file;
        var size = envMaps[i].size;
        loader.load(file, function (image) {

            var getSide = function (x, y) {

                var canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;

                var context = canvas.getContext('2d');
                context.drawImage(image, -x * size, -y * size);

                return canvas;

            };

            cubeMap.image[ 0 ] = getSide(2, 1); // px
            cubeMap.image[ 1 ] = getSide(0, 1); // nx
            cubeMap.image[ 2 ] = getSide(1, 0); // py
            cubeMap.image[ 3 ] = getSide(1, 2); // ny
            cubeMap.image[ 4 ] = getSide(1, 1); // pz
            cubeMap.image[ 5 ] = getSide(3, 1); // nz
            cubeMap.needsUpdate = true;

            BG.updateSkyboxTextures()
            Main.ready();

        });

        return cubeMap;
    }

    function updateCubeMap() {
        return;
        var ids = [23, 16, 9, 4, 1, 28, 20]
        var colors = [0x7ba1ce, 0xecedf2, 0xc7d1d3, 0xffe7a7, 0xdbb499, 0x07212b, 0x131518]
        var num = Math.floor(Math.random() * 31)
        console.log(num)
        var map = getCubeMap(num)
        BG.setEnvMap(map)
        Generator.setEnvMap(map)
        Mountains.setEnvMap(map)
        //VizHandler.updateColor(colors[num])
    }

    function destroyMesh(mesh, textureToo) {
        if (mesh.geometry)
            mesh.geometry.dispose();
        if (!mesh.material)
            return;
        var tex = mesh.material.map
        if (!tex && mesh.material.materials)
            tex = mesh.material.materials[1].map
        //console.log(mesh.material.map)
        if (tex && textureToo) {
            tex.needsUpdate = false;
            tex.dispose();
            tex.image = null
            tex = null;
        }
        if (mesh.material.materials) {
            mesh.material.materials[1].dispose();
            mesh.material.materials[0].dispose();
            mesh.material.materials[1] = null;
            mesh.material.materials[0] = null;
        }
        if (mesh.material.dispose)
            mesh.material.dispose();

        mesh.material = null;
        mesh.geometry = null;
        tex = null;
    }

    return {
        init: init,
        textureCube: function () {
            return textureCube;
        },
        destroy: destroy,
        getCubeMap: getCubeMap,
        getMainCubeMap: function () {
            return mainCubeMap
        },
        updateCubeMap: updateCubeMap
    };

}();