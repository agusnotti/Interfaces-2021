class Avatar {

    constructor(posX, posY){
        this.avatar = document.createElement('div');
        this.avatar.id = "avatar";
        this.avatar.classList.add('jugando');
        this.background = document.getElementById('parallax-background');
        this.background.append(this.avatar);
        this.posX = posX;
        this.posY = posY;
        this.setPosicionAvatar()
        this.movimientoJugador = 15;
    }

    moverVertical(direccion){                  
        if (direccion === "ArrowUp") 
            this.posY += this.movimientoJugador;
        else if(direccion === "ArrowDown")
            this.posY -= this.movimientoJugador;
        this.setPosicionAvatar();
    }

    moverHorizontal(direccion){
        if(direccion === "ArrowLeft")
            this.posX -= this.movimientoJugador;
        else if (direccion === "ArrowRight")
            this.posX += this.movimientoJugador;
        this.setPosicionAvatar();
    }
    
    moverAvatar(direccion){
        if((direccion === "ArrowUp") || (direccion === "ArrowDown")){
            this.moverVertical(direccion);
        } else {
            this.moverHorizontal(direccion)
        }
    }

    setPosicionAvatar(){
        let avatar = document.getElementById('avatar');
        avatar.style.left = this.posX+'px';
        avatar.style.bottom = this.posY+'px';
        console.log(this.posX);
        console.log(this.posY);
    }

    getAvatar(){
        return this.avatar;
    }

    getPosicionAvatar(){
        return {
            'posX': this.getAvatar().getBoundingClientRect().x,
            'posY': this.posY 
        };
    }

    getMovimiento() {
        return this.movimientoJugador;
    }

    getDimensiones(){
        return {
            'width': 100/2,
            'height': 60/2
        };
    }
}