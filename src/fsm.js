class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.config = config;
        this.history = [];
        this.canceledList = [];
        this.state = config.initial.toLowerCase();
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
        for (let confState in this.config.states) {
            if (state.toLowerCase() === confState.toLowerCase()){
                this.history.push(this.state);
                this.state = state.toLowerCase();
                return;
            }
        }
        throw new Error('Wrong state value');
    }

    changeState(state){
        this.canceledList = [];
        this.changeStateAlter(state);
    }


    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        for (let confTransition in this.config.states[this.getState()].transitions) {
            if (event.toLowerCase() === confTransition.toLowerCase()){
                this.canceledList = [];
                return this.changeStateAlter(this.config.states[this.getState()].transitions[confTransition].toLowerCase());
            }
        }
        throw new Error('Wrong transition value');
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeStateAlter(config.initial);
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
            this.canceledList.push(this.state);
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
        if (this.canceledList.length > 0) {
            this.changeStateAlter(this.canceledList[this.canceledList.length-1]);
            this.canceledList.pop();
            return true;
        }
        return false;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [];
        this.canceledList = [];
    }
}

const config = {
    initial: 'normal',
    states: {
        normal: {
            transitions: {
                study: 'busy',
            }
        },
        busy: {
            transitions: {
                get_tired: 'sleeping',
                get_hungry: 'hungry'
            }
        },
        hungry: {
            transitions: {
                eat: 'normal'
            }
        },
        sleeping: {
            transitions: {
                get_hungry: 'hungry',
                get_up: 'normal'
            }
        },
    }
};

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
/** @Implemented by Roman Makeychik **/