var kirby = {
    vertexPosBuffer: '',
    vertexTextureCoordBuffer: '',
    texture: '',

    x: 0,
    y: 0,
    r: 0,

    state : {
	idle: true,
	walk: false,
	run: false,

	jump: false,
	fall: false,

	left: true,
	right: false
    },

    anim: {
	width: 16,
	height: 2,
	size: 64,



	stand: {
	    xOri: 0.0,
	    yOri: 0.0,
	    steps: 3,

	    c: 0,
	    i: 0,
	    f: 6

	},

	walk: {
	    xOri: 0.25,
	    yOri: 0.0,
	    steps: 9,

	    c: 0,
	    i: 0,
	    f: 4

	},

	run: {
	    xOri: 0.0,
	    yOri: 0.5,
	    steps: 7,

	    c: 0,
	    i: 0,
	    f: 4

	},

	jump: {
	    xOri: 0.875,
	    yOri: 0.0,
	    steps: 0,

	    c: 0,
	    i: 0,
	    f: 4

	},

	fall: {
	    xOri: 0.9375,
	    yOri: 0.0,
	    steps: 0,

	    c: 0,
	    i: 0,
	    f: 4

	}
    }
};

function initKirby() {
    kirby.vertexPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, kirby.vertexPosBuffer);
    vertices = [
    // Front face
    0.5, 0.5,  0.0,
    -0.5, 0.5,  0.0,
    0.5,  -0.5,  0.0,
    -0.5,  -0.5,  0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    kirby.vertexPosBuffer.itemSize = 3;
    kirby.vertexPosBuffer.numItems = 4;

    kirby.vertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, kirby.vertexTextureCoordBuffer);
    var textureCoords = [
    0.0, 0.0,
    0.0625, 0.0,
    0.0, 0.5,
    0.0625, 0.5
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    kirby.vertexTextureCoordBuffer.itemSize = 2;
    kirby.vertexTextureCoordBuffer.numItems = 4;

    kirby.vertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, kirby.vertexIndexBuffer);
    var kirbyVertexIndices = [
    0, 1, 2,      0, 2, 3,    // Front face
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(kirbyVertexIndices), gl.STATIC_DRAW);
    kirby.vertexIndexBuffer.itemSize = 1;
    kirby.vertexIndexBuffer.numItems = 6;

     kirby.texture = gl.createTexture();

    kirby.texture.img = new Image();
    kirby.texture.img.onload = function() {
	handleLoadedTexture(kirby.texture);
    };
    kirby.texture.img.src = "Res/kirby.png";
}

function animKirby() {
    gl.bindBuffer(gl.ARRAY_BUFFER, kirby.vertexTextureCoordBuffer);

    var textureCoords = [];

    id = 'stand';

    if (kirby.state.walk) {
	id = 'walk';
    }
    if (kirby.state.run && kirby.state.walk) {
	id = 'run';
    }
    if (kirby.state.jump) {
	id = 'jump';
    }
    if (kirby.state.fall) {
	id = 'fall';
    }

    if (kirby.anim[id].c >= kirby.anim[id].steps && kirby.anim[id].i >= kirby.anim[id].f) {
	kirby.anim[id].i = 0;
	kirby.anim[id].c = 0;
    } else if (kirby.anim[id].i >= kirby.anim[id].f && kirby.anim[id].c < kirby.anim[id].steps) {
	kirby.anim[id].i = 0;
	kirby.anim[id].c++;
    }

    xOri = kirby.anim[id].xOri + ((1.0 / kirby.anim.width)*kirby.anim[id].c);
    yOri = kirby.anim[id].yOri;
    xEnd = xOri + (1.0/kirby.anim.width);
    yEnd = yOri + (1.0 / kirby.anim.height);


    textureCoords = [
    xOri, yOri,
    xEnd, yOri,
    xOri, yEnd,
    xEnd, yEnd,
    ];

    kirby.anim[id].i++;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
}

function moveKirby() {
    var dir;

    if (kirby.state.left == true && kirby.state.right == false) {
	kirby.r = 0;
	dir = -1;
    } else if (kirby.state.right == true && kirby.state.left == false) {
	kirby.r = 180;
	dir = 1;
    }

    if (kirby.state.jump) {
	dir*=2;
    }

    if (kirby.state.walk == true && kirby.state.run == false) {
	kirby.x += (0.05 * dir);
	phy.gravity = 0.5;
    }

    if (kirby.state.run == true && kirby.state.walk == true) {
	kirby.x += (0.1 * dir);
	phy.gravity = 0.7;
    }

    if (kirby.state.jump == true) {
	kirby.y += phy.speed;

	if(phy.speed <= 0.0) {
	    kirby.state.jump = false;
	    kirby.state.fall = true;
	    phy.speed = 0.0;
	} else {
	    phy.speed -= phy.accel;
	}
    }

    if	(kirby.state.fall == true && kirby.state.jump == false) {
	id = 'fall';
    }

    getCollisions();
}

function drawKirby() {
    mvPushMatrix();
    mat4.translate(mvMatrix, [0.0, 0.4, 0.0])

    mat4.rotate(mvMatrix, degToRad(kirby.r), [0,1,0]);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, kirby.texture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, kirby.vertexPosBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, kirby.vertexPosBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, kirby.vertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, kirby.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, kirby.vertexPosBuffer.numItems);
    mvPopMatrix();
}