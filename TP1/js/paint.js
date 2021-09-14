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

iniciarFiltros();
activarColor();

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

//Asignacion de evento del lapiz
lapiz.addEventListener("click", (e) => {
  lapiz.classList.toggle("active");
  containerColores.classList.toggle("active");
  if (goma.classList.contains("active")) {
    goma.classList.remove("active");
  }
});

//Asigancion de evento de la goma
goma.addEventListener("click", (e) => {
  goma.classList.toggle("active");
  if (lapiz.classList.contains("active")) {
    lapiz.classList.remove("active");
    containerColores.classList.remove("active");
  }
});

/**
 * Se agregan los eventos para activar el color para dibujar con el lapiz.
 */
function activarColor() {
  colores.forEach((color) => {
    color.addEventListener("click", (e) => {
      desactivarColor();
      color.classList.add("active");
    });
  });
}

/**
 * Se remueve la clase 'active' del color. 
 */
function desactivarColor() {
  colores.forEach((color) => {
    if (color.classList.contains("active")) {
      color.classList.remove("active");
    }
  });
}

/**
 * Se obtiene el color que se encuentra activo.
 */
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

/**
 * Capta el evento cuando se hace click para empezar a dibujar
 */
canvas.addEventListener("mousedown", (e) => {
  if (lapiz.classList.contains("active") || goma.classList.contains("active")) {
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = true;
  }
});

/**
 * Capta el evento del movimiento del mouse para dibujar de manera dinamica.
 */
canvas.addEventListener("mousemove", (e) => {
  if (isDrawing === true) {
    drawLine(e);
  }
});

/**
* Capta el evento cuando se deja de hacer click para dejar de dibujar
*/
canvas.addEventListener("mouseup", (e) => {
  if (isDrawing === true) {
    drawLine(e);
    x = 0;
    y = 0;
    isDrawing = false;
  }
});

/**
 * Obtiene el contexto y dibuja una linea teniendo en cuenta un punto inicial y un punto final.
 */
function drawLine(e) {
  ctx.beginPath();
  ctx.strokeStyle = obtenerColorActivo(); 
  ctx.lineWidth = 3; 
  ctx.moveTo(x, y);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.closePath();

  x = e.offsetX;
  y = e.offsetY;
}

// FUNCIONALIDAD SUBIR, DESCARGAR Y BORRAR CANVAS
let btnDescargarImg = document.getElementById("descargar");
let btnSubirImg = document.getElementById("subirImagen");
let seleccionarImagen = document.getElementById("seleccionarImagen");
let borrarCanvas = document.getElementById("nuevoProyecto");

/** 
 * Captura de eventos al hacer en los botones para subir, descargar o borrar lienzo
*/
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

/**
 * Sube una imagen y renderiza en base a las dimensiones del canvas.
 */
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

    dibujarImagen(imagen,ctx);
    cargarFiltros(imagen);
  };
}


//FILTROS

/**
 * Agrega una imagen por defecto a los filtros.
 */
function iniciarFiltros() {
 let imagen = new Image();
 imagen.src = 'images/filtros.jpg';
 imagen.onload = function(){
   cargarFiltros(imagen);
 }
}

/**
 * Al cargar una imagen, renderiza en la seccion de filtros una vista previa con los filtros aplicados.
 */
