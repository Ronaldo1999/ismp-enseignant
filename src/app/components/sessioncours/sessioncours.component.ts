import { Component, OnInit } from '@angular/core';
import { Auditeur } from 'src/app/class/auditeur';
import { Cour } from 'src/app/class/cour/cour';
import { DivisionCalendaire } from 'src/app/class/divisionCalendaire/division-calendaire';
import { SessionNotation, AuditeurNotation, SessionCour, Se } from 'src/app/class/notation';
import { ParcourAcademique } from 'src/app/class/parcourAcademique/parcour-academique';
import { PeriodeAcademique } from 'src/app/class/periodeAcademique/periode-academique';
import { Promotion } from 'src/app/class/promotion/promotion';
import { Regroupement } from 'src/app/class/regroupement/regroupement';
import { Session } from 'src/app/class/session';
import { Soutenance } from 'src/app/class/soutenance';
import { Ue } from 'src/app/class/ue/ue';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-sessioncours',
  templateUrl: './sessioncours.component.html',
  styleUrls: ['./sessioncours.component.scss']
})
export class SessioncoursComponent implements OnInit {

  liste: any[] = [];

  fparam: any;

  sessionCour: SessionCour = new SessionCour();
  sessionCour2: SessionCour = new SessionCour();
  sessionNotations: SessionNotation[] = [];
  auditeurNotations: AuditeurNotation[] = [];
  totalPoid = 0;
  displaySpinner = false;

