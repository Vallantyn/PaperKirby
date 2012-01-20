function Portal(xIn, yIn, xOut, yOut) {
    this.vertexBuffer = gl.createBuffer();
    this.vertexBuffer.itemSize = 3;
    this.vertexBuffer.numItems = 4;

    this.In = [xIn, yIn];
    this.Out = [xOut, yOut];

    this.vertices = [
    0.0, 1.0, 1.0,
    0.0, -1.0, 1.0,
    0.0, 1.0, -1.0,
    0.0, -1.0, -1.0
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

    this.textureBuffer = gl.createBuffer();
    this.textureBuffer.itemSize = 2;
    this.textureBuffer.numItems = 4;

    this.textureCoords = [
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    1.0, 1.0
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoords), gl.STATIC_DRAW);

    this.blueTexture = gl.createTexture();
    this.orangeTexture = gl.createTexture();

    this.anim = {
	i:	0,
	c:	0,

	f:	6,
	steps:	3,

	r: 0,
    }

    this.Init = function() {

	this.blueTexture.img = new Image();
	this.blueTexture.img.onload = function() {
	    handleLoadedTexture(portal.blueTexture);
	};

	this.orangeTexture.img = new Image();
	this.orangeTexture.img.onload = function() {
	    handleLoadedTexture(portal.orangeTexture);
	};

	this.blueTexture.img.src = "Res/bluePortal.png";
	this.orangeTexture.img.src = "Res/orangePortal.png";
    }

    this.Anim = function() {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);

	this.textureCoords = [];

	if (this.anim.c >= this.anim.steps && this.anim.i >= this.anim.f) {
	    this.anim.i = 0;
	    this.anim.c = 0;
	} else if (this.anim.i >= this.anim.f && this.anim.c < this.anim.steps) {
	    this.anim.i = 0;
	    this.anim.c++;
	}

	xOri = 1.0 * this.anim.c;
	xEnd = xOri + 1.0;



	this.textureCoords = [
	xOri, 0.0,
	xEnd, 0.0,
	xOri, 1.0,
	xEnd, 1.0
	];

	this.anim.r += 90/60;
	//portal.anim.i++;

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoords), gl.STATIC_DRAW);
    }

    this.DrawIn = function(x, y) {
	mvPushMatrix();

	drawToMap();

	gl.uniform1i(shaderProgram.useLightingUniform, false);

	mat4.translate(mvMatrix, [0.0, y*2-1.0, -x*4+1.9]);
	mat4.rotate(mvMatrix, degToRad(90), [0.0, 1.0, 0.0])
	mat4.rotate(mvMatrix, degToRad(this.anim.r), [1.0, 0.0, 0.0])

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.blueTexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertexBuffer.numItems);

	gl.uniform1i(shaderProgram.useLightingUniform, true);
	mvPopMatrix();
    }

    this.DrawOut = function(x, y) {
	mvPushMatrix();

	drawToMap();

	gl.uniform1i(shaderProgram.useLightingUniform, false);

	mat4.translate(mvMatrix, [0.0, y*2-1, -x*4-1.9]);
	mat4.rotate(mvMatrix, degToRad(90), [0.0, 1.0, 0.0])
	mat4.rotate(mvMatrix, degToRad(-this.anim.r), [1.0, 0.0, 0.0])

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.orangeTexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertexBuffer.numItems);

	gl.uniform1i(shaderProgram.useLightingUniform, true);
	mvPopMatrix();
    }

    this.Draw = function() {
	this.DrawIn(xIn, yIn);
	this.DrawOut(xOut, yOut);
    }
}