import { Component, ViewChild, TemplateRef, ElementRef, Renderer2, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TourImage {
  src: string;
  alt: string;
}

interface Tour {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  images: TourImage[];
  location: string;
  schedule: string;
  group: string;
  museumPhoto: string;
  mapImage: string;
  mapLink: string;
  metro: string;
  quote?: string;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {
  @ViewChild('expandedCardTemplate') expandedCardTemplate!: TemplateRef<any>;

  selectedTour: Tour | null = null;
  expandedCardElement: HTMLElement | null = null;

  tours: Tour[] = [
    {
      id: 0,
      title: 'Анималистика. И в шутку, и всерьез.',
      subtitle: 'Авторская экскурсия (еженедельно)',
      badge: 'Еженедельно',
      description: 'Интерактивная экскурсия через призму современного искусства, где зрители становятся участниками художественного диалога. Маршрут построен на контрасте классической музейной архитектуры и экспериментальных арт-объектов.',
      images: [
        { src: '/assets/excursion1.jpeg', alt: 'Экспонаты выставки' },
        { src: '/assets/excursion2.jpeg', alt: 'Рабочий процесс' },
        { src: '/assets/excursion3.jpeg', alt: 'Интерактив с посетителями' }
      ],
      location: 'Музей искусства Санкт-Петербурга XX–XXI веков (МИСП), наб. канала Грибоедова, 103',
      schedule: 'Каждую субботу в 15:00',
      group: 'до 15 человек',
      museumPhoto: '/assets/misp-building.jpg',
      mapImage: 'https://static-maps.yandex.ru/1.x/?ll=30.300037,59.926478&z=16&size=600,300&l=map&pt=30.300037,59.926478,pm2rdl',
      mapLink: 'https://yandex.ru/maps/2/saint-petersburg/?ll=30.300037%2C59.926478&z=16&mode=search&text=МИСП',
      metro: 'Ближайшее метро: Садовая (10 мин.)',
      quote: 'Искусство живет в диалоге - между пространством и временем, художником и зрителем, прошлым и будущим'
    },
    {
      id: 1,
      title: 'Бла бла бла',
      subtitle: 'Авторская экскурсия (еженедельно)',
      badge: 'Еженедельно',
      description: 'Интерактивная экскурсия через призму современного искусства, где зрители становятся участниками художественного диалога. Маршрут построен на контрасте классической музейной архитектуры и экспериментальных арт-объектов.',
      images: [
        { src: '/assets/excursion1.jpeg', alt: 'Экспонаты выставки' },
        { src: '/assets/excursion2.jpeg', alt: 'Рабочий процесс' },
        { src: '/assets/excursion3.jpeg', alt: 'Интерактив с посетителями' }
      ],
      location: 'Музей искусства Санкт-Петербурга XX–XXI веков (МИСП), наб. канала Грибоедова, 103',
      schedule: 'Каждую субботу в 15:00',
      group: 'до 15 человек',
      museumPhoto: '/assets/misp-building.jpg',
      mapImage: 'https://static-maps.yandex.ru/1.x/?ll=30.300037,59.926478&z=16&size=600,300&l=map&pt=30.300037,59.926478,pm2rdl',
      mapLink: 'https://yandex.ru/maps/2/saint-petersburg/?ll=30.300037%2C59.926478&z=16&mode=search&text=МИСП',
      metro: 'Ближайшее метро: Садовая (10 мин.)',
      quote: 'Искусство живет в диалоге - между пространством и временем, художником и зрителем, прошлым и будущим'
    }
  ];

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    // Инициализация обработчика прокрутки для индикаторов
    setTimeout(() => {
      this.initScrollIndicators();
    }, 500);
  }

  initScrollIndicators() {
    const cardsWrapper = this.el.nativeElement.querySelector('.cards-wrapper');
    const dots = this.el.nativeElement.querySelectorAll('.scroll-indicator .dot');

    if (cardsWrapper && dots.length) {
      cardsWrapper.addEventListener('scroll', () => {
        const scrollPosition = cardsWrapper.scrollLeft;
        const cardWidth = cardsWrapper.querySelector('.tour-card').offsetWidth + 24; // Ширина карточки + отступ
        const activeIndex = Math.round(scrollPosition / cardWidth);

        dots.forEach((dot: Element, index: number) => {
          if (index === activeIndex) {
            this.renderer.addClass(dot, 'active');
          } else {
            this.renderer.removeClass(dot, 'active');
          }
        });
      });
    }
  }

  expandCard(event: Event, tourIndex: number) {
    event.stopPropagation();

    // Устанавливаем выбранную экскурсию
    this.selectedTour = this.tours[tourIndex];

    // Создаем элемент из шаблона
    const viewContainerRef = this.el.nativeElement;
    const embeddedViewRef = this.expandedCardTemplate.createEmbeddedView({ $implicit: this.selectedTour });

    // Добавляем элемент в DOM
    embeddedViewRef.detectChanges();
    const rootNodes = embeddedViewRef.rootNodes;

    if (rootNodes.length > 0) {
      this.expandedCardElement = rootNodes[0];
      this.renderer.appendChild(document.body, this.expandedCardElement);

      // Блокируем прокрутку основной страницы
      this.renderer.addClass(document.body, 'no-scroll');

      // Инициализируем галерею
      setTimeout(() => {
        this.initGallerySlider();
      }, 100);
    }
  }

  closeExpandedCard() {
    if (this.expandedCardElement) {
      // Удаляем элемент из DOM
      this.renderer.removeChild(document.body, this.expandedCardElement);
      this.expandedCardElement = null;

      // Разблокируем прокрутку основной страницы
      this.renderer.removeClass(document.body, 'no-scroll');
    }
  }

  initGallerySlider() {
    if (!this.expandedCardElement) return;

    const slider = this.expandedCardElement.querySelector('.gallery-slider');
    const dots = this.expandedCardElement.querySelectorAll('.gallery-dots .dot');

    if (slider && dots.length) {
      slider.addEventListener('scroll', () => {
        const scrollPosition = (slider as HTMLElement).scrollLeft;
        const imageWidth = (slider.querySelector('.gallery-image') as HTMLElement).offsetWidth;
        const activeIndex = Math.round(scrollPosition / imageWidth);

        dots.forEach((dot: Element, index: number) => {
          if (index === activeIndex) {
            this.renderer.addClass(dot, 'active');
          } else {
            this.renderer.removeClass(dot, 'active');
          }
        });
      });

      // Добавляем обработчики для точек навигации
      dots.forEach((dot: Element, index: number) => {
        dot.addEventListener('click', () => {
          const imageWidth = (slider.querySelector('.gallery-image') as HTMLElement).offsetWidth;
          (slider as HTMLElement).scrollTo({
            left: index * imageWidth,
            behavior: 'smooth'
          });
        });
      });
    }
  }
}
