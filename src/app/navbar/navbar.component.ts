import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLeft = false;

  togglePosition() {
    this.isLeft = !this.isLeft; // เปลี่ยนตำแหน่ง toggle
  }
}
