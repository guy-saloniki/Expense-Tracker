const balance = document.getElementById('balance');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const list = document.getElementById('list');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const form = document.getElementById('form');

const localStoragTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions =
  localStorage.getItem('transactions') !== null ? localStoragTransactions : [];

// Add transaction
const addTransaction = (e) => {
  e.preventDefault();

  if (text.value === '' || amount.value === '') {
    alert('Please fill in all fields');
  } else {
    const transaction = {
      id: generateId(),
      text: text.value,
      amount: +amount.value,
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);

    displayBalance();

    text.value = '';
    amount.value = '';

    updateLocalStorage();
  }
};

// Generate id
const generateId = () => {
  return Math.floor(Math.random() * 1000000);
};

// Add transactions to DOM
const addTransactionDOM = (transaction) => {
  // Get sign
  const sign = transaction.amount < 0 ? '-' : '+';

  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
  ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span><button class="delete-btn" onclick="removeTransaction(${
    transaction.id
  })">x</button>
  `;

  list.appendChild(item);
};

// Remove transaction
const removeTransaction = (id) => {
  transactions = transactions.filter((transaction) => transaction.id !== id);

  updateLocalStorage();

  initApp();
};

// Display balance income & expense
const displayBalance = () => {
  const amounts = transactions.map((transaction) => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter((amount) => amount > 0)
    .reduce((acc, amount) => (acc += amount), 0)
    .toFixed(2);
  const expense = (
    amounts
      .filter((amount) => amount < 0)
      .reduce((acc, amount) => (acc += amount), 0) * -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  balance.style.color = `${total >= 0 ? '#2ecc71' : '#c0392b'}`;

  moneyPlus.innerText = `$${income}`;
  moneyMinus.innerText = `$${expense}`;
};

// Update local storage
const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
};

// Init app
const initApp = () => {
  list.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  displayBalance();
};

initApp();

form.addEventListener('submit', addTransaction);
