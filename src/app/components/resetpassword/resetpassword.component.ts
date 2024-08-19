import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { ApiService } from 'src/app/services/api.service';
import { User, UserLogin } from 'src/app/class/user/user';


@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})


export class ResetpasswordComponent {
  user: any;
  langue = this.translate.instant(this.ts.getActiveLang());
  stateOptions: any[] = [];
  sendOptions: any[] = [];

  action = 'view';
  email = '';
  tel = '';
  constructor(
    public api: ApiService,
    public translate: TranslateService,
    private ts: SessionStorageService,
    private router: Router,
    public route: ActivatedRoute,
  ) {
    // this.user = this.ts.getUser();
  }


  optionSend = 1;
  ngOnInit() {
    this.translate.use(this.ts.getActiveLang());
    this.stateOptions = [
      { id: 'fr', label: this.translate.instant('Français'), command: () => { this.changeLang('fr'); this.ts.saveActiveLang('fr'); } },
      { id: 'en', label: this.translate.instant('Anglais'), command: () => { this.changeLang('en'); this.ts.saveActiveLang('en'); } },
    ];
    this.sendOptions = [
      { id: 1, label: this.translate.instant('E-mail'), icon: 'fas fa-envelope', justify: 'Left' },
      { id: 2, label: this.translate.instant('SMS'), icon: 'fas fa-sms', justify: 'Left' },
    ];
  }
  resetOption() {
    this.email = '';
    this.tel = '';
  }

  process = 0;
  userres: any;
  sendCode() {
    this.displaySpinner = true;
    let user = new User();
    user.email = this.email;
    console.log(user);
    this.api.resetPasswordByEmail(user).subscribe((res: any) => {
      console.log(res.user);
      this.userres = res.user;
      this.displaySpinner = false;
      this.comptearebour();
      this.process = 1;
    }, error => {
      this.displaySpinner = false;
      this.erreur('errorMailExist');
    });
  }

  changeLang(event: any) { this.translate.use(event); this.ts.saveActiveLang(event); }

  messageDialog = false;
  displaySpinner = false;
  srca = '';
  title = '';
  message = '';
  succes(msg: string) {
    this.srca = 'assets/img/ok.png';
    this.title = 'Succes !';
    this.message = msg;
    this.messageDialog = true;
  }
  erreur(msg: string) {
    this.srca = 'assets/img/attention.png';
    this.title = 'Erreur !';
    this.message = msg;
    this.messageDialog = true;
  }

  status: any = '';
  toggleStatus(val: string) {
    this.status = val;
    this.ts.saveActiveItem(val);
  }

  dis = false;
  hours: number = 0;
  minutes: number = 5;
  seconds: number = 0;
  code = '';

  login() {
    this.displaySpinner = true;
    let user = new UserLogin();
    user.code = this.code;
    console.log(user);
    this.api.verifyCodeReset(user).subscribe(res => {
      let user = new UserLogin();
      user.profil = 'enseignant';
      user.code = this.code;
      this.loginByCode(user);
    }, error => {
      this.displaySpinner = false;
      this.erreur('errorCodeLogin');
    });
  }

  loginByCode(user: UserLogin) {
    console.log(user);
    this.api.loginByCode(user).subscribe(
      (data: any) => {
        if (data) {
          console.log(data[0]);
          this.ts.saveUser(data[0]);
          this.displaySpinner = false;
          this.router.navigate(['/accueil']);
        } else {
          this.displaySpinner = false;
          this.erreur('errorCodeIncorrect');
        }
      }, error => {
        this.displaySpinner = false;
        this.erreur('errorCodeLogin');
      });
  }


  resentcode() {
    this.displaySpinner = true;
    if (this.optionSend == 1) {
      let user = new User();
      user.email = this.email;
      console.log(user);
      this.api.resetPasswordByEmail(user).subscribe(res => {
        this.displaySpinner = false;
        this.comptearebour();
      }, error => {
        this.displaySpinner = false;
        this.erreur('errorMailExist');
      })
    } else if (this.optionSend == 2) {
      let user = new User();
      user.telephone = this.tel;
      console.log(user);
      this.api.resetPasswordByPhone(user).subscribe(res => {
        this.displaySpinner = false;
        this.comptearebour();
      }, error => {
        this.displaySpinner = false;
        this.erreur('errorPhoneExist');
      })
    }
  }

  tryotehermethod() {
    this.dis = false;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.code = '';
    this.tel = '';
    this.email = '';
    this.process = 0;
  }

  comptearebour() {
    const interval = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else if (this.minutes > 0) {
        this.minutes--;
        this.seconds = 59;
      } else if (this.hours > 0) {
        this.hours--;
        this.minutes = 59;
        this.seconds = 59;
      } else {
        clearInterval(interval);
        this.dis = true;
      }
    }, 1000);
  }

  isEmail(email: string): boolean {
    // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return emailRegex.test(email);
  }

  masquerNumeroTelephone(numero: string): string {
    if (numero.startsWith('+237') && numero.length === 13) {
      return numero.slice(0, 6) + '*******' + numero.slice(12);
    } else {
      return '******' + numero.slice(7);
    }
  }

  masquerEmail(email: string): string {
    const atIndex = email.indexOf('@');
    if (atIndex > 0) {
      const username = email.slice(0, atIndex);
      const maskedUsername = username.slice(0, 3) + '******';
      const domain = email.slice(atIndex);
      return maskedUsername + domain;
    } else {
      return "L'adresse e-mail n'est pas au format attendu.";
    }
  }
}
