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
        return new PIXI.Rectangle(min0 - 2, min1 - 2, max0 - min0 + 3, max1 - min1 + 3);
    },

    localWidth: 7.5,
    localScale: 1.0 / 192,

    create: function (selection, aspect, spriteProvider) {
        var plane = Object.create(this);
        plane.selection = selection;
        plane.aspect = aspect;

        plane.localFrame = new PIXI.Rectangle(
            -this.localWidth / 2, aspect * this.localWidth / 2,
            this.localWidth, aspect * this.localWidth);

        plane.container = new PIXI.Container();
        plane.spriteProvider = spriteProvider;

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
                    let sprite = spriteProvider(toneEnum, false);
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