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

    this.anim = {
	i: 0,
	c: 0,

	f: 6,
	steps: 3,

	r: 0
    }

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
	this.DrawIn(xR, yR);
	this.DrawOut(xL, yL);
    }

    this.handleOrangeTexture = function() {
	gl.bindTexture(gl.TEXTURE_2D, this.orangeTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.orangeTexture.img);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.MIPMAP_LINEAR_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
    }


}

function getPortal() {
    var left = false;
    var right = false;
    var iLeft, iRight;
    for (var i=0; i<map.portals.length; i++) {
	if (cell.cx == map.portals[i].left[0] &&
	    cell.cy == map.portals[i].left[1]) {
	    left = true;
	    iLeft = i;
	}

	if (cell.cx == map.portals[i].right[0] &&
	    cell.cy == map.portals[i].right[1]) {
	    right = true;
	    iRight = i;
	}
    }

    if (left && !right) {
	if (kirby.x >= cell.frontLim+0.3 &&
	    kirby.y < cell.cy*2-1) {

	    kirby.x = map.portals[iLeft].right[0]*4-1.9;
	    kirby.y = (map.portals[iLeft].right[1]-1)*2;

	} else if (kirby.x >= cell.frontLim+0.3 &&
	    kirby.y > cell.cy*2-1) {

	    kirby.x = cell.frontLim;
	} else if (cell.left == 1 && kirby.x < cell.backLim && kirby.y < cell.cy*2) kirby.x = cell.backLim;
	return true;

    } else if (!left && right) {
	if (kirby.x <= cell.backLim-0.3 &&
	    kirby.y < cell.cy*2-1) {

	    kirby.x = map.portals[iRight].left[0]*4+1.9;
	    kirby.y = (map.portals[iRight].left[1]-1)*2;
	} else if (kirby.x <= cell.backLim-0.3 &&
	    kirby.y > cell.cy*2-1) {

	    kirby.x = cell.backLim;
	} else if (cell.right == 1 && kirby.x > cell.frontLim && kirby.y < cell.cy*2) kirby.x = cell.frontLim;
	return true;

    } else if (left && right) {
	if (kirby.x >= cell.frontLim+0.3 &&
	    kirby.y < cell.cy*2-1) {

	    kirby.x = map.portals[iLeft].right[0]*4-1.9;
	    kirby.y = (map.portals[iLeft].right[1]-1)*2;

	} else if (kirby.x <= cell.backLim-0.3 &&
	    kirby.y < cell.cy*2-1) {

	    kirby.x = map.portals[iRight].left[0]*4+1.9;
	    kirby.y = (map.portals[iRight].left[1]-1)*2;

	} else if (kirby.x <= cell.backLim-0.3 &&
	    kirby.y > cell.cy*2-1) {

	    kirby.x = cell.backLim;

	} else if (kirby.x >= cell.frontLim+0.3 &&
	    kirby.y > cell.cy*2-1) {

	    kirby.x = cell.frontLim;
	}
	return true;

    } else {
	return false;
    }
}