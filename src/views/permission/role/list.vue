<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row  style="display: flex">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色名称">
              <a-input v-model="queryParam.roleName" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" style="padding-left: 24px; padding-right: 24px;">
            <a-form-item label="所属部门" >
              <a-select
                showSearch
                allowClear
                :value="queryParam.orgId"
                placeholder="请选择所属部门"
                style="width: 200px"
                :defaultActiveFirstOption="false"
                :showArrow="false"
                :filterOption="false"
                @search="handleSearch"
                @change="handleChange"
                :notFoundContent="null">
                <a-select-option v-for="d in orgList" :key="d.orgId">{{d.orgName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col  :sm="16" :md="1">
            <span class="table-page-search-submitButtons" :style=" { float: 'right', overflow: 'hidden' }  ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.createModal.add()">新建</a-button>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="key"
      :columns="columns"
      :data="loadData">
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a @click="handleSub(record)">删除</a>
        </template>
      </span>
    </s-table>
    <create-form ref="createModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable } from '@/components'
import CreateForm from './CreateForm'
import { queryRoleList, deleteRole, saveRole, updateRole, getPermissionAll } from '@/api/role'
import { getOrgAll } from '@/api/org'

const statusMap = {
  0: {
    roleStatus: '0',
    text: '关闭'
  },
  1: {
    roleStatus: '1',
    text: '运行中'
  }
}

export default {
  name: 'TableList',
  components: {
    STable,
    CreateForm
  },
  data () {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      // advanced: false,
      // 查询参数
      queryParam: { 'orgId': null },
      orgList: [],
      // 表头
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '角色名称',
          dataIndex: 'roleName'
        },
        {
          title: '所属部门',
          dataIndex: 'orgName'
        },
        {
          title: '更新时间',
          dataIndex: 'updated',
          sorter: true,
          customRender: (text) => moment(text * 1000).format('YYYY-MM-DD')
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return queryRoleList(this.queryParam, parameter.pageNo, parameter.pageSize)
          .then(res => {
            return res.data
          })
      },
      selectedRowKeys: [],
      selectedRows: [],

      // custom table alert & rowSelection
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: false
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].roleStatus
    }
  },
  created () {
    this.tableOption()
    getOrgAll().then(res => {
      this.orgList = res.data
    })
    this.queryAllPermission()
    // getRoleList({ t: new Date() })
  },
  methods: {
    tableOption () {
      if (!this.optionAlertShow) {
        this.options = {
          alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange
          }
        }
        this.optionAlertShow = true
      } else {
        this.options = {
          alert: false,
          rowSelection: null
        }
        this.optionAlertShow = false
      }
    },

    handleEdit (record) {
      console.log(record)
      this.$refs.modal.edit(record)
    },
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    handleOk () {
      this.$refs.table.refresh()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleChange (value) {
      this.queryParam.orgId = value
      // fetch(value, data => (this.data = data));
    },
    resetSearchForm () {
      this.queryParam = {}
    },
    removeUser(userId){

    },
    queryAllPermission(){
      getPermissionAll().then(res => {
        console.log(res.data)
      })
    }
  }
}
</script>
