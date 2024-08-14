import { Component, OnInit } from '@angular/core';
import { Anonymat, GlobalAnonymat } from 'src/app/class/anonymat/anonymat';
import { Auditeur } from 'src/app/class/auditeur';
import { Cour } from 'src/app/class/cour/cour';
import { DivisionCalendaire } from 'src/app/class/divisionCalendaire/division-calendaire';
import { AuditeurNotation, GlobalNote, Notation, Note, SessionCour, SessionNotation } from 'src/app/class/notation';
import { ParcourAcademique } from 'src/app/class/parcourAcademique/parcour-academique';
import { PeriodeAcademique } from 'src/app/class/periodeAcademique/periode-academique';
import { Promotion } from 'src/app/class/promotion/promotion';
import { Regroupement } from 'src/app/class/regroupement/regroupement';
import { Session } from 'src/app/class/session';
import { Ue } from 'src/app/class/ue/ue';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-annonimat',
  templateUrl: './annonimat.component.html',
  styleUrls: ['./annonimat.component.scss']
})
export class AnnonimatComponent implements OnInit {
  liste: any[] = [];
  notations: Notation[] = [];

  fparam: any;

  categorie = new Cour();
  cours: Cour[] = [];
  periodeAcademiques: PeriodeAcademique[] = [];
  parcoursAcademiques: ParcourAcademique[] = [];
  promotions: Promotion[] = [];
  regroupements: Regroupement[] = [];
  sessions: Session[] = [];
  auditeurs: Auditeur[] = [];
  divisionCalendaires: DivisionCalendaire[] = [];
  uniteEnseignements: Ue[] = [];
  selectedSession: SessionNotation = new SessionNotation();

  base = 0;

  messageDialog = false;
  srca = 'assets/img/attention.png';
  title = '';
  message = '';

  sessionNotation: SessionNotation = new SessionNotation();

  sessionNotations: SessionNotation[] = [];
  auditeurNotations: AuditeurNotation[] = [];
  totalPoid = 0;
  displaySpinner = false;

  sessionsCours: SessionCour[] = [];
  sessionsCoursTables: SessionCour[] = [];


  constructor(
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.getAllSession();
    this.periodeAcademiqueList();
  }

  reload() { this.notation = new Notation(); this.auditeurs = []; this.base = 0; this.getAllSession(); this.periodeAcademiqueList(); }

  sessionListByCourid(id: number) {
    this.displaySpinner = true;
    this.api.sessionListByCourid(id).subscribe((res: any) => {
      this.sessionsCours = res;
      for (const ele of res) {
        if (ele.poids === 50) {
          this.sessionsCoursTables.push(Object.assign({}, ele));
          if (this.sessionsCoursTables.length == 1) {
            this.notation.sessionID = this.sessionsCoursTables[0].idsession;
          }
          break;
        }
      }
      console.log(res);
      this.displaySpinner = false;
    }, error => {
      this.displaySpinner = false;
    });
  }

