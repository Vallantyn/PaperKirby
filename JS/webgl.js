//debugger;

var gl;

var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();
var tMatrix = mat4.create();

var shaderProgram;

var lastTime = 0;

function webGLStart() {
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    initShaders();
    initKirby();

    map = new Map([
    [1,1,1,1,1,1],
    [0,0,1,1,1,0],
    [0,0,0,1,1,0],
    [0,1,0,0,0,0],
    [1,0,0,1,1,1],
    [0,0,0,0,1,1],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0]
]);

    map.Init();

    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    tick();
}

function initGL(canvas) {
    try {
	gl = canvas.getContext("experimental-webgl");
	gl.viewportWidth = canvas.width;
	gl.viewportHeight = canvas.height;
    } catch(e) {
    }
    if (!gl) {
	alert("Could not initialise WebGL, sorry :-(");
    }
}

function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
    shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
    shaderProgram.useTexturesUniform = gl.getUniformLocation(shaderProgram, "uUseTextures")
    shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
    shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
    shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
//shaderProgram.alphaUniform = gl.getUniformLocation(shaderProgram, "uAlpha");
}

function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
	return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
	if (k.nodeType == 3) {
	    str += k.textContent;
	}
	k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
	shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
	shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
	return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	alert(gl.getShaderInfoLog(shader));
	return null;
    }

    return shader;
}

function handleLoadedTexture(t) {
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, t.img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.MIPMAP_LINEAR_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

function drawScene() {
    gl.viewport(0,0,gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, [0.0, 0.0, -10.0])

    gl.uniform1i(shaderProgram.useTexturesUniform, false);
    gl.uniform1i(shaderProgram.useLightingUniform, true);
    gl.uniform3f(shaderProgram.ambientColorUniform, 0.5, 0.5, 0.5);
    var lightingDirection = [-0.5, -1, 0.0];
    var adjustedLD = vec3.create();
    vec3.normalize(lightingDirection, adjustedLD);
    vec3.scale(adjustedLD, -1);
    gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);
    gl.uniform3f(shaderProgram.directionalColorUniform, 1, 1, 1);



    map.Draw();
    portal.Draw();
    drawKirby();
}

function tick () {
    requestAnimFrame(tick);

    animKirby();
    portal.Anim();
    drawScene();
    moveKirby();
}

function drawToMap() {
    mat4.rotate(mvMatrix, degToRad(10), [1, 0,0]);
    mat4.rotate(mvMatrix, degToRad(-90), [0,1,0]);
    mat4.translate(mvMatrix, [0.0, -kirby.y, kirby.x])
}

function keyDown(e) {
    if(e.keyCode == 39 || e.keyCode == 68) {
	kirby.state.walk = true;
	kirby.state.right = true;
	kirby.state.left = false;
	kirby.state.idle = false;

    } else if(e.keyCode == 37 || e.keyCode == 81) {
	kirby.state.walk = true;
	kirby.state.right = false;
	kirby.state.left = true;
	kirby.state.idle = false;

    } else if(e.keyCode == 16) {
	kirby.state.run = true;

    } else if((e.keyCode == 32 || e.keyCode == 38 || e.keyCode == 90) && kirby.state.fall == false) {
	kirby.state.jump = true;
    }
}

function keyUp(e) {
    if(e.keyCode == 39 || e.keyCode == 68) {
	kirby.state.walk = false;

    } else if(e.keyCode == 37 || e.keyCode == 81) {
	kirby.state.walk = false;

    } else if(e.keyCode == 16) {
	kirby.state.run = false;

    } else if((e.keyCode == 32 || e.keyCode == 38 || e.keyCode == 90) && kirby.state.fall == false) {
	kirby.state.jump = true;
    }

    kirby.anim[id].i = 0;
    kirby.anim[id].c = 0;
}
