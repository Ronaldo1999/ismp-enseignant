import { Cour } from "../cour/cour";

export class Programme {

    nomperiode!: string;
    nomparcours!: string;
    nomregroupements!: string;
    nompromotion!: string;
    nomue!: string;
 
    idperiode!: number;
    idparcours!: number;
    idregroupements!: number;
    idpromotion!: number;
    idue!: number;

    user!:string

    cours: Cour[] = [];
}
