var staticRotor = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/**
 * A rotor is a single part of the Enigma machine.
 * The right-most rotor will rotate every key press,
 * the remaining rotors will rotate when the previous hits its notch.
 */
class Rotor {
    /**
     * @param {string} mapping the keyboatd mapping, as tring of letters A-Z
     * @param {string} notch the letter at which the rotor will rotate the next rotor
     */
    constructor(mapping, notch) {
        this.abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        this.mapping = mapping.split('');
        this.notch = notch;
    }

    ingestFromRight(letter) {
        // Given the acb letter, return its mapping
        let index = staticRotor.indexOf(letter);
        return this.mapping[index];
    }

    ingestFromLeft(letter) {
        // Given the mapping letter, return abc
        let index = this.mapping.indexOf(letter);
        return staticRotor[index];
    }

    rotate() {
        // Move the first element to the end
        this.mapping.push(this.mapping.shift());
        this.abc.push(this.abc.shift());

        console.log(this.abc)
        console.log(this.notch)
        return this.notch == this.abc[0];
    }
}

class Reflector {
    constructor(mapping) {
        this.abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        this.mapping = mapping.split('');
    }

    ingest(letter) {
        let index = this.abc.indexOf(letter);
        return this.mapping[index];
    }
}

/**
 * The housing that seats the rotors and the reflector.
 * This consolidates the logic of the Enigma machine.
 */
class RotorHousing {
    constructor(left, middle, right, reflector) {
        this.rotors = [left, middle, right];
        this.reflector = reflector;
    }

    doRotations() {
        let rotateNext = this.rotors[2].rotate();

        if (rotateNext)
            rotateNext = this.rotors[1].rotate();

        if (rotateNext)
            this.rotors[0].rotate();
    }

    /**
     * A single letter is taken through each of the rotors, passed through the
     * reflector and then again through the rotors and out the other side.
     * @param {string} letter the letter to be ingested through the rotors
     * @returns {string} the resultant 'cyphered' letter
     */
    ingest(letter) {
        this.doRotations();

        let l = letter.toUpperCase();

        for (var i = this.rotors.length - 1; i >= 0; i--) {
            l = this.rotors[i].ingestFromRight(l);
        }

        l = this.reflector.ingest(l);

        for (var i = 0; i < this.rotors.length; i++) {
            l = this.rotors[i].ingestFromLeft(l);
        }

        return l;
    }
}