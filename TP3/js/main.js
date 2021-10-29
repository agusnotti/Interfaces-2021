/**
 * JUEGO
 * 
 * clases
 * - avatar (pez)
 * - obstaculo (tiburon y aguaviva)
 * - items vida y puntos (ostras)
 * - juego
 * 
 */

document.addEventListener("DOMContentLoaded", function(event) {
     
     let btnJugar = document.getElementById('jugar');
     let btnReiniciarJuego = document.getElementById('reiniciar-juego');
     let btnVolverInicio = document.getElementById('volver-inicio');
     let menu = document.getElementById('menu');
     let mensajeJuego = document.getElementById('mensaje-juego');
     let puntaje = document.getElementById('puntaje');
     let mensajePerdedor = document.getElementById('mensaje-perdedor');
     let mensajeGanador = document.getElementById('mensaje-ganador');
     let juego;
     
     btnJugar.addEventListener('click', ()=>{
          menu.classList.add('oculto');
          puntaje.classList.remove('oculto');
          juego = new Juego();
     });

     btnReiniciarJuego.addEventListener('click', ()=>{
          mensajeJuego.classList.add('oculto');
          mensajePerdedor.classList.add('oculto');
          mensajeGanador.classList.add('oculto');
          puntaje.classList.remove('oculto');
          juego = new Juego();
     });

     btnVolverInicio.addEventListener('click', ()=>{
          mensajeJuego.classList.add('oculto');
          mensajePerdedor.classList.add('oculto');
          mensajeGanador.classList.add('oculto');
          menu.classList.remove('oculto');
     });
})