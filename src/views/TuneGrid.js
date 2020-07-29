import * as PIXI from 'pixi.js'
import {
    Scrollbox
} from 'pixi-scrollbox'
import {
    foreFrontColor
} from '../constants'

class TuneGrid extends Scrollbox {
    constructor(rect) {
        super({
            boxWidth: rect.width,
            boxHeight: rect.height,
            fade: true,
            overflowY: "none"
        });
        this.octaves = 3;
        this.chordsCount = 16;
        this.graph = new PIXI.Graphics();
        this.content.addChild(this.graph);
        const scaleY = rect.height / 12 / this.octave;
        const scaleX = rect.width / this.chordsCount;
        this.content.scale.set(scaleX, scaleY);
        this.draw();
    }
    resize(rect) {
        Scrollbox.prototype.resize.call(this, {
            boxWidth: rect.width,
            bowHeight: rect.height
        });
        this.position.set(rect.x, rect.y);
        const scaleY = rect.height / 12 / this.octaves;
        const scaleX = rect.width / this.chordsCount;
        this.content.scale.set(scaleX, scaleY);
        this.update();
    }
    draw() {
        this.graph.clear();
        this.graph.lineStyle(1 / 16, foreFrontColor, 1);
        for (let o = 0; o < 3; ++o) {
            this.graph.drawRect(0, o * 12, this.chordsCount, 1)
                .beginFill(foreFrontColor, 0.5)
                .drawRect(0, (12 * o + 1), this.chordsCount, 1)
                .endFill()
                .drawRect(0, (o * 12 + 2), this.chordsCount, 1)
                .beginFill(foreFrontColor, 0.5)
                .drawRect(0, (12 * o + 3), this.chordsCount, 1)
                .endFill()
                .drawRect(0, (o * 12 + 4), this.chordsCount, 1)
                .drawRect(0, (o * 12 + 5), this.chordsCount, 1)
                .beginFill(foreFrontColor, 0.5)
                .drawRect(0, (12 * o + 6), this.chordsCount, 1)
                .endFill()
                .drawRect(0, (o * 12 + 7), this.chordsCount, 1)
                .beginFill(foreFrontColor, 0.5)
                .drawRect(0, (12 * o + 8), this.chordsCount, 1)
                .endFill()
                .drawRect(0, (o * 12 + 9), this.chordsCount, 1)
                .beginFill(foreFrontColor, 0.5)
                .drawRect(0, (12 * o + 10), this.chordsCount, 1)
                .endFill()
                .drawRect(0, (o * 12 + 11), this.chordsCount, 1);
        }
        for (let g = 1; g < this.chordsCount; ++g) {
            this.graph.moveTo(g, 0);
            this.graph.lineTo(g, this.octaves * 12);
        }
        this.update();
    }
}

export default TuneGrid;