import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './components/accueil/accueil.component';
import { AnnonimatComponent } from './components/annonimat/annonimat.component';
import { AssiduiteComponent } from './components/assiduite/assiduite.component';
import { DevoirComponent } from './components/devoir/devoir.component';
import { NotationComponent } from './components/notation/notation.component';
import { NoteanonymeComponent } from './components/noteanonyme/noteanonyme.component';
import { SessionComponent } from './components/session/session.component';
import { SessioncoursComponent } from './components/sessioncours/sessioncours.component';
import { SoutenanceComponent } from './components/soutenance/soutenance.component';


import { LoginComponent } from './components/login/login.component';
import { NoteSyntheseComponent } from './components/notesynthese/notesynthese.component';
import { NotevalidationComponent } from './components/notevalidation/notevalidation.component';
import { ProfileComponent } from './components/profile/profile.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { AudihomeworksComponent } from './components/audihomeworks/audihomeworks.component';
import { AssiduiteDfsrComponent } from './components/assiduite-dfsr/assiduite-dfsr.component';
import { LoginActivateGuard } from './services/login-activate.guard';



const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'resetpassword', component: ResetpasswordComponent },
  {
    path: 'accueil', component: AccueilComponent,
    // canActivate: [LoginActivateGuard],
    children: [
      { path: '', component: WelcomeComponent },
      { path: 'assiduite', component: AssiduiteComponent },
      { path: 'assiduite-dfsr', component: AssiduiteDfsrComponent },
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
