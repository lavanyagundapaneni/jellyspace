import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
// export class User {
//   id?: string;
//   name?: string;
//   email?: string;
//   phone?: number;
//   // status: Boolean,
//   // message: String,
//   // data: {}
// }

@Injectable({
  providedIn: 'root',
})
export class AppService {
 // apiURL = 'http://35.166.32.174:8080/api';

  apiURL = 'https://useronboard.jellyspace.io/api';

  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  sendOTP(paramss: any) {
    return this.http
      .post(this.apiURL + '/sendOTP', JSON.stringify(paramss), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  verifyOTP(paramss: any) {
    return (
      this.http
        .post(
          this.apiURL + '/verifyOTP',
          JSON.stringify(paramss),
          this.httpOptions
        )
        // .get(this.apiURL + '/getProject')
        .pipe(retry(1), catchError(this.handleError))
    );
  }

  login(paramss: any) {
    return (
      this.http
        .post(this.apiURL + '/login', JSON.stringify(paramss), this.httpOptions)
        // .get(this.apiURL + '/getProject')
        .pipe(retry(1), catchError(this.handleError))
    );
  }

  // HttpClient API get() method => Fetch employees list
  getEmployees() {
    return this.http
      .get(this.apiURL + '/employees')
      .pipe(retry(1), catchError(this.handleError));
  }
  // HttpClient API get() method => Fetch employee
  getEmployee(id: any) {
    return this.http
      .get(this.apiURL + '/employees/' + id)
      .pipe(retry(1), catchError(this.handleError));
  }
  // HttpClient API post() method => Create employee
  createEmployee(employee: any) {
    console.log('employee' + JSON.stringify(employee));
    return this.http
      .post(
        this.apiURL + '/register',
        JSON.stringify(employee),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }
  // HttpClient API put() method => Update employee
  updateEmployee(id: any, employee: any) {
    return this.http
      .put(
        this.apiURL + '/employees/' + id,
        JSON.stringify(employee),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }
  // HttpClient API delete() method => Delete employee
  deleteEmployee(id: any) {
    return this.http
      .delete(this.apiURL + '/employees/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }

  getProjectByEmail(paramss: any) {
    return (
      this.http
        .post(
          this.apiURL + '/getProjects',
          JSON.stringify(paramss),
          this.httpOptions
        )
        // .get(this.apiURL + '/getProject')
        .pipe(retry(1), catchError(this.handleError))
    );
  }

  savePostMethod(paramss: any) {
    return (
      this.http
        .post(
          this.apiURL + '/postAproject',
          JSON.stringify(paramss),
          this.httpOptions
        )
        // .get(this.apiURL + '/getProject')
        .pipe(retry(1), catchError(this.handleError))
    );
  }
  getApiDataBinding() {
    return this.http
      .get(this.apiURL + '/projects')
      .pipe(retry(1), catchError(this.handleError));
  }
  getUsersData() {
    return this.http
      .get(this.apiURL + '/users')
      .pipe(retry(1), catchError(this.handleError));
  }
  getBidInitDetails(paramss: any) {
    return this.http
      .post(
        this.apiURL + '/getProjectBids',
        JSON.stringify(paramss),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  getCurrentBidDetailsList(paramss: any) {
    return this.http
      .post(this.apiURL + '/getbids', JSON.stringify(paramss), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  postBid(paramss: any) {
    return this.http
      .post(this.apiURL + '/postBid', JSON.stringify(paramss), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  acceptedAndRejected(paramss: any) {
    return this.http
      .post(
        this.apiURL + '/acceptBid',
        JSON.stringify(paramss),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteData(id: any) {
    return this.http
      .post(
        this.apiURL + '/deleteProject',
        JSON.stringify(id),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  loginUserDetails(paramss: any) {
    return (
      this.http
        .post(
          this.apiURL + '/loginUser',
          JSON.stringify(paramss),
          this.httpOptions
        )
        // .get(this.apiURL + '/getProject')
        .pipe(retry(1), catchError(this.handleError))
    );
  }

  // HttpClient API delete() method => Delete employee
  deleteUser(paramss: any) {
    return this.http
      .post(
        this.apiURL + '/deleteUser',
        JSON.stringify(paramss),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }
}
