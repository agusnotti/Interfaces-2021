class Juego{

    constructor(){
        this.avatarJugador = new Avatar(200, 150);
        this.limiteIzquierdo = 20;
        this.limiteDerecho = window.screen.width-20;
        this.limiteSuperior = window.screen.height-20;
        this.limiteInferior = 20;
        this.jugando = false;   
        this.obstaculos = [];
        this.vidas = [];     

        this.acciones = ['ArrowDown','ArrowUp','ArrowLeft','ArrowRight'];
        this.accionActual = '';
        
        this.initEventos(this);
        this.crearObstaculos();
        this.verificarColision();
    }

    initEventos(ctxJuego){
        document.addEventListener("keydown", function (e) {
            console.log(e.key)
            ctxJuego.accionActual = e.key;
            ctxJuego.moverAvatar();
        });
    }

    moverAvatar(){
        if(this.acciones.includes(this.accionActual)){
            this.avatarJugador.moverAvatar(this.accionActual)
        }
    }

    puedeMover(posicion, movimiento){
        let puedeMover = '';
        if(this.puedeMoverHorizontal(posicion, movimiento)){
            puedeMover = 'horizontal';
        }
        else if(this.puedeMoverVertical(posicion, movimiento)){
            puedeMover = 'vertical';
        }
        return puedeMover;
    }

    puedeMoverHorizontal(posicion, movimiento){
        return ((this.acciones.ArrowLeft && (posicion.posX - movimiento) > this.limiteIzquierdo) ||
                (this.acciones.ArrowRight && (posicion.posX + movimiento) < this.limiteDerecho));
    }

    puedeMoverVertical(posicion, movimiento){
        return ((this.acciones.ArrowUp && (posicion.posY + movimiento) < this.limiteSuperior) ||
                (this.acciones.ArrowDown && (posicion.posY - movimiento) > this.limiteInferior));
    }

    crearObstaculos(){
        let obstaculo = new Obstaculo(600,400,'tiburon');
        let obstaculo2 = new Obstaculo(800,200,'aguaviva');
        this.obstaculos.push(obstaculo);
        this.obstaculos.push(obstaculo2);
    }

    verificarColision(){ 
        let intervaloColision = setInterval(() => {
            let avatar = this.avatarJugador;
            this.obstaculos.forEach(obstaculo => {
                let hayColision = this.hayColision(avatar,obstaculo);
                if(hayColision){
                    console.log('hay colision con '+obstaculo.getNombre());
                   // clearInterval(intervaloColision);
                }
            });
        }, 1000);
    }

    hayColision(avatar,obstaculo){
        let hayColision = false;
        let posicionAvatar = avatar.getPosicionAvatar();
        let posicionObstaculo = obstaculo.getPosicionObstaculo();
        let dimensionAvatar = avatar.getDimensiones();
        let dimensionesObstaculo = obstaculo.getDimensiones();

        if(this.hayColisionEnX(posicionAvatar.posX, dimensionAvatar.width,posicionObstaculo.posX, dimensionesObstaculo.width) 
        && this.hayColisionEnY(posicionAvatar.posY, dimensionAvatar.height,posicionObstaculo.posY, dimensionesObstaculo.height)){
            hayColision = true;
        }

        return hayColision;
    }

    hayColisionEnX(posXAvatar, widthAvatar, posXObstaculo, widthObstaculo){
        let hayColision = false;

        let margenI = posXAvatar - widthAvatar;
        let margenD = posXAvatar + widthAvatar;

        let margenObsI = posXObstaculo - widthObstaculo;
        let margenObsD = posXObstaculo + widthObstaculo;


        if(margenObsI < margenI && margenI < margenObsD) {
            hayColision = true;
        }

        if(margenObsI < margenD && margenD < margenObsD) {
            hayColision = true;
        }

        // if(((posXAvatar + widthAvatar) > (posXObstaculo - widthObstaculo)) && ((posXAvatar + widthAvatar) < (posXObstaculo + widthObstaculo))){
        //     hayColision = true;
        // }

        // if(((posXAvatar - widthAvatar) > (posXObstaculo - widthObstaculo)) && ((posXAvatar - widthAvatar) < (posXObstaculo + widthObstaculo))){
        //     hayColision = true;
        // }

        return hayColision;
    }

    hayColisionEnY(posYAvatar, heightAvatar, posYObstaculo, heightObstaculo){
        let hayColision = false;

        
        let margenS = posYAvatar - heightAvatar;
        let margenI = posYAvatar + heightAvatar;

        let margenObsS = posYObstaculo - heightObstaculo;
        let margenObsI = posYObstaculo + heightObstaculo;


        if(margenObsI > margenI && margenI > margenObsS) {
            hayColision = true;
        }

        if(margenObsI > margenS && margenS > margenObsS) {
            hayColision = true;
        }

        // if(((posYAvatar + heightAvatar) > (posYObstaculo - heightObstaculo)) && ((posYAvatar + heightAvatar) < (posYObstaculo + heightObstaculo))){
        //     hayColision = true;
        // }

        // if(((posYAvatar - heightAvatar) > (posYObstaculo - heightObstaculo)) && ((posYAvatar - heightAvatar) < (posYObstaculo + heightObstaculo))){
        //     hayColision = true;
        // }

        return hayColision;
    }


}