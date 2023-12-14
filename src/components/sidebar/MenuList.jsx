import React from 'react';
import { Menu } from 'antd';
import {
    HomeOutlined,
    AreaChartOutlined,
    MessageOutlined,
    ProfileOutlined
} from '@ant-design/icons';
import { Link } from "react-router-dom";
import { GoSignOut } from "react-icons/go";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const MenuList = ({ darkTheme }) => {
    const sidebarColor = darkTheme ? '#323232' : '#b7d5ac'; // Set your sage color here

    return (
        <Menu theme={darkTheme ? 'dark' : 'light'} mode='inline' className='menu-bar' style={{ background: sidebarColor }}>
            <Menu.Item key='home' icon={<HomeOutlined />}>
                <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key='patients' icon={<ProfileOutlined />}>
                <Link to="/patients">Patients</Link>
            </Menu.Item>
            <Menu.Item key='statistics' icon={<AreaChartOutlined />}>
                <Link to="/statistics">Statistics</Link>
            </Menu.Item>
            <Menu.Item key='settings' icon={<GoSignOut />}>
                <div onClick={async () => {
                    await signOut(auth);
                }}>Log Out</div>
            </Menu.Item>
        </Menu>
    );
};

export default MenuList;
