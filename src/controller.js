class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.model.tune.next();
    }
    onTonesTriggered(tones, coords) {
        this.model.tune.setCurrentChord(tones, coords);
    }
    onSingleToneTriggered(tone, coord) {
        this.model.tune.appendToCurrentChord(tone, coord);
    }
}

export default Controller;