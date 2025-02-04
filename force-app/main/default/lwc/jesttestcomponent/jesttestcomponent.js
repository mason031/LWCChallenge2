import { LightningElement } from 'lwc';

export default class Jesttestcomponent extends LightningElement {

    message = '';

    handleClick(){
        let input = this.refs.input.value;
        this.message = input;
    }

}