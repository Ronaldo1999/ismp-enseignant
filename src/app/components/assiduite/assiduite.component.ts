import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
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
import { formatDate } from '@angular/common';
import { Programme } from 'src/app/class/programme/programme';
import { Enseignant } from 'src/app/class/enseignant/enseignant';
import { User } from 'src/app/class/user/user';
import { Assiduite } from 'src/app/class/assiduite/assiduite';

import * as QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import '../../../locale';





@Component({
  selector: 'app-assiduite',
  templateUrl: './assiduite.component.html',
  styleUrls: ['./assiduite.component.scss']
})
export class AssiduiteComponent {

  fparam: any;

  programme = new Programme();

  cour = new Cour();
  seance = new Cour();
  courInitial = new Cour();
  cours: Cour[] = [];
  salles: Salle[] = [];

  auditeurs: Assiduite[] = [];

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
  displaySpinner = false;

  position = 'top'
  succesMessage = ''
  errorMessage = ''
  user = new User();





  liste: any[] = [];


  categorie = new Cour();

  dateTime: string = new Date().toLocaleString();

  currentDate: string;
  currentDate2: string;
  constructor(private messageService: MessageService, private confirmationService: ConfirmationService,
    private tokenStorageService: SessionStorageService, public dialog: DialogService, public api: ApiService, public dialogService: DialogService,
    public translate: TranslateService, private router: Router) {
    this.fparam = new FindParam(this.tokenStorageService.getOrganisation(), this.tokenStorageService.getUser().username);
    this.user = this.tokenStorageService.getUser();

    this.currentDate = formatDate(new Date(), 'EEEE dd MMMM yyyy " programmé à " HH:mm', 'fr');
    this.currentDate2 = formatDate(new Date(), 'EEEE dd MMMM yyyy', 'fr');

  }

  ngOnInit(): void { this.periodeAcademiqueList(); }

