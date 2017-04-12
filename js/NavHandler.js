var NavHandler = function () {

    var CREATE = "CREATE"
    var STORY = "STORY"
    var GALLERY = "GALLERY"

    var currentPage = null;

    var audio;

    function init() {
        document.getElementById('create').addEventListener('click', create, false);
        document.getElementById('gallery').addEventListener('click', gallery, false);
        if (document.getElementById('setfree'))
            document.getElementById('setfree').addEventListener('click', setfree, false);
    }

    function create() {
        NavHandler.goTo(NavHandler.CREATE);
        Create.generate();
    }

    function gallery() {
        NavHandler.goTo(NavHandler.GALLERY)
    }

    function setfree() {
        NavHandler.goTo(NavHandler.STORY)
    }

    function killDelayedCalls() {
        TweenMax.killDelayedCallsTo(Create.generate)
        TweenMax.killDelayedCallsTo(create)
        TweenMax.killDelayedCallsTo(setfree)
    }

    function goTo(page, param) {
        if (currentPage == page)
            return;

        currentPage = page;
        if (currentPage == STORY) {
            if (audio)
                audio.pause();
            //AudioHandler.decode(0,true)//
            AudioHandler.seekTo(0)
            Create.lock();
            Gallery.disable()
            //document.getElementById('leftnav').style.display = 'block';
            //Create.destroy()
            //Mecha.init();
            if (ControlsHandler.fxParams.screensaver) {
                killDelayedCalls();
                TweenMax.delayedCall(60 * 1, create);
            }
            if (ControlsHandler.fxParams.installation) {
                killDelayedCalls();
                TweenMax.delayedCall(60 * 1, create);
            }
        }
        if (currentPage == GALLERY) {
            Create.disable();
            Gallery.show()
        }
        if (currentPage == CREATE) {
            if (audio)
                audio.play()
            Create.unlock();
            Create.generate(0, 0, 0, false, param)
            Gallery.disable();
            $('#nav').fadeIn()
            $('#leftnav').fadeOut()
            Create.show();
            //document.getElementById('nav').style.display = 'block';
            //document.getElementById('leftnav').style.display = 'none';
            if (ControlsHandler.fxParams.screensaver) {
                killDelayedCalls()
                TweenMax.delayedCall(60 * .5, setfree)
            }
            if (ControlsHandler.fxParams.graffiti) {
                killDelayedCalls()
                for (var i = 0; i < 100; i++) {
                    TweenMax.delayedCall(5 * i, Create.generate);
                }
            } else if (ControlsHandler.fxParams.installation) {
                killDelayedCalls()
                TweenMax.delayedCall(5 * 1, Create.generate);
                TweenMax.delayedCall(10 * 1, Create.generate);
                TweenMax.delayedCall(15 * 1, Create.generate);
                TweenMax.delayedCall(20 * 1, Create.generate);
                TweenMax.delayedCall(25 * 1, Create.generate);
                TweenMax.delayedCall(30 * 1, setfree)
            }
        }
    }

    return {
        init: init,
        currentPage: function () {
            return currentPage
        },
        goTo: goTo,
        CREATE: CREATE,
        STORY: STORY,
        GALLERY: GALLERY,
        setfree: setfree,
        killDelayedCalls: killDelayedCalls,
        audio: function () {
            return audio
        },
        setAudio: function (a) {
            audio = a
        }
    };
}();