function cargarFiltros(imagen) {  
  let filtrosCanvas = document.querySelectorAll('.filtrosCanvas');
  let canvasInicial = document.getElementById('inicial');
  let imagenMiniatura = imagen;
  let canvasHeight = canvasInicial.height;
  let canvasWidth = canvasInicial.width;
  imagenMiniatura.src = imagen.src;
  imagenMiniatura.onload = function () {
    if (imagenMiniatura.height > canvasHeight) {
      let proporcionAjusteImg = (canvasHeight / imagenMiniatura.height) * 100;
      imagenMiniatura.height = (proporcionAjusteImg * imagenMiniatura.height) / 100;
      imagenMiniatura.width = (proporcionAjusteImg * imagenMiniatura.width) / 100;
    }

    if (imagenMiniatura.width > canvasWidth && imagenMiniatura.width > imagenMiniatura.height) {
      let proporcionAjusteImg = (canvasWidth / imagenMiniatura.width) * 100;
      imagenMiniatura.height = (proporcionAjusteImg * imagenMiniatura.height) / 100;
      imagenMiniatura.width = (proporcionAjusteImg * imagenMiniatura.width) / 100;
    }

    filtrosCanvas.forEach(filtroCanvas => {
      let filtro = filtroCanvas.id;
      let contexto = filtroCanvas.getContext("2d");
      contexto.clearRect(0, 0, canvasWidth, canvasHeight);
      dibujarImagen(imagenMiniatura,contexto);
      switch (filtro) {
        case 'negativo': 
        aplicarNegativo(contexto, canvasHeight, canvasWidth);
        break;

        case 'sepia': 
        aplicarSepia(contexto, canvasHeight, canvasWidth);
        break;

        case 'binario': 
        aplicarBinario(contexto, canvasHeight, canvasWidth);
        break;

        case 'brillo': 
        aplicarBrillo(contexto, canvasHeight, canvasWidth);
        break;

        case 'escalaGrises': 
        aplicarEscalaGrises(contexto, canvasHeight, canvasWidth);
        break;

        case 'blur': 
        aplicarBlur(contexto, canvasHeight, canvasWidth);
        break;

        case 'deteccionBordes': 
        aplicarDeteccionBordes(contexto, canvasHeight, canvasWidth);
        break;
      
        default:
          break;
      }
    });
  };
}

/**
 * Renderiza la imagen en el canvas.
 */
function dibujarImagen(imagen, contexto) {
  contexto.drawImage(imagen, 0, 0, imagen.width, imagen.height);
}

//EVENTOS PARA CARGAR Y APLICAR FILTROS
let btnFiltros = document.getElementById("filtros");
let containerFiltros = document.getElementById("container-filtros");

btnFiltros.addEventListener("click", (e) => {
  btnFiltros.classList.toggle("active");
  containerFiltros.classList.toggle("active");
});

let inicial = document.getElementById("inicial");
inicial.addEventListener("click", e => {
  deshacerFiltro(ctx, imagen);
});

let negativo = document.getElementById("negativo");
negativo.addEventListener("click", e => {
  aplicarNegativo(ctx, canvasHeight, canvasWidth);
});

let sepia = document.getElementById("sepia");
sepia.addEventListener("click", e => {
  aplicarSepia(ctx, canvasHeight, canvasWidth);
});

let binario = document.getElementById("binario");
binario.addEventListener("click", e => {
  aplicarBinario(ctx, canvasHeight, canvasWidth);
});

let brillo = document.getElementById("brillo");
brillo.addEventListener("click", e => {
  aplicarBrillo(ctx, canvasHeight, canvasWidth);
});

let escalaGrises = document.getElementById("escalaGrises");
escalaGrises.addEventListener("click", e => {
  aplicarEscalaGrises(ctx, canvasHeight, canvasWidth);
});

let blur = document.getElementById("blur");
blur.addEventListener("click", e => {
  aplicarBlur(ctx, canvasHeight, canvasWidth);
});

let deteccionBordes = document.getElementById("deteccionBordes");
deteccionBordes.addEventListener("click", e => {
  aplicarDeteccionBordes(ctx, canvasHeight, canvasWidth);
});


/**
 * Alamacena los valores r, g, b y a del de un pixel 
 */
function setPixel(imageData, r, g, b, index) {
  imageData.data[index + 0] = r;
  imageData.data[index + 1] = g;
  imageData.data[index + 2] = b;
  imageData.data[index + 3] = 255;
}

/**
 * Obtiene los valores r,g,b y a de un pixel a partir de su coordenada x e y.
 */
