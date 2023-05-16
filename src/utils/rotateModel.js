
let mouseDown = false,
    mouseX = 0,
    mouseY = 0;

let model;

function onMouseMove(event) {
    if (!mouseDown) {
        return;
    }

    event.preventDefault();

    const clientX = event?.touches && event?.touches[0]?.clientX ? event.touches[0].clientX : event.clientX
    const clientY = event?.touches && event?.touches[0]?.clientY ? event.touches[0].clientY : event.clientY

    var deltaX = clientX - mouseX;
    var deltaY = clientY - mouseY;
    mouseX = clientX;
    mouseY = clientY;
    rotateScene(deltaX, deltaY);
}

function onMouseDown(event) {
  event.preventDefault();

  const clientX = event?.touches && event?.touches[0]?.clientX ? event.touches[0].clientX : event.clientX
  const clientY = event?.touches && event?.touches[0]?.clientY ? event.touches[0].clientY : event.clientY

  mouseDown = true;
  mouseX = clientX;
  mouseY = clientY;
}

function onMouseUp(event) {
    event.preventDefault();
    mouseDown = false;
}

function rotateScene(deltaX, deltaY) {
    model.rotation.y += deltaX / 100;
    model.rotation.x += deltaY / 100;
}

export function setModel(newModel) {
    model = newModel
}

export function addMouseHandler(canvas) {
    canvas.addEventListener('mousemove', function (e) {
        onMouseMove(e);
    }, false);
    canvas.addEventListener('mousedown', function (e) {
        onMouseDown(e);
    }, false);
    canvas.addEventListener('mouseup', function (e) {
        onMouseUp(e);
    }, false);

    canvas.addEventListener('touchmove', function (e) {
        onMouseMove(e);
    }, false);
    canvas.addEventListener('touchstart', function (e) {
        onMouseDown(e);
    }, false);
    canvas.addEventListener('touchend', function (e) {
        onMouseUp(e);
    }, false);
}

