document.addEventListener('DOMContentLoaded', function() {
  const elements = {
    loginForm: document.getElementById('loginForm'),
    createAccountForm: document.getElementById('createAccountForm'),
    createAccountButton: document.getElementById('createAccountButton'),
    addAnotherAccountButton: document.getElementById('addAnotherAccountButton'),
    homeImage: document.getElementById('home-image'),
    transactionHistoryElement: document.getElementById('transaction-history'),
    allDataContent: document.getElementById('allDataContent'),
    userTableBody: document.getElementById('userTableBody'),
    balanceElement: document.getElementById('balance'),
    depositForm: document.getElementById('depositForm'),
    depositButton: document.getElementById('depositButton'),
    withdrawForm: document.getElementById('withdrawForm'),
    withdrawButton: document.getElementById('withdrawButton'),
    userCounter: document.getElementById('userCounter')
  };

  const localStorageKey = {
    isLoggedIn: 'isLoggedIn',
    balance: 'balance',
    transactions: 'transactions',
    users: 'users'
  };

  const initBalance = parseFloat(localStorage.getItem(localStorageKey.balance)) || 0;
  let balance = elements.balanceElement ? initBalance : 0;
  if (elements.balanceElement) elements.balanceElement.textContent = balance.toFixed(2);

  let transactions = JSON.parse(localStorage.getItem(localStorageKey.transactions)) || [];
  let users = JSON.parse(localStorage.getItem(localStorageKey.users)) || [];

  const setLoginStatus = status => localStorage.setItem(localStorageKey.isLoggedIn, status);

  const showElement = element => element.classList.remove('hidden');
  const hideElement = element => element.classList.add('hidden');

  const updateTransactionHistory = () => {
    transactions.forEach(transaction => {
      const transactionItem = document.createElement('div');
      transactionItem.className = 'transaction-item';
      transactionItem.innerHTML = `
        <p><strong>${transaction.type}:</strong> $${transaction.amount.toFixed(2)}</p>
        <p><em>${transaction.date}</em></p>
      `;
      elements.transactionHistoryElement.appendChild(transactionItem);
    });
  };

  const validateInputLength = (input, length) => input.length >= length;
  const validateEmail = email => email.includes('@');
  const validateNumber = input => !isNaN(input) && input > 0;

  const handleFormSubmission = (event, validators, successCallback) => {
    event.preventDefault();
    const errorMessages = validators.reduce((errors, validator) => {
      const [isValid, message] = validator();
      if (!isValid) errors.push(message);
      return errors;
    }, []);
    
    if (errorMessages.length > 0) {
      alert(errorMessages.join('\n'));
    } else {
      successCallback();
    }
  };

  const addTransaction = (type, amount) => {
    const transaction = { type, amount, date: new Date().toLocaleString() };
    transactions.push(transaction);
    localStorage.setItem(localStorageKey.transactions, JSON.stringify(transactions));
  };

  const addUser = user => {
    users.push(user);
    localStorage.setItem(localStorageKey.users, JSON.stringify(users));
  };

  const setupForm = (form, button, callback) => {
    form.querySelector('input').addEventListener('input', function() {
      const amount = parseFloat(this.value);
      button.classList.toggle('disabled', isNaN(amount) || amount <= 0);
    });
    
    button.addEventListener('click', function(event) {
      event.preventDefault();
      callback();
    });
  };

  if (localStorage.getItem(localStorageKey.isLoggedIn) === 'true' && elements.homeImage) {
    showElement(elements.homeImage);
  }

  if (elements.loginForm) {
    elements.loginForm.addEventListener('submit', function(event) {
      handleFormSubmission(event, [
        () => [validateInputLength(document.getElementById('username').value, 8), 'Username must be at least 8 characters long.'],
        () => [validateInputLength(document.getElementById('password').value, 8), 'Password must be at least 8 characters long.']
      ], () => {
        setLoginStatus('true');
        window.location.href = 'index.html';
      });
    });
  }

  if (elements.createAccountForm) {
    elements.createAccountButton.addEventListener('click', function(event) {
      handleFormSubmission(event, [
        () => [validateInputLength(document.getElementById('name').value, 1), 'Name cannot be blank.'],
        () => [validateEmail(document.getElementById('email').value), 'Enter a valid email address.'],
        () => [validateInputLength(document.getElementById('username').value, 8), 'Username must be at least 8 characters.'],
        () => [validateInputLength(document.getElementById('password').value, 8), 'Password must be at least 8 characters.']
      ], () => {
        document.getElementById('message').textContent = 'Account created successfully!';
        addUser({
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          username: document.getElementById('username').value,
          password: document.getElementById('password').value
        });
        elements.createAccountForm.reset();
        elements.createAccountButton.classList.add('disabled');
        showElement(elements.addAnotherAccountButton);
      });
    });

    elements.addAnotherAccountButton.addEventListener('click', function() {
      elements.createAccountForm.reset();
      document.getElementById('message').textContent = '';
      elements.createAccountButton.classList.add('disabled');
      hideElement(elements.addAnotherAccountButton);
    });

    document.getElementById('name').addEventListener('input', function() {
      elements.createAccountButton.classList.remove('disabled');
    });
  }

  if (elements.depositForm) {
    setupForm(elements.depositForm, elements.depositButton, () => {
      const amount = parseFloat(document.getElementById('amount').value);
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
      }
      if (amount < 0) {
        alert('Please enter a positive amount.');
        return;
      }
      balance += amount;
      elements.balanceElement.textContent = balance.toFixed(2);
      localStorage.setItem(localStorageKey.balance, balance);
      document.getElementById('amount').value = '';
      elements.depositButton.classList.add('disabled');
      addTransaction('Deposit', amount);
      alert('Deposit successful!');
    });
  }

  if (elements.withdrawForm) {
    setupForm(elements.withdrawForm, elements.withdrawButton, () => {
      const amount = parseFloat(document.getElementById('amount').value);
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
      }
      if (amount > balance) {
        alert('Insufficient funds. Please enter a valid amount.');
        return;
      }
      balance -= amount;
      elements.balanceElement.textContent = balance.toFixed(2);
      localStorage.setItem(localStorageKey.balance, balance);
      document.getElementById('amount').value = '';
      elements.withdrawButton.classList.add('disabled');
      addTransaction('Withdraw', amount);
      alert('Withdraw successful!');
    });
  }

  if (elements.transactionHistoryElement) {
    updateTransactionHistory();
  }

  if (elements.userTableBody) {
    elements.userTableBody.innerHTML = users.map((user, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${user.username}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.password}</td>
      </tr>
    `).join('');
  }

  const navItems = {
    'index.html': 'navHome',
    'deposit.html': 'navDeposit',
    'withdraw.html': 'navWithdraw',
    'transactions.html': 'navTransactions',
    'create-account.html': 'navCreateAccount',
    'login.html': 'navLogin',
    'all-data.html': 'navAllData'
  };

  const path = window.location.pathname.split('/').pop();
  if (navItems[path]) {
    document.getElementById(navItems[path]).classList.add('active');
  }

  // User counter logic
  let userCount = 0;
  if (elements.userCounter) {
    const updateUserCounter = () => {
      elements.userCounter.textContent = `${userCount} users exposed and counting!`;
      userCount++;
    };
    setInterval(updateUserCounter, 2000);
  }
});
