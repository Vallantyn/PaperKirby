function Map(a) {
    this.vertexBuffer = gl.createBuffer();
    this.vertexBuffer.itemSize = 3;
    this.vertexBuffer.numItems = 0;

    this.textureBuffer = gl.createBuffer();
    this.textureBuffer.itemSize = 2;
    this.textureBuffer.numItems = 0;

    this.indexBuffer = gl.createBuffer();
    this.indexBuffer.itemSize = 1;
    this.indexBuffer.numItems = 0;

    this.normalBuffer = gl.createBuffer();
    this.normalBuffer.itemSize = 3;
    this.normalBuffer.numItems = 0;

    this.texture = gl.createTexture();

    this.array = a.reverse();

    this.vertices = [];
    this.textureCoords = [];
    this.indices = [];
    this.normal = [];

    this.iid = 0;
    this.items = 0;

    for (var y=0; y < this.array.length; y++) {
	for (var x=0; x < this.array[y].length; x++) {
	    if (this.array[y][x] == 1) {
		var block = new Block(x, y, this.iid);

		this.vertices = this.vertices.concat(block.vertices);
		this.textureCoords = this.textureCoords.concat(block.texture);
		this.indices = this.indices.concat(block.indices);
		this.normal = this.normal.concat(block.normals);

		this.vertexBuffer.numItems += block.verticesItems;
		this.textureBuffer.numItems += block.textureItems;
		this.indexBuffer.numItems += block.indicesItems;
		this.normalBuffer.numItems += block.normalsItems;

		this.iid +=24;
	    }
	}
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoords), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

    this.Init = function() {

	this.texture.img = new Image();
	this.texture.img._parent = this.texture;
	this.texture.img.onload = function() {
	    handleLoadedTexture(this._parent);
	}

	this.texture.img.src = "Res/map.png";

	this.portals = new Array();

	for (var i = 0; i<lvl[cLvl].portals.length; i++) {
	    this.portals.push(new Portal(lvl[cLvl].portals[i][0][0], lvl[cLvl].portals[i][0][1], lvl[cLvl].portals[i][1][0], lvl[cLvl].portals[i][1][1]))
	}
	for (var i=0; i<this.portals.length; i++) this.portals[i].Init();

	this.exit = new Exit(lvl[cLvl].end[0], lvl[cLvl].end[1],lvl[cLvl].dir ,lvl[cLvl].next);
	this.exit.Init();
    }

    this.Draw = function() {
	mvPushMatrix();

	drawToMap();

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	mvPopMatrix();
    }
}

function Block(x, y, id) {
    this.xmin = x*4.0-2.0;
    this.xmax = x*4.0+2.0;

    this.ymax = y*2.0;
    this.ymin = y*2.0 - 2.0;

    this.vertices = [
    // Top
    this.xmax, this.ymax, 2.0,
    this.xmin, this.ymax, 2.0,
    this.xmax, this.ymax, -2.0,
    this.xmin, this.ymax, -2.0,

    // Bottom
    this.xmax, this.ymin, 2.0,
    this.xmin, this.ymin, 2.0,
    this.xmax, this.ymin, -2.0,
    this.xmin, this.ymin, -2.0,

    // Face
    this.xmax,  this.ymax,  2.0,
    this.xmax, this.ymin,  2.0,
    this.xmin,  this.ymax, 2.0,
    this.xmin, this.ymin, 2.0,

    // Back
    this.xmax,  this.ymax,  -2.0,
    this.xmax, this.ymin,  -2.0,
    this.xmin,  this.ymax, -2.0,
    this.xmin, this.ymin, -2.0,

    // Left
    this.xmax,  this.ymax, 2.0,
    this.xmax,  this.ymax, -2.0,
    this.xmax, this.ymin, 2.0,
    this.xmax, this.ymin, -2.0,

    // Right
    this.xmin,  this.ymax, 2.0,
    this.xmin,  this.ymax, -2.0,
    this.xmin, this.ymin, 2.0,
    this.xmin, this.ymin, -2.0,

    ]
    this.verticesItems = 24;

    this.texture = [
    // Top
    0.0, 0.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,

    // Bottom
    0.0, 0.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,

    // Face
    0.0, 0.0,
    0.0, 0.5,
    1.0, 0.0,
    1.0, 0.5,

    // Back
    0.0, 0.0,
    0.0, 0.5,
    1.0, 0.0,
    1.0, 0.5,

    // Left
    0.0, 0.0,
    0.0, 1.0,
    0.5, 0.0,
    0.5, 1.0,

    // Right
    0.0, 0.0,
    0.0, 1.0,
    0.5, 0.0,
    0.5, 1.0,
    ]
    this.textureItems = 24;

    this.indices = [
    // Top
    id+0,id+1,id+2,	    id+1,id+2,id+3,

    // Bottom
    id+4,id+5,id+6,	    id+5,id+6,id+7,

    // Face
    id+8,id+9,id+10,	    id+9,id+10,id+11,

    // Back
    id+12,id+13,id+14,   id+13,id+14,id+15,

    // Left
    id+16,id+17,id+18,   id+17,id+18,id+19,

    // Right
    id+20,id+21,id+22,   id+21,id+22,id+23,
    ]
    this.indicesItems = 36;

    this.normals = [
    // Top
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,

    // Bottom
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,

    // Face
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,

    // Back
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,

    // Left
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    // Right
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    ]
    this.normalsItems = 24;
}
