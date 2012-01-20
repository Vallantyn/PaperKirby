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

    this.array = a;

    this.vertices = [];
    this.textureCoords = [];
    this.indices = [];
    this.normal = [];

    this.iid = 0;
    this.items = 0;

    for (var y=0; y < this.array.length; y++) {
	for (var z=0; z < this.array[y].length; z++) {
	    if (this.array[y][z] > 0) {
		var block = new Block(z, y, this.iid);

		this.vertices = this.vertices.concat(block.vertices);
		this.textureCoords = this.textureCoords.concat(block.texture);
		this.indices = this.indices.concat(block.indices);
		this.normal = this.normal.concat(block.normals);

		this.vertexBuffer.numItems += block.verticesItems;
		this.textureBuffer.numItems += block.textureItems;
		this.indexBuffer.numItems += block.indicesItems;
		this.normalBuffer.numItems += block.normalsItems;

		this.iid +=24;

		if (this.array[y][z] == 2) ;
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
	this.texture.img.onload = function() {
	    handleLoadedTexture(map.texture);
	}

	this.texture.img.src = "Res/map.png";

	portal = new Portal(5,1,1,1);
	portal.Init();

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

function Block(z, y, id) {
    this.zmin = -z*4.0-2.0;
    this.zmax = -z*4.0+2.0;

    this.ymax = y*2.0;
    this.ymin = y*2.0 - 2.0;

    this.vertices = [
    // Top
    2.0, this.ymax, this.zmax,
    2.0, this.ymax, this.zmin,
    -2.0, this.ymax, this.zmax,
    -2.0, this.ymax, this.zmin,

    // Bottom
    2.0, this.ymin,  this.zmax,
    2.0, this.ymin, this.zmin,
    -2.0, this.ymin,  this.zmax,
    -2.0, this.ymin, this.zmin,

    // Face
    2.0,  this.ymax,  this.zmax,
    2.0, this.ymin,  this.zmax,
    2.0,  this.ymax, this.zmin,
    2.0, this.ymin, this.zmin,

    // Back
    -2.0,  this.ymax,  this.zmax,
    -2.0, this.ymin,  this.zmax,
    -2.0,  this.ymax, this.zmin,
    -2.0, this.ymin, this.zmin,

    // Left
    2.0,  this.ymax, this.zmax,
    -2.0,  this.ymax, this.zmax,
    2.0, this.ymin, this.zmax,
    -2.0, this.ymin, this.zmax,

    // Right
    2.0,  this.ymax, this.zmin,
    -2.0,  this.ymax, this.zmin,
    2.0, this.ymin, this.zmin,
    -2.0, this.ymin, this.zmin,

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
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    // Back
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,

    // Left
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,

    // Right
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    ]
    this.normalsItems = 24;
}
