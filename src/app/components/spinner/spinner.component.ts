import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [NgIf],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  @Input() loading: boolean = false;
}
