let Input = {

    input: {
        keyborad: new Map(),
        mouse: {
            isDown: false,
            button: 1
        }
    },

    target: null,

    init: (element) => {
        // Keyborad
        window.onkeydown = (e) => {
            if (Input.input.keyborad.has(e.keyCode)) {
                Input.input.keyborad.set(e.keyCode, true)
            }
        };

        window.onkeyup = (e) => {
            if (Input.input.keyborad.has(e.keyCode)) {
                Input.input.keyborad.set(e.keyCode, false)
            }
        };

        // Mouse
        Input.target = element;

        window.addEventListener('mousedown', function(event) {
            if (Input.target === event.target) {
                Input.onMouseDown(event);
            }
            Input.target = event.target;
        }, false);

        element.oncontextmenu = () => {
            return false;
        };

        element.onmouseup = (event) => {
            if (Input.input.mouse.isDown === true) {
                Input.onMouseUp(event);
            }
        };
    },

    onMouseDown: (event) => {
        Input.input.mouse.isDown = true;

        if ('which' in event) {
            if (event.which === 3) {
                Input.input.mouse.button = 2;
            } else {
                Input.input.mouse.button = 1;
            }
        }
        else if ('button' in event) {
            Input.input.mouse.button = event.button == 2;
        }
    },

    onMouseUp: (event) => {
        Input.input.mouse.isDown = false;
    },

    setupKeys(keys) {
        Input.input.keyborad.clear();
        keys.forEach((key, index, array) => {
            Input.input.keyborad.set(key, false);
        });
    },

    getInput() {
        return {
            keyboard: [...Input.input.keyborad],
            mouse: Input.input.mouse
        };
    },
};