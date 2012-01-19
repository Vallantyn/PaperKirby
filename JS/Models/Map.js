var map = {
    vertexPositionBuffer: '',
    vertexTextureCoordBuffer: '',
    vertexIndexBuffer: '',
    vertexNormalBuffer: '',
    texture: '',
};

var mapArray = [
    [1,1,1,1,1,1],
    [0,0,1,1,1,0],
    [0,0,0,1,1,0],
    [1,1,0,0,0,0],
    [0,0,0,1,1,1],
    [0,0,0,0,1,1],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
];

var mVertices = [];
var mTextureCoords = [];
var mIndices = [];
var mNormals = [];

var iid = 0;
var items = 0;

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
}

function initMap() {

    for (var y=0; y < mapArray.length; y++) {
	for (var z=0; z < mapArray[y].length; z++) {
	    if (mapArray[y][z] == 1) {
		var block = new Block(z, y, iid);

		mVertices = mVertices.concat(block.vertices);
		mTextureCoords = mTextureCoords.concat(block.texture);
		mIndices = mIndices.concat(block.indices);
		mNormals = mNormals.concat(block.normals);

		iid +=24;
		items +=6;
	    }
	}
    }

    map.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, map.vertexPositionBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mVertices), gl.STATIC_DRAW);
    map.vertexPositionBuffer.itemSize = 3;
    map.vertexPositionBuffer.numItems = items;

    map.vertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, map.vertexTextureCoordBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mTextureCoords), gl.STATIC_DRAW);
    map.vertexTextureCoordBuffer.itemSize = 2;
    map.vertexTextureCoordBuffer.numItems = items;

    map.vertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, map.vertexIndexBuffer);

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mIndices), gl.STATIC_DRAW);
    map.vertexIndexBuffer.itemSize = 1;
    map.vertexIndexBuffer.numItems = items*6;

    map.vertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, map.vertexNormalBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mNormals), gl.STATIC_DRAW);
    map.vertexNormalBuffer.itemSize = 3;
    map.vertexNormalBuffer.numItems = items;

    map.texture = gl.createTexture();

    map.texture.img = new Image();
    map.texture.img.onload = function() {
	handleLoadedTexture(map.texture);
    }
    map.texture.img.src = "Res/map.png";
}

function drawMap() {
    mvPushMatrix();

    mat4.rotate(mvMatrix, degToRad(10), [1, 0,0]);
    mat4.rotate(mvMatrix, degToRad(-90), [0,1,0]);
    mat4.translate(mvMatrix, [0.0, -kirby.y, kirby.x])


    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, map.texture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, map.vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, map.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, map.vertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, map.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, map.vertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, map.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, map.vertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, map.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix();
}

