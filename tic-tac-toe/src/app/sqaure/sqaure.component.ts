import { Component, Input } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { GameServiceService } from '../game-service.service';

@Component({
  selector: 'app-sqaure',
  standalone: true,
  imports: [BoardComponent],
  templateUrl: './sqaure.component.html',
  styleUrl: './sqaure.component.css'
})
export class SqaureComponent {

  constructor(public gameService:GameServiceService){}

  @Input() box: any;

}
