var Tools = function () {

    var renderer;
    var scene;
    var camera;
    var composer

    var preSize = {width: 0, height: 0}
    var savingName;

    var musicEnabled = true;

    function init() {
        renderer = VizHandler.getRenderer();
        scene = VizHandler.getScene();
        camera = VizHandler.getCamera();

        document.getElementById('fullscreen').addEventListener('click', fullscreen, false);
        document.getElementById('about').addEventListener('click', about, false);
        document.getElementById('overlay').addEventListener('click', aboutClose, false);
        document.getElementById('overlayVR').addEventListener('click', aboutVRClose, false);
        if (WEBVR.isAvailable() === true) {
            document.getElementById('vr').addEventListener('click', FXHandler.enableVR, false);
        } else {
            document.getElementById('vr').addEventListener('click', vrinfo, false);
        }
    }
    function about() {
        $('#overlay').fadeIn()
        $('#overlay .popup').css('margin-top', -$('#overlay .popup').height() / 2 + 10 + 'px');
    }

    function aboutClose(e) {
        if (e.toElement.className == "overlay" || e.toElement.className == "fa fa-times fa-2x")
            $('#overlay').fadeOut()
    }

    function vrinfo() {
        $('#overlayVR').fadeIn()
        $('#overlayVR .popup').css('margin-top', -$('#overlayVR .popup').height() / 2 + 'px');

    }

    function aboutVRClose(e) {
        if (e.toElement.className == "overlay" || e.toElement.className == "fa fa-times fa-2x")
            $('#overlayVR').fadeOut()
    }

    function fullscreen() {
        var elem = document.body;
        //elem.webkitRequestFullScreen()
        if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
            if (elem.requestFullScreen) {
                elem.requestFullScreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullScreen) {
                elem.webkitRequestFullScreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    return {
        init: init,
        fullscreen: fullscreen,
        musicEnabled: function () {
            return musicEnabled
        },
    };

}();