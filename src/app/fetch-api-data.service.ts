// src/app/fetch-api-data.service.ts

import { Injectable } from '@angular/core';
import { map, catchError, tap } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

// API URL
const apiUrl = 'https://j-flix-omega.vercel.app';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  public userRegistration(userDetails: any): Observable<any> {
    const formattedData = {
      username: userDetails.username || userDetails.Username,
      password: userDetails.password || userDetails.Password,
      email: userDetails.email || userDetails.Email,
      birthday: userDetails.birthday || userDetails.Birthday,
    };

    return this.http
      .post(apiUrl + '/users', formattedData, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(catchError(this.handleError));
  }

  public userLogin(userDetails: any): Observable<any> {
    const formattedData = {
      username: userDetails.username || userDetails.Username,
      password: userDetails.password || userDetails.Password,
    };

    return this.http
      .post(apiUrl + '/login', formattedData, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get all movies
   * @returns Observable of movie data
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + '/movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Get one movie
   * @param title
   * @returns Observable of movie data
   */
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + '/movies/' + title, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Get director data
   * @param directorName
   * @returns Observable of director data
   */
  getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + '/movies/directors/' + directorName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Get genre data
   * @param genreName
   * @returns Observable of genre data
   */
  getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + '/movies/genres/' + genreName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Get user data
   * Note: We don't actually use this in the profile component now
   * as we're loading directly from localStorage first
   */
  getUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const userObj = JSON.parse(localStorage.getItem('user') || '{}');
    const username = userObj.Username;

    console.log('getUser using Username:', username);

    return this.http
      .get(apiUrl + '/users/' + username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Get favorite movies for a user
   * @returns Observable of favorite movies
   */
  getFavoriteMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    const userObj = JSON.parse(localStorage.getItem('user') || '{}');
    const username = userObj.Username || userObj.username;

    return this.http
      .get(apiUrl + '/users/' + username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        map(this.extractResponseData),
        map((data) => data.FavoriteMovies),
        catchError(this.handleError)
      );
  }

  /**
   * Add a movie to favorites
   * @param movieId
   * @returns Observable of updated user data
   */
  addFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const userObj = JSON.parse(localStorage.getItem('user') || '{}');
    const username = userObj.Username || userObj.username;

    return this.http
      .post(
        apiUrl + '/users/' + username + '/movies/' + movieId,
        {},
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Edit user information - matches pattern in movie-card component
   * @param userDetails
   * @returns Observable of updated user data
   */
  editUser(userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    const userObj = JSON.parse(localStorage.getItem('user') || '{}');
    const username = userObj.Username;

    console.log('editUser for Username:', username);
    console.log('editUser data:', userDetails);

    return this.http
      .put(apiUrl + '/users/' + username, userDetails, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Delete user account - matches pattern in movie-card component
   * @returns Observable of delete status
   */
  deleteUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const userObj = JSON.parse(localStorage.getItem('user') || '{}');
    const username = userObj.Username;

    console.log('deleteUser for Username:', username);

    return this.http
      .delete(apiUrl + '/users/' + username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Remove a movie from favorites
   * @param movieId
   * @returns Observable of updated user data
   */
  deleteFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const userObj = JSON.parse(localStorage.getItem('user') || '{}');
    const username = userObj.Username || userObj.username;

    return this.http
      .delete(apiUrl + '/users/' + username + '/movies/' + movieId, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  // Error handling function
  private handleError(error: HttpErrorResponse): any {
    console.log('===== HANDLING API ERROR =====');
    console.log('Full error object:', error);

    if (error.error instanceof ErrorEvent) {
      // Client-side error (network issues, etc.)
      console.error('Client-side error occurred:', error.error.message);
      console.error('Error event:', error.error);
    } else {
      // Server-side error (4xx, 5xx responses)
      console.error(`Server-side error - Status code: ${error.status}`);
      console.error(`Error body: ${JSON.stringify(error.error)}`);
      console.error(`Error message: ${error.message}`);

      // Check for specific status codes
      if (error.status === 0) {
        console.error(
          'Network error or CORS issue - API request did not complete'
        );
        console.error(
          'Check if API is running and CORS is properly configured'
        );
      } else if (error.status === 401) {
        console.error('Authentication error - Invalid or expired token');
        console.error('User might need to log in again');
      } else if (error.status === 404) {
        console.error('Resource not found - Check endpoint URL and parameters');
      } else if (error.status >= 500) {
        console.error('Server error - Issue on the API side');
      }
    }

    // Check for connection issues
    if (!navigator.onLine) {
      console.error('Browser is offline - Check internet connection');
    }

    // Log request details if available
    if (error.url) {
      console.error('Request URL:', error.url);
    }

    return throwError(
      () =>
        new Error(
          'Something bad happened; please try again later. ' +
            (error.error?.message || error.message || 'Unknown error')
        )
    );
  }
}
