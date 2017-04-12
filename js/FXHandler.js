var FXHandler = function () {

    var shaderTime = 0;
    var blurriness = 3;
    var effects = false;
    var nuts = false;
    var bloomPass;
    var hblurPass = null;
    var vblurPass = null;
    var copyPass = null;
    var composer = null;
    var blendPass = null;
    var badTVPass = null;
    var mirrorPass = null;
    var dotScreenPass = null;
    var rgbPass = null;
    var smaaPass = null;
    var msaaPass = null
    var depthMaterial, depthRenderTarget;
    var beat = false;
    var ssaoPass;
    var filmPass;
    var scene, renderer, camera
    var VReffect, VRcontrols, vrEnabled = false;
    var controls, bokehPass;
    var controller1, controller2, controlsOnly
    var armyVR = true, vrScale = 10
    var installationMode = false
    var tiltShiftPass

    function init() {

        scene = VizHandler.getScene();
        renderer = VizHandler.getRenderer();
        camera = VizHandler.getCamera();

        VRcontrols = new THREE.VRControls(camera);
        VRcontrols.scale = vrScale;
        VRcontrols.standing = true;

        VReffect = new THREE.VREffect(renderer);
        VReffect.scale = vrScale;

        events.on("preupdate", preupdate);
        events.on("update", update);
        events.on("postupdate", postupdate);
        events.on("onBeat", onBeat);
        events.on("resize", resize);
    }

    function setDrawingMode() {
        armyVR = false
    }

    function enableVR() {
        if (armyVR)
            vrEnabled = true;
        ControlsHandler.fxParams.explosions = false
        ControlsHandler.toggleExplosions();

        FXHandler.toggle();
        NavHandler.goTo(NavHandler.CREATE, Generator.generatedName());

        $('#gallery').hide();
        $('#setfree').hide();
        $('#bottomnav').hide();
        $('#wallpaper').hide();
        $('#download').hide();
        $('#singledownload').hide();
        $('#vr').hide();
        $('#fullscreen').hide();

        document.getElementById('create').addEventListener('click', generateVR, false);
        if (armyVR) {
            Create.generate(1,1,1, true);

            ControlsHandler.fxParams.army = true;
            Create.toggleArmyVisibility();
            Create.toggleVisibility();
            ControlsHandler.fxParams.army = false;
            vrScale = 10;

            VizHandler.getControls().enabled = false;

            console.log("FXHandler.enableVR()")
            VReffect.requestPresent();

            effectUpdate()

        } else {
            installationMode = true
            if (installationMode)
                tiltShiftPass.uniforms.amount.value = 0.002
            camera.fov = 90;
            if (ControlsHandler.fxParams.graffiti) {
                $('#header').hide();
                camera.fov = 120;
            }
            //camera.zoom=.5
            camera.updateProjectionMatrix();

            /*VReffect = new THREE.VREffect(renderer);
             VReffect.scale = vrScale;
             
             console.log("FXHandler.enableVR()")
             TweenMax.killDelayedCallsTo(VReffect.setFullScreen);
             TweenMax.delayedCall(3, VReffect.setFullScreen, [true]);*/

            controls = new THREE.VRControls(new THREE.Object3D());
            controls.scale = vrScale;
            controls.standing = true;

            $('#title').hide();

            TweenMax.killDelayedCallsTo(controllers);
            TweenMax.delayedCall(3, controllers, [true]);
        }
        //
    }

    function controllers() {

        $('#nav').hide();
        $('#about').hide();
        $('#footer').hide();
        $('#create').hide();

        console.log(controls.getStandingMatrix())

        controller1 = new THREE.ViveController(0);
        controller1.camera = camera;
        //controller1.scale.set(2,2,2)
        controller1.standingMatrix = controls.getStandingMatrix();
        scene.add(controller1);

        controller2 = new THREE.ViveController(1);
        controller2.camera = camera;
        //controller2.scale.set(2,2,2)
        controller2.standingMatrix = controls.getStandingMatrix();
        scene.add(controller2);


        /*var loader = new THREE.OBJLoader();
         loader.load('textures/vr_controller_vive_1_5.obj', function (object) {
         var mat = Generator.getMaterials()[0]
         object.material = mat
         controller1.add(object.clone());
         controller2.add(object.clone());
         
         });*/
    }

    function generateVR(e) {
        if (armyVR) {
            e.preventDefault();
            var r = Math.random();
            Generator.forceName(r);

            Create.generate(3, 3, 3, true);

            ControlsHandler.fxParams.army = true;
            Create.toggleArmyVisibility()
            Create.toggleVisibility()
            ControlsHandler.fxParams.army = false;

            Mountains.generate();
            Crystals.generate()
        }
    }

    function setup() {
        //console.log(('FXHandler.setup()'))

        renderTarget = null;
        composer = null;
        renderPass = null;
        copyPass = null;
        bloomPass = null;
        hblurPass = null;
        vblurPass = null;
        copyPass = null;
        composer = null;
        blendPass = null;
        badTVPass = null;
        mirrorPass = null;
        dotScreenPass = null;
        rgbPass = null;
        smaaPass = null;

        effects = null;
        nuts = null;

        //if(isMobile.any)ControlsHandler.fxParams.effects=false

        effects = ControlsHandler.fxParams.effects;
        nuts = ControlsHandler.fxParams.nuts;
        // POST PROCESSING
        //common render target params
        var renderTargetParameters = {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBufer: false};

        //RENDER COMP - BASE LAYER
        //renderComposer

        //BLEND COMP - COMBINE 1st 2 PASSES
        composer = new THREE.EffectComposer(renderer);
        renderPass = new THREE.RenderPass(scene, camera);


        mirrorPass = new THREE.ShaderPass(THREE.MirrorShader);
        mirrorPass.uniforms[ "side" ].value = -1;


        /*var depthRGBA_frag = "#include <common>\n#include <logdepthbuf_pars_fragment>\nvec4 pack_depth( const in float depth ) {\n	const vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );\n	const vec4 bit_mask = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );\n	vec4 res = mod( depth * bit_shift * vec4( 255 ), vec4( 256 ) ) / vec4( 255 );\n	res -= res.xxyz * bit_mask;\n	return res;\n}\nvoid main() {\n	#include <logdepthbuf_fragment>\n	#ifdef USE_LOGDEPTHBUF_EXT\n		gl_FragData[ 0 ] = pack_depth( gl_FragDepthEXT );\n	#else\n		gl_FragData[ 0 ] = pack_depth( gl_FragCoord.z );\n	#endif\n}\n";
         var depthRGBA_vert = "#include <common>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\nvoid main() {\n	#include <skinbase_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n}\n";
         
         depthMaterial = new THREE.ShaderMaterial({fragmentShader: depthRGBA_frag, vertexShader: depthRGBA_vert,
         uniforms: {}, blending: THREE.NoBlending});*/
        depthMaterial = new THREE.MeshDepthMaterial();
        depthMaterial.depthPacking = THREE.RGBADepthPacking;
        depthMaterial.blending = THREE.NoBlending;
        var pars = {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter};
        depthRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, pars);

        ssaoPass = new THREE.ShaderPass(THREE.SSAOShader);
        //ssaoPass.uniforms[ "tDiffuse" ].value will be set by ShaderPass
        ssaoPass.uniforms[ "tDepth" ].value = depthRenderTarget.texture;
        ssaoPass.uniforms[ 'size' ].value.set(window.innerWidth, window.innerHeight);
        ssaoPass.uniforms[ 'cameraNear' ].value = .01//camera.near;
        ssaoPass.uniforms[ 'cameraFar' ].value = 100//camera.far//camera.far;
        ssaoPass.uniforms[ 'onlyAO' ].value = ControlsHandler.fxParams.ssaoOnly;
        ssaoPass.uniforms[ 'aoClamp' ].value = 0.5;
        ssaoPass.uniforms[ 'lumInfluence' ].value = .5;

        tiltShiftPass = new THREE.ShaderPass(THREE.VerticalTiltShiftShader);
        tiltShiftPass.uniforms.focusPos.value = 0.5;
        tiltShiftPass.uniforms.amount.value = 0.004//01;
        if (installationMode)
            tiltShiftPass.uniforms.amount.value = 0.002
        tiltShiftPass.uniforms.brightness.value = 0.65 * 0.9;

        var width = window.innerWidth;
        var height = window.innerHeight;

        bokehPass = new THREE.BokehPass(scene, camera, {
            focus: 1.0,
            aperture: 0.125,
            maxblur: .005,
            width: width,
            height: height
        });
        //bokehPass.uniforms[ "tDepth" ].value = depthRenderTarget;

        smaaPass = new THREE.SMAAPass(window.innerWidth, window.innerHeight);

        msaaPass = new THREE.ManualMSAARenderPass(scene, camera);
        msaaPass.sampleLevel = 2;
        //msaaPass.unbiased = true;

        //var pixelRatio = renderer.getPixelRatio();
        //var newWidth = Math.floor(width / pixelRatio) || 1;
        //var newHeight = Math.floor(height / pixelRatio) || 1;

        //depthRenderTarget.setSize(newWidth, newHeight);
        //composer.setSize(newWidth, newHeight);
        //smaaPass.setSize(newWidth, newHeight);

        rgbPass = new THREE.ShaderPass(THREE.RGBShiftShader);

        filmPass = new THREE.ShaderPass(THREE.FilmShader);
        filmPass.uniforms.grayscale.value = 0;
        filmPass.uniforms.sIntensity.value = 0;
        filmPass.uniforms.nIntensity.value = 1 * 0.05;

        composer.addPass(renderPass);

        if (effects) {
            if (isMobile.apple.device) {
                if (ControlsHandler.fxParams.smaa)
                    composer.addPass(msaaPass)

                copyPass = new THREE.ShaderPass(THREE.CopyShader);
                composer.addPass(copyPass);
            }

            composer.addPass(rgbPass);

            if (ControlsHandler.fxParams.ssao)
                composer.addPass(ssaoPass);

            if (ControlsHandler.fxParams.tilt)
                composer.addPass(tiltShiftPass)

            if (ControlsHandler.fxParams.kaleidoscope != -1 || ControlsHandler.fxParams.kaleidoscopeJump)
                composer.addPass(mirrorPass);

            if (ControlsHandler.fxParams.film && !isMobile.any)
                composer.addPass(filmPass);

            if (!isMobile.apple.device) {
                if (ControlsHandler.fxParams.smaa)
                    composer.addPass(smaaPass)
            }
            //if (ControlsHandler.fxParams.dof)
            composer.addPass(bokehPass)

            if (!ControlsHandler.fxParams.dof)
                bokehPass.enabled = false;

            composer.passes[composer.passes.length - 2].renderToScreen = true;
            composer.passes[composer.passes.length - 1].renderToScreen = true;
        }
    }

    function resize() {
        var width = window.innerWidth;
        var height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);

        setup()
    }


    function onBeat() {
        if (ControlsHandler.fxParams.kaleidoscopeJump) {
            mirrorPass.uniforms[ "side" ].value = Math.floor(ATUtil.randomInt(0, 3));
        } else {
            mirrorPass.uniforms[ "side" ].value = ControlsHandler.fxParams.kaleidoscope;
        }
        beat = true;

        setTimeout(onBeatEnd, 300);
    }

    function onBeatEnd() {
    }

    function toggle() {
        setup()
    }

    function preupdate() {
        if (!effects || vrEnabled)
            return;
        //Ocean.hide()
        scene.overrideMaterial = depthMaterial;
        Create.hideShaderMesh()
        renderer.render(scene, camera, depthRenderTarget, true);
        Create.showShaderMesh()
        scene.overrideMaterial = null;
        //Ocean.changeVisibility()
    }

    function effectUpdate() {
        if (VRcontrols)
            VRcontrols.update();
        VReffect.render(scene, camera);
        VReffect.requestAnimationFrame(effectUpdate);
    }

    function update() {
        if (controls)
            controls.update();
        if (!effects) {
            renderer.render(scene, camera)
            return;
        }
        if (vrEnabled) {
            return;
        }

        if (!rgbPass)
            return;

        filmPass.uniforms.time.value = Math.random()

        if (beat) {
            beat = false;
        }

        shaderTime += 0.1;


        if (!ControlsHandler.fxParams.rgb) {
            rgbPass.uniforms[ "angle" ].value = Math.PI * 2;
            if (installationMode) {

                rgbPass.uniforms[ "amount" ].value = 0.0025;
            } else {
                rgbPass.uniforms[ "amount" ].value = 0.005;
            }
        } else {
            rgbPass.uniforms[ "angle" ].value = Math.sin(shaderTime / 100) * Math.PI;
            rgbPass.uniforms[ "amount" ].value = 1.5 * AudioHandler.getVolume() * .025
        }

        composer.render(0.1);
    }


    function postupdate() {

    }

    return {
        init: init,
        preupdate: preupdate,
        update: update,
        toggle: toggle,
        onBeat: onBeat,
        getComposer: function () {
            return composer
        },
        vrEnabled: function () {
            return vrEnabled
        },
        getControllers: function () {
            return [controller1.controller2]
        },
        setDrawingMode: setDrawingMode,
        enableVR: enableVR,
        generateVR: generateVR,
        toggleFilm: function (on) {
            if (!effects)
                return;
            if (on) {
                filmPass.uniforms.nIntensity.value = 1 * 0.05

                if (!ControlsHandler.fxParams.dof) {
                    bokehPass.enabled = false;

                    bokehPass.renderToScreen = false;
                    smaaPass.renderToScreen = true;
                }
            } else {
                filmPass.uniforms.nIntensity.value = 0;

                if (!ControlsHandler.fxParams.dof) {
                    bokehPass.enabled = true;

                    bokehPass.renderToScreen = true;
                    smaaPass.renderToScreen = false;
                }
            }
        }
    };

}();