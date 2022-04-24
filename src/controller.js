class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.tonesPlane.on('tonestriggered', (tones, coords) => this.onTonesTriggered(tones, coords));
        this.view.tonesPlane.on('singletonetriggered', (tone, coord) => this.onSingleToneTriggered(tone, coord));
        this.view.tonesPlane.on('currentchordtriggered', (tones, coords) => this.onCurrentTonesTriggered(tones, coords));
    }
    onTonesTriggered(tones, coords) {
        this.model.setChord(tones, coords);
        this.view.tonesPlane.setCurrentChord(this.model.chord.tones, this.model.chord.coords);
        this.onCurrentTonesTriggered();
    }
    onSingleToneTriggered(tone, coord) {
        let t = this.model.chord.tones.findIndex(e => e.tone == tone.tone && e.octave == tone.octave);
        if (t == -1) {
            this.model.appendToCurrentChord(tone, coord);
        } else {
            this.model.removeFromCurrentChord(tone);
        }
        this.view.tonesPlane.setCurrentChord(this.model.chord.tones, this.model.chord.coords);
        this.onCurrentTonesTriggered();
    }
    onCurrentTonesTriggered() {
        this.view.playTones(this.model.chord.tones);
        this.view.tonesPlane.triggerChord();
    }
}

export default Controller;