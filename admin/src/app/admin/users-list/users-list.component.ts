import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  usersListUrl() {
    this.router.navigateByUrl('users');
  }

}
