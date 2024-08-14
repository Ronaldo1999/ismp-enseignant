export class Notation {
    notationID!: number;
    anneAccademiqueID!: number;
    parcourAccademiqueID!: number;
    regroupementID!: number;
    coursID!: number;
    sessionID!: number;
    etat!: number;
    anne!: string;
    parcours!: string;
    cours!: string;
}

export class SessionNotation {
    sessionNotationID!: number;
    notationID!: number;
    sessionID!: number;
    poids!: number;
}
export class Note {
    idreg!: number;
    idue!: number;
    idsession!: number;
    idaudi!: number;
    idens!: number;
    note!: number;
    notec!: string;
    base!: number;
    poids!: number;
    valide!: number;
    userValidation!: string;
    type!: number;
    nomue!: string;
    nomsession!: string;
    codeu!: string;
}

export class GlobalNote {
    id!: number;
    valide!: number;
    idue!: number;
    idreg!: number;
    idsession!: number;
    idens!: number;
    nomue!: string;
    nomens!: string;
    nomsession!: string;
    nomregroupement!: string;
    nomparcours!: string;
    notes!: Note[];
}


export class SessionCour {
    id!: number;
    anneAccademiqueID!: number;
    parcourAccademiqueID!: number;
    courid!: number;
    idsession!: number;
    nom!: string;
    poids!: number;
}
export class Se {
    courid!: number;
    sessions!: SessionCour[];
}

export class AuditeurNotation {
    auditeurNotationID!: number;
    notationID!: number;
    sessionID!: number;
    auditeurID!: number;
    note!: number;
}