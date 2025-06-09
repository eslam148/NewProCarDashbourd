import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('animateElement') animateElements!: QueryList<ElementRef>;

  private observer!: IntersectionObserver;

  features = [
    {
      icon: 'fas fa-car',
      title: 'Car Management',
      description: 'Efficiently manage your fleet with our comprehensive car management system.'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Analytics',
      description: 'Get detailed insights and analytics about your car operations.'
    },
    {
      icon: 'fas fa-map-marked-alt',
      title: 'Location Tracking',
      description: 'Real-time tracking and location management for your vehicles.'
    },
    {
      icon: 'fas fa-tools',
      title: 'Maintenance',
      description: 'Schedule and track maintenance for your entire fleet.'
    }
  ];

  testimonials = [
    {
      name: 'John Doe',
      role: 'Fleet Manager',
      content: 'This platform has revolutionized how we manage our fleet. Highly recommended!',
      image: 'assets/img/testimonials/user1.jpg'
    },
    {
      name: 'Jane Smith',
      role: 'Operations Director',
      content: 'The analytics and reporting features are exceptional. Great tool for fleet management.',
      image: 'assets/img/testimonials/user2.jpg'
    }
  ];

  ngOnInit() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });
  }

  ngAfterViewInit() {
    this.animateElements.forEach(element => {
      this.observer.observe(element.nativeElement);
    });
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
