$(document).ready(function() {

	setPoints();
	setRdArrs();
	setRdPoints();
	addHTML();
	initTiles();
	initNums();
	initRoads();
	initSettlements();
	//initCities();

});

function setColor(inColor) {
	color = inColor;
}

function settleColor(inColor) {
	sColor = inColor;
}

$('html').click(function(e) {                    
   if(!$(e.target).hasClass('setColor') )
   {
       color = null;                
   }
}); 

// Sets all points in the game grid and pushes them to arrays
function setPoints() {
	var rowLen;
	var y;
	var tempBuff;
	var firstLast;
	// Sets all points except those on the very bottom of the board 
	for (var i = 0; i < rows; i++) {
		// Sets points for first row of each tile
		y = (i * yStep);
		rowLen = rowTiles[i];
		// Accounts for bottom left and right corners from previous row
		if (i > midRow - 1) {
			rowLen += 2;
			firstLast = false;
		} else {
			firstLast = true;
		}
		setRows(rowLen, y, true, firstLast);
		// Set points for second row of each tile
		y += dy;
		rowLen = rowTiles[i] + 1;
		setRows(rowLen, y, false, true);
	}
	// Sets points for second to last row (indented up on very bottom of board)
	y += sideLen;
	rowLen = rowTiles[0] + 1;
	setRows(rowLen, y, false, true);
	// Sets points for last row (very bottom of board)
	y += dy + buffer;
	rowLen = rowTiles[0];
	setRows(rowLen, y, false, true);
}

/* Sets points all points for a given row and pushes to array
*  @rowLen Length of row; @y Y coordinate; @isTile Push onto tile array if true
*  @firstLast Exclude first and last row points from tile array if false 
*/
function setRows(rowLen, y, isTile, firstLast) {
	var mid = getMidTile(rowLen);
	for (var i = 0; i < rowLen; i++) {
		var x = getX(rowLen, i, mid);
		var point = new points(x + leftPad, y + topPad);
		if (isTile) {
			if (!firstLast) {
				if (i != 0 && i != (rowLen - 1)) {
					tileArr.push(point);
				}
			} else {
				tileArr.push(point);
			}
		}
	}	
}

// Returns the x value for a given point
function getX(rowLen, thisPt, mid) {
	thisPt++;
	var bMid = (rowTiles[midRow - 1] * (tWidth + (buffer - 1))) / 2 + leftPad;
	return bMid + (thisPt - mid) * (tWidth + buffer);
}

// Returns the mid value for a given row or column
function getMidTile(n) {
	var x = 0;
	for (var i = 1; i <= n; i++) {
		x += i;
	}
	return x / n;
}

// Point coordinates
function points(x, y) {
	this.x = x;
	this.y = y;
	pointArr.push(this);
}
points.prototype.x = function() {
	return this.x;
}
points.prototype.y = function() {
	return this.y;
}

function setRdArrs() {
	var cumPoints = 0;
	var halfPts = pointArr.length / 2;
	for (var i = 0; i < rows; i++) {
		tipArr.push(cumPoints);
		if (cumPoints > halfPts) {
			leftArr.push(cumPoints - 1);
			vertArr.push(cumPoints + rowTiles[i] + 1);
			rightArr.push(cumPoints + rowTiles[i]);
		} else {
			vertArr.push(cumPoints + rowTiles[i]);
		}
		cumPoints += (2 * rowTiles[i] + 1);
		if (cumPoints == halfPts) {
			cumPoints++;
		} else if (cumPoints > halfPts) {
			cumPoints += 2;
		}
	}
	leftArr.push(pointArr.length - 2 * rowTiles[rowTiles.length - 1] - 1);
	var lastR = pointArr.length - rowTiles[rowTiles.length - 1] - 1;
	rightArr.push(lastR);
	
	for (var i = rowTiles[rowTiles.length - 1] - 1; i > 0; i--) {
		var jmp = rowTiles[rowTiles.length - 1] * 2 - 2 + i;
		btArr.push(pointArr.length - jmp);
	}
}

function setRdPoints() {
	setTipPts();
	setVertPts();
	setLeftPts();
	setRightPts();
	setBtPts();
}

