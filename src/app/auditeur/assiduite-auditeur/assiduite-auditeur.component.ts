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
  selector: 'app-assiduite-auditeur',
  templateUrl: './assiduite-auditeur.component.html',
  styleUrls: ['./assiduite-auditeur.component.scss']
})
export class AssiduiteAuditeurComponent {


  periodeAcademiques: PeriodeAcademique[] = [];
  parcoursAcademiques: ParcourAcademique[] = [];


  user = new User();
  profil: any;
  stateOptions: any[] = [];

  cours: Cour[] = [];
  absences: Assiduite[] = [];
  search = false;
  chargement = false;
  notes: any;

  constructor(public translate: TranslateService, private ts: SessionStorageService, public api: ApiService, private router: Router) {
    this.user = this.ts.getUser(); console.log(this.ts.getUser());
    this.profil = this.ts.getProfil();
  }

  ngOnInit(): void { this.periodeAcademiqueList(); this.absencesByAuditeur(); }



  periodeAcademiqueList() {
    this.api.periodeAcademiqueList().subscribe({
      next: (data: any) => { this.periodeAcademiques = data; console.log(data); },
      error: (error: any) => { console.error(error); },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------
  
  absencesByAuditeur() {
    this.api.absencesByAuditeur(this.user.idauditeur).subscribe({
      next: (data: any) => { this.absences = data; console.log(data); },
      error: (error: any) => { console.error(error); },
      complete: () => { console.info('complete'); }
    });
  }//---------------------------------------------------------------------------

  page() {
    this.router.navigate(['accueil/cours']);
  }


}
