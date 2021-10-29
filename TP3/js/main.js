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
     let imagenDia = document.getElementById('fondo-dia');
     let imagenNoche = document.getElementById('fondo-noche');
     let fondo = document.getElementById('parallax-background');
     let juego;

     /// agregar evento en radio on change (o algo asi)
     // si es dia... agrego clase dia al parallax y saco noche
     // si es noche.. agrego clase noche y remuevo dia
     //ejemplo:
     // let fondo = document.getElementById('parallax-background');
     //fondo.classList.remove('dia');
     //fondo.classList.add('noche');

     //Revisar de agregar mensaje en cambio de level

     imagenDia.addEventListener('click', ()=>{
          imagenDia.classList.add('active');
          imagenNoche.classList.remove('active');
          fondo.classList.add('fondo-dia');
          fondo.classList.remove('fondo-noche'); 
     })

     imagenNoche.addEventListener('click', ()=>{
          imagenNoche.classList.add('active');
          imagenDia.classList.remove('active');
          fondo.classList.remove('fondo-dia');
          fondo.classList.add('fondo-noche'); 
     })
     
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