import { Component } from '@angular/core';
import { Organisation } from '../class/organisation/organisation';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { User, UserLogin } from '../class/user/user';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from '../services/session-storage.service';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: any = {
    username: null,
    password: null,
  };
  stateOptions: any[] = [];

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  lang: string = 'fr';
  value1: string = 'fr';


  displaySpinner = false;
  user: User = new User();

  displayError = false;
  displaySucces = false;
  succesMessage: string = '';
  displayAffecter = false;
  displayAffecterPoste = false;
  ref!: DynamicDialogRef;
  organisations: any[] = [];

  parametre!: number;


  constructor(
    public dialogService: DialogService,
    private router: Router, private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    public translate: TranslateService,
    private ts: SessionStorageService,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.translate.use('fr');
    this.translate.use('fr');
    this.stateOptions = [
      { label: 'Français', value: 'fr' },
      { label: 'English', value: 'en' },
    ];

  }


  onSubmit(): void {
    this.displaySpinner = true;
    const { username, password } = this.form;

    let user = new UserLogin();
    user.email = username;
    user.password = password;
    user.profil = 'enseignant';
    console.log(user);
    this.api.login(user).subscribe(
      (data: any) => {
        if (data || data != undefined || data.length) {
          console.log(data[0]);
          this.ts.saveUser(data[0]);
          this.ts.saveProfil(data[0]);
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          console.log(this.ts.getUser().profil);
          this.displaySpinner = false;
          this.router.navigate(['/accueil']);
        } else if (data == undefined) {
          this.displaySpinner = false;
          this.errorMessage = 'Identifiants incorrects';
          this.isLoginFailed = true;
        } else {
          this.displaySpinner = false;
          this.errorMessage = 'Identifiants incorrects';
          this.isLoginFailed = true;
        }
      },
      (error) => {
        console.log(error.error);
        if (error.statusText == 'Unknown Error') {
          this.errorMessage = 'Impossible de joindre le serveur';
        } else if (error.error.error == 'Unauthorized') {
          this.errorMessage = 'Identifiants incorrects';
        } else {
          this.errorMessage = 'Identifiants incorrects';
        }
        this.displaySpinner = false;
        this.isLoginFailed = true;
      }
    );
  }

  vuec = false;
  togglePasswordVisibilityCon() {
    this.vuec = !this.vuec;
    const passwordInput = document.getElementById('passwordInputC') as HTMLInputElement;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }
}
