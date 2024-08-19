import { Component, OnInit } from '@angular/core';
import { TabView } from 'primeng/tabview';
import { Auditeur } from 'src/app/class/auditeur';
import { Cour } from 'src/app/class/cour/cour';
import { DivisionCalendaire } from 'src/app/class/divisionCalendaire/division-calendaire';
import { Notation, SessionNotation } from 'src/app/class/notation';
import { ParcourAcademique } from 'src/app/class/parcourAcademique/parcour-academique';
import { PeriodeAcademique } from 'src/app/class/periodeAcademique/periode-academique';
import { Promotion } from 'src/app/class/promotion/promotion';
import { Regroupement } from 'src/app/class/regroupement/regroupement';
import { GlobalRessource, Ressource, RessourceSimple } from 'src/app/class/ressource/ressource';
import { Salle } from 'src/app/class/salle/salle';
import { Session } from 'src/app/class/session';
import { Soutenance } from 'src/app/class/soutenance';
import { Ue } from 'src/app/class/ue/ue';
import { ApiService } from 'src/app/services/api.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-devoir',
  templateUrl: './devoir.component.html',
  styleUrls: ['./devoir.component.scss']
})
export class DevoirComponent implements OnInit {
  liste: any[] = [];
  devoirs: Soutenance[] = [];

  msginfo = 'Tous les champs avec etoile sont obligatoire, il faut leur donner une valeur pour enregistrer votre notation';
  titPar = 'Parcours académique';
  namesurname = 'Noms & prénoms';
  audregch = 'Les auditeurs par regroupement pour la séssion choisi';
  selectcours = 'Veuillez remplir les paramètres de filtres pour voir les sessions et les auditeurs';
  action = '';
  libelleNotation = '';
  updateDialog = false;
  notation: Notation = new Notation();
  displaySpinner = false;

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

  messageDialog = false;
  srca = '';
  title = '';
  message = '';
  user: any;
  /* Mes spinners */
  chargUe = false;
  chargeRes = false;

  constructor(
    private api: ApiService,
    private ts: SessionStorageService,
  ) {
    this.user = this.ts.getUser();
  }

  ngOnInit() {
    console.log(this.user);
    this.periodeAcademiqueList();
  }

  getAllSoutenance() {
    this.devoirs = [];
    this.api.getAllSoutenance().subscribe((res: any) => {
      this.devoirs = res || [];
    });
  }

