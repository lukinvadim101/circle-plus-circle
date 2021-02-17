class CirclesIntersection {
    init() { // вызов функций
        this.createCanvas();
        this.setCanvasSize();

        window.addEventListener (`resize`, ()=> {
            this.setCanvasSize();
        });
    }
    createCanvas() {
        this.cnv = document.createElement('canvas');
        this.cnv.style.background = this.getRandomColor();
        this.ctx = this.cnv.getContext('2d');
        document.body.appendChild(this.cnv); // создание элемента динамически
    }
    getRandomColor(alpha = 1){
        return `hsla(${Math.random() * 360}, 70%, 50%, ${alpha})`; // цвет просто
    }
    setCanvasSize(){
        this.w = this.cnv.width = innerWidth; // весь экран
        this.h = this.cnv.height = innerHeight;
    }
    
}
window.onload = () => { // вызов всего по загрузке
    new CirclesIntersection().init();
}
