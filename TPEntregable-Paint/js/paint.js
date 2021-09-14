let canvas = /** @type {HTMLCanvasElement} */ (
  document.getElementById("canvas")
);
let ctx = canvas.getContext("2d");
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

// FUNCIONALIDAD LAPIZ Y GOMA
let isDrawing = false;
let x = 0;
let y = 0;

let lapiz = document.getElementById("lapiz");
let goma = document.getElementById("goma");
let colores = document.querySelectorAll(".colores");
let containerColores = document.getElementById("colores-container");

let imagen = new Image();

//Agrego evento del lapiz
lapiz.addEventListener("click", (e) => {
  lapiz.classList.toggle("active");
  containerColores.classList.toggle("active");
  if (goma.classList.contains("active")) {
    goma.classList.remove("active");
  }
});

//Agrego evento de la goma
goma.addEventListener("click", (e) => {
  goma.classList.toggle("active");
  if (lapiz.classList.contains("active")) {
    lapiz.classList.remove("active");
    containerColores.classList.remove("active");
  }
});

//init funciones
activarColor();

//Activar color
function activarColor() {
  colores.forEach((color) => {
    color.addEventListener("click", (e) => {
      desactivarColor();
      color.classList.add("active");
    });
  });
}

function desactivarColor() {
  colores.forEach((color) => {
    if (color.classList.contains("active")) {
      color.classList.remove("active");
    }
  });
}

function obtenerColorActivo() {
  let colorActivo = "negro";
  if (goma.classList.contains("active")) {
    colorActivo = "white";
  } else {
    colores.forEach((color) => {
      if (color.classList.contains("active")) {
        colorActivo = color.id;
      }
    });
  }
  return colorActivo;
}

// event.offsetX, event.offsetY gives the (x,y) offset from the edge of the canvas.
// Add the event listeners for mousedown, mousemove, and mouseup
//evento cuando se presiona el mouse
canvas.addEventListener("mousedown", (e) => {
  if (lapiz.classList.contains("active") || goma.classList.contains("active")) {
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = true;
  }
});

//evento cuando se mueve el mouse
canvas.addEventListener("mousemove", (e) => {
  if (isDrawing === true) {
    drawLine(e);
    /* x = e.offsetX;
    y = e.offsetY; */
  }
});

//evento cuando se suelta el mouse
canvas.addEventListener("mouseup", (e) => {
  if (isDrawing === true) {
    drawLine(e);
    x = 0;
    y = 0;
    isDrawing = false;
  }
});

function drawLine(e) {
  ctx.beginPath();
  ctx.strokeStyle = obtenerColorActivo(); //funcion para elegir el color
  ctx.lineWidth = 2; //funcion para elegir grosor
  ctx.moveTo(x, y);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.closePath();

  x = e.offsetX;
  y = e.offsetY;
}

// FUNCIONALIDAD SUBIR, DESCARGAR Y BORRAR LIENZO
let btnDescargarImg = document.getElementById("descargar");
let btnSubirImg = document.getElementById("subirImagen");
let seleccionarImagen = document.getElementById("seleccionarImagen");
let borrarCanvas = document.getElementById("nuevoProyecto");

btnSubirImg.addEventListener("click", (e) => {
  seleccionarImagen.click();
});

seleccionarImagen.addEventListener("change", subirImagen);

borrarCanvas.addEventListener("click", (e) => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
});

btnDescargarImg.addEventListener("click", (e) => {
  let a = document.createElement("a");
  a.download = "imagen.png";
  a.href = canvas.toDataURL("image/png");

  a.click();
});

