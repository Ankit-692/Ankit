import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameServiceService } from '../game-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private router:Router,public gameService:GameServiceService){}

  data={
    username : '',
    roomId : ''
  }

  cancelSearch(){
    this.gameService.searchbox = false
  }

  createRoom(){
    if(this.data.roomId != ''){
    this.router.navigate(["/board"],{queryParams:{name:this.data.username,roomId:this.data.roomId}})
    }
  }

  joinRoom(id:string){
    this.router.navigate(["/board"],{queryParams:{name:'user',roomId:id}})
  }



}
