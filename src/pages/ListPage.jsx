import React, { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  Form,
  message,
  Popconfirm,
  Tooltip
} from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  ReloadOutlined,
  EyeOutlined,
  CloudUploadOutlined
} from '@ant-design/icons'
import ImportModal from '../components/ImportModal'
import './ListPage.css'

const { Option } = Select
const { Search } = Input

const ListPage = () => {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    type: '',
    status: ''
  })
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [importModalVisible, setImportModalVisible] = useState(false)
  const [form] = Form.useForm()

  // 模拟数据
  const mockData = [
    {
      id: 1,
      name: '用户管理-查看',
      code: 'user:view',
      type: 'menu',
      appName: '权限管理系统',
      status: 'enabled',
      createTime: '2024-01-15 10:30:00',
      description: '查看用户列表和详情的权限'
    },
    {
      id: 2,
      name: '用户管理-新增',
      code: 'user:add',
      type: 'button',
      appName: '权限管理系统',
      status: 'enabled',
      createTime: '2024-01-15 10:31:00',
      description: '新增用户的权限'
    },
    {
      id: 3,
      name: '角色管理-编辑',
      code: 'role:edit',
      type: 'button',
      appName: '权限管理系统',
      status: 'enabled',
      createTime: '2024-01-15 11:20:00',
      description: '编辑角色的权限'
    },
    {
      id: 4,
      name: '数据导出',
      code: 'data:export',
      type: 'button',
      appName: '数据中心',
      status: 'disabled',
      createTime: '2024-01-16 09:15:00',
      description: '导出数据的权限'
    },
    {
      id: 5,
      name: '系统设置',
      code: 'system:settings',
      type: 'menu',
      appName: '系统管理',
      status: 'enabled',
      createTime: '2024-01-16 14:20:00',
      description: '访问系统设置的权限'
    },
    {
      id: 6,
      name: '日志查看',
      code: 'log:view',
      type: 'menu',
      appName: '系统管理',
      status: 'enabled',
      createTime: '2024-01-17 08:45:00',
      description: '查看系统日志的权限'
    },
    {
      id: 7,
      name: '报表生成',
      code: 'report:generate',
      type: 'button',
      appName: '数据中心',
      status: 'enabled',
      createTime: '2024-01-17 16:30:00',
      description: '生成报表的权限'
    },
    {
      id: 8,
      name: '部门管理-删除',
      code: 'dept:delete',
      type: 'button',
      appName: '组织架构',
      status: 'disabled',
      createTime: '2024-01-18 10:00:00',
      description: '删除部门的权限'
    },
  ]

  useEffect(() => {
    loadData()
  }, [pagination.current, pagination.pageSize])

  // 加载数据
  const loadData = () => {
    setLoading(true)
    setTimeout(() => {
      let filteredData = [...mockData]

      // 应用搜索过滤
      if (searchParams.keyword) {
        filteredData = filteredData.filter(item =>
          item.name.includes(searchParams.keyword) ||
          item.code.includes(searchParams.keyword)
        )
      }
      if (searchParams.type) {
        filteredData = filteredData.filter(item => item.type === searchParams.type)
      }
      if (searchParams.status) {
        filteredData = filteredData.filter(item => item.status === searchParams.status)
      }

      setDataSource(filteredData)
      setPagination(prev => ({...prev, total: filteredData.length}))
      setLoading(false)
    }, 500)
  }

  // 搜索
  const handleSearch = (value) => {
    setSearchParams({...searchParams, keyword: value})
    setPagination({...pagination, current: 1})
    setTimeout(loadData, 100)
  }

  // 筛选
  const handleFilter = (field, value) => {
    setSearchParams({...searchParams, [field]: value})
    setPagination({...pagination, current: 1})
    setTimeout(loadData, 100)
  }

  // 刷新
  const handleRefresh = () => {
    setSearchParams({keyword: '', type: '', status: ''})
    setPagination({...pagination, current: 1})
    loadData()
  }

  // 新增
  const handleAdd = () => {
    setEditingRecord(null)
    form.resetFields()
    setModalVisible(true)
  }

  // 编辑
  const handleEdit = (record) => {
    setEditingRecord(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  // 删除
  const handleDelete = (id) => {
    message.success('删除成功')
    loadData()
  }

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的数据')
      return
    }
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 条数据吗？`,
      onOk: () => {
        message.success('批量删除成功')
        setSelectedRowKeys([])
        loadData()
      }
    })
  }

  // 导出
  const handleExport = () => {
    message.success('导出成功')
  }

  // 提交表单
  const handleSubmit = () => {
    form.validateFields().then(values => {
      message.success(editingRecord ? '编辑成功' : '新增成功')
      setModalVisible(false)
      loadData()
    })
  }

  // 打开权限导入弹窗
  const handleOpenImport = () => {
    setImportModalVisible(true)
  }

  // 权限导入成功
  const handleImportSuccess = () => {
    setImportModalVisible(false)
    message.success('权限导入成功')
    loadData()
  }

  // 表格列定义
  const columns = [
    {
      title: '序号',
      key: 'index',
      width: 70,
      align: 'center',
      render: (text, record, index) => (
        (pagination.current - 1) * pagination.pageSize + index + 1
      )
    },
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (text) => <span className="permission-name">{text}</span>
    },
    {
      title: '权限编码',
      dataIndex: 'code',
      key: 'code',
      width: 150,
      render: (text) => <code className="permission-code">{text}</code>
    },
    {
      title: '权限类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      align: 'center',
      render: (type) => {
        const typeMap = {
          menu: { color: 'blue', text: '菜单' },
          button: { color: 'green', text: '按钮' },
          api: { color: 'orange', text: '接口' }
        }
        const config = typeMap[type] || { color: 'default', text: type }
        return <Tag color={config.color}>{config.text}</Tag>
      }
    },
    {
      title: '所属应用',
      dataIndex: 'appName',
      key: 'appName',
      width: 150
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (status) => (
        <Tag color={status === 'enabled' ? 'success' : 'default'}>
          {status === 'enabled' ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      sorter: true
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      align: 'center',
      fixed: 'right',
      render: (text, record) => (
        <Space size="small">
          <Tooltip title="查看">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ]

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE
    ]
  }

  return (
    <div className="list-page">
      {/* 页面标题 */}
      <div className="page-header">
        <h1 className="page-title">权限列表</h1>
        <p className="page-desc">管理系统中的所有权限项</p>
      </div>

      {/* 搜索和操作栏 */}
      <div className="list-card">
        <div className="list-toolbar">
          <div className="toolbar-left">
            <Search
              placeholder="搜索权限名称或编码"
              allowClear
              onSearch={handleSearch}
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
            />
            <Select
              placeholder="权限类型"
              allowClear
              style={{ width: 140 }}
              onChange={(value) => handleFilter('type', value)}
            >
              <Option value="menu">菜单</Option>
              <Option value="button">按钮</Option>
              <Option value="api">接口</Option>
            </Select>
            <Select
              placeholder="状态"
              allowClear
              style={{ width: 120 }}
              onChange={(value) => handleFilter('status', value)}
            >
              <Option value="enabled">启用</Option>
              <Option value="disabled">禁用</Option>
            </Select>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
            >
              刷新
            </Button>
          </div>

          <div className="toolbar-right">
            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={handleOpenImport}
            >
              权限导入
            </Button>
            <Button
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新增权限
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleBatchDelete}
              disabled={selectedRowKeys.length === 0}
            >
              批量删除
            </Button>
            <Button
              icon={<ExportOutlined />}
              onClick={handleExport}
            >
              导出
            </Button>
          </div>
        </div>

        {/* 表格 */}
        <div className="list-table">
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey="id"
            loading={loading}
            rowSelection={rowSelection}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (page, pageSize) => {
                setPagination({...pagination, current: page, pageSize})
              }
            }}
            scroll={{ x: 1200 }}
          />
        </div>
      </div>

      {/* 编辑弹窗 */}
      <Modal
        title={editingRecord ? '编辑权限' : '新增权限'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ type: 'button', status: 'enabled' }}
        >
          <Form.Item
            label="权限名称"
            name="name"
            rules={[{ required: true, message: '请输入权限名称' }]}
          >
            <Input placeholder="请输入权限名称" />
          </Form.Item>

          <Form.Item
            label="权限编码"
            name="code"
            rules={[
              { required: true, message: '请输入权限编码' },
              { pattern: /^[a-z0-9:]+$/, message: '只能包含小写字母、数字和冒号' }
            ]}
          >
            <Input placeholder="例如：user:view" />
          </Form.Item>

          <Form.Item
            label="权限类型"
            name="type"
            rules={[{ required: true, message: '请选择权限类型' }]}
          >
            <Select>
              <Option value="menu">菜单</Option>
              <Option value="button">按钮</Option>
              <Option value="api">接口</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="所属应用"
            name="appName"
            rules={[{ required: true, message: '请输入所属应用' }]}
          >
            <Input placeholder="请输入所属应用名称" />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Option value="enabled">启用</Option>
              <Option value="disabled">禁用</Option>
            </Select>
          </Form.Item>

          <Form.Item label="描述" name="description">
            <Input.TextArea rows={3} placeholder="请输入权限描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 权限导入弹窗 */}
      <ImportModal
        visible={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        onOk={handleImportSuccess}
      />
    </div>
  )
}

export default ListPage
