function keyDown(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.returnValue = false;
    
    if (!map.unverse) {
	if(e.keyCode == 39 || e.keyCode == 68) {
	    if (!kirby.power.active) {
                kirby.state.walk = true;
                kirby.state.right = true;
                kirby.state.left = false;
                kirby.state.idle = false;
            } else {
                kirby.power.split = true;
                split();
            }

	} else if(e.keyCode == 37 || e.keyCode == 81) {
	    if (!kirby.power.active) {
                kirby.state.walk = true;
                kirby.state.right = false;
                kirby.state.left = true;
                kirby.state.idle = false;
            } else {
                kirby.power.split = true;
                split();
            }

	} else if(e.keyCode == 16) {
	    kirby.state.run = true;

	} else if((e.keyCode == 32 || e.keyCode == 38 || e.keyCode == 90) && kirby.state.fall == false) {
	    kirby.state.jump = true;
        
        } else if ((e.keyCode == 40 || e.keyCode == 83) && kirby.power.active) {
	    kirby.power.inverse = true;
	
        } else if (e.keyCode == 17 || e.keyCode == 83) {
	    kirby.power.active = true;
	}
    }
}

function keyUp(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.returnValue = false;
    
    if (!map.unverse) {
	if(e.keyCode == 39 || e.keyCode == 68) {
	    kirby.state.walk = false;

	} else if(e.keyCode == 37 || e.keyCode == 81) {
	    kirby.state.walk = false;

	} else if(e.keyCode == 16) {
	    kirby.state.run = false;

	} else if((e.keyCode == 32 || e.keyCode == 38 || e.keyCode == 90) && kirby.state.fall == false) {
	    kirby.state.jump = true;
	} else if (e.keyCode == 17) {
	    kirby.power.active = false;
	}

	kirby.anim[id].i = 0;
	kirby.anim[id].c = 0;
    }
}
