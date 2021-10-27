class Juego{

    constructor(){
        this.puntaje = document.getElementById('puntos');
        this.avatarJugador = new Avatar(200, 150);
        this.limiteIzquierdo = 50;
        this.limiteDerecho = window.screen.width-160;
        this.limiteSuperior = window.screen.height-330;
        this.limiteInferior = 50;
        this.jugando = false;   
        this.objetos = []; 
        this.intervalosObjetos = [];
        this.puntos = 0;  
        this.contadorObjetosCreados = 0; 

        this.acciones = ['ArrowDown','ArrowUp','ArrowLeft','ArrowRight'];
        this.accionActual = '';
        
        this.initEventos(this);
        this.crearObjetos();
        this.verificarColision();
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

        this.jugando = true;
    }

    moverAvatar(){
        if(this.acciones.includes(this.accionActual) && this.puedeMover()){
            this.avatarJugador.moverAvatar(this.accionActual)
        }
    }

    puedeMover(){
        let posicion = this.avatarJugador.getPosicionAvatar();
        let movimiento = this.avatarJugador.getMovimiento();
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
        // let objetoTiburon = new Objeto(600,400,'tiburon');
        // let objetoAguaviva = new Objeto(800,200,'aguaviva');
        // let objetoOstra = new Objeto(1000,400,'ostra');
        // //agregar ostra
        // this.objetos.push(objetoTiburon);
        // this.objetos.push(objetoAguaviva);
        // this.objetos.push(objetoOstra);

        let creacionObjeto = setInterval(() => {
            if(this.jugando){
                let idObjeto = this.crearObjeto();            
                this.eliminarObjeto(idObjeto);
            } else {
                clearInterval(creacionObjeto); 
            }
        }, 1500);  
    }

    verificarColision(){ 
        let intervaloColision = setInterval(() => {
            //let avatar = this.avatarJugador;
            for (let idObjeto in this.objetos) {
                var objeto = this.objetos[idObjeto];
                let hayColision = this.hayColision(this.avatarJugador,objeto);
                if(hayColision){
                    console.log('hay colision con '+objeto.getNombre());
                    if(objeto.getNombre() == 'ostra'){
                        console.log('suma puntos');
                        this.incrementarPuntos();
                        this.puntaje.innerHTML = this.getPuntos();
                        console.log(this.puntaje);
                    } else {
                        this.finalizaJuegoXColision(intervaloColision);
                        
                    }
                }
            }
           
        }, 1000);
    }

    finalizaJuegoXColision(intervaloColision){
        let divAvatar = this.avatarJugador.getAvatar();
        divAvatar.classList.remove('jugando');
        divAvatar.classList.add('muerte');

        setTimeout(function () {
            divAvatar.classList.remove('muerte');
            clearInterval(intervaloColision);
            console.log('muere pez');
        }, 1000);

        this.jugando = false;
        //AGREGAR CARTEL DE GAME OVER
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

    incrementarPuntos(){
        this.puntos += 5;
    }

    eliminarObjeto(idObjeto){
        this.intervalosObjetos[idObjeto] = setInterval(() => {
            let objeto = this.objetos[idObjeto];
            if(objeto) {
                objeto.getObjeto().remove();
                delete this.objetos[idObjeto];
            }
            clearInterval(this.intervalosObjetos[idObjeto]);
        },7500);
    }

    crearObjeto(){
        let objetos = ['tiburon','aguaviva','ostra'];
        let nombre = objetos[Math.floor(Math.random() * objetos.length)];
        let posicionY = Math.random() * (this.limiteSuperior - this.limiteInferior) + this.limiteInferior;
        let nuevoObjeto = new Objeto(this.limiteDerecho + 200,posicionY,nombre); // -5
        let id = 'objeto' + this.contadorObjetosCreados;
        this.contadorObjetosCreados++;
        this.objetos[id] = nuevoObjeto; 
        
        return id;
    }

}