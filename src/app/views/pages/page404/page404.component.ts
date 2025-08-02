import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';

@Component({
    selector: 'app-page404',
    templateUrl: './page404.component.html',
    styleUrls: ['./page404.component.scss'],
    imports: [
      ContainerComponent,
      RowComponent,
      ColComponent,
      ButtonDirective,
      RouterModule
    ]
})
export class Page404Component {
  private location = inject(Location);
  private router = inject(Router);

  constructor() { }

  /**
   * Navigate back to the previous page
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Navigate to home/profile page
   */
  goHome(): void {
    this.router.navigate(['/profile']);
  }


}
