import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SideNavService } from '../../services/sidenav-service.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(
    private router: Router,
    private sideNavService: SideNavService
    ) { }

  ngOnInit() {

  }

  toggleSideNav() {
    this.sideNavService.toggleSideNav();
  }

  // hideSideNav() {
  //   this.sideNavService.hideSideNav;
  // }

  usersListUrl() {
    this.router.navigateByUrl('admin/users');
  }

}
