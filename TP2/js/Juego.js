class Juego {
  constructor(ctx, juegoElegido,jugador1,jugador2,colorJ1, colorJ2, fichasTablero) {
    this.tipoTablero = this.obtenerMedidasTablero(juegoElegido);
    this.jugador1 = new Jugador(ctx,jugador1,1,this.tipoTablero,colorJ1);
    this.jugador2 = new Jugador(ctx,jugador2,2,this.tipoTablero,colorJ2);
    this.tablero = new Tablero(ctx, this.tipoTablero, fichasTablero);
    this.turnoJugador = 1;
    document.getElementById('nombre-jugador1-box').classList.add('turno-jugador');
    document.getElementById('nombre-jugador2-box').classList.remove('turno-jugador');
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
    let fichaInsertada = false;
    if(this.turnoJugador == this.jugador1.getNroJugador()){
      let ficha = this.jugador1.getFichaActual();
      if(this.tablero.insertarFicha(x,y,ficha)){
        this.jugador1.desclickearFicha();    
        this.cantidadFichasJugadas++;
        fichaInsertada = true;
      } else {
        this.jugador1.reiniciarSeleccion();
      }
    } else {
      let ficha = this.jugador2.getFichaActual();
      if(this.tablero.insertarFicha(x,y,ficha)){
        this.jugador2.desclickearFicha();    
        this.cantidadFichasJugadas++;
        fichaInsertada = true;
      } else {
        this.jugador2.reiniciarSeleccion();
      }
    }
    this.tablero.drawTablero();
    this.jugador1.drawFichasJugador();
    this.jugador2.drawFichasJugador();  

    if(fichaInsertada){
      setTimeout(() => {
        if(!this.isJuegoTerminado()){
          this.setTurnoJugador();
        } else {
          this.juegoTerminado = true;          
          document.getElementById("timer").classList.add('oculto');
          document.getElementById("reiniciar-juego").classList.remove('oculto');
          document.getElementById("cambiar-tablero").classList.remove('oculto');
        }
      }, 200);
    }
  }

  isJuegoTerminado(){
    let juegoTerminado = false;
    if(this.hayEmpate()){
      document.getElementById("empate-mensaje").classList.remove('oculto');
      juegoTerminado = true;
    } else if (this.hayGanador()){
      let ganador = null;
      if(this.turnoJugador == 1){
        ganador = this.jugador1.getNombre();
      } else{
        ganador = this.jugador2.getNombre();
      }
      document.getElementById("nombre-ganador").innerHTML = ganador;
      document.getElementById("ganador-mensaje").classList.remove('oculto');
      juegoTerminado = true;
    }
    return juegoTerminado;
  }

  hayGanador(){
    return this.tablero.hayGanador(this.turnoJugador);
  }

  stopJuego(){
    this.juegoTerminado = true;
  }

  setTurnoJugador(){
    if(this.turnoJugador == 1){
      this.turnoJugador = 2;
    } else {
      this.turnoJugador = 1;
    }
    document.getElementById('nombre-jugador1-box').classList.toggle('turno-jugador');
    document.getElementById('nombre-jugador2-box').classList.toggle('turno-jugador');
  }

  hayEmpate(){
    return this.tipoTablero.cantidadFichas == this.cantidadFichasJugadas;
  }

  obtenerMedidasTablero(juegoElegido) {
    let fourInLine = {
      columnas: 6,
      filas: 7,
      radio: 27,
      cantidadGanadora: 4,
      cantidadFichas: 42
    };
    
    let fiveInLine = {
      columnas: 7,
      filas: 8,
      radio: 25,
      cantidadGanadora: 5,
      cantidadFichas: 56
    };

    let sixInLine = {
      columnas: 8,
      filas: 9,
      radio: 23,
      cantidadGanadora: 6,
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
