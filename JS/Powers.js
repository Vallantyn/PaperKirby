var xTimer=0;
var yTimer=0;
var match = [];
var alphaTimer = 0;
//canvas.style.opacity = 1;


function Unverse() { // Invert gravity
    unverse+=2;
    if (unverse > 180) {
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

var fade = {
    toBlack: function() {
        canvas.style.opacity = 1/alphaTimer;
        if (canvas.style.opacity < 0.1) canvas.style.opacity = 0;
    },
    fromBlack: function() {
        canvas.style.opacity = (alphaTimer-30)/15;
        if (canvas.style.opacity > 0.9) canvas.style.opacity = 1;
    }
}

function unStuck() { // reset char pos to start of the level (reload the map in fact...)
    if (alphaTimer < 15) {
        fade.toBlack();
    } else if (alphaTimer == 15) {
        changeLevel(cLvl);
    } else if (alphaTimer >= 30 && alphaTimer < 45) {
        fade.fromBlack();
    } else if (alphaTimer >= 45) {
        kirby.power.unStuck = false;
    }
    
    if (alphaTimer < 45) alphaTimer++;
    else alphaTimer = 0;
}

function split() { //split the map in twice parts
    //----- Animation -----
    //if (test) {
        
    if (xTimer == 0 && yTimer == 0) {
        match = [];
        
        for (var y=0; y<map.array.length; y++) {
            for (var x=0; x<map.array[y].length; x++) {
                if (map.array[y][x] == 1) {
                    match.push(x+y*map.array[y].length);
                }
            }
        }
            
        console.log(match);
    }        
        
        
    for (var i=0; i < map.vertices.length; i+=72) {
        
        if (kirby.dir == 1){
            if (match[i/72]%(map.array[0].length) > cell.cx) {
                for (var j=0; j<24; j++) {
                    if (yTimer < 41 && xTimer == 0) {
                        map.vertices[i+2+j*3]-=0.1;
                    } else if (yTimer > 40 && xTimer < map.array[0].length*10) {
                        map.vertices[i+j*3]-=0.4;
                    } else if (yTimer > 40 && yTimer < 81 && xTimer > map.array[0].length*10-1) {
                        map.vertices[i+2+j*3]+=0.1;
                    }
                    
                }
            }
        } else if ( kirby.dir == -1) {
            if (match[i/72]%(map.array[0].length) < cell.cx) {
                for (var j=0; j<24; j++) {
                    if (yTimer < 41 && xTimer == 0) {
                        map.vertices[i+2+j*3]-=0.1;
                    } else if (yTimer > 40 && xTimer < map.array[0].length*10) {
                        map.vertices[i+j*3]+=0.4;
                    } else if (yTimer > 40 && yTimer < 81 && xTimer > map.array[0].length*10-1) {
                        map.vertices[i+2+j*3]+=0.1;
                    }
                    
                }
            }
        }
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, map.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(map.vertices), gl.STATIC_DRAW);
    
    //----- Action -----
    
    if (yTimer > 80 && xTimer > map.array[0].length*10-1) {
     
        var _tempMap = map.array;
        var _tempDir = 1+ kirby.dir;
    
        //switch (_tempDir) {
        if (_tempDir === 0) {
            if (cell.cx > 0) {
                for (var i=0; i<_tempMap.length; i++) {
                    var n = cell.cx;
                    //console.log(n);
                    var newLine = _tempMap[i].splice(0, n);
                    _tempMap[i] = _tempMap[i].concat(newLine);
                }

                if (lvl[cLvl].portals) { 
                    for (var i = 0; i<lvl[cLvl].portals.length; i++) {
                        var xA = lvl[cLvl].portals[i][0][0];
                        var xB = lvl[cLvl].portals[i][1][0];

                        lvl[cLvl].portals[i][0][0] = xA - cell.cx;
                        lvl[cLvl].portals[i][1][0] = xB - cell.cx;

                        if (lvl[cLvl].portals[i][0][0] < 0) {
                            lvl[cLvl].portals[i][0][0] += lvl[cLvl].array[0].length
                        };
                        if (lvl[cLvl].portals[i][1][0] < 0) {
                            lvl[cLvl].portals[i][1][0] += lvl[cLvl].array[0].length
                        };
                        if (lvl[cLvl].portals[i][0][0] > lvl[cLvl].array[0].length-1) {
                            lvl[cLvl].portals[i][0][0] -= lvl[cLvl].array[0].length
                        };
                        if (lvl[cLvl].portals[i][1][0] > lvl[cLvl].array[0].length-1) {
                            lvl[cLvl].portals[i][1][0] -= lvl[cLvl].array[0].length
                        };
                    }
                }

                var xC = lvl[cLvl].end[0];
                lvl[cLvl].end[0] = xC - cell.cx;
                if ( lvl[cLvl].end[0] < 0) {
                    lvl[cLvl].end[0] += lvl[cLvl].array[0].length
                };
                if ( lvl[cLvl].end[0] > lvl[cLvl].array[0].length-1) {
                    lvl[cLvl].end[0] -= lvl[cLvl].array[0].length
                };

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
            
            if (lvl[cLvl].portals) {
                for (var i = 0; i<lvl[cLvl].portals.length; i++) {
                    var xA = lvl[cLvl].portals[i][0][0];
                    var xB = lvl[cLvl].portals[i][1][0];

                    lvl[cLvl].portals[i][0][0] = xA - cell.cx-1;
                    lvl[cLvl].portals[i][1][0] = xB - cell.cx-1;

                    if (lvl[cLvl].portals[i][0][0] < 0) {
                        lvl[cLvl].portals[i][0][0] += lvl[cLvl].array[0].length
                    };
                    if (lvl[cLvl].portals[i][1][0] < 0) {
                        lvl[cLvl].portals[i][1][0] += lvl[cLvl].array[0].length
                    };
                    if (lvl[cLvl].portals[i][0][0] > lvl[cLvl].array[0].length-1) {
                        lvl[cLvl].portals[i][0][0] -= lvl[cLvl].array[0].length
                    };
                    if (lvl[cLvl].portals[i][1][0] > lvl[cLvl].array[0].length-1) {
                        lvl[cLvl].portals[i][1][0] -= lvl[cLvl].array[0].length
                    };
                }
            }
            
            var xC = lvl[cLvl].end[0];
            lvl[cLvl].end[0] = xC - cell.cx-1;
            if ( lvl[cLvl].end[0] < 0) {
                lvl[cLvl].end[0] += lvl[cLvl].array[0].length
            };
            if ( lvl[cLvl].end[0] > lvl[cLvl].array[0].length-1) {
                lvl[cLvl].end[0] -= lvl[cLvl].array[0].length
            };

            map = new Map(_tempMap.reverse());
            map.Init();

            kirby.x = (map.array[0].length -1)*4;
            
        }
    
        yTimer = 0;
        xTimer = 0;
        kirby.power.split = false;
        console.log("split");
        return
    }
    
    if (yTimer < 41 && xTimer == 0) {
        yTimer++;
    } else if (yTimer > 40 && xTimer < map.array[0].length*10) {
        xTimer++;
    } else if (yTimer > 40 && yTimer < 81 && xTimer > map.array[0].length*10-1) {
        yTimer++;
    }
}

function unDo() { //reverse the last power
// do nothing right now
}

function swap() { // echange two part of the map (double split...)
// do nothing right now too...
}