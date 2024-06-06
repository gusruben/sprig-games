/*
@title: Slot Machine
@author: Alexander Li
@discord: thefaix.
@tags: ["classic", "tool"]
@img: ""
@addedOn: 2024-05-23
*/

const slot = "s"
const symbol7 = "7"
const symbolC = "C"
const symbolB = "B"
const symbolX = "X"
const winSign = "W"

const symbols = [symbol7, symbolC, symbolB, symbolX]

setLegend(
  [ slot, bitmap`
................
................
................
................
................
................
................
................
................
................
................
................
................
................
................
................` ],
  [ symbol7, bitmap`
................
..444...........
..44444444......
..4444444444....
.....4444..44...
........44.4....
.........444....
...4444.444..44.
...444444444444.
...444444444444.
......4444......
......444.......
.....444........
....4444........
....444.........
................` ],
  [ symbolC, bitmap`
................
.......33.......
......3333......
.....333333.....
....333...33....
...3333....33...
....33333333....
.....333333.....
....3333...3....
...333333..33...
..333333333333..
...3333333333...
....33333333....
.....333333.....
......3333......
................` ],
  [ symbolB, bitmap`
................
.........9......
.......999......
.......9........
.....999999.....
...999999.999...
...999999...9...
..99999999...9..
..999999999.99..
..999999999999..
..999999999999..
...9999999999...
...9999999999...
.....9999999....
.......9999.....
................` ],
  [ symbolX, bitmap`
................
................
.......C........
.....CCCCCC.....
...CCC....CC....
...C......CC....
..CCCCCCCC.CC...
..CC......C.CCC.
..C...........CC
.CCCCCCCCCCCC..C
.C...........CCC
.CC.........CCC.
..CCCCCCCCCCC...
................
................
................` ]
)

setSolids([])

const level = 0
const levels = [
  map`
.s.s.s.`
]

setMap(levels[level])

function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)]
}

function spinSlots() {
  clearBoard()
  const slotPositions = getAll(slot)
  const results = []
  slotPositions.forEach(pos => {
    const symbol = getRandomSymbol()
    addSprite(pos.x, pos.y, symbol)
    results.push(symbol)
  })
  checkWin(results)
}

function clearBoard() {
  const slotPositions = getAll(slot)
  slotPositions.forEach(pos => {
    clearTile(pos.x, pos.y)
    addSprite(pos.x, pos.y, slot)
  })
  clearText()
}

function checkWin(results) {
  if (results.every(symbol => symbol === results[0])) {
    displayWin()
  }
}

function displayWin() {
  // Display "You Win!" message
  clearText()
  addText("YOU WIN!", {
    x: 2,
    y: 5,
    color: color`3`
  })
}

onInput("s", () => {
  spinSlots()
})

afterInput(() => {
  // No additional actions needed after input
})