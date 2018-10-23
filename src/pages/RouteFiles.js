import React, {Component} from "react";
import {Button, Divider, Icon, List, Modal, Row} from 'antd';
import {deleteDocument, fetchCollection} from "../firebase";
import {RouteFileForm} from "../components";
import titleize from "titleize";
import {orderBy, isEmpty} from "lodash";
import firebase from "@firebase/app";
import {snapshotToArray} from "../utils";



class RouteFiles extends Component {

    state = {
        children:[],
        child:[],
        isModalVisible: false,
    };

    componentDidMount() {
        fetchCollection("children", "children", this.fetchCollection);
    };

    fetchCollection = (name, data) => this.setState({[name]: data});

    openRouteFileForm = (isModalVisible, child) => {
        this.setState({
            isModalVisible,
            child,
        });
    };

    render() {

        const {isModalVisible, children, child} = this.state;

        return (
            <div className="route-files">

                <Button type="primary"
                        onClick={() => this.openRouteFileForm(true)}
                        className="square-button"
                        icon="plus">
                    AÑADIR NIÑO
                </Button>
                <Divider/>
                <Row>
                    <List
                        size="large"
                        bordered
                        dataSource={children}
                        renderItem={(item, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    onClick={() => this.openRouteFileForm(true, item)}
                                    title={
                                        <div>
                                            <h3 style={{margin: '0px'}}>
                                                <a style={{color: "#40a9ff"}}>
                                                    {`${`${item.diaIngreso}  [${titleize(item.name)}]`}`}
                                                </a>
                                            </h3>
                                        </div>}
                                    // description={`Guide: ${titleize(`${item.guideName}`)}`}
                                />
                            </List.Item>
                        )}
                    />
                </Row>
                {(isModalVisible &&
                     <RouteFileForm
                     child={child}
                     isModalVisible={isModalVisible}
                     openRouteFileForm={this.openRouteFileForm}
                 />)
                }
            </div>
        )
    }
}

export default RouteFiles;
