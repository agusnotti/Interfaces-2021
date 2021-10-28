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
     let mensajeJuegoPerdido = document.getElementById('mensaje-juego-perdido');
     let puntaje = document.getElementById('puntaje');
     let juego;
     
     btnJugar.addEventListener('click', ()=>{
          menu.classList.add('oculto');
          puntaje.classList.remove('oculto');
          juego = new Juego();
     });

     btnReiniciarJuego.addEventListener('click', ()=>{
          mensajeJuegoPerdido.classList.add('oculto');
          puntaje.classList.remove('oculto');
          juego = new Juego();
     });

     btnVolverInicio.addEventListener('click', ()=>{
          mensajeJuegoPerdido.classList.add('oculto');
          menu.classList.remove('oculto');
     });
})