phy= {
    ground: 0.0,
    gravity: 0.2,

    speed: 0.2,
    accel: 0.01,

};

prev = {
    x: 0.0,
    y: 0.0
}

var bBox;

function boundingBox(a, b) {
    x = kirby.x +a;
    y = kirby.y +b;

    bBox = [
    {
	x: x+0.35,
	y: y+0.9,
    },
    {
	x: x+0.35,
	y: y,
    },
    {
	x: x-0.35,
	y: y+0.9,
    },
    {
	x: x-0.35,
	y: y,
    }
    ];

    for (var i=0; i<bBox.length; i++) {
	bBox[i].Y=Math.floor((bBox[i].y)/2+1);
	bBox[i].X=Math.floor((bBox[i].x+2)/4);
    }
}

function getCollision(x, y) {

    boundingBox(x, y);

    for (var i=0; i<bBox.length; i++) {
//	var Y=Math.floor((bBox[i].y)/2+1);
//	var X=Math.floor((bBox[i].x+2)/4);
	if (map.array[bBox[i].Y][bBox[i].X] == 0) {
	    bBox[i].pass = true;
	} else {
	    bBox[i].pass = false;
	}
    }
    return bBox;
}