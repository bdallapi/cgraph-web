import * as PIXI from 'pixi.js';

var tonesPlaneDiv = document.getElementById("tonesPlane");

const app = new PIXI.Application({
    height: tonesPlaneDiv.offsetHeight,
    width: tonesPlaneDiv.offsetWidth
});

document.getElementById("tonesPlane").appendChild(app.view);