// Object containing two x/y coordinates for each road; stored in rdPtArr array
function rdPoint(p1, p2, type) {
	this.p1 = p1;
	this.p2 = p2;
	this.type = type;
	rdPtArr.push(this);
}
rdPoint.prototype.p1 = function() {
	return this.p1;
}
rdPoint.prototype.p2 = function() {
	return this.p2;
}
rdPoint.prototype.type = function() {
	return this.type;
}

// Sets road points for each of two roads for each top hex corner
function setTipPts() {
	var jmp1;
	for (var i = 0; i < rows; i++) {
		var ptInit = tipArr[i];
		if (i >= midRow) {
			jmp1 = rowTiles[i] + 1;
		} else {
			jmp1 = rowTiles[i];
		}
		for (var j = 0; j < rowTiles[i]; j++) {
			var rdPt = new rdPoint(pointArr[ptInit + j], pointArr[ptInit + j + jmp1], "diagUp");
			var rdPt = new rdPoint(pointArr[ptInit + j], pointArr[ptInit + j + jmp1 + 1], "diagDown");
		}
	}
}

// Sets road points for every vertical road
function setVertPts() {
	for (var i = 0; i < rows; i++) {
		var ptInit = vertArr[i];
		var jmp = rowTiles[i] + 1;
		for (var j = 0; j < jmp; j++) {
			var rdPt = new rdPoint(pointArr[ptInit + j], pointArr[ptInit + j + jmp], "vert");
		}
	}
}

// Sets road points for every bottom left road
function setLeftPts() {
	var gap = rowTiles[midRow - 1] + 1;
	for (var i = 0; i < leftArr.length; i++) {
		var rdPt = new rdPoint(pointArr[leftArr[i]], pointArr[leftArr[i] + gap], "diagDown");
		gap--;
	}
}

// Sets road points for every bottom right road
function setRightPts() {
	var gap = rowTiles[midRow - 1];
	for (var i = 0; i < rightArr.length; i++) {
		var rdPt = new rdPoint(pointArr[rightArr[i]], pointArr[rightArr[i] + gap], "diagUp");
		gap--;
	}
}

// Sets road points for very bottom of board excluding far right and left
function setBtPts() {
	var gap = rowTiles[rowTiles.length - 1];
	for (var i = 0; i < btArr.length; i++) {
		var rdPt = new rdPoint(pointArr[btArr[i]], pointArr[btArr[i] + gap], "diagUp");
		var rdPt = new rdPoint(pointArr[btArr[i]], pointArr[btArr[i] + gap + 1], "diagDown");
	}
}

function addHTML() {
	for (var i = 0; i < tileArr.length; i++) {
		$( ".board" ).append( "<canvas class='tile' />" );
		$( ".board" ).append( "<canvas class='numTile' />" );
	}
	for (var i = 0; i < rdPtArr.length; i++) {
		$( ".board" ).append( "<canvas class='road' />" );
	}
	for (var i = 0; i < pointArr.length; i++) {
		$( ".board" ).append( "<canvas class='settle' />" );
		//$( ".board" ).append( "<canvas class='city' />" );
	}
}

function initTiles() {
	var tileCnt = 0;
	$('.tile').each(function() {
		tPoint = tileArr[tileCnt];
		$(this).css({left: tPoint.x - dx, top: tPoint.y, position:'absolute'});
		//$(this).css({border: '1px solid black'});
		if (this.getContext) {
			var tileCanv = this.getContext('2d');
			tileCanv.canvas.width = tWidth + buffer;
			tileCanv.canvas.height = sideLen * 2 + buffer;
			var hexTile = new createHex(tileCanv, tileCnt);
			if (hexTile.isDesert == true) {
				desertID = hexTile.id;
			}
		}
		tileCnt++;
	});
}

