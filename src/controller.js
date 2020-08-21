import * as math from 'mathjs'
class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.model.tune.next();

        this.view.tonesPlane.on('tonestriggered', (tones, coords) => this.onTonesTriggered(tones, coords));
        this.view.tonesPlane.on('singletonetriggered', (tone, coord) => this.onSingleToneTriggered(tone, coord));
        this.view.tonesPlane.on('currentchordtriggered', () => this.onCurrentChordTriggered());
        this.view.tuneGrid.on('toneTriggered', (cid, tone) => this.onTuneToneTriggered(cid, tone));
        this.view.tuneGrid.on('chordTriggered', (cid) => this.onTuneChordTriggered(cid))
    }
    onTonesTriggered(tones, coords) {
        this.model.tune.setCurrentChord(tones, coords);
        this.view.tonesPlane.setCurrentChord(this.model.tune.getCurrent().coords);
        this.view.tuneGrid.drawChords(this.model.tune.chords);
        this.onCurrentChordTriggered();
    }
    onSingleToneTriggered(tone, coord) {
        let t = this.model.tune.getCurrent().tones.findIndex(e => e.tone == tone.tone && e.octave == tone.octave);
        if (t == -1) {
            this.model.tune.appendToCurrentChord(tone, coord);
        } else {
            this.model.tune.removeFromCurrentChord(tone);
        }
        this.view.tonesPlane.setCurrentChord(this.model.tune.getCurrent().coords);
        this.view.tuneGrid.drawChords(this.model.tune.chords);
        this.onCurrentChordTriggered();
    }
    onCurrentChordTriggered() {
        if (this.model.tune.getCurrent().tones.length > 0) {
            this.view.playTones(this.model.tune.getCurrent().tones);
            this.view.tonesPlane.onCurrentChordTriggered();
        }
    }
    onTuneToneTriggered(cid, tone) {
        this.model.tune.setCurrent(cid);
        let current = this.model.tune.getCurrent();
        let barycenter = math.divide(current.coords.reduce((b, c) => math.add(b, c)), current.coords.length);
        let coord = this.view.tonesPlane.coordFromToneClosestTo(tone, barycenter);
        this.onSingleToneTriggered(tone, coord);
        this.view.tonesPlane.setCurrentChord(current.coords);
        this.onCurrentChordTriggered();
    }
    onTuneChordTriggered(cid) {
        this.model.tune.setCurrent(cid);
        this.view.tonesPlane.setCurrentChord(this.model.tune.getCurrent().coords);
        this.onCurrentChordTriggered();
    }
}

export default Controller;