function subirImagen(e) {
  imagen = new Image();
  let file = e.target.files[0]; // FileList object
  imagen.src = window.URL.createObjectURL(file);
  imagen.onload = function () {
    if (imagen.height > canvasHeight) {
      let proporcionAjusteImg = (canvasHeight / imagen.height) * 100;
      imagen.height = (proporcionAjusteImg * imagen.height) / 100;
      imagen.width = (proporcionAjusteImg * imagen.width) / 100;
    }

    if (imagen.width > canvasWidth && imagen.width > imagen.height) {
      let proporcionAjusteImg = (canvasWidth / imagen.width) * 100;
      imagen.height = (proporcionAjusteImg * imagen.height) / 100;
      imagen.width = (proporcionAjusteImg * imagen.width) / 100;
    }

    dibujarImagen(imagen);
  };
}

function dibujarImagen(imagen) {
  ctx.drawImage(imagen, 0, 0, imagen.width, imagen.height);
}

//FILTROS
let btnFiltros = document.getElementById("filtros");
let containerFiltros = document.getElementById("container-filtros");
btnFiltros.addEventListener("click", (e) => {
  containerFiltros.classList.toggle("active");
});



let inicial = document.getElementById("inicial");
inicial.addEventListener("click", deshacerFiltro);

let negativo = document.getElementById("negativo");
negativo.addEventListener("click", aplicarNegativo);

let sepia = document.getElementById("sepia");
sepia.addEventListener("click", aplicarSepia);

let binario = document.getElementById("binario");
binario.addEventListener("click", aplicarBinario);

let brillo = document.getElementById("brillo");
brillo.addEventListener("click", aplicarBrillo);

let escalaGrises = document.getElementById("escalaGrises");
escalaGrises.addEventListener("click", aplicarEscalaGrises);

let blur = document.getElementById("blur");
blur.addEventListener("click", aplicarBlur);

let deteccionBordes = document.getElementById("deteccionBordes");
deteccionBordes.addEventListener("click", aplicarDeteccionBordes);



//SETEO DE PIXEL
function setPixel(imageData, r, g, b, index) {
  imageData.data[index + 0] = r;
  imageData.data[index + 1] = g;
  imageData.data[index + 2] = b;
  imageData.data[index + 3] = 255;
}

//     esta bien esto??
function getPixel(imageData, x, y) {
  let index = (x + y * imageData.width) * 4;
  return {
    'r': imageData.data[index + 0],
    'g':imageData.data[index + 1],
    'b':imageData.data[index + 2],
    'a':imageData.data[index + 3]
  }
}

// DESHACER INICIAL
function deshacerFiltro(){
  dibujarImagen(imagen);
}

