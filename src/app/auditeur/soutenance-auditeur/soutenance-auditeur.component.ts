import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Assiduite } from 'src/app/class/assiduite/assiduite';
import { Cour } from 'src/app/class/cour/cour';
import { ParcourAcademique } from 'src/app/class/parcourAcademique/parcour-academique';
import { PeriodeAcademique } from 'src/app/class/periodeAcademique/periode-academique';
import { User } from 'src/app/class/user/user';
import { ApiService } from 'src/app/services/api.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-soutenance-auditeur',
  templateUrl: './soutenance-auditeur.component.html',
  styleUrls: ['./soutenance-auditeur.component.scss']
})
export class SoutenanceAuditeurComponent {

  periodeAcademiques: PeriodeAcademique[] = [];
  user = new User();
  search = false;
  chargement = false;
  soutenances: any;

  constructor(public translate: TranslateService, private ts: SessionStorageService, public api: ApiService, private router: Router) {
    this.user = this.ts.getUser();
  }

  ngOnInit(): void { this.soutenancesByAuditeur(); }


  soutenancesByAuditeur() {
    this.chargement = true;
    this.api.soutenancesByAuditeur(this.user.idauditeur).subscribe({
      next: (data: any) => { this.soutenances = data; console.log(data); },
      error: (error: any) => { console.error(error); this.chargement = false; },
      complete: () => { console.info('complete'); this.chargement = false; }
    });
  }//---------------------------------------------------------------------------

}
