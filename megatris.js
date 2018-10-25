//Variabes
var buffer;
var context;
var canvas;
var context_canvas;

var disableInput = false;

//For Keyboard Input
var inputMode = String();
var spaceBar = false;
var keyUp = false;
var keyDown = false;
var keyLeft = false;
var keyRight = false;
var keyESC = false;
var parentKey = 0;
var childKey = 0;

//General
var collision = false;
var segmentSize = 10;
var padding = 1;
var gameH = 0;
var gameW = 0;
var offsetX = 0;
var offsetY = 0;

var counter = 0;
var x = 0;
var y = 0;
var i = 0;
var step = 0;

var left = 0;
var right = 0;

var mode = "drop";
var lineX = new Array(4);
var lineY = new Array(4);
var lineLen = new Array(4);
var lineCount = 0;
var longestLine = 0;

var scoreString = "";

var currentSpeed = 10;
var dropSpeed = 100;		// 1 to 100
var maxSpeed = 1;
var quickDropSpeed = 1;
var animateSpeed = 10;

//Players
var playerX = 0;
var playerY = 0;
var playerPiece = 1;
var playerOrientation = 0;
var playerLines = 0;
var playerScore = 0;
var playerDeaths = 0;

//Create Pieces
var a, b, c, d = 0;
var pieceString = "0100010001000100000011110000000001000100010001000000111100000000110011000000000011001100000000001100110000000000110011000000000001001110000000000100011001000000000011100100000001001100010000001100011000000000001001100100000011000110000000000010011001000000011011000000000001000110001000000110110000000000010001100010000001000100011000000000011101000000000001100010001000000010111000000010001001100000000001000111000000000110010001000000111000100000";
var piece = new Array(6);
step = 0;
for (a=0; a<=6; a++) {
	piece[a] = new Array(3);
	for (b=0; b<=3; b++) {
		piece[a][b] = new Array(3);
		for (c=0; c<=3; c++) {
			piece[a][b][c] = new Array(3);
			for (d=0; d<=3; d++) {
				piece[a][b][c][d] = pieceString.substr(step, 1);
				step++;
			}
		}
	}
}

//Game Area
var gameArea = new Array(124);
for (x=0; x<=124; x++) {
	gameArea[x] = new Array(51);
	for (y=0; y<=51; y++) {
		gameArea[x][y] = 0;
	}
}

//---------------------------------------------------------------- Functions

//---------------------------------------------------------------- Catch Keyboard Input
function inputDown(e) {
	var keynum;
	keyUp = false;
	keyDown = false;
	keyLeft = false;
	keyRight = false;
	if(window.event) { // IE8 and earlier
		keynum = e.keyCode;
	} else if(e.which) {// IE9/Firefox/Chrome/Opera/Safari
		keynum = e.which;
	}
	
	if (keynum == 32) { 
		spaceBar = true;
		parentKey = 0;
		childKey = 0;
	} else if (keynum == 27) { 
		if (disableInput == false) {
			keyESC = true; 
			parentKey = 0;
			childKey = 0;
		}
	} else {
		if (disableInput == false) {
			if (parentKey == 0) { parentKey = keynum; } else { childKey = keynum; }
			if (childKey == parentKey) { childKey = 0; }
		}
	}
	//alert (keynum);

	if (parentKey !== 0) {
		if (childKey !== 0) {
			if (childKey == 38) { keyUp = true; }
			if (childKey == 40) { keyDown = true; }
			if (childKey == 37) { keyLeft = true; }
			if (childKey == 39) { keyRight = true; }
		} else {
			if (parentKey !== 0) {
				if (parentKey == 38) { keyUp = true; }
				if (parentKey == 40) { keyDown = true; }
				if (parentKey == 37) { keyLeft = true; }
				if (parentKey == 39) { keyRight = true; }
			}
		}
	}
}
function inputUp(e) {
	var keynum;
	keyUp = false;
	keyDown = false;
	keyLeft = false;
	keyRight = false;
	if(window.event) { // IE8 and earlier
		keynum = e.keyCode;
	} else if(e.which) {// IE9/Firefox/Chrome/Opera/Safari
		keynum = e.which;
	}
	
	if (keynum == 32) { 
		spaceBar = false;
		parentKey = 0;
		childKey = 0;
	} else if (keynum == 27) { 
		keyESC = false; 
		parentKey = 0;
		childKey = 0;
	} else {
		if (parentKey == keynum) { parentKey = 0; }
		if (childKey == keynum) { childKey = 0; }
		if (parentKey == 0 && childKey !== 0) { parentKey = childKey; }
		//alert ("child key does not equal zero");
	}
	//alert (keynum);
	if (parentKey !== 0) {
		if (childKey !== 0) {
			if (childKey == 38) { keyUp = true; }
			if (childKey == 40) { keyDown = true; }
			if (childKey == 37) { keyLeft = true; }
			if (childKey == 39) { keyRight = true; }
		} else {
			if (parentKey !== 0) {
				if (parentKey == 38) { keyUp = true; }
				if (parentKey == 40) { keyDown = true; }
				if (parentKey == 37) { keyLeft = true; }
				if (parentKey == 39) { keyRight = true; }
			}
		}
	}

}

