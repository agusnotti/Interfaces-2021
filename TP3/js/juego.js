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
        document.addEventListener("keydown", function (e) {
            console.log(e.key)
            ctxJuego.accionActual = e.key;
            ctxJuego.moverAvatar();
        });

    }

    moverAvatar(){
        if(this.acciones.includes(this.accionActual) && this.puedeMover()){
            this.avatarJugador.moverAvatar(this.accionActual)
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
        /* let objetoTiburon = new Objeto(600,400,'tiburon');
        let objetoAguaviva = new Objeto(800,200,'aguaviva');
        let objetoOstra = new Objeto(1000,400,'ostra');

        this.objetos.push(objetoTiburon);
        this.objetos.push(objetoAguaviva);
        this.objetos.push(objetoOstra); */

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

    verificarColision(){ 
        let intervaloColision = setInterval(() => {
            if(!this.timerFinalizado) { // si no termino el timer
                for (let idObjeto in this.objetos) {
                    let objeto = this.objetos[idObjeto];
                    let hayColision = this.hayColision(this.avatarJugador,objeto);
                    if(hayColision){
                        console.log('hay colision con '+objeto.getNombre());
                        if(objeto.getNombre() == 'ostra'){
    
                            console.log('suma puntos');
                            this.incrementarPuntos(objeto);
                            
                            console.log(this.puntaje);
                        } else {
                            
                            this.finalizaJuegoXColision(intervaloColision);
                        }
                    }
                }
            } else {
                //termino timer
                //finaliza juego por que gano
            }
           
        }, 1000);
    }

    finalizaJuegoXColision(intervaloColision){
            let divAvatar = this.avatarJugador.getAvatar();
            let divMensaje = document.getElementById('mensaje-juego-perdido');
            let fondo = document.getElementById('parallax-background');
            
            divAvatar.classList.remove('jugando');
            divAvatar.classList.add('muerte');
            fondo.classList.remove('animacion-fondo'); 
    
            setTimeout(function () {
                divAvatar.classList.remove('muerte');
                divAvatar.remove();
                clearInterval(intervaloColision);
                console.log('muere pez');
            }, 1000);
    
            this.jugando = false;
            
            setTimeout(function () {
                divMensaje.classList.remove('oculto');
            }, 2000);
    }

    incrementarPuntos(objeto){        
        this.puntos += 5;
        this.puntaje.innerHTML = this.getPuntos();

        let divObjeto = objeto.getObjeto()
        divObjeto.classList.remove('movimiento-ostra');
        divObjeto.classList.add('desaparecer');
    }

    hayColision(avatar,objeto){
        let hayColision = false;
        let posicionAvatar = avatar.getPosicionAvatar();
        let posicionObjeto = objeto.getPosicionObjeto();
        let dimensionAvatar = avatar.getDimensiones();
        let dimensionesObjeto = objeto.getDimensiones();

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
		let minute = 2;
		let sec = 0;
        let ctxJuego = this;
		var interval = setInterval(function () {
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
						minute--;
						sec = 59;
					}
				}
			} else {
				clearInterval(interval);
			}
		}, 1000);
	}
   

    
}