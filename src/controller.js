import * as math from 'mathjs'
class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.model.tune.next();
    }
    onTonesTriggered(tones, coords) {
        this.model.tune.setCurrentChord(tones, coords);
        this.view.tonesPlane.drawCurrentChord(this.model.tune.getCurrent().coords);
        this.onCurrentChordTriggered();
    }
    onSingleToneTriggered(tone, coord) {
        let t = this.model.tune.getCurrent().tones.findIndex(e => e.tone == tone.tone);
        if (t == -1) {
            this.model.tune.appendToCurrentChord(tone, coord);
        } else {
            if (math.equal(this.model.tune.getCurrent().coords[t], coord)) {
                this.model.tune.removeFromCurrentChord(tone);
            }
        }
        this.view.tonesPlane.drawCurrentChord(this.model.tune.getCurrent().coords);
    }
    onCurrentChordTriggered() {
        this.view.playTones(this.model.tune.getCurrent().tones);
        this.view.tonesPlane.onCurrentChordTriggered();
    }
}

export default Controller;