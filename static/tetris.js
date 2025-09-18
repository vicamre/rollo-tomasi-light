/**
 * Bølger av Mot Tetris - Maritime Tetris med pilot-tema
 * Hver blokk representerer episoder fra piloten om GGR 2026
 */

class TetrisGame {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.nextCanvas = null;
    this.nextCtx = null;
    
    // Spillbrett
    this.BOARD_WIDTH = 10;
    this.BOARD_HEIGHT = 20;
    this.BLOCK_SIZE = 30;
    this.board = [];
    
    // Spill-state
    this.gameRunning = false;
    this.gamePaused = false;
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.dropTime = 0;
    this.lastTime = 0;
    
    // Fallhastighet (ms)
    this.dropInterval = 1000;
    
    // Nåværende og neste blokk
    this.currentPiece = null;
    this.nextPiece = null;
    this.pieceX = 0;
    this.pieceY = 0;
    
    // Input
    this.keys = {};
    this.lastMoveTime = 0;
    this.moveDelay = 100;
    
    // Tetris-blokker med maritime/pilot-tema
    this.pieces = {
      // I-blokk: "Lang pilot" (14 min)
      I: {
        shape: [[1,1,1,1]],
        color: '#45b7d1',
        name: 'Seiltrening',
        subtitle: '14 min',
        description: 'Intensiv seiltrening på åpent hav',
        rotations: [
          [[1,1,1,1]],
          [[1],[1],[1],[1]]
        ]
      },
      
      // O-blokk: "Trailer" (3 min)
      O: {
        shape: [[1,1],[1,1]],
        color: '#ff6b6b',
        name: 'Trailer',
        subtitle: '3 min',
        description: 'Første glimt av eventyret',
        rotations: [
          [[1,1],[1,1]]
        ]
      },
      
      // T-blokk: "Kort pilot" (5 min)
      T: {
        shape: [[0,1,0],[1,1,1]],
        color: '#4ecdc4',
        name: 'Båtliv',
        subtitle: '5 min',
        description: 'Livet ombord på seilbåten',
        rotations: [
          [[0,1,0],[1,1,1]],
          [[1,0],[1,1],[1,0]],
          [[1,1,1],[0,1,0]],
          [[0,1],[1,1],[0,1]]
        ]
      },
      
      // S-blokk: "GGR 2026 Bonus"
      S: {
        shape: [[0,1,1],[1,1,0]],
        color: '#f9ca24',
        name: 'GGR 2026',
        subtitle: 'BONUS',
        description: 'Golden Globe Race drømmen',
        rotations: [
          [[0,1,1],[1,1,0]],
          [[1,0],[1,1],[0,1]]
        ]
      },
      
      // Z-blokk: "Mot-bølge"
      Z: {
        shape: [[1,1,0],[0,1,1]],
        color: '#6c5ce7',
        name: 'Storm',
        subtitle: 'UTFORDRING',
        description: 'Mot gjennom stormen',
        rotations: [
          [[1,1,0],[0,1,1]],
          [[0,1],[1,1],[1,0]]
        ]
      },
      
      // J-blokk: "Forberedelse"
      J: {
        shape: [[1,0,0],[1,1,1]],
        color: '#a29bfe',
        name: 'Forberedelse',
        subtitle: '8 min',
        description: 'Planlegging og forberedelser',
        rotations: [
          [[1,0,0],[1,1,1]],
          [[1,1],[1,0],[1,0]],
          [[1,1,1],[0,0,1]],
          [[0,1],[0,1],[1,1]]
        ]
      },
      
      // L-blokk: "Utfordring"
      L: {
        shape: [[0,0,1],[1,1,1]],
        color: '#fd79a8',
        name: 'Navigasjon',
        subtitle: '12 min',
        description: 'Navigering gjennom ukjente farvann',
        rotations: [
          [[0,0,1],[1,1,1]],
          [[1,0],[1,0],[1,1]],
          [[1,1,1],[1,0,0]],
          [[1,1],[0,1],[0,1]]
        ]
      }
    };
    
    this.pieceTypes = Object.keys(this.pieces);
    this.currentRotation = 0;
    
