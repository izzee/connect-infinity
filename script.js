let turn
let playerCount = 2
let gridColumns = 7
let gridRows = 6
let winLength = 4
let winner = null

function setup() {
  turn = 0
  const players = createPlayers(playerCount)
  createBoard(createGrid(gridColumns, gridRows), players)
}

function createPlayers(playerCount) {
  return Array.from(Array(playerCount).keys())
}

function createGrid (columns, rows) {
  return Array(columns).fill().map(()=>Array(rows).fill())
}

function createBoard(board, players) {
  const boardElement = document.querySelector('#board')
  board.forEach((column, columnIndex) => {
    const columnElement = document.createElement('div')
    columnElement.classList.add('column')
    column.forEach((cell, rowIndex) => {
      const cellElement = document.createElement('div')
      cellElement.classList.add('cell')
      cellElement.dataset.column = columnIndex
      cellElement.dataset.row = rowIndex
      cellElement.dataset.status = 'empty'
      columnElement.appendChild(cellElement)
    })
    columnElement.addEventListener('click', () => handleRowClick(board, players, columnElement))
    boardElement.appendChild(columnElement)
  })
}

function handleRowClick(board, players, columnElement) {
  const colors = ['red', 'blue', 'green']
  const lowestUnfilledCell = columnElement.querySelector('[data-status="empty"]')  
  if (lowestUnfilledCell && winner === null) {
    const cellColumn = lowestUnfilledCell.dataset.column
    const cellRow = lowestUnfilledCell.dataset.row
    const activePlayer = players[turn % players.length]
    lowestUnfilledCell.dataset.status = activePlayer
    board[cellColumn][cellRow] = activePlayer
    lowestUnfilledCell.style.background = colors[activePlayer]
    checkForWin(board, activePlayer, cellColumn, cellRow)
    turn++
  }
}

function checkForWin(board, activePlayer, cellColumn, cellRow) {
    if (checkForVerticalWinner(board, activePlayer, cellColumn, cellRow)) {
      winner = activePlayer
      console.log('vertical winner', activePlayer)
    } else if (checkForHorizontalWinner(board, activePlayer, cellColumn, cellRow)) {
      winner = activePlayer
      console.log('horizontal winner', activePlayer)
    } else if (checkForUpDiagonalWinner(board, activePlayer, cellColumn, cellRow)) {
      winner = activePlayer
      console.log('up diagonal winner', activePlayer)
    } else if (checkForDownDiagonalWinner(board, activePlayer, cellColumn, cellRow)) {
      winner = activePlayer
      console.log('down diagonal winner', activePlayer)
    }
} 

function checkForVerticalWinner(board, activePlayer, cellColumn, cellRow) {
  const verticalWin = Array(winLength).fill().map((x, i) => board[cellColumn][cellRow - i] === activePlayer)
  return verticalWin.every(v => v === true)
}

function checkForHorizontalWinner(board, activePlayer, cellColumn, cellRow) {
  let hasMatch = false
  board.forEach((column, index) => {
    const horizontalWin = Array(winLength).fill().map((x, i) => board[index + i] && board[index + i][cellRow] === activePlayer)
    if (horizontalWin.every(v => v === true)) {
      hasMatch = true
      return hasMatch
    }
  })
  return hasMatch
}

function checkForUpDiagonalWinner(board, activePlayer) {
  let hasMatch = false
  board.forEach((column, columnIndex) => {
    column.forEach((row, rowIndex) => {
      const upDiagonalWin = Array(winLength).fill().map((x, i) => {
        let currentColumn = board[columnIndex + i]
        let currentCell = currentColumn && currentColumn[rowIndex + i]
        return currentCell === activePlayer
      })
      if (upDiagonalWin.every(v => v === true)) {
        hasMatch = true
        return hasMatch
      }
    })
  })
  return hasMatch
}

function checkForDownDiagonalWinner(board, activePlayer) {
  let hasMatch = false
  board.forEach((column, columnIndex) => {
    column.forEach((row, rowIndex) => {
      const downDiagonalWin = Array(winLength).fill().map((x, i) => {
        let currentColumn = board[columnIndex + i]
        let currentCell = currentColumn && currentColumn[rowIndex - i]
        return currentCell === activePlayer
      })
      if (downDiagonalWin.every(v => v === true)) {
        hasMatch = true
        return hasMatch
      }
    })
  })
  return hasMatch
}

setup()
