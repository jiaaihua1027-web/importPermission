import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  DatabaseOutlined,
  UnorderedListOutlined,
  SettingOutlined
} from '@ant-design/icons'
import './MainLayout.css'

const MainLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      key: '/list',
      icon: <UnorderedListOutlined />,
      label: '权限列表',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ]

  const handleMenuClick = (key) => {
    navigate(key)
  }

  return (
    <div className="main-layout">
      {/* 左侧导航栏 */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <DatabaseOutlined className="logo-icon" />
            <span className="logo-text">权限导入工具</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <div
              key={item.key}
              className={`nav-item ${location.pathname === item.key ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.key)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="version">版本 1.0.0</div>
        </div>
      </aside>

      {/* 右侧主内容区 */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
