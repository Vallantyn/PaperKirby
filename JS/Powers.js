function Unverse() { // Invert gravity
    unverse++;
    if (unverse == 180) {
	Y = cell.cy;
        if (lvl[cLvl].portals) {
            for (var i = 0; i<lvl[cLvl].portals.length; i++) {
                var yA = lvl[cLvl].portals[i][0][1];
                var yB = lvl[cLvl].portals[i][1][1];
                lvl[cLvl].portals[i][0][1] = map.array.length - 1 - yA;
                lvl[cLvl].portals[i][1][1] = map.array.length - 1 - yB;
            }
        }
        var yC = lvl[cLvl].end[1];
	lvl[cLvl].end[1] = map.array.length - 1 - yC;

	map = new Map(map.array);
	map.Init();

	kirby.y = (map.array.length - 1 - Y)*2 - 1;

	kirby.power.inverse = false;
	unverse = 0;
    }
}

function unStuck() { // reset char pos to start of the level (reload the map in fact...)
    changeLevel(cLvl);
}

function split() { //split the map in twice parts
    var _tempMap = map.array;
    var _tempDir = 1+ kirby.dir;
    
    //switch (_tempDir) {
        if (_tempDir === 0) {
            if (cell.cx > 0) {
                for (var i=0; i<_tempMap.length; i++) {
                    var n = cell.cx;
                    console.log(n);
                    var newLine = _tempMap[i].splice(0, n);
                    _tempMap[i] = _tempMap[i].concat(newLine);
                }

                if (lvl[cLvl].portals) { 
                    for (var i = 0; i<lvl[cLvl].portals.length; i++) {
                        var xA = lvl[cLvl].portals[i][0][0];
                        var xB = lvl[cLvl].portals[i][1][0];

                        lvl[cLvl].portals[i][0][0] = xA - cell.cx;
                        lvl[cLvl].portals[i][1][0] = xB - cell.cx;

                        if (lvl[cLvl].portals[i][0][0] < 0) { lvl[cLvl].portals[i][0][0] += lvl[cLvl].array[0].length };
                        if (lvl[cLvl].portals[i][1][0] < 0) { lvl[cLvl].portals[i][1][0] += lvl[cLvl].array[0].length };
                        if (lvl[cLvl].portals[i][0][0] > lvl[cLvl].array[0].length-1) { lvl[cLvl].portals[i][0][0] -= lvl[cLvl].array[0].length };
                        if (lvl[cLvl].portals[i][1][0] > lvl[cLvl].array[0].length-1) { lvl[cLvl].portals[i][1][0] -= lvl[cLvl].array[0].length };
                    }
                }

                var xC = lvl[cLvl].end[0];
                lvl[cLvl].end[0] = xC - cell.cx;
                if ( lvl[cLvl].end[0] < 0) { lvl[cLvl].end[0] += lvl[cLvl].array[0].length };
                if ( lvl[cLvl].end[0] > lvl[cLvl].array[0].length-1) { lvl[cLvl].end[0] -= lvl[cLvl].array[0].length };

                map = new Map(_tempMap.reverse());
                map.Init();

                kirby.x = 0;
            }
            
        } else {
            for (var i=0; i<_tempMap.length; i++) {
                var n = _tempMap[i].length - 1 - cell.cx+1;
                var newLine = _tempMap[i].splice(cell.cx+1, n);
                _tempMap[i] = newLine.concat(_tempMap[i]);
            }
            
            for (var i = 0; i<lvl[cLvl].portals.length; i++) {
                var xA = lvl[cLvl].portals[i][0][0];
                var xB = lvl[cLvl].portals[i][1][0];

                lvl[cLvl].portals[i][0][0] = xA - cell.cx-1;
                lvl[cLvl].portals[i][1][0] = xB - cell.cx-1;
                
                if (lvl[cLvl].portals[i][0][0] < 0) { lvl[cLvl].portals[i][0][0] += lvl[cLvl].array[0].length };
                if (lvl[cLvl].portals[i][1][0] < 0) { lvl[cLvl].portals[i][1][0] += lvl[cLvl].array[0].length };
                if (lvl[cLvl].portals[i][0][0] > lvl[cLvl].array[0].length-1) { lvl[cLvl].portals[i][0][0] -= lvl[cLvl].array[0].length };
                if (lvl[cLvl].portals[i][1][0] > lvl[cLvl].array[0].length-1) { lvl[cLvl].portals[i][1][0] -= lvl[cLvl].array[0].length };
            }
            
            var xC = lvl[cLvl].end[0];
            lvl[cLvl].end[0] = xC - cell.cx-1;
            if ( lvl[cLvl].end[0] < 0) { lvl[cLvl].end[0] += lvl[cLvl].array[0].length };
            if ( lvl[cLvl].end[0] > lvl[cLvl].array[0].length-1) { lvl[cLvl].end[0] -= lvl[cLvl].array[0].length };

            map = new Map(_tempMap.reverse());
            map.Init();

            kirby.x = (map.array[0].length -1)*4;
            
        }
        
    kirby.power.split = false;
}

function unDo() { //reverse the last power
    // do nothing right now
}

function swap() { // echange two part of the map (double split...)
    // do nothing right now too...
}