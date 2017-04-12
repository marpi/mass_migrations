/**
 * @author mrdoob / http://mrdoob.com
 * Based on @tojiro's vr-samples-utils.js
 */

var WEBVR = {
    isLatestAvailable: function () {

        return navigator.getVRDisplays !== undefined;

    },
    isAvailable: function () {

        return navigator.getVRDisplays !== undefined || navigator.getVRDevices !== undefined;

    },
    getMessage: function () {

        var message;

        if (navigator.getVRDisplays) {

            navigator.getVRDisplays().then(function (displays) {

                if (displays.length === 0)
                    message = 'WebVR supported, but no VRDisplays found.';

            });

        } else if (navigator.getVRDevices) {

            message = 'Your browser supports WebVR but not the latest version. See <a href="http://webvr.info">webvr.info</a> for more info.';

        } else {

            message = 'Your browser does not support WebVR. See <a href="http://webvr.info">webvr.info</a> for assistance.';

        }

        if (message !== undefined) {

            var container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '0';
            container.style.top = '0';
            container.style.right = '0';
            container.style.zIndex = '999';
            container.align = 'center';

            var error = document.createElement('div');
            error.style.fontFamily = 'sans-serif';
            error.style.fontSize = '16px';
            error.style.fontStyle = 'normal';
            error.style.lineHeight = '26px';
            error.style.backgroundColor = '#fff';
            error.style.color = '#000';
            error.style.padding = '10px 20px';
            error.style.margin = '50px';
            error.style.display = 'inline-block';
            error.innerHTML = message;
            container.appendChild(error);

            return container;

        }

    },
    getButton: function (effect, switchControls) {

        var button = document.createElement('img');
        button.setAttribute('src', 'enter.png');
        button.style.position = 'absolute';
        button.style.left = 'calc(50% - 50px)';
        button.style.bottom = '20px';
        button.style.width = '100px';
        button.style.border = '0';
        button.style.cursor = 'pointer';
        button.style.color = '#fff';
        button.style.fontFamily = 'sans-serif';
        button.style.fontSize = '13px';
        button.style.fontStyle = 'normal';
        button.style.textAlign = 'center';
        button.style.zIndex = '999';
        button.onclick = function () {
            button.style.display='none'
            effect.requestPresent();

            switchControls()
            
        };

        window.addEventListener('vrdisplaypresentchange', function (event) {

            //button.textContent = false ? 'EXIT VR' : 'ENTER VR';

        }, false);

        return button;

    }

};
