import * as PIXI from 'pixi.js';

const ToneSprite = {
    asset: "assets/tones.png",
    create: function (toneEnum, resources) {
        const main2Row = {
            "C": 0,
            "D": 1,
            "E": 2,
            "F": 3,
            "G": 4,
            "A": 5,
            "B": 6
        }
        let pixSize = 64;
        const alt2Col = function (alt, act) {
            switch (alt) {
                case "f":
                    return act;
                case "":
                    return 2 + act;
                case "s":
                    return 4 + act;
            }
        }
        let passiveTexture = resources["assets/tones.png"].texture.clone();
        let activeTexture = passiveTexture.clone();
        passiveTexture.frame = new PIXI.Rectangle(alt2Col(toneEnum.alt, false) * pixSize, main2Row[toneEnum.main] * pixSize, pixSize, pixSize);
        activeTexture.frame = new PIXI.Rectangle(alt2Col(toneEnum.alt, true) * pixSize, main2Row[toneEnum.main] * pixSize, pixSize, pixSize);

        let s = new PIXI.Sprite(passiveTexture);
        s.passive = passiveTexture;
        s.active = activeTexture;
        s.interactive = true;
        s.on('pointerover', onPointerOver).on('pointerout', onPointerOut);
        return s;
    }
}

function onPointerOver() {
    this.texture = this.active;
}

function onPointerOut() {
    this.texture = this.passive;
}

export default ToneSprite;