  getSess(id: number) {
    let session = new Session();
    for (const ele of this.sessions) {
      if (ele.id == id) {
        session = ele;
      }
    }
    return session;
  }
  getSess2(id: number) {
    let session = new SessionCour();
    for (const ele of this.sessionsCours) {
      if (ele.idsession == id) {
        session = ele;
      }
    }
    return session;
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


  genererAnonymat() {
    if (this.notation.sessionID) {
      let ga: GlobalAnonymat = new GlobalAnonymat();
      ga.id = 0;
      ga.anonymats = [];
      for (const ele of this.auditeurs) {
        let an: Anonymat = new Anonymat();
        an.ideva = this.notation.sessionID;
        an.idue = this.notation.coursID;
        an.idaudi = ele.id;
        an.anonymat = this.getAnnonymat();
        if (!ele.codeanonyme) {
          ga.anonymats.push(Object.assign({}, an));
        }
      }
      console.log(ga);
      this.api.genererAnonymat(ga).subscribe((res: any) => {
        this.listeAuditeursAnonymes(this.notation.coursID);
        this.updateDialog = false;
        this.succes('successGenerationAnonymat');
      }, error => {
        this.erreur('erreurGenerationAnonymat');
        this.displaySpinner = false;
      });
    }
  }

  allAnonymes(tab: any[]): boolean {
    return tab.every(element => element.codeanonyme != "");
  }

  displayGSpinner = false;
  save(valide: number) {
    if (this.base == 0) {
      this.messageDialog = true;
      this.message = 'Veuillez renseigner la base svp !';
      this.title = 'Attention !';
    } else {
      this.displayGSpinner = true;
      this.messageDialog = false;
      let gn = new GlobalNote();
      gn.id = 0;
      gn.notes = [];
      for (const ele of this.auditeurs) {
        let note: Note = new Note();
        note.idreg = this.notation.regroupementID;
        note.idue = this.notation.coursID;
        note.idsession = this.notation.sessionID;
        note.idaudi = ele.id;
        note.note = ele.note;
        note.base = this.base;
        note.poids = this.getSess2(this.notation.sessionID).poids;
        note.valide = valide;
        if (!ele.codeanonyme) {
          gn.notes.push(Object.assign({}, note));
        }
      }
      console.log(gn);
      this.api.insertNotationAnonyme(gn).subscribe((res: any) => {
        this.displayGSpinner = false;
        this.auditeursAnonymeList(this.notation.coursID);
        this.updateDialog = false;
        if (valide == 0) {
          this.succes('successSaveNotationAnonyme');
        } else {
          this.succes('successValidationAnonyme');
        }
      }, error => {
        if (valide == 0) {
          this.erreur('erreurSaveNotationAnonyme');
        } else {
          this.erreur('erreurValidationAnonyme');
        }
        this.displayGSpinner = false;
        this.displaySpinner = false;
      });
    }
  }

  periodeAcademiqueList() { this.displaySpinner = true; this.api.periodeAcademiqueList().subscribe({ next: (data: any) => { this.periodeAcademiques = data; console.log(data); this.displaySpinner = false; }, error: (error: any) => { console.error(error); this.displaySpinner = false; }, complete: () => { console.info('complete'); } }) }

  //----------------------------------------- parcoursAcademiqueList ----------------------------------

  parcoursAcademiqueList(id: number) { if (id) { this.displaySpinner = true; this.api.parcoursAcademiqueList(id).subscribe({ next: (data: any) => { this.parcoursAcademiques = data; console.log(data); this.displaySpinner = false; }, error: (error: any) => { console.error(error); this.displaySpinner = false; }, complete: () => { console.info('complete'); } }) } }

  auditeursListByReg(id: number) {
    if (id) {
      this.displaySpinner = true; this.api.auditeursListByReg(id).subscribe({
        next: (data: any) => {
          this.auditeurs = data; console.log(data); this.displaySpinner = false;
        }, error: (error: any) => { console.error(error); this.displaySpinner = false; }, complete: () => { console.info('complete'); }
      })
    }
  }

  uniteEnseignementListByParcour(id: number) { if (id) { this.displaySpinner = true; console.log(id); this.api.uniteEnseignementListByParcour(id).subscribe({ next: (data: any) => { this.cours = data; console.log(data); this.displaySpinner = false; }, error: (error: any) => { console.error(error); this.displaySpinner = false; }, complete: () => { console.info('complete'); } }) } }

  auditeursList() {
    if (this.notation.regroupementID && this.notation.sessionID && this.notation.coursID) {
      this.displaySpinner = true;
      this.api.auditeursNoteList(this.notation.regroupementID, this.notation.coursID, this.notation.sessionID).subscribe({
        next: (data: any) => { this.auditeurs = data; this.base = data[0].base; console.log(data); this.displaySpinner = false; },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }//---------------------------------------------------------------------------
  auditeursAnonymeList(coursID: number) {
    if (this.notation.regroupementID && this.notation.sessionID && coursID) {
      this.displaySpinner = true;
      this.api.auditeursAnonymeList(this.notation.regroupementID, this.notation.coursID, this.notation.sessionID).subscribe({
        next: (data: any) => { this.auditeurs = data; this.base = data[0].base; console.log(data); this.displaySpinner = false; },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }//---------------------------------------------------------------------------
  promotionByParcList() {
    this.displaySpinner = true;
    // this.api.courList().subscribe({
    //   next: (data: any) => { this.promotions = data; console.log(data); this.displaySpinner = false; },
    //   error: (error: any) => { console.error(error); this.displaySpinner = false; },
    //   complete: () => { console.info('complete'); }
    // })
  }
  //---------------------------------------------------------------------------
  regroupementListByPeriodList(id: number) {
    this.displaySpinner = true;
    this.api.regroupementListByPeriodList(id).subscribe({
      next: (data: any) => { this.regroupements = data; console.log(data); this.displaySpinner = false; },
      error: (error: any) => { console.error(error); this.displaySpinner = false; },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------
  sessionByCoursList(id: number) {
    this.displaySpinner = true;
    this.api.sessionByCoursList(id).subscribe({
      next: (data: any) => { this.regroupements = data; console.log(data); this.displaySpinner = false; },
      error: (error: any) => { console.error(error); this.displaySpinner = false; },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------

  getAllSession() {
    this.displaySpinner = true;
    this.sessions = [];
    this.api.getAllSession().subscribe((res: any) => {
      this.sessions = res;
      this.displaySpinner = false;
      console.log(res);
    }, error => { this.displaySpinner = false; });
  }
  action = '';
  libelleNotation = '';
  updateDialog = false;
  notation: Notation = new Notation();
  create() {
    this.action = 'new';
    this.libelleNotation = 'Nouvelle notation';
    this.notation = new Notation();
    this.updateDialog = true;
  }

  regroupementListByParcourList(id: number) {
    this.displaySpinner = true;
    this.api.regroupementListByParcourList(id).subscribe({
      next: (data: any) => { this.regroupements = data; console.log(data); this.displaySpinner = false; },
      error: (error: any) => { console.error(error); this.displaySpinner = false; },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------

  listeAuditeursAnonymes(coursID: number) {
    if (this.notation.regroupementID && this.notation.sessionID && coursID) {
      console.log(this.notation.regroupementID + "/" + this.notation.sessionID + "/" + coursID);
      this.displaySpinner = true;
      this.api.listeAuditeursAnonymes(this.notation.regroupementID, coursID, this.notation.sessionID).subscribe({
        next: (data: any) => {
          this.auditeurs = data;
          if (data.length) {
            this.base = data[0].base;
          }
          console.log(data); this.displaySpinner = false;
        },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }

  succes(msg: string) { this.srca = 'assets/img/ok.png'; this.title = 'Succes !'; this.message = msg; this.messageDialog = true; }
  erreur(msg: string) { this.srca = 'assets/img/attention.png'; this.title = 'Erreur !'; this.message = msg; this.messageDialog = true; }

  verifyLength(valeur: any) { let val = '' + valeur; if (val.toString().length >= 100) { return true; } return false; }
  defineDescription(libelle: any): string { let value = libelle.slice(0, 85); return value; }


  getAnnonymat(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

}
