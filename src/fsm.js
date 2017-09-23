class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.config = config;
        this.prevState = null;
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
    changeState(state) {
        for (let confState in this.config.states) {
            if (state.toLowerCase() === confState.toLowerCase()){
                this.prevState = this.state;
                this.state = state.toLowerCase();
            }
        }
        throw new Error('Wrong state value');
    }


    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        for (let confTransition in this.config.states[this.getState()].transitions) {
            if (event.toLowerCase() === confTransition.toLowerCase()){
                return this.changeState(this.config.states[this.getState()].transitions[confTransition].toLowerCase());
            }
        }
        throw new Error('Wrong transition value');
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        return this.changeState(config.initial);
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
        if (this.prevState !== null) {
            this.changeState(this.prevState);
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
        return this.undo();
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.prevState = null;
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

let student = new FSM(config);
console.log(student.getStates('get_hungry'));
// student.trigger('study');

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
