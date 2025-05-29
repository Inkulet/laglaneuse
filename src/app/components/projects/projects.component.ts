import { Component, ViewChild, TemplateRef, ElementRef, Renderer2, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProjectImage {
  src: string;
  alt: string;
}

interface Project {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  images: ProjectImage[];
  location: string;
  participants: string;
  type: 'created' | 'curated'; // Тип проекта: созданный или курируемый
  status: 'completed' | 'in-progress'; // Статус проекта
  details: string[];
  quote?: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  @ViewChild('expandedCardTemplate') expandedCardTemplate!: TemplateRef<any>;

  selectedProject: Project | null = null;
  expandedCardElement: HTMLElement | null = null;

  // Проекты, созданные пользователем
  createdProjects: Project[] = [
    {
      id: 0,
      title: '«Ко(в)чующие»',
      subtitle: 'Кураторская выставка (завершена)',
      badge: 'Завершен',
      description: 'Выставка-рефлексия о взаимодействии художников в творческой среде Академии. Как куратор, я выступала связующим звеном между 12 художниками из разных кафедр, объединяя их работы вокруг концепции "ковчега" - символа движения, сохранения и творческого единения.',
      images: [
        { src: '/assets/photo2.jpeg', alt: 'Экспозиция выставки' },
        { src: '/assets/photo3.jpeg', alt: 'Работы художников' },
        { src: '/assets/photo4.jpeg', alt: 'Кураторская группа' }
      ],
      location: 'Большой выставочный зал',
      participants: '12 художников из 4 кафедр',
      type: 'created',
      status: 'completed',
      details: [
        'Место проведения: Большой выставочный зал',
        'Участники: 12 художников из 4 кафедр',
        'Авторский кураторский текст'
      ],
      quote: 'И вечно жить нам, и вечно плыть нам. Объединяйтесь вместе, взаимодействуйте с другими кафедрами и плывите дальше, сохраняя самое ценное через искусство'
    },
    {
      id: 1,
      title: 'Проект 2',
      subtitle: 'Персональная выставка (в процессе)',
      badge: 'В процессе',
      description: 'Описание второго проекта, который находится в процессе реализации. Здесь будет подробная информация о концепции, целях и ожидаемых результатах.',
      images: [
        { src: '/assets/photo2.jpeg', alt: 'Эскиз проекта' },
        { src: '/assets/photo3.jpeg', alt: 'Рабочий процесс' }
      ],
      location: 'Галерея современного искусства',
      participants: '5 художников',
      type: 'created',
      status: 'in-progress',
      details: [
        'Место проведения: Галерея современного искусства',
        'Участники: 5 художников',
        'Планируемая дата открытия: декабрь 2025'
      ]
    }
  ];

  // Проекты, курируемые пользователем
  curatedProjects: Project[] = [
    {
      id: 2,
      title: 'Арт-резиденция "Пространство"',
      subtitle: 'Кураторский проект (завершен)',
      badge: 'Завершен',
      description: 'Международная арт-резиденция, объединившая художников из 5 стран для создания серии работ на тему взаимодействия человека с городским пространством. В качестве куратора я координировала творческий процесс и организовывала итоговую выставку.',
      images: [
        { src: '/assets/photo4.jpeg', alt: 'Участники резиденции' },
        { src: '/assets/photo3.jpeg', alt: 'Рабочий процесс' },
        { src: '/assets/photo2.jpeg', alt: 'Итоговая выставка' }
      ],
      location: 'Центр современного искусства',
      participants: '15 художников из 5 стран',
      type: 'curated',
      status: 'completed',
      details: [
        'Место проведения: Центр современного искусства',
        'Участники: 15 художников из 5 стран',
        'Продолжительность: 3 месяца',
        'Итоговая выставка: 2 недели'
      ],
      quote: 'Искусство — это диалог между художником и пространством, между прошлым и будущим, между личным и общественным'
    }
  ];

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    // Инициализация обработчиков прокрутки для индикаторов
    setTimeout(() => {
      this.initScrollIndicators();
    }, 500);
  }

  initScrollIndicators() {
    // Инициализация индикаторов для созданных проектов
    this.initCategoryScrollIndicators('created-projects-wrapper', 'created-projects-indicator');

    // Инициализация индикаторов для курируемых проектов
    this.initCategoryScrollIndicators('curated-projects-wrapper', 'curated-projects-indicator');
  }

  initCategoryScrollIndicators(wrapperId: string, indicatorClass: string) {
    const cardsWrapper = this.el.nativeElement.querySelector(`#${wrapperId}`);
    const dots = this.el.nativeElement.querySelectorAll(`.${indicatorClass} .dot`);

    if (cardsWrapper && dots.length) {
      cardsWrapper.addEventListener('scroll', () => {
        const scrollPosition = cardsWrapper.scrollLeft;
        const cardWidth = cardsWrapper.querySelector('.project-card').offsetWidth + 24; // Ширина карточки + отступ
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

  scrollCategory(direction: 'left' | 'right', categoryId: string) {
    const wrapper = this.el.nativeElement.querySelector(`#${categoryId}`);
    if (wrapper) {
      const cardWidth = wrapper.querySelector('.project-card').offsetWidth + 24;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;

      wrapper.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  expandCard(event: Event, project: Project) {
    event.stopPropagation();

    // Устанавливаем выбранный проект
    this.selectedProject = project;

    // Создаем элемент из шаблона
    const viewContainerRef = this.el.nativeElement;
    const embeddedViewRef = this.expandedCardTemplate.createEmbeddedView({ $implicit: this.selectedProject });

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

  navigateGallery(direction: 'prev' | 'next') {
    if (!this.expandedCardElement) return;

    const slider = this.expandedCardElement.querySelector('.gallery-slider') as HTMLElement;
    if (slider) {
      const imageWidth = (slider.querySelector('.gallery-image') as HTMLElement).offsetWidth;
      const currentPosition = slider.scrollLeft;
      const targetPosition = direction === 'prev'
        ? currentPosition - imageWidth
        : currentPosition + imageWidth;

      slider.scrollTo({
        left: targetPosition,
        behavior: 'smooth'
      });
    }
  }
}
