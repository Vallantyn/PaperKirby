//debugger;

var gl;

var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();
var tMatrix = mat4.create();

var cLvl;

var shaderProgram;

var lastTime = 0;
var unverse = 0;

function webGLStart() {
    var WIDTH = document.body.offsetWidth;
    var HEIGHT = document.body.offsetHeight;
    var canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.setAttribute('width', WIDTH);
    canvas.setAttribute('height', HEIGHT);
    canvas.setAttribute('tabIndex', -1);
    document.body.insertBefore(canvas, document.body.firstChild);
    window.addEventListener("resize", OnWindowResize, false);

    initGL(canvas);
    initShaders();
    initKirby();

    lvl = new Level();
    cLvl = 'level01';
    bak = lvl[cLvl];
    map = new Map(lvl[cLvl].array);

    map.Init();
    initMiniMap();

    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    kirby.x = lvl[cLvl].start[0]*4;
    kirby.y = lvl[cLvl].start[1]*2;

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
    shaderProgram.pointLightingLocationUniform = gl.getUniformLocation(shaderProgram, "uPointLightingLocation");
    shaderProgram.pointLightingColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingColor");
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

    gl.uniform1i(shaderProgram.useTexturesUniform, false);
    gl.uniform1i(shaderProgram.useLightingUniform, true);
    gl.uniform3f(shaderProgram.ambientColorUniform, 0.3, 0.3, 0.3);
    gl.uniform3f(shaderProgram.pointLightingLocationUniform, 0.0, 0.5, -10.0);
    gl.uniform3f(shaderProgram.pointLightingColorUniform, 0.7, 0.7, 0.7);

    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, [0.0, 0.0, -10.0]);
    mat4.rotate(mvMatrix, degToRad(unverse), [1,0,0]);

    map.Draw();
    for (var i=0; i<map.portals.length; i++) map.portals[i].Draw();
    map.exit.Draw();
    drawKirby();

}

function tick () {
    requestAnimFrame(tick);

    animKirby();
    for (var i=0; i<map.portals.length; i++) map.portals[i].Anim();
    map.exit.Anim();
    drawScene();
    moveKirby();
    drawMiniMap();
}

function drawToMap() {
    mat4.rotate(mvMatrix, degToRad(10), [1, 0, 0]);
    mat4.translate(mvMatrix, [-kirby.x, -kirby.y, 0.0])
}

function keyDown(e) {
    if (!map.unverse) {
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
	} else if (e.keyCode == 17) {
	    map.unverse = true;
	}
    }
}

function keyUp(e) {
    if (!map.unverse) {
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
}

function OnWindowResize(e) {
    var bodyWidth = window.innerWidth;
    var bodyHeight = window.innerHeight;

    if (typeof e == 'undefined')
	e = window.event;
    //on resize reset the WIDTH, HEIGHT and canvas sizes
    WIDTH = bodyWidth;
    HEIGHT = bodyHeight;
    document.getElementById('canvas').width = WIDTH;
    document.getElementById('canvas').height = HEIGHT;
    gl.viewportWidth = WIDTH;
    gl.viewportHeight = HEIGHT;
}