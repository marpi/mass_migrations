var events = new Events();
var simplexNoise = new SimplexNoise();

var Main = function () {

    var readyCountdown = 0;
    var audio;

    function init() {
        preloaderProgress(0.33)

        /*
         
         everything smaa
         ++iphone msaa
         --iphone <=5 no shaders
         
         */

        if (!Detector.webgl) {
            Detector.addGetWebGLMessage();
        }

        if (isMobile.any) {
            $('.button.outline').width(70)
            $('#setfree').hide();
            $('#bottommid').hide();
            $('.popup').css("width", "80%");
            $('.popup').css("margin-left", "-40%");
            $('.popup').css("margin-top", "-50%");
            $('#header').css("padding-top", "40px");
            $('#nav').css("bottom", "60px");
            $('#music').hide();
            $('#refresh').hide();
            if (isMobile.apple.device) {
                $('#fullscreen').hide();
                ControlsHandler.fxParams.ssao = false;
            }
            if (window.screen.height <= (1136 / 2)) {
                ControlsHandler.fxParams.effects = false;
            }/* else {
             if (isMobile.apple.phone) {
             ControlsHandler.fxParams.ssao = false;
             }
             }*/
            //$('#vr').hide();

            $('#twitter i').removeClass('fa-lg').addClass('fa-2x')
            $('#instagram i').removeClass('fa-lg').addClass('fa-2x')
            $('#facebook i').removeClass('fa-lg').addClass('fa-2x')
            $('#fullscreen i').removeClass('fa-lg').addClass('fa-2x')
            $('#sharing').hide();
        }

        if (!isMobile.any) {
            $('.button').addClass('hover_effect');
        }

        document.onselectstart = function () {
            return false;
        };

        window.addEventListener('resize', onResize, false);
        //window.addEventListener('pageshow', onResize, false);

        /*stats = new Stats();
         $('#controls').append(stats.domElement);
         $("#viz").css({"position": "absolute", "top": "0", "right": "0"});
         stats.domElement.id = "stats";*/

        ControlsHandler.init();

        VizHandler.init();
        FXHandler.init();

        onResize();
        $(window).one("focus", onResize);

        if (ControlsHandler.vizParams.showControls) {
            $('#controls').show();
        }


        var id = window.location.hash.substr(1)
        Main.ready()

        if (detectIE()) {
            $('#instagram').hide();
            $('#music').hide();
            $('#wallpaper').hide();
            $('#download').hide();
        }
    }

    function detectIE() {
        var ua = window.navigator.userAgent;

        // Test values; Uncomment to check result …

        // IE 10
        // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

        // IE 11
        // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

        // Edge 12 (Spartan)
        // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

        // Edge 13
        // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return true;
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return true;
        }

        /*var edge = ua.indexOf('Edge/');
         if (edge > 0) {
         // Edge (IE 12+) => return version number
         return true;
         }*/

        // other browser
        return false;
    }

    function ready() {
        readyCountdown++
        preloaderProgress(0.33 + readyCountdown * 0.33)
        if (readyCountdown == 2) {
            NavHandler.init()
            $('#preloader').fadeOut();

            TweenMax.delayedCall(1, launch)
        }
    }

    function launch() {
        var delay = 800

        $('#header').delay(delay + 100).fadeIn();
        $('#title').delay(delay + 200).fadeIn();
        $('#about').delay(delay + 300).fadeIn();
        $('#nav').delay(delay + 400).fadeIn();
        $('#bottomnav').delay(delay + 500).fadeIn();
        if (!isMobile.any)
            $('#bottommid').delay(delay + 600).fadeIn();
        $('#footer').delay(delay + 700).fadeIn();

        if (audio) {
            audio.play()
            audio.loop = true;
            NavHandler.setAudio(audio)
        }

        NavHandler.goTo(NavHandler.CREATE);
        requestAnimationFrame(update);
        requestAnimationFrame(showCanvas);
    }

    function showCanvas() {
        $('canvas').show();
    }

    function launchExperience() {
    }

    function update() {
        requestAnimationFrame(update);
        //stats.update();
        events.emit("preupdate");
        events.emit("update");
        events.emit("postupdate");
    }

    function onKeyDown(event) {
        switch (event.keyCode) {
            case 32: /* space */
                AudioHandler.onBeat();
                break;
            case 81: /* q */
                toggleControls();
                break;
        }
    }

    function onResize() {
        events.emit("resize");
    }

    function trace(text) {
        $("#debugText").text(text);
    }

    function toggleControls() {
        ControlsHandler.vizParams.showControls = !ControlsHandler.vizParams.showControls;
        $('#controls').toggle();
        onResize()
        if (ControlsHandler.vizParams.showControls) {
            $('#wrap').show()
        } else {
            $('#wrap').hide()
        }
    }

    return {
        init: init,
        trace: trace,
        toggleControls: toggleControls,
        launchExperience: launchExperience,
        ready: ready,
        onResize: onResize,
    };

}();

$(window).load(function () {
    setTimeout(Main.init, 100);
});