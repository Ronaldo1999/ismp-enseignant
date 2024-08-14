import { Fichecriteres } from "../fichecriteres/fichecriteres"

export class CoursevaluationGlobal {

    user_update: string = 'admin'
    id!: number
    idparcours!: number
    idue!: number
    idperiode!: number
    idauditeur!: number
    idfichecriteres!:string
    idregroupement!: number
    observations!:string
    notes: Fichecriteres[] = []

}



