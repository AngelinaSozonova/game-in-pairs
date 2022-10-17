window.addEventListener('DOMContentLoaded', () => {
  let open = false;
  let lockCard = false;
  let allOpenCard = false;
  let firstCard, secondCard;
  let vertically;
  let horizontally;
  let timer;
  const WIDTH_CARD = 300;
  const MARGIN_BETWEEN_CARD = 30;

  function checkSettings() {
    const settings = document.querySelector('.settings-game');
    const btnSetting = document.querySelector('.settings-game__btn');

    if(settings.classList.contains('settings-game-open')) {
      const inputHorizontal = document.getElementById('horizontal');
      const inputVertical = document.getElementById('vertical');

      btnSetting.addEventListener('click', () => {
        horizontally = Number(inputHorizontal.value);
        vertically = Number(inputVertical.value);

        if (!((horizontally % 2 === 0 && horizontally <= 10) && (vertically % 2 === 0 && vertically <= 10))) {
          horizontally = 4;
          vertically = 4;
        }

        resetCard();
        startGame();
        settings.classList.remove('settings-game-open');
      })
    }
  }

  function sortFisher(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function addNewCard(number) {
    const list = document.querySelector('.main__list');

    let newCard = document.createElement('li');
    newCard.classList.add('main__item');

    let front = document.createElement('div');
    front.classList.add('main-item__front');

    let back = document.createElement('div');
    back.classList.add('main-item__back');

    back.textContent = number;

    list.appendChild(newCard);
    newCard.appendChild(front);
    newCard.appendChild(back);
  }

  function createArray(vertically, horizontally) {
    lengthArray = vertically * horizontally / 2;
    let arr = [];
    for (let i = 1; i < lengthArray + 1; i++) {
      arr.push(i);
      arr.push(i);
    }
    return arr;
  }

  function deleteEvent() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
  }

  function gameOver() {
    const blockGame = document.querySelector('.game-over');
    const blockSettings = document.querySelector('.settings-game');
    const btnGame = document.querySelector('.game-over__btn');
    const btnSettings = document.querySelector('.game-over__btn-settings');
    blockGame.classList.add('game-over-open');

    btnGame.addEventListener('click', () => {
      blockGame.classList.remove('game-over-open');
      resetCard();
      startGame();
    });

    btnSettings.addEventListener('click', () => {
      blockGame.classList.remove('game-over-open');
      blockSettings.classList.add('settings-game-open');
    });
  }

  function resetCard() {
    const cards = document.querySelectorAll('.main__item');
    for (let card of cards) {
      card.remove();
    }
  }

  function flipCard() {
    if(lockCard) return;

    this.classList.add('open');
    this.firstElementChild.classList.add('hidden-front');
    this.lastElementChild.classList.add('open-back');

    if (!open) {
      open = true;
      firstCard = this;
      return;
    }

    secondCard = this;
    open = false;

    if (firstCard.lastElementChild.textContent === secondCard.lastElementChild.textContent) {
      deleteEvent();
      setTimeout(() => {
        firstCard.lastElementChild.classList.add('main-item__check');
        secondCard.lastElementChild.classList.add('main-item__check');
      }, 700)

      const cardsOpen = document.querySelectorAll('.open');
      const cards = document.querySelectorAll('.main__item');
      if (cardsOpen.length === cards.length) {
        allOpenCard = true;
        gameOver();
      }

      return;
    }

    lockCard = true;

    setTimeout(() => {
      firstCard.classList.remove('open');
      secondCard.classList.remove('open');
      firstCard.firstElementChild.classList.remove('hidden-front');
      firstCard.lastElementChild.classList.remove('open-back');
      secondCard.firstElementChild.classList.remove('hidden-front');
      secondCard.lastElementChild.classList.remove('open-back');

      lockCard = false;
    }, 1000);


  }

  function startGame() {
    if(allOpenCard) allOpenCard = false;

    startTimer();

    let container = document.querySelector('.container');

    let arrayNumberCard = createArray(vertically, horizontally);
    sortFisher(arrayNumberCard);

    let widthConatainer = horizontally * WIDTH_CARD + MARGIN_BETWEEN_CARD * (horizontally-1);
    container.style.maxWidth = widthConatainer + 60 + 'px';

    for (let x of arrayNumberCard) {
      addNewCard(x);
    }

    const cards = document.querySelectorAll('.main__item');
    for (let card of cards) {
      card.addEventListener('click', flipCard);
    }
  }

  function startTimer() {
    let time = 60;
    const blockTimer = document.querySelector('.main__timer-items');

    timer = setInterval(() => {
      let minutes = Math.floor(time / 60);
      let seconds = time % 60;
      seconds = seconds < 10 ? '0' + seconds:seconds;
      minutes = minutes < 10 ? '0' + minutes:minutes;
      blockTimer.innerHTML = `${minutes}:${seconds}`;
      time--;

      if(time < 0) {
        clearInterval(timer);
        gameOver();
      }

      if(allOpenCard) {
        clearInterval(timer);
      }
    }, 1000);
  }

  checkSettings();
});