//---------------------------------------------------------------- Collision Detection
function collisionDetection(checkPiece, checkOrientation, checkX, checkY) {
	//alert(x+" "+y);
	collision = false;
	for (y=0; y<=3; y++) {
		for (x=0; x<=3; x++) {
			if (piece[checkPiece][checkOrientation][x][y] == 1) {
				//check for edge collision
				if (checkX+x <= -1) {
					collision = true;
					break;
				}
				if (checkX+x >= gameW+1) {
					collision = true;
					break;
				}
				//check for game area collision
				if (gameArea[checkX+x][checkY+y] == 1) {
					collision = true;
					break;
				}
			}
		}
		if (collision == true) { break; }
	}
	
	if (collision == true) { return true; } else { return false; }
}

//---------------------------------------------------------------- Cookies
function setCookie(c_name,value,exdays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name) {
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1)
	  {
	  c_start = c_value.indexOf(c_name + "=");
	  }
	if (c_start == -1)
	  {
	  c_value = null;
	  }
	else
	  {
	  c_start = c_value.indexOf("=", c_start) + 1;
	  var c_end = c_value.indexOf(";", c_start);
	  if (c_end == -1)
	  {
	c_end = c_value.length;
	}
	c_value = unescape(c_value.substring(c_start,c_end));
	}
	return c_value;
}

function saveGameArea() {
	setCookie("gameArea", gameAreaString(), 365);
}

function loadGameArea() {
	if (getCookie("gameArea") != null) {
		
		var areaString = getCookie("gameArea");
		var startNumber = areaString.substring(0,1);
		var tempString = "";
		var tempNumber = 0;
		var tempStep = 0;
		var tempPostition = 0;
		var ii = 0;
		var tempX = 0
		var tempY = 0;
		
		for (i = 2; i <= areaString.length; i++) {
			if (areaString.substring(i,i+1) != ",") { 
				tempString = tempString + areaString.substring(i,i+1);
				tempNumber = parseInt(tempString);
			} else {
				//alert(tempNumber+" x "+startNumber);
				for (ii = 1; ii <= tempNumber; ii++) {
					gameArea[tempX][tempY] = parseInt(startNumber);		
					tempX++;
					if (tempX >= gameW + 1) { 
						tempY++;
						tempX = 0;
						if (tempY >= gameH) { break; }
					}
				}
				//flip startnumber
				if (startNumber == 0) { startNumber = 1; } else { startNumber = 0; }
				tempNumber = 0;
				tempString = "";
			}
		}	
	}
}

