import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable()
export class AuthenticationService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    
    constructor(private http: HttpClient) {
        debugger
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(email: string, password: string) {
        debugger
        return this.http.post<any>(environment.baseUrl + '/login', { email: email, password: password })
            .pipe(map(user => {
                console.log("Kkkkkkkkkkkkkkkkk",user.data.user)
                // login successful if there's a jwt token in the response
                if (user && user.data.user) {
                    console.log("Kkkkkkkkkkkkkkkkk",user)
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user.data.user));
                    localStorage.setItem('accessToken', user.data.user.accessToken);
                    // localStorage.setItem('email', user.user.email);
                    // localStorage.setItem('role', user.user.role);
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}