function getPixel(imageData, x, y) {
  let index = (x + y * imageData.width) * 4;
  return {
    'r': imageData.data[index + 0],
    'g':imageData.data[index + 1],
    'b':imageData.data[index + 2],
    'a':imageData.data[index + 3]
  }
}

/**
 * Limpia los filtros aplicados a la imagen en el canvas
 */
function deshacerFiltro(ctx, img){
  let imagen = new Image();
  imagen.src = img.src
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

    dibujarImagen(imagen,ctx);
    cargarFiltros(imagen); 
  }
  //dibujarImagen(imagen,ctx);
}

/**
 * Aplica filtro escala de grises a un contexto (canvas) determinado.
 */
function aplicarEscalaGrises(contexto, heigth, width) {
  var imageData = contexto.getImageData(0, 0, width, heigth);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < heigth; y++) {
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
  contexto.putImageData(imageData, 0, 0);
}

/**
 * Aplica filtro de binarizacion a un contexto (canvas) determinado.
 */
function aplicarBinario(contexto, heigth, width) {
  var imageData = contexto.getImageData(0, 0, width, heigth);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < heigth; y++) {
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
  contexto.putImageData(imageData, 0, 0);
}

/**
 * Aplica filtro negativo a un contexto (canvas) determinado.
 */
function aplicarNegativo(contexto, height, width) {
  var imageData = contexto.getImageData(0, 0, width, height);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let index = (x + y * imageData.width) * 4;
      let r = 255 - imageData.data[index + 0];
      let g = 255 - imageData.data[index + 1];
      let b = 255 - imageData.data[index + 2];

      setPixel(imageData, r, g, b, index);
    }
  }
  contexto.putImageData(imageData, 0, 0);
}

/**
 * Aplica filtro sepia a un contexto (canvas) determinado.
 */
function aplicarSepia(contexto, heigth, width) {
  var imageData = contexto.getImageData(0, 0, width, heigth);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < heigth; y++) {
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
  contexto.putImageData(imageData, 0, 0);
}


/**
 * Aplica filtro de brillo a un contexto (canvas) determinado.
 */
function aplicarBrillo(contexto, heigth, width) {
  var imageData = contexto.getImageData(0, 0, width, heigth);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < heigth; y++) {
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
  contexto.putImageData(imageData, 0, 0);
}

/**
 * Realiza el pasaje de valores RGB a HSL 
 */
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
    'h': h,
    's': s,
    'l': l,
  };
}

/**
 * Realiza el pasaje de valores HSL a RGB 
 */
function hslToRgb(h, s, l) {
  let r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    let hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
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

/**
 * Aplica filtro Blur a un contexto (canvas) determinado. 
 */
function aplicarBlur(contexto, heigth, width) {
  let image = contexto.getImageData(0, 0, width, heigth);
  let matriz = [[1,1,1],[1,1,1],[1,1,1]];
  let imgData = matrizConvolucion(image, matriz, contexto, heigth, width);
  contexto.putImageData(imgData, 0, 0);
}


/**
 * Aplica filtro de deteccion de bordes a un contexto (canvas) determinado. 
 */
function aplicarDeteccionBordes(contexto, heigth, width) {
  let matriz = [
                [-4,0,4],
                [-6,0,6],
                [-4,0,4]
              ];
  aplicarEscalaGrises(contexto, heigth, width);
  let image = contexto.getImageData(0, 0, width, heigth);
  let imgData = matrizConvolucion(image, matriz,contexto, heigth, width);
  contexto.putImageData(imgData, 0, 0);
}

/**
 * Lleva a cabo el procesamiento de la imagen original (matriz) a partir de otra matriz mas pequeña
 * que al combinarlas da como resultado la transformacion de la imagen original (necesario para el blur 
 * y deteccion de bordes)
 */
function matrizConvolucion(imagen, matriz, contexto, heigth, width) {   
  let imgRetorno = contexto.getImageData(0, 0, width, heigth);
  
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