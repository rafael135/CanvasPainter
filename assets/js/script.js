let currentColor = 'black';
let canDraw = false; // Controla se o desenho pode ser feito

// Ferramenta ativa
let currentTool = "brush";

// Posição do mouse anterior
let mouseX = 0;
let mouseY = 0;


// Tamanho da imagem
let canvasWidth = 1200;
let canvasHeight = 650;

// Grossura do pincel
let brushWidth = 5;

let canvasElement = document.getElementById("canvas"); // Elemento canvas
let canvasCtx = canvasElement.getContext("2d"); // Contexto do canvas


// Selecionador de cores
const pickr = Pickr.create({
    el: '.color.custom',
    theme: 'monolith', // or 'monolith', or 'nano'

    swatches: [
        'rgba(244, 67, 54, 1)',
        'rgba(233, 30, 99, 0.95)',
        'rgba(156, 39, 176, 0.9)',
        'rgba(103, 58, 183, 0.85)',
        'rgba(63, 81, 181, 0.8)',
        'rgba(33, 150, 243, 0.75)',
        'rgba(3, 169, 244, 0.7)',
        'rgba(0, 188, 212, 0.7)',
        'rgba(0, 150, 136, 0.75)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(139, 195, 74, 0.85)',
        'rgba(205, 220, 57, 0.9)',
        'rgba(255, 235, 59, 0.95)',
        'rgba(255, 193, 7, 1)'
    ],

    components: {

        // Main components
        preview: true,
        opacity: false,
        hue: true,

        // Input / output Options
        interaction: {
            hex: true,
            rgba: false,
            hsla: false,
            hsva: false,
            cmyk: false,
            input: true,
            clear: true,
            save: true
        }
    }
});

// Evento quando a cor é selecionada
pickr.on("save", (color) => {
    currentColor = color.toHEXA().toString();
    pickr.hide();
});

pickr.on("show", () => {
    if(document.querySelector(".colors .active") != null) {
        document.querySelector(".colors .active").classList.remove("active");
    }
});



document.querySelectorAll(".colors .color").forEach((item) => {
    item.addEventListener("click", colorChange);
});

canvasElement.addEventListener("mousedown", mouseDownCanvas);
canvasElement.addEventListener("mousemove", mouseMoveCanvas);
canvasElement.addEventListener("mouseup", mouseUpCanvas);

document.getElementById("clear").addEventListener("click", clearCanvas);
document.getElementById("print").addEventListener("click", printCanvas);

document.getElementById("line-width").addEventListener("change", (e) => {
    let width = e.target.value;
    alterLineWidth(parseInt(width));
});

document.querySelectorAll(".tools .tool").forEach((tool, indx) => {
    tool.addEventListener("click", (e) => {
        toolChange(e, indx);
    });
});


adjustCanvas();


// Ajusta o tamanho do canvas para que o pincel não preencha errado
function adjustCanvas() {
    canvasElement.setAttribute("width", canvasElement.offsetWidth);
    canvasElement.setAttribute("height", canvasElement.offsetHeight);
}


function printCanvas(e) {
    let link = document.createElement("a");

    link.download = "canvasImage";

    let img = new Image(canvasWidth, canvasHeight);
    img.src = canvasElement.toDataURL("image/png");

    link.href = img.src;

    // Ativo o evento de click do link
    if(document.createEvent) {
        e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, true, window,
         0, 0, 0, 0, 0, false, false, false, false, 0, null);

         link.dispatchEvent(e);

    } else if(link.fireEvent) {
        link.fireEvent("onclick");
    }
}


// Funcao para alterar a grossura do pincel ou borracha
function alterLineWidth(width) {
    brushWidth = width;
}

function toolChange(e, indx) {
    if(indx === 3 || indx === 4){
        return;
    }

    let selectedTool = e.target.getAttribute("data-tool");
    document.querySelector(".tool.active").classList.remove("active");
    
    if(e.target.tagName == "svg" || e.target.tagName == "path") {
        selectedTool = e.target.closest(".tool").getAttribute("data-tool");
        e.target.closest(".tool").classList.add("active");
    } else {
        e.target.classList.add("active");
    }
    
    currentTool = selectedTool;
    changeIcon(currentTool);
}

// Funcao para mudar a cor
function colorChange(e) {
    let selectedColor = e.target.getAttribute("data-color"); // Pego a cor definida no atributo 'data-color' da cor selecionada
    currentColor = selectedColor; // Defino a cor atual como a cor selecionada

    if(document.querySelector(".color.active") === null) {
        e.target.classList.add("active");
    } else {
        document.querySelector(".color.active").classList.remove("active"); // Removo o status ativo da cor anterior
    
        e.target.classList.add("active"); // Adiciono o status ativo a cor selecionada
        //console.log(selectedColor);
    }
    
}

function changeIcon(iconName) {
    canvasElement.style.cursor = `url("assets/img/${iconName}.svg"), auto`;
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
    let pointY = y - canvasElement.offsetTop + 24; // 24 para ajeitar o icone do cursor

    //console.log(pointX, pointY);

    canvasCtx.beginPath(); // Inicia o desenho
    canvasCtx.lineJoin = "round"; // Tipo de linha a ser desenhado
    canvasCtx.moveTo(mouseX, mouseY);  // Posicao inicial do desenho
    canvasCtx.lineTo(pointX, pointY); // Posicao final do desenho
    canvasCtx.closePath(); // 'Fecha' o desenho
    if(currentTool === "brush") {
        canvasCtx.globalCompositeOperation = "source-over";
        canvasCtx.lineWidth = brushWidth; // Define a grossura do pincel ou borracha
        canvasCtx.strokeStyle = currentColor;
    } else if(currentTool === "eraser") {
        canvasCtx.globalCompositeOperation = "destination-out";
        canvasCtx.lineWidth = brushWidth;
    }

    canvasCtx.strokeStyle = currentColor; // Define a cor do desenho
    canvasCtx.stroke(); // Termina o desenho e insere no canvas

    canvasCtx.globalCompositeOperation = "source-over";
    
    // Guardo as coordenadas antigas do mouse para que o desenho continue
    mouseX = pointX;
    mouseY = pointY;
}

// Funcao para limpar qualquer conteudo do canvas
function clearCanvas() {
    canvasCtx.setTransform(1, 0, 0, 1, 0, 0);
    canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
}



function colorPicker() {
    
}