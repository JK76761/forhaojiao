import { MAZE_MAP } from "./maze.js";

/* =====================
   Game State
===================== */
const GAME_STATE = {
  IDLE: "idle",
  PLAYING: "playing",
  FINISHED: "finished",
};

let currentState = GAME_STATE.IDLE;
let playerPosition = { x: 0, y: 0 };
let nickname = "";
let startTime = null;
let timerInterval = null;

/* =====================
   DOM
===================== */
const mazeElement = document.getElementById("maze");
const timeDisplay = document.getElementById("time");
const bestDisplay = document.getElementById("best");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const nicknameInput = document.getElementById("nickname");

/* =====================
   Maze Render
===================== */

startBtn.onclick = () => {
  if (!nicknameInput.value.trim()) {
    alert("Enter nickname");
    return;
  }

  nickname = nicknameInput.value.trim();
  currentState = GAME_STATE.PLAYING;

  nicknameInput.disabled = true;
  startBtn.disabled = true;

  renderMaze();   // ⭐ 중요
  resetTimer();
  startTimer();

  alert("Game Started! Move RIGHT 👉 first");
};


function renderMaze() {
  mazeElement.innerHTML = "";

  MAZE_MAP.forEach((row, y) => {
    row.forEach((cell, x) => {
      const div = document.createElement("div");
      div.classList.add("cell");

      if (cell === 1) div.classList.add("wall");
      if (cell === "E") div.classList.add("exit");

      if (cell === "S") {
        playerPosition = { x, y };
        div.classList.add("player");
      }

      mazeElement.appendChild(div);
    });
  });
}

function updatePlayerPosition() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach(c => c.classList.remove("player"));

  const index = playerPosition.y * MAZE_MAP[0].length + playerPosition.x;
  cells[index].classList.add("player");
}

/* =====================
   Movement
===================== */
const DIRECTIONS = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

function canMoveTo(x, y) {
  return MAZE_MAP[y][x] !== 1;
}

function movePlayer(direction) {
  if (currentState !== GAME_STATE.PLAYING) return;

  const { dx, dy } = DIRECTIONS[direction];
  const nx = playerPosition.x + dx;
  const ny = playerPosition.y + dy;

  if (canMoveTo(nx, ny)) {
    playerPosition = { x: nx, y: ny };
    updatePlayerPosition();
    checkExit();
  }
}

/* =====================
   Input
===================== */
document.addEventListener("keydown", e => {
  const map = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    w: "up",
    a: "left",
    s: "down",
    d: "right",
  };

  const dir = map[e.key];
  if (dir) {
    e.preventDefault();
    movePlayer(dir);
  }
});

document.querySelectorAll(".mobile-controls button")
  .forEach(btn =>
    btn.addEventListener("click", () =>
      movePlayer(btn.dataset.dir)
    )
  );

/* =====================
   Timer
===================== */
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const t = ((Date.now() - startTime) / 1000).toFixed(1);
    timeDisplay.textContent = `${t}s`;
  }, 100);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  stopTimer();
  timeDisplay.textContent = "0.0s";
}

/* =====================
   Game Flow
===================== */
startBtn.onclick = () => {
  if (!nicknameInput.value.trim()) {
    alert("Enter nickname");
    return;
  }

  nickname = nicknameInput.value.trim();
  currentState = GAME_STATE.PLAYING;

  nicknameInput.disabled = true;
  startBtn.disabled = true;

  resetTimer();
  startTimer();
};

resetBtn.onclick = () => {
  currentState = GAME_STATE.IDLE;
  nicknameInput.disabled = false;
  startBtn.disabled = false;
  nicknameInput.value = "";

  renderMaze();
  resetTimer();
};

function checkExit() {
  if (MAZE_MAP[playerPosition.y][playerPosition.x] === "E") {
    currentState = GAME_STATE.FINISHED;
    stopTimer();
    alert(`🎉 ${nickname}, escaped!`);
  }
}

/* =====================
   Init
===================== */
document.addEventListener("DOMContentLoaded", () => {
  renderMaze();
});

