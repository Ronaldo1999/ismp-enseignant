

export class User {

    login: string = ''
    password: string = ''
    nom: string = ''
    id: number = 0
    name: string = ''
    prenom: string = ''
    telephone: string = ''
    organisationID: string = ''
    structureID: string = ''
    fonction: string = ''
    email: string = ''
    actif!: boolean
    service: string = ''
    facebook: string = ''
    whatsapp: string = ''
    twitter: string = ''
    googleplus: string = ''
    linkedln: string = ''
    userUpdate!: string
    ipUpdate: string = ''
    dateCreation: any
    structure!: string
    loginParent!: string
    code!: string;
    codeParent!: string;
    chaine!: string;
    profilPerformance!: string;

    oldpassword!: string;

    profilauditeur!: number;
    profilenseignant!: number;
    profiladmin!: number;
    profilregister!: number;
    profildsfr!: number;
    profildinep!: number;


    idauditeur!: number;
    idenseignant!: number;
    idregroupements!: number;


}


export class UserLogin {

    email: string = ''
    password: string = ''
    profil: string = ''
    code: string = ''
}

export class Profil {
    profilauditeur: string = ''
    profilenseignant: string = ''
    profiladmin: string = ''
    profilregister: string = ''
    profildsfr: string = ''
}