//FILTRO ESCALA DE GRISES
function aplicarEscalaGrises(e) {
  var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  for (let x = 0; x < canvasWidth; x++) {
    for (let y = 0; y < canvasHeight; y++) {
      let index = (x + y * imageData.width) * 4;
      let gris =
        (imageData.data[index + 0] +
          imageData.data[index + 1] +
          imageData.data[index + 2]) /
        3;
      let r = gris;
      let g = gris;
      let b = gris;

      setPixel(imageData, r, g, b, index);
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

//FILTRO BINARIZACION
function aplicarBinario(e) {
  var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  for (let x = 0; x < canvasWidth; x++) {
    for (let y = 0; y < canvasHeight; y++) {
      let index = (x + y * imageData.width) * 4;
      let gris =
        (imageData.data[index + 0] +
          imageData.data[index + 1] +
          imageData.data[index + 2]) /
        3;
      let r = gris > 255 / 2 ? 255 : 0;
      let g = gris > 255 / 2 ? 255 : 0;
      let b = gris > 255 / 2 ? 255 : 0;

      setPixel(imageData, r, g, b, index);
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

//FILTRO NEGATIVO
function aplicarNegativo(e) {
  var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  for (let x = 0; x < canvasWidth; x++) {
    for (let y = 0; y < canvasHeight; y++) {
      let index = (x + y * imageData.width) * 4;
      let r = 255 - imageData.data[index + 0];
      let g = 255 - imageData.data[index + 1];
      let b = 255 - imageData.data[index + 2];

      setPixel(imageData, r, g, b, index);
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

//FILTRO SEPIA
function aplicarSepia(e) {
  var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  for (let x = 0; x < canvasWidth; x++) {
    for (let y = 0; y < canvasHeight; y++) {
      let index = (x + y * imageData.width) * 4;

      let r =
        imageData.data[index + 0] * 0.393 +
        imageData.data[index + 1] * 0.769 +
        imageData.data[index + 2] * 0.189;
      let g =
        imageData.data[index + 0] * 0.349 +
        imageData.data[index + 1] * 0.686 +
        imageData.data[index + 2] * 0.168;
      let b =
        imageData.data[index + 0] * 0.272 +
        imageData.data[index + 1] * 0.534 +
        imageData.data[index + 2] * 0.131;

      setPixel(imageData, r, g, b, index);
    }
  }
  ctx.putImageData(imageData, 0, 0);
}


//FILTRO DE BRILLO
function aplicarBrillo(e) {
  var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  for (let x = 0; x < canvasWidth; x++) {
    for (let y = 0; y < canvasHeight; y++) {
      let index = (x + y * imageData.width) * 4;
      let rgb = {
        r: imageData.data[index + 0],
        g: imageData.data[index + 1],
        b: imageData.data[index + 2],
      };
      let hsl = rgbToHsl(
        imageData.data[index + 0],
        imageData.data[index + 1],
        imageData.data[index + 2]
      );
      hsl.l += 0.1;
      rgb = hslToRgb(hsl.h, hsl.s, hsl.l);

      setPixel(imageData, rgb.r, rgb.g, rgb.b, index);
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

//pasaja de RGB a HSL
function rgbToHsl(r, g, b) {
  (r /= 255), (g /= 255), (b /= 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: h,
    s: s,
    l: l,
  };
}

//Pasaje de HSL a RGB
function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    var hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    'r': Math.round(r * 255),
    'g': Math.round(g * 255),
    'b': Math.round(b * 255),
  };
}


function aplicarBlur(e) {
  let image = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  let matriz = [[1,1,1],[1,1,1],[1,1,1]];
  let imgData = matrizConvolucion(image, matriz);
  ctx.putImageData(imgData, 0, 0);
}


//FILTRO DETECCION DE BORDES
function aplicarDeteccionBordes(e) {
  let matriz = [
                [-4,0,4],
                [-6,0,6],
                [-4,0,4]
              ];
  aplicarEscalaGrises();
  let image = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  let imgData = matrizConvolucion(image, matriz);
  ctx.putImageData(imgData, 0, 0);
}


function matrizConvolucion(imagen, matriz) {   
  let imgRetorno = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
  
  let x = 0;
  let y = 0;
  let a = 0;
  let b = 0;
  let color = "";

  let sumaR = 0;
  let sumaG = 0;
  let sumaB = 0;
  let factor = 9;

  for (x = 1; x < imagen.width -1; x++) {
    for (y = 1; y < imagen.height -1; y++) {
      sumaR = 0;
      sumaG = 0;
      sumaB = 0;

      for (a = -1; a < 2; a++) {
        for (b = -1; b < 2; b++) {
          
          color = getPixel(imagen,(x+a),(y+b));
          sumaR = sumaR + (color.r * matriz[a+1][b+1]);
          sumaG = sumaG + (color.g * matriz[a+1][b+1]);
          sumaB = sumaB + (color.b * matriz[a+1][b+1]);
        }
      }
      sumaR = sumaR/factor;
      sumaG = sumaG/factor;
      sumaB = sumaB/factor;
      
      if(sumaR > 255){
        sumaR = 255;
      } else if (sumaR < 0){
        sumaR = 0;
      }

      if(sumaG > 255){
        sumaG = 255;
      } else if (sumaG < 0){
        sumaG = 0;
      }

      if(sumaB > 255){
        sumaB = 255;
      } else if (sumaB < 0){
        sumaB = 0;
      }
      let index = (x + y * imgRetorno.width) * 4;
      setPixel(imgRetorno, sumaR, sumaG, sumaB, index);
    }
  }

  return imgRetorno;
}







