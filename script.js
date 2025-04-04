'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Fikadu Gebremedhin',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Abel Adhanom',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Mulugeta Teamrat',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Selomun Welegebriel',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Displaying the transactions
const displayMovements = function (acc) {
  containerMovements.innerHTML = '';

  acc.movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div> 
      `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

// Calculate total balance
const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov, i) => acc + mov, 0);

  labelBalance.innerHTML = `${acc.balance}€`;
};
// calcPrintBalance(account1.movements);

// Calculating Summary
const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    ?.reduce((acc, mov) => acc + mov, 0);
  // .reduce((acc, mov) => acc + mov);
  const out = acc.movements
    .filter(mov => mov <= 0)
    ?.reduce((acc, mov) => acc + mov, 0);
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumIn.innerHTML = `${income}€`;
  labelSumOut.innerHTML = `${Math.abs(out)}€`;
  labelSumInterest.textContent = `${interest}€`;
};

// Computing user names
const createUserNames = function (accs) {
  accs.forEach(acc => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(user => user[0])
      .join('');
  });
};
createUserNames(accounts);

// Displaying the Overall ui
const updateUi = function (account) {
  // display transaction
  displayMovements(account);

  // display balance
  calcPrintBalance(account);

  // display summary
  calcDisplaySummary(account);
};

const logOut = function () {
  containerApp.style.opacity = 0;
  labelWelcome.textContent = `Login to get started`;
};

// Implementing login
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submmiting
  e.preventDefault();
  const userName = inputLoginUsername.value.toLowerCase();
  const pin = Number(inputLoginPin.value);

  currentAccount = accounts.find(account => account.userName === userName);

  if (currentAccount?.pin === pin) {
    const [fname, lname] = currentAccount.owner.split(' ');

    // Display wellcome message
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome back, ${fname}`;

    // clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update the changes
    updateUi(currentAccount);
  }
});

// Transfering money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const reciever = inputTransferTo.value.toLowerCase();
  const amount = Number(inputTransferAmount.value);

  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();

  const recieverAccount = accounts.find(acc => acc.userName === reciever);
  if (
    currentAccount.userName !== recieverAccount?.userName &&
    amount > 0 &&
    currentAccount.balance >= amount
  ) {
    currentAccount?.movements.push(-amount);
    recieverAccount?.movements.push(amount);
  }
  // Update the changes
  updateUi(currentAccount);
});

// Request Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const requestedAmount = Number(inputLoanAmount.value);

  inputLoanAmount.value = '';
  inputLoanAmount.blur();

  const verifyLoan = currentAccount.movements.some(
    mov => mov > 0 && mov >= requestedAmount * 0.1
  );
  if (verifyLoan && requestedAmount > 0) {
    // Add movment
    currentAccount.movements.push(requestedAmount);

    // Update ui
    updateUi(currentAccount);
  }
});

// Delete Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const userName = inputCloseUsername.value.toLowerCase();
  const confirmPin = Number(inputClosePin.value);

  inputCloseUsername.value = inputClosePin.value = '';

  if (
    currentAccount?.userName === userName &&
    currentAccount?.pin == confirmPin
  ) {
    const index = accounts.findIndex(acc => acc.userName === userName);

    accounts.splice(index, 1);
    logOut();
  }
});

/*
/////////////////////////////////////////////////
console.log(accounts);

// const userNames = accounts.map(
//   account =>
//     account.owner
//       .toLowerCase()
//       .split(' ')
//       .map(user => user.at(0))
//       .join('')
*/

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/*
/////////////////////////////////////////////////
let arr = ['a', 'b', 'c', 'd', 'e'];

//SLICE doesn't mutate the original array
console.log(arr.slice(-2));
// console.log(arr.slice(-2));
// console.log(arr.slice());
// console.log([...arr]);
console.log(arr);

// SPLICE mutates the original array
console.log(arr.splice(-1));
console.log(arr);
arr.splice(1, 2);
console.log(arr);

// REVERSE mutates the original array
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());

// CONCAT doesn't mutate the original array
const letters = arr.concat(arr2);
console.log(letters);

// JOIN
console.log(letters.join('-'));
*/

