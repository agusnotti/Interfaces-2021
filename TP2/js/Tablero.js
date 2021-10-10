class Tablero{

    constructor(ctx,tipoTablero, fichasTablero){
        this.ancho = 550;
        this.alto = 450;
        this.posXInicial = 300;
        this.posYInicial = 100;
        this.ctx = ctx;
        this.tipoTablero = tipoTablero;
	    this.columnas = this.tipoTablero.columnas;
	    this.filas = this.tipoTablero.filas;
        this.radio = this.tipoTablero.radio;
        this.cantidadGanadora = this.tipoTablero.cantidadGanadora;
        this.anchoColumna = this.ancho/this.columnas;
        this.altoFila = this.alto/this.filas;
        this.ranuras = [];
        this.fichasTablero = fichasTablero;
        this.initTablero();
    }


    initTablero() {           
        let difX = this.anchoColumna/2;
        let difY = this.altoFila/2;
        let posXInicialFicha = this.posXInicial+difX;       

        for (let i = 0; i < this.columnas; i++) {   
            let posYInicialFicha = this.posYInicial+difY;
            this.ranuras[i] = [];  
            for (let j = 0; j < this.filas; j++) {
                let ficha = new Ficha(this.ctx,posXInicialFicha,posYInicialFicha,this.radio,this.fichasTablero,0);
                this.ranuras[i][j] = ficha; 
                posYInicialFicha += difY*2; 
            }
            posXInicialFicha += difX*2;
        }
    }

    drawTablero(){
        this.ctx.fillStyle = '#f3f6f4';
        this.ctx.fillRect(0,0,1100,550);          
        this.ctx.fillStyle="#ea9999";
        this.ctx.fillRect(this.posXInicial, this.posYInicial, this.ancho,this.alto);
        for (let i = 0; i < this.columnas; i++) {          
            for (let j = 0; j < this.filas; j++) {
                let ficha = this.ranuras[i][j];
                ficha.drawFicha();
            }
        }
    }

    insertarFicha(x,y,ficha){
        let puedeInsertarFicha = false;
        if(y < this.posYInicial && x > this.posXInicial && x < this.posXInicial+this.ancho){
            let colInicio = this.posXInicial;
            let colFin = colInicio + this.anchoColumna;
            for (let i = 0; i < this.columnas; i++) {
                if(x >  colInicio +5 && x < colFin -5){
                    for (let j = this.filas -1; j >= 0; j--) {
                        if(this.ranuras[i][j].getJugador() == 0){
                            let fichaTmpPosicion =  this.ranuras[i][j].getPosicionFicha();

                            ficha.setPosicionFicha(fichaTmpPosicion.x, fichaTmpPosicion.y)
                            this.ranuras[i][j] = ficha;
                            puedeInsertarFicha = true;
                            break;
                        }
                    }
                }
                colInicio += this.anchoColumna;
                colFin += this.anchoColumna;
            }
        }
        return puedeInsertarFicha;
    } 

    hayGanador(nroJugador){
        return this.comprobarVertical(nroJugador) || this.comprobarHorizontal(nroJugador) || this.comprobarDiagonal(nroJugador);
    }

    comprobarVertical(nroJugador){
        for (let i = 0; i < this.columnas; i++) {
            let contador = 0;
            for (let j = 0; j < this.filas; j++) {
                if(this.ranuras[i][j].getJugador()==nroJugador){
                    contador++;
                    if (contador == this.cantidadGanadora) {
                        return true;
                    }
                } else {
                    contador = 0;
                }
            }            
        }
        return false;
    }
    
    comprobarHorizontal(nroJugador){
        for (let j =  0; j < this.filas; j++) {
            let contador = 0;
            for (let i = 0; i < this.columnas; i++) {
                if(this.ranuras[i][j].getJugador()==nroJugador){
                    contador++;
                    if (contador == this.cantidadGanadora) {
                        return true;
                    }
                } else {
                    contador = 0;
                }
            }            
        }
        return false;
    }

    comprobarDiagonal(nroJugador){
        return this.comprobarDiagonalDerecha(nroJugador) || this.comprobarDiagonalIzquierda(nroJugador);
    }

    comprobarDiagonalDerecha(nroJugador){
        for (let j =  0; j < this.filas; j++) {
            for (let i = 0; i < this.columnas; i++) {
                if(this.ranuras[i][j].getJugador()==nroJugador && j+this.cantidadGanadora < this.filas && i+this.cantidadGanadora < this.columnas){
                    let contador = 0;
                    for (let h = 0; h < this.cantidadGanadora; h++) {
                        if(this.ranuras[i+h][j+h].getJugador()==nroJugador){
                            contador++;
                            if (contador == this.cantidadGanadora) {
                                return true;
                            }
                        }
                    }                    
                }
            }            
        }
        return false;
    }

    comprobarDiagonalIzquierda(nroJugador){

    }
}