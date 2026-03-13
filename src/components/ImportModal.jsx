import React, { useState } from 'react'
import { Modal, Button, Upload, message, Progress, Select } from 'antd'
import { DownloadOutlined, CloudUploadOutlined, InboxOutlined } from '@ant-design/icons'
import DomainSelectModal from './DomainSelectModal'
import './ImportModal.css'

const { Dragger } = Upload
const { Option } = Select

const ImportModal = ({ visible, onCancel, onOk }) => {
  const [templateType, setTemplateType] = useState('type1')
  const [fileList, setFileList] = useState([])
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [domainModalVisible, setDomainModalVisible] = useState(false)
  const [selectedDomains, setSelectedDomains] = useState([])

  // 模版类型选项
  const templateOptions = [
    { value: 'type1', label: '服务和按钮 + 全部领域' },
    { value: 'type2', label: '服务 + 全部领域' },
    { value: 'type3', label: '服务和按钮 + 指定领域' },
    { value: 'type4', label: '服务 + 指定领域' }
  ]

  // 下载模版
  const handleDownloadTemplate = () => {
    if ((templateType === 'type3' || templateType === 'type4') && selectedDomains.length === 0) {
      message.warning('请先选择领域')
      setDomainModalVisible(true)
      return
    }

    message.loading('正在下载模版...', 1.5).then(() => {
      message.success('模版下载成功')
    })
  }

  // 确认选择领域
  const handleConfirmDomains = (domains) => {
    setSelectedDomains(domains)
    setDomainModalVisible(false)
    message.success(`已选择 ${domains.length} 个领域`)
  }

  // 文件上传配置
  const uploadProps = {
    fileList,
    beforeUpload: (file) => {
      const isValidType = file.type === 'application/vnd.ms-excel' ||
                         file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                         file.type === 'text/csv'

      if (!isValidType) {
        message.error('只能上传 Excel 或 CSV 文件')
        return false
      }

      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        message.error('文件大小不能超过 10MB')
        return false
      }

      setFileList([file])
      return false
    },
    onRemove: () => {
      setFileList([])
    }
  }

  // 开始导入
  const handleStartImport = () => {
    if (fileList.length === 0) {
      message.warning('请先上传要导入的文件')
      return
    }

    setImporting(true)
    setImportProgress(0)

    const timer = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          setImporting(false)
          message.success('导入完成')
          setTimeout(() => {
            onOk && onOk()
            handleReset()
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  // 重置状态
  const handleReset = () => {
    setFileList([])
    setImportProgress(0)
    setImporting(false)
    setSelectedDomains([])
  }

  // 关闭弹窗
  const handleCancel = () => {
    if (importing) {
      Modal.confirm({
        title: '提示',
        content: '正在导入中，确定要关闭吗？',
        onOk: () => {
          handleReset()
          onCancel && onCancel()
        }
      })
    } else {
      handleReset()
      onCancel && onCancel()
    }
  }

  // 模版类型改变时清空已选领域
  const handleTemplateChange = (value) => {
    setTemplateType(value)
    if (value === 'type1' || value === 'type2') {
      setSelectedDomains([])
    }
  }

  return (
    <>
      <Modal
        open={visible}
        onCancel={handleCancel}
        width={680}
        footer={null}
        className="import-modal"
        maskClosable={false}
        title="权限导入"
      >
        <div className="import-modal-content">
          {/* 上部分：下载模版区域 */}
          <div className="template-download-section">
            <div className="section-header">
              <div className="section-title">
                <span className="title-icon">📥</span>
                下载模版
              </div>
            </div>

            <div className="section-body">
              <div className="form-row">
                <label className="form-label">模版类型</label>
                <Select
                  value={templateType}
                  onChange={handleTemplateChange}
                  className="template-select"
                  placeholder="请选择模版类型"
                >
                  {templateOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* 指定领域选择 */}
              {(templateType === 'type3' || templateType === 'type4') && (
                <div className="domain-select-row">
                  <label className="form-label">选择领域</label>
                  <div className="domain-select-wrapper">
                    <span className="domain-info">
                      {selectedDomains.length > 0
                        ? `已选择 ${selectedDomains.length} 个领域`
                        : '请选择要导入的领域'}
                    </span>
                    <Button
                      type="link"
                      onClick={() => setDomainModalVisible(true)}
                      className="domain-select-btn"
                    >
                      {selectedDomains.length > 0 ? '重新选择' : '选择领域'}
                    </Button>
                  </div>
                </div>
              )}

              <div className="download-action">
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleDownloadTemplate}
                  className="download-btn"
                >
                  下载模版
                </Button>
              </div>
            </div>
          </div>

          {/* 分隔线 */}
          <div className="section-divider"></div>

          {/* 下部分：导入区域 */}
          <div className="import-upload-section">
            <div className="section-header">
              <div className="section-title">
                <span className="title-icon">📤</span>
                导入数据
              </div>
            </div>

            <div className="section-body">
              <Dragger {...uploadProps} className="upload-dragger">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  拖拽或 <span className="upload-link">点击上传</span>
                </p>
                <p className="ant-upload-hint">
                  支持 .xlsx, .xls, .csv 格式文件，文件大小不超过 10MB
                </p>
              </Dragger>

              {fileList.length > 0 && (
                <div className="uploaded-file">
                  <span className="file-icon">📄</span>
                  <span className="file-name">{fileList[0].name}</span>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => setFileList([])}
                    danger
                  >
                    删除
                  </Button>
                </div>
              )}

              {importing && (
                <div className="import-progress">
                  <div className="progress-info">
                    <span>导入进度</span>
                    <span>{importProgress}%</span>
                  </div>
                  <Progress
                    percent={importProgress}
                    showInfo={false}
                    strokeColor="#18B681"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="modal-footer">
          <Button onClick={handleCancel}>取消</Button>
          <Button
            type="primary"
            icon={<CloudUploadOutlined />}
            onClick={handleStartImport}
            disabled={fileList.length === 0 || importing}
            className="import-btn"
          >
            开始导入
          </Button>
        </div>
      </Modal>

      {/* 领域选择弹窗 */}
      <DomainSelectModal
        visible={domainModalVisible}
        onCancel={() => setDomainModalVisible(false)}
        onOk={handleConfirmDomains}
        selectedDomains={selectedDomains}
      />
    </>
  )
}

export default ImportModal