//---------------------------------------------------------------- Return Game Area String
function gameAreaString() {
	var areaString = "";
	for (y = 0; y <= gameH; y++) {
		for (x = 0; x <= gameW; x++) {
			areaString = areaString + gameArea[x][y];
		}
	}
	
	//alert(areaString);
	
	//compress areaString
	var currentNumber = areaString.substring(0,1);
	var seriesCount = 1;
	var compressedString = currentNumber;
	
	for (i = 1; i <= areaString.length; i++) {
		if (areaString.substring(i,i+1) == currentNumber) {
			seriesCount++;
		} else {
			compressedString = compressedString + "," + seriesCount;
			seriesCount = 1;
			currentNumber = areaString.substring(i,i+1);
		}
	}
		
	return compressedString;
}

//---------------------------------------------------------------- Game Init
function init() {
      
	//Define Game Area
	gameH = 43;
	gameW = 120;
	
	rescaleWindow();
	
	// draw lower boundary line
	for (x = 0; x <= gameW; x++) {
		gameArea[x][43] = 1;	
	}

	playerLines = getCookie("lines");
	if (playerLines == null) { playerLines = 0; }

	playerX = parseInt(getCookie("playerX"));
	//alert(playerX);
	if (isNaN(playerX) == true) { playerX = 56; }
	if (playerX <= 0) { playerX = 0; }
	
	//saveGameArea();
	loadGameArea();
	saveGameArea();

    //Testing 
	setTimeout("gameLoop()",10);
}

//---------------------------------------------------------------- Reset Game
function resetGame() {
	playerX = 56;
	playerY = 0;
	playerPiece = Math.floor(Math.random() * 7);
	playerLines = 0;
	dropSpeed = 100;
	
	for (y = 0; y <= gameH; y++) {
		for (x = 0; x <= gameW; x++) {
			if (y == 43) {
				gameArea[x][y] = 1;
			} else {
				gameArea[x][y] = 0;
			}
		}
	}
	
	saveGameArea();
	setCookie("playerX", playerX, 365);
	setCookie("lines", playerLines, 365);
}

//---------------------------------------------------------------- Rescale Game
function rescaleWindow() {
	//	get window size
	if (document.body && document.body.offsetWidth) {
	 winW = document.body.offsetWidth * 0.9;
	 winH = document.body.offsetHeight * 0.9;
	}
	if (document.compatMode=='CSS1Compat' &&
		document.documentElement &&
		document.documentElement.offsetWidth ) {
	 winW = document.documentElement.offsetWidth * 0.9;
	 winH = document.documentElement.offsetHeight * 0.9;
	}
	if (window.innerWidth && window.innerHeight) {
	 winW = window.innerWidth * 0.9;
	 winH = window.innerHeight * 0.9;
	}

	segmentSize = Math.floor((winW - gameW) / (gameW));
	
	offsetX = Math.floor((winW - (segmentSize * gameW)-gameW-segmentSize) / 2 );
	offsetY = Math.floor((winH - (segmentSize * (gameH+(segmentSize / 2)))-gameH-segmentSize) / 2 );
}

//---------------------------------------------------------------- Drop New Piece
function dropNewPiece() {
	//collision check the left and right sides
	playerY = 0;
	playerPiece = Math.floor(Math.random() * 7);

	if (playerX <= 0) { playerX = 0; }

	if (playerX >= gameW - 4) { 
		while (collisionDetection(playerPiece, playerOrientation, playerX, playerY) == true) {
			playerX--;
			if (playerX <= gameW-4) { break; }
		}
	}
	
	saveGameArea();
	setCookie("playerX", playerX, 365);
}

