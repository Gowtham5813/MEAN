import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { CustomerService } from '../../service/customer.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  isloggedIn: boolean = false;

  constructor(
    private router: Router,
    private customerservice: CustomerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Only access sessionStorage in the browser environment
      if (sessionStorage.getItem('Loggedinuser')) {
        this.isloggedIn = true;
      } else {
        this.isloggedIn = false;
      }

      // Google Sign-In initialization
      google.accounts.id.initialize({
        client_id: '129421237209-jricn8ed4fgld4glk6k716deq5ebsmpb.apps.googleusercontent.com',
        callback: (response: any) => {
          this.handlelogin(response);
        }
      });
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.rendergooglebutton();
    }
  }

  private rendergooglebutton(): void {
    if (isPlatformBrowser(this.platformId)) {
      const googlebtn = document.getElementById('google-btn');
      if (googlebtn) {
        google.accounts.id.renderButton(googlebtn, {
          theme: 'outline',
          size: 'medium',
          shape: 'pill',
          width: 150
        });
      }
    }
  }

  private decodetoken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  handlelogin(response: any) {
    const payload = this.decodetoken(response.credential);
    this.customerservice.addcustomermongo(payload).subscribe({
      next: (response) => {
        console.log('POST success', response);
        if (isPlatformBrowser(this.platformId)) {
          sessionStorage.setItem('Loggedinuser', JSON.stringify(response));
        }
      },
      error: (error) => {
        console.error('POST request failed', error);
      }
    });
  }

  handlelogout() {
    if (isPlatformBrowser(this.platformId)) {
      google.accounts.id.disableAutoSelect();
      sessionStorage.removeItem('Loggedinuser');
      window.location.reload();
    }
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }
}
