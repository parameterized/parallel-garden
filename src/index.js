"use strict";

const canvas = document.getElementById("main-canvas");
const glsl = SwissGL(canvas);
const initSeed = Math.random() * 12417;
const FPS = 30;
const gridSize = [64, 64];

let playing = true;
let simTime = 0;
let simTimeOffset = 0;

// Targets

const state = glsl({}, {
    size: gridSize,
    story: 2,
    tag: "state",
});
const fade = glsl({}, {
    size: state[0].size,
    tag: "fade",
});

// Params

// Sim FP is set on file read
let simParams = {};
const shiftParams = { FP: "Src((I + ivec2(1, 0)) % Src_size())" };
const trailParams = {
    S: state[0],
    Blend: "d * sa + s",
    FP: "S(I).xxx, 0.9",
};
let drawParams = {
    fade,
    time: 0,
    FP: `
vec3 a = vec3(0.5, 0.5, 0.5);
vec3 b = vec3(0.5, 0.5, 0.5);
vec3 c = vec3(2.0, 1.0, 0.0);
vec3 d = vec3(0.5, 0.2, 0.25);

float t = fract(fade(UV).x + time / 6.0);
vec3 color = a + b * cos(6.28318 * (c * t + d));
FOut = vec4(color, 1);
`
};


async function start() {
    glsl({
        seed: initSeed,
        FP: "hash(ivec3(I, seed)).r"
    }, state);

    simParams.FP = await loadShader("src/shaders/gol.frag");
    requestAnimationFrame(step);
}

start();


async function loadShader(shaderPath) {
    const res = await fetch(shaderPath);
    return await res.text();
}


function step() {
    if (playing) {
        // Simulation
        simTime += 1 / FPS;
        glsl(simParams, state);
        glsl(shiftParams, state);
        glsl(trailParams, fade);
    }

    // Drawing
    drawParams.time = simTime + simTimeOffset;
    glsl(drawParams);

    // TODO: account for sim time
    setTimeout(() => requestAnimationFrame(step), 1000 / FPS);
}


const togglePlayingButton = document.getElementById("togglePlaying");

function togglePlaying() {
    playing = !playing;
    if (playing) {
        togglePlayingButton.innerText = "Pause";
    } else {
        togglePlayingButton.innerText = "Resume";
    }
}

togglePlayingButton.addEventListener("mousedown", togglePlaying);

const timeSlider = document.getElementById("timeSlider");

timeSlider.addEventListener("input", () => {
    simTimeOffset = Number(timeSlider.value);
});


document.addEventListener("keydown", e => {
    if (e.key === "Tab" || e.key == "Alt" || e.key === " ") {
        e.preventDefault();
    }
    if (e.key === " " && !e.repeat) {
        togglePlaying();
    }
});

document.oncontextmenu = function (e) {
    e.preventDefault();
};
