import { HttpClient, HttpEvent, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cour } from '../class/cour/cour';
import { GlobalNote, SessionCour, Se, Notation } from '../class/notation';
import { Programme } from '../class/programme/programme';
import { Session } from '../class/session';
import { ConfigService } from './config.service';

import { SessionStorageService } from './session-storage.service';
import { User, UserLogin } from '../class/user/user';
import { Assiduite } from '../class/assiduite/assiduite';
import { Bulletin, GlobalRessource, Ressource, RessourceSimple } from '../class/ressource/ressource';
import { GlobalAnonymat } from '../class/anonymat/anonymat';
import { Fichecriteres } from '../class/fichecriteres/fichecriteres';
import { CoursevaluationGlobal } from '../class/coursevaluation/coursevaluation';
import { Coursevaluabilite } from '../class/coursevaluabilite/coursevaluabilite';
import { FindParam } from '../class/find-param';


@Injectable({
  providedIn: 'root'
})
export class ApiService {




  // --------------------- --------------------- --------------------- --------------------- --------------------- --------------------- --------------------- --------------------- ---------------------
  urlcourProgrammeList = ''
  urlcourProgrammeListByRegr = ''
  urlcourProgrammeListByAud = ''
  urlcourProgrammeInsert = ''
  urlcourProgrammeAnnuler = ''
  urlcourProgrammeReporter = ''
  urlPeriodeAcademique = ''
  urlParcourAcademique = ''
  urlpromotion = ''
  urlregroupement = ''
  urldivisionCalendaire = ''
  urlUniteEnseignement = ''
  urlUniteEnseignementByParc = ''
  urlUniteEnseignementByProgramme = ''
  urlUniteEnseignementByProgEns = ''
  urlEnseignantListByPeriode = ''
  urlEnseignantListByUe = ''
  urlSalleList = ''
  urlnotesByAuditeurList = ''
  urlEtatScolarite = ''
  urlSoutenancesByAuditeurList = ''
  // --------------------- --------------------- DINEP --------------------- --------------------- --------------------- --------------------- --------------------- ---------------------


  urlfichecriteresList = ''
  urlcoursevaluationInsert = ''
  urlcoursevaluabiliteInsert = ''
  urlfichecriteresByGroupList = ''
  urlfichegroupList = ''
  urlCoursEvaluabiliteList = '';
  urlCoursEvaluationSyntheseList = ''
  // --------------------- --------------------- --------------------- --------------------- --------------------- --------------------- --------------------- --------------------- ---------------------


  urlAuditeurListReg = ''
  urlAuditeurListByCp = ''
  urlAssiduiteInsert = ''
  urlAbsencesByAuditeurList = ''
  urlAuditeurList = ''

  urlListSoutenance = '';
  urlInsertSoutenance = '';
  urlDeleteSoutenance = '';

  urlListSession = '';
  urlListSessionByNotation = '';
  urlListSessionByNotationByCour = '';
  urlInsertSession = '';
  urlDeleteSession = '';


  urlListNotation = ''
  urlInsertNotation = ''
  urlInsertNotationSessionCour = ''
  urlInsertSessionCour = ''
  urlInsertSessionForCoursForParcour = ''
  urlDeleteNotation = ''


  urlLogin = '';
  urlFichierDownload = 'rhfile/file/download';
  urlFichierUpload = 'rhfile/file/upload';

  urlGenererAnonymat = '';
  urlListAuditeursAnonymes = ''
  urlInsertNotationAnonyme = '';

  urlAuditeurAnonymeList = '';

  urlInsertRessource = ''
  urlInsertRessourceSimple = ''
  urlRessourceList = ''
  urlUEListByEns = '';
  urlCoursListByEnseignant = '';
  urlUEListByRegByEns = '';
  urlListRegroupementByParcour = '';
  urlInsertNotationDefinitive = '';
  urlAuditeurListDefinitive = '';
  urlRessourceDelete = '';
  urlTelechargerFichier = '';

  urlRessourceListByEnseignant = '';
  urlCourssListByEnseignant = '';
  urlNoteNonValideListByEnseignant = '';
  urlTauxAssiduiteByCoursByEnseignant = '';
  urlSoutenanceEtatByEnsList = '';
  urlSoutenanceListByEns = '';
  urlSaveProfil = '';
  urlResetPasswordByPhone = '';
  urlResetPasswordByEmail = '';
  urlVerifyCodeReset = '';