  coursListByEnseignant(idue: number) {
    if (idue) {
      this.chargUe = true;
      console.log(this.notation.parcourAccademiqueID + "/" + this.notation.regroupementID + "/" + idue + "/" + this.user.idenseignant);
      this.api.coursListByEnseignant(this.notation.parcourAccademiqueID, this.notation.regroupementID, idue, this.user.idenseignant).subscribe({
        next: (data: any) => { this.cours = data; console.log(data); this.chargUe = false; },
        error: (error: any) => { console.error(error); this.chargUe = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }

  courProgrammeListByRegroupement(idue: number) {
    if (this.notation.parcourAccademiqueID && this.notation.regroupementID && idue) {
      this.cours = [];
      this.chargUe = true;
      this.api.courProgrammeListValideByEns(this.notation.parcourAccademiqueID, this.notation.regroupementID, idue, this.user.idenseignant).subscribe({
        next: (data: any) => { this.cours = data; this.chargUe = false; console.log(data); },
        error: (error: any) => { console.error(error); this.chargUe = false; },
        complete: () => { console.info('complete'); this.chargUe = false; }
      });
    }
  }

  //---------------------------------------------------------------------------

  reload() {
    this.uniteEnseignements = [];
    this.notation = new Notation();
    this.periodeAcademiqueList();
  }

  periodeAcademiqueList() {
    this.chargUe = true;
    this.periodeAcademiques = [];
    this.api.periodeAcademiqueList().subscribe({
      next: (data: any) => { this.periodeAcademiques = data; console.log(data); this.chargUe = false; },
      error: (error: any) => { console.error(error); this.chargUe = false; },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------

  //----------------------------------------- parcoursAcademiqueList ----------------------------------

  parcoursAcademiqueList(id: number) {
    if (id) {
      this.parcoursAcademiques = [];
      this.chargUe = true;
      this.api.parcoursAcademiqueList(id).subscribe({
        next: (data: any) => { this.parcoursAcademiques = data; console.log(data); this.chargUe = false; },
        error: (error: any) => { console.error(error); this.chargUe = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }//---------------------------------------------------------------------------
  promotionByParcList() {
    this.displaySpinner = true;
  }
  //---------------------------------------------------------------------------
  regroupementListByPeriodList(id: number) {
    if (id) {
      this.chargUe = true;
      this.api.regroupementListByPeriodList(id).subscribe({
        next: (data: any) => { this.regroupements = data; console.log(data); this.chargUe = false; },
        error: (error: any) => { console.error(error); this.chargUe = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }//---------------------------------------------------------------------------
  regroupementListByParcourList(id: number) {
    if (id) {
      this.chargUe = true;
      this.regroupements = [];
      this.api.regroupementListByParcourList(id).subscribe({
        next: (data: any) => { this.regroupements = data; console.log(data); this.chargUe = false; },
        error: (error: any) => { console.error(error); this.chargUe = false; },
        complete: () => { console.info('complete'); }
      })
    }
  }//---------------------------------------------------------------------------

  courInitial = new Cour();

  cour = new Cour();
  seance = new Cour();
  salles: Salle[] = [];

  verifyLength(valeur: any) { let val = '' + valeur; if (val.toString().length >= 100) { return true; } return false; }
  defineDescription(libelle: any): string { let value = libelle.slice(0, 85); return value; }
  search = false;

  rechercher() {
    if (this.notation.parcourAccademiqueID && this.notation.regroupementID) {
      this.uniteEnseignements = [];
      this.chargUe = true;
      this.api.ueListByEnseignant(this.notation.parcourAccademiqueID, this.notation.regroupementID, this.user.idenseignant).subscribe({
        next: (data: any) => { this.uniteEnseignements = data; console.log(data); this.chargUe = false; },
        error: (error: any) => { console.error(error); this.chargUe = false; },
        complete: () => { console.info('complete'); this.search = true; this.chargUe = false; }
      });
    }
  }
  file: any;
  selectedSeances: any[] = [];
  ressources: any[] = [];
  ressourcesAudit: any[] = [];
  typeRessources: any[] = [
    { id: 1, libelle: "DEVOIR À FAIRE" },
    { id: 2, libelle: "SUPPORT DE COUR" },
    { id: 3, libelle: "LIEN HYPERTEXT" },
    { id: 4, libelle: "CONTENU VIDEO" },
  ]
  ressource: RessourceSimple = new RessourceSimple();
  supportDialog = false;
  titleSupport = '';
  ue: Ue = new Ue();
  openDialog(ue: Ue) {
    this.ue = ue;
    this.selectedSeances = [];
    this.titleSupport = 'support' + ue.nomue;
    this.courProgrammeListByRegroupement(ue.id);
    this.listRessource(ue.id);
    this.ressource = new RessourceSimple();
    this.ressource.created_by = this.user.iduser;
    console.log(this.cour);
    this.supportDialog = true;
  }
  public files: any[] = [];
  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.file = file;
      this.files.push(file);
    }
  }

  /* onDownload(name: string): void {
    console.log(name);
    this.displaySpinner = true;
    const encodedFilename = btoa(name);
    this.api.downloadFile(name).subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = atob(encodedFilename);
        link.click();
        window.URL.revokeObjectURL(url);
        this.displaySpinner = false;
      },
      (error) => {
        this.displaySpinner = false;
        this.erreur('errorLoadAttachment');
        console.error('An error occurred while downloading the file:', error);
      }
    );
  } */

  /* onDownload(name: string): void {
    this.displaySpinner = true;
    const encodedFilename = btoa(name);
    this.api.downloadFile(name).subscribe(
      (response) => {
        if (response.body) {
          const blob = new Blob([response.body], { type: 'application/octet-stream' });
          saveAs(blob, atob(encodedFilename));
        } else {
          // Gérer le cas où la réponse est nulle
          console.error('The response body is null.');
        }
        this.displaySpinner = false;
      },
      (error) => {
        this.displaySpinner = false;
        this.erreur('errorLoadAttachment');
        console.error('An error occurred while downloading the file:', error);
      }
    );
  } */
  onDownload(filename: string): void {
    this.displaySpinner = true;
    this.api.downloadFile(filename).subscribe(
      (response: Blob) => {
        this.displaySpinner = false;
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
      }, (error) => {
        this.displaySpinner = false;
        console.error('An error occurred while downloading the file:', error);
      }
    );
  }
  telechargerFichier(res: RessourceSimple): void {
    console.log(res);
    this.displaySpinner = true;
    const encodedFilename = btoa(res.nomfichier);
    this.api.telechargernFichier(res).subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = atob(encodedFilename);
        link.click();
        window.URL.revokeObjectURL(url);
        this.displaySpinner = false;
      },
      (error) => {
        this.displaySpinner = false;
        this.erreur('errorLoadAttachment');
        console.error('An error occurred while downloading the file:', error);
      }
    );
  }

  onUpload(id: string, type: string) {
    console.log(this.file);
    this.api.upload(this.file, id, type).subscribe((res) => {
      console.log('bien entre');
    });
  }

  getTypeRes(id: number) {
    let libelle = '';
    switch (id) {
      case 1: libelle = "DEVOIR À FAIRE"; break;
      case 2: libelle = "SUPPORT DE COUR"; break;
      case 3: libelle = "LIEN HYPERTEXT"; break;
      case 4: libelle = "CONTENU VIDEO"; break;
      default:
        break;
    }
    return libelle;
  }
  getProperty(delai: string) {
    let libelle = '';
    for (const ele of this.ressources) {
      if (ele.delai == delai) {
        libelle = ele.delai;
      } else {
        libelle = 'Pas de delai';
      }
    }
    return libelle;
  }
  save(ressource: RessourceSimple) {
    const currentDate = new Date();
    const currentDateTime = currentDate.toLocaleString();
    const _idres = `RES${new Date().toISOString().replace(/[-:]/g, '').replace('T', '').replace(/\..*$/, '')}.${Math.floor(Math.random() * 1000)}.${Math.floor(Math.random() * 1000)}`;
    ressource.id = _idres;
    ressource.idparcours = this.notation.parcourAccademiqueID;
    ressource.idregroupements = this.notation.regroupementID;
    ressource.libelleTypeRessource = this.getTypeRes(ressource.typeressources);
    ressource.dateEmission = currentDateTime;
    ressource.idue = this.ue.id;
    ressource.idens = this.user.idenseignant;
    ressource.nomue = this.ue.nomue;
    if (ressource.typeressources != 3) {
      ressource.lien = 'lien';
    }
    console.log(ressource);
    this.displaySpinner = true;
    this.api.saveRessourceSimple(ressource).subscribe(res => {
      if (this.file) {
        this.onUpload(_idres, this.getTypeRes(ressource.typeressources));
      }
      const _idg = `UER${new Date().toISOString().replace(/[-:]/g, '').replace('T', '').replace(/\..*$/, '')}.${Math.floor(Math.random() * 1000)}.${Math.floor(Math.random() * 1000)}`;
      let gr: GlobalRessource = new GlobalRessource();
      gr.id = _idg;
      gr.idperiode = this.notation.anneAccademiqueID;
      gr.idparcours = this.notation.parcourAccademiqueID;
      gr.idue = this.ue.id;
      gr.idregroupements = this.notation.regroupementID;
      gr.idressource = _idres;
      gr.created_by = this.user.iduser;
      gr.lien = ressource.lien;
      gr.ressources = [];
      if (this.selectedSeances.length) {
        for (const ele of this.selectedSeances) {
          const _id = `CER${new Date().toISOString().replace(/[-:]/g, '').replace('T', '').replace(/\..*$/, '')}.${Math.floor(Math.random() * 1000)}.${Math.floor(Math.random() * 1000)}`;
          let sr: Ressource = new Ressource();
          sr.id = _id;
          sr.idperiode = this.notation.anneAccademiqueID;
          sr.idparcours = this.notation.parcourAccademiqueID;
          sr.idregroupements = this.notation.regroupementID;
          sr.idressource = _idres;
          sr.idue = this.ue.id;
          sr.courid = ele.idcp;
          sr.created_by = this.user.iduser;
          gr.ressources.push(Object.assign({}, sr));
        }
        console.log(gr);
        this.api.saveRessource(gr).subscribe(res => {
          this.selectedSeances = [];
          this.succes('successSaveRessource');
          this.rechercher();
          this.listRessource(this.ue.id);
          this.ressource = new RessourceSimple();
          this.displaySpinner = false;
        }, error => {
          this.erreur('erreurSaveRessource');
          this.displaySpinner = false;
        });
      } else {
        this.selectedSeances = [];
        this.succes('successSaveRessource');
        this.rechercher();
        this.listRessource(this.ue.id);
        this.ressource = new RessourceSimple();
        this.displaySpinner = false;
      }
    }, error => {
      this.displaySpinner = false;
      this.erreur('erreurSaveRessource');
    });
  }




  /*  save(ressource: RessourceSimple) {
     const currentDate = new Date();
     const currentDateTime = currentDate.toLocaleString();
     const _idres = `RES${new Date().toISOString().replace(/[-:]/g, '').replace('T', '').replace(/\..*$/, '')}.${Math.floor(Math.random() * 1000)}.${Math.floor(Math.random() * 1000)}`;
     const _idg = `UER${new Date().toISOString().replace(/[-:]/g, '').replace('T', '').replace(/\..*$/, '')}.${Math.floor(Math.random() * 1000)}.${Math.floor(Math.random() * 1000)}`;
     const gr = new GlobalRessource();
     gr.id = _idres;
     gr.idueres = _idg;
     gr.idparcours = this.notation.parcourAccademiqueID;
     gr.idregroupements = this.notation.regroupementID;
     gr.libelleTypeRessource = this.getTypeRes(ressource.typeressources);
     gr.dateEmission = currentDateTime;
     gr.idue = this.ue.id;
     gr.idens = this.user.idenseignant;
     gr.nomue = this.ue.nomue;
     gr.idressource = _idres;
     if (ressource.typeressources != 3) { gr.lien = 'lien'; } else { gr.lien = ressource.lien; }
     gr.ressources = []; console.log(this.selectedSeances); console.log(gr);
     if (this.selectedSeances.length > 0) {
       for (const ele of this.selectedSeances) {
         const _id = `CER${new Date().toISOString().replace(/[-:]/g, '').replace('T', '').replace(/\..*$/, '')}.${Math.floor(Math.random() * 1000)}.${Math.floor(Math.random() * 1000)}`;
         let sr: Ressource = new Ressource();
         sr.id = _id;
         sr.idperiode = this.notation.anneAccademiqueID;
         sr.idparcours = this.notation.parcourAccademiqueID;
         sr.idregroupements = this.notation.regroupementID;
         sr.idressource = _idres;
         sr.idue = this.ue.id;
         sr.courid = ele.idcp;
         sr.created_by = this.user.iduser;
         gr.ressources.push(Object.assign({}, sr));
       }
       console.log(gr);
     }
     console.log(ressource);
     this.displaySpinner = true;
     this.api.saveRessourceSimple(gr).subscribe(res => {
       if (this.file) {
         this.onUpload(_idres, this.getTypeRes(ressource.typeressources));
       }
       this.selectedSeances = [];
       this.succes('successSaveRessource');
       this.rechercher();
       this.listRessource(this.ue.id);
       this.ressource = new RessourceSimple();
       this.displaySpinner = false;
     }, error => {
       this.displaySpinner = false;
       this.erreur('erreurSaveRessource');
     });
   } */
  listRessource(id: number) {
    this.chargeRes = false;
    this.ressources = [];
    this.selectedSeances = [];
    if (this.notation.parcourAccademiqueID && this.notation.regroupementID && id) {
      this.api.listRessource(this.notation.parcourAccademiqueID, this.notation.regroupementID, id).subscribe((res: any) => {
        console.log(res);
        this.ressources = res;
        this.chargeRes = false;
      }, error => {
        // this.erreur('erreurSaveRessource');
        this.chargeRes = false;
      });
    }
  }

  listRessourceAudiByEns(id: any) {
    this.chargeRes = false;
    this.ressourcesAudit = [];
    this.api.listRessourceAudiByEns(this.user.idenseignant).subscribe((res: any) => {
      console.log(res);
      this.ressourcesAudit = this.filterByRes(res, id);
      this.devoirDialog = true;
      this.chargeRes = false;
    }, error => {
      this.chargeRes = false;
    });
  }
  filterByRes(list: any[], id: any) {
    return list.filter(item => item.idressource == id);
  }

  detailDialog = false;
  getDetail(item: any) {

  }

  comparerDates(dateString1: string, dateString2: string) {
    let res = false;
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);

    if (date1.toDateString() > date2.toDateString()) {
      res = true // Les dates sont égales
    } else {
      res = true; // Date 1 est antérieure à Date 2
    }
    return res;
  }

  convertirDate(dateString: string): string {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Ajoute un zéro devant si nécessaire
    const day = ('0' + dateObj.getDate()).slice(-2); // Ajoute un zéro devant si nécessaire

    return `${year}-${month}-${day}`;
  }
  devoirDialog = false;
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

  idres = '';
  libelleDel = '';
  deleteDialog = false;
  delete(res: Ressource) {
    this.idres = res.id;
    this.deleteDialog = true;
  }
  supprimer() {
    this.displaySpinner = true;
    this.api.deleteRessource(this.idres, this.user.idenseignant).subscribe((res: any) => {
      this.deleteDialog = false;
      this.listRessource(this.ue.id);
      this.rechercher();
      this.displaySpinner = false;
      this.succes('successDeleteRessource');
    }, error => {
      this.displaySpinner = false;
      this.erreur('erreurDeleteRessource');
    });
  }

  getRequired(type: number) {
    let res = false;
    if (type === 1) {
      /* Devoir a faire */
      if (this.ressource.typeressources && this.ressource.delai) {
        res = true;
      }
    } else if (type === 2 || type === 4) {
      /* Support de cours */
      if (this.ressource.typeressources && this.file) {
        res = true;
      }
    } else if (type === 3) {
      /* Lien hypertext */
      if (this.ressource.typeressources && this.ressource.description) {
        res = true;
      }
    }
    return res;
  }

  navigateToNextTab(tabView: TabView, currentIndex: number) {
    const nextIndex = (currentIndex + 1) % tabView.tabs.length;
    tabView.activeIndex = nextIndex;
  }
}
