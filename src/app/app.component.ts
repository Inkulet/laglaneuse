import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, SidebarComponent],
  template: `
    <!-- Анимированный фон -->
    <div class="gradient-bg">
      <div class="gradients-container">
        <div class="g1"></div>
        <div class="g2"></div>
        <div class="g3"></div>
        <div class="g4"></div>
        <div class="g5"></div>
      </div>
    </div>

    <!-- Основной контент -->
    <div class="app-container">
      <nav class="navbar">
        <ul>
          <li><a routerLink="/">Главная</a></li>
          <li><a routerLink="/about">О себе</a></li>
          <li><a routerLink="/skills">Экскурсии</a></li>
          <li><a routerLink="/projects">Проекты</a></li>
          <li><a routerLink="/contact">Контакты</a></li>
        </ul>
      </nav>

      <div class="main-content-wrapper">
        <app-sidebar [class.scrolled]="isScrolled"></app-sidebar>
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `
})
export class AppComponent {
  isScrolled = false;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 60;
  }
}
