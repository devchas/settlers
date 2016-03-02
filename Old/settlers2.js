$(document).ready(function() {

	//var width = $(window).width() * .99;
	//var height = $(window).height() * .95;

	addHTML();
	getTileRefs();
	initTiles();
	initNums();
	initRoads();
	/* initSettlements();
	initCities(); */

});

function getTileRefs() {
	for (i = 1; i <= NTILES; i++) {
		var row, col, x, y;
		if (i <= cumRowTiles[0]) {
			row = 1;
		} else if (i <= cumRowTiles[1]) {
			row = 2;
		} else if (i <= cumRowTiles[2]) {
			row = 3;
		} else if (i <= cumRowTiles[3]) {
			row = 4;
		} else {
			row = 5;
		}
		if (row == 1) {
			col = i + 1;
		} else if (row == 2) {
			col = i - cumRowTiles[0];
		} else if (row == 3) {
			col = i - cumRowTiles[1];
		} else if (row == 4) {
			col = i - cumRowTiles[2];
		} else {
			col = i - cumRowTiles[3] + 1;
		}
		if (row % 2 == 0) {
			x = evenLeftInit + xStep * (col - 1);
		} else {
			x = oddLeftInit + xStep * (col - 1);
		}
		y = getY(row);
		var tPoint = new tilePoints(x, y);
		tPointArr.push(tPoint);
	}
}

function getY(row) {
	return topPad + yStep * (row - 1);
}

function addHTML() {
	for (i = 0; i < NTILES; i++) {
		$( ".board" ).append( "<canvas class='tile' />" );
		$( ".board" ).append( "<canvas class='numTile' />" );
	}
	for (i = 0;  i < NROADS; i++) {
		$( ".board" ).append( "<canvas class='road' />" );
	}
}

function initTiles() {
	var tileCnt = 0;
	$('.tile').each(function() {
		tPoints = tPointArr[tileCnt];
		$(this).css({top: tPoints.y, left: tPoints.x, position:'absolute'});
		if (this.getContext) {
			var tileCanv = this.getContext('2d');
			tileCanv.canvas.width = xStep;
			tileCanv.canvas.height = sideLen * 2;
			var hexTile = new createHex(xStep / 2, 0, sideLen, tileCanv, tileCnt);
			if (hexTile.isDesert == true) {
				desertID = hexTile.id;
			}
		}
		tileCnt++;
	});
}

function initNums() {
	var numScale = .75;
	var numRad = sideLen * numScale / 2;
	var numCnt = 0;
	var tileNum;
	var desNum = getTMap(desertID);
	$('.numTile').each(function() {
		tPoints = tPointArr[numCnt];
		$(this).css({top: (tPoints.y + sideLen - numRad), left: (tPoints.x + getDx(sideLen) - numRad), position:'absolute'});
		if (this.getContext && numCnt != desertID) {
			var numCanv = this.getContext('2d');
			numCanv.canvas.width = numRad * 2;
			numCanv.canvas.height = numRad * 2;
			numCanv.fillStyle = '#ffffcc';
			numCanv.arc(numRad, numRad, numRad, 0, 2 * Math.PI);
			numCanv.fill();
			numCanv.fillStyle = "black";
			var font = "bold " + numRad + "px arial";
			numCanv.font = font;
			numCanv.textBaseline = "middle";
			numCanv.textAlign = "center";
			tileNum = getTMap(numCnt);
			if (tileNum > desNum) {
				tileNum--;
			}
			numCanv.fillText(getNum(tileNum), numRad, numRad);
		}
		numCnt++;
	});
}

function initRoads() {
	var vertArr = [0, cumRowTiles[0], cumRowTiles[1], cumRowTiles[2], cumRowTiles[3], cumRowTiles[4]];
	var vertCnt = 0;
	var roadCnt	= 1;
	var tileCnt = 1;
	var x1, y1, x2, y2, dx, dy; 
	var type = "dUp";
	$('.road').each(function() {
		var tPoints = tPointArr[(tileCnt - 1)];
		if (tPoints) {
			x1 = tPoints.x - getDx(sideLen);
			y1 = tPoints.y + sideLen / 2;
			x2 = tPoints.x;
			y2 = tPoints.y;
			if (type == "vert") {
				dx = lWidth;
			} else {
				dx = Math.abs(x2 - x1);
			}
			if (type == "vert") {
				dy = sideLen;
			} else {
				dy = Math.abs(y2 - y1);
			}
			if (this.getContext) {
				$(this).css({top: getTop(y1, y2, type), left: getLeft(x1, x2, type), position: 'absolute'});
				var roadCanv = this.getContext('2d');
				roadCanv.canvas.width = dx;
				roadCanv.canvas.height = dy;
				drawLine(dx, dy, type, roadCanv);
			}
			if ((tileCnt * 3 - roadCnt) <= 0) {
				tileCnt++;
			}
			roadCnt++;
			if (type == "dUp") {
				type = "dDown";
			} else if (type == "dDown") {
				type = "vert";
			} else if (type == "vert") {
				type = "dUp";
			}
		} else {
			if (vertCnt < 5) {
				console.log(vertArr[vertCnt])
				type = "vert";
				tPoints = tPointArr[vertArr[vertCnt]];
				x1 = tPoints.x; //- getDx(sideLen);
				x2 = x1;
				y1 = tPoints.y + sideLen / 2;
				y2 = y1 + sideLen;
				dx = lWidth;
				dy = y2 - y1;
				if (this.getContext) {
					$(this).css({top: y1, left: x1, position: 'absolute'});
					var roadCanv = this.getContext('2d');
					roadCanv.canvas.width = dx;
					roadCanv.canvas.height = dy;
					drawLine(dx, dy, "vert", roadCanv);
				}
				vertCnt++;
			}
		}
	});
}

