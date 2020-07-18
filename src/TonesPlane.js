import * as PIXI from 'pixi.js';
import {
    Grid
} from './Grid';
import * as math from 'mathjs';

const TonesPlane = {
    grid: Grid.create(math.matrix([
        [0.5, -0.5],
        [0.5 * math.sqrt(3), 0.5 * math.sqrt(3)]
    ])),

    localWidth: 7.5,
    localScale: 1.0 / 192,
    asset: "assets/tones.png",

    unitCell: {
        size1: 3,
        size2: 4,
        toneValue: function (i, j) {
            if (i == 0 && j == 0) return 0;
            if (i == 1 && j == 0) return 4;
            if (i == 2 && j == 0) return 8;
            if (i == 0 && j == 1) return 9;
            if (i == 1 && j == 1) return 1;
            if (i == 2 && j == 1) return 5;
            if (i == 0 && j == 2) return 6;
            if (i == 1 && j == 2) return 10;
            if (i == 2 && j == 2) return 2;
            if (i == 0 && j == 3) return 3;
            if (i == 1 && j == 3) return 7;
            if (i == 2 && j == 3) return 11;
        }
    },

    worldToTransformedFrame: function (worldFrame) {
        const tl = math.floor(math.multiply(this.grid.inv, math.matrix([
            [worldFrame.x],
            [worldFrame.y]
        ])));
        const tr = math.floor(math.multiply(this.grid.inv, math.matrix([
            [worldFrame.x + worldFrame.width],
            [worldFrame.y]
        ])));
        const bl = math.floor(math.multiply(this.grid.inv, math.matrix([
            [worldFrame.x],
            [worldFrame.y + worldFrame.height]
        ])));
        const br = math.floor(math.multiply(this.grid.inv, math.matrix([
            [worldFrame.x + worldFrame.width],
            [worldFrame.y + worldFrame.height]
        ])));
        const min0 = math.min(tl.get([0, 0]), tr.get([0, 0]), bl.get([0, 0]), br.get([0, 0]));
        const max0 = math.max(tl.get([0, 0]), tr.get([0, 0]), bl.get([0, 0]), br.get([0, 0]));
        const min1 = math.min(tl.get([1, 0]), tr.get([1, 0]), bl.get([1, 0]), br.get([1, 0]));
        const max1 = math.max(tl.get([1, 0]), tr.get([1, 0]), bl.get([1, 0]), br.get([1, 0]));
        return new PIXI.Rectangle(min0, min1, max0 - min0 + 1, max1 - min1 + 1);
    },

    create: function (selection, aspect, resources) {
        var plane = Object.create(this);
        plane.selection = selection;
        plane.aspect = aspect;

        plane.localFrame = new PIXI.Rectangle(
            -this.localWidth / 2, -aspect * this.localWidth / 2,
            this.localWidth, aspect * this.localWidth);

        plane.container = new PIXI.Container();

        plane.spriteProvider = function (toneEnum, isActive) {
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
            let texture = resources["assets/tones.png"].texture.clone();
            let rect = new PIXI.Rectangle(alt2Col(toneEnum.alt, isActive) * pixSize, main2Row[toneEnum.main] * pixSize, pixSize, pixSize);
            texture.frame = rect;
            return new PIXI.Sprite(texture);
        }

        plane.populate = function () {
            const tf = plane.worldToTransformedFrame(plane.localFrame);
            for (let i = tf.x; i < tf.x + tf.width; ++i) {
                for (let j = tf.y; j < tf.y + tf.height; ++j) {
                    let uci = i % this.unitCell.size1;
                    let ucj = j % this.unitCell.size2;
                    if (uci < 0) uci += this.unitCell.size1;
                    if (ucj < 0) ucj += this.unitCell.size2;
                    const val = plane.unitCell.toneValue(uci, ucj);
                    const toneEnum = selection[val];
                    let sprite = plane.spriteProvider(toneEnum, false);
                    let pos = this.grid.cellToWorld(math.matrix([
                        [i],
                        [j]
                    ]));
                    sprite.position.set(pos.get([0, 0]), pos.get([1, 0]));
                    sprite.scale.set(this.localScale, this.localScale);
                    plane.container.addChild(sprite);
                }
            }
        }
        plane.populate();

        return plane;
    }
}

export {
    TonesPlane
};