    this.init();
  }
  
  init() {
    this.canvas = document.getElementById('tetrisCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.nextCanvas = document.getElementById('nextPieceCanvas');
    this.nextCtx = this.nextCanvas.getContext('2d');
    
    // Initialiser tomt brett
    this.board = Array(this.BOARD_HEIGHT).fill().map(() => Array(this.BOARD_WIDTH).fill(0));
    
    // Input listeners
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    
    // Generer første blokker
    this.nextPiece = this.generateRandomPiece();
    this.spawnNewPiece();
  }
  
  generateRandomPiece() {
    const randomType = this.pieceTypes[Math.floor(Math.random() * this.pieceTypes.length)];
    return {
      type: randomType,
      ...this.pieces[randomType],
      rotation: 0
    };
  }
  
  spawnNewPiece() {
    this.currentPiece = this.nextPiece;
    this.nextPiece = this.generateRandomPiece();
    this.currentRotation = 0;
    
    // Start position
    this.pieceX = Math.floor(this.BOARD_WIDTH / 2) - Math.floor(this.currentPiece.rotations[0][0].length / 2);
    this.pieceY = 0;
    
    // Sjekk game over
    if (this.isCollision(this.pieceX, this.pieceY, this.currentPiece.rotations[this.currentRotation])) {
      this.gameOver();
    }
    
    this.drawNextPiece();
    this.updatePieceInfo();
  }
  
  isCollision(x, y, shape) {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newX = x + col;
          const newY = y + row;
          
          if (newX < 0 || newX >= this.BOARD_WIDTH || newY >= this.BOARD_HEIGHT) {
            return true;
          }
          
          if (newY >= 0 && this.board[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  }
  
  placePiece() {
    const shape = this.currentPiece.rotations[this.currentRotation];
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const boardY = this.pieceY + row;
          const boardX = this.pieceX + col;
          if (boardY >= 0) {
            this.board[boardY][boardX] = this.currentPiece.color;
          }
        }
      }
    }
    
    this.clearLines();
    this.spawnNewPiece();
  }
  
  clearLines() {
    let linesCleared = 0;
    
    for (let row = this.BOARD_HEIGHT - 1; row >= 0; row--) {
      if (this.board[row].every(cell => cell !== 0)) {
        this.board.splice(row, 1);
        this.board.unshift(Array(this.BOARD_WIDTH).fill(0));
        linesCleared++;
        row++; // Sjekk samme rad igjen
      }
    }
    
    if (linesCleared > 0) {
      // Poengberegning med maritime tema
      const linePoints = [0, 100, 300, 500, 800];
      this.score += linePoints[Math.min(linesCleared, 4)] * this.level;
      this.lines += linesCleared;
      
      // Øk nivå hver 10. linje
      const newLevel = Math.floor(this.lines / 10) + 1;
      if (newLevel > this.level) {
        this.level = newLevel;
        this.dropInterval = Math.max(50, 1000 - (this.level - 1) * 50);
      }
      
      this.updateUI();
      
      // Maritime effekt for line clear
      this.createWaveEffect(linesCleared);
    }
  }
  
  createWaveEffect(lines) {
    // Visuell bølge-effekt når linjer fjernes
    console.log(`🌊 ${lines} bølger av mot fullført!`);
  }
  
  handleKeyDown(e) {
    if (!this.gameRunning || this.gamePaused) return;
    
    this.keys[e.code] = true;
    const now = Date.now();
    
    switch(e.code) {
      case 'ArrowLeft':
        if (now - this.lastMoveTime > this.moveDelay) {
          this.movePiece(-1, 0);
          this.lastMoveTime = now;
        }
        break;
      case 'ArrowRight':
        if (now - this.lastMoveTime > this.moveDelay) {
          this.movePiece(1, 0);
          this.lastMoveTime = now;
        }
        break;
      case 'ArrowDown':
        this.movePiece(0, 1);
        break;
      case 'ArrowUp':
        this.rotatePiece();
        break;
      case 'Space':
        e.preventDefault();
        this.dropPiece();
        break;
      case 'KeyP':
        this.togglePause();
        break;
    }
  }
  
  handleKeyUp(e) {
    this.keys[e.code] = false;
  }
  
  movePiece(dx, dy) {
    const newX = this.pieceX + dx;
    const newY = this.pieceY + dy;
    const shape = this.currentPiece.rotations[this.currentRotation];
    
    if (!this.isCollision(newX, newY, shape)) {
      this.pieceX = newX;
      this.pieceY = newY;
      return true;
    }
    return false;
  }
  
  rotatePiece() {
    const newRotation = (this.currentRotation + 1) % this.currentPiece.rotations.length;
    const newShape = this.currentPiece.rotations[newRotation];
    
    if (!this.isCollision(this.pieceX, this.pieceY, newShape)) {
      this.currentRotation = newRotation;
    }
  }
  
  dropPiece() {
    while (this.movePiece(0, 1)) {
      // Fortsett å falle til bunnen
    }
    this.placePiece();
  }
  
  togglePause() {
    this.gamePaused = !this.gamePaused;
    if (!this.gamePaused) {
      this.gameLoop();
    }
  }
  
  update(deltaTime) {
    if (!this.gameRunning || this.gamePaused) return;
    
    this.dropTime += deltaTime;
    
    // Automatisk fall
    if (this.dropTime > this.dropInterval) {
      if (!this.movePiece(0, 1)) {
        this.placePiece();
      }
      this.dropTime = 0;
    }
    
    // Kontinuerlig bevegelse
    const now = Date.now();
    if (this.keys['ArrowLeft'] && now - this.lastMoveTime > this.moveDelay) {
      this.movePiece(-1, 0);
      this.lastMoveTime = now;
    }
    if (this.keys['ArrowRight'] && now - this.lastMoveTime > this.moveDelay) {
      this.movePiece(1, 0);
      this.lastMoveTime = now;
    }
    if (this.keys['ArrowDown']) {
      this.movePiece(0, 1);
    }
  }
  
  draw() {
    // Tøm canvas
    this.ctx.fillStyle = 'rgba(0, 20, 40, 0.9)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Tegn rutenett
    this.drawGrid();
    
    // Tegn plasserte blokker
    this.drawBoard();
    
    // Tegn nåværende blokk
    if (this.currentPiece) {
      this.drawPiece(this.pieceX, this.pieceY, this.currentPiece.rotations[this.currentRotation], this.currentPiece.color, this.currentPiece);
    }
    
    // Tegn skygge
    this.drawGhost();
  }
  
  drawGrid() {
    this.ctx.strokeStyle = 'rgba(74, 144, 226, 0.2)';
    this.ctx.lineWidth = 1;
    
    for (let x = 0; x <= this.BOARD_WIDTH; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * this.BLOCK_SIZE, 0);
      this.ctx.lineTo(x * this.BLOCK_SIZE, this.canvas.height);
      this.ctx.stroke();
    }
    
    for (let y = 0; y <= this.BOARD_HEIGHT; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * this.BLOCK_SIZE);
      this.ctx.lineTo(this.canvas.width, y * this.BLOCK_SIZE);
      this.ctx.stroke();
    }
  }
  
  drawBoard() {
    for (let row = 0; row < this.BOARD_HEIGHT; row++) {
      for (let col = 0; col < this.BOARD_WIDTH; col++) {
        if (this.board[row][col]) {
          this.drawBlock(col * this.BLOCK_SIZE, row * this.BLOCK_SIZE, this.board[row][col]);
        }
      }
    }
  }
  
  drawPiece(x, y, shape, color, piece = null) {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const blockX = (x + col) * this.BLOCK_SIZE;
          const blockY = (y + row) * this.BLOCK_SIZE;
          
          // Finn tekst for denne blokken
          let text = null;
          if (piece && piece.name) {
            // Bruk første del av navnet eller forkortelse
            const words = piece.name.split(' ');
            text = words[0].length <= 6 ? words[0] : words[0].substring(0, 4);
          }
          
          this.drawBlock(blockX, blockY, color, text);
        }
      }
    }
  }
  
  drawBlock(x, y, color, text = null, isSmall = false) {
    // Hovedblokk
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, this.BLOCK_SIZE, this.BLOCK_SIZE);
    
    // Lysere kant for 3D-effekt
    this.ctx.fillStyle = this.lightenColor(color, 0.3);
    this.ctx.fillRect(x, y, this.BLOCK_SIZE - 2, this.BLOCK_SIZE - 2);
    
    // Mørkere kant
    this.ctx.fillStyle = this.darkenColor(color, 0.3);
    this.ctx.fillRect(x + 2, y + 2, this.BLOCK_SIZE - 4, this.BLOCK_SIZE - 4);
    
    // Hovedfarge
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x + 3, y + 3, this.BLOCK_SIZE - 6, this.BLOCK_SIZE - 6);
    
    // Legg til tekst hvis spesifisert
    if (text) {
      this.ctx.fillStyle = 'white';
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 1;
      this.ctx.font = isSmall ? '8px Arial' : '10px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      
      const centerX = x + this.BLOCK_SIZE / 2;
      const centerY = y + this.BLOCK_SIZE / 2;
      
      // Tekst med skygge
      this.ctx.strokeText(text, centerX, centerY);
      this.ctx.fillText(text, centerX, centerY);
    }
  }
  
  drawGhost() {
    if (!this.currentPiece) return;
    
    let ghostY = this.pieceY;
    const shape = this.currentPiece.rotations[this.currentRotation];
    
    // Finn hvor blokken ville lande
    while (!this.isCollision(this.pieceX, ghostY + 1, shape)) {
      ghostY++;
    }
    
    // Tegn skygge (uten tekst for å ikke forvirre)
    this.ctx.globalAlpha = 0.3;
    this.drawPiece(this.pieceX, ghostY, shape, this.currentPiece.color);
    this.ctx.globalAlpha = 1.0;
  }
  
  drawNextPiece() {
    if (!this.nextPiece) return;
    
    // Tøm next canvas
    this.nextCtx.fillStyle = 'rgba(0, 20, 40, 0.9)';
    this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
    
    const shape = this.nextPiece.rotations[0];
    const blockSize = 25;
    
    // Sentrer blokken
    const offsetX = (this.nextCanvas.width - shape[0].length * blockSize) / 2;
    const offsetY = (this.nextCanvas.height - shape.length * blockSize) / 2;
    
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const x = offsetX + col * blockSize;
          const y = offsetY + row * blockSize;
          
          this.nextCtx.fillStyle = this.nextPiece.color;
          this.nextCtx.fillRect(x, y, blockSize, blockSize);
          
          // 3D-effekt
          this.nextCtx.fillStyle = this.lightenColor(this.nextPiece.color, 0.3);
          this.nextCtx.fillRect(x, y, blockSize - 2, blockSize - 2);
          
          this.nextCtx.fillStyle = this.nextPiece.color;
          this.nextCtx.fillRect(x + 2, y + 2, blockSize - 4, blockSize - 4);
        }
      }
    }
  }
  
  lightenColor(color, amount) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * amount * 100);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }
  
  darkenColor(color, amount) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * amount * 100);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
      (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
      (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
  }
  
  updateUI() {
    document.getElementById('score').textContent = this.score;
    document.getElementById('level').textContent = this.level;
  }
  
  updatePieceInfo() {
    // Oppdater nåværende blokk info
    if (this.currentPiece) {
      const currentInfo = document.getElementById('currentPieceInfo');
      if (currentInfo) {
        currentInfo.querySelector('.piece-name').textContent = this.currentPiece.name;
        currentInfo.querySelector('.piece-subtitle').textContent = this.currentPiece.subtitle;
        currentInfo.querySelector('.piece-description').textContent = this.currentPiece.description;
      }
    }
    
    // Oppdater neste blokk info
    if (this.nextPiece) {
      const nextInfo = document.getElementById('nextPieceInfo');
      if (nextInfo) {
        nextInfo.querySelector('.piece-name').textContent = this.nextPiece.name;
        nextInfo.querySelector('.piece-subtitle').textContent = this.nextPiece.subtitle;
        nextInfo.querySelector('.piece-description').textContent = this.nextPiece.description;
      }
    }
  }
  
  gameLoop(currentTime = 0) {
    if (!this.gameRunning) return;
    
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    this.update(deltaTime);
    this.draw();
    
    if (!this.gamePaused) {
      requestAnimationFrame((time) => this.gameLoop(time));
    }
  }
  
  start() {
    this.gameRunning = true;
    this.gamePaused = false;
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.dropTime = 0;
    this.dropInterval = 1000;
    
    // Reset brett
    this.board = Array(this.BOARD_HEIGHT).fill().map(() => Array(this.BOARD_WIDTH).fill(0));
    
    this.updateUI();
    this.spawnNewPiece();
    this.gameLoop();
  }
  
  gameOver() {
    this.gameRunning = false;
    document.getElementById('finalScore').textContent = this.score;
    document.getElementById('gameOverScreen').style.display = 'flex';
    document.getElementById('gameContainer').style.display = 'none';
  }
}

// Global spillinstans
let tetrisGame;

// Kontroll-funksjoner
function startGame() {
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('gameContainer').style.display = 'flex';
  
  tetrisGame = new TetrisGame();
  tetrisGame.start();
}

function restartGame() {
  document.getElementById('gameOverScreen').style.display = 'none';
  document.getElementById('gameContainer').style.display = 'flex';
  
  tetrisGame = new TetrisGame();
  tetrisGame.start();
}

function goHome() {
  window.location.href = '/spill';
}

// Start når siden lastes
document.addEventListener('DOMContentLoaded', function() {
  console.log('🌊 Bölger av Mot Tetris lastet!');
});