  urlLoginByCode = '';
  urlAuditeurBulletinByID = '';
  urlaudihomeworksByEnsList = '';
  urlBulletinDownload = '';
  urlRessourceAudiList = '';

  urlchangePassword = '';
  urlcourProgrammeListValideByEns = '';
  urlNoteUEHistoAudi = '';
  urlUeProgrammeListEns = '';





  constructor(private http: HttpClient, private sessionService: SessionStorageService, private appConfigService: ConfigService) {
    const urlserveur = this.appConfigService.getConfig().serverIP;


    this.urlcourProgrammeList = urlserveur + 'coursProgrammeList'
    this.urlcourProgrammeListByRegr = urlserveur + 'coursProgrammeListeByRegroupement/'
    this.urlcourProgrammeListByAud = urlserveur + 'coursProgrammeListByAuditeur/'
    this.urlcourProgrammeInsert = urlserveur + 'coursProgrammeInsert'
    this.urlcourProgrammeAnnuler = urlserveur + 'annulerCoursProgramme'
    this.urlcourProgrammeReporter = urlserveur + 'reporterCoursProgramme'
    this.urlPeriodeAcademique = urlserveur + 'periodesAcademique';
    this.urlParcourAcademique = urlserveur + 'parcoursAcademique';
    this.urlpromotion = urlserveur + 'promotionByParc';
    this.urlregroupement = urlserveur + 'regroupementListByPerio';
    this.urldivisionCalendaire = urlserveur + 'divisionCalendaire';
    this.urlUniteEnseignement = urlserveur + 'uniteEnseignement';
    this.urlUniteEnseignementByParc = urlserveur + 'ueListByParcours';
    this.urlUniteEnseignementByProgramme = urlserveur + 'ueListProgramme/';
    this.urlUniteEnseignementByProgEns = urlserveur + 'ueListProgEns/';
    this.urlEnseignantListByPeriode = urlserveur + 'enseignantListByPeriod';
    this.urlEnseignantListByUe = urlserveur + 'enseignantListByUe';
    this.urlSalleList = urlserveur + 'sallesList';
    this.urlAuditeurList = urlserveur + 'auditeursNotesList';
    this.urlAuditeurListByCp = urlserveur + 'auditeursListByCp/';
    this.urlAssiduiteInsert = urlserveur + 'assiduiteInsert';
    this.urlAbsencesByAuditeurList = urlserveur + 'auditeurAbsencesList/';
    this.urlnotesByAuditeurList = urlserveur + 'auditeurNotesPersoList/';
    this.urlEtatScolarite = urlserveur + 'etatScolarite/';
    this.urlSoutenancesByAuditeurList = urlserveur + 'soutenanceListByAuditeur/';
    //**************************************************************/**************************************************************


    this.urlcoursevaluationInsert = urlserveur + 'coursEvaluationInsert'
    this.urlcoursevaluabiliteInsert = urlserveur + 'coursEvaluabiliteInsert'
    this.urlfichecriteresList = urlserveur + 'ficheCriteresList'
    this.urlfichecriteresByGroupList = urlserveur + 'ficheGroupeList/'
    this.urlfichegroupList = urlserveur + 'ficheGroupeList'
    this.urlCoursEvaluabiliteList = urlserveur + 'coursEvaluabiliteList';
    this.urlCoursEvaluationSyntheseList = urlserveur + 'courEvaluationSynthese';
    //**************************************************************/**************************************************************


    this.urlListNotation = urlserveur + 'notations';
    this.urlInsertNotation = urlserveur + 'noteUEInsert';
    this.urlInsertNotationSessionCour = urlserveur + 'notationSessionCourInsert';
    this.urlInsertSessionCour = urlserveur + 'notationSessionCourInsert';
    this.urlInsertSessionForCoursForParcour = urlserveur + 'sessionAllow';
    this.urlDeleteNotation = urlserveur + 'notationDelete';

    this.urlListSoutenance = urlserveur + 'soutenances';
    this.urlInsertSoutenance = urlserveur + 'soutenances/insert';
    this.urlDeleteSoutenance = urlserveur + 'soutenances/delete/';

    this.urlListSession = urlserveur + 'sessions';
    this.urlListSessionByNotation = urlserveur + 'notationSessionList';
    this.urlListSessionByNotationByCour = urlserveur + 'notationSessionListByCour';
    this.urlInsertSession = urlserveur + 'sessions/insert';
    this.urlDeleteSession = urlserveur + 'sessions/delete/';

    this.urlLogin = urlserveur + 'login';
    this.urlInsertRessource = urlserveur + 'ressourceUeCoursInsert';
    this.urlInsertRessourceSimple = urlserveur + 'ressourcesInsert';
    this.urlRessourceList = urlserveur + 'ressourceList';
    this.urlTelechargerFichier = urlserveur + 'telechargerFichier';
    this.urlFichierDownload = urlserveur + 'getImageRessource';
    this.urlFichierUpload = urlserveur + 'uploadImageRessource';


    this.urlListAuditeursAnonymes = urlserveur + 'listeAuditeursAnonymes';
    this.urlGenererAnonymat = urlserveur + 'genererAnonymat';
    this.urlInsertNotationAnonyme = urlserveur + 'saveNoteAnonymes';
    this.urlAuditeurAnonymeList = urlserveur + 'auditeursListAnonimat';
    this.urlUEListByEns = urlserveur + 'devoirUeByIdEns';
    this.urlCoursListByEnseignant = urlserveur + 'listCoursParEns';
    this.urlUEListByRegByEns = urlserveur + 'listUeByRegEns';
    this.urlListRegroupementByParcour = urlserveur + 'regroupementListByParcours';
    this.urlInsertNotationDefinitive = urlserveur + 'noteUEDefinitiveInsert';
    this.urlAuditeurListDefinitive = urlserveur + 'auditeursNotesListDefinitive';
    this.urlRessourceDelete = urlserveur + 'ressourceDelete';

    this.urlRessourceListByEnseignant = urlserveur + 'ressourceListByEnseignant';
    this.urlCourssListByEnseignant = urlserveur + 'coursListByEnseignant';
    this.urlNoteNonValideListByEnseignant = urlserveur + 'noteNonValideListByEnseignant';
    this.urlTauxAssiduiteByCoursByEnseignant = urlserveur + 'tauxAssiduiteByCoursByEnseignant';
    this.urlSoutenanceEtatByEnsList = urlserveur + 'soutenanceEtatByEns';
    this.urlSoutenanceListByEns = urlserveur + 'soutenanceListByEns';
    this.urlSaveProfil = urlserveur + 'saveProfil';
    this.urlResetPasswordByPhone = urlserveur + 'sendcodesms';
    this.urlResetPasswordByEmail = urlserveur + 'resetPassword';
    this.urlVerifyCodeReset = urlserveur + 'verifyCodeReset';
    this.urlLoginByCode = urlserveur + 'loginByCode';
    this.urlAuditeurBulletinByID = urlserveur + 'auditeurBulletinByID';
    this.urlaudihomeworksByEnsList = urlserveur + 'audihomeworksByEns';
    this.urlBulletinDownload = urlserveur + 'bulletinAuditeur';
    this.urlRessourceAudiList = urlserveur + 'ressourceAuditListByEnseignant';

    this.urlchangePassword = urlserveur + 'changePassword';
    this.urlcourProgrammeListValideByEns = urlserveur + 'coursListByEnseignant2';
    this.urlNoteUEHistoAudi = urlserveur + 'noteUEHistoAudi';
    this.urlUeProgrammeListEns = urlserveur + 'ueProgrammeListByEns';
  }

