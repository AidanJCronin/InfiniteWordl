const readline = require('readline');
const fs = require('fs');

const wordListFilePath = 'commonwords.txt'; // Change this to the path of your word list file

const fourLetterWords = [];

const readInterface = readline.createInterface({
  input: fs.createReadStream(wordListFilePath),
  output: process.stdout,
  console: false
});

readInterface.on('line', function (line) {
  if (line.length === 4) {
    fourLetterWords.push(line.toLowerCase()); // Convert to lowercase if needed
  }
});

readInterface.on('close', function () {
  console.log(JSON.stringify(fourLetterWords, null, 2));
});