function initNums() {
	var numCnt = 0;
	var tileNum;
	var desNum = getTMap(desertID);
	var numScale = .75;
	var numRad = sideLen * numScale / 2;
	$('.numTile').each(function() {
		tPoint = tileArr[numCnt];
		$(this).css({left: tPoint.x - numRad + buffer / 2, top: tPoint.y + (sideLen * 2 + buffer) / 2 - numRad, position:'absolute'});
		if (this.getContext) {
			var numCanv = this.getContext('2d');
			numCanv.canvas.width = numRad * 2;
			numCanv.canvas.height = numRad * 2;
			if (numCnt != desertID) {				
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
		}
		numCnt++;
	});
}

function initRoads() {
	var x1, y1, x2, y2, rType, mx, my, lx, ly, rLeft, rTop, width, height;
	var stroke = buffer * 2;
	var rdCnt = 0;
	var isClicked = false;
	$('.road').each(function() {
		rdPt = rdPtArr[rdCnt];
		x1 = rdPt.p1.x;
		y1 = rdPt.p1.y;
		x2 = rdPt.p2.x;
		y2 = rdPt.p2.y;
		rType = rdPt.type;
		rLeft = Math.min(x1, x2) - buffer / 4;
		rTop = Math.min(y1, y2) - buffer * .75;
		width = Math.max(Math.abs(x1 - x2), stroke) + stroke;
		height = Math.abs(y1 - y2) + stroke;
		if (rType == "diagUp") {
			mx = width - buffer;
			my = buffer;
			lx = buffer;
			ly = height - buffer;
		} else if (rType == "diagDown") {
			mx = buffer;
			my = buffer;
			lx = width - buffer;
			ly = height - buffer;
		} else if (rType == "vert") {
			mx = (width - stroke) / 2;
			my = buffer;
			lx = mx;
			ly = height - buffer;
		}
		$(this).css({left: rLeft, top: rTop, position:'absolute'});
		this.data = {
			x1: mx,
			y1: my,
			x2: lx,
			y2: ly,
			isSet: false
		}
		if (this.getContext) {
			var roadCanv = this.getContext('2d');
			resetRoad(roadCanv, width, height, mx, my, lx, ly);
			this.addEventListener('click', function(event) {
				if (color != null) { 
					roadCanv.lineWidth = stroke;
					roadCanv.strokeStyle = color;
					roadCanv.stroke();
					color = null;
					this.isSet = true;
				} else {
					resetRoad(roadCanv, this.width, this.height, this.data.x1, this.data.y1, this.data.x2, this.data.y2);
					this.isSet = false;
				}
				isClicked = true;
				sColor = null;
			}, false);
			this.addEventListener('mouseover', function(event) {
				if (!this.isSet && color != null) { 
					roadCanv.lineWidth = stroke;
					roadCanv.strokeStyle = color;
					roadCanv.stroke();
				}
			}, false);
			this.addEventListener('mouseout', function(event) {
				if (!this.isSet && !isClicked) {
					resetRoad(roadCanv, this.width, this.height, this.data.x1, this.data.y1, this.data.x2, this.data.y2);
				}
				isClicked = false;
			}, false);
		}
		rdCnt++;
	});
}

function resetRoad(c, width, height, mx, my, lx, ly) {
	c.canvas.width = width;
	c.canvas.height = height;
	c.beginPath();
	c.moveTo(mx, my);
	c.lineTo(lx, ly);
	c.strokeStyle = "white";
	c.lineWidth = 0;
}

function initSettlements() {
	var settleCnt = 0;
	var sWidth = 45;
	var sHeight = 45;
	var isClicked = false;
	$('.settle').each(function() {
		tPoint = pointArr[settleCnt];
		$(this).css({left: tPoint.x - sWidth / 2 + buffer / 2, top: tPoint.y - sHeight / 2 + buffer / 2, position:'absolute'});
		this.data = {
			isSet: false
		}
		if (this.getContext) {
			var settCanv = this.getContext('2d');
			settCanv.canvas.width = sWidth;
			settCanv.canvas.height = sHeight;
			this.addEventListener('click', function(event) {
				if (sColor != null) { 
					settCanv.fillStyle = sColor;
					createSett(settCanv, sWidth, sHeight);
					sColor = null;
					this.isSet = true;
				} else {
					settCanv.canvas.width = sWidth;
					this.isSet = false;
				}
				isClicked = true;
				color = null;
			}, false);
			this.addEventListener('mouseover', function(event) {
				if (!this.isSet && sColor != null) { 
					settCanv.fillStyle = sColor;
					createSett(settCanv, sWidth, sHeight);
					//settCanv.fillRect(0, 0, sWidth, sHeight);
				}
			}, false);
			this.addEventListener('mouseout', function(event) {
				if (!this.isSet && !isClicked) {
					settCanv.canvas.width = sWidth;
				}
				isClicked = false;
			}, false);
		}
		settleCnt++;
	});
}

function createSett(c, width, height) {
	//c.fillRect(0, 0, width, height);
	var faceHt = height * .65;
	c.beginPath();
	c.moveTo(0, height);
	c.lineTo(width, height);
	c.lineTo(width, height - faceHt);
	c.lineTo(width / 2, 0);
	c.lineTo(0, height - faceHt);
	c.closePath();
	c.fill();
	/*var side = width / 3 * 1.7;
	var xOffset = width - side;
	var yOffset = height * .2;
	c.beginPath();
	c.moveTo(width, height);
	c.lineTo(width - side, height);
	c.lineTo(0, height - yOffset);
	c.lineTo(0, height - yOffset - side);
	//c.lineTo(xOffset, height - side);
	c.lineTo(width - side / 2 - xOffset, 0);
	c.lineTo(width - side / 2, yOffset);
	c.lineTo(width, height - side);
	c.closePath();
	c.fill();

	c.strokeStyle = "#b30000";
	c.beginPath();
	c.moveTo(width, height);
	c.lineTo(width - side, height);
	c.stroke();	
	c.moveTo(width - side, height);
	c.lineTo(0, height - yOffset);
	c.stroke();	
	c.moveTo(0, height - yOffset);
	c.lineTo(0, height - yOffset - side);
	c.stroke();	
	c.moveTo(0, height - yOffset - side);
	c.lineTo(xOffset, height - side);
	c.stroke();	
	c.moveTo(width - side, height);
	c.lineTo(xOffset, height - side);
	c.stroke();	
	c.moveTo(width, height - side);
	c.lineTo(xOffset, height - side);
	c.stroke();
	c.moveTo(width - side / 2, yOffset);
	c.lineTo(xOffset, height - side);
	c.stroke();	
	c.moveTo(width - side / 2, yOffset);
	c.lineTo(width - side / 2 - xOffset, 0);
	c.stroke();
	c.moveTo(0, height - yOffset - side);
	c.lineTo(width - side / 2 - xOffset, 0);
	c.stroke();
	c.moveTo(width, height);
	c.lineTo(width, height - side);
	c.stroke();
	c.moveTo(width - side / 2, yOffset);
	c.lineTo(width, height - side);
	c.stroke();	*/
}

function createHex(c, id) {
	this.id = id;
	this.isDesert = false;
	var x = dx + buffer / 2;
	var y = buffer / 2;

	var fill;
	while (true) {
		fill = getFill();
		if (fill) {break;}
	}
	if (fill == desColor) {
		this.isDesert = true;
	}

	c.fillStyle = fill;
	c.beginPath();
	c.moveTo(x, y);
	c.lineTo(x + dx, y + dy);
	c.lineTo(x + dx, y + dy + sideLen);
	c.lineTo(x, y + 2 * sideLen);
	c.lineTo(x - dx, y + dy + sideLen);
	c.lineTo(x - dx, y + dy);
	c.closePath();
	c.fill();
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

var rows = 5;
var midRow = getMidTile(rows);
var rowTiles = [3, 4, 5, 4, 3];
var leftPad = 10;
var topPad = 30;
var sideLen = 92;
var buffer = 6;
var dx = Math.sqrt(.75 * sideLen * sideLen);
var dy = sideLen / 2;
var tWidth = 2 * dx;
var yStep = 1.5 * sideLen + buffer;
var pointArr = [];
var tileArr = [];
var tipArr = [];
var vertArr = [];
var leftArr = [];
var rightArr = [];
var btArr = [];
var rdPtArr = [];
var desertID;
var color = null;
var sColor = null;

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