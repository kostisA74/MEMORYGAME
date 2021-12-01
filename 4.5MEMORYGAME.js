let lowestScore
let openCards = []
let foundCards = []
let score = 0
let time = 0
let shuffledColors = []
let COLORS = [] //to store 5 random colors

const gameContainer = document.querySelector('.game');
const scoreLabel = document.querySelector('#score')
const gameResultContainer = document.querySelector('.gameResult')
const startButton = document.querySelector('#startButton')
const restartButton = document.querySelector('#restartButton')
const lowestScoreLabel = document.querySelector('#lowestScore')

restartButton.disabled = true //available only after game first start
getLowestScore()
createColors()

startButton.addEventListener('click', 
                              function(){
                                gameContainer.classList.add('started')
                                shuffledColors = shuffle(COLORS);
                                createDivsForColors(shuffledColors);
                                startButton.disabled = true // available only when page is first loaded or refreshed 
                                restartButton.disabled = false
                            })
restartButton.addEventListener('click',
                              function(){
                                while (gameContainer.firstChild) {
                                  gameContainer.removeChild(gameContainer.firstChild)
                                }
                                gameContainer.classList.remove("gameOver")
                                gameResultContainer.classList.remove("gameOver")
                                gameContainer.classList.add('started')
                                createColors()
                                shuffledColors = shuffle(COLORS);
                                createDivsForColors(shuffledColors);
                                score = 0
                                scoreLabel.innerText = `${score}`// .toString(10)
                                getLowestScore()
                              })

function getLowestScore(){
  if (localStorage.lowestScore) //get lowest score from local storage
  {
    lowestScore = JSON.parse(localStorage.lowestScore)
    lowestScoreLabel.innerText = lowestScore
  }
  else {
    lowestScore = 1000 //or set lowest score to 1000 to store the first score obtained as lowest
    lowestScoreLabel.innerText = "-"
  }
}

function createColors(){
  COLORS = []
  for (let i=0; i<5; i++){ //create & store 5 random colors and store them twice each to COLORS array
    const color = randomColour()
    COLORS.push(color)
    COLORS.push(color) 
  }
}

function randomColour(){ //functions that creates a random color to use
  const r = Math.floor(Math.random()*255+1)
  const g = Math.floor(Math.random()*255+1)
  const b = Math.floor(Math.random()*255+1)
  const rcolor = `rgb(${r},${g},${b})`
  return rcolor
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;
  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    const newDiv = document.createElement("div"); // create a new div
    newDiv.classList.add('card') // give it a class attribute for the value we are looping over
    newDiv.setAttribute('cardColor', color); //Give an attribute to be used for the hidden color to be stored
    //newDiv.style.backgroundColor = 'rgb(0,0,0)'
    newDiv.addEventListener("click", handleCardClick);
    newDiv.innerText ="?"
    gameContainer.append(newDiv);
  }
}

function handleCardClick(event) { // TODO: Implement this function!
  // you can use event.target to see which element was clicked
  const selectedCard = event.target
  const isOpen = openCards.indexOf(selectedCard) 
  const isFound = foundCards.indexOf(selectedCard)
  if (isOpen === -1 && isFound ===-1){
    if (openCards.length < 2) {
      selectedCard.classList.add('opening')
      selectedCard.style.backgroundColor = selectedCard.getAttribute('cardColor')
      openCards.push(selectedCard)
      if (openCards.length === 2){
        if (selectedCard.getAttribute('cardColor') === openCards[0].getAttribute('cardColor')){
          for (let i=0; i<2; i++){
            foundCards.push(openCards[i])
          }
          openCards = []
          score ++
          scoreLabel.innerText = score
          if (foundCards.length === 10) { //END OF GAME
            foundCards = []
            gameContainer.classList.add("gameOver")
            setTimeout(function(){gameResultContainer.classList.add("gameOver")},2000)
            if (score < lowestScore){
              localStorage.setItem('lowestScore', JSON.stringify(score))
            }
          }
        }
        else {
          setTimeout(function(){
            for (let i=0; i<2; i++){
              openCards[i].classList.remove("opening")
              openCards[i].style.backgroundColor = 'rgb(255,255,255)';
            }
            openCards = []
            score ++
            scoreLabel.innerText = score
          }, 2000)
        }
      }
    }
  }
  
}

// when the DOM loads

