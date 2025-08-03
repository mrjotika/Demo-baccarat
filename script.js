const playerCardsEl = document.getElementById('player-cards');
const bankerCardsEl = document.getElementById('banker-cards');
const statusEl = document.getElementById('status');

let lastBetTime = Date.now();

function getRandomCard() {
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const suits = ['♠️', '♥️', '♦️', '♣️'];
  const rank = ranks[Math.floor(Math.random() * ranks.length)];
  const suit = suits[Math.floor(Math.random() * suits.length)];
  return `${rank}${suit}`;
}

function dealCardTo(targetEl, delay = 0) {
  setTimeout(() => {
    const cardEl = document.createElement('div');
    cardEl.className = 'card animate';
    cardEl.textContent = getRandomCard();
    targetEl.appendChild(cardEl);
  }, delay);
}

function clearTable() {
  playerCardsEl.innerHTML = '';
  bankerCardsEl.innerHTML = '';
}

function calculatePoints(cards) {
  const faceMap = { A: 1, J: 0, Q: 0, K: 0 };
  return cards.reduce((sum, card) => {
    let rank = card.textContent.slice(0, -1);
    let val = faceMap[rank] !== undefined ? faceMap[rank] : Math.min(parseInt(rank), 10);
    return (sum + val) % 10;
  }, 0);
}

function playDemo() {
  lastBetTime = Date.now();
  clearTable();
  statusEl.textContent = "Đang chia bài...";

  // Chia 2 lá mỗi bên
  for (let i = 0; i < 2; i++) {
    dealCardTo(playerCardsEl, i * 700);
    dealCardTo(bankerCardsEl, i * 700 + 350);
  }

  setTimeout(() => {
    const playerPoints = calculatePoints([...playerCardsEl.children]);
    const bankerPoints = calculatePoints([...bankerCardsEl.children]);
    let winner = 'Hoà';
    if (playerPoints > bankerPoints) winner = 'Player thắng!';
    else if (bankerPoints > playerPoints) winner = 'Banker thắng!';
    statusEl.textContent = `Player: ${playerPoints} vs Banker: ${bankerPoints} ➜ ${winner}`;
  }, 2000);
}

function startIdleChecker() {
  setInterval(() => {
    const now = Date.now();
    if (now - lastBetTime >= 60000) {
      playDemo();
    }
  }, 5000);
}

startIdleChecker();
