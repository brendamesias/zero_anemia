import React, {Component} from "react";
import {Button, DatePicker, Divider, Form, Modal, Select, Spin, Tabs, Radio, Input} from "antd";
import {fetchCollection} from "../firebase";
import Control from "./Control"
import moment from 'moment'
import firebase from "@firebase/app";
import {snapshotToArray} from "../utils";
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
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class RouteFileForm extends Component {

    constructor(props) {
        super(props);
       
        this.state = {
            documentNumber: props.child ? props.child.documentNumber: "",
            name: props.child ? props.child.name: "",
            age: props.child ? props.child.age : "",
            sexo: props.child ? props.child.sexo : "",
            diaIngreso: props.child ? moment(props.child.diaIngreso, dateFormat) : null,
            controles : [],
            indexTab:1,
            activeKey: "",
            child:props.child ? props.child: [],
            children:[],
            saveControl: false,
            loadingControl:false,
        }
    }

    componentDidMount() {
        if(!isEmpty(this.props.child) && this.state.saveControl===false){
            console.log("esrgser")
            firebase.firestore()
            .collection("children")
            .doc(this.props.child.documentNumber)
            .collection("controls")
            .onSnapshot(snapshot => {
                const data =  snapshotToArray(snapshot);
                if (!isEmpty(data)){
                    console.log(data)
                    console.log("hay controles")
                    this.setState({
                        indexTab:  data.length + 1,
                        activeKey: data[0].id
                    })
                    map(data, item => {
                        console.log("soy un control")
                        this.state.controles.push({ title: item.id, content: 
                            <Control 
                                control={item}
                                activeKey={item.id} 
                                documentNumber={this.props.documentNumber}/>
                        , key: item.id })
                    })
                }
            })
        }

        fetchCollection("child", "child", this.fetchCollection);

    };

    fetchCollection = (name, data) => this.setState({[name]: data});

    routeFileChange = (name, val) => this.setState({[name]: val});

    onChangeTabs = (activeKey) => {
        this.setState({ activeKey });
      }

    addControl = () => {
        console.log("controles", this.state.controles);
        const controles = this.state.controles;
        this.setState({indexTab: this.state.indexTab + 1})
        const newIndex = this.state.indexTab;
        console.log("newIndex", newIndex)
        const activeKey = `control-${newIndex}`;
        console.log(this.state.controles ? controles.activeKey : []);
        controles.push({ title: activeKey, content: 
        <Control 
            control={this.state.controles ? controles.activeKey : []}
            activeKey={activeKey} 
            documentNumber={this.state.documentNumber}/>,
         key: activeKey }
        );
        this.setState({ controles });
    }

    changeValue = (name, val) =>{
        const value = (name==="diaIngreso") ? val : val.target.value
        this.setState({[name]: value});
    } 

    setChildToFirestore = () => {
        this.setState({
            saveControl:true,
            loadingControl: true,
        })
        firebase.firestore()
            .collection("children")
            .doc(this.state.documentNumber)
            .set({
                "diaIngreso": this.state.diaIngreso.format(dateFormat),
                "documentNumber": this.state.documentNumber,
                "name": this.state.name,
                "age":this.state.age,
                "sexo": this.state.sexo,
                }
                , {merge: true});
        
        this.setState({
            diaIngreso: null,
            documentNumber: "",
            name: "",
            age: "",
            bus: "",
            sexo: "",
            controles: [],
        });

        this.setState({
            loadingControl: false,
        })
        this.props.openRouteFileForm(false)
    }

    render() {

        let {diaIngreso, documentNumber, name, age, sexo} = this.state;

        return (

            <Modal
                className="modalForm"
                title={""}
                visible={this.props.isModalVisible}
                onCancel={() => this.props.openRouteFileForm(false)}
                footer={[
                    <Button key="back"
                            id="cancel"
                            onClick={()=>this.props.openRouteFileForm(false)}>
                        Cancel
                    </Button>,
                    <Button 
                    disabled={!diaIngreso || !documentNumber || !name || !age || !sexo}
                            key="submit"
                            id="save"
                            type="primary"
                            onClick={()=>{this.setChildToFirestore()}}>
                        Save
                    </Button>
                ]}
            >
                <Form>
                     <Spin tip="Loading..." style={{position: "fixed", left: "0%"}} spinning={this.state.loadingControl}>
                        <FormItem label="Fecha de ingreso" required>
                                <DatePicker style={{width: "100%"}}
                                                value={diaIngreso}
                                                format={dateFormat }
                                                onChange={(val) => this.changeValue("diaIngreso", val)}
                                    />
                        </FormItem>
                        <FormItem label="Nro de carné" required>
                            <Input value={documentNumber} onChange={(val) => this.changeValue("documentNumber", val)}/>
                        </FormItem>
                        <FormItem label="Nombres y apellidos" required>
                            <Input value={name} onChange={(val) => this.changeValue("name", val)}/>
                        </FormItem>
                        <FormItem label="Edad(meses)" required>
                            <Input value={age} onChange={(val) => this.changeValue("age", val)}/>
                        </FormItem>
                        <FormItem label="Sexo" required>
                        <RadioGroup value={sexo} onChange={(val) => this.changeValue("sexo", val)}>
                            <Radio value="M" >Masculino</Radio>
                            <Radio value="F">Femenino</Radio>
                        </RadioGroup>
                        </FormItem>
                        {/* <FormItem label="Sector CunaMas" required>
                            <Input onChange={(val) => this.changeValue("sexo", val)}/>
                        </FormItem> */}
                    </Spin>
                </Form>
                <Divider/>
                <div style={{ marginBottom: 16 }}>
                <Button onClick={this.addControl} disabled={!this.props.child}>Añadir control</Button>
                </div>
                
                    <Tabs defaultActiveKey="1" 
                            onChange={(activeKey) => this.onChangeTabs(activeKey)}>
                            {console.log("controles", this.state.controles)}
                        {this.state.controles.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)}
                    </Tabs>
                        {console.log(this.state.activeKey)}
            </Modal>
        )
    }
}

export default RouteFileForm;