  categorie = new Cour();
  cours: Cour[] = [];
  periodeAcademiques: PeriodeAcademique[] = [];
  parcoursAcademiques: ParcourAcademique[] = [];
  promotions: Promotion[] = [];
  regroupements: Regroupement[] = [];
  sessions: Session[] = [];
  sessionsCours: SessionCour[] = [];
  allsessions: Session[] = [];
  auditeurs: Auditeur[] = [];
  divisionCalendaires: DivisionCalendaire[] = [];
  uniteEnseignements: Ue[] = [];
  selectedSession: SessionNotation = new SessionNotation();
  msginfo = 'Tous les champs avec etoile sont obligatoire, il faut leur donner une valeur pour enregistrer votre notation';
  titPar = 'Parcours académique';
  namesurname = 'Noms & prénoms';
  audregch = 'Les auditeurs par regroupement pour la séssion choisi';
  selectcours = 'Veuillez remplir les paramètres de filtres pour voir les sessions et les auditeurs';

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.getAllSession();
    this.periodeAcademiqueList();
  }
  updateDialog = false;
  libelle = '';

  getAllSession() {
    this.allsessions = [];
    this.api.getAllSession().subscribe((res: any) => {
      this.allsessions = res;
      console.log(res);
    });
  }

  getByID(id: number, tab: any[]) {
    let resultat: any;
    for (const ele of tab) {
      if (ele.id == id) {
        resultat = ele;
      }
    }
    return resultat;
  }

  getSes(id: number, tab: any[]) {
    for (const ele of tab) {
      if (ele.id == id) {
        this.sessionCour2 = ele;
      }
    }
  }
  delSes(id: any, tab: any[]) {
    tab.splice(id, 1)
  }



  close() {
    this.updateDialog = false;
  }
  messageDialog = false;
  srca = 'assets/img/attention.png';
  message = '';
  addSession() {
    let sescour: SessionCour = new SessionCour();
    this.sessionCour2.id = this.sessionsCours.length + 1;
    sescour.id = this.sessionsCours.length + 1;
    sescour.courid = this.sessionCour2.courid;
    sescour.idsession = this.sessionCour2.idsession;
    sescour.poids = this.sessionCour2.poids;
    console.log(sescour);
    console.log(this.sessionCour2);
    if (sescour.id) {
      this.messageDialog = false;
      for (const ele of this.sessionsCours) {
        if (ele.id == sescour.id) {
          ele.courid = this.sessionCour2.courid;
          ele.idsession = this.sessionCour2.idsession;
          ele.poids = this.sessionCour2.poids;
          this.messageDialog = false;
        }
        if (ele.idsession == sescour.idsession) {
          this.messageDialog = true;
          this.message = 'Cette session de base est déjà dans la liste pour ce cour';
        } else {
          this.messageDialog = false;
          sescour.id = this.sessionsCours.length + 1;
          this.sessionsCours.push(Object.assign({}, sescour));
        }
      }
    } else {
      if (this.sessionsCours.length) {
        for (const ele of this.sessionsCours) {
          if (ele.idsession == sescour.idsession) {
            this.messageDialog = true;
            this.message = 'Cette session de base est déjà dans la liste pour ce cour';
          } else {
            this.messageDialog = false;
            sescour.id = this.sessionsCours.length + 1;
            this.sessionsCours.push(Object.assign({}, sescour));
          }
        }
      } else {
        this.messageDialog = false;
        sescour.id = this.sessionsCours.length + 1;
        this.sessionsCours.push(Object.assign({}, sescour));
      }
    }
    console.log(this.sessionsCours);
    this.sessionCour2 = new SessionCour();
  }
  save() {
    console.log(this.sessionsCours);
    let t: Se = new Se();
    t.courid = this.sessionsCours[0].courid;
    t.sessions = [];
    for (const ele of this.sessionsCours) {
      let element = new SessionCour();
      element.id = ele.id;
      element.courid = ele.courid;
      element.idsession = ele.idsession;
      element.poids = ele.poids;
      t.sessions.push(Object.assign({}, element));
    }
    console.log(t);
    this.api.insertSessionCour(t).subscribe((res: any) => {
      this.getAllSessionByNotationByCours(this.sessionsCours[0].courid);
    });
  }

  create() {
    if (this.sessionCour.anneAccademiqueID) {
      this.api.createSessionForCoursForParcour(this.sessionCour.anneAccademiqueID).subscribe((res: any) => {
        if (this.sessionCour2.courid) {
          this.getAllSessionByNotationByCours(this.sessionCour2.courid);
        }
      });
    }
  }

  periodeAcademiqueList() {
    this.displaySpinner = true;
    this.api.periodeAcademiqueList().subscribe({
      next: (data: any) => { this.periodeAcademiques = data; console.log(data); this.displaySpinner = false; },
      error: (error: any) => { console.error(error); this.displaySpinner = false; },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------

  //----------------------------------------- parcoursAcademiqueList ----------------------------------

  parcoursAcademiqueList(id: number) {
    this.displaySpinner = true;
    this.api.parcoursAcademiqueList(id).subscribe({
      next: (data: any) => { this.parcoursAcademiques = data; console.log(data); this.displaySpinner = false; },
      error: (error: any) => { console.error(error); this.displaySpinner = false; },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------

  getAllSessionByNotationByCours(id: number) {
    this.sessionCour2 = new SessionCour();
    this.displaySpinner = true;
    this.api.sessionListByCourid(id).subscribe({
      next: (data: any) => {
        this.sessionsCours = data; console.log(data);
        this.displaySpinner = false;
        // this.sessionCour2.id = this.sessionsCours.length + 1;
      },
      error: (error: any) => { console.error(error); this.displaySpinner = false; },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------

  uniteEnseignementListByParcour(id: number) {
    this.displaySpinner = true;
    console.log(id);
    this.api.uniteEnseignementListByParcour(id).subscribe({
      next: (data: any) => {
        this.cours = data; console.log(data); this.displaySpinner = false;
      },
      error: (error: any) => { console.error(error); this.displaySpinner = false; },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------

  verifyLength(valeur: any) { let val = '' + valeur; if (val.toString().length >= 100) { return true; } return false; }
  defineDescription(libelle: any): string { let value = libelle.slice(0, 85); return value; }
}
