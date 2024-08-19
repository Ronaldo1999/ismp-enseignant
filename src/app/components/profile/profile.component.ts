import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { User } from 'src/app/class/user/user';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: any;
  langue = this.translate.instant(this.ts.getActiveLang());
  stateOptions: any[] = [];
  profile = 'auditeur';
  action = 'view';
  userPost: User = new User();


  messageDialog = false;
  passwordDialog = false;
  displaySpinner = false;
  srca = '';
  mesact = 0;
  title = '';
  message = '';


  oldpassword!: string;
  newpassword!: string;
  repeatPass = '';

  repeatWell = false;
  wrongpass = false;

  constructor(public api: ApiService, public translate: TranslateService, private ts: SessionStorageService, private router: Router,) { this.user = this.ts.getUser(); }


  editProfile(action: string) {
    this.action = action;
  }


  saveProfile() {
    this.displaySpinner = true;
    this.userPost = new User();
    this.userPost.id = this.user.id;
    this.userPost.name = this.user.name;
    this.userPost.telephone = this.user.telephone;
    this.userPost.password = this.user.password;
    const user = this.userPost;
    console.log(user);
    this.api.saveProfil(user).subscribe(res => {
      this.displaySpinner = false;
      this.succes('successSaveProfil');
    }, error => {
      this.displaySpinner = false;
      this.erreur('errorSaveProfil');
    })
  }

  ngOnInit() {
    this.translate.use(this.ts.getActiveLang());
    this.stateOptions = [
      { id: 'fr', label: this.translate.instant('Français'), command: () => { this.changeLang('fr'); this.ts.saveActiveLang('fr'); } },
      { id: 'en', label: this.translate.instant('Anglais'), command: () => { this.changeLang('en'); this.ts.saveActiveLang('en'); } },
    ];
  }

  changeLang(event: any) { this.translate.use(event); this.ts.saveActiveLang(event); }

  succes(msg: string) {
    this.mesact = 1;
    this.srca = 'assets/img/ok.png';
    this.title = 'Succes !';
    this.message = msg;
    this.messageDialog = true;
  }
  erreur(msg: string) {
    this.mesact = 2;
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

  deconnexion() {
    this.messageDialog = false;
    this.ts.signOut();
    this.router.navigate(['']);
  }// --------------------------------------------------------




  vuec = false;
  togglePasswordVisibilityCon() {
    this.vuec = !this.vuec;
    const passwordInput = document.getElementById('inputPasswordOld') as HTMLInputElement;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }

  // --------------------------------------------------------

  checkRepeat() {
    if (this.newpassword) {
      if (this.newpassword == this.repeatPass) {
        this.repeatWell = true;
      } else {
        this.repeatWell = false;
      }
    } else {
      this.repeatWell = false;
    }
  }

  // --------------------------------------------------------
  openPassword() {
    this.passwordDialog = true;
  }// --------------------------------------------------------

  closePassword() { this.passwordDialog = false; this.repeatPass = ''; }

  // --------------------------------------------------------

  changePassword() {
    this.userPost.id = this.user.id; this.userPost.email = this.user.email; const user = this.userPost; console.log(user);
    this.displaySpinner = true;
    this.api.changePassword(user).subscribe({
      next: (data: any) => { this.succes('successSaveProfil'); this.displaySpinner = false; },
      error: (error: any) => { console.error(error); this.erreur('errorSaveProfil'); this.displaySpinner = false; this.wrongpass = true; },
      complete: () => { console.info('complete'); this.succes('successSaveProfil'); this.displaySpinner = false; }
    });
  }


}
