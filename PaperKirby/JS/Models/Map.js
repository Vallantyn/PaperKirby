var map = {
    vertexPositionBuffer: '',
    vertexTextureCoordBuffer: '',
    vertexIndexBuffer: '',
    vertexNormalBuffer: '',
    texture: '',
};

var mapArray = [0,0,0,1,1,2,0,1,2,2,2,1,2,1,1,0,0];

var mVertices = [];
var mTextureCoords = [];
var mIndices = [];
var mNormals = [];

var iid = 0;
var items = 0;

var id;

function initMap() {
    //debugger;

    mVertices.push(
	2.0,  0.0, 2.0,
	2.0, -1.0, 2.0,
	-2.0,  0.0, 2.0,
	-2.0, -1.0, 2.0
	);
    mTextureCoords.push(
	2.0, 0.5,
	2.0, 0.0,
	0.0, 0.5,
	0.0, 0.0
	);
    mIndices.push(
	iid, iid+1, iid+2,    iid+1, iid+2, iid+3
	);
    mNormals.push(
	0.0, 0.0, -1.0,
	0.0, 0.0, -1.0,
	0.0, 0.0, -1.0,
	0.0, 0.0, -1.0
	);

    iid +=4;
    items++;


    for (var i=0; i < mapArray.length; i++) {
	var imin = -i*4.0-2.0;
	var imax = -i*4.0+2.0;

	mVertices.push(
	    2.0, 0.0, imax,
	    2.0, -1.0, imax,
	    2.0, 0.0, imin,
	    2.0, -1.0, imin
	    );
	mTextureCoords.push(
	    2.0, 0.5,
	    2.0, 0.0,
	    0.0, 0.5,
	    0.0, 0.0
	    );
	mIndices.push(
	    iid, iid+1, iid+2,    iid+1, iid+2, iid+3
	    );
	mNormals.push(
	    -1.0, 0.0, 0.0,
	    -1.0, 0.0, 0.0,
	    -1.0, 0.0, 0.0,
	    -1.0, 0.0, 0.0
	    );

	iid +=4;
	items ++;

	if (mapArray[i] == 0) {
	    mVertices.push(
		2.0, 0.0, imin,
		2.0, 0.0, imax,
		-2.0, 0.0, imin,
		-2.0, 0.0, imax
		);
	    mTextureCoords.push(
		2.0, 2.0,
		2.0, 0.0,
		0.0, 2.0,
		0.0, 0.0
		);
	    mIndices.push(
		iid, iid+1, iid+2,    iid+1, iid+2, iid+3
		);
	    mNormals.push(
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0
		);
	    iid +=4;
	    items++;
	} else if (mapArray[i] == 1) {
	    if (mapArray[i-1] == 0) {
		mVertices.push(
		    2.0, 0.0, imax,
		    2.0, 2.0, imax,
		    -2.0, 0.0, imax,
		    -2.0, 2.0, imax
		    );
		mTextureCoords.push(
		    2.0, 1.0,
		    2, 0.0,
		    0.0, 1.0,
		    0.0, 0.0
		    );
		mIndices.push(
		    iid, iid+1, iid+2,    iid+1, iid+2, iid+3
		    );
		mNormals.push(
		    0.0, 0.0, -1.0,
		    0.0, 0.0, -1.0,
		    0.0, 0.0, -1.0,
		    0.0, 0.0, -1.0
		    );
		iid +=4;
		items++;
	    }

	    mVertices.push(
		2.0, 2.0, imin,
		2.0, 2.0, imax,
		-2.0, 2.0, imin,
		-2.0, 2.0, imax,

		2.0, 0.0, imax,
		2.0, 2.0, imax,
		2.0, 0.0, imin,
		2.0, 2.0, imin
		);
	    mTextureCoords.push(
		2.0, 2.0,
		2.0, 0.0,
		0.0, 2.0,
		0.0, 0.0,

		2.0, 1.0,
		2.0, 0.0,
		0.0, 1.0,
		0.0, 0.0
		);
	    mIndices.push(
		iid, iid+1, iid+2,    iid+1, iid+2, iid+3,
		iid+4, iid+5, iid+6,    iid+5, iid+6, iid+7
		);
	    mNormals.push(
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,

		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0
		);
	    iid +=8;
	    items +=2;
	    if (mapArray[i+1] == 0) {
		mVertices.push(
		    2.0, 0.0, imin,
		    2.0, 2.0, imin,
		    -2.0, 0.0, imin,
		    -2.0, 2.0, imin
		    );
		mTextureCoords.push(
		    2.0, 1.0,
		    2.0, 0.0,
		    0.0, 1.0,
		    0.0, 0.0
		    );
		mIndices.push(
		    iid, iid+1, iid+2,    iid+1, iid+2, iid+3
		    );
		mNormals.push(
		    0.0, 0.0, 1.0,
		    0.0, 0.0, 1.0,
		    0.0, 0.0, 1.0,
		    0.0, 0.0, 1.0
		    );
		iid +=4;
		items++;
	    }

	} else if (mapArray[i] == 2) {
	    if (mapArray[i-1] == 1) {
		mVertices.push(
		    2.0, 2.0, imax,
		    2.0, 4.0, imax,
		    -2.0, 2.0, imax,
		    -2.0, 4.0, imax
		    );
		mTextureCoords.push(
		    2.0, 1.0,
		    2.0, 0.0,
		    0.0, 1.0,
		    0.0, 0.0
		    );
		mIndices.push(
		    iid, iid+1, iid+2,    iid+1, iid+2, iid+3
		    );
		mNormals.push(
		    0.0, 0.0, -1.0,
		    0.0, 0.0, -1.0,
		    0.0, 0.0, -1.0,
		    0.0, 0.0, -1.0
		    );
		iid +=4;
		items++;
	    } else if (mapArray[i-1] == 0) {
		mVertices.push(
		    2.0, 0.0, imax,
		    2.0, 4.0, imax,
		    -2.0, 0.0, imax,
		    -2.0, 4.0, imax
		    );
		mTextureCoords.push(
		    2.0, 2.0,
		    2.0, 0.0,
		    0.0, 2.0,
		    0.0, 0.0
		    );
		mIndices.push(
		    iid, iid+1, iid+2,    iid+1, iid+2, iid+3
		    );
		mNormals.push(
		    0.0, 0.0, -1.0,
		    0.0, 0.0, -1.0,
		    0.0, 0.0, -1.0,
		    0.0, 0.0, -1.0
		    );
		iid +=4;
		items++;
	    }

	    mVertices.push(
		2.0, 4.0, imin,
		2.0, 4.0, imax,
		-2.0, 4.0, imin,
		-2.0, 4.0, imax,

		2.0, 0.0, imax,
		2.0, 4.0, imax,
		2.0, 0.0, imin,
		2.0, 4.0, imin
		);
	    mTextureCoords.push(
		2.0, 2.0,
		2.0, 0.0,
		0.0, 2.0,
		0.0, 0.0,

		2.0, 2.0,
		2.0, 0.0,
		0.0, 2.0,
		0.0, 0.0
		);
	    mIndices.push(
		iid, iid+1, iid+2,    iid+1, iid+2, iid+3,
		iid+4, iid+5, iid+6,    iid+5, iid+6, iid+7

		);
	    mNormals.push(
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,

		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0
		);
	    iid +=8;
	    items +=2;
	    if (mapArray[i+1] == 1) {
		mVertices.push(
		    2.0, 2.0, imin,
		    2.0, 4.0, imin,
		    -2.0, 2.0, imin,
		    -2.0, 4.0, imin
		    );
		mTextureCoords.push(
		    2.0, 1.0,
		    2.0, 0.0,
		    0.0, 1.0,
		    0.0, 0.0
		    );
		mIndices.push(
		    iid, iid+1, iid+2,    iid+1, iid+2, iid+3
		    );
		mNormals.push(
		    0.0, 0.0, 1.0,
		    0.0, 0.0, 1.0,
		    0.0, 0.0, 1.0,
		    0.0, 0.0, 1.0
		    );
		iid +=4;
		items++;
	    } else if (mapArray[i+1] == 0) {
		mVertices.push(
		    2.0, 0.0, imin,
		    2.0, 4.0, imin,
		    -2.0, 0.0, imin,
		    -2.0, 4.0, imin
		    );
		mTextureCoords.push(
		    2.0, 2.0,
		    2.0, 0.0,
		    0.0, 2.0,
		    0.0, 0.0
		    );
		mIndices.push(
		    iid, iid+1, iid+2,    iid+1, iid+2, iid+3
		    );
		mNormals.push(
		    0.0, 0.0, 1.0,
		    0.0, 0.0, 1.0,
		    0.0, 0.0, 1.0,
		    0.0, 0.0, 1.0
		    );
		iid +=4;
		items++;
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

