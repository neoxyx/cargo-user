import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonicModule],
})
export class HeaderComponent implements OnInit {
  userName: string | null = 'Invitado';

  constructor(private readonly router: Router, private readonly authService: AuthService) { }

  ngOnInit(): void {
    this.userName = localStorage.getItem('username');
  }

  logout(): void {
    // Eliminar el token y redirigir al login
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
