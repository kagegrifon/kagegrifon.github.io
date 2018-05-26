;(function() {
'use strict';

document.addEventListener('DOMContentLoaded', initial);

var exprNumber1,
    exprNumber2,
    solveNumber1,
    solveNumber2,
    exprResult,
    scale;

var canvas, ctx;

var PI = Math.PI;

var taskValue1, taskValue2;

var offsetPointX, 
    offsetPointY, 
    scaleStepLength;

function initial() {
    
    getDOMElements();
    
    setCanvasSize();
    
    setTaskValues();
    
    setOffsetPointValues();
    
    drawScale();
    
    drawArc(0, taskValue1);
    
    setInputPositions();
    
    setHandlers();
    
    solveNumber1.focus();
}

function getDOMElements() {
    exprNumber1 = document.getElementById('exprNumber1');
    exprNumber2=document.getElementById('exprNumber2');
    solveNumber1=document.getElementById('solveNumber1');
    solveNumber2=document.getElementById('solveNumber2');
    exprResult=document.getElementById('exprResult');
    scale = document.getElementById('scaleImg');
    canvas = document.getElementById('canvas');
    
    ctx = canvas.getContext('2d');
}

function setCanvasSize() {   
    canvas.width=canvas.parentNode.clientWidth;
    canvas.height=0.3*canvas.width;
}

function setTaskValues() {
    taskValue1 = getRandomValue(6, 9);
    taskValue2 = getRandomValue(11 - taskValue1, 14 - taskValue1);
    
    exprNumber1.innerHTML = taskValue1;
    exprNumber2.innerHTML = taskValue2;
}

function setOffsetPointValues() {
    offsetPointX = canvas.width*0.04;
    offsetPointY = canvas.height - scale.height/scale.width*canvas.width*0.75;
    scaleStepLength = 33.5;
}

function drawScale() {
    var scaleWindth = canvas.width;
    var scaleHeight = scale.height/scale.width*scaleWindth;
    ctx.drawImage(scale, 0, canvas.height - scaleHeight, scaleWindth, scaleHeight);    
}

function drawArc(startNum, length) {
    ctx.beginPath();
    var angleArc = PI/6;
    var circeCx = offsetPointX + (startNum + length/2)*33.5;
    var circeCy = offsetPointY + length/2*33.5*Math.tan(angleArc);
    var circleR = (length/2*33.5)/Math.cos(angleArc);
    ctx.strokeStyle = '#d163ab';
    ctx.lineWidth  = 3;
    ctx.arc(circeCx, circeCy, circleR, -angleArc, -(PI - angleArc), true);
    ctx.stroke();
    
    drawEndMarker(offsetPointX + (startNum + length)*33.5);
}

function drawEndMarker(PosX) {
    ctx.beginPath();
    ctx.strokeStyle = '#d163ab';
    ctx.lineWidth = 2;
    var arrowLength = 15;
    var deltaArrowAngle = 15;
    var scewAngle = 57;
    
    ctx.moveTo(PosX, offsetPointY);
    
    var arrowX = PosX - arrowLength*Math.cos((scewAngle - deltaArrowAngle)*PI/180);
    var arrowY = offsetPointY - arrowLength*Math.sin((scewAngle - deltaArrowAngle)*PI/180);
    ctx.lineTo(arrowX ,arrowY);
    
    ctx.moveTo(PosX, offsetPointY);
    
    arrowX = PosX - arrowLength*Math.sin(PI/2 - (scewAngle + deltaArrowAngle)*PI/180);
    arrowY = offsetPointY - arrowLength*Math.cos(PI/2 - (scewAngle + deltaArrowAngle)*PI/180);
    ctx.lineTo(arrowX, arrowY);

    ctx.stroke();
}

function setInputPositions() {
    solveNumber1.style.left = (offsetPointX/1.5 + taskValue1/2*33.5) + 'px';
    solveNumber1.style.top = (offsetPointY - 40 - taskValue1*9) + 'px';
    solveNumber2.style.left = (offsetPointX/1.5 + (taskValue1 + taskValue2/2)*33.5) + 'px';
    solveNumber2.style.top = (offsetPointY - 40 - taskValue2*9) + 'px';
}

function setHandlers() {
    solveNumber1.oninput = solveNumberHandler;
    solveNumber2.oninput = solveNumberHandler;
    exprResult.oninput = exprResultHandler;
}

function solveNumberHandler() {
    if (this.value.length == 0) {
        this.classList.remove('marked-text');
        return;
    }
    
    var trueAnswer;
    var hintBlock;
    var nextStep;
    var isTrueAnswer = false;
    
    if (this == solveNumber1) {
        trueAnswer = taskValue1;
        hintBlock = exprNumber1;
        nextStep = taskStep1;
    }
    
    if (this == solveNumber2) {
        trueAnswer = taskValue2;
        hintBlock = exprNumber2;
        nextStep = taskStep2;
    }
    
    isTrueAnswer = checkoutAnswer(this, hintBlock, trueAnswer);
    
    if (isTrueAnswer) nextStep();
}

function exprResultHandler() {
    var compareValue = taskValue1 + taskValue2;
    
    if (this.value.length < compareValue.toString().length) {
        exprResult.classList.remove('marked-text');
        return;
    }
    
    if (this.value == compareValue) {
        exprResult.classList.remove('marked-text');
        exprResult.setAttribute('readonly', 'readonly');
        exprResult.classList.add('input-readonly');
        
    } else {
        exprResult.classList.add('marked-text');
    }
}
    
function checkoutAnswer(input, hintBlock, trueAnswer) {
    if (input.value == trueAnswer) {
        hintBlock.classList.remove('marked-background');
        input.classList.remove('marked-text');
        input.setAttribute('readonly', 'readonly');
        input.classList.add('input-readonly');
        return true;
    } else {
        hintBlock.classList.add('marked-background');
        input.classList.add('marked-text');
    }
}

function taskStep1() {
    drawArc(taskValue1, taskValue2);
    solveNumber2.style.display = 'block';
    solveNumber2.focus();
}

function taskStep2() {
    exprResult.classList.remove('input-readonly');
    exprResult.removeAttribute('readonly');
    exprResult.value = '';
    exprResult.focus();
}

function getRandomValue(minValue, maxValue) {
    return Math.floor(Math.random()*(maxValue - minValue) + minValue + 0.5);
}

}());