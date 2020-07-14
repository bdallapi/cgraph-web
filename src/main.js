import * as PIXI from 'pixi.js';

const app = new PIXI.Application({
    autoResize: true,
    resolution: devicePixelRatio
});

document.querySelector("#tonesPlane").appendChild(app.view);

const rect = new PIXI.Graphics()
    .beginFill(0xff0000)
    .drawRect(-100, -100, 100, 100);

app.stage.addChild(rect);

window.addEventListener('resize', resize);

function resize() {
    // Get the p
    const parent = app.view.parentNode;

    // Resize the renderer
    app.renderer.resize(parent.clientWidth, parent.clientHeight);

    // You can use the 'screen' property as the renderer visible
    // area, this is more useful than view.width/height because
    // it handles resolution
    rect.position.set(app.screen.width, app.screen.height);
}

resize();