  rechercher() {
    if (this.courInitial.idparcours && this.courInitial.idregroupements && this.courInitial.idcp) {
      this.auditeurs = [];
      this.displaySpinner = true;
      this.api.auditeursListByCp(this.courInitial.idparcours, this.courInitial.idregroupements, this.courInitial.idcp).subscribe({
        next: (data: any) => {
          this.auditeurs = data;
          if (data.length > 0) {
            for (const ele of data) {
              if (ele.present) {
                this.selectedAuditeurs.push(ele);
              }
            }
          }
          console.log(data); this.displaySpinner = false;
        },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); this.displaySpinner = false; }
      });
    }

  }
  qrCodeImage = '';

  selectedAuditeurs: Assiduite[] = [];

  setPressence(action: number, idauditeur?: number) {
    if (action && action == 1) {
      for (const ele of this.auditeurs) {
        if (ele.idauditeur == idauditeur) {
          ele.present = !ele.present;
          this.auditeurs = [... this.auditeurs];
        }
      }
    } else if (action == 2) {
      if (this.selectedAuditeurs.length) {
        for (const ele of this.auditeurs) {
          ele.present = !ele.present;
          this.auditeurs = [... this.auditeurs];
        }
      }
    }
  }
  saveSpinner = false;
  assiduiteInsert() {
    this.saveSpinner = true;
    console.log(this.auditeurs);
    this.api.assiduiteInsert(this.auditeurs).subscribe({
      next: (data: any) => { console.log(data); this.saveSpinner = false; },
      error: (error: any) => { console.error(error); this.saveSpinner = false; this.openErrorDialog('Oops... Une erreur est survenue lors de l operation') },
      complete: () => { console.info('complete'); this.saveSpinner = false; this.openSuccesDialog('Fiche enregistrée avec succès'); }
    })
  }



  //---------------------------------------------------------------------------

  periodeAcademiqueList() {
    this.api.periodeAcademiqueList().subscribe({
      next: (data: any) => { this.periodeAcademiques = data; console.log(data); },
      error: (error: any) => { console.error(error); },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------

  parcoursAcademiqueList(id: number) {
    if (id) {
      this.displaySpinner = true;
      this.api.parcoursAcademiqueList(id).subscribe({
        next: (data: any) => { this.parcoursAcademiques = data; console.log(data); this.displaySpinner = false; },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }

  ueListByParEnseignant(id: number) {
    if (id) {
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
  regroupementListByParcourList(id: number) {
    if (id) {
      this.displaySpinner = true;
      this.api.regroupementListByParcourList(id).subscribe({
        next: (data: any) => { this.regroupements = data; console.log(data); this.displaySpinner = false; },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }
  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------

  promotionByParcList(event: { value: string }) {
    this.api.promotionByParcList(event.value).subscribe({
      next: (data: any) => { this.promotions = data; console.log('promotions'); console.log(data); },
      error: (error: any) => { console.error(error); },
      complete: () => { console.info('complete'); }
    });

  }
  //---------------------------------------------------------------------------
  regroupementListByPeriod() {
    this.api.regroupementListByPeriodList(this.courInitial.idperiode).subscribe({
      next: (data: any) => { this.regroupements = data; console.log(data); },
      error: (error: any) => { console.error(error); },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------

  nomreg = '';
  uniteEnseignementList(idregroupements: number) {
    this.nomreg = this.getRegroupement(idregroupements).nomreg;
    if (this.user.idenseignant && this.courInitial.idregroupements) {
      this.displaySpinner = true;
      this.api.uniteEnseignementByProgEns(this.user.idenseignant, this.courInitial.idregroupements).subscribe({
        next: (data: any) => { this.uniteEnseignements = data; this.displaySpinner = false; console.log(data); },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); this.displaySpinner = false; }
      });
    }
  }

  getRegroupement(idregroupements: number) {
    let reg = new Regroupement();
    for (const ele of this.regroupements) {
      if (ele.id == idregroupements) {
        reg = ele;
      }
    }
    return reg;
  }

  //---------------------------------------------------------------------------
  enseignantList(idue: number) {
    this.api.enseignantListByUe(idue).subscribe({
      next: (data: any) => { this.enseignants = data; console.log(data); },
      error: (error: any) => { console.error(error); },
      complete: () => { console.info('complete'); }
    });

  }

  //---------------------------------------------------------------------------
  courProgrammeList() {
    this.api.courProgrammeList().subscribe({
      next: (data: any) => { this.cours = data; console.log(data); },
      error: (error: any) => { console.error(error); },
      complete: () => { console.info('complete'); }
    })
  }

  courProgrammeListByRegroupement() {
    if (this.courInitial.idparcours && this.courInitial.idregroupements && this.courInitial.idue) {
      this.cour = this.getElement(this.courInitial.idue, this.uniteEnseignements);
      this.displaySpinner = true;
      this.api.courProgrammeListValideByEns(this.courInitial.idparcours, this.courInitial.idregroupements, this.courInitial.idue, this.user.idenseignant).subscribe({
        next: (data: any) => { this.cours = data; this.displaySpinner = false; console.log(data); },
        error: (error: any) => { console.error(error); this.displaySpinner = false; },
        complete: () => { console.info('complete'); this.displaySpinner = false; }
      });
    }
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


  dateDiffInDays(startDate: Date, endDate: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // millisecondes par jour
    return Math.floor((endDate.getTime() - startDate.getTime()) / oneDay);
  }

  //----------------------------------------------------------------------------
  openSuccesDialog(message: string) { this.succesMessage = message; this.displaySucces = true; }
  openErrorDialog(message: string) { this.errorMessage = message; this.displayError = true; }

  closeSucces() { this.displaySucces = false; }
  closeError() { this.displayError = false; }

  verifyLength(valeur: any) { let val = '' + valeur; if (val.toString().length >= 100) { return true; } return false; }
  defineDescription(libelle: any): string { let value = libelle.slice(0, 85); return value; }

  displayQRCore = false;
  showQrCode() {
    this.displayQRCore = true;
  }

  libellecours = '';
  courusage = new Cour();
  getCours(idcp: string) {
    this.courusage = new Cour();
    for (const ele of this.cours) {
      if (ele.idcp == idcp) {
        this.courusage = ele;
      }
    }
  }


  nbligne = 55;

  generatePDF(idcp: string, withname: number): void {

    const qrCodeData = `${idcp}`;

    QRCode.toDataURL(qrCodeData, (err, url) => {
      if (err) {
        console.error(err);
        return;
      }
      const doc = new jsPDF('landscape');
      doc.addImage('assets/ismp.jpeg', 'JPEG', 10, 10, 35, 30); // Ajouter l'image à gauche
      doc.setFontSize(12);
      doc.text('PROGRAMME DE MASTER PROFESSIONNEL EN MANAGEMENT PUBLIC (MP2)', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
      doc.text('YAOUNDÉ ' + this.nomreg, doc.internal.pageSize.getWidth() / 2, 27, { align: 'center' });
      doc.text('COURS DE ' + this.cour.nomue, doc.internal.pageSize.getWidth() / 2, 34, { align: 'center' });
      doc.setFontSize(14);
      doc.setFont('Helvetica', 'bold');
      doc.text('SÉANCE DU ' + formatDate(new Date(this.courusage.datejour), 'EEEE dd MMMM yyyy', 'fr'), doc.internal.pageSize.getWidth() / 2, 41, { align: 'center' });

      const textWidth = doc.getStringUnitWidth('SÉANCE DU ' + formatDate(new Date(this.courusage.datejour), 'EEEE dd MMMM yyyy', 'fr')) * 14 / doc.internal.scaleFactor;
      const startX = (doc.internal.pageSize.getWidth() - textWidth) / 2;
      const endX = startX + textWidth;

      doc.setLineWidth(0.1);
      doc.line(startX, 43, endX, 43);
      doc.addImage(url, 'PNG', doc.internal.pageSize.getWidth() - 50, 10, 30, 35);

      const headers = ['N°', 'Nom(s) & prénom(s)', 'Téléphone', 'Email', 'Signature'];
      const data = Array.from({ length: this.nbligne }, (_, index) => {
        let array: any[] = [];
        if (withname == 0) {
          array = [index + 1, '', '', '', '',];
        } else {
          array = [index + 1, this.auditeurs[index]?.nomauditeur || '', '', '', '', '',];
        }
        return array;
      });

      const totalWidth = doc.internal.pageSize.getWidth();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.height;
      let pageCount = 0;
      autoTable(doc, {
        head: [headers],
        body: data,
        theme: 'grid',
        // styles: { lineWidth: 0.1 },
        margin: { top: 30 },
        startY: 50,
        headStyles: { fillColor: [121, 46, 29], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 11, halign: 'center', valign: 'middle', },
        columnStyles: {
          0: { valign: 'middle', halign: 'center', fontStyle: 'bold', textColor: '#007ad9', cellWidth: (totalWidth * 0.05) },
          1: { valign: 'middle', halign: 'left', fontSize: 11, fontStyle: 'bolditalic', cellWidth: (totalWidth * 0.3) },
          2: { valign: 'middle', halign: 'center', fontSize: 11, fontStyle: 'bold', cellWidth: (totalWidth * 0.17) },
          3: { valign: 'middle', halign: 'center', fontSize: 11, fontStyle: 'bold', cellWidth: (totalWidth * 0.18) },
          4: { valign: 'middle', halign: 'center', fontSize: 11, fontStyle: 'bold' },
        },
        didDrawPage: (data) => {
          pageCount++;
          doc.setFontSize(10);
          const repetitiveText = "----- from ISMP-PLANNING-PLATEFORM -----";
          doc.setFontSize(10);
          doc.text(repetitiveText, pageWidth / 2, pageHeight - 10, { align: 'center' });
        }
      });
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setFontSize(10);
        doc.setFont('Helvetica', 'normal');
        doc.setPage(i);
        doc.text(`Page ${i} / ${totalPages}`, pageWidth - 30, pageHeight - 10);
      }
      const pdfData = doc.output('datauristring');
      const newWindow = window.open();
      newWindow?.document.write('<html><head><title>FICHE DE PRESENCE DU ' + this.currentDate + '</title></head><body>');
      newWindow?.document.write(`<iframe width='100%' height='100%' src='${pdfData}'></iframe>`);
      newWindow?.document.write('</body></html>');
    });
  }

}

