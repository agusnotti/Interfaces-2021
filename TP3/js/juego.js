class Juego{

    constructor(){
        this.puntaje = document.getElementById('puntos');
        this.avatarJugador = new Avatar(200, 150);
        this.limiteIzquierdo = 50;
        this.limiteDerecho = window.screen.width-160;
        this.limiteSuperior = window.screen.height-330;
        this.limiteInferior = 50;
        this.jugando = true;   
        this.objetos = []; 
        this.intervalosObjetos = [];
        this.puntos = 0;  
        this.contadorObjetosCreados = 0; 
        this.timerFinalizado = false;
        this.nivel = 1;

        this.acciones = ['ArrowDown','ArrowUp','ArrowLeft','ArrowRight'];
        this.accionActual = '';
        document.getElementById("timer").innerHTML = "02:00";
        
        this.iniciarJuego();
        
    }    

    /**
     * Inicio la animacion del fondo.
     * Realiza la llamada al metodo que captura los eventos de las teclas.
     * Realiza la llamada al metodo que crea los objetos con los que interactua el avatar (obtsaculos y coleccionable)
     * Realiza la llamada que verifica si se produce una colision.
     * Realiza la llamada que da inicio a Timer del juego.
     */
    iniciarJuego(){ 
        let fondo = document.getElementById('parallax-background');
        let niveles = document.getElementById('mensaje-nivel');
        niveles.innerHTML = "Nivel "+this.nivel;
        fondo.classList.add('animacion-fondo'); 
        this.puntaje.innerHTML = this.getPuntos();
        niveles.classList.remove('oculto');
        this.initEventos(this);
        this.crearObjetos();
        this.verificarColision();
        this.initTimer();
    }

    /**
     * Obtiene los puntos del juego en curso.
     */
    getPuntos(){
        return this.puntos;
    }

    /**
     * Captura los eventos al pretar las teclas de direccion
     */
    initEventos(ctxJuego){
        let avatar = this.avatarJugador;

        document.addEventListener("keydown", function (e) {
            ctxJuego.accionActual = e.key;
            ctxJuego.moverAvatar();
        });

        document.addEventListener("keyup", function (e) {
            ctxJuego.accionActual = '';
            avatar.eliminarMovimientoAvatar();
        });
    }

    /**
     * Acciona el movimiento del avatar dependiendo de las acciones determinadas (arriba, abajo, atras, adelante).
     */
    moverAvatar(){
        if(this.acciones.includes(this.accionActual) && this.puedeMover()){
            this.avatarJugador.moverAvatar(this.accionActual);
            this.verificarColision(true);
        }
    }

    /**
     * Verifica que el avatar pueda realizar movimientos segun su posicion 
     * dentro de los limites del area de juego establecidos.
     */
    puedeMover(){
        let posicion = this.avatarJugador.getPosicionAvatar();
        let puedeMover = true;
        if ((this.accionActual == 'ArrowLeft' && posicion.posX < this.limiteIzquierdo)||
            (this.accionActual == 'ArrowRight' && posicion.posX > this.limiteDerecho)||
            (this.accionActual == 'ArrowUp' && posicion.posY > this.limiteSuperior) ||
            (this.accionActual == 'ArrowDown' && posicion.posY < this.limiteInferior)){

                puedeMover = false;
            }

        return puedeMover; 
    }

    /**
     * Realiza la llamada al metodo de creacion de los objetos con los que interactua el avatar a partir de un 
     * intervalo de tiempo (cada dos segundos)
     */
    crearObjetos(){
        let creacionObjeto = setInterval(() => {
            if(this.jugando){
                let idObjeto = this.crearObjeto();            
                this.eliminarObjeto(idObjeto);
            } else {
                clearInterval(creacionObjeto); 
            }
        }, 2000);  
    }

    /**
     * Elimina un objeto segun su id, luego de salir de la pantalla
     */
    eliminarObjeto(idObjeto){
        this.intervalosObjetos[idObjeto] = setInterval(() => {
            let objeto = this.objetos[idObjeto];
            if(objeto) {
                objeto.getObjeto().remove();
                delete this.objetos[idObjeto];
            }
            clearInterval(this.intervalosObjetos[idObjeto]);
        },8000);
    }

    /**
     * Selecciona el objeto a crear de manera random.
     * Establece una posicion random de ese objeto
     * Crea el objeto
     * Le asigna la clase con el movimiento acorde al objeto
     * Lo agrega a un arreglo de objetos.
     * Le asigna y retorna el id para identificar al objeto creado
     */
    crearObjeto(){
        let objetos = ['tiburon','aguaviva','ostra'];
        let nombre = objetos[Math.floor(Math.random() * objetos.length)];
        let posicionY = Math.random() * (this.limiteSuperior - this.limiteInferior) + this.limiteInferior;
        let nuevoObjeto = new Objeto(this.limiteDerecho + 200,posicionY,nombre);

        let clase = "movimiento-"+nombre;
        let divObjeto = nuevoObjeto.getObjeto()
        divObjeto.classList.add(clase);

        let id = 'objeto' + this.contadorObjetosCreados;
        this.contadorObjetosCreados++;
        this.objetos[id] = nuevoObjeto; 
        
        return id;
    }

    /**
     * Lleva a cabo las acciones correspondientes (muerte del avatar o sumar puntos), 
     * dependiendo si se produce colision con un objeto obtaculo (tiburon o aguaviva) 
     * o un objeto coleccionable (ostra)
     */
    verificarColision(hayMovimiento = false){ 
        let intervaloColision = setInterval(() => {
            if(!this.timerFinalizado) {
                for (let idObjeto in this.objetos) {
                    let objeto = this.objetos[idObjeto];
                    let hayColision = this.hayColision(this.avatarJugador,objeto);
                    if(hayColision){
                        if(objeto.getNombre() == 'ostra'){
                            this.incrementarPuntos(objeto);
                        } else {                            
                            this.finalizaJuegoXColision(intervaloColision);
                        }
                    }
                }
            } else {
                this.finalizaJuegoGanado(intervaloColision);
            }    
            
            if(hayMovimiento) {
                clearInterval(intervaloColision);
            }
        }, 1000);
    }

    /**
     * Lleva a cabo las acciones cuando finaliza el Timer, dando el juego como ganado.
     */
    finalizaJuegoGanado(intervaloColision){
        let divAvatar = this.avatarJugador.getAvatar();
        let divMensaje = document.getElementById('mensaje-juego');
        let fondo = document.getElementById('parallax-background');
        let mensajeGanador = document.getElementById('mensaje-ganador');

        divAvatar.classList.remove('jugando');
        divAvatar.classList.remove('subiendo');
        divAvatar.classList.remove('bajando');
        fondo.classList.remove('animacion-fondo'); 

        divAvatar.remove();
        clearInterval(intervaloColision);

        this.jugando = false;
        
        divMensaje.classList.remove('oculto');
        mensajeGanador.classList.remove('oculto');        
    }

    /**
     * Lleva a cabo las acciones cuando se produce una colision entre el avatar y 
     * uno de los objetos obstaculo (tiburon o aguaviva), dando el juego como perdido.
     */
    finalizaJuegoXColision(intervaloColision){
        let divAvatar = this.avatarJugador.getAvatar();
        let divMensaje = document.getElementById('mensaje-juego');
        let fondo = document.getElementById('parallax-background');
        let mensajePerdedor = document.getElementById('mensaje-perdedor');
        
        divAvatar.classList.remove('jugando');
        divAvatar.classList.remove('subiendo');
        divAvatar.classList.remove('bajando');
        divAvatar.classList.add('muerte');
        fondo.classList.remove('animacion-fondo'); 

        setTimeout(function () {
            divAvatar.classList.remove('muerte');
            divAvatar.remove();
            clearInterval(intervaloColision);
        }, 1000);

        this.jugando = false;
        
        divMensaje.classList.remove('oculto');
        mensajePerdedor.classList.remove('oculto');
    }

    /**
     * Realiza el incremento del puntaje cuando el avatar colisiona con un objeto ostra.
     */
    incrementarPuntos(objeto){        
        this.puntos += 5;
        this.puntaje.innerHTML = this.getPuntos();

        let posicionJugador = this.avatarJugador.getPosicionAvatar();
        objeto.setPosX(posicionJugador.posX);
        objeto.setPosY(posicionJugador.posY);
        objeto.setPosicionObjeto();

        let divObjeto = objeto.getObjeto();
        
        divObjeto.classList.remove('movimiento-ostra');
        divObjeto.classList.add('desaparecer');

        setTimeout(() => {
            divObjeto.classList.add('oculto');
            objeto.setPosX(-1500);
            objeto.setPosY(-1500);
            objeto.setPosicionObjeto();
        }, 500);
    }

    /**
     * Verifica si hay una colsion entre un objeto y el avatar
     */
    hayColision(avatar,objeto){
        let hayColision = false;
        let dimensionAvatar = avatar.getDimensiones();
        let dimensionesObjeto = objeto.getDimensiones();

        let posicionAvatar = {
            'posX' : avatar.getAvatar().getBoundingClientRect().left,
            'posY' : avatar.getAvatar().getBoundingClientRect().top
        }

        let posicionObjeto = {
            'posX' : objeto.getObjeto().getBoundingClientRect().left,
            'posY' : objeto.getObjeto().getBoundingClientRect().top
        }

        if(this.hayColisionEnX(posicionAvatar.posX, dimensionAvatar.width,posicionObjeto.posX, dimensionesObjeto.width) 
        && this.hayColisionEnY(posicionAvatar.posY, dimensionAvatar.height,posicionObjeto.posY, dimensionesObjeto.height)){
            hayColision = true;
        }

        return hayColision;
    }


    /**
     * Verifica si hay colision entre un objeto y el avatar en relacion al eje X
     */
    hayColisionEnX(posXAvatar, widthAvatar, posXObjeto, widthObjeto){
        let hayColision = false;

        let margenI = posXAvatar - widthAvatar;
        let margenD = posXAvatar + widthAvatar;

        let margenObsI = posXObjeto - widthObjeto;
        let margenObsD = posXObjeto + widthObjeto;

        if(margenObsI < margenI && margenI < margenObsD) {
            hayColision = true;
        }

        if(margenObsI < margenD && margenD < margenObsD) {
            hayColision = true;
        }

        return hayColision;
    }

    /**
     * Verifica si hay colision entre un objeto y el avatar en relacion al eje Y
     */
    hayColisionEnY(posYAvatar, heightAvatar, posYObjeto, heightObjeto){
        let hayColision = false;
        
        let margenS = posYAvatar - heightAvatar;
        let margenI = posYAvatar + heightAvatar;

        let margenObsS = posYObjeto - heightObjeto;
        let margenObsI = posYObjeto + heightObjeto;

        if(margenObsI > margenI && margenI > margenObsS) {
            hayColision = true;
        }

        if(margenObsI > margenS && margenS > margenObsS) {
            hayColision = true;
        }

        return hayColision;
    }

    /**
     * Setea el estado del timer.
     */
    setTimerFinalizado(timerFinalizado){
        this.timerFinalizado = timerFinalizado;
    }

    /**
     * Implementacion del timer del juego.
     */
    initTimer() {
		let minute = 1;
		let sec = 59;
        let ctxJuego = this;
		let interval = setInterval(function () {
			if(ctxJuego.estaJugando()){
				document.getElementById("timer").classList.remove('oculto');
				let secInfo = (sec < 10) ? '0'+sec : sec;
				let minuteInfo = (minute < 10) ? '0'+minute : minute;
				document.getElementById("timer").innerHTML = minuteInfo + ":" + secInfo;			
				sec--;
				if(sec < 0 && minute == 0){
					ctxJuego.setTimerFinalizado(true);
					clearInterval(interval);
				} else {
					if(sec < 0){
                        ctxJuego.aumentarDificultad();
						minute--;
						sec = 59;
                        let nivel = ctxJuego.getNivel();
                        nivel++;
                        document.getElementById('mensaje-nivel').innerHTML = "Nivel "+nivel;
					}
				}
			} else {
				clearInterval(interval);
			}
		}, 1000);
	}

    /**
     * Obtiene el nivel del juego
     */
    getNivel(){
        return this.nivel;
    }
   
    /**
     * LLeva a cabo una nueva creacion de objetos, incrementando la dificultad del juego
     */
    aumentarDificultad() {
        this.crearObjetos();
    }

    /**
     * Verifica el estado del juego.
     */
    estaJugando(){
        return this.jugando;
    }

    
}