export class RessourceSimple {
    id!: string;
    idue!: number;
    idens!: number;
    idregroupements!: number;
    idparcours!: number;
    idperiode!: number;
    user!: string;
    description!: string;
    nomfichier!: string;
    cheminfichier!: string;
    forall!: number;
    typeressources!: number;
    lien!: string;
    typeressouce!: string;
    delai!: string;
    created_by!: string;
    created_at!: string;
    libelleFr!: string;
    libelleTypeRessource!: string;
    dateEmission!: string;
    nomue!: string;
}
export class Ressource {
    id!: string;
    idressource!: string;
    courid!: number;
    idue!: number;
    idregroupements!: number;
    idparcours!: number;
    idperiode!: number;
    created_by!: string;
    lien!: string;
}

export class GlobalRessource {
    id!: string;
    idueres!: string;
    idue!: number;
    idens!: number;
    idregroupements!: number;
    idparcours!: number;
    idperiode!: number;
    user!: string;
    description!: string;
    nomfichier!: string;
    cheminfichier!: string;
    forall!: number;
    typeressources!: number;
    lien!: string;
    typeressouce!: string;
    delai!: string;
    created_by!: string;
    created_at!: string;
    libelleFr!: string;
    libelleTypeRessource!: string;
    dateEmission!: string;
    nomue!: string;
    idressource!: string;
    ressources!: Ressource[];
}

export class Bulletin {
    idregroupements!: number;
    idparcours!: number;
    idaudi!: number;

}
