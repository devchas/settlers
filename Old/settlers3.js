$(document).ready(function() {

	setPoints();
	addHTML();
	initTiles();
	initNums();
	initRoads();
	/* initSettlements();
	initCities(); */

}

function setPoints() {
	var y;
	var tempBuff;
	for (i = 0; i < rows; i++) {
		var mid = getRowMid(rowTiles[i]);
		y = topPad + (i * yStep);
		for (j = rowTiles[i]; j < rowTiles[i]; j++) {
			if ((rowTiles[i] % 2 == 0) && (Math.abs(j - mid) < 1)) {
				tempBuff = 0;
			} else {
				tempBuff = buffer;
			}
			x = bMid + (j - mid) * (tWidth + buffer);
			var point = new points(x, y);
			pointArr.push(point);
			tileArr.push(point);
		}
	}
}

function getX(var i, j) {
	
}

function getRowMid(var n) {
	var x;
	for (i = 1; i <= n; i++) {
		x += i;
	}
	return x / n;
}

function points(x, y) {
	this.x = x;
	this.y = y;
}
points.prototype.x = function() {
	return this.x;
}
points.prototype.y = function() {
	return this.y;
}

var rows = 5;
var midRow = 3;
var rowTiles = [3, 4, 5, 4, 3];
var leftPad = 0;
var topPad = 0;
var sideLen = 95;
var buffer = 2;
var dx = Math.sqrt(.75 * dist * dist);
var bMid = ((rowTiles[midRow] * (tWidth + buffer)) - buffer) / 2;
var tWidth = 2 * dx;
var yStep = 1.5 * sideLen + buffer;
var pointArr = [];
var tileArr = [];
