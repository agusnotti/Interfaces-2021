class Objeto {
    constructor(posX,posY,nombre) {
        this.posX = posX;
        this.posY = posY;
        this.nombre = nombre;
        this.objeto = document.createElement('div');
        this.objeto.classList.add(nombre);
        this.background = document.getElementById('parallax-background');
        this.background.append(this.objeto);
        this.setPosicionObjeto();
    }

    getObjeto(){
        return this.objeto;
    }

    setPosicionObjeto(){
        let objeto  = this.getObjeto();
        objeto.style.left = this.posX+'px';
        objeto.style.bottom = this.posY+'px';
    }

    setPosX(posX) {
        this.posX = posX;
    }

    setPosY(posY) {
        this.posY = posY;
    }

    getPosicionObjeto(){
        return {
            'posX': this.getObjeto().getBoundingClientRect().x,
            'posY': this.posY
        };
    }

    //DIMENSIONES PARA DETERMINAR LA COLISION. NO SON LAS DIMENSIONES REALES DE LOS OBJETOS
    getDimensiones(){
        let width = 0;
        let height = 0;

        if(this.nombre == 'tiburon'){
            width = 150;
            height = 125;
        }

        if(this.nombre == 'aguaviva'){
            width = 133;
            height = 140;
        }

        if(this.nombre == 'ostra'){
            width = 120;
            height = 120;
        }

        return {
            'width': (width/2),
            'height': (height/2) 
        };
    }

    getNombre(){
        return this.nombre;
    }
}