class Ficha{

    constructor(ctx,posX,posY,radio,colorFicha,jugador){
        this.ctx = ctx;
        this.imagen = new Image();
        this.imagen.src = colorFicha.src;
        this.posX = posX;
        this.posY = posY;
        this.radio = radio;  
	      this.jugador = jugador;
        this.estado = 'activa';
        /*this.clickeada
        this.activa */
    }
    
    drawFicha(){
        let contexto = this.ctx;
        contexto.beginPath();
        contexto.arc(this.posX, this.posY, this.radio, 0, Math.PI*2);
        contexto.fillStyle = '#ffffff';
        contexto.fill();
        contexto.closePath();

        let img = this.imagen;
        let x = this.posX - this.radio;
        let y = this.posY - this.radio;
        let redimencion = this.redimencionarImagen(this.radio);
        contexto.drawImage(this.imagen, x-redimencion.diferencia, y-redimencion.diferencia, img.width+img.width*redimencion.porcentaje, img.height+img.height*redimencion.porcentaje);
       
    }

    redimencionarImagen(radio){
        let fourInLine = {
            diferencia: 0,
            porcentaje: 0.1
          };
      
          let fiveInLine = {
            diferencia: 0,
            porcentaje: 0
          };
      
          let sixInLine = {
            diferencia: 0,
            porcentaje: -0.1
          };
      
          switch (radio) {
            case 25:
              return fiveInLine;
            case 23:
              return sixInLine;
            default:
              return fourInLine;
          }
    }

    deshabilitarFicha(){
      this.estado = 'inactiva';
    }

    estaActiva(){
      return this.estado == 'activa';
    }

    getPosX(){
        return this.posX;
    }

    getPosY(){
        return this.posY;
    }

    getPosicionFicha(){
        return {
            x: this.getPosX(),
            y: this.getPosY()
        }
    }

    setPosicionFicha(x,y){
      this.posX = x;
      this.posY = y;
    }

    isPointInside(x,y){
      let _x = x - this.posX;
      let _y = y - this.posY;

      return (Math.sqrt(_x * _x + _y * _y)) < this.radio;
    }

    getJugador(){
      return this.jugador;
    }
}