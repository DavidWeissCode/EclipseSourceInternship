/* exported questionsArray */
var questionsArray = [
  {
    "question" : "Which of the following integers are multiples of both 2 and 3?",
    "answers" : [ "21","18","32" ],
    "correctAnswers" : [1]
  },
  {
    "question" : "How many fingers does Homer Simpson have?",
    "answers" : [ "Eight","Nine","Ten"],
    "correctAnswers" : [0]
  },
  {
    "question" : "What's Fran's last name on The Nanny?",
    "answers" : [ "Cline", "Fine", "Zine" ],
    "correctAnswers" : [1]
  },
  {
    "question" : "How many friends are there in Friends?",
    "answers" : [ "Six", "Five", "6"],
    "correctAnswers" : [0, 2]
  },
  {
    "question" : "What TV star did 500,000 people show up to watch sing at the Berlin Wall?",
    "answers" : [ "David Hasselhoff","Michael Jackson","William Shatner" ],
    "correctAnswers" : [0]
  }
];

function shuffleArray(array) {
  var remainingElements = array.length, randomIndexInRange, temp;
  while (remainingElements > 0) {
    randomIndexInRange = Math.floor(Math.random() * remainingElements--);
    temp = array[remainingElements];
    array[remainingElements] = array[randomIndexInRange];
    array[randomIndexInRange] = temp;
  }
  return array;
}
