export class Auditeur {
    id!: number;
    matricule!: string;
    nom!: string;
    prenom!: string;
    initiale!: number;
    note!: number;
    notec!: string;
    taflong!: number;
    individuelle!: number;
    examen!: number;
    valide!: number;
    commentaire!: string;
    base!: number;
    notepondere!: number;
    codeanonyme!: number;
}

export class Versement {
    organisationID!: string;
    anneeacademeiqueID!: number;
    parcoursacademeiqueID!: number;
    regroupementID!: number;
    auditeurID!: number;
    partieversante: string = 'M. OUETHY NANA JEAN EMMANUEL';
    nomeleve: string = 'TCHINDA TETCHA FLEURIANT RONALDO';
    emaileleve!: string;
    telephoneeleve!: string;
    objet: string = 'INSCRIPTION';
    montant: number = 150000;
    dateversement: string = '15/08/2024';
    datenaisseleve: string = '04/10/2002';
    telpv: string = '+237 698 876 371';
    adressepv: string = 'Cmr, YAOUNDE, ETOUDI FAYETTE';
}

