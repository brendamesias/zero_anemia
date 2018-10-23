import React, {Component} from "react";
import {Button, DatePicker, Divider, Form, Modal, Select, Spin, Tabs, Input,Radio, List, Icon} from "antd";
import {fetchCollection} from "../firebase";
import moment from 'moment'
import firebase from "@firebase/app";
import titleize from "titleize";

import {
    concat,
    difference,
    filter,
    find,
    forEach,
    includes,
    intersection,
    intersectionBy,
    isEmpty,
    lowerCase,
    map,
    replace,
    sortBy
} from "lodash";
import uuidv1 from "uuid/v1";

const TabPane = Tabs.TabPane;
const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'HH:mm';
const {Option} = Select;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

class Control extends Component {

    constructor(props) {
        super(props);
        console.log(props.control)
        this.newTabIndex = 0;

        const panes = [
            { title: 'Tab 1', content: <span>hola</span>, key: '1' },
          ];

        this.state = {
            documentNumber: props.documentNumber,
            peso: props.control ? props.control.peso : "",
            talla: props.control ? props.control.talla : "",
            hb: props.control ? props.control.hb : "",
            hto: props.control ? props.control.hto : "",
            epcidina: props.control ? props.control.epcidina : "",
            ferritina: props.control ? props.control.ferritina : "",
            rstf: props.control ? props.control.rstf : "",
            epo: props.control ? props.control.epo : "",
            activeKey: panes[0].key,
            panes,
            child:isEmpty(props.child) ? [] : props.child,
            children:[],
            resultados:[],
            intesidadAnemia:"",
            tipoAnemia:"",
            visibleDx: false,
        }
    }

    componentDidMount(){
        fetchCollection("resultados", "resultados", this.fetchCollection);
    }

    fetchCollection = (name, data) => this.setState({[name]: data});

    calculateDx = (hb, hepcidina, ferritina, rstf, epo) => {
        let intesidadAnemia = "";
        let tipoAnemia = "";

        console.log(this.state.resultados)

        if(hb>=10 && hb <11) {
            intesidadAnemia = this.state.resultados[0].anemiaLeve
        }else if (hb>7 && hb<10){
            intesidadAnemia = this.state.resultados[0].anemiaModerada
        }else if (hb<7){
            intesidadAnemia = this.state.resultados[0].anemiaSevera
        }else if (hb>=11){
            intesidadAnemia = this.state.resultados[0].sano
            tipoAnemia = this.state.resultados[0].sano
        }
        console.log("tipoAnemia", tipoAnemia);
        console.log("intesidadAnemia", intesidadAnemia);

        if(hepcidina<6) {
            intesidadAnemia = this.state.resultados[0].sano
            tipoAnemia = this.state.resultados[0].sano
        }else if (hepcidina>=6){
            tipoAnemia = this.state.resultados[0].anemiaInflamatoria
        }
        console.log("tipoAnemia", tipoAnemia);
        console.log("intesidadAnemia", intesidadAnemia);

        console.log("log", Math.log10(ferritina))
        console.log("rstf", rstf)
        console.log(rstf/ Math.log10(ferritina))
        console.log((rstf/ Math.log10(ferritina)) <= 1.1 )

        if( (rstf/ Math.log10(ferritina)) <= 0.9 ) {

            tipoAnemia = this.state.resultados[0].anemiaInflamatoria
        }else if ( (rstf/ Math.log10(ferritina)) >= 2.1 ){
            tipoAnemia = this.state.resultados[0].anemiaDeficienciaHierro
        }
        else if ( (rstf/ Math.log10(ferritina)) >= 1 ||  (rstf/ Math.log(ferritina)) <= 2 ){
            intesidadAnemia = this.state.resultados[0].sano
            tipoAnemia = this.state.resultados[0].sano
        }
        console.log("tipoAnemia", tipoAnemia);
        console.log("intesidadAnemia", intesidadAnemia);

        if( ferritina > 500 ) {
            tipoAnemia = this.state.resultados[0].sobrecargaHierro
        }
        console.log("tipoAnemia", tipoAnemia);
        console.log("intesidadAnemia", intesidadAnemia);

        if( epo < 10.5 ) {
            tipoAnemia = this.state.resultados[0].anemiaInflamatoria
        }

        console.log("tipoAnemia", tipoAnemia);
        console.log("intesidadAnemia", intesidadAnemia);

        firebase.firestore()
        .collection("children")
        .doc(this.props.documentNumber)
        .collection("controls")
        .doc(this.props.activeKey)
        .set({
            "peso": this.state.peso,
            "talla": this.state.talla,
            "hb": this.state.hb,
            "hto": this.state.hto,
            "epcidina": this.state.epcidina,
            "ferritina": this.state.ferritina,
            "rstf": this.state.rstf,
            "epo": this.state.epo,
            "intesidadAnemia": intesidadAnemia,
            "tipoAnemia": tipoAnemia,
        }
            , {merge: true});

        this.setState({
            visibleDx: true,
            tipoAnemia,
            intesidadAnemia
        })
    }

