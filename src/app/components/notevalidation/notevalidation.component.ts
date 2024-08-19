import { Component, OnInit } from '@angular/core';
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
import { SessionStorageService } from 'src/app/services/session-storage.service';

import * as QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import '../../../locale';

@Component({
  selector: 'app-notevalidation',
  templateUrl: './notevalidation.component.html',
  styleUrls: ['./notevalidation.component.scss']
})
export class NotevalidationComponent implements OnInit {

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
  user: any;
  constructor(
    private api: ApiService,
    private ts: SessionStorageService,
  ) {
    this.user = this.ts.getUser();
  }

  ngOnInit() {
    this.getAllSession();
    this.periodeAcademiqueList();
  }

  reload() {
    this.notation = new Notation();
    this.auditeurs = [];
    this.base = 0;
    this.getAllSession();
    this.periodeAcademiqueList();
  }

  sessionNotation: SessionNotation = new SessionNotation();
  close() {

  }
  sessionNotations: SessionNotation[] = [];
  auditeurNotations: AuditeurNotation[] = [];
  totalPoid = 0;
  displaySpinner = false;
  saveSessNot() {
    this.sessionNotation.sessionNotationID = this.sessionNotations.length + 1;
    this.sessionNotations.push(Object.assign({}, this.sessionNotation));
    this.totalPoid += this.sessionNotation.poids;
    console.log(this.sessionNotation);
    console.log(this.sessionNotations);
    this.sessionNotation = new SessionNotation();
  }

