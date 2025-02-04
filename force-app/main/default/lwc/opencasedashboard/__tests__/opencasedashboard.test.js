import { createElement } from 'lwc';
import Opencasedashboard from 'c/opencasedashboard';
import getOpenCases from '@salesforce/apex/CaseHelper.getOpenCases';
import {refreshApex} from '@salesforce/apex';
import { updateRecord} from 'lightning/uiRecordApi';
const DRAFT_VALUES = [
    {
        Id: '0031700000pJRRSAA4',
        FirstName: 'Amy',
        LastName: 'Taylor',
        Title: 'VP of Engineering',
        Phone: '4152568563',
        Email: 'amy@new_demo.net'
    },
    {
        Id: '0031700000pJRRTAA4',
        FirstName: 'Michael',
        LastName: 'Jones',
        Title: 'VP of Sales',
        Phone: '4158526633',
        Email: 'michael@new_demo.net'
    }
];
jest.mock(
    "@salesforce/apex",
    () => {
        return {
            refreshApex: jest.fn(() => Promise.resolve()),
        };
    },
    { virtual: true }
);
jest.mock(
    '@salesforce/apex/CaseHelper.getOpenCases',
    ()=>{
        const { createApexTestWireAdapter} = require('@salesforce/sfdx-lwc-jest');
        return {default:createApexTestWireAdapter(jest.fn())};
    },
    {virtual:true}
)

describe('c-opencasedashboard', () => {

    beforeEach(()=>{
        const element = createElement('c-opencasedashboard', {
            is: Opencasedashboard
        });

        document.body.appendChild(element);

    });

    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        jest.clearAllMocks();
    });
    async function flushPromises(){
        return Promise.resolve();
    }
    it('Test for the wire to make sure it gets the records', () => {
        

        const element = document.body.firstChild;
        
        const mockList = require('./wireData.json');
        getOpenCases.emit(mockList);
        return Promise.resolve().then(()=>{
            const datatable = element.shadowRoot.querySelector('lightning-datatable');
            expect(datatable.data.data[0].Subject).toBe("Seeking guidance on electrical wiring installation for GC5060");
        });

        //expect(1).toBe(1);
    });

    it('Test to see if the input works', async()=>{
        const element = document.body.firstChild;
        getOpenCases.mockResolvedValue([{status:'New'}]);
        
        const form = element.shadowRoot.querySelector('lightning-record-edit-form');
        let button = element.shadowRoot.querySelector('lightning-button');
       
        expect(button.type).toBe('submit');
        expect(button.label).toBe('Save Record');
        button.click();
        await flushPromises();
        
        form.dispatchEvent(new CustomEvent('success', {detail:{}}));
        await flushPromises();
        expect(refreshApex).toHaveBeenCalled();
        //expect(getOpenCases).toHaveBeenCalled();
    });

    it('Test to see if data edit event happens', async()=>{
        const element = document.body.firstChild;
        const datatable = element.shadowRoot.querySelector('lightning-datatable');
        datatable.dispatchEvent(new CustomEvent('save',{detail:{draftValues: DRAFT_VALUES}}));
        //datatable.draftValues=[{Origin:'Web'}]
        await flushPromises();
        expect(refreshApex).toHaveBeenCalled();

        expect(updateRecord).toHaveBeenCalled();
    })


});