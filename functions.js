"use strict"; // Neater code

/* Background functions and mini library for the canvas */

// Convert a number to the hex equivalent
var toHex = function(num) {
	let hexString = num.toString(16);
	if (hexString.length % 2) {
		hexString = '0' + hexString;
	}
	return hexString;
};

var rgb = function(r, g, b) {
	return "#" + toHex(r) + toHex(g) + toHex(b);
};

// Lerp
 Math.lerp = function(v0, v1, t) {
    return v0 * (1 - t) + v1 * t
};

// Create Element
var create = function(element, data, appendTo)
{
	let ret = document.createElement(element);
	for (let prop in data)
	{
		ret[prop] = data[prop];
	}
	if (appendTo) {
		appendTo.appendChild(ret);
	}
	return ret
};

var border = function(x1, y1, x2, y2, thickness, c1, c2) {
	// Upper
	ctx.beginPath();
	ctx.moveTo(x1, y1); // Start
	ctx.lineTo(x2, y1); // Start to Right
	ctx.lineTo(x2 - thickness, y1 + thickness); // Right to bottom
	ctx.lineTo(x1 + thickness, y1 + thickness); // Inner corner
	ctx.lineTo(x1 + thickness, y2 - thickness);
	ctx.lineTo(x1, y2);
	ctx.lineTo(x1, y1);
	ctx.fillStyle = c1;
	ctx.fill();
	
	// Lower
	ctx.beginPath();
	ctx.moveTo(x2, y2); // Start
	ctx.lineTo(x2, y1); // Start to Top
	ctx.lineTo(x2 - thickness, y1 + thickness); // Top to left
	ctx.lineTo(x2 - thickness, y2 - thickness); // Inner corner
	ctx.lineTo(x1 + thickness, y2 - thickness);
	ctx.lineTo(x1, y2);
	ctx.lineTo(x2, y2);
	ctx.fillStyle = c2;
	ctx.fill();
}

// Bordered rectangle
ctx.borderedRect = function(x, y, width, height, thickness, c1, c2, c3) {
	ctx.beginPath();
	ctx.fillStyle = c2;
	ctx.fillRect(x, y, width, height);
	border(x, y, x + width, y + height, thickness, c1, c3);
};

// Bordered image
ctx.borderedImage = function(image, x, y, width, height, thickness, c1, c2) {
	ctx.beginPath();
	ctx.drawImage(image, x, y, width, height);
	border(x, y, x + width, y + height, thickness, c1, c2);
};

// Align text on x plane
ctx.alignedText = function(text, y) {
	ctx.beginPath();
	ctx.textAlign = "center";
	ctx.verticalAlign = "middle"; // Set by default I believe but whatever
	ctx.fillStyle = "black";
	ctx.font = "24px Times New Roman";
	ctx.fillText(text, canvas.width / 2, y);
};

// Align text on x and y planes
ctx.centeredText = function(text, fontSize, x1, y1, x2, y2, color) {
	ctx.beginPath();
	ctx.textAlign = "center";
	ctx.verticalAlign = "middle"; // Set by default I believe but whatever
	ctx.fillStyle = color;
	ctx.font = fontSize.toString() + "px Times New Roman";
	ctx.fillText(text, (x1 + x2) / 2, (y1 + y2) / 2)
};