$(document).ready(function() {

	//var width = $(window).width() * .99;
	//var height = $(window).height() * .95;


	var dist = 120;
	var width = 2 * getDx(dist);
	var height = 2 * dist;
	var buffer = 2;
	var ix = width / 2;
	var iy = 0;
	var idx = getDx(dist);
	var idy = dist / 2;
	var rows = 5;
	var midRow = 3;
	var iCols = 3;

	$( ".board" ).append( "<canvas class='tile' />" );
	$( ".board" ).append( "<canvas class='road' />" );
	$( ".board" ).append( "<canvas class='settlement' />" );

	$('.tile').each(function() {
		if (this.getContext) {
			var c2 = this.getContext('2d');
			c2.canvas.width = width;
			c2.canvas.height = height;
			var myHex = new createHex(ix, iy, dist, '#f00', c2);
		}
	});

	$('.road').each(function() {
		if (this.getContext) {
			var line = this.getContext('2d');
			line.canvas.width = width / 2;
			line.canvas.height = idy;
			line.beginPath();
			line.moveTo(ix, iy);
			line.lineTo(ix - idx, iy + idy);
			line.strokeStyle = "#0000FF";
			line.lineWidth = 4;
			line.stroke();
		}
	});

	$('.settlement').each(function() {
		if (this.getContext) {
			var settle = this.getContext('2d');
			settle.canvas.width = 20;
			settle.canvas.height = 20;
			settle.fillStyle = "#0000FF";
			settle.fillRect(0, 0, 20, 20);
		}
	});
});



function createHex(ix, iy, dist, fill, c2) {
	this.ix = ix;
	this.iy = iy;
	var x = this.ix;
	var y = this.iy;
	this.dist = dist;
	var dist = this.dist;
	var dx = getDx(dist);	
	var dy = dist / 2;
	this.fill = fill;

	c2.fillStyle = this.fill;
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

function getDx(dist) {
	return Math.sqrt(.75 * dist * dist);
}

function dxBtHex(dist, buffer) {
	return 2 * getDx(dist) + buffer;
}