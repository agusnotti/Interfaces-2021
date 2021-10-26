class Obstaculo {
    constructor(posX,posY,nombre) {
        this.posX = posX;
        this.posY = posY;
        this.nombre = nombre;
        this.obstaculo = document.createElement('div');
        this.obstaculo.classList.add(nombre);
        this.background = document.getElementById('parallax-background');
        this.background.append(this.obstaculo);
        this.setPosicionObstaculo();
    }

    getObstaculo(){
        return this.obstaculo;
    }

    setPosicionObstaculo(){
        let obstaculo = this.getObstaculo();
        obstaculo.style.left = this.posX+'px';
        obstaculo.style.bottom = this.posY+'px';
    }

    getPosicionObstaculo(){
        return {
            'posX': this.posX,
            'posY': this.posY 
        };
    }

    getDimensiones(){
        let width = 235-20;
        let height = 125-20;

        if(this.nombre == 'aguaviva'){
            width = 133-60;
            height = 130-10;
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