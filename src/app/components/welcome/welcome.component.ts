import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Assiduite } from 'src/app/class/assiduite/assiduite';
import { Cour } from 'src/app/class/cour/cour';
import { Note } from 'src/app/class/notation';
import { RessourceSimple } from 'src/app/class/ressource/ressource';
import { Soutenance } from 'src/app/class/soutenance';
import { Stat } from 'src/app/class/state/state';
import { ApiService } from 'src/app/services/api.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  mode = '';
  displaySpinner = false;
  user: any;

  list: any[] = [];
  state: Stat = new Stat();
  data: any;
  chartOptions: any;
  ressources: RessourceSimple[] = [];
  cours: Cour[] = [];
  notes: Note[] = [];
  soutenances: Soutenance[] = [];
  audihomeworks: any[] = [];
  assiduites: Assiduite[] = [];

  chargCours = false;
  chargRes = false;
  chargUe = false;
  chargAs = false;
  chargSte = false;
  chargHaudi = false;
  constructor(
    public route: ActivatedRoute,
    public api: ApiService,
    public ts: SessionStorageService,
    public translate: TranslateService,
  ) { this.user = this.ts.getUser(); }

  ngOnInit(): void {
    console.log(this.ts.getUser());
    this.ressourceListByEnseignant();
    this.courssListByEnseignant();
    this.noteNonVaideListByEnseignant();
    this.tauxAssiduiteByCoursByEnseignant();
    this.soutenanceByEnseignant();
    this.audihomeworksByEnseignant();
  }

  reloadAll() {
    this.ressourceListByEnseignant();
    this.courssListByEnseignant();
    this.noteNonVaideListByEnseignant();
    this.tauxAssiduiteByCoursByEnseignant();
    this.soutenanceByEnseignant();
    this.audihomeworksByEnseignant();
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

  ressourceListByEnseignant() {
    this.chargRes = true;
    this.ressources = [];
    this.api.ressourceListByEnseignant(this.user.idenseignant).subscribe({ next: (data: any) => { this.ressources = data; this.chargRes = false; console.log(data); }, error: (error: any) => { this.chargRes = false; console.error(error); }, complete: () => { console.info('complete'); } })
  }
  courssListByEnseignant() {
    this.chargCours = true;
    this.cours = [];
    this.api.courssListByEnseignant(this.user.idenseignant).subscribe({ next: (data: any) => { this.cours = data; this.chargCours = false; console.log(data); }, error: (error: any) => { this.chargCours = false; console.error(error); }, complete: () => { console.info('complete'); } })
  }
  noteNonVaideListByEnseignant() {
    this.chargUe = true;
    this.notes = [];
    this.api.noteNonValideListByEnseignant(this.user.idenseignant).subscribe({ next: (data: any) => { this.notes = data; this.chargUe = false; console.log(data); }, error: (error: any) => { this.chargUe = false; console.error(error); }, complete: () => { console.info('complete'); } })
  }
  soutenanceByEnseignant() {
    this.chargSte = true;
    this.soutenances = [];
    this.api.soutenanceByEnseignant(this.user.idenseignant).subscribe({ next: (data: any) => { this.soutenances = data; this.chargSte = false; console.log(data); }, error: (error: any) => { this.chargSte = false; console.error(error); }, complete: () => { console.info('complete'); } })
  }
  audihomeworksByEnseignant() {
    this.chargHaudi = true;
    this.audihomeworks = [];
    this.api.listRessourceAudiByEns(this.user.idenseignant).subscribe((res: any) => {
      console.log(res);
      this.audihomeworks = res;
      this.chargHaudi = false;
    }, error => {
      this.chargHaudi = false;
    });
  }
  tauxAssiduiteByCoursByEnseignant() {
    this.chargAs = true;
    this.assiduites = [];
    this.api.tauxAssiduiteByCoursByEnseignant(this.user.idenseignant).subscribe({ next: (data: any) => { this.assiduites = data; this.chargAs = false; console.log(data); }, error: (error: any) => { this.chargAs = false; console.error(error); }, complete: () => { console.info('complete'); } })
  }


  onDownload(name: string): void {
    console.log(name);
    this.displaySpinner = true;
    const encodedFilename = btoa(name);
    this.api.download(name).subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/json' });
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

  cour: Cour = new Cour();
  getDetailCours(cour: Cour) {
    this.cour = cour;
    this.detailCoursDialog = true;
  }
  detailCoursDialog = false;
  messageDialog = false;
  srca = '';
  title = '';
  message = '';
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

  status: any = '';
  toggleStatus(val: string) {
    this.status = val;
    this.ts.saveActiveItem(val);
  }
}
