import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { SessionStorageService } from '../services/session-storage.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent {
  items: MenuItem[] = [];
  notes: MenuItem[] = [];
  pars: MenuItem[] = [];
  sessions: MenuItem[] = [];
  user: any;
  profil: any;
  stateOptions: MenuItem[] = [];
  accounts: MenuItem[] = [];
  langue = this.translate.instant('Français');

  logoutDialog = false;
  constructor(
    public translate: TranslateService,
    private ts: SessionStorageService,
    private router: Router,
    public route: ActivatedRoute,
  ) {
    this.user = this.ts.getUser();
    this.router.events.subscribe((res) => {
      this.status = this.ts.getActiveItem();
      this.translate.use(this.ts.getActiveLang());
    });
  }

  ngOnInit(): void {
    this.translate.use(this.ts.getActiveLang());
    console.log(this.ts.getUser());
    this.toggleStatus(this.ts.getActiveItem());
    this.status = this.ts.getActiveItem();
    this.stateOptions = [
      { label: this.translate.instant('Français'), command: () => { this.changeLang('fr'); this.ts.saveActiveLang('fr'); } },
      { label: this.translate.instant('Anglais'), command: () => { this.changeLang('en'); this.ts.saveActiveLang('en'); } },
    ];
    this.accounts = [
      { icon: 'pi pi-user', label: this.translate.instant('Mon compte'), command: () => { }, routerLink: "/accueil/moncompte" },
      { icon: 'pi pi-sign-out', label: this.translate.instant('Quitter ma séssion'), command: () => { this.logOut() } },
    ];

    this.items = [
      { label: 'Evaluations', icon: 'pi pi-refresh', command: () => { } },
      { label: 'Affectations', icon: 'pi pi-caret-right', command: () => { } }
    ];
    this.sessions = [
      { label: 'Sessions simple', icon: 'pi pi-microsoft', routerLink: "/accueil/sessions", command: () => { } },
      { label: 'Sessions par U.E', icon: 'pi pi-microsoft', routerLink: "/accueil/sessionscours", command: () => { } }
    ];
    this.notes = [
      { label: 'Notes individuelles et de groupe', icon: 'fas fa-sticky-note', routerLink: '/accueil/notation-individuelles', command: () => { this.toggleStatus('notation') } },

      { label: "Notes d'examens", icon: 'pi pi-file', routerLink: '/accueil/notation-anonymes', command: () => { this.toggleStatus('notation') } },

      { label: "Validation des notes", icon: 'pi pi-check-square', routerLink: '/accueil/notation-validation', command: () => { this.toggleStatus('notation') } },
    ];
  }

  status: any = '';
  toggleStatus(val: string) {
    console.log(val);
    this.status = val;
    this.ts.saveActiveItem(val);
  }

  changeLang(event: any) { this.translate.use(event); this.ts.saveActiveLang(event); }

  logOut() { this.logoutDialog = true; }

  logout(): void { this.deconnexion(); }

  deconnexion() {
    this.ts.signOut();
    this.router.navigate(['']);
  }
  close() {
    this.logoutDialog = false;
  }
}