  // --------------------- --------------------- --------------------- --------------------- --------------------- --------------------- --------------------- --------------------- ---------------------
  // --------------------- --------------------- --------------------- --------------------- --------------------- --------------------- --------------------- --------------------- ---------------------
  // --------------------- FONCTIONS --------------------- FONCTIONS --------------------- FONCTIONS --------------------- FONCTIONS --------------------- FONCTIONS --------------------- FONCTIONS 
  // --------------------- --------------------- --------------------- --------------------- --------------------- --------------------- --------------------- --------------------- ---------------------
  // --------------------- --------------------- --------------------- --------------------- --------------------- --------------------- --------------------- --------------------- ---------------------





  // --------------------- AUDITEUR FONCTIONS  --------------------- AUDITEUR FONCTIONS 

  courProgrammeList() { return this.http.get(this.urlcourProgrammeList); }
  courProgrammeListByRegroupement(idparcours: number, idregroupements: number, idue: number) { return this.http.get(this.urlcourProgrammeListByRegr + idparcours + '/' + idregroupements + '/' + idue); }
  courProgrammeListByAuditeur(idauditeur: number, limit: number) { return this.http.get(this.urlcourProgrammeListByAud + idauditeur + '/' + limit); }

  courProgrammeListByEns(idparcours: number, idregroupements: number, idue: number) { return this.http.get(this.urlcourProgrammeListByRegr + idparcours + '/' + idregroupements + '/' + idue); }