function getLeft(x1, x2, type) {
	if (type == "dUp") {
		return Math.max(x1, x2);
	} else if (type == "dDown") {
		return Math.max(x1, x2) + Math.abs(x1 - x2);
	} else if (type == "vert") {
		return Math.max(x1, x2) + xStep - buffer;
	}
}

function getTop(y1, y2, type) {
 	if (type == "vert") {
		return Math.min(y1, y2) + sideLen / 2;
	} else {
		return Math.min(y1, y2);
	}
}

function drawLine(dx, dy, type, c) {
	var x1, x2, y1, y2;
	if (type == "dUp") {
		x1 = 0;
		x2 = dx;
		y1 = dy;
		y2 = 0;
	} else if (type == "dDown") {
		x1 = 0;
		x2 = dx;
		y1 = 0;
		y2 = dy;
	} else if (type == "vert") {
		x1 = dx / 2;
		x2 = dx / 2;
		y1 = 0;
		y2 = dy;
	}
	c.beginPath();
	c.moveTo(x1, y1);
	c.lineTo(x2, y2);
	c.strokeStyle = "#0000FF";
	c.lineWidth = lWidth;
	c.stroke();
}

function createHex(ix, iy, dist, c2, id) {
	this.id = id;
	this.isDesert = false;
	this.ix = ix;
	this.iy = iy;
	var x = this.ix;
	var y = this.iy;
	this.dist = dist;
	var dist = this.dist;
	var dx = getDx(dist);	
	var dy = dist / 2;

	while (true) {
		fill = getFill();
		if (fill) {break;}
	}
	if (fill == desColor) {
		this.isDesert = true;
	}

	c2.fillStyle = fill;
	c2.beginPath();
	c2.moveTo(x, y);
	c2.lineTo(x + dx, y + dy);
	c2.lineTo(x + dx, y + dy + dist);
	c2.lineTo(x, y + 2 * dist);
	c2.lineTo(x - dx, y + dy + dist);
	c2.lineTo(x - dx, y + dy);
	c2.closePath();
	c2.fill();
}
createHex.prototype.id = function() {
	return this.id;
}
createHex.prototype.isDesert = function() {
	return this.isDesert;
}

function getFill() {
	var color;
	r = Math.floor(Math.random() * 6) + 1
	switch (r) {
		case 1: 
			if (desert > 0) {
				desert--;
				color = desColor;
			}
			break;
		case 2:
			if (brick > 0) {
				brick--;
				color = brColor;
			}
			break;
		case 3:
			if (ore > 0) {
				ore--;
				color = oreColor;
			}
			break;
		case 4:
			if (sheep > 0) {
				sheep--;
				color = shColor;
			}
			break;
		case 5:
			if (wheat > 0) {
				wheat--;
				color = whColor;
			}
			break;
		case 6:
			if (wood > 0) {
				wood--;
				color = woColor;
			}
			break;
	}
	return color;
}

function tilePoints(x, y) {
	this.x = x;
	this.y = y;
}
tilePoints.prototype.x = function() {
	return this.x
};
tilePoints.prototype.y = function() {
	return this.y
};

function getDx(dist) {
	return Math.sqrt(.75 * dist * dist);
}

function getTMap(n) {
	var tMap = {};
	tMap[16] = 1;
	tMap[17] = 2;
	tMap[18] = 3;
	tMap[15] = 4;
	tMap[11] = 5;
	tMap[6] = 6;
	tMap[2] = 7;
	tMap[1] = 8;
	tMap[0] = 9;
	tMap[3] = 10;
	tMap[7] = 11;
	tMap[12] = 12;
	tMap[13] = 13;
	tMap[14] = 14;
	tMap[10] = 15;
	tMap[5] = 16;
	tMap[4] = 17;
	tMap[8] = 18;
	tMap[9] = 19;
	return tMap[n];
}

function getNum(n) {
	var map = {};
	map[1] = 5;
	map[2] = 2;
	map[3] = 6;
	map[4] = 3;
	map[5] = 8;
	map[6] = 10;
	map[7] = 9;
	map[8] = 12;
	map[9] = 11;
	map[10] = 4;
	map[11] = 8;
	map[12] = 10;
	map[13] = 9;
	map[14] = 4;
	map[15] = 5;
	map[16] = 6;
	map[17] = 3;
	map[18] = 11;
	return map[n];
}

const NTILES = 19;
const NROADS = 80;

var sideLen = 98;
var topPad = 20;
var leftPad = 40;
var buffer = 2
var xStep = 2 * getDx(sideLen) + buffer;
var yStep = 1.5 * sideLen + buffer;
var oddLeftInit = leftPad + getDx(sideLen);
var evenLeftInit = leftPad + xStep;
var cumRowTiles = [3, 7, 12, 16, 19];
var tPointArr = [];
var desertID;
var lWidth = 7;

var desert = 1;
var desColor = '#805500';
var brick = 3;
var brColor = '#990000';
var ore = 3;
var oreColor = '#333333';
var sheep = 4;
var shColor = '#66ff99';
var wheat = 4;
var whColor = '#ffcc00';
var wood = 4;
var woColor = '#004d00';
