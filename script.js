const gameConfig = {
  turn: 0,
  playerCount: 2,
  boardColumns: 7,
  boardRows: 6,
  winLength: 4,
  winner: null,
  colors: ['blue', 'red', 'yellow', 'green', 'mediumpurple', 'chocolate', 'deeppink', 'cyan', 'white', 'black']
}

function setupGame() {
  gameConfig.turn = 0
  gameConfig.winner = null
  const {playerCount, boardColumns, boardRows} = gameConfig
  const players = createPlayers(playerCount)
  createBoard(createGrid(boardColumns, boardRows), players)
}

function setupControls() {
  const controls = document.querySelector('#controls')
  activateControls('#players-controls', 'playerCount')
  activateControls('#columns-controls', 'boardColumns')
  activateControls('#rows-controls', 'boardRows')
  activateControls('#win-length-controls', 'winLength')

  const resetButton = document.querySelector('button#reset')
  resetButton.addEventListener('click', setupGame)

  const settingsButtons = document.querySelectorAll('button#settings')
  settingsButtons.forEach(button => {
    button.addEventListener('click', () => { controls.classList.toggle('visible') })
  })
    
}

function activateControls(id, parameter) {
  const controls = document.querySelector(id)
  const increase = controls.querySelector('.increase')
  const decrease = controls.querySelector('.decrease')
  increase.addEventListener('click', () => {updateValue(controls, parameter, 1)})
  decrease.addEventListener('click', () => {updateValue(controls, parameter, -1)})
}

function updateGameInfo(players, activePlayer, currentPlayerElement, gameInfoElement){
  const nextPlayer = players[gameConfig.turn % players.length]
  if (gameConfig.winner !== null) {
    currentPlayerElement.innerHTML = `Player ${activePlayer + 1} wins!`
  } else {
    currentPlayerElement.innerHTML = `Player ${nextPlayer + 1}'s turn`
    gameInfoElement.style.background = gameConfig.colors[nextPlayer]
  }
}

function updateValue(controls, parameter, amount) {
  const valueLabel = controls.querySelector('.value')
  const newValue = Math.min(Math.max(gameConfig[parameter] + amount, 2), 10)
  gameConfig[parameter] = newValue
  valueLabel.innerHTML = gameConfig[parameter]
  setupGame()
}

function createPlayers(playerCount) {
  return Array.from(Array(playerCount).keys())
}

function createGrid (columns, rows) {
  return Array(columns).fill().map(()=>Array(rows).fill())
}

function createElement(classNames) {
  const element = document.createElement('div')
  classNames.forEach(className => element.classList.add(className))
  return element
}

function createBoard(board, players) {
  const boardElement = document.querySelector('#board')
  const gameInfoElement = document.querySelector('#game-info')
  const currentPlayerElement = gameInfoElement.querySelector('#current-player')
  boardElement.innerHTML = ""
  board.forEach((column, columnIndex) => {
    const columnElement = createElement(['column'])
    column.forEach((cell, rowIndex) => {
      const cellElement = createElement(['cell', 'empty'])
      cellElement.dataset.column = columnIndex
      cellElement.dataset.row = rowIndex
      cellElement.dataset.status = 'empty'
      cellElement.appendChild( createElement(['piece']))
      columnElement.appendChild(cellElement)
    })
    columnElement.addEventListener('click', () => {
      return handleRowClick(board, players, columnElement, currentPlayerElement, gameInfoElement)
    })
    updateGameInfo(players, 0, currentPlayerElement, gameInfoElement)
    boardElement.appendChild(columnElement)
  })
}

function handleRowClick(board, players, columnElement, currentPlayerElement, gameInfoElement) {
  const lowestUnfilledCell = columnElement.querySelector('[data-status="empty"]')  
  if (lowestUnfilledCell && gameConfig.winner === null) {
    const cellColumn = lowestUnfilledCell.dataset.column
    const cellRow = lowestUnfilledCell.dataset.row
    const activePlayer = players[gameConfig.turn % players.length]
    lowestUnfilledCell.classList.remove('empty')
    lowestUnfilledCell.dataset.status = activePlayer
    board[cellColumn][cellRow] = activePlayer
    lowestUnfilledCell.style.background = gameConfig.colors[activePlayer]
    checkForWin(board, activePlayer, cellColumn, cellRow)
    gameConfig.turn++
    updateGameInfo(players, activePlayer, currentPlayerElement, gameInfoElement)
  }
}

function checkForWin(board, activePlayer, cellColumn, cellRow) {
  if (
    checkForVerticalWinner(board, activePlayer, cellColumn, cellRow) ||
    checkForHorizontalWinner(board, activePlayer, cellColumn, cellRow) ||
    checkForDiagonalWinner(board, activePlayer, 1) ||
    checkForDiagonalWinner(board, activePlayer, -1) 
  ) {
    gameConfig.winner = activePlayer
  }
} 

function checkForVerticalWinner(board, activePlayer, cellColumn, cellRow) {
  const verticalWin = Array(gameConfig.winLength).fill().map((x, i) => {
    return board[cellColumn][cellRow - i] === activePlayer
  })
  return verticalWin.every(v => v === true)
}

function checkForHorizontalWinner(board, activePlayer, cellColumn, cellRow) {
  let hasMatch = false
  board.forEach((column, index) => {
    const horizontalWin = Array(gameConfig.winLength).fill().map((x, i) => {
      return board[index + i] && board[index + i][cellRow] === activePlayer
    })
    if (horizontalWin.every(v => v === true)) {
      hasMatch = true
      return hasMatch
    }
  })
  return hasMatch
}

function checkForDiagonalWinner(board, activePlayer, direction) {
  let hasMatch = false
  board.forEach((column, columnIndex) => {
    column.forEach((row, rowIndex) => {
      const diagonalWin = Array(gameConfig.winLength).fill().map((x, i) => {
        let currentColumn = board[columnIndex + i]
        let currentCell = currentColumn && currentColumn[rowIndex + (i*direction)]
        return currentCell === activePlayer
      })
      if (diagonalWin.every(v => v === true)) {
        hasMatch = true
        return hasMatch
      }
    })
  })
  return hasMatch
}

setupGame()
setupControls()