    changeValue = (name, val) =>{
        this.setState({[name]: val.target.value});
    } 

    render() {

        let {peso, talla, hb, hto, epcidina, ferritina, rstf, epo} = this.state;

        return (

            <div>
                <Form>
                    <h3>Antropometría</h3>
                    <FormItem label="Peso: (g)" required>
                        <Input value={peso} onChange={(val) => this.changeValue("peso", val)}/>
                    </FormItem>
                    <FormItem label="Talla: (cm)" required>
                        <Input value={talla} onChange={(val) => this.changeValue("talla", val)}/>
                    </FormItem>
                    <h3>Hermatología:</h3>
                    <FormItem label="Hemoglobina (g/dL)" required>
                        <Input value={hb} onChange={(val) => this.changeValue("hb", val)}/>
                    </FormItem>
                    <FormItem label="Hto: (%)" required>
                        <Input value={hto} onChange={(val) => this.changeValue("hto", val)}/>
                    </FormItem>
                    <h3>Biomarcador:</h3>
                    <FormItem label="Epcidina: (nM/L)" required>
                        <Input value={epcidina} onChange={(val) => this.changeValue("epcidina", val)}/>
                    </FormItem>
                    <FormItem label="Ferritina: (ng/L)" required>
                        <Input value={ferritina} onChange={(val) => this.changeValue("ferritina", val)}/>
                    </FormItem>
                    <FormItem label="Rstf: (mg/dL)" required>
                        <Input value={rstf} onChange={(val) => this.changeValue("rstf", val)}/>
                    </FormItem>
                    <FormItem label="Epo: (mU/mL)" required>
                        <Input value={epo} onChange={(val) => this.changeValue("epo", val)}/>
                    </FormItem>
                    <Button
                    disabled={!peso || !talla || !hb || !hto || !epcidina || !ferritina || !rstf || !epo}
                            type="primary"
                            onClick={()=>{this.calculateDx(hb, epcidina, ferritina, rstf, epo)}}>
                        Guardar y mostrar resultados
                    </Button>
                    {console.log("intesidadAnemia", this.state.intesidadAnemia)}
                    {console.log("tipoAnemia", this.state.tipoAnemia)}
                    {this.state.visibleDx &&
                        <List>
                            <Icon className="mt_margin-top"  style={{marginTop: '20px', fontSize:'55px', color:'#1890ff'}}
                                              type={this.state.tipoAnemia === "sano" || this.state.intesidadAnemia === "sano" ? "smile" : "frown" }/>
                            <List.Item>
                                <List.Item.Meta
                                title={<span className={"size_tertiary"}>Diagnostico: </span>}
                                description={
                                    <h3>
                                        {`tipo de anemia: ${titleize(`${this.state.tipoAnemia}`)} - Intensidad de anemia:  ${titleize(`${this.state.intesidadAnemia}`)} `}
                                    </h3>
                                }
                                />
                            </List.Item>
                        </List>
                    }
                </Form>
            </div>
             
        )
    }
}

export default Control;
