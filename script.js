const playerCardsEl = document.getElementById('player-cards');
const bankerCardsEl = document.getElementById('banker-cards');
const statusEl = document.getElementById('status');

const dealSound = document.getElementById('deal-sound');
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');

let lastBetTime = Date.now();

function getRandomCard() {
  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const suits = ['♠️','♥️','♦️','♣️'];
  const rank = ranks[Math.floor(Math.random()*ranks.length)];
  const suit = suits[Math.floor(Math.random()*suits.length)];
  return `${rank}${suit}`;
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

function dealCardTo(targetEl, card, delay = 0) {
  setTimeout(() => {
    const el = document.createElement('div');
    el.className = 'card';
    el.textContent = card;
    targetEl.appendChild(el);
    dealSound.play();
  }, delay);
}

function clearTable() {
  playerCardsEl.innerHTML = '';
  bankerCardsEl.innerHTML = '';
}

function playDemo() {
  lastBetTime = Date.now();
  clearTable();
  statusEl.textContent = "🎴 Chia bài...";

  const playerHand = [getRandomCard(), getRandomCard()];
  const bankerHand = [getRandomCard(), getRandomCard()];

  for (let i = 0; i < 2; i++) {
    dealCardTo(playerCardsEl, playerHand[i], i * 800);
    dealCardTo(bankerCardsEl, bankerHand[i], i * 800 + 400);
  }

  setTimeout(() => {
    let playerTotal = calculatePoints(playerHand);
    let bankerTotal = calculatePoints(bankerHand);

    // natural win
    if (playerTotal >= 8 || bankerTotal >= 8) {
      finish(playerHand, bankerHand, playerTotal, bankerTotal);
      return;
    }

    let playerDraws = false;
    let bankerDraws = false;
    let playerThird = null;
    let bankerThird = null;

    // Player rules
    if (playerTotal <= 5) {
      playerDraws = true;
      playerThird = getRandomCard();
      playerHand.push(playerThird);
      dealCardTo(playerCardsEl, playerThird, 1800);
    }

    // Banker rules
    setTimeout(() => {
      bankerTotal = calculatePoints(bankerHand);
      playerTotal = calculatePoints(playerHand);
      const thirdVal = playerThird ? cardValue(playerThird) : null;

      if (!playerDraws) {
        if (bankerTotal <= 5) {
          bankerDraws = true;
        }
      } else {
        if (bankerTotal <= 2) {
          bankerDraws = true;
        } else if (bankerTotal === 3 && thirdVal !== 8) {
          bankerDraws = true;
        } else if (bankerTotal === 4 && thirdVal >= 2 && thirdVal <= 7) {
          bankerDraws = true;
        } else if (bankerTotal === 5 && thirdVal >= 4 && thirdVal <= 7) {
          bankerDraws = true;
        } else if (bankerTotal === 6 && (thirdVal === 6 || thirdVal === 7)) {
          bankerDraws = true;
        }
      }

      if (bankerDraws) {
        bankerThird = getRandomCard();
        bankerHand.push(bankerThird);
        dealCardTo(bankerCardsEl, bankerThird, 500);
      }

      setTimeout(() => {
        playerTotal = calculatePoints(playerHand);
        bankerTotal = calculatePoints(bankerHand);
        finish(playerHand, bankerHand, playerTotal, bankerTotal);
      }, 1000);
    }, 1000);

  }, 2000);
}

function finish(playerHand, bankerHand, pt, bt) {
  let winner = "Hòa!";
  if (pt > bt) {
    winner = "🎉 PLAYER thắng!";
    winSound.play();
  } else if (bt > pt) {
    winner = "🎉 BANKER thắng!";
    loseSound.play();
  } else {
    winner = "🤝 Hòa điểm!";
  }
  statusEl.textContent = `PLAYER: ${pt} - BANKER: ${bt} → ${winner}`;
}

function startIdleChecker() {
  setInterval(() => {
    if (Date.now() - lastBetTime >= 60000) playDemo();
  }, 5000);
}

startIdleChecker();
