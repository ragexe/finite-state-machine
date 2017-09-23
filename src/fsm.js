class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.config = config;
        this.state = config.initial.toLowerCase();
        this.history = [];
        this.canceledHistory = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeStateAlter(state) {
        for (let configuredState in this.config.states) {
            if (state.toLowerCase() === configuredState.toLowerCase()){
                this.history.push(this.state);
                this.state = state.toLowerCase();
                return;
            }
        }
        throw new Error('Wrong state value');
    }

    changeState(state){
        this.canceledHistory = [];
        this.changeStateAlter(state);
    }


    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        for (let configuredTransition in this.config.states[this.getState()].transitions) {
            if (event.toLowerCase() === configuredTransition.toLowerCase()){
                this.canceledHistory = [];
                return this.changeStateAlter(this.config.states[this.getState()].transitions[configuredTransition].toLowerCase());
            }
        }
        throw new Error('Wrong transition value');
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeStateAlter(this.config.initial);
        this.clearHistory();
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let result = [];
        if (event == null) {
            result = Object.keys(this.config.states);
        } else {
            for (let confState in this.config.states) {
                for (let confTransition in this.config.states[confState].transitions) {
                    if (confTransition.toLowerCase() === event.toLowerCase()) {
                        result.push(confState.toLowerCase());
                    }
                }
            }
        }
        return result;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.history.length > 0) {
            this.canceledHistory.push(this.state);
            this.changeStateAlter(this.history[this.history.length-1]);
            this.history.pop();
            this.history.pop();
            return true;
        }
        return false;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.canceledHistory.length > 0) {
            this.changeStateAlter(this.canceledHistory[this.canceledHistory.length-1]);
            this.canceledHistory.pop();
            return true;
        }
        return false;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [];
        this.canceledHistory = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
/** @Implemented by Roman Makeychik **/