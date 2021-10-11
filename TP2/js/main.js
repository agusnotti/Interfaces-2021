document.addEventListener("DOMContentLoaded", function () {
    let canvas = /** @type {HTMLCanvasElement} */ (
      document.getElementById("canvas")
    );
    let ctx = canvas.getContext("2d");
    /* let canvasWidth = canvas.width;
    let canvasHeigth = canvas.height; */
	let juego;
	let inputJugador1 = document.getElementById('jugador1');
	let inputJugador2 = document.getElementById('jugador2');
	let nombreJugador1 = document.getElementById('nombre-jugador1');
	let nombreJugador2 = document.getElementById('nombre-jugador2');
	let colorFichaJ1 = document.getElementById('color-ficha-j1');
	let colorFichaJ2 = document.getElementById('color-ficha-j2');
	
	let canvasContainer = document.getElementById('canvas-container');
	let homeContainer = document.getElementById('home');
	let btnIniciarJuego = document.getElementById('iniciar-juego');
	let btnReiniciarJuego = document.getElementById('reiniciar-juego');
	let btnCambiarModo = document.getElementById('cambiar-tablero');
	
	let imagenAmarillo = new Image();
	imagenAmarillo.src ='img/amarillo.png';
	let imagenAzul = new Image();
	imagenAzul.src ='img/azul.png';
	let imagenNaranja = new Image();
	imagenNaranja.src ='img/naranja.png';
	let imagenNegro = new Image();
	imagenNegro.src ='img/negro.png';
	let imagenRojo = new Image();
	imagenRojo.src ='img/rojo.png';
	let imagenVerde = new Image();
	imagenVerde.src ='img/verde.png';
	let imagenVioleta = new Image();
	imagenVioleta.src ='img/violeta.png';
	let imagenGris = new Image();
	imagenGris.src ='img/gris.png';



	btnIniciarJuego.addEventListener('click', () => {
		if(colorFichaJ1.value == colorFichaJ2.value) {
			document.getElementById('mensaje-color-igual').classList.remove('oculto');
		} else {
			document.getElementById('mensaje-color-igual').classList.add('oculto');

			canvasContainer.classList.remove('oculto');
			homeContainer.classList.add('oculto');
			nombreJugador1.innerHTML = inputJugador1.value;
			nombreJugador2.innerHTML = inputJugador2.value;

			iniciarJuego();
		}
		
	})

	btnReiniciarJuego.addEventListener('click', () => {
		canvasContainer.classList.remove('oculto');
		homeContainer.classList.add('oculto');
		nombreJugador1.innerHTML = inputJugador1.value;
		nombreJugador2.innerHTML = inputJugador2.value;

		document.getElementById('reiniciar-juego').classList.add('oculto');
		document.getElementById("cambiar-tablero").classList.add('oculto');
		document.getElementById('ganador-mensaje').classList.add('oculto');
		document.getElementById('empate-mensaje').classList.add('oculto');
		document.getElementById('timeout-mensaje').classList.add('oculto');

		iniciarJuego();
	})

	btnCambiarModo.addEventListener('click', () => {
		canvasContainer.classList.add('oculto');
		homeContainer.classList.remove('oculto');

		document.getElementById('reiniciar-juego').classList.add('oculto');
		document.getElementById("cambiar-tablero").classList.add('oculto');
		document.getElementById('ganador-mensaje').classList.add('oculto');
		document.getElementById('empate-mensaje').classList.add('oculto');
		document.getElementById('timeout-mensaje').classList.add('oculto');
	})

	function iniciarJuego(){
		let juegoElegido = document.getElementById('juego').value;
		let colorSeleccionadoJ1 = colorFichaJ1.value;
		let colorSeleccionadoJ2 = colorFichaJ2.value;

		let fichasTablero = getColor('gris');
		let colorJ1 = getColor(colorSeleccionadoJ1)
		let colorJ2 = getColor(colorSeleccionadoJ2);
		let jugador1 = inputJugador1.value; //agarrar del formulario
    	let jugador2 = inputJugador2.value; //agarrar del formulario
		juego = new Juego(ctx,juegoElegido,jugador1,jugador2,colorJ1,colorJ2, fichasTablero);
		juego.play();

		initTimer();
		
		initEvents();
	}

	function getColor(color) {
		switch (color) {
			case 'amarillo':
				return imagenAmarillo
			case 'azul':
				return imagenAzul
			case 'naranja':
				return imagenNaranja
			case 'negro':
				return imagenNegro
			case 'rojo':
				return imagenRojo
			case 'verde':
				return imagenVerde
			case 'violeta':
				return imagenVioleta
			default:
				return imagenGris;
		}
	}


	//inicializar eventos
    function initEvents() {
		canvas.addEventListener("mousedown", onMouseDown, false);
		canvas.addEventListener("mousemove", onMouseMove, false);
		canvas.addEventListener("mouseup", onMouseUp, false);
    }

	function onMouseDown(e){
		juego.buscarFichaClickeada(e.layerX, e.layerY);
	}

	function onMouseMove(e){
		if(juego.hayFichaClickeada()){
			juego.moveFicha(e.layerX, e.layerY);
		}
	}

	function onMouseUp(e){
		let x = e.layerX;
		let y = e.layerY;; 
		if (juego.hayFichaClickeada()){
			juego.insertarFicha(x,y);    
		}
	}

	function initTimer() {
		let minute = 3;
		let sec = 0;
		var interval = setInterval(function () {
			if(!juego.isJuegoTerminado()){
				document.getElementById("timer").classList.remove('oculto');
				let secInfo = (sec < 10) ? '0'+sec : sec;
				let minuteInfo = (minute < 10) ? '0'+minute : minute;
				document.getElementById("timer").innerHTML = minuteInfo + " : " + secInfo;			
				sec--;
				if(sec < 0 && minute == 0){
					juego.stopJuego();
					clearInterval(interval);
					document.getElementById("timer").classList.add('oculto')
					document.getElementById("timeout-mensaje").classList.remove('oculto');
					document.getElementById("reiniciar-juego").classList.remove('oculto');
					document.getElementById("cambiar-tablero").classList.remove('oculto');
				} else {
					if(sec < 0){
						minute--;
						sec = 59;
					}
				}

			} else {
				clearInterval(interval);
			}
		}, 1000);
	}
});


/**
 * 
 X en linea

OBJETOS:
- Tablero
	- ancho
	- alto
	- columnas
	- filas
	- ranuras[] ==> fichas inactivas

- Ficha
	- imagen/color
	- posX
	- posY
	- Jugador
	- radio
	- clickeada
	- activa

- Jugador
	- id
	- nombre
	- Fichas[] ==> fichas activas

- Juego
	- turno
	- timer
	- juegoFinalizado
	- Jugador1
	- Jugador2
	- cantidadFichas
	- Tablero
 */