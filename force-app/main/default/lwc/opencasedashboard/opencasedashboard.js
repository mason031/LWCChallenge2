import getOpenCases from '@salesforce/apex/CaseHelper.getOpenCases';
import { LightningElement, wire } from 'lwc';
import CASE_NUMBER from '@salesforce/schema/Case.CaseNumber';
import CASE_ORIGIN from '@salesforce/schema/Case.Origin';
import CASE_SUBJECT from '@salesforce/schema/Case.Subject';
import CASE_PRIORITY from '@salesforce/schema/Case.Priority';
import { updateRecord } from 'lightning/uiRecordApi';
import {refreshApex} from '@salesforce/apex';
export default class Opencasedashboard extends LightningElement {
    @wire(getOpenCases)
    caseList;
    
    columns = [
        {label: "Case Number", fieldName: CASE_NUMBER.fieldApiName, editable: true},
        {label: "Case Origin", fieldName: CASE_ORIGIN.fieldApiName, editable: true},
        {label: "Case Subject", fieldName: CASE_SUBJECT.fieldApiName, editable: true},
        {label: "Case Priority", fieldName: CASE_PRIORITY.fieldApiName, editable: true},
    ]


    refreshlist(){
        refreshApex(this.caseList);
        console.log(JSON.stringify(this.caseList));
    }
    
    async handleSave(e){
        const records = e.detail.draftValues.slice().map((draftValue)=>{
            const fields = Object.assign({},draftValue);
            return {fields};
        })

        this.draftValues = [];
        try{
            const recordUpdatePromises = records.map((record)=>updateRecord(record));
            await Promise.all(recordUpdatePromises);

            await refreshApex(this.caseList);
        }catch(e){
            console.log(e);
        }
    }
    

}