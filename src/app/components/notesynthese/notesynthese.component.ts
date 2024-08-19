import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
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

import { Bulletin } from 'src/app/class/ressource/ressource';

import * as QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import '../../../locale';


@Component({
  selector: 'app-synthese',
  templateUrl: './notesynthese.component.html',
  styleUrls: ['./notesynthese.component.scss']
})
export class NoteSyntheseComponent implements OnInit {

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


  // Propriétés pour les données de l'auditeur et ses notes sur les unités d'enseignement
  auditeurData: any = {
    nom: 'TCHINDA TETCHA',
    prenom: 'FLEURIANT RONALDO',
    matricule: '023145002',
    // Autres propriétés de l'auditeur
  };
  // Tableau des groupes d'unités d'enseignement avec les notes de l'auditeur
  groupesUENotes: any[] = [
    {
      nomGroupe: 'Groupe 1',
      ues: [
        { codeUE: 'GRH', intitule: 'Gestion des ressource humaine', creditPre: 5, creditAcq: 5, note: 14, decision: 'Validé', session: 'Session 1' },
        { codeUE: 'UE2', intitule: 'Théorie des organisations', creditPre: 7, creditAcq: 2, note: 14, decision: 'Validé', session: 'Session 1' },
        { codeUE: 'UE3', intitule: 'Fondamentaux du management public', creditPre: 8, creditAcq: 8, note: 9, decision: 'Echec', session: 'Session 2' },

        // Autres UE du groupe 1
      ]
    },
    {
      nomGroupe: 'Groupe 2',
      ues: [
        { codeUE: 'MO', intitule: 'Management des organisation', creditPre: 4, creditAcq: 4, note: 16, decision: 'Validé', session: 'Session 1' },
        { codeUE: 'MCTD', intitule: 'Management des collectivités térritoriales descentralisées', creditPre: 4, creditAcq: 4, note: 18, decision: 'Validé', session: 'Session 2' },
        // Autres UE du groupe 2
      ]
    },];
  // Autres groupes d'UE



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
  save(valide: number) {
    if (this.base == 0) {
      this.messageDialog = true;
      this.message = 'Veuillez renseigner la base svp !';
      this.title = 'Attention !';
    } else {
      this.displaySpinner = true;
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
        gn.notes.push(Object.assign({}, note));
      }
      console.log(gn);
      this.api.insertNotation(gn).subscribe((res: any) => {
        this.auditeursList();
        this.updateDialog = false;
        if (valide == 0) {
          this.succes('successSaveNotation');
        } else {
          this.succes('successValidation');
        }
      }, error => {
        this.erreur('erreurSaveNotation');
        this.displaySpinner = false;
      });
    }
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
    if (id) {
      this.displaySpinner = true;
      this.api.parcoursAcademiqueList(id).subscribe({
        next: (data: any) => { this.parcoursAcademiques = data; console.log(data); this.displaySpinner = false; },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }//---------------------------------------------------------------------------
  chargementEnCours = false;
  auditeursListByReg(id: number) {
    if (id) {
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
    }
  }//---------------------------------------------------------------------------
  uniteEnseignementListByParcour(id: number) {
    if (id) {
      this.displaySpinner = true;
      console.log(id);
      this.api.uniteEnseignementListByParcour(id).subscribe({
        next: (data: any) => {
          this.uniteEnseignements = data; console.log(data); this.displaySpinner = false;
        },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }//---------------------------------------------------------------------------
  ueListByParEnseignant(id: number) {
    if (id) {
      this.getParcour(id);
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
  }

  parcou = new ParcourAcademique();

  getParcour(id: number) {
    this.parcou = new ParcourAcademique();
    for (const ele of this.parcoursAcademiques) {
      if (ele.id == id) {
        this.parcou = ele;
      }
    }
  }
  //---------------------------------------------------------------------------
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
      this.displaySpinner = true;

      this.api.auditeursNoteList(this.notation.regroupementID, this.notation.coursID, this.notation.sessionID).subscribe({
        next: (data: any) => { this.auditeurs = data; this.base = data[0].base; console.log(data); this.displaySpinner = false; },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }//---------------------------------------------------------------------------
  sess = '';
  auditeursListDefinitive(idregroupements: number) {
    if (this.notation.regroupementID && this.notation.coursID) {
      this.nomreg = this.getElement(idregroupements, this.regroupements).nomreg;
      this.displaySpinner = true;
      this.api.auditeursListDefinitive(this.notation.regroupementID, this.notation.coursID).subscribe({
        next: (data: any) => { this.auditeurs = data; console.log(data); this.displaySpinner = false; },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }//---------------------------------------------------------------------------
  tabnotes: any[] = [];
  auditeurBulletinByID(idaudi: number) {
    let f: Bulletin = new Bulletin();
    f.idparcours = this.notation.parcourAccademiqueID;
    f.idregroupements = this.notation.regroupementID;
    f.idaudi = idaudi;
    if (this.notation.parcourAccademiqueID && this.notation.regroupementID && idaudi) {
      this.displaySpinner = true;
      this.api.downloadBulletin(f).subscribe(
        (response) => {
          const fileURL = URL.createObjectURL(response);
          window.open(fileURL, '_blank');
          /* const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = atob('encodedFilename');
          link.click();
          window.URL.revokeObjectURL(url); */
          this.displaySpinner = false;
        },
        (error) => {
          this.displaySpinner = false;
          this.erreur('errorLoadAttachment');
          console.error('An error occurred while downloading the file:', error);
        }
      );
      /* this.api.auditeurBulletinByID(this.notation.parcourAccademiqueID, this.notation.regroupementID, idaudi).subscribe({
        next: (data: any) => {
          this.tabnotes = data; console.log(data);
          this.displaySpinner = false;
        },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); }
      }) */
    }
  }//---------------------------------------------------------------------------



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
  getRegroupement(idregroupements: number) {
    let reg = new Regroupement();
    for (const ele of this.regroupements) {
      if (ele.id == idregroupements) {
        reg = ele;
      }
    }
    return reg;
  }
  getAnne(idperiode: number) {
    let element = new PeriodeAcademique();
    for (const ele of this.periodeAcademiques) {
      if (ele.id == idperiode) {
        element = ele;
      }
    }
    return element;
  }

  getElement(id: number, tab: any[]) {
    let element: any;
    for (const ele of tab) {
      if (ele.id == id) {
        element = ele;
      }
    }
    return element;
  }
  generateBulletinAuditeur(qrdata: string) {
    const qrCodeData = `${qrdata}`;

    QRCode.toDataURL(qrCodeData, (err, url) => {
      if (err) {
        console.error(err);
        return;
      }
      const pdf = new jsPDF('landscape');

      const img = new Image();
      img.src = 'assets/ismp.jpeg';
      pdf.addImage(img, 'JPEG', 10, 10, 35, 25);

      const text = 'PROGRAMME DE MASTER PROFESSIONNEL EN MANAGEMENT PUBLIC (MP2)';
      const textReg = 'YAOUNDE ' + this.nomreg;
      const textRele = 'RELEVÉ DE NOTE/ANNUAL MARKS TRANSCRIPT N__________';

      const nomprenom = 'Nom(s) et Prénom(s) : ' + this.nomprenom;
      const datenaiss = 'Né(e) le : ' + this.datenaiss;
      const filiere = 'Filière : Master Management Publiques';
      const specialite = 'Spécialité : Management des Organisations Publiques';
      const matricule = ' Matricule : ' + this.matricule;
      const anne = 'Année Académique:2022-2024' + this.matricule;
      // const textSeance = 'SÉANCE DU ' + formatDate(new Date(this.courusage.datejour), 'EEEE dd MMMM yyyy', 'fr');
      const textWidth = pdf.getStringUnitWidth(text) / pdf.internal.scaleFactor;
      const textX = (pdf.internal.pageSize.width / 2) - (textWidth / 2);
      pdf.setFontSize(12);
      pdf.setFont('Helvetica', 'bold');
      pdf.text(text, textX, 15, { align: 'center' });
      pdf.setFontSize(10);
      pdf.setFont('Helvetica', '500');
      pdf.text(textReg, textX, 22, { align: 'center' });
      pdf.text(textRele, textX, 29, { align: 'center' });

      pdf.setFontSize(8);
      pdf.setFont('Helvetica', 'lighter');
      pdf.text(nomprenom, 15, 37);
      pdf.text(datenaiss, 15, 42);
      pdf.text(filiere, 15, 47);
      pdf.text(specialite, 15, 52);
      pdf.text(matricule, textX, 37);
      pdf.text(anne, textX, 42);
      pdf.text('Niveau : IV', textX, 47);
      // pdf.text(textSeance, textX, 36, { align: 'center' });


      const imagUrl = url;
      const qrCodeSize = 50;
      const qrCodeX = pdf.internal.pageSize.width - qrCodeSize - 10;
      pdf.addImage(imagUrl, 'PNG', qrCodeX, 10, 30, 30);
      /*  pdf.addImage(imagUrl, 'PNG', qrCodeX, 10, qrCodeSize, qrCodeSize); */

      const headers = ['Code UE', 'Code EC', 'Intitulé de lunité denseignement', 'Crédit Pre.', 'Crédit Acq.', 'Note/20', 'Dec.', 'Session'];
      const data = Array.from({ length: 50 }, (_, index) => { return ['', '', '', '', '', '', '', '', '',]; });

      autoTable(pdf, {
        head: [headers],
        body: data,
        theme: 'grid',
        styles: { lineWidth: 0.1, fontSize: 8 },
        margin: { top: 20 },
        startY: 55, // Position verticale du tableau (juste en dessous du contenu précédent)
        tableWidth: 'auto', // Largeur du tableau automatique
        columnStyles: { 0: { cellWidth: 'auto' }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 'auto' }, 3: { cellWidth: 'auto' }, 4: { cellWidth: 'auto' } }, // Largeur des colonnes
        didDrawPage: function (data: any) {
          const tableHeight = data.table.height + 20; // Hauteur du tableau avec une marge supplémentaire
          const contentHeight = pdf.internal.pageSize.height - data.settings.margin.top - tableHeight - 10; // Hauteur disponible pour le contenu
          const offsetY = (contentHeight - tableHeight) / 2; // Décalage vertical pour centrer le tableau
          pdf.setPage(data.pageNumber);
        }
      });
      const pdfData = pdf.output('datauristring');
      const newWindow = window.open();
      newWindow?.document.write('<html><head><title>RELEVÉ DE NOTE</title></head><body>');
      newWindow?.document.write(`<iframe width='100%' height='100%' src='${pdfData}'></iframe>`);
      newWindow?.document.write('</body></html>');
    });
  }


  // Méthode pour générer le bulletin au format PDF
  generateBulletinPDF(qrdata: string): void {
    const qrCodeData = `${qrdata}`;
    QRCode.toDataURL(qrCodeData, (err, url) => {
      if (err) {
        console.error(err);
        return;
      }
      const pdf = new jsPDF('p', 'mm', 'a4');
      let y = 15;

      const img = new Image();
      img.src = 'assets/ismp.jpeg';
      pdf.addImage(img, 'JPEG', 10, 10, 35, 25);

      const text = 'PROGRAMME DE MASTER PROFESSIONNEL EN MANAGEMENT PUBLIC (MP2)';
      const textReg = 'YAOUNDE ' + this.nomreg;
      const textRele = 'RELEVÉ DE NOTE/ANNUAL MARKS TRANSCRIPT N__________';
      const nomprenom = 'Nom(s) et Prénom(s) : ' + this.nomprenom;
      const datenaiss = 'Né(e) le : ' + this.datenaiss;
      const filiere = 'Filière : Master Management Publiques';
      const specialite = 'Spécialité : Management des Organisations Publiques';
      const matricule = ' Matricule : ' + this.matricule;
      const anne = 'Année Académique:2022-2024' + this.matricule;
      // const textSeance = 'SÉANCE DU ' + formatDate(new Date(this.courusage.datejour), 'EEEE dd MMMM yyyy', 'fr');
      const textWidth = pdf.getStringUnitWidth(text) / pdf.internal.scaleFactor;
      const textX = (pdf.internal.pageSize.width / 2) + 20 - (textWidth / 2);
      pdf.setFontSize(12);
      pdf.text(text, textX, 15, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text(textReg, textX, 22, { align: 'center' });
      pdf.text(textRele, textX, 29, { align: 'center' });

      pdf.setFontSize(8);
      pdf.text(nomprenom, 15, 37);
      pdf.text(datenaiss, 15, 42);
      pdf.text(filiere, 15, 47);
      pdf.text(specialite, 15, 52);
      pdf.text(matricule, textX, 37);
      pdf.text(anne, textX, 42);
      pdf.text('Niveau : IV', textX, 47);

      const imagUrl = url;
      const qrCodeSize = 50;
      const qrCodeX = pdf.internal.pageSize.width - qrCodeSize + 10;
      pdf.addImage(imagUrl, 'PNG', qrCodeX, 10, 30, 30);

      // Parcours des groupes d'UE
      this.groupesUENotes.forEach(groupe => {
        pdf.setFontSize(14);
        pdf.text(`Groupe: ${groupe.nomGroupe}`, 15, y);
        y += 10;

        // Calcul de la moyenne du groupe
        const totalNotes = groupe.ues.reduce((total: any, ue: { note: any; }) => total + ue.note, 0);
        const moyenneGroupe = totalNotes / groupe.ues.length;
        pdf.setFontSize(12);
        pdf.text(`Moyenne du groupe: ${moyenneGroupe.toFixed(2)}`, 15, y);
        y += 10;

        // Tableau des notes des UE du groupe
        const uesData = groupe.ues.map((ue: any) => [ue.codeUE, ue.intitule, ue.creditPre, ue.creditAcq, ue.note, ue.decision, ue.session]);
        pdf.autoTable({
          startY: y,
          head: [['Unité d\'enseignement', 'Unité de valeur', 'Crédit Pre.', 'Crédit Acq.', 'Note/20', 'Décision', 'Session']],
          body: uesData,
        });
        let finalY = (pdf as any).lastAutoTable.finalY;
        y = finalY + 10;
      });

      // Génération du PDF paginé
      let pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text(`Page ${i} sur ${pageCount}`, 150, 285);
      }

      // Sauvegarde du PDF
      const pdfData = pdf.output('datauristring');
      const newWindow = window.open();
      newWindow?.document.write('<html><head><title>RELEVÉ DE NOTE</title></head><body>');
      newWindow?.document.write(`<iframe width='100%' height='100%' src='${pdfData}'></iframe>`);
      newWindow?.document.write('</body></html>');


    });


  }

  cour = new Cour();
  getStatut(id: number) {
    let res = '';
    if (id == 0) {
      res = 'PROVISOIRE'
    } else {
      res = 'DEFINITIF'
    }
    return res;
  }
  getProperty(property: any) {
    let res;
    if (property == 0 || property == '') {
      res = '/';
    } else {
      res = property
    }
    return res;
  }
  generatePDF(auditeurs: Auditeur[]): void {
    const doc = new jsPDF('landscape');
    doc.addImage('assets/ismp.jpeg', 'JPEG', 10, 10, 35, 30); // Ajouter l'image à gauche
    doc.setFontSize(12);
    doc.text('PROGRAMME DE MASTER PROFESSIONNEL EN MANAGEMENT PUBLIC (MP2)', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    doc.text('YAOUNDÉ ' + this.nomreg, doc.internal.pageSize.getWidth() / 2, 27, { align: 'center' });
    doc.text('COURS DE ' + this.cour.nomue, doc.internal.pageSize.getWidth() / 2, 34, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont('Helvetica', 'bold');
    doc.text('RECAPITULATIF DES NOTES SUR 20', doc.internal.pageSize.getWidth() / 2, 41, { align: 'center' });

    // Calculer la position de départ et de fin de la ligne de soulignement
    const textWidth = doc.getStringUnitWidth('RECAPITULATIF DES NOTES SUR 20') * 14 / doc.internal.scaleFactor;
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
    const tableColumns = ['N°', "Matricule", "Nom(s) & prénom(s)", "Long", "Individuelle", "Examen", "Pondérée/100", "Décision", "Statut"];
    const tableData = auditeurs.map((exam, index) => {
      return [index + 1, this.getProperty(exam.matricule), this.getProperty(exam.nom) + ' - ' + this.getProperty(exam.prenom),
      exam.taflong, exam.individuelle, exam.examen,
      this.getProperty(exam.notepondere), this.getProperty(exam.commentaire), this.getStatut(exam.valide)];
    });

    const totalWidth = doc.internal.pageSize.getWidth();
    autoTable(doc, {
      head: [tableColumns],
      body: tableData,
      theme: 'grid',
      styles: { lineWidth: 0.1 },
      margin: { top: 30 },
      startY: 52,
      headStyles: { fillColor: [121, 46, 29], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9, halign: 'center', valign: 'middle', },
      columnStyles: {
        0: { valign: 'middle', halign: 'center', fontStyle: 'bold', textColor: '#007ad9', cellWidth: (totalWidth * 0.05) },
        1: { valign: 'middle', halign: 'center', fontSize: 10, fontStyle: 'bolditalic', cellWidth: (totalWidth * 0.1) },
        2: { valign: 'middle', halign: 'left', fontSize: 10, fontStyle: 'bold', cellWidth: (totalWidth * 0.27) },
        3: { valign: 'middle', halign: 'center', fontSize: 10, fontStyle: 'bold', cellWidth: (totalWidth * 0.07) },
        4: { valign: 'middle', halign: 'center', fontSize: 10, fontStyle: 'bold', cellWidth: (totalWidth * 0.07) },
        5: { valign: 'middle', halign: 'center', fontSize: 10, fontStyle: 'bold', cellWidth: (totalWidth * 0.07) },
        6: { valign: 'middle', halign: 'center', fontSize: 10, fontStyle: 'bold', cellWidth: (totalWidth * 0.07) },
        7: { valign: 'middle', halign: 'center', fontSize: 10, fontStyle: 'bold', cellWidth: (totalWidth * 0.1) },
        8: { valign: 'middle', halign: 'center', fontSize: 10, fontStyle: 'bold', cellWidth: (totalWidth * 0.1) }
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

  attestation(auditeur: Auditeur): void {
    console.log(auditeur);
    const doc = new jsPDF('landscape');
    const img = new Image();
    img.src = 'assets/attestation.png';
    img.onload = () => {
      const imgWidth = doc.internal.pageSize.getWidth();
      const imgHeight = doc.internal.pageSize.getHeight();
      doc.addImage(img, 'PNG', 0, 0, imgWidth, imgHeight);

      doc.setFontSize(42);
      doc.text(auditeur.nom + ' ' + auditeur.prenom, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() / 2, { align: 'center' });

      doc.save('bulletin de ' + auditeur.nom + ' ' + auditeur.prenom + '.pdf');
      /*  const pdfData = doc.output('datauristring');
       const newWindow = window.open();
       newWindow?.document.write('<html><head><title>RECAP DES NOTES</title></head><body>');
       newWindow?.document.write(`<iframe width='100%' height='100%' src='${pdfData}'></iframe>`);
       newWindow?.document.write('</body></html>'); */
    };
  }

  generatePdf(qrdata: string) {
    const qrCodeData = `${qrdata}`;

    QRCode.toDataURL(qrCodeData, (err, url) => {
      if (err) {
        console.error(err);
        return;
      }
      const doc = new jsPDF();

      const img1 = new Image();
      img1.src = 'assets/ismp.jpeg';
      const groupeData = this.groupData();
      const nomreg = this.nomreg;
      img1.onload = function () {
        const imgWidth = 50;
        const imgHeight = 50;
        const text = 'PROGRAMME DE MASTER PROFESSIONNEL EN MANAGEMENT PUBLIC (MP2)\n YAOUNDE' + nomreg + '\nRELEVÉ DE NOTE/ANNUAL MARKS TRANSCRIPT N__________';
        const textX = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(text) * doc.getFontSize() / 2);

        doc.addImage(img1, 'JPEG', 10, 10, imgWidth, imgHeight);
        doc.text(text, textX, 20, { align: 'center' });

        const img2 = new Image();
        img2.src = url;

        img2.onload = function () {
          const img2Width = 50;
          const img2Height = 50;
          const textWidth = doc.getStringUnitWidth(text) * doc.getFontSize();
          const textEndX = textX + textWidth;

          doc.addImage(img2, 'JPEG', textEndX + 10, 10, img2Width, img2Height);

          const tableHeader = [['Année académique', 'Semestre', 'Groupe', 'Unité d\'enseignement', 'Unité de valeur', 'Crédit Pre.', 'Crédit Acq.', 'Note/20', 'Décision']];
          const groupedData = groupeData; // Fonction à implémenter pour regrouper les données

          let startY = 80;
          groupedData.forEach((yearData) => {
            doc.autoTable({
              startY: startY,
              head: tableHeader,
              body: yearData.data,
              theme: 'grid',
              styles: { valign: 'middle' }
            });
            startY = (doc as any).lastAutoTable.finalY + 10;
            // startY = doc.autoTable.previous.finalY + 10;
          });

          const pdfData = doc.output('datauristring');
          const newWindow = window.open();
          newWindow?.document.write('<html><head><title>RELEVÉ DE NOTE</title></head><body>');
          newWindow?.document.write(`<iframe width='100%' height='100%' src='${pdfData}'></iframe>`);
          newWindow?.document.write('</body></html>');
        };
      };
    });

  }

  groupData() {
    // Implémentez cette fonction pour regrouper les données par groupe, puis par semestre, et enfin par année académique
    // Retournez les données groupées sous forme de tableau à deux dimensions
    return [
      { year: '2022', data: [['2022', 'Semester 1', 'Group A', 'Subject 1', 'Value 1', 'Credits Pre.', 'Credits Acq.', 'Grade', 'Decision']] },
      { year: '2021', data: [['2021', 'Semester 2', 'Group B', 'Subject 2', 'Value 2', 'Credits Pre.', 'Credits Acq.', 'Grade', 'Decision']] }
    ];
  }

}