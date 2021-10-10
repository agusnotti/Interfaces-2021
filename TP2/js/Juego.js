class Juego {
  constructor(ctx, juegoElegido,jugador1,jugador2,colorJ1, colorJ2, fichasTablero) {
    this.tipoTablero = this.obtenerMedidasTablero(juegoElegido);
    this.jugador1 = new Jugador(ctx,jugador1,1,this.tipoTablero,colorJ1);
    this.jugador2 = new Jugador(ctx,jugador2,2,this.tipoTablero,colorJ2);
    this.tablero = new Tablero(ctx, this.tipoTablero, fichasTablero);
    this.turnoJugador = 1;
    this.cantidadFichasJugadas = 0;
    this.juegoTerminado = false;
    this.tablero.drawTablero();
  }

  play(){
    this.tablero.drawTablero();
    this.jugador1.drawFichasJugador();
    this.jugador2.drawFichasJugador();
  }

  buscarFichaClickeada(x, y){
    if(this.turnoJugador == this.jugador1.getNroJugador() && !this.juegoTerminado){
      this.jugador1.buscarFichaClickeada(x,y);
    } else {
      this.jugador2.buscarFichaClickeada(x,y);
    }
  }

  hayFichaClickeada() {
    if(this.turnoJugador == this.jugador1.getNroJugador()){
      return this.jugador1.hayFichaClickeada();
    } else {
      return this.jugador2.hayFichaClickeada();
    }
  }

  moveFicha(x, y) {
    this.tablero.drawTablero();
    this.jugador1.drawFichasJugador();
    this.jugador2.drawFichasJugador();
    if(this.turnoJugador == this.jugador1.getNroJugador()){
      this.jugador1.moveFicha(x,y);      
    } else {
      this.jugador2.moveFicha(x,y);
    }
  
  }

  insertarFicha(x,y) {
    if(this.turnoJugador == this.jugador1.getNroJugador()){
      let ficha = this.jugador1.getFichaActual();
      if(this.tablero.insertarFicha(x,y,ficha)){
        this.jugador1.desclickearFicha();    
        this.cantidadFichasJugadas++;
        this.isJuegoTerminado();
        this.setTurnoJugador();
      } else {
        this.jugador1.reiniciarSeleccion();
      }
      this.tablero.drawTablero();
      this.jugador1.drawFichasJugador();
      this.jugador2.drawFichasJugador();
    } else {
      let ficha = this.jugador2.getFichaActual();
      if(this.tablero.insertarFicha(x,y,ficha)){
        this.jugador2.desclickearFicha();    
        this.cantidadFichasJugadas++;
        this.isJuegoTerminado();
        this.setTurnoJugador();
      } else {
        this.jugador2.reiniciarSeleccion();
      }
      this.tablero.drawTablero();
      this.jugador1.drawFichasJugador();
      this.jugador2.drawFichasJugador();  
    }
  }

  isJuegoTerminado(){
    if(this.hayEmpate()){
      alert('Empate');
    }
  }

  setTurnoJugador(){
    if(this.turnoJugador == 1){
      this.turnoJugador = 2;
    } else {
      this.turnoJugador = 1;
    }
  }

  hayEmpate(){
    return this.tablero.cantidadFichas == this.cantidadFichasJugadas;
  }

  obtenerMedidasTablero(juegoElegido) {
    let fourInLine = {
      columnas: 6,
      filas: 7,
      radio: 27,
      cantidadFichas: 42
    };

    let fiveInLine = {
      columnas: 7,
      filas: 8,
      radio: 25,
      cantidadFichas: 56
    };

    let sixInLine = {
      columnas: 8,
      filas: 9,
      radio: 23,
      cantidadFichas: 72
    };

    switch (juegoElegido) {
      case "fiveInLine":
        return fiveInLine;
      case "sixInLine":
        return sixInLine;
      default:
        return fourInLine;
    }
  }
}
