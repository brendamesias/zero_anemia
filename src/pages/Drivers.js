import React, {Component} from 'react';
import {Button, Divider, Icon, List, Modal, Row} from "antd";
import {createDocument, deleteDocument, fetchCollection, updateDocument} from "../firebase";
import uuidv1 from "uuid/v1";
import titleize from "titleize";

class Drivers extends Component {

    state = {
        driverInformation:"",
        firstName: "",
        lastName: "",
        drivingLicense: "",
        driverId: "",
        busCompany: "",
        isModalVisible: false,
        busesCompanies: [],
        drivers: [],
        isDriverUpdate: false,
    };

    componentDidMount() {
        fetchCollection("drivers", "drivers", this.fetchCollection);
        fetchCollection("busesCompanies", "busesCompanies", this.fetchCollection);
    };

    fetchCollection = (name, data) => this.setState({[name]: data});

    driverChange = (name, val) => {
        name === "busCompany" ?
            this.setState({[name]: val})
            :
            this.setState({[name]: val.target.value});
    };

    addDriver = isModalVisible => {
        const {firstName, lastName, drivingLicense, busCompany} = this.state;

        createDocument("drivers", {
            driverInformation: `${firstName} ${lastName} / ${drivingLicense} / ${busCompany}`,
            firstName,
            lastName,
            drivingLicense,
            busCompany,
            driverId: uuidv1(),
        });

        this.setState({
            isModalVisible,
            driverInformation: "",
            firstName: "",
            lastName: "",
            drivingLicense: "",
            busCompany: "",
            driverId: "",
        });
    };

    deleteDriver = driver => {
        Modal.confirm({
            title: 'Are you sure delete?',
            content: 'All data with connection to this item is deleted.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                deleteDocument("drivers", driver.id);

            },
            onCancel: () => {
                console.log('Cancel');
            },
        })
    };


    save = isModalVisible => {
        const {driverId} = this.state;

        if (driverId) {
            this.updateDriver();
        } else {
            this.addDriver();
        }

        this.setState({
            isModalVisible,
            driverInformation: "",
            firstName: "",
            lastName: "",
            drivingLicense: "",
            driverId: "",
            busCompany: "",
        });
    };

    updateDriver = () => {
        const {firstName, lastName, drivingLicense, driverId, busCompany} = this.state;

        updateDocument("drivers", driverId, {
            driverInformation: `${firstName} ${lastName} / ${drivingLicense} / ${busCompany}`,
            firstName,
            lastName,
            drivingLicense,
            busCompany
        });
    };

    openDriverForm = (isModalVisible, driver) => {
        if (!driver) {
            this.setState({
                driverInformation: "",
                firstName: "",
                lastName: "",
                drivingLicense: "",
                busCompany: "",
                isDriverUpdate: false,
                driverId: "",
            });
        } else {
            this.setState({
                driverInformation: `${driver.firstName} ${driver.lastName} / ${driver.drivingLicense} / ${driver.busCompany}`,
                firstName: driver.firstName,
                lastName: driver.lastName,
                drivingLicense: driver.drivingLicense,
                driverId: driver.id,
                busCompany: driver.busCompany,
                isDriverUpdate: true
            });
        }

        this.setState({isModalVisible});
    };


    render() {
        const {isModalVisible, drivers, firstName, lastName, drivingLicense, isDriverUpdate, busesCompanies, busCompany} = this.state;

        return (
            <div>
                
                <Divider/>
                <Row>
                    <List
                        size="large"
                        bordered
                        itemLayout="horizontal"
                        dataSource={drivers}
                        renderItem={(item, index) => (
                            <List.Item
                                id={`list-guides-${index}`}
                                actions={[
                                    <a id={`delete-button-${index}`}
                                       onClick={() => this.deleteDriver(item)}>
                                        <Icon className="size_tertiary icon_delete"
                                              type="delete"/>
                                    </a>
                                ]}
                            >
                                <List.Item.Meta
                                    onClick={() => this.openDriverForm(true, item)}
                                    title={
                                        <div>
                                            <h3 style={{margin: '0px'}}>
                                                <a style={{color: "#40a9ff"}}>
                                                    {`${titleize(`${item.firstName} ${item.lastName}`)}`}
                                                </a>
                                            </h3>
                                        </div>
                                    }
                                    description={`Driving License: ${item.drivingLicense}`}
                                />
                            </List.Item>
                        )}
                    />
                </Row>
            </div>
        )
    }
}

export default Drivers;