import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { AssiduiteAuditeurComponent } from './auditeur/assiduite-auditeur/assiduite-auditeur.component';
import { CourListComponent } from './auditeur/cour-list/cour-list.component';
import { NotesListComponent } from './auditeur/notes-list/notes-list.component';
import { ScolariteComponent } from './auditeur/scolarite/scolarite.component';
import { SoutenanceAuditeurComponent } from './auditeur/soutenance-auditeur/soutenance-auditeur.component';
import { AnnonimatComponent } from './enseignant/annonimat/annonimat.component';
import { AssiduiteComponent } from './enseignant/assiduite/assiduite.component';
import { DevoirComponent } from './enseignant/devoir/devoir.component';
import { NotationComponent } from './enseignant/notation/notation.component';
import { NoteanonymeComponent } from './enseignant/noteanonyme/noteanonyme.component';
import { SessionComponent } from './enseignant/session/session.component';
import { SessioncoursComponent } from './enseignant/sessioncours/sessioncours.component';
import { SoutenanceComponent } from './enseignant/soutenance/soutenance.component';


import { LoginComponent } from './login/login.component';
import { NoteSyntheseComponent } from './enseignant/notesynthese/notesynthese.component';
import { NotevalidationComponent } from './enseignant/notevalidation/notevalidation.component';
import { ProfileComponent } from './enseignant/profile/profile.component';
import { WelcomeComponent } from './enseignant/welcome/welcome.component';
import { ResetpasswordComponent } from './enseignant/resetpassword/resetpassword.component';
import { AudihomeworksComponent } from './enseignant/audihomeworks/audihomeworks.component';
import { AssiduiteDfsrComponent } from './enseignant/assiduite-dfsr/assiduite-dfsr.component';
import { LoginActivateGuard } from './services/login-activate.guard';



const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'resetpassword', component: ResetpasswordComponent },
  {
    path: 'accueil', component: AccueilComponent,
    canActivate: [LoginActivateGuard],
    children: [
      { path: '', component: WelcomeComponent },

      //------------------------------------------------------------------

      { path: 'cours', component: CourListComponent },
      { path: 'scolariteAuditeur', component: ScolariteComponent },
      { path: 'assiduite', component: AssiduiteComponent },
      { path: 'assiduite-dfsr', component: AssiduiteDfsrComponent },
      { path: 'assiduiteAuditeur', component: AssiduiteAuditeurComponent },
      { path: 'notes', component: NotesListComponent },
      { path: 'soutenanceAuditeur', component: SoutenanceAuditeurComponent },


      { path: 'notation-anonymes', component: NoteanonymeComponent },
      { path: 'anonymes', component: AnnonimatComponent },
      { path: 'soutenances', component: SoutenanceComponent },
      { path: 'devoirs', component: DevoirComponent },
      { path: 'sessions', component: SessionComponent },
      { path: 'sessionscours', component: SessioncoursComponent },
      { path: 'notation-individuelles', component: NotationComponent },
      { path: 'notation-synthese', component: NoteSyntheseComponent },
      { path: 'notation-validation', component: NotevalidationComponent },
      { path: 'moncompte', component: ProfileComponent },
      { path: 'audihomeworks', component: AudihomeworksComponent },
    ]
  },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
