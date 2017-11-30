let monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function monthInWord(monthNumber) {
  return monthNames[monthNumber - 1];
}

module.exports = monthInWord;