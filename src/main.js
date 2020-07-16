import * as PIXI from 'pixi.js';
import tones from './tones';
import TonesPlane from './TonesPlane';

var app = new PIXI.Application({
    autoResize: true,
    resolution: devicePixelRatio
});

document.querySelector("#tonesPlane").appendChild(app.view);

PIXI.Loader.shared.add("assets/tones.png").load(setup);

function toneSpriteProvider(toneEnum) {
    const main2Row = {
        "C": 0,
        "D": 1,
        "E": 2,
        "F": 3,
        "G": 4,
        "A": 5,
        "B": 6
    }
    const alt2Col = {
        "f": 0,
        "": 1,
        "s": 2
    }
    let pixSize = 64;
    let texture = PIXI.utils.TextureCache["assets/tones.png"];
    let rect = new PIXI.Rectangle(alt2Col[toneEnum.alt] * pixSize, main2Row[toneEnum.main] * pixSize, pixSize, pixSize);
    texture.frame = rect;
    return new PIXI.Sprite(texture);
}

function setup() {
    let plane = TonesPlane.create(tones.sharpSelection, app.screen.height / app.screen.width, toneSpriteProvider);
    plane.container.position.set(app.screen.width / 2, app.screen.height / 2);
    app.stage.addChild(plane.container);
    app.renderer.render(app.stage);
}

window.addEventListener('resize', resize);

function resize() {
    // Get the p
    const parent = app.view.parentNode;

    // Resize the renderer
    app.renderer.resize(parent.clientWidth, parent.clientHeight);
}

resize();