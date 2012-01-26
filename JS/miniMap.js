var wTile, hTile, mMapHeight, mMapWidth, ctx, c;
wTile = 32;
hTile = 32;

function initMiniMap() {
    c = document.getElementById("minicanvas")
    miniMap = document.getElementById("miniMap")
    ctx = c.getContext('2d');
}

function drawMiniMap() {
    c.height = map.array.length*hTile;
    c.width = map.array[0].length*wTile;
//    miniMap.style.top = -c.height;
//    miniMap.style.left = -c.width;
    for (var i = 0; i<map.array.length; i++) {
	for (var j = 0; j<map.array[i].length; j++) {
	    if (map.array[i][j] == 1) {
		ctx.fillStyle = "green";
		ctx.fillRect(wTile*j, hTile*(map.array.length-i-1), wTile, hTile);
	    }
	}
    }

    ctx.fillStyle = "pink";
    ctx.fillRect(wTile*cell.cx, hTile*(map.array.length-cell.cy-1), wTile, hTile);
}