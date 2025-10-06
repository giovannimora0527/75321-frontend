import { especializacion } from "./especializacion";
//Crear dos Modelos ya que va relacionado 
export class medico{

    id!:number;
    nombres !:string;
    apellidos !:string;
    tipoDocumento !:string;
    numeroDocumento !:string
    registroProfesional !:string;
    telefono !:string;
    //Hacemos la relacion
    especializacion !:especializacion;
}