import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FindParam } from 'src/app/class/find-param';
import { ApiService } from 'src/app/services/api.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { Cour } from 'src/app/class/cour/cour';
import { PeriodeAcademique } from 'src/app/class/periodeAcademique/periode-academique';
import { ParcourAcademique } from 'src/app/class/parcourAcademique/parcour-academique';
import { Promotion } from 'src/app/class/promotion/promotion';
import { Regroupement } from 'src/app/class/regroupement/regroupement';
import { DivisionCalendaire } from 'src/app/class/divisionCalendaire/division-calendaire';
import { Ue } from 'src/app/class/ue/ue';

import { Salle } from 'src/app/class/salle/salle';
import { Seance } from 'src/app/class/seance/seance';
import { formatDate } from '@angular/common';
import { Programme } from 'src/app/class/programme/programme';
import { Enseignant } from 'src/app/class/enseignant/enseignant';
import { User } from 'src/app/class/user/user';

@Component({
  selector: 'app-cour-list',
  templateUrl: './cour-list.component.html',
  styleUrls: ['./cour-list.component.scss']
})
export class CourListComponent {

  user = new User();
  fparam: any;

  seance = new Cour();
  courInitial = new Cour();
  cours: Cour[] = [];
  salles: Salle[] = [];

  periodeAcademiques: PeriodeAcademique[] = [];
  parcoursAcademiques: ParcourAcademique[] = [];
  promotions: Promotion[] = [];
  regroupements: Regroupement[] = [];
  divisionCalendaires: DivisionCalendaire[] = [];
  enseignants: Enseignant[] = [];
  enseignantSelected: Enseignant[] = [];
  uniteEnseignements: Ue[] = [];
  ue = new Ue();

  weekend = false;
  search = false;
  displayDialog = false;
  displayReportDialog = false;
  displayAnnulerDialog = false;
  displayError = false;
  displaySucces = false;
  chargement = false;
  chargementUe = false;

  succesMessage = ''
  errorMessage = ''




  constructor(private messageService: MessageService, 
    private ts: SessionStorageService, public dialog: DialogService, public api: ApiService, public dialogService: DialogService,
    public translate: TranslateService, private router: Router) {
    this.fparam = new FindParam(this.ts.getOrganisation(), this.ts.getUser().username);
    this.user = this.ts.getUser();
  }

  ngOnInit(): void { this.seancesByAuditeur(); this.periodeAcademiqueList();  }


  rechercher() { this.seancesByAuditeur(); }

  periodeAcademiqueList() {
    this.api.periodeAcademiqueList().subscribe({
      next: (data: any) => { this.periodeAcademiques = data; console.log(data); },
      error: (error: any) => { console.error(error); },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------

  parcoursAcademiqueList() {
    this.api.parcoursAcademiqueList(this.courInitial.idperiode).subscribe({
      next: (data: any) => { this.parcoursAcademiques = data; console.log('parcoursAcademiques'); console.log(data); },
      error: (error: any) => { console.error(error); },
      complete: () => { console.info('complete'); }
    })
    this.regroupementListByPeriod();
  }
  //---------------------------------------------------------------------------

  promotionByParcList(event: { value: string }) {
    this.api.promotionByParcList(event.value).subscribe({
      next: (data: any) => { this.promotions = data; console.log('promotions'); console.log(data); },
      error: (error: any) => { console.error(error); },
      complete: () => { console.info('complete'); }
    });
    this.uniteEnseignementList(this.courInitial.idparcours);
  }
  //---------------------------------------------------------------------------
  regroupementListByPeriod() {
    this.api.regroupementListByPeriodList(this.courInitial.idperiode).subscribe({
      next: (data: any) => { this.regroupements = data; console.log(data); },
      error: (error: any) => { console.error(error); },
      complete: () => { console.info('complete'); }
    });
  }//---------------------------------------------------------------------------

  
  uniteEnseignementList(id:number) {
    this.api.uniteEnseignementByParcList(id).subscribe({
      next: (data: any) => { this.uniteEnseignements = data; console.log(data); },
      error: (error: any) => { console.error(error); },
      complete: () => { console.info('complete'); }
    })
  }

  //---------------------------------------------------------------------------
 
  courProgrammeListByRegroupement() {
    this.chargement = true;
    this.api.courProgrammeListByRegroupement(this.courInitial.idparcours, this.user.idregroupements, 0).subscribe({
      next: (data: any) => { this.cours = data;  this.chargement = false; console.log(data); },
      error: (error: any) => { console.error(error); this.chargement = false; },
      complete: () => { console.info('complete'); this.chargement = false; }
    });
  }

  //----------------------------------------------------------------------------

  seancesByAuditeur() {
    this.chargement = true;
    this.api.courProgrammeListByAuditeur(this.user.idauditeur, 50).subscribe({
      next: (data: any) => { this.cours = data; this.chargement = false; console.log(data); },
      error: (error: any) => { console.error(error); this.chargement = false; },
      complete: () => { console.info('complete'); this.chargement = false; }
    });
  }//---------------------------------------------------------------------------

  //----------------------------------------------------------------------------
  seanceDelete(i: number) { this.cours.splice(i, 1); this.cours = [...this.cours]; }
  //----------------------------------------------------------------------------



}
