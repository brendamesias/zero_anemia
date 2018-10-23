import React, {Component} from "react";
import {Icon, Layout, Menu} from "antd";
import {Link} from 'react-router-dom';

const {Header, Sider, Content} = Layout;

class BaseLayout extends Component {
    state = {
        collapsed: false,
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        const {children} = this.props;

        return (
            <Layout className="base-layout">
                <Sider
                    className="slider"
                    collapsedWidth={0}
                    trigger={null}
                    collapsible
                    collapsed={this.state.collapsed}
                >
                    <div className="logo"/>
                    <Menu theme="dark"
                          mode="inline">
                        <Menu.Item key="1">
                            <Link to="/"
                                  id="route-files">
                                <Icon type="team"/>
                                <span>Niños</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to="/drivers"
                                  id="drivers">
                                <Icon type="snippets"/>
                                <span>Resultados</span>
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header className="base-header">
                        <Icon
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />
                        <label className="size_tertiary">Sin Anemia</label>
                    </Header>
                    <Content className="base_content">
                        {children}
                    </Content>
                </Layout>
            </Layout>
        )
    }
}

export default BaseLayout;