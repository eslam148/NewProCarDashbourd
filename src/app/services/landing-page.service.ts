import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {
  private apiUrl = environment.apiUrl + '/api';
  constructor(private http: HttpClient) {}

  addReviewToLandingPage(reviewId: number): Observable<any> {
    const url = `${this.apiUrl}/Review/MakeReviewInPublic/${reviewId}`;
    return this.http.put<any>(url, {});
  }
}
