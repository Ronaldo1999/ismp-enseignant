import { Enseignant } from "../enseignant/enseignant";

export class Cour {


    nomperiode!: string;
    nomparcours!: string;
    nomregroupements!: string;
    nomsalle!: string;
    nomdiv!: string;
    nomue!: string;
    noter!: number;
    porteur!: number;
    nomenseignants!: string;




    idcp!: string;
    idpromotion!: number;
    idperiode!: number;
    idparcours!: number;
    idregroupements!: number;
    idue!: number;
    iddecoupage!: number;
    idsalle!: number;
    libelleFr!: string;
    libelleUs!: string;
    datejour!: string;
    datedeb!: string;
    datefin!: string;

    heuredeb!: string;
    heurefin!: string;
    annule!: number;
    annulemotif!: string;
    reporte!: number;
    reportemotif!: string;
    ensid!: string;
    ensnoms!: string;
    ensmail!: string;
    ensphone!: string;
    user!: string;
    typePeriode!: string;


    enseignants: Enseignant[] = [];

}
