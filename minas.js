var mX, mY, clickedX, clickedY, nuevoJuegoTest;

var rClickedX, rClickedY, rClickedBs = [];

var ctx, caja, num, cero, bandera; 

var tab = {
	fil: 10,
	col: 10,
	alto: 30,
	ancho: 30
};
 
var bombas = [];

var clickedBs = [];

var tiempo = 0;

var nuevoJuegoTest = 0;

window.onload = function () 
{
	reloj ();
	inicio ();
}

window.onclick = function(e) 
{
	mX = e.pageX;
	mY = e.pageY;
	
	if (Math.floor(mX/tab.ancho) < tab.fil && Math.floor(mY/tab.alto) < tab.col) 
	{
		clickedX = Math.floor(mX/tab.ancho);
		clickedY = Math.floor(mY/tab.alto);
	}

	for (i in bombas) {
		if (clickedX == bombas[i][0] && clickedY == bombas[i][1]) {
			perder ();
		}
	}

	var clickedBombas = false;

	for (var i = 0; i < 10; i++) {
		if (clickedX == bombas[i][0] && clickedY == bombas[i][1]) {
			clickedBombas = true;
			perder ();
		}   
	}
	
	if (clickedBombas == false && mX < tab.fil*tab.ancho && mY < tab.col*tab.alto) {
		
		var totalClicked = rClickedBs.length + clickedBs.length;
		
		if (totalClicked == 100) {
		   ganador ();
		}
	    clickPasa (clickedX, clickedY);
	}
}

window.oncontextmenu = function (e)
{
	e.preventDefault ();

	mX = e.pageX;
	mY = e.pageY;
	
	if (Math.floor(mX/tab.ancho) < tab.fil && Math.floor(mY/tab.alto) < tab.col) 
	{
		rClickedX = Math.floor(mX/tab.ancho);
		rClickedY = Math.floor(mY/tab.alto);
	}

	var inRClickedBs = [false, 0];

	for (i in rClickedBs) {
		if (rClickedBs[i][0] == rClickedX && rClickedBs[i][1] == rClickedY) {
			inRClickedBs = [true, i];
		}
	}

	if (inRClickedBs[0] == false) {
		if (rClickedBs.length < 10) {
			
			var n = rClickedBs.length;
			rClickedBs[n] = [];
		    rClickedBs[n][0] = rClickedX;
		    rClickedBs[n][1] = rClickedY;

		    var totalClicked = rClickedBs.length + clickedBs.length;
		    console.log(totalClicked);
		    if (totalClicked == 100) {
		    	ganador ();
		    }
		}
	} else{
		rClickedBs.splice(inRClickedBs[1], 1);
	}

	dibujar ();
}

function inicio () 
{
    var canvas = document.getElementById("campo");
    canvas.width = 400;
    canvas.height = 400;
    ctx = canvas.getContext("2d");

    caja = new Image();
    caja.src = "box2.png";

    num = new Image();
    num.src = "num2.png";

    cero = new Image();
    cero.src = "zero.png";

    bandera = new Image();
    bandera.src = "flag.png";

    for (var i = 0; i < 10; i++) 
    {
    	bombas[i] = [
    	  Math.floor(Math.random()*10),
    	  Math.floor(Math.random()*10)
    	]
    	console.log(bombas[i]);
    }

    dibujar ();
}

function reloj () 
{
	setTimeout(function () {
		var relojDiv = document.getElementById("reloj");
		tiempo++;
		relojDiv.innerHTML = tiempo + "s";
		reloj ();
	}, 1000)
}

function dibujar () 
{
	ctx.clearRect(0, 0, 400, 400);

	for (var i = 0; i < tab.fil; i++) {
		for (var n = 0; n < tab.col; n++) {
			var x = n * tab.ancho;
			var y = i * tab.alto;

			var beenClicked = [0, false];

			if (clickedBs.length > 0) {
				for (var k = 0; k < clickedBs.length; k++) {
				   if (clickedBs[k][0] == n && clickedBs[k][1] == i) {
					  beenClicked = [k, true];
				   }  
			    }
			}

			if (beenClicked[1] == true) {
				if (clickedBs[(beenClicked[0])] [2] > 0) {
					ctx.drawImage(num, x, y);
				} else{
					ctx.drawImage(cero, x, y);
				}
			} else{
				var rBeenClicked = [0, false];
				if (rClickedBs.length > 0) {
					for (var k = 0; k < rClickedBs.length; k++) {
						if (rClickedBs[k][0] == n && rClickedBs[k][1] == i) {
							rBeenClicked = [k, true];
						}
					}
				}
				if (rBeenClicked[1] == true) {
					ctx.drawImage(bandera, x, y);
				} else{
					ctx.drawImage(caja, x, y);
				}
			}
		}
	}

	for (i in clickedBs) {
		if (clickedBs[i][2] > 0) {
			ctx.font = "20px arial";
			ctx.fillText(clickedBs[i][2], clickedBs[i][0]*tab.ancho + 9, clickedBs[i][1]*tab.alto + 21);
		}
	}
}

function clickPasa (x, y)
{
	var verificarCajas = [
	    [-1, -1],
	    [0, -1],
	    [1, -1],
	    [1, 0],
	    [1, 1],
	    [0, 1],
	    [-1, 1],
	    [-1, 0]
	];

	var numDeBombasAlrededores = 0;

	for (i in verificarCajas) {
		for (var n = 0; n < 10; n++) {
			if(comprobarBombas(n, x + verificarCajas[i][0], y + verificarCajas[i][1]) == true) {
				numDeBombasAlrededores++;
			}
		}
	}

	for (k in rClickedBs) {
		if (rClickedBs[k][0] == x && rClickedBs[k][1] == y) {
			rClickedBs.splice(k, 1);
		}
	}

	var clicked = false;

	for (k in clickedBs) {
		if (clickedBs[k][0] == x && clickedBs[k][1] == y) {
			clicked = true;
		}
	}

	if (clicked == false) {
		clickedBs[(clickedBs.length)] = [x, y, numDeBombasAlrededores];
	}

    if (numDeBombasAlrededores == 0) {
    	for (i in verificarCajas) {
    		if (x + verificarCajas[i][0] >= 0 && x + verificarCajas[i][0] <= 9 && y + verificarCajas[i][1] >= 0 && y + verificarCajas[i][1] <= 9) {
    			var xl = x + verificarCajas[i][0];
    			var yl = y + verificarCajas[i][1];

    			var alreadyClicked = false;
    			for (n in clickedBs) {
    				if (clickedBs[n][0] == xl && clickedBs[n][1] == yl) {
    					alreadyClicked = true;
    				}
    			}
    			if (alreadyClicked == false) {
    				clickPasa(xl, yl);
    			}
    		}
    	}
    }

    dibujar ();
}

function comprobarBombas (i, x, y) 
{
	if (bombas[i][0] == x && bombas[i][1] == y) {
		return true;
	}

	else {
		return false;
	}
}

function perder () 
{
	alert("Perdiste!");
	nuevoJuego ();
}

function ganador () 
{
	alert("Ganaste!");
}

function nuevoJuego ()
{
	bombas = [];
	clickedBs = [];
	tiempo = 0;
	inicio ();
}