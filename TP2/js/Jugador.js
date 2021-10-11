class Jugador{
    constructor(ctx,nombre,nroJugador,tipoTablero,colorFicha) {
        this.ctx = ctx;
        this.nombre = nombre;
        this.nroJugador = nroJugador;
        this.fichas = [];
        this.tipoTablero = tipoTablero;
        this.colorFicha = colorFicha;
        this.fichaActual = null;
        this.fichaClickeada = false;
        this.posXFichaInicial = 0;
        this.posYFichaInicial = 0;
        this.agregarFichas();
        this.drawFichasJugador();
    }

    drawFichasJugador(){
        for (let i = 0; i < this.fichas.length; i++) {
            this.fichas[i].drawFicha();
        }
    }

    agregarFichas(){
        let radio = this.tipoTablero.radio;
        let posX = 0;
        let posY = 0;
        let posTableroFichas = this.obtenerPosicionTableroFichas();
        let cantidadFichas = this.tipoTablero.cantidadFichas/2;
        
        for (let i = 0; i < cantidadFichas; i++) {
            posX = Math.round(Math.random() * (posTableroFichas.max - posTableroFichas.min)) + posTableroFichas.min;
            posY = Math.round(Math.random() * (520 - 120) ) + 120;
            let ficha = new Ficha(this.ctx,posX,posY,radio,this.colorFicha,this.nroJugador);
            this.fichas.push(ficha); 
        }
    }

    getNroJugador(){
        return this.nroJugador;
    }

    getNombre(){
        return this.nombre;
    }

    obtenerPosicionTableroFichas(){
        let nroJugador = this.getNroJugador();
        let tableroFichas;
        if(nroJugador == 1){
            tableroFichas = {
                max: 250,
                min: 30
            }
        } else {
            tableroFichas = {
                max: 1050,
                min: 900
            }
        }
        return tableroFichas;
    }

    hayFichaClickeada() {
        return this.fichaClickeada;
    }

    moveFicha(x, y) {
        this.fichaActual.setPosicionFicha(x,y);
    }

    desclickearFicha() {
        this.fichaActual.deshabilitarFicha();
        this.limpiarFichaClickeada();
    }

    limpiarFichaClickeada(){
        this.fichaActual = null;
        this.fichaClickeada = false;
    }

    reiniciarSeleccion(){
        this.fichaActual.setPosicionFicha(this.posXFichaInicial, this.posYFichaInicial);
        this.limpiarFichaClickeada();
    }

    buscarFichaClickeada(x, y) {       
        for (let i=0; i<this.fichas.length; i++) {
            let fichaTmp = this.fichas[i];
            if (fichaTmp.isPointInside(x, y) && fichaTmp.estaActiva()) {
                this.fichaActual = fichaTmp;
                this.fichaClickeada = true;
                let posicion = this.fichaActual.getPosicionFicha();
                this.posXFichaInicial = posicion.x;
                this.posYFichaInicial = posicion.y;
            }                
        }
    }

    getFichaActual(){
        return this.fichaActual;
    }
}