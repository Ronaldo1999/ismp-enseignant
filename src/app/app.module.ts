import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigService } from './services/config.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { EditorModule } from 'primeng/editor';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TabMenuModule } from 'primeng/tabmenu';
import { TreeTableModule } from 'primeng/treetable';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
//import { NgxUploaderDirectiveModule } from 'ngx-uploader-directive';
import { PrimeModule } from './shared/prime.module';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ConfirmationService } from 'primeng/api';
import { AccueilComponent } from './accueil/accueil.component';
import { CourListComponent } from './auditeur/cour-list/cour-list.component';
import { NotesListComponent } from './auditeur/notes-list/notes-list.component';
import { ScolariteComponent } from './auditeur/scolarite/scolarite.component';
import { EvaluerCourComponent } from './auditeur/evaluer-cour/evaluer-cour.component';
import { LoginComponent } from './login/login.component';
import { SplitterModule } from 'primeng/splitter';
import { SplitButtonModule } from 'primeng/splitbutton';
import { AssiduiteComponent } from './enseignant/assiduite/assiduite.component';
import { AssiduiteAuditeurComponent } from './auditeur/assiduite-auditeur/assiduite-auditeur.component';
import { SoutenanceAuditeurComponent } from './auditeur/soutenance-auditeur/soutenance-auditeur.component';
import { DevoirComponent } from './enseignant/devoir/devoir.component';
import { NotationComponent } from './enseignant/notation/notation.component';
import { SessionComponent } from './enseignant/session/session.component';
import { SessioncoursComponent } from './enseignant/sessioncours/sessioncours.component';
import { SoutenanceComponent } from './enseignant/soutenance/soutenance.component';
import { NoteanonymeComponent } from './enseignant/noteanonyme/noteanonyme.component';
import { AnnonimatComponent } from './enseignant/annonimat/annonimat.component';

import { NoteSyntheseComponent } from './enseignant/notesynthese/notesynthese.component';
import { NotevalidationComponent } from './enseignant/notevalidation/notevalidation.component';
import { ProfileComponent } from './enseignant/profile/profile.component';
import { WelcomeComponent } from './enseignant/welcome/welcome.component';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxPrintModule } from 'ngx-print';
import { ResetpasswordComponent } from './enseignant/resetpassword/resetpassword.component';
import { NumberInputDirective } from './enseignant/number-input-directive.directive';
import { AudihomeworksComponent } from './enseignant/audihomeworks/audihomeworks.component';
import { AssiduiteDfsrComponent } from './enseignant/assiduite-dfsr/assiduite-dfsr.component';






export function initConfig(appConfig: ConfigService) {
  return () => appConfig.loadConfig();
}
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, 'assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AccueilComponent,
    CourListComponent,
    NotesListComponent,
    ScolariteComponent,
    EvaluerCourComponent,
    SoutenanceComponent,
    DevoirComponent,
    SessionComponent,
    NotationComponent,
    SessioncoursComponent,
    AssiduiteComponent,
    AssiduiteDfsrComponent,
    AssiduiteAuditeurComponent,
    SoutenanceAuditeurComponent,

    NoteanonymeComponent,
    AnnonimatComponent,
    NoteSyntheseComponent,
    NotevalidationComponent,
    ProfileComponent,
    WelcomeComponent,
    ResetpasswordComponent,
    NumberInputDirective,
    AudihomeworksComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule, HttpClientModule,

    PdfViewerModule,

    PrimeModule,
    DropdownModule,
    MultiSelectModule,
    TabMenuModule, SelectButtonModule, ProgressSpinnerModule,
    ConfirmPopupModule, ButtonModule, InputTextModule,
    TreeTableModule,
    ConfirmDialogModule, DialogModule, EditorModule, OverlayPanelModule, SplitterModule, SplitButtonModule,
    QRCodeModule, NgxPrintModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    DialogService,
    TranslateService,
    ConfirmationService,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [ConfigService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
