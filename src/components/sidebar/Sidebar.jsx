import { useState } from 'react';
import { Button, Layout, theme } from 'antd';
import '../../styles/Sidebar.css';
import MenuList from "./MenuList";
import ToggleThemeButton from "./ToggleThemeButton";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import GlucoseAverages from "../Statics/GlucoseAverange";

const Sidebar = () => {
    const { Header, Sider } = Layout;
    const [darkTheme, setDarkTheme] = useState(true);
    const [collapsed, setCollapsed] = useState(false);

    const toggleTheme = () => {
        setDarkTheme(!darkTheme);
    };

    // Destructuring the theme object
    const { colorBgContainer } = theme.useToken().token;

    // Updating the color
    const updatedColorBgContainer = darkTheme ? '#323232' : '#b7d5ac' ; // Replace with your desired colors

    return (
        <Layout>
            <Sider
                collapsed={collapsed}
                collapsible
                trigger={null}
                theme={darkTheme ? 'dark' : 'light'} className='sidebar'
            >
                <MenuList darkTheme={darkTheme} />
                <ToggleThemeButton
                    darkTheme={darkTheme}
                    toggleTheme={toggleTheme}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: updatedColorBgContainer }}>
                    <Button
                        type='text'
                        className="toggle"
                        onClick={() => setCollapsed(!collapsed)}
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    />
                </Header>
                <GlucoseAverages/>
            </Layout>

        </Layout>
    );
}

export default Sidebar;
