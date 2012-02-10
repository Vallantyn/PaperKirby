var iPortal = 0;

function Portal(xR, yR, xL, yL) {
    this.vertexBuffer = gl.createBuffer();
    this.vertexBuffer.itemSize = 3;
    this.vertexBuffer.numItems = 4;

    this.right = [xR, yR];
    this.left = [xL, yL];

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

    this.r = 0;

    this.Init = function() {

	this.blueTexture.img = new Image();
	this.blueTexture.img._parent = this.blueTexture;
	this.blueTexture.img.onload = function() {
	    handleLoadedTexture(this._parent);
	};

	this.orangeTexture.img = new Image();
	this.orangeTexture.img._parent = this.orangeTexture;
	this.orangeTexture.img.onload = function() {
	    handleLoadedTexture(this._parent);
	};

	this.blueTexture.img.src = "Res/bluePortal.png";
	this.orangeTexture.img.src = "Res/orangePortal.png";
    }

    this.Anim = function() {
	this.r += 1.5;
    }

    this.DrawLeft = function(x, y) {
	mvPushMatrix();

	drawToMap();

	gl.uniform1i(shaderProgram.useLightingUniform, false);

	mat4.translate(mvMatrix, [x*4+2.01, y*2-1.0, 0.0]);
	mat4.rotate(mvMatrix, degToRad(this.r), [1.0, 0.0, 0.0])

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

    this.DrawRight = function(x, y) {
	mvPushMatrix();

	drawToMap();

	gl.uniform1i(shaderProgram.useLightingUniform, false);

	mat4.translate(mvMatrix, [x*4-2.01, y*2-1, 0.0]);
	mat4.rotate(mvMatrix, degToRad(-this.r), [1.0, 0.0, 0.0])

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
	this.DrawLeft(this.right[0], this.right[1]);
	this.DrawRight(this.left[0], this.left[1]);
    }
}

function portalRight() {
    for (var i=0; i<map.portals.length; i++) {
	if ((cell.cx -1) == map.portals[i].right[0] && cell.cy == map.portals[i].right[1]) {
	    iPortal = i;
	    return true;
	}
    }
    //    iPortal = 0;
    return false;
}

function portalLeft() {
    for (var i=0; i<map.portals.length; i++) {
	if ((cell.cx +1) == map.portals[i].left[0] && cell.cy == map.portals[i].left[1]) {
	    iPortal = i;
	    return true;
	}
    }
    //    iPortal = 0;
    return false;
}

function Exit(x, y, dir, next) {
    this.vertexBuffer = gl.createBuffer();
    this.vertexBuffer.itemSize = 3;
    this.vertexBuffer.numItems = 4;

    this.x = x;
    this.y = y;
    this.next = next;
    this.dir = dir;

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

    this.texture = gl.createTexture();

    this.r = 0;

    this.Init = function() {

	this.texture.img = new Image();
	this.texture.img._parent = this.texture;
	this.texture.img.onload = function() {
	    handleLoadedTexture(this._parent);
	};

	this.texture.img.src = "Res/exit.png";
    }

    this.Anim = function() {
	this.r += 1.5;
    }

    this.Draw = function() {
	mvPushMatrix();

	drawToMap();

	gl.uniform1i(shaderProgram.useLightingUniform, false);

	mat4.translate(mvMatrix, [this.x*4+2.01*this.dir, this.y*2-1.0, 0.0]);
	mat4.rotate(mvMatrix, degToRad(this.r), [1.0, 0.0, 0.0])

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
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
}

function getExit() {
    if ((cell.cx + kirby.dir) == map.exit.x && cell.cy == map.exit.y && kirby.dir != map.exit.dir) {
	return true;
    } else return false;
}

function useExit() {

}