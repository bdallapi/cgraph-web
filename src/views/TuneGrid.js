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
        this.gridHeight = rect.height / 12 / this.octaves;
        this.gridWidth = rect.width / this.chordsCount;
        this.graph = new PIXI.Graphics();
        this.content.addChild(this.graph);
        this.draw();
    }
    resize(rect) {
        Scrollbox.prototype.resize.call(this, {
            boxWidth: rect.width,
            bowHeight: rect.height
        });
        this.position.set(rect.x, rect.y);
        this.gridHeight = rect.height / 12 * this.octaves;
        this.gridWidth = rect.width / this.chordsCount;
        this.update();
    }
    draw() {
        this.graph.clear();
        this.graph.lineStyle(2, foreFrontColor, 1);
        for (let o = 0; o < 3; ++o) {
            this.graph.drawRect(0, o * 12 * this.gridHeight, this.gridWidth * this.chordsCount, this.gridHeight)
                .beginFill(foreFrontColor, 0.5)
                .drawRect(0, (12 * o + 1) * this.gridHeight, this.gridWidth * this.chordsCount, this.gridHeight)
                .endFill()
                .drawRect(0, (o * 12 + 2) * this.gridHeight, this.gridWidth * this.chordsCount, this.gridHeight)
                .beginFill(foreFrontColor, 0.5)
                .drawRect(0, (12 * o + 3) * this.gridHeight, this.gridWidth * this.chordsCount, this.gridHeight)
                .endFill()
                .drawRect(0, (o * 12 + 4) * this.gridHeight, this.gridWidth * this.chordsCount, this.gridHeight)
                .drawRect(0, (o * 12 + 5) * this.gridHeight, this.gridWidth * this.chordsCount, this.gridHeight)
                .beginFill(foreFrontColor, 0.5)
                .drawRect(0, (12 * o + 6) * this.gridHeight, this.gridWidth * this.chordsCount, this.gridHeight)
                .endFill()
                .drawRect(0, (o * 12 + 7) * this.gridHeight, this.gridWidth * this.chordsCount, this.gridHeight)
                .beginFill(foreFrontColor, 0.5)
                .drawRect(0, (12 * o + 8) * this.gridHeight, this.gridWidth * this.chordsCount, this.gridHeight)
                .endFill()
                .drawRect(0, (o * 12 + 9) * this.gridHeight, this.gridWidth * this.chordsCount, this.gridHeight)
                .beginFill(foreFrontColor, 0.5)
                .drawRect(0, (12 * o + 10) * this.gridHeight, this.gridWidth * this.chordsCount, this.gridHeight)
                .endFill()
                .drawRect(0, (o * 12 + 11) * this.gridHeight, this.gridWidth * this.chordsCount, this.gridHeight);
        }
        for (let g = 1; g < this.chordsCount; ++g) {
            this.graph.moveTo(g * this.gridWidth, 0);
            this.graph.lineTo(g * this.gridWidth, this.octaves * 12 * this.gridHeight);
        }
        this.update();
    }
}

export default TuneGrid;