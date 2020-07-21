import {
    Howl
} from 'howler'

import {
    tones,
    sharpSelection,
    flatSelection
} from './tones'

function ToneSounds(source, setup) {
    let conf = {
        src: source,
        sprite: {}
    };
    let time = 8000;
    for (let octave = 3; octave < 6; ++octave) {
        for (let v = 0; v < 12; ++v) {
            conf.sprite[tones.Tone.create(sharpSelection[v], octave).str()] = [((octave - 3) * 12 + v) * time, time];
            conf.sprite[tones.Tone.create(flatSelection[v], octave).str()] = [((octave - 3) * 12 + v) * time, time];
        }
    }
    this.howl = new Howl(conf);
    this.howl.once('load', setup);
}

ToneSounds.prototype.play = function (tone) {
    return this.howl.play(tone.str());
}

ToneSounds.asset = 'assets/tones.webm';

export default ToneSounds;