"use strict";

const p5Container = document.getElementById("p5Container");

const codeSteps = {
    sim: {
        label: "sim",
        active: true,
        x: 1 / 2,
        y: 1 / 5,
    },
    shift: {
        label: "shift",
        active: true,
        x: 1 / 2,
        y: 2 / 5,
    },
    trail: {
        label: "trail",
        active: true,
        x: 1 / 2,
        y: 3 / 5,
    },
    draw: {
        label: "draw",
        active: true,
        x: 1 / 2,
        y: 4 / 5,
    },
};


window.setup = function () {
    const canvas = createCanvas(512, 512);
    canvas.parent(p5Container);
    canvas.canvas.classList.add("object-contain");
    window.windowResized();

    smooth();
    strokeJoin(ROUND);
    noStroke();
};


window.mousePressed = function (e) {
    textSize(30);
    const stepRadius = textSize();
    for (const [_, codeStep] of Object.entries(codeSteps)) {
        const bh = textSize() * 2;
        const bw = textWidth(codeStep.label) + (bh - textSize());
        const bx = codeStep.x * width - bw / 2;
        const by = codeStep.y * height - bh / 2;
        if (mouseInRoundedRect(bx, by, bw, bh, stepRadius)) {
            codeStep.active = !codeStep.active;
        }
    }
};


function mouseInRoundedRect(x, y, w, h, r) {
    r = min(w / 2, h / 2, r);
    return (
        (
            mouseX > x && mouseX < x + w
            && mouseY > y + r && mouseY < y + h - r
        ) || (
            mouseX > x + r && mouseX < x + w - r
            && mouseY > y && mouseY < y + h
        ) || dist(mouseX, mouseY, x + r, y + r) < r
        || dist(mouseX, mouseY, x + w - r, y + r) < r
        || dist(mouseX, mouseY, x + r, y + h - r) < r
        || dist(mouseX, mouseY, x + w - r, y + h - r) < r
    );
}


window.draw = function () {
    background(64);

    stroke(0);
    strokeWeight(3);
    line(width / 2, height / 5, width / 2, (height * 4) / 5);
    noStroke();

    textSize(30);
    const stepRadius = textSize();
    textAlign(CENTER, CENTER);
    for (const [_, codeStep] of Object.entries(codeSteps)) {
        const bh = textSize() * 2;
        const bw = textWidth(codeStep.label) + (bh - textSize());
        const bx = codeStep.x * width - bw / 2;
        const by = codeStep.y * height - bh / 2;
        if (!codeStep.active) {
            fill(71, 85, 105);
        } else if (mouseInRoundedRect(bx, by, bw, bh, stepRadius)) {
            fill(100, 116, 139);
        } else {
            fill(148, 163, 184);
        }
        rect(bx, by, bw, bh, stepRadius);
        fill(0);
        text(codeStep.label, bx + bw / 2, by + bh / 2);
    }
};


window.windowResized = function () {
    const cw = p5Container.offsetWidth;
    resizeCanvas(cw, cw);

    const mccw = mainCanvasContainer.offsetWidth;
    const mcch = mainCanvasContainer.offsetHeight;
    const mccmin = min(mccw, mcch);
    const mcs = int(mccmin * 4 / 5);
    mainCanvas.width = mcs;
    mainCanvas.height = mcs;
};
