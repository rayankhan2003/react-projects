const body = document.querySelector('body');
const btnDec = document.querySelector('.btn-dec');
const btnInc = document.querySelector('.btn-inc');
const counter = document.querySelector('.message');
let count = 0;

function decrease() {
  count--;
  counter.textContent = count;
  if (count > 0) {
    counter.style.color = 'green';
  } else if (count < 0) {
    counter.style.color = '#f0ad4e';
  } else {
    counter.style.color = '#fff';
  }
}

btnDec.addEventListener('click', decrease);

function increase() {
  count++;
  if (count > 0) {
    counter.style.color = 'green';
  } else if (count < 0) {
    counter.style.color = '#f0ad4e';
  } else {
    counter.style.color = '#fff';
  }
  counter.textContent = count;
}

btnInc.addEventListener('click', increase);
