phy= {
    ground: 0.0,
    gravity: 0.2,

    speed: 0.2,
    accel: 0.01,

};

function getCollisions() {

    cell = {
	cx: Math.floor((kirby.x+2)/4),
	cy: Math.floor((kirby.y)/2)+1,
    };

    up = false;
    down = false;
    left = false;
    right = false;

    cell.right = map.array[cell.cy][cell.cx+1];
    cell.left = map.array[cell.cy][cell.cx-1];
    cell.up = map.array[cell.cy+1][cell.cx];
    cell.down = map.array[cell.cy-1][cell.cx];

    cell.backLim = cell.cx*4 -1.6;
    cell.frontLim = cell.cx*4 +1.6;
    cell.upLim = (cell.cy-1)*2 +1.6;

    if (map.array[cell.cy][cell.cx] == 1) {
	if (kirby.x > cell.cx*4) {
	    right = true;
	}

	if (kirby.x < cell.cx*4) {
	    left = true;
	}

	if (kirby.y > (cell.cy-1)*2+1) {
	    up = true;
	}

	if (kirby.y < (cell.cy-1)*2+1) {
	    down = true;
	}

	if (up && !down && !left && !right) {
	    kirby.y += 1;
	} else if (!up && down && !left && !right) {
	    kirby.y -= 1;
	} else if (!up && !down && left && !right) {
	    kirby.x -= 2;
	} else if (!up && !down && !left && right) {
	    kirby.x += 2;
	}
    }

    if (cell.cx == 0 && kirby.x <= cell.backLim) kirby.x = cell.backLim;
    if (cell.cx == map.array[cell.cy].length - 1 && kirby.x >= cell.frontLim) kirby.x = cell.frontLim;

    phy.ground = (cell.cy*2 - 2)*cell.down;



    if (!getPortal()) {

	if (cell.right == 1 && kirby.x > cell.frontLim && kirby.y < cell.cy*2) kirby.x = cell.frontLim;

	if (cell.left == 1 && kirby.x < cell.backLim && kirby.y < cell.cy*2) kirby.x = cell.backLim;
    }

    if (cell.up == 1 && kirby.y > cell.upLim) {
	kirby.y = cell.upLim;
	kirby.state.jump = false;
	kirby.state.fall = true;
    }

    if(kirby.y > phy.ground && kirby.state.jump == false) {
	if (kirby.state.fall == false) phy.speed = 0.0;
	kirby.state.fall = true;
	kirby.y -= phy.speed;

	if(phy.speed < phy.gravity) {
	    phy.speed += phy.accel;
	} else {
	    phy.speed = phy.gravity;
	}
    }

    if(kirby.y <= phy.ground) {
	kirby.state.fall = false;
	kirby.y = phy.ground;
	phy.speed = phy.gravity;
    }
}