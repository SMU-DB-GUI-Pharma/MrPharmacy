export class Prescription{
    constructor(id,createdDate,name,medication,username,expired,effectId,dosageId,state,price,isRecurring,endDate,pharmacyId=-1){
        this.id = id;
        this.createdDate = createdDate;
        this.name = name;
        this.medication = medication;
        this.username = username;
        this.expired = expired;
        this.effectId = effectId;
        this.dosageId = dosageId;
        this.state = state;
        this.price = price;
        this.isRecurring = isRecurring;
        this.endDate = endDate;
        this.pharmacyId = pharmacyId;
    }
}