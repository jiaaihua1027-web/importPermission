import React, { useState, useEffect } from 'react'
import {
  Modal,
  Tree,
  Input,
  Button,
  Space,
  Tag,
  Empty,
  Spin
} from 'antd'
import {
  SearchOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons'
import './DomainSelectModal.css'

const { Search } = Input

const DomainSelectModal = ({
  visible,
  onCancel,
  onOk,
  selectedDomains = []
}) => {
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [treeData, setTreeData] = useState([])
  const [checkedKeys, setCheckedKeys] = useState(selectedDomains)
  const [expandedKeys, setExpandedKeys] = useState([])

  // 模拟领域数据
  const mockDomainData = [
    {
      title: '财务领域',
      key: 'finance',
      children: [
        { title: '总账管理', key: 'finance-general-ledger' },
        { title: '应收管理', key: 'finance-accounts-receivable' },
        { title: '应付管理', key: 'finance-accounts-payable' },
        { title: '固定资产', key: 'finance-fixed-assets' },
        { title: '现金管理', key: 'finance-cash-management' },
        { title: '预算管理', key: 'finance-budget' }
      ]
    },
    {
      title: '供应链领域',
      key: 'supply-chain',
      children: [
        { title: '采购管理', key: 'supply-chain-procurement' },
        { title: '销售管理', key: 'supply-chain-sales' },
        { title: '库存管理', key: 'supply-chain-inventory' },
        { title: '物流管理', key: 'supply-chain-logistics' }
      ]
    },
    {
      title: '人力资源领域',
      key: 'hr',
      children: [
        { title: '人事管理', key: 'hr-personnel' },
        { title: '薪酬管理', key: 'hr-salary' },
        { title: '考勤管理', key: 'hr-attendance' },
        { title: '绩效管理', key: 'hr-performance' },
        { title: '招聘管理', key: 'hr-recruitment' }
      ]
    },
    {
      title: '生产制造领域',
      key: 'manufacturing',
      children: [
        { title: '生产计划', key: 'manufacturing-planning' },
        { title: '车间管理', key: 'manufacturing-workshop' },
        { title: '质量管理', key: 'manufacturing-quality' },
        { title: '设备管理', key: 'manufacturing-equipment' }
      ]
    },
    {
      title: '客户关系领域',
      key: 'crm',
      children: [
        { title: '客户管理', key: 'crm-customer' },
        { title: '销售机会', key: 'crm-opportunity' },
        { title: '服务管理', key: 'crm-service' },
        { title: '市场营销', key: 'crm-marketing' }
      ]
    },
    {
      title: '项目管理领域',
      key: 'project',
      children: [
        { title: '项目立项', key: 'project-initiation' },
        { title: '项目执行', key: 'project-execution' },
        { title: '项目监控', key: 'project-monitoring' },
        { title: '项目结项', key: 'project-closing' }
      ]
    }
  ]

  useEffect(() => {
    if (visible) {
      loadDomainData()
      setCheckedKeys(selectedDomains)
    }
  }, [visible, selectedDomains])

  // 加载领域数据
  const loadDomainData = () => {
    setLoading(true)
    setTimeout(() => {
      setTreeData(mockDomainData)
      // 默认展开所有节点
      const allKeys = getAllKeys(mockDomainData)
      setExpandedKeys(allKeys)
      setLoading(false)
    }, 500)
  }

  // 获取所有节点的key
  const getAllKeys = (data) => {
    let keys = []
    data.forEach(item => {
      keys.push(item.key)
      if (item.children && item.children.length > 0) {
        keys = keys.concat(getAllKeys(item.children))
      }
    })
    return keys
  }

  // 搜索过滤
  const filterTreeData = (data, searchValue) => {
    if (!searchValue) return data

    return data.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(searchValue.toLowerCase())
      const childrenMatch = item.children && filterTreeData(item.children, searchValue).length > 0
      return titleMatch || childrenMatch
    }).map(item => {
      if (item.children) {
        return {
          ...item,
          children: filterTreeData(item.children, searchValue)
        }
      }
      return item
    })
  }

  // 选择/取消选择
  const handleCheck = (keys, info) => {
    setCheckedKeys(keys)
  }

  // 全选
  const handleSelectAll = () => {
    const allLeafKeys = getAllLeafKeys(treeData)
    setCheckedKeys(allLeafKeys)
  }

  // 获取所有叶子节点的key
  const getAllLeafKeys = (data) => {
    let keys = []
    data.forEach(item => {
      if (item.children && item.children.length > 0) {
        keys = keys.concat(getAllLeafKeys(item.children))
      } else {
        keys.push(item.key)
      }
    })
    return keys
  }

  // 清空选择
  const handleClearAll = () => {
    setCheckedKeys([])
  }

  // 确认选择
  const handleOk = () => {
    // 只返回叶子节点（具体领域）
    const leafKeys = getAllLeafKeys(treeData).filter(key => checkedKeys.includes(key))
    onOk && onOk(leafKeys)
  }

  // 展开/折叠
  const handleExpand = (keys) => {
    setExpandedKeys(keys)
  }

  // 获取已选择的数量
  const getSelectedCount = () => {
    const leafKeys = getAllLeafKeys(treeData)
    return leafKeys.filter(key => checkedKeys.includes(key)).length
  }

  // 过滤后的树数据
  const filteredTreeData = filterTreeData(treeData, searchValue)

  return (
    <Modal
      title="选择领域"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={600}
      className="domain-select-modal"
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="ok"
          type="primary"
          onClick={handleOk}
        >
          确定（已选 {getSelectedCount()} 项）
        </Button>
      ]}
    >
      <div className="domain-select-content">
        {/* 搜索栏 */}
        <div className="domain-toolbar">
          <Search
            placeholder="搜索领域名称"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: 280 }}
            prefix={<SearchOutlined />}
            allowClear
          />
          <Space>
            <Button size="small" onClick={handleSelectAll}>
              全选
            </Button>
            <Button size="small" onClick={handleClearAll}>
              清空
            </Button>
          </Space>
        </div>

        {/* 已选择的领域 */}
        {checkedKeys.length > 0 && (
          <div className="selected-domains">
            <div className="selected-label">已选择：</div>
            <div className="selected-tags">
              {checkedKeys.slice(0, 10).map(key => {
                const node = findNodeByKey(treeData, key)
                return node ? (
                  <Tag
                    key={key}
                    closable
                    onClose={() => {
                      setCheckedKeys(checkedKeys.filter(k => k !== key))
                    }}
                  >
                    {node.title}
                  </Tag>
                ) : null
              })}
              {checkedKeys.length > 10 && (
                <Tag>+{checkedKeys.length - 10}</Tag>
              )}
            </div>
          </div>
        )}

        {/* 树形结构 */}
        <div className="domain-tree-container">
          {loading ? (
            <div className="loading-container">
              <Spin />
            </div>
          ) : filteredTreeData.length > 0 ? (
            <Tree
              checkable
              checkedKeys={checkedKeys}
              expandedKeys={expandedKeys}
              onExpand={handleExpand}
              onCheck={handleCheck}
              treeData={filteredTreeData}
              selectable={false}
              height={400}
              className="domain-tree"
            />
          ) : (
            <Empty description="未找到匹配的领域" />
          )}
        </div>
      </div>
    </Modal>
  )
}

// 根据key查找节点
const findNodeByKey = (data, key) => {
  for (const item of data) {
    if (item.key === key) return item
    if (item.children) {
      const found = findNodeByKey(item.children, key)
      if (found) return found
    }
  }
  return null
}

export default DomainSelectModal
