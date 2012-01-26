function Unverse() {
//map.unverse = true;
unverse++;
	if (unverse == 180) {
	    Y = cell.cy;
	    map = new Map(map.array);
	    map.Init();
	    for (var i = 0; i<map.portals.length; i++) {
		lY = map.portals[i].left[1];
		rY = map.portals[i].right[1];
		map.portals[i].left[1] = map.array.length - 1 - lY;
		map.portals[i].right[1] = map.array.length - 1 - rY;
	    //map.portals[i].Init();
	    }
	    kirby.y = (map.array.length - 1 - Y)*2 - 1;

	    map.unverse = false;
	    unverse = 0;
	}
}

function unStuck() {
    kirby.x = 0;
    kirby.y = 0;
}

function split() {
    var _tempMap = map.array;
    for (var i=0; i<_tempMap.length; i++) {
	var n = _tempMap[i].length - 1 - cell.cx+1;
	newLine = _tempMap[i].splice(cell.cx+1, n);
	_tempMap[i] = newLine.concat(_tempMap[i]);
    }
     map = new Map(_tempMap.reverse());
     map.Init();
     kirby.x = (map.array[0].length -1)*4;
    //return _tempMap;
}