  courProgrammeListValideByEns(idparcours: number, idregroupements: number, idue: number, idens: number) { return this.http.get(this.urlcourProgrammeListValideByEns + '/' + idparcours + '/' + idregroupements + '/' + idue + '/' + idens); }

  courProgrammeInsert(item: Programme): Observable<any> { return this.http.post(this.urlcourProgrammeInsert, item) }
  courProgrammeAnnuler(item: Cour): Observable<any> { return this.http.post(this.urlcourProgrammeAnnuler, item) }
  courProgrammeReporter(item: Cour): Observable<any> { return this.http.post(this.urlcourProgrammeReporter, item) }

  notesByAuditeur(idauditeur: number, limit: number) { return this.http.get(this.urlnotesByAuditeurList + idauditeur + '/' + limit); }
  salleList() { return this.http.get(this.urlSalleList); }
  periodeAcademiqueList() { return this.http.get(this.urlPeriodeAcademique); }
  parcoursAcademiqueList(id: number) { return this.http.get(this.urlParcourAcademique + '/' + id); }
  promotionByParcList(id: string) { return this.http.get(this.urlpromotion + '/' + id); }
  regroupementListByPeriodList(id: number) { return this.http.get(this.urlregroupement + '/' + id); }
  regroupementListByParcourList(id: number) { return this.http.get(this.urlListRegroupementByParcour + '/' + id); }
  divisionCalendaireList() { return this.http.get(this.urldivisionCalendaire); }
  uniteEnseignementList() { return this.http.get(this.urlUniteEnseignement); }
  uniteEnseignementByParcList(id: number) { return this.http.get(this.urlUniteEnseignementByParc + '/' + id); }
  uniteEnseignementByProgramme(idparcours: number, idregroupements: number) { return this.http.get(this.urlUniteEnseignementByProgramme + idparcours + '/' + idregroupements); }
  uniteEnseignementByProgEns(idenseignant: number, idregroupements: number) { return this.http.get(this.urlUniteEnseignementByProgEns + idenseignant + '/' + idregroupements); }
  enseignantListByPeriode(id: number) { return this.http.get(this.urlEnseignantListByPeriode + '/' + id); }
  enseignantListByUe(id: number) { return this.http.get(this.urlEnseignantListByUe + '/' + id); }

  auditeursListByCp(idparcours: number, idregroupements: number, idue: string) { return this.http.get(this.urlAuditeurListByCp + idparcours + '/' + idregroupements + '/' + idue); }

  assiduiteInsert(item: Assiduite[]): Observable<any> { return this.http.post(this.urlAssiduiteInsert, item) }
  absencesByAuditeur(idauditeur: number) { return this.http.get(this.urlAbsencesByAuditeurList + idauditeur); }
  etatScolarite(idauditeur: number, idregroupements: number) { return this.http.get(this.urlEtatScolarite + idauditeur + '/' + idregroupements); }
  soutenancesByAuditeur(idauditeur: number) { return this.http.get(this.urlSoutenancesByAuditeurList + idauditeur); }
  // --------------------- AUDITEUR FONCTIONS  --------------------- AUDITEUR FONCTIONS ^^^^^^^^^


  // ----------------------------------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------------------
  listFiche() { return this.http.get<Fichecriteres[]>(this.urlfichecriteresList); }
  insertEvaluation(c: CoursevaluationGlobal) { return this.http.post<any>(this.urlcoursevaluationInsert, c); }
  insertEvaluabilite(coursevaluabilite: Coursevaluabilite) { return this.http.post<any>(this.urlcoursevaluabiliteInsert, coursevaluabilite); }
  listFicheByGroupe(idfichegroupeID: string) { return this.http.get(this.urlfichecriteresByGroupList + idfichegroupeID); }
  courEvalubiliteByParcours(id: number) { return this.http.get(this.urlCoursEvaluabiliteList + '/' + id); }
  coursEvaluationSyntheseList() { return this.http.get<CoursevaluationGlobal[]>(this.urlCoursEvaluationSyntheseList); }
  // ----------------------------------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------------------


