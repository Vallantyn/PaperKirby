function Unverse() {
    unverse++;
    if (unverse == 180) {
	Y = cell.cy;
	for (var i = 0; i<lvl[cLvl].portals.length; i++) {
	    var yA = lvl[cLvl].portals[i][0][1];
	    var yB = lvl[cLvl].portals[i][1][1];
	    lvl[cLvl].portals[i][0][1] = map.array.length - 1 - yA;
	    lvl[cLvl].portals[i][1][1] = map.array.length - 1 - yB;
	}
	var yC = lvl[cLvl].end[1];
	lvl[cLvl].end[1] = map.array.length - 1 - yC;

	map = new Map(map.array);
	map.Init();

	kirby.y = (map.array.length - 1 - Y)*2 - 1;

	map.unverse = false;
	unverse = 0;
    }
}

function unStuck() {
    changeLevel(lvl);
}

function split() {
    var _tempMap = map.array;
    
    for (var i=0; i<_tempMap.length; i++) {
	var n = _tempMap[i].length - 1 - cell.cx+1;
	var newLine = _tempMap[i].splice(cell.cx+1, n);
	_tempMap[i] = newLine.concat(_tempMap[i]);
    }

    map = new Map(_tempMap.reverse());
    map.Init();
    kirby.x = (map.array[0].length -1)*4;
}