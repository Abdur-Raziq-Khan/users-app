import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

  
    getAll() {
       let token= JSON.parse(localStorage.getItem('currentUser'));
       console.log("tokennnnnnnnnnnnnnn",token)
        // let headers = new HttpHeaders()
        // .set('Authorization', 'x-access-token' + token.accessToken)
        // .set('Content-Type', 'application/json');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'x-access-token' + token.accessToken
        });
        return this.http.get<User[]>(environment.baseUrl + '/users', {headers: headers});
    }

    getById(_id: string) {
        return this.http.get(environment.baseUrl + '/users/' + _id);
    }

    create(user: User) {
        return this.http.post(environment.baseUrl + '/register', user);
    }

    update(user: User) {
        return this.http.put(environment.baseUrl + '/users/' + user.id, user);
    }

    delete(_id: string) {
        return this.http.delete(environment.baseUrl + '/users/' + _id);
    }
}