//---------------------------------------------------------------- Game Loop
function gameLoop() {
	
	currentSpeed = dropSpeed;
	
	counter++;
	if (counter >= 100) { counter = 0; }
	
	//Input
	if (keyUp == true) {
		keyUp = false;
		playerOrientation--;
		if (playerOrientation <= -1) { playerOrientation = 3; }
		if (collisionDetection(playerPiece, playerOrientation, playerX, playerY) == true) {
			playerOrientation = playerOrientation + 1;
			if (playerOrientation >= 4) { playerOrientation = 0; }
		}
	}
	if (keyDown == true) {
		keyDown = false;
		currentSpeed = quickDropSpeed;
	}
	if (keyLeft == true) {
		keyLeft = false;
		if (collisionDetection(playerPiece, playerOrientation, playerX - 1, playerY) == false) {
			playerX = playerX - 1;
			if (playerX <= -1) { playerX = -1; }
		}
	}
	if (keyRight == true) {
		keyRight = false;
		if (collisionDetection(playerPiece, playerOrientation, playerX + 1, playerY) == false) {
			playerX++;
			if (playerX >= 119) { playerX = 119; }
		}
	}
		
	if (spaceBar == true) {
		spaceBar = false;
		//playerPiece++;
		//if (playerPiece >=6) { playerPiece = 0; }
	}
		
	
	//Drop Mode
	if (mode == "drop") {
		//Drop Piece
		if (collisionDetection(playerPiece, playerOrientation, playerX, playerY + 1) == false) {
			//alert("drop");
			playerY++;	
		} else {
			//alert("bottom");
			//Draw Piece to Game Area
			for (y=0; y<=3; y++) {
				for (x=0; x<=3; x++) {
					if (piece[playerPiece][playerOrientation][x][y] == 1) {
						gameArea[playerX+x][playerY+y] = 1;
					}
				}
			}
			//Check for Lines Around the Piece
			lineCount = 0; 
			//alert("line check");
			for (y = 0; y <= 3; y++) {
				for (x = 0; x <= 3; x++) {
					if (piece[playerPiece][playerOrientation][x][y] == 1) {
						left = 0;
						right = 0;
						while (gameArea[playerX+x-left][playerY+y] == 1) { 
							if (playerX + x - left <= 0) { break; }
							left++;
						}
						while (gameArea[playerX+x+right][playerY+y] == 1) { right++; }
						if (left + right - 1 >= 10) { 
							lineCount++;
							lineX[lineCount] = playerX + x - left;
							lineY[lineCount] = playerY + y;
							lineLen[lineCount] = left + right - 1;
							//alert("lineLen = "+lineLen[lineCount]);
							mode = "remove line";
							longestLine = 0;
							step = 0;
							playerLines++;
							setCookie("lines",playerLines,365);
							dropSpeed = 100 - (Math.floor(playerLines / 10) * 10);
							if (dropSpeed <= 10) { dropSpeed = 10; }
							//playerScore = playerScore + lineLen[lineCount];
							break;
						}
					}
				}
			}
			//alert("finished");
			//Check if anything is out of bounds
			for (x = 0; x <= gameW; x++) {
				if (gameArea[x][3] == 1) {
					//empty boundry lines
					for (i = 0; i <= gameW; i++) {
						gameArea[i][0] = 0;
						gameArea[i][1] = 0;
						gameArea[i][2] = 0;
						gameArea[i][3] = 0;
					}
					//playerDeaths++;
					playerX = Math.floor(Math.random() * ((gameW-4) - 0 + 1)) + 0;
					setCookie("playerX", playerX, 365);
				}
			}
			//Drop New Piece
			if (mode == "drop") {
				dropNewPiece();
			}
		}
	}
	
	//Mode = Remove Lines and Drop Stack
	if (mode == "remove line") {
		currentSpeed = animateSpeed;
		for (i = 1; i <= lineCount; i++) {
			//check if segment about to be removed is within the area of the line
			//alert(lineX[i] + ((lineLen[i] / 2) - step));
			if (lineX[i] + (Math.floor(lineLen[i] / 2) - step) >= lineX[i]) { gameArea[lineX[i] + (Math.floor(lineLen[i] / 2) - step)][lineY[i]] = 0; }
			if (lineX[i] + (Math.floor(lineLen[i] / 2) + step) <= lineX[i] + lineLen[i]) { gameArea[lineX[i] + (Math.floor(lineLen[i] / 2) + step)][lineY[i]] = 0; }
			if (lineLen[i] >= longestLine) { longestLine = lineLen[i]; }
		}
		step++;
		if (step >= Math.floor(longestLine/2)+4) { 
			for (i = 1; i <= lineCount; i++) {
				//Drop everything above the current line position into it
				for (x = 0; x <= lineLen[i]; x++) {
					for (y = lineY[i]; y >= 1; y--) {
						gameArea[lineX[i]+x][y] = gameArea[lineX[i]+x][y-1];
					}
				}
				gameArea[lineX[i]+x][0] = 0;
			}
			mode = "drop"; 
			dropNewPiece();
		}
	}

	
	//Draw Scene
	buffer = document.getElementById("buffer");
    buffer.width = winW;
    buffer.height = winH;
	context = buffer.getContext("2d");

	context.fillStyle = '#FFFFFF';
	context.fillRect (0, 0, winW, winH);

	for (y=4; y<=gameH; y++) {
		for (x=0; x<=gameW; x++) {
			if (gameArea[x][y] == 0) {
				context.fillStyle = '#fff';
				//context.fillRect (offsetX + x*(segmentSize+padding), offsetY + y*(segmentSize+padding), segmentSize, segmentSize);
			} else {
				context.fillStyle = '#ccc';
				context.fillRect (offsetX + x*(segmentSize+padding), offsetY + y*(segmentSize+padding), segmentSize, segmentSize);
			}
		}
	}

	//Draw a piece
	if (mode == "drop") {
		for (y=0; y<=3; y++) {
			for (x=0; x<=3; x++) {
				if (piece[playerPiece][playerOrientation][x][y] == 1) {
					context.fillStyle = '#ccc';
					context.fillRect (offsetX + (playerX+x)*(segmentSize+padding), offsetY + (playerY+y)*(segmentSize+padding), segmentSize, segmentSize);
				}
			}
		}
	}

	//Debug
	context.fillStyle = '#000000';
	context.font = "12px Sans-Serif";
//	context.fillText("Counter: "+counter, 20, 20); 
//	context.fillText("Up: "+keyUp, 20, 32); 
//	context.fillText("Down: "+keyDown, 20, 46); 
//	context.fillText("Left: "+keyLeft, 20, 60); 
//	context.fillText("Right: "+keyRight, 20, 74); 
//	context.fillText("Window Height: "+winH, 20, 90); 
//	context.fillText("Window Width: "+winW, 20, 104); 
//	context.fillText("Game Height: "+gameH, 20, 120); 
//	context.fillText("Game Width: "+gameW, 20, 132); 
//	context.fillText("Player X: "+playerX, 20, 150); 
//	context.fillText("Player Y: "+playerY, 20, 162); 
//	context.fillText("Piece: "+playerPiece, 20, 174); 
//	context.fillText("Orientation: "+playerOrientation, 20, 186); 
//	context.fillText("Drop Speed: "+dropSpeed, 20, 200); 
//	context.fillText("String: "+dropSpeed, 20, 200); 

	context.fillStyle = '#CCCCCC';
	context.font = (segmentSize * 2)+"px Sans-Serif";
	scoreString = "Lines: "+playerLines;
	
	context.fillText("Lines: "+playerLines, offsetX, offsetY + (segmentSize + padding) * 46); 
	//context.fillText("Reset", winW - offsetX - (segmentSize + padding) * 5, offsetY + (segmentSize + padding) * 46); 
	
	//Copy the buffer to the canvas
	canvas = document.getElementById("canvas");
    canvas.width = winW;
    canvas.height = winH;

	context_canvas = canvas.getContext('2d');
	context_canvas.drawImage(buffer, 0, 0);
	//canvas.drawImage(buffer, 0, 0);

	setTimeout("gameLoop()", currentSpeed);

}

