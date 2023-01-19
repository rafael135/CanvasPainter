let currentColor = 'black';
let canDraw = false; // Controla se o desenho pode ser feito
// Posição do mouse anterior
let mouseX = 0;
let mouseY = 0;

let canvasElement = document.getElementById("canvas");
let canvasCtx = canvasElement.getContext("2d");



document.querySelectorAll(".colors .color").forEach((item) => {
    item.addEventListener("click", colorChange);
});

canvasElement.addEventListener("mousedown", mouseDownCanvas);
canvasElement.addEventListener("mousemove", mouseMoveCanvas);
canvasElement.addEventListener("mouseup", mouseUpCanvas);

document.getElementById("clear").addEventListener("click", clearCanvas);




function colorChange(e) {
    let selectedColor = e.target.getAttribute("data-color");
    currentColor = selectedColor;

    document.querySelector(".color.active").classList.remove("active");
    e.target.classList.add("active");
    //console.log(selectedColor);
}

function mouseDownCanvas(e) {
    canDraw = true;
    mouseX = e.pageX - canvasElement.offsetLeft;
    mouseY = e.pageY - canvasElement.offsetTop;
}

function mouseMoveCanvas(e) {
    if(canDraw === true) {
        drawOnCanvas(e.pageX, e.pageY);
    }
}

function mouseUpCanvas() {
    canDraw = false;
}

// Funcao para desenhar no canvas
function drawOnCanvas(x, y) {
    let pointX = x - canvasElement.offsetLeft;
    let pointY = y - canvasElement.offsetTop;

    //console.log(pointX, pointY);

    canvasCtx.beginPath();
    canvasCtx.lineWidth = 5;
    canvasCtx.lineJoin = "round";
    canvasCtx.moveTo(mouseX, mouseY);
    canvasCtx.lineTo(pointX, pointY);
    canvasCtx.closePath();
    canvasCtx.strokeStyle = currentColor;
    canvasCtx.stroke();

    mouseX = pointX;
    mouseY = pointY;
}

// Funcao para limpar qualquer conteudo do canvas
function clearCanvas() {
    canvasCtx.setTransform(1, 0, 0, 1, 0, 0);
    canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
}