const playerCardsEl = document.getElementById('player-cards');
const bankerCardsEl = document.getElementById('banker-cards');
const statusEl = document.getElementById('status');
const timerEl = document.getElementById('timer');

const dealSound = document.getElementById('deal-sound');
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');

let countdown = 60;
let countdownInterval;
let lastBetTime = Date.now();
let selectedBet = null;

function startCountdown() {
  clearInterval(countdownInterval);
  countdown = 60;
  timerEl.textContent = countdown;

  countdownInterval = setInterval(() => {
    countdown--;
    timerEl.textContent = countdown;
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      playDemo(); // auto demo nếu không chơi
    }
  }, 1000);
}

function selectBet(choice) {
  selectedBet = choice;
  statusEl.textContent = `Bạn chọn cược: ${choice.toUpperCase()}`;
  lastBetTime = Date.now();
  countdown = 60;
  timerEl.textContent = countdown;
}

function getRandomCard() {
  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const suits = ['♠️','♥️','♦️','♣️'];
  return `${ranks[Math.floor(Math.random()*ranks.length)]}${suits[Math.floor(Math.random()*suits.length)]}`;
}

function cardValue(card) {
  const rank = card.slice(0, -1);
  if (['J','Q','K'].includes(rank)) return 0;
  if (rank === 'A') return 1;
  return parseInt(rank);
}

function calculatePoints(cards) {
  return cards.reduce((sum, c) => (sum + cardValue(c)) % 10, 0);
}

function clearTable() {
  playerCardsEl.innerHTML = '';
  bankerCardsEl.innerHTML = '';
}

function dealCardTo(targetEl, card, delay = 0) {
  setTimeout(() => {
    const el = document.createElement('div');
    el.className = 'card';
    el.textContent = card;
    targetEl.appendChild(el);
    dealSound.play();
  }, delay);
}

function playDemo() {
  lastBetTime = Date.now();
  clearTable();
  statusEl.textContent = "🎴 Đang chia bài...";
  clearInterval(countdownInterval);

  const playerHand = [getRandomCard(), getRandomCard()];
  const bankerHand = [getRandomCard(), getRandomCard()];

  for (let i = 0; i < 2; i++) {
    dealCardTo(playerCardsEl, playerHand[i], i * 700);
    dealCardTo(bankerCardsEl, bankerHand[i], i * 700 + 400);
  }

  setTimeout(() => {
    let pt = calculatePoints(playerHand);
    let bt = calculatePoints(bankerHand);
    if (pt >= 8 || bt >= 8) {
      finish(playerHand, bankerHand, pt, bt);
      return;
    }

    let playerThird = null, bankerThird = null;
    if (pt <= 5) {
      playerThird = getRandomCard();
      playerHand.push(playerThird);
      dealCardTo(playerCardsEl, playerThird, 1600);
    }

    setTimeout(() => {
      const thirdVal = playerThird ? cardValue(playerThird) : null;
      bt = calculatePoints(bankerHand);

      let bankerDraw = false;
      if (!playerThird && bt <= 5) bankerDraw = true;
      else if (playerThird) {
        if (bt <= 2) bankerDraw = true;
        else if (bt === 3 && thirdVal !== 8) bankerDraw = true;
        else if (bt === 4 && thirdVal >= 2 && thirdVal <= 7) bankerDraw = true;
        else if (bt === 5 && thirdVal >= 4 && thirdVal <= 7) bankerDraw = true;
        else if (bt === 6 && (thirdVal === 6 || thirdVal === 7)) bankerDraw = true;
      }

      if (bankerDraw) {
        bankerThird = getRandomCard();
        bankerHand.push(bankerThird);
        dealCardTo(bankerCardsEl, bankerThird, 500);
      }

      setTimeout(() => {
        pt = calculatePoints(playerHand);
        bt = calculatePoints(bankerHand);
        finish(playerHand, bankerHand, pt, bt);
      }, 1000);
    }, 1000);
  }, 2000);
}

function finish(playerHand, bankerHand, pt, bt) {
  let winner = "Hòa";
  if (pt > bt) winner = "player";
  else if (bt > pt) winner = "banker";

  let resultText = `PLAYER: ${pt} - BANKER: ${bt} ➜ `;
  if (pt === bt) {
    resultText += "🤝 Hòa điểm!";
  } else {
    resultText += `${winner.toUpperCase()} thắng! 🎉`;
  }

  if (selectedBet === winner) {
    resultText += " ✅ Bạn THẮNG cược!";
    winSound.play();
  } else if (selectedBet && winner !== "Hòa") {
    resultText += " ❌ Bạn THUA cược.";
    loseSound.play();
  }

  statusEl.textContent = resultText;
  selectedBet = null;
  startCountdown(); // reset đếm ngược
}

startCountdown();
