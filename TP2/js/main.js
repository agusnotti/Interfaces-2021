document.addEventListener("DOMContentLoaded", function () {
    let canvas = /** @type {HTMLCanvasElement} */ (
      document.getElementById("canvas")
    );
    let ctx = canvas.getContext("2d");
    /* let canvasWidth = canvas.width;
    let canvasHeigth = canvas.height; */
	let juego;

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

	let btnIniciarJuego = document.getElementById('iniciar-juego');
	btnIniciarJuego.addEventListener('click', () => {
		let juegoElegido = document.getElementById('juego').value;
		//agregar funcionalidad para seleccionar color
		//let colorSeleccionadoJ1 = document.getElementById('colorJ1');
		let colorSeleccionadoJ1 = 'rojo';
		let colorSeleccionadoJ2 = 'verde';

		let fichasTablero = getColor('gris');
		let colorJ1 = getColor(colorSeleccionadoJ1)
		let colorJ2 = getColor(colorSeleccionadoJ2);
		let jugador1 = "Agustin"; //agarrar del formulario
    	let jugador2 = "Agustina"; //agarrar del formulario
		juego = new Juego(ctx,juegoElegido,jugador1,jugador2,colorJ1,colorJ2, fichasTablero);
		juego.play();

		
		initEvents();
	})

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
		/* let x = e.layerX - e.currentTarget.offsetLeft;
		let y = e.layerY - e.currentTarget.offsetTop; */            
		
		juego.buscarFichaClickeada(e.layerX, e.layerY);
	}

	function onMouseMove(e){
		/* let x = e.layerX - e.currentTarget.offsetLeft;
		let y = e.layerY - e.currentTarget.offsetTop; */   

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
});
/**
 * 
 4 en linea

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