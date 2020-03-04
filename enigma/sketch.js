const keyboard = [
    'QWERTYUIOP',
    'ASDFGHJKL',
    'ZXCVBNM'
];

const allKeys = keyboard[0] + keyboard[1] + keyboard[2];

let font;
let fontSize = 29;
let fontColor;
let currentLetter;

let outputString = '';

let rotorI;
let rotorII;
let rotorIII;
let reflectorB;
let housing;

// The rotor settings
const settings = [];

/**
 * A class for displaying the Rotor in the GUI
 * @param {Rotor} rotor one of the three rotors at the top of the Enigma
 * @param {number} x x coordinate
 * @param {number} y y coordinate
 */
class RotorGUI {
    constructor(rotor, x, y) {
        this.rotor = rotor;
        this.x = x;
        this.y = y;

        this.color = color(255);
    }
}

function preload() {
    font = loadFont('assets/TYPEWR__.TTF');
}

function setup() {
    createCanvas(600, 500);

    fontColor = color(255);
    textFont(font);
    textSize(fontSize);
    textAlign(CENTER, CENTER);

    //
    // Set up the rotors
    //

    rotorI = new Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ', 'R');
    rotorII = new Rotor('AJDKSIRUXBLHWTMCQGZNPYFVOE', 'F');
    rotorIII = new Rotor('BDFHJLCPRTXVZNYEIWGAKMUSQO', 'W');
    reflectorB = new Reflector('YRUHQSLDPXNGOKMIEBFZCWVJAT');

    housing = new RotorHousing(
        left = rotorI,
        middle = rotorII,
        right = rotorIII,
        reflector = reflectorB
    );

    //
    // This is the graphical aspect of the rotors
    // I do this to keep the logic seperate from the presentation
    //

    let x = 250;
    for (let i = 0; i < 3; i++) {
        settings.push(new RotorGUI(housing.rotors[i], x, 50));
        x += 50;
    }
}

function draw() {
    background(51);

    //
    // Draw the rotor settings
    //

    settings.forEach(rs => {
        fill(rs.color);
        text(rs.rotor.abc[0], rs.x, rs.y);
    });

    //
    // Draw the lightboard
    //

    let vOffset = 100;
    let hOffsetInit = 50;

    keyboard.forEach(keyboardRow => {
        let hOffset = hOffsetInit;

        for (letter of keyboardRow) {
            // Drawing the keys
            if (letter == currentLetter) {
                fill(255, 255, 153);
            } else {
                fill(255);
            }

            ellipse(hOffset, vOffset, 40, 40);

            // The lettering of the keys
            fill(0);
            text(letter, hOffset, vOffset);
            hOffset += 50;
        }

        vOffset += 50;
        hOffsetInit += 50;
    })

    //
    // Draw the oupput
    //

    fill(255);
    text(outputString, 300, 300);
}

function keyPressed() {
    if (allKeys.includes(key.toUpperCase())) {
        let cipheredLetter = housing.ingest(key);
        currentLetter = cipheredLetter;
        outputString += cipheredLetter;
    }
}

/**
 * The mouse press for changing the rotor settings
 */
function mousePressed() {
    for (let i = 0; i < settings.length; i++) {
        if (dist(settings[i].x, settings[i].y, mouseX, mouseY) < 20) {
            settings[i].rotor.rotate();
        }
    }
}