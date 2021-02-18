class CirclesIntersection {
    constructor() { // общие для всех свойства
        this.circleStrokeColor = `white`; // одинаковая обводка для всех кругов
        this.intersectionFillColor = `#666677`; // серый
        this.intersectionStrokeColor = `white`;
        this.circleSpeed = 0.3;
    }

    init() { // вызов функций
        this.createCanvas();
        this.setCanvasSize();
        this.createCircles();
        this.updateAnimation();

        window.addEventListener(`resize`, () => {
            this.setCanvasSize();
            this.createCircles();
            this.updateAnimation();
        });
    }

    createCanvas() {
        this.cnv = document.createElement('canvas');
        this.cnv.style.background = this.getRandomColor();
        this.ctx = this.cnv.getContext('2d');
        document.body.appendChild(this.cnv); // создание элемента динамически
    }

    getRandomColor(alpha = 1) {
        return `hsla(${Math.random() * 360}, 70%, 50%, ${alpha})`; // цвет просто
    }

    setCanvasSize() {
        this.w = this.cnv.width = innerWidth; // весь экран
        this.h = this.cnv.height = innerHeight;
    }

    createCircles() {
        let smallerSide = Math.min(this.w, this.h); // подстраивает размер кргуов от размера экрана
        let biggerSide = Math.max(this.w, this.h);
        let maxRadius = smallerSide / 3;
        let minRadius = maxRadius / 2;
        let circlesNum = 4 * (2 - smallerSide / biggerSide); //от 4 до 8 кругов в зависимоти от соотношения сторон
        this.intersectionDotRadius = minRadius / 10;

        this.circles = []; // созд массив и наполняем его объекта используя цикл
        for (let i = 0; i < circlesNum; ++i) {
            let randonAngle = Math.random() * (Math.PI * 2); // ! случайное направление к точке на окружности
            let newCircle = {
                color: this.getRandomColor(0.5), // полупрозрачный случайный
                radius: this.getRandomFromRange(minRadius, maxRadius),
                xPos: this.getRandomFromRange(maxRadius, this.w - maxRadius), // кргу не выходит за границы экрана
                yPos: this.getRandomFromRange(maxRadius, this.h - maxRadius),
                velocityX: Math.cos(randonAngle), // вдижение по х. преобразование в радианы
                velocityY: Math.sin(randonAngle),
            }
            this.circles.push(newCircle); // добавляем объекты в массив + вызов В INIT
            
        }
    }

    getRandomFromRange(min, max) { // получить случайное число в диапазоне (!)
        return Math.random() * (max - min) + min;
    }

    updateCircles() {
        this.ctx.globalCompositeOperation = `color-dodge`; // меняет свойство наложеий форм

        this.circles.forEach(circle => { // перебирает массив и рисует круги
            if (circle.xPos + circle.radius > this.w && circle.velocityX > 0 || circle.xPos < circle.radius && circle.velocityX < 0) {
                circle.velocityX = -circle.velocityX; // если выходит за рамки меняем скорость на обратную
            }
            if (circle.yPos + circle.radius > this.h && circle.velocityY > 0 || circle.yPos < circle.radius && circle.velocityY < 0) {
                circle.velocityY = -circle.velocityY; // если выходит за рамки меняем скорость на обратную
            }

            circle.xPos += circle.velocityX * this.circleSpeed; // задаём  случайное движение (число)
            circle.yPos += circle.velocityY * this.circleSpeed;
            
            this.drawCircle(circle.xPos, circle.yPos, circle.radius, circle.color, this.circleStrokeColor);
        });

        this.ctx.globalCompositeOperation = `normal`;
    }

    drawCircle(x, y, radius, fillColor, strokeColor) {
        this.ctx.fillStyle = fillColor;
        this.ctx.strokeStyle = strokeColor;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
    }

    getIntersection() {
        for (let i = 0; i < this.circles.length; ++i) {
            let circleA = this.circles[i];
            for (let j = i+1; j < this.circles.length; ++j) {
                let circleB = this.circles[j];

                let dx = circleB.xPos - circleA.xPos; // вычисление расстояние между двумя центрами окружностей
                let dy = circleB.yPos - circleA.yPos; // два расстоянияю. разница по x и y

                let distance = Math.hypot(dx,dy); // вычисляем третье  по теореме пифагора

                if (distance <= circleA.radius + circleB.radius) { //проверяем на столкновение
                    this.drawIntersection(circleA.radius, circleB.radius, distance, dx, dy, circleA);
                }
            }
        }
    }

    drawIntersection(sideA, sideB, sideC, dx, dy, circle) {
        let aSquare = Math.pow(sideA, 2);
        let bSquare = Math.pow(sideB, 2);
        let cSquare = Math.pow(sideC, 2);

        let cosineA = (aSquare - bSquare + cSquare) / (sideA * sideC * 2); // по теореме косинусов
        let angleOfRotation = Math.acos(cosineA); // перевод в радианы
        let angleCorrection = Math.atan2(dy, dx); // угол наклона относительно х. тангенс = отношение y к х

        let pointOneX = circle.xPos + Math.cos(angleCorrection - angleOfRotation) * sideA; // две точки верхнее переcечение
        let pointOneY = circle.yPos + Math.sin(angleCorrection - angleOfRotation) * sideA;
        let pointTwoX = circle.xPos + Math.cos(angleCorrection + angleOfRotation) * sideA; // две нижнего
        let pointTwoY = circle.yPos + Math.sin(angleCorrection + angleOfRotation) * sideA;

        this.drawCircle(pointOneX,pointOneY, this.intersectionDotRadius, this.intersectionFillColor, this.intersectionStrokeColor);
        this.drawCircle(pointTwoX,pointTwoY, this.intersectionDotRadius, this.intersectionFillColor, this.intersectionStrokeColo);

    }
    clearCanvas(){
        this.ctx.clearRect(0, 0, this.w, this.h);
    }

    updateAnimation() { // эту в инит вызываем
        this.clearCanvas(); // очистка до обновления
        this.updateCircles(); // вызываем функцию рисования кргуов
        this.getIntersection(); // отрисовка пересечейний

        window.requestAnimationFrame(()=> this.updateAnimation()); // зацикливаем функцию
    }
}

window.onload = () => { // вызов всего по загрузке
    new CirclesIntersection().init();
    new CirclesIntersection().init(); // клоны
    new CirclesIntersection().init();
};