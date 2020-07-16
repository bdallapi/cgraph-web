import * as PIXI from 'pixi.js';
import tones from './tones';
import Grid from './Grid';
import * as math from 'mathjs';

const TonesPlane = {
    grid: Grid.create(math.matrix([
        [0.5, -0.5],
        [0.5 * math.sqrt(3), 0.5 * math.sqrt(3)]
    ])),

    unitCell: {
        size1: 3,
        size2: 4,
        [0, 0]: 0,
        [1, 0]: 4,
        [2, 0]: 8,
        [0, 1]: 9,
        [1, 1]: 1,
        [2, 1]: 5,
        [0, 2]: 6,
        [1, 2]: 10,
        [2, 2]: 2,
        [0, 3]: 3,
        [1, 3]: 7,
        [2, 3]: 11
    },

    worldToTransformedFrame: function (worldFrame) {
        const tl = math.floor(math.multiply(this.grid.inv, math.matrix([
            [worlfFrame.x],
            [worldFrame.y]
        ])));
        const tr = math.floor(math.multiply(this.grid.inv, math.matrix([
            [worlfFrame.x + worldFrame.width],
            [worldFrame.y]
        ])));
        const bl = math.floor(math.multiply(this.grid.inv, math.matrix([
            [worlfFrame.x],
            [worldFrame.y + worldFrame.height]
        ])));
        const br = math.floor(math.multiply(this.grid.inv, math.matrix([
            [worlfFrame.x + worldFrame.width],
            [worldFrame.y + worldFrame.height]
        ])));
        const min0 = math.min(tl.get(0), tr.get(0), bl.get(0), br.get(0));
        const max0 = math.max(tl.get(0), tr.get(0), bl.get(0), br.get(0));
        const min1 = math.min(tl.get(1), tr.get(1), bl.get(1), br.get(1));
        const max1 = math.max(tl.get(1), tr.get(1), bl.get(1), br.get(1));
        return new PIXI.Rectangle(min0, min1, max0 - min0 + 1, max1 - min1 + 1);
    },

    localWidth: 7.5,
    localScale: 1.0 / 192,

    create: function (selection, aspect, spriteProvider) {
        var plane = Object.create(this);
        plane.selection = selection;
        plane.aspect = aspect;

        plane.localFrame = PIXI.Rectangle(
            -this.localWidth / 2, aspect * this.localWidth / 2,
            this.localWidth, aspect * this.localWidth);

        plane.container = new PIXI.Container();
        plane.spriteProvider = spriteProvider;

        plane.populate = function () {
            const tf = this.worldToTransformedFrame(plane.localFrame);
            for (let i = tf.x; i < tf.x + tf.width; ++i) {
                for (let j = tf.y; j < tf.y + tf.height; ++j) {
                    let sprite = spriteProvider(selection[this.unitCell[[i % this.unitCell.size1, j % this.unitCell.size2]]]);
                    sprite.position.set(this.grid.cellToWorld(math.matrix([
                        [i],
                        [j]
                    ])));
                    sprite.scale.set(this.localScale, this.localScale);
                    plane.container.addChild(sprite);
                }
            }
        }
        plane.populate();

        return plane;
    }
}

export default TonesPlane;