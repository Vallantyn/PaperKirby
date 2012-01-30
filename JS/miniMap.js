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
		ctx.fillStyle = "white";
		ctx.fillRect(wTile*j, hTile*(map.array.length-i-1), wTile, hTile);
	    }
	    ctx.strokeStyle = "dimGrey";
	    ctx.strokeRect(wTile*j, hTile*(map.array.length-i-1), wTile, hTile);
	}
    }

    ctx.fillStyle = "grey";
    ctx.fillRect(wTile*cell.cx, hTile*(map.array.length-cell.cy-1), wTile, hTile);

    for (var i = 0; i<map.portals.length; i++) {
	ctx.fillStyle = "orange";
	ctx.fillRect(map.portals[i].left[0]*wTile, (map.array.length - 1 - map.portals[i].left[1])*hTile, wTile/4, hTile);
	ctx.fillStyle = "dodgerblue";
	ctx.fillRect((map.portals[i].right[0]+1)*wTile-wTile/4, (map.array.length - 1 - map.portals[i].right[1])*hTile, wTile/4, hTile);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(map.exit.x*wTile, (map.array.length - 1 - map.exit.y)*hTile, wTile, hTile);

}