var ControlsHandler = function () {

    var mainParams = {
        auto: true,
        fullscreen: function () {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            Main.toggleControls()
        },
        generate_one: function () {
            Mecha.generate(0, 0)
        },
        generate_grid: function () {
            Mecha.generate(3, 3, 3)
        }
    }

    var audioParams = {
        useMic: false,
        useSample: true,
        showDebug: true,
        beatHoldTime: 40,
        beatDecayRate: 0.97,
        bpmMode: false,
        bpmRate: 0,
        sampleURL: "music/story_3min2_1.ogg",
        disableStory: true
    };
    var fxParams = {
        festival: false,
        screensaver: false,
        installation: false,
        graffiti: false,
        bg: true,
        explosions: false,
        time: 0.0001, //0001,
        volSens: 1, //1,
        army: false,
        song: 0,
        effects: true,
        ocean: false,
        mainShip: true,
        tilt: true,
        dof: false,
        film: true,
        smaa: true,
        meshReact: true,
        crystals: true,
        mountains: true,
        smoothBg: false,
        envMap: 0,
        jumpCount: 0,
        kaleidoscope: -1,
        kaleidoscopeJump: false,
        camJump: true,
        rgb: false,
        wireframe: false,
        center: false,
        autoGenerate: true,
        fly: true,
        person: false,
        ssao: true,
        ssaoOnly: false,
        heart: true,
        items: true,
        black: true,
        animSpeed: 1.0,
        colorProgress: 0.0,
        spreadProgress: 0.0,
        waterProgress: 0.3,
        bgProgress: 0.0,
        glow: 0.3
    };
    var vizParams = {
        fullSize: true,
        showControls: false,
        fakeKinect: false,
    };
    function init() {

        events.on("update", update);
        events.on("onBeat", onBeat);

    }

    function seek() {
        AudioHandler.seekTo(ControlsHandler.fxParams.time)
    }

    function show(trigger, percStart, percFinish, value, onChange, onChangeParams) {
        changedValue = value
        if (fxParams.time > percStart && fxParams.time <= percFinish && fxParams[trigger] != changedValue) {

            fxParams[trigger] = changedValue;
            if (onChange)
                onChange(onChangeParams)
        }
    }

    function autoChange() {
        mainParams.auto = true;
    }

    function manualChange() {
        mainParams.auto = false;
        FXHandler.toggle();
    }

    function toggleExplosions() {
        if (fxParams.explosions) {
            Create.enableShaderMesh()
            VizHandler.removeAmbientLight()
            fxParams.ssao = false;
            fxParams.crystals = false;
            fxParams.mountains = false;
            fxParams.army = false;
            fxParams.bg = false;
            fxParams.mainShip = false;
            fxParams.film = false;
            fxParams.envMap = 5;
            fxParams.rgb = true;
        } else {
            Create.disableShaderMesh()
            VizHandler.addAmbientLight()
            fxParams.ssao = true;
            if (!ControlsHandler.fxParams.graffiti) {
                fxParams.crystals = true;
                fxParams.mountains = true;
                fxParams.bg = true;
            }
            fxParams.army = true;
            fxParams.mainShip = true;
            fxParams.film = true;
            fxParams.envMap = 0;
            fxParams.rgb = false;
        }
        //Assets.updateCubeMap();
        Create.toggleArmyVisibility();
        Create.toggleVisibility();
        Crystals.changeVisibility();
        Mountains.changeVisibility();
        FXHandler.toggle();
        BG.changeVisibility();
    }

    function update() {


    }

    function onBeat() {
        var clone = {};
        for (var attr in fxParams) {
            if (fxParams.hasOwnProperty(attr)) {
                clone[attr] = fxParams[attr];
            }
        }

        if (mainParams.auto) {
            show('kaleidoscopeJump', .0, .49, false, FXHandler.toggle)
            show('kaleidoscopeJump', .49, .78, true, FXHandler.toggle)

            show('kaleidoscope', .78, 1, -1, FXHandler.toggle)
            show('kaleidoscopeJump', .78, 1, false, FXHandler.toggle)

            show('explosions', 0, 0.78, false, toggleExplosions)
            show('explosions', 0.78, 1, true, toggleExplosions)
            if (!isMobile.any) {
                show('army', 0, .15, false, Create.toggleArmyVisibility)
                show('army', .15, 0.78, true, Create.toggleArmyVisibility)
            }
        }
    }

    return {
        init: init,
        audioParams: audioParams,
        fxParams: fxParams,
        mainParams: mainParams,
        vizParams: vizParams,
        toggleExplosions: toggleExplosions,
        gui2: function () {
            return gui
        },
    };
}();