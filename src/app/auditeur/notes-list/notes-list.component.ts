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
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent {


  periodeAcademiques: PeriodeAcademique[] = [];
  parcoursAcademiques: ParcourAcademique[] = [];


  user = new User();
  cours: Cour[] = [];
  absences: Assiduite[] = [];
  search = false;
  chargement = false;
  notes: any;

  constructor(public translate: TranslateService, private ts: SessionStorageService, public api: ApiService, private router: Router) {
    this.user = this.ts.getUser();
  }

  ngOnInit(): void { this.notesByAuditeur(); }



  periodeAcademiqueList() {
    this.api.periodeAcademiqueList().subscribe({
      next: (data: any) => { this.periodeAcademiques = data; console.log(data); },
      error: (error: any) => { console.error(error); },
      complete: () => { console.info('complete'); }
    })
  }//---------------------------------------------------------------------------

  notesByAuditeur() {
    this.chargement = true;
    this.api.notesByAuditeur(this.user.idauditeur, 3).subscribe({
      next: (data: any) => { this.notes = data; console.log(data); },
      error: (error: any) => { console.error(error); this.chargement = false; },
      complete: () => { console.info('complete'); this.chargement = false; }
    });
  }//---------------------------------------------------------------------------


}
