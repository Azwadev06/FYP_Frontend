import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-responsebar',
  imports: [NgIf],
  templateUrl: './responsebar.component.html',
  styleUrl: './responsebar.component.css'
})
export class ResponsebarComponent {
  @Input() totalResults: number = 0;
  @Input() responseTime: number = 0;
  @Input() loading: boolean = false;
}