  getAllNotation() { return this.http.get(this.urlListNotation); }
  getNoteUEHistoAudi(idreg: number, idue: number, idsession: number, idaudi: number) {
    return this.http.get(this.urlNoteUEHistoAudi + '/' + idreg + '/' + idue + '/' + idsession + '/' + idaudi);
  }

  insertNotation(data: GlobalNote) {
    return this.http.post(this.urlInsertNotation, data);
  }
  insertNotationDefinitive(data: GlobalNote) {
    return this.http.post(this.urlInsertNotationDefinitive, data);
  }
  insertNotationSessionCour(data: SessionCour) {
    return this.http.post(this.urlInsertNotationSessionCour, data);
  }
  insertSessionCour(data: Se) {
    return this.http.post(this.urlInsertNotationSessionCour, data);
  }
  createSessionForCoursForParcour(parcourID: number) {
    return this.http.get(this.urlInsertSessionForCoursForParcour + '/' + parcourID);
  }

  deleteNotation(id: any) { return this.http.delete(this.urlDeleteNotation + id); }

  //************************************************************** Soutenances //**************************************************************
  getAllSoutenance() { return this.http.get(this.urlListSoutenance); }

  insertSoutenance(data: Notation) { return this.http.post(this.urlInsertSoutenance, data); }

  deleteSoutenance(id: any) { return this.http.delete(this.urlDeleteSoutenance + id); }

  //************************************************************** Soutenances //**************************************************************

  //************************************************************** Sessions //**************************************************************
  getAllSession() { return this.http.get(this.urlListSession); }
  getAllSessionByNotation(anneAccademiqueID: number, parcourAccademiqueID: number, coursID: number) {
    return this.http.get(this.urlListSessionByNotation + '/'
      + anneAccademiqueID + '/'
      + parcourAccademiqueID + '/'
      + coursID);
  }
  getAllSessionByNotationByCours(coursID: number) {
    return this.http.get(this.urlListSessionByNotationByCour + '/' + coursID);
  }

  insertSession(data: Session) { return this.http.post(this.urlInsertSession, data); }

  deleteSession(id: any) { return this.http.delete(this.urlDeleteSession + id); }


  uniteEnseignementListByParcour(id: number) { return this.http.get(this.urlUniteEnseignementByParc + '/' + id); }
  auditeursListByReg(id: number) { return this.http.get(this.urlAuditeurListReg + '/' + id); }

  auditeursNoteList(regid: number, ueid: number, sessionid: number) {
    return this.http.get(this.urlAuditeurList + '/' + regid + '/' + ueid + '/' + sessionid);
  }

  login(user: UserLogin) {
    return this.http.post(this.urlLogin, user);
  }
  loginByCode(user: UserLogin) {
    return this.http.post(this.urlLoginByCode, user);
  }

  download(encodedFilename: string) {
    const headers = new HttpHeaders().set('Accept', 'application/octet-stream');
    return this.http.get(`${this.urlFichierDownload}/${encodedFilename}` + "/images",
      { headers, responseType: 'blob', });
  }

  downloadFile(filename: string): Observable<Blob> {
    const headers = new HttpHeaders().set('Accept', 'application/octet-stream');
    return this.http.get(`${this.urlFichierDownload}/${filename}` + "/images", {
      headers: headers,
      responseType: 'blob'
    });
  }

  downloadBulletin(f: Bulletin) {
    const headers = new HttpHeaders().set('Accept', 'application/octet-stream');
    return this.http.post(`${this.urlBulletinDownload}`, f, { headers, responseType: 'blob', });
  }
  /*  telechargerFichier(encodedFilename: string) {
     const headers = new HttpHeaders().set('Accept', 'application/json');
     return this.http.get(`${this.urlTelechargerFichier}/${encodedFilename}`, { headers, responseType: 'blob', });
   }
  */
  telechargernFichier(ressource: RessourceSimple) {
    const headers = new HttpHeaders().set('Accept', 'application/octet-stream');
    return this.http.post(this.urlTelechargerFichier, ressource, { headers, responseType: 'blob', });
  }
  upload(file: File, login: string, type: any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('id', login);
    formData.append('file', file);
    formData.append('type', type);
    const req = new HttpRequest('POST', `${this.urlFichierUpload}`, formData, { reportProgress: true, responseType: 'json', });
    console.log(req);
    return this.http.request(req);
  }

  listeAuditeursAnonymes(regid: number, ueid: number, sessionid: number) {
    return this.http.get(this.urlListAuditeursAnonymes + '/' + regid + '/' + ueid + '/' + sessionid);
  }

