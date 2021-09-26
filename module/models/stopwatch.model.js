export class Stopwatch {

    constructor() {
        this._time = 0;
        this._timeoutId = null;
    }

    set timeoutId(value) {
        this._timeoutId = value;
    }

    get timeoutId() {
        return this._timeoutId;
    }

    set time(value) {
        this._time = value;

        if (this._timeListener) {
            this._timeListener(value);
        }
    }

    get time() {
        return this._time;
    }

    registerTimeListener(listener) {
        this._timeListener = listener;
    }

    run() {
        this.timeoutId = setTimeout(() => {
            this.time++;
            this.run();
        }, 1000);
    }

    pause() {
        clearTimeout(this._timeoutId);
    }

    reset() {
        clearTimeout(this._timeoutId);
        this.timeoutId = null;
        this.time = 0;
    }

    isLaunched() {
        return !!this.timeoutId;
    }
}

