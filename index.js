import {TILE_STATUSES,createBoard,markTile, revealTile,checkLose,checkWin} from './minsweeper.js';

const BOARD_SIZE=10;
const NUMBER_OF_MINES=10;

const boardEl=document.querySelector('.board');
const minesLeft=document.querySelector('[mine-count]')
const messageText=document.querySelector('.subtext')

minesLeft.textContent=NUMBER_OF_MINES;


const board=createBoard(BOARD_SIZE,NUMBER_OF_MINES);
boardEl.style.setProperty('--size',BOARD_SIZE);



board.forEach(row=>{
    row.forEach(tile=>{
        boardEl.append(tile.elem)
        tile.elem.addEventListener('click',()=>{
            revealTile(board,tile)
            checkGameEnd()
        })
        tile.elem.addEventListener('contextmenu',e=>{
            e.preventDefault();
            markTile(tile)
            listMinesLeft()
        })
    })
})

function listMinesLeft(){
    const markedTilesCount=board.reduce((count,row)=>{
        return(
            count+row.filter(tile=>tile.status===TILE_STATUSES.MARKED).length
        )
    },0)
    minesLeft.textContent=NUMBER_OF_MINES-markedTilesCount 
}

function checkGameEnd(){
     const win=checkWin(board)
     const lose=checkLose(board)
     if(win||lose){
        boardEl.addEventListener('click',stopProp,{capture:true})
        boardEl.addEventListener('contextmenu',stopProp,{capture:true})
     }
     if(win){
        messageText.textContent="You Win"
     }
     if(lose){
        messageText.textContent="You Lose"
        board.forEach(row => {
            row.forEach(tile => {
              if (tile.status === TILE_STATUSES.MARKED) markTile(tile)
              if (tile.mine) revealTile(board, tile)
            })
        })
     }
}

function stopProp(e){
    e.stopImmediatePropagation()
}