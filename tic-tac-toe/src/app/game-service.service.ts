import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})

export class GameServiceService{

  GameRunning = false
  username:any
  roomId:any
  socket:any
  currentPlayer = 'X';
  turnCount = 0;
  public board:any = [];
  url:any
  Notouch = true
  GameFinish = false
  winner = false
  loser = false
  users:any
  draw = false
  rooms:any
  waiting = true
  userLeft = false
  searchbox = false
  roomFull = false

  constructor(){
    this.createBoard();
  }

  newGame(){
    this.Notouch = true
    this.turnCount = 0
    this.socket.emit('clicked',{board:this.board,roomId:this.roomId})
    this.socket.emit('newGame',this.roomId)
  }

  update(){
      this.socket.on('getRooms',(rooms:any)=>{
        console.log(rooms)
        this.rooms = rooms
      })

      this.socket.on('updateBoard',(boardData:any)=>{
        this.Notouch = false
        this.currentPlayer = this.currentPlayer == 'X' ? 'O':'X'
        this.board = boardData
      })

      this.socket.on('start',(status:any)=>{
        for(let i = 0; i<9; i++){
          this.board[i].state = null
        }
        this.turnCount = 0
        this.draw = false
        this.waiting = false
        this.userLeft = false
        this.currentPlayer = 'X'
        this.winner = false
        this.loser = false
        this.GameFinish = false

        if(this.socket.id == status){
          this.Notouch = true
        }
        else {
          this.Notouch = false
        }
      })
      
      this.socket.on('youLose',()=>{
        this.loser = true
        this.GameFinish = true
        this.Notouch = true
      })

      this.socket.on('userLeft',()=>{
        this.userLeft = true
        this.waiting = true
      })

      this.socket.on('noWinner',()=>{
        this.draw = true
        this.GameFinish = true
      })

      this.socket.on('roomFull',()=>{
        this.roomFull = true
      })

      this.socket.on('startNew',()=>{
        this.socket.emit('newGame',this.roomId)
      })

    }


  createBoard(){
    for(let i = 0; i<9; i++){
      this.board.push({id:i,state:null})
    }
  }

  changePlayer(box: { id: string | number; }){
    if(this.board[box.id].state == null){
      this.turnCount += 1
      if(this.turnCount == 5){
        this.socket.emit('draw',this.roomId)
      }
      this.Notouch = true;
      this.board[box.id].state = this.currentPlayer
      this.currentPlayer = this.currentPlayer == 'X' ? 'O':'X'
      this.socket.emit('clicked',{board:this.board,roomId:this.roomId})
      this.GameFinish = this.checkBoard(this.board)

      if(this.GameFinish){
        this.finishGame()
      }
      }
  }

  connect(){
    if(!this.socket){
      this.socket = io("https://tic-tac-toe-game-6bnwdobfy-ankit-692.vercel.app",{ transports : ['websocket'] })
    }

    this.update();

  }

  search(){
    this.connect()
    this.socket.emit('search')
    this.searchbox = true
  }

  joinroom(){
    this.url = window.location.href
    this.username = this.url.split('?')[1].split('&')[0].split('=')[1].replace('%20',' ')
    this.roomId = this.url.split('?')[1].split('&')[1].split('=')[1]
    this.connect()
    this.socket.emit('join',this.roomId)
  }

  checkBoard(board:any){
    const winningLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  
    for (const line of winningLines) {
      const value = board[line[0]].state;
      if (value !== null && value === board[line[1]].state && value === board[line[2]].state) {
        return true;
      }
    }

    return false
  }

  finishGame(){
    this.GameFinish = true
    this.winner = true
    this.socket.emit('finishGame',this.roomId)
  }

  leaveRoom(){
    this.socket.emit('leaveRoom',this.roomId)
  }

}