/*
/////////////////////////////////////
// at
const arr = [21, 22, 23];
// console.log(arr.at(0));

console.log(arr.at());
*/

/*
////////////////////////////////////////////////
// FOREACH WITH ARRAYS
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
for (const [i, movement] of movements.entries()) {
  if (movement > 0) console.log(`Movement ${i + 1}: You Deposited ${movement}`);
  else console.log(`Movement ${i + 1}: you withdrew ${Math.abs(movement)}`);
}
console.log('----------- FOREACH -----------');
movements.forEach(function (mov, i, array) {
  if (mov > 0) console.log(`Movement ${i + 1}: You Deposited ${mov}`);
  else console.log(`Movement ${i + 1}: you withdrew ${Math.abs(mov)}`);
  // console.log(array);
});
*/

/*
////////////////////////////////////////////////////
// FOREACH IN MAPS AND SETS
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// MAP
console.log(currencies);
currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

// SET
const currenciesUnique = new Set(['USD', 'EUR', 'GBP', 'USD']);
currenciesUnique.forEach(function (value, _, set) {
  console.log(value);
  // console.log(set);
});

*/

/*
/////////////////////////////////////////////////////
// Challenge 1,
const checkDogs = function (dogsJulia, dogsKate) {
  const dogs = dogsJulia.slice(1, -2);
  const dogsArray = [...dogs, ...dogsKate];
  const checker = function (age, i) {
    const maturity =
      age >= 3 ? `an adult, and is ${age} years old` : 'still a puppy 🐶';
    console.log(`Dog number ${i + 1} is ${maturity}`);
  };
  dogsArray.forEach(checker);
};
checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
*/

/*
/////////////////////////////////////////////
// MAP METHOD  --- creates a brand new array
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUsd = 1.1;

const converedMov = movements.map(mov => mov * eurToUsd);
console.log(converedMov);

const movementsDescription = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);
console.log(movementsDescription);
*/

/*
//////////////////////////////////////////////
// FILTER mothod

const deposits = movements.filter(mov => mov > 0);
console.log(deposits);
const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);
*/

/*
//////////////////////////////////////////////////
// REDUCE method
// accumulator is like a snow ball
const balance = movements.reduce((acc, cur, i) => acc + cur, 0);
// console.log(`Iteration number ${i} accumulator ${acc}`);
console.log(balance);

// Calculate Maximum value
const max = movements.reduce(
  (acc, mov) => (acc > mov && acc) || mov,
  movements[0]
);
console.log(max);
*/

/*
/////////////////////////////////////////////////////
// Challenge 2,
const calcAverageHumanAge = function (ages) {
  return ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
};
console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));
*/

/*
/////////////////////////////////////////////////
// Chaining Methods
const eurToUsd = 1.1;
const calcDepositBalanceUsd = function (movements) {
  return movements
    .filter(mov => mov > 0)
    .map(eur => eur * eurToUsd)
    .reduce((acc, cur, i) => acc + cur, 0);
};

console.log(calcDepositBalanceUsd(account1.movements));
*/

/*
///////////////////////////////////////////////////////////
// FIND method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

const currentAccount = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(currentAccount);
*/

//////////////////////////////////////////////////////
// FINDINDEX method
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const findMov = movements.findIndex(mov => mov === 200);

/*
////////////////////////////////////////////////////////////
// SOME and EVERY arayy methods
const anyDeposits = movements.some(mov => mov > 0);
const allDeposits = movements.every(mov => mov > 0);
console.log(anyDeposits);
console.log(allDeposits);
*/

/*
/////////////////////////////////////////////////////////////
// FLAT and FLATMAP methods
// flat
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const deepArr = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(deepArr.flat(2));

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);

// const allMovements = accountMovements.flat();
// console.log(allMovements);

// const overAllBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overAllBalance);

const allBalance1 = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(allBalance1);

// flatMap
const allBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(allBalance2);
*/
