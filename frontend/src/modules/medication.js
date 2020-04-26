export class Medication{
    constructor(name,price,isRecurring,effectId,dosageId,state){
        this.name = name;
        this.price = price;
        this.isRecurring = isRecurring;
        this.effectId = effectId;
        this.dosageId = dosageId;
        this.state = state;
    }
}