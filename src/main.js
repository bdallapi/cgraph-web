import * as PIXI from 'pixi.js';
import tones from './tones';

const app = new PIXI.Application({
    autoResize: true,
    resolution: devicePixelRatio
});

document.querySelector("#tonesPlane").appendChild(app.view);

PIXI.Loader.shared.add("assets/tones.png").load(setup);

function toneSprite(toneEnum) {
    let main2Row = {
        "C": 0,
        "D": 1,
        "E": 2,
        "F": 3,
        "G": 4,
        "A": 5,
        "B": 6
    }
    let alt2Col = {
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
    let toneC = toneSprite(tones.C);
    toneC.position.set(0, 0);
    app.stage.addChild(toneC);
    app.renderer.render(app.stage);
}

window.addEventListener('resize', resize);

function resize() {
    // Get the p
    const parent = app.view.parentNode;

    // Resize the renderer
    app.renderer.resize(parent.clientWidth, parent.clientHeight);

    // You can use the 'screen' property as the renderer visible
    // area, this is more useful than view.width/height because
    // it handles resolution
    //rect.position.set(app.screen.width, app.screen.height);
}

resize();