import { Component, OnInit } from '@angular/core';
import { SideNavService } from '../../services/sidenav-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private sideNavService: SideNavService) { }

  ngOnInit() {
  }

  toggleSideNav() {
    this.sideNavService.toggleSideNav();
  }

}
