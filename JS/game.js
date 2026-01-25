// game.js
import { MAZE_MAP } from "./maze.js";

const mazeElement = document.getElementById("maze");

let playerPosition = { x: 0, y: 0 };
let currentState = GAME_STATE.IDLE;
let nickname = "";
let startTime = null;
let timerInterval = null;
const bestDisplay = document.getElementById("best");



// 미로 렌더링
function renderMaze() {
  mazeElement.innerHTML = "";

  MAZE_MAP.forEach((row, y) => {
    row.forEach((cell, x) => {
      const div = document.createElement("div");
      div.classList.add("cell");

      if (cell === 1) {
        div.classList.add("wall");
      }

      if (cell === "S") {
        playerPosition = { x, y };
        div.classList.add("player");
      }

      if (cell === "E") {
        div.classList.add("exit");
      }

      div.dataset.x = x;
      div.dataset.y = y;

      mazeElement.appendChild(div);
    });
  });
}

const DIRECTIONS = {
  up:    { dx: 0, dy: -1 },
  down:  { dx: 0, dy: 1 },
  left:  { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

function canMoveTo(x, y) {
  const cell = MAZE_MAP[y][x];
  return cell !== 1; // 벽(1)이 아니면 이동 가능
}

function movePlayer(direction) {
  const { dx, dy } = DIRECTIONS[direction];
  if (!dx && !dy) return;

  const nextX = playerPosition.x + dx;
  const nextY = playerPosition.y + dy;

  if (canMoveTo(nextX, nextY)) {
    playerPosition.x = nextX;
    playerPosition.y = nextY;
    updatePlayerPosition();
    checkExit();
  }
}


function updatePlayerPosition() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => cell.classList.remove("player"));

  const index = playerPosition.y * MAZE_MAP[0].length + playerPosition.x;
  cells[index].classList.add("player");
}

document.addEventListener("keydown", (e) => {
  const keyMap = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    w: "up",
    s: "down",
    a: "left",
    d: "right",
  };

  const direction = keyMap[e.key];
  if (direction) {
    e.preventDefault();
    movePlayer(direction);
  }
});

document.querySelectorAll(".mobile-controls button")
  .forEach(btn => {
    btn.addEventListener("click", () => {
      const dir = btn.dataset.dir;
      movePlayer(dir);
    });
  });

  function checkExit() {
  if (MAZE_MAP[playerPosition.y][playerPosition.x] === "E") {
    currentState = GAME_STATE.FINISHED;
    stopTimer();

    const elapsed =
      (Date.now() - startTime) / 1000;

    const time = elapsed.toFixed(1);
    const score = calculateScore(elapsed);

    const record = {
      nickname,
      time,
      score,
      date: new Date().toISOString().split("T")[0],
    };

    saveRecord(record);

    alert(
      `🎉 ${nickname}, escaped in ${time}s!\nScore: ${score}`
    );
  }
}




const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const nicknameInput = document.getElementById("nickname");

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);

function startGame() {
  const value = nicknameInput.value.trim();

  if (!value) {
    alert("Please enter a nickname");
    return;
  }

  nickname = value;
  currentState = GAME_STATE.PLAYING;

  nicknameInput.disabled = true;
  startBtn.disabled = true;

  resetPlayer();
  resetTimer();
  startTimer();
}


function resetGame() {
  currentState = GAME_STATE.IDLE;
  nickname = "";

  nicknameInput.disabled = false;
  startBtn.disabled = false;
  nicknameInput.value = "";

  resetPlayer();
}

function resetPlayer() {
  MAZE_MAP.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === "S") {
        playerPosition = { x, y };
      }
    });
  });

  updatePlayerPosition();
}

function movePlayer(direction) {
  if (currentState !== GAME_STATE.PLAYING) return;

  const { dx, dy } = DIRECTIONS[direction];
  if (!dx && !dy) return;

  const nextX = playerPosition.x + dx;
  const nextY = playerPosition.y + dy;

  if (canMoveTo(nextX, nextY)) {
    playerPosition.x = nextX;
    playerPosition.y = nextY;
    updatePlayerPosition();
    checkExit();
  }
}

function checkExit() {
  if (MAZE_MAP[playerPosition.y][playerPosition.x] === "E") {
    currentState = GAME_STATE.FINISHED;
    alert(`🎉 ${nickname}, you escaped the maze!`);
  }
}

const timeDisplay = document.getElementById("time");

function startTimer() {
  startTime = Date.now();

  timerInterval = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    timeDisplay.textContent = `${elapsed.toFixed(1)}s`;
  }, 100);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  stopTimer();
  startTime = null;
  timeDisplay.textContent = "0.0s";
}
function resetGame() {
  currentState = GAME_STATE.IDLE;
  nickname = "";

  nicknameInput.disabled = false;
  startBtn.disabled = false;
  nicknameInput.value = "";

  resetPlayer();
  resetTimer();
}

function calculateScore(time) {
  return Math.max(0, Math.round(1000 - time * 50));
}

function saveRecord(record) {
  const records =
    JSON.parse(localStorage.getItem("mazeRecords")) || [];

  records.push(record);

  // 점수 기준 내림차순
  records.sort((a, b) => b.score - a.score);

  // 상위 5개만 유지
  const topRecords = records.slice(0, 5);

  localStorage.setItem("mazeRecords", JSON.stringify(topRecords));

  updateBestDisplay(topRecords);
}

function updateBestDisplay(records) {
  if (!records || records.length === 0) {
    bestDisplay.textContent = "--";
    return;
  }

  bestDisplay.textContent = `${records[0].time}s`;
}

function loadBestRecord() {
  const records =
    JSON.parse(localStorage.getItem("mazeRecords")) || [];

  updateBestDisplay(records);
}

loadBestRecord();

// 초기 렌더
renderMaze();
