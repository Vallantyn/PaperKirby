phy= {
	ground: 0.0,
	gravity: 0.5,

	speed: 0.5,
	accel: 0.05,

    };

function getCollisions() {

    cell = {
	current: Math.floor((kirby.x+2)/4),

	id: mapArray[Math.floor((kirby.x+2)/4)],
	previous: mapArray[Math.floor((kirby.x+2)/4) -1],
	next: mapArray[Math.floor((kirby.x+2)/4) +1],

	backLim: Math.floor((kirby.x+2)/4)*4 -1.6,
	frontLim: Math.floor((kirby.x+2)/4)*4 +1.6
    };

    if (cell.current == 0 && kirby.x <= cell.backLim) kirby.x = cell.backLim;
    if (cell.current == mapArray.length - 1 && kirby.x >= cell.frontLim) kirby.x = cell.frontLim;

    phy.ground = cell.id * 2;

    if (cell.next == 1 && kirby.x >= cell.frontLim && kirby.y < 2.0) kirby.x = cell.frontLim;
    if (cell.next == 2 && kirby.x >= cell.frontLim && kirby.y < 4.0) kirby.x = cell.frontLim;

    if (cell.previous == 1 && kirby.x <= cell.backLim && kirby.y < 2.0)	kirby.x = cell.backLim;
    if (cell.previous == 2 && kirby.x <= cell.backLim && kirby.y < 4.0)	kirby.x = cell.backLim;

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

/*if (kirby.x <= -1.5) {
	kirby.x = -1.5;
    } else if (kirby.x >= 9.5) {
	kirby.x = 9.5;
    }*/
}