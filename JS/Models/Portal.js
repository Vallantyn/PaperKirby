/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var portal = {
    vertexBuffer: '',
    textureBuffer: '',
    normalBuffer: '',
    blueTexture: '',
    orangeTexture: '',

    anim: {
	i:	0,
	c:	0,

	f:	6,
	steps:	3,

	r: 0,
    }
};

function initPortal() {
    portal.vertexBuffer = gl.createBuffer();
    portal.textureBuffer = gl.createBuffer();
    portal.normalBuffer = gl.createBuffer();
    portal.blueTexture = gl.createTexture();
    portal.orangeTexture = gl.createTexture();

    gl.bindBuffer(gl.ARRAY_BUFFER, portal.vertexBuffer);
    var vertices = [
    0.0, 1.0, 1.0,
    0.0, -1.0, 1.0,
    0.0, 1.0, -1.0,
    0.0, -1.0, -1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    portal.vertexBuffer.itemSize = 3;
    portal.vertexBuffer.numItems = 4;

    gl.bindBuffer(gl.ARRAY_BUFFER, portal.textureBuffer);
    var textureCoords = [
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    1.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    portal.textureBuffer.itemSize = 2;
    portal.textureBuffer.numItems = 4;

    portal.blueTexture.img = new Image();
    portal.blueTexture.img.onload = function() {
	handleLoadedTexture(portal.blueTexture);
    };
    portal.blueTexture.img.src = "Res/bluePortal.png";

    portal.orangeTexture.img = new Image();
    portal.orangeTexture.img.onload = function() {
	handleLoadedTexture(portal.orangeTexture);
    };
    portal.orangeTexture.img.src = "Res/orangePortal.png";
}

function animPortal() {
    gl.bindBuffer(gl.ARRAY_BUFFER, portal.textureBuffer);

    var textureCoords = [];

    if (portal.anim.c >= portal.anim.steps && portal.anim.i >= portal.anim.f) {
	portal.anim.i = 0;
	portal.anim.c = 0;
    } else if (portal.anim.i >= portal.anim.f && portal.anim.c < portal.anim.steps) {
	portal.anim.i = 0;
	portal.anim.c++;
    }

    xOri = 1.0 * portal.anim.c;
    xEnd = xOri + 1.0;



    textureCoords = [
    xOri, 0.0,
    xEnd, 0.0,
    xOri, 1.0,
    xEnd, 1.0
    ];

    portal.anim.r += 90/60;
    //portal.anim.i++;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
}

function drawPortalIn(x, y) {
    mvPushMatrix();

    drawToMap();

    gl.uniform1i(shaderProgram.useLightingUniform, false);
    //gl.uniform3f(shaderProgram.colorUniform, 0.0, 1.0/255*160, 1.0/255*190);

    mat4.translate(mvMatrix, [-2.0, y*2+1.0, -x*4]);
    mat4.rotate(mvMatrix, degToRad(portal.anim.r), [1.0, 0.0, 0.0])

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, portal.blueTexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, portal.vertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, portal.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, portal.textureBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, portal.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, portal.vertexBuffer.numItems);

    gl.uniform1i(shaderProgram.useLightingUniform, true);
    //gl.uniform3f(shaderProgram.colorUniform, 1.0, 1.0, 1.0);
    mvPopMatrix();
}

function drawPortalOut(x, y) {
    mvPushMatrix();

    drawToMap();

    gl.uniform1i(shaderProgram.useLightingUniform, false);
    //gl.uniform3f(shaderProgram.colorUniform, 0.0, 1.0/255*160, 1.0/255*190);

    mat4.translate(mvMatrix, [2.0, y*2+1.0, -x*4]);
    mat4.rotate(mvMatrix, degToRad(portal.anim.r), [1.0, 0.0, 0.0])

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, portal.orangeTexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, portal.vertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, portal.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, portal.textureBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, portal.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, portal.vertexBuffer.numItems);

    gl.uniform1i(shaderProgram.useLightingUniform, true);
    //gl.uniform3f(shaderProgram.colorUniform, 1.0, 1.0, 1.0);
    mvPopMatrix();
}