  sessionsCours: SessionCour[] = [];
  sessionListByCourid(id: number) {
    this.sessionsCours = [];
    this.displaySpinner = true;
    this.cour = this.getElement(id, this.uniteEnseignements);
    this.api.sessionListByCourid(id).subscribe({
      next: (data: any) => {
        this.sessionsCours = data; console.log(data);
        this.displaySpinner = false;
      },
      error: (error: any) => { console.error(error); this.displaySpinner = false; },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------

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
  base = 0;

  messageDialog = false;
  srca = 'assets/img/attention.png';
  title = '';
  message = '';

  getTypeRes(libeller: string) {
    let res = 0;
    switch (libeller) {
      case 'TRAVAIL LONG': res = 1; break;
      case 'TRAVAIL INDIVIDUEL': res = 2; break;
      case 'EXAMEN SUR TABLE': res = 3; break;
      default:
        break;
    }
    return res;
  }
  displayGSpinner = false;
  valider() {
    this.displayGSpinner = true;
    this.messageDialog = false;
    let gn = new GlobalNote();
    gn.id = 0;
    gn.valide = 1;
    gn.nomsession = this.getSess2(this.notation.sessionID).nom;
    gn.nomparcours = this.getElement(this.notation.parcourAccademiqueID, this.parcoursAcademiques).nomparc;
    gn.nomregroupement = 'YAOUNDÉ ' + this.nomreg;
    gn.nomue = this.cour.nomue;
    gn.idue = this.notation.coursID;
    gn.nomens = this.user.name;
    gn.notes = [];
    for (const ele of this.auditeurs) {
      let note: Note = new Note();
      note.idreg = this.notation.regroupementID;
      note.idue = this.notation.coursID;
      note.idsession = this.notation.sessionID;
      note.idaudi = ele.id;
      note.note = ele.note;
      note.notec = this.notation.parcourAccademiqueID + "." + this.notation.regroupementID + "." + this.notation.coursID + "." + this.notation.sessionID + "." + ele.note + "." + ele.id + "." + this.user.idenseignant;
      note.base = this.base;
      note.poids = this.getSess2(this.notation.sessionID).poids;
      note.userValidation = this.user.iduser;
      note.idens = this.user.idenseignant;
      note.valide = 1;
      note.type = this.getTypeRes(this.getSess2(this.notation.sessionID).nom);
      gn.notes.push(Object.assign({}, note));
    }
    console.log(gn);
    this.api.insertNotation(gn).subscribe((res: any) => {
      this.api.insertNotationDefinitive(gn).subscribe((res: any) => {
        this.displayGSpinner = false;
        this.auditeursList();
        this.succes('successValidation');
      }, error => {
        this.erreur('erreurValidation');
        this.displayGSpinner = false;
      });
    }, error => {
      this.erreur('erreurValidation');
      this.displayGSpinner = false;
    });

  }


  getAllNotation() {
    this.displaySpinner = true;
    this.notations = [];
    this.api.getAllNotation().subscribe((res: any) => {
      this.notations = res;
      this.displaySpinner = false;
      console.log(res);
    });
  }

  rechercher() {
    if (this.notation.parcourAccademiqueID && this.notation.regroupementID) {
      this.displaySpinner = true;
      this.api.ueListByEnseignant(this.notation.parcourAccademiqueID, this.notation.regroupementID, this.user.idenseignant).subscribe({
        next: (data: any) => { this.uniteEnseignements = data; console.log(data); this.displaySpinner = false; },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); this.displaySpinner = false; }
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
  chargementEnCours = false;
  auditeursListByReg(id: number) {
    this.displaySpinner = true;
    this.api.auditeursListByReg(id).subscribe({
      next: (data: any) => {
        this.auditeurs = data;
        this.base = data[0].base;
        console.log(data);
        this.displaySpinner = false;
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
        this.uniteEnseignements = data; console.log(data); this.displaySpinner = false;
      },
      error: (error: any) => { console.error(error); this.displaySpinner = false; },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------
  ueListByParEnseignant(id: number) {
    if (id) {
      this.uniteEnseignements = [];
      this.displaySpinner = true;
      console.log(id);
      this.api.ueListByParEnseignant(id, this.user.idenseignant).subscribe({
        next: (data: any) => {
          this.uniteEnseignements = data; console.log(data); this.displaySpinner = false;
        },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }//---------------------------------------------------------------------------
  //---------------------------------------------------------------------------
  regroupementListByPeriodList(id: number) {
    this.displaySpinner = true;
    this.api.regroupementListByPeriodList(id).subscribe({
      next: (data: any) => { this.regroupements = data; console.log(data); this.displaySpinner = false; },
      error: (error: any) => { console.error(error); this.displaySpinner = false; },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------
  regroupementListByParcourList(id: number) {
    this.displaySpinner = true;
    this.api.regroupementListByParcourList(id).subscribe({
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

  verifyLength(valeur: any) { let val = '' + valeur; if (val.toString().length >= 100) { return true; } return false; }
  defineDescription(libelle: any): string { let value = libelle.slice(0, 85); return value; }

  auditeursList() {
    if (this.notation.regroupementID && this.notation.sessionID && this.notation.coursID) {
      if (this.getSess2(this.notation.sessionID).poids == 50) {
        this.listeAuditeursAnonymes(this.notation.coursID);
      } else {
        this.displaySpinner = true;
        this.nomreg = this.getElement(this.notation.regroupementID, this.regroupements).nomreg;
        this.api.auditeursNoteList(this.notation.regroupementID, this.notation.coursID, this.notation.sessionID).subscribe({
          next: (data: any) => { this.auditeurs = data; this.base = 20; console.log(data); this.displaySpinner = false; },
          error: (error: any) => { console.error(error); this.displaySpinner = false; },
          complete: () => { console.info('complete'); }
        })
      }
    }
  }//---------------------------------------------------------------------------
  getElement(id: number, tab: any[]) {
    let element: any;
    for (const ele of tab) {
      if (ele.id == id) {
        element = ele;
      }
    }
    return element;
  }
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

  valide(tab: any[]): boolean {
    return tab.every(element => element.valide === 1);
  }
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

  nomreg = '';
  nomprenom = '';
  datenaiss = '';
  matricule = '';
  anne = '';

  cour = new Cour();
  getStatut(id: number) { let res = ''; if (id == 0) { res = 'PROVISOIRE' } else { res = 'DEFINITIF' } return res; }
  getProperty(property: any) { let res; if (property == 0 || property == '') { res = 'Indefinie'; } else { res = property } return res; }
  getPer(audteur: Auditeur) { let elements = audteur.notec.split('.'); return 'Vraie note (' + elements[1] + ')'; }
  getSeverty(property: string) { let res; if (property == 'AJOURNEE') { res = 'danger'; } else { res = 'success' } return res; }
  generatePDF(auditeurs: Auditeur[]): void {
    const doc = new jsPDF('landscape');
    doc.addImage('assets/ismp.jpeg', 'JPEG', 10, 10, 35, 30); // Ajouter l'image à gauche
    doc.setFontSize(12);
    doc.text('PROGRAMME DE MASTER PROFESSIONNEL EN MANAGEMENT PUBLIC (MP2)', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    doc.text('YAOUNDÉ ' + this.nomreg, doc.internal.pageSize.getWidth() / 2, 27, { align: 'center' });
    doc.text('COURS DE ' + this.cour.nomue, doc.internal.pageSize.getWidth() / 2, 34, { align: 'center' });
    doc.text('SESSION ' + this.getSess2(this.notation.sessionID).nom, doc.internal.pageSize.getWidth() / 2, 41, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont('Helvetica', 'bold');
    doc.text('RECAPITULATIF DES NOTES', doc.internal.pageSize.getWidth() / 2, 48, { align: 'center' });

    // Calculer la position de départ et de fin de la ligne de soulignement
    const textWidth = doc.getStringUnitWidth('RECAPITULATIF DES NOTES ') * 14 / doc.internal.scaleFactor;
    const startX = (doc.internal.pageSize.getWidth() - textWidth) / 2;
    const endX = startX + textWidth;

    doc.setLineWidth(0.1);
    doc.line(startX, 43, endX, 43);
    // Ajouter une deuxième image à droite si nécessaire
    doc.addImage('assets/soa.png', 'PNG', doc.internal.pageSize.getWidth() - 50, 10, 30, 35);

    // Définir le filigrane
    doc.setFontSize(40);
    doc.setTextColor(150);
    doc.text('ISMP-PLANNING PLATEFORM', doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() / 2, { align: 'center', angle: 45 });


    // Ajouter le pied de page avec le copyright
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`from ISMP-PLANNING-PLATEFORM - Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }


    // Ajouter le tableau avec les colonnes et les valeurs
    const tableColumns = ['N°', "Matricule", "Nom(s) & prénom(s)", "Note", "Pondérée/100", "Décision", "Statut"];
    const tableData = auditeurs.map((exam, index) => {
      return [index + 1, exam.matricule, exam.nom + ' - ' + exam.prenom, exam.note, exam.notepondere, exam.commentaire, this.getStatut(exam.valide)];
    });

    const totalWidth = doc.internal.pageSize.getWidth();
    autoTable(doc, {
      head: [tableColumns],
      body: tableData,
      theme: 'grid',
      styles: { lineWidth: 0.1 },
      margin: { top: 30 },
      startY: 52,
      headStyles: { fillColor: [121, 46, 29], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 11, halign: 'center', valign: 'middle', },
      columnStyles: {
        0: { valign: 'middle', halign: 'center', fontStyle: 'bold', textColor: '#007ad9', cellWidth: (totalWidth * 0.05) },
        1: { valign: 'middle', halign: 'center', fontSize: 11, fontStyle: 'bolditalic', cellWidth: (totalWidth * 0.1) },
        2: { valign: 'middle', halign: 'left', fontSize: 11, fontStyle: 'bold', cellWidth: (totalWidth * 0.35) },
        3: { valign: 'middle', halign: 'center', fontSize: 11, fontStyle: 'bold', cellWidth: (totalWidth * 0.1) },
        4: { valign: 'middle', halign: 'center', fontSize: 11, fontStyle: 'bold', cellWidth: (totalWidth * 0.1) },
        5: { valign: 'middle', halign: 'center', fontSize: 11, fontStyle: 'bold', cellWidth: (totalWidth * 0.1) },
        6: { valign: 'middle', halign: 'center', fontSize: 11, fontStyle: 'bold', cellWidth: (totalWidth * 0.1) }
      },
      didParseCell: function (data) {
        if (data.column.dataKey === 'Note') {
          const note = parseInt(data.cell.raw as string);
          if (!isNaN(note) && note === 18) {
            data.cell.styles.fillColor = [0, 128, 0];
          }
        }
      }
    });
    const pdfData = doc.output('datauristring');
    const newWindow = window.open();
    newWindow?.document.write('<html><head><title>RECAP DES NOTES</title></head><body>');
    newWindow?.document.write(`<iframe width='100%' height='100%' src='${pdfData}'></iframe>`);
    newWindow?.document.write('</body></html>');
  }

}
