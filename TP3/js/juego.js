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

        this.acciones = ['ArrowDown','ArrowUp','ArrowLeft','ArrowRight'];
        this.accionActual = '';
        
        this.iniciarJuego();
        
    }

    estaJugando(){
        return this.jugando;
    }


    iniciarJuego(){ 
        let fondo = document.getElementById('parallax-background');
        fondo.classList.add('animacion-fondo'); 
        this.puntaje.innerHTML = this.getPuntos();
        this.initEventos(this);
        this.crearObjetos();
        this.verificarColision();
        this.initTimer();
    }

    getPuntos(){
        return this.puntos;
    }

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

    moverAvatar(){
        if(this.acciones.includes(this.accionActual) && this.puedeMover()){
            this.avatarJugador.moverAvatar(this.accionActual);
            this.verificarColision(true);
        }
    }

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

    setTimerFinalizado(timerFinalizado){
        this.timerFinalizado = timerFinalizado;
    }

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
					}
				}
			} else {
				clearInterval(interval);
			}
		}, 1000);
	}
   
    aumentarDificultad() {
        this.crearObjetos();
    }

    
}