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

/**
 * Service responsible for making API calls to the j-Flix backend.
 * Provides methods for user authentication, fetching movie/director/genre data,
 * and managing user profiles and favorites.
 *
 * @Injectable Provided in root, making it a singleton available throughout the application.
 */
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  /**
   * Sends a POST request to register a new user.
   * @param userDetails - An object containing user registration data (Username, Password, Email, Birthday).
   * @returns An Observable containing the API response upon successful registration.
   * @public
   */
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

  /**
   * Sends a POST request to log in a user.
   * @param userDetails - An object containing user login credentials (Username, Password).
   * @returns An Observable containing the API response (user object and JWT token) upon successful login.
   * @public
   */
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
   * Sends a GET request to fetch all movies from the API.
   * Requires a valid JWT token in the Authorization header.
   * @returns An Observable containing an array of movie objects.
   * @public
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
   * Sends a GET request to fetch a single movie by its title.
   * Requires a valid JWT token in the Authorization header.
   * @param title - The title of the movie to fetch.
   * @returns An Observable containing the movie object.
   * @public
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
   * Sends a GET request to fetch director details by name.
   * Requires a valid JWT token in the Authorization header.
   * @param directorName - The name of the director to fetch.
   * @returns An Observable containing the director object.
   * @public
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
   * Sends a GET request to fetch genre details by name.
   * Requires a valid JWT token in the Authorization header.
   * @param genreName - The name of the genre to fetch.
   * @returns An Observable containing the genre object.
   * @public
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
   * Sends a GET request to fetch the current user's details from the API.
   * Requires a valid JWT token and uses the username stored in localStorage.
   * Note: Currently less used as profile often loads from localStorage first.
   * @returns An Observable containing the user object.
   * @public
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
   * Sends a GET request to fetch the current user's favorite movie IDs.
   * Requires a valid JWT token and uses the username stored in localStorage.
   * @returns An Observable containing an array of favorite movie IDs.
   * @public
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
   * Sends a POST request to add a movie to the user's favorites list.
   * Requires a valid JWT token and uses the username stored in localStorage.
   * @param movieId - The ID of the movie to add.
   * @returns An Observable containing the updated user object.
   * @public
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
   * Sends a PUT request to update the user's profile information.
   * Requires a valid JWT token and uses the username stored in localStorage.
   * Only sends fields that have been changed.
   * @param userDetails - An object containing the user fields to update (e.g., Email, Birthday, Password).
   * @returns An Observable containing the updated user object.
   * @public
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
   * Sends a DELETE request to delete the user's account.
   * Requires a valid JWT token and uses the username stored in localStorage.
   * @returns An Observable containing the API response upon successful deletion.
   * @public
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
   * Sends a DELETE request to remove a movie from the user's favorites list.
   * Requires a valid JWT token and uses the username stored in localStorage.
   * @param movieId - The ID of the movie to remove.
   * @returns An Observable containing the updated user object.
   * @public
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

  /**
   * Extracts the response body from an HTTP response.
   * @param res - The HTTP response object.
   * @returns The response body or an empty object.
   * @private
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  // Error handling function
  /**
   * Handles HTTP errors that occur during API requests.
   * Logs detailed error information to the console.
   * @param error - The HttpErrorResponse object.
   * @returns An Observable that throws an error with a user-friendly message.
   * @private
   */
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
