let count = parseInt(localStorage.getItem("repCount")) || 0;

const countEl = document.getElementById("count");
countEl.textContent = count;

function updateCount(newCount) {
  count = newCount;
  localStorage.setItem("repCount", count);
  countEl.textContent = count;
}

function increment() {
  updateCount(count + 1);
}

function decrement() {
  if (count > 0) {
    updateCount(count - 1);
  }
}

function resetCount() {
  updateCount(0);
}
