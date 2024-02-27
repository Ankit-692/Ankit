import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SqaureComponent } from '../sqaure/sqaure.component';
import { GameServiceService } from '../game-service.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [SqaureComponent,CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})



export class BoardComponent implements OnInit{

  constructor(public gameService:GameServiceService,private router:Router){}

  currentPlayer:any

  ngOnInit(): void {
    this.gameService.joinroom()
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if(!this.gameService.roomFull){
          this.gameService.leaveRoom();
          this.gameService.rooms = []
        }
      }
    });
  }

  goBack(){
    this.gameService.roomFull = false
    this.router.navigate(['/'])
  }
  
}