  sessionListByCourid(coursID: number) {
    return this.http.get(this.urlListSessionByNotationByCour + '/' + coursID);
  }

  auditeursAnonymeList(regid: number, ueid: number, sessionid: number) {
    return this.http.get(this.urlAuditeurAnonymeList + '/' + regid + '/' + ueid + '/' + sessionid);
  }

  saveRessource(gr: GlobalRessource) {
    return this.http.post(this.urlInsertRessource, gr);
  }
  saveRessourceSimple(ressource: RessourceSimple) {
    return this.http.post(this.urlInsertRessourceSimple, ressource);
  }

  listRessource(parcourAccademiqueID: number, regroupementID: number, ueid: number) {
    return this.http.get(this.urlRessourceList + '/' + parcourAccademiqueID + '/' + regroupementID + '/' + ueid);
  }
  listRessourceAudiByEns(idens: number) {
    return this.http.get(this.urlRessourceAudiList + '/' + idens);
  }

  deleteRessource(idressource: string, userID: number) {
    return this.http.get(this.urlRessourceDelete + '/' + idressource + '/' + userID);
  }
  genererAnonymat(data: GlobalAnonymat) {
    return this.http.post(this.urlGenererAnonymat, data);
  }

  insertNotationAnonyme(data: GlobalNote) {
    return this.http.post(this.urlInsertNotationAnonyme, data);
  }

  ueListByEnseignant(idparcours: number, idregroupements: number, idens: number) {
    return this.http.get(this.urlUEListByEns + '/' + idparcours + '/' + idregroupements + '/' + idens);
  }

  coursListByEnseignant(idparcours: number, idregroupements: number, idue: number, idens: number) {
    return this.http.get(this.urlCoursListByEnseignant + '/' + idparcours + '/' + idregroupements + '/' + idue + '/' + idens);
  }
  ueListByParEnseignant(idparcours: number, idens: number) {
    return this.http.get(this.urlUEListByRegByEns + '/' + idparcours + '/' + idens);
  }

  ueProgrammeListByEns(idens: number, idregroupements: number) {
    return this.http.get(this.urlUeProgrammeListEns + '/' + idens + '/' + idregroupements);
  }

  auditeursListDefinitive(regid: number, ueid: number) {
    return this.http.get(this.urlAuditeurListDefinitive + '/' + regid + '/' + ueid);
  }

  ressourceListByEnseignant(iduser: number) {
    return this.http.get(this.urlRessourceListByEnseignant + '/' + iduser);
  }
  courssListByEnseignant(idens: number) {
    return this.http.get(this.urlCourssListByEnseignant + '/' + idens);
  }
  noteNonValideListByEnseignant(idens: number) {
    return this.http.get(this.urlNoteNonValideListByEnseignant + '/' + idens);
  }
  soutenanceByEnseignant(idens: number) {
    return this.http.get(this.urlSoutenanceEtatByEnsList + '/' + idens);
  }
  audihomeworksByEnseignant(idens: number) {
    return this.http.get(this.urlaudihomeworksByEnsList + '/' + idens);
  }
  soutenanceListByEnseignant(idens: number) {
    return this.http.get(this.urlSoutenanceListByEns + '/' + idens);
  }
  tauxAssiduiteByCoursByEnseignant(idens: number) {
    return this.http.get(this.urlTauxAssiduiteByCoursByEnseignant + '/' + idens);
  }

  saveProfil(user: User) {
    return this.http.post(this.urlSaveProfil, user);
  }
  resetPasswordByPhone(user: User) {
    return this.http.post(this.urlResetPasswordByPhone, user);
  }
  resetPasswordByEmail(user: User) {
    return this.http.post(this.urlResetPasswordByEmail, user);
  }
  verifyCodeReset(user: UserLogin) {
    return this.http.post(this.urlVerifyCodeReset, user);
  }
  auditeurBulletinByID(idparcours: number, idreg: number, idaudi: number) {
    return this.http.get(this.urlAuditeurBulletinByID + '/' + idparcours + '/' + idreg + '/' + idaudi);
  }

  changePassword(user: User) { return this.http.post(this.urlchangePassword, user); }

  //************************************************************** Sessions //**************************************************************

  // --------------------- AUDITEUR FONCTIONS  --------------------- AUDITEUR FONCTIONS 


  sessionByCoursList(id: number) { return this.http.get(this.urlpromotion + '/' + id); }


}
