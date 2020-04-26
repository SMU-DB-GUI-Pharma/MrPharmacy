export class Prescription{
    constructor(createdDate,name="",medications=[]){
        this.createdDate = createdDate;
        this.name = name;
        this.medications = medications;
    }
}