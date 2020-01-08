<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row  style="display: flex">
          <a-col :md="4" :sm="24">
            <a-form-item label="用户名">
              <a-input v-model="queryParam.userName" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" style="padding-left: 24px; padding-right: 0px;">
            <a-form-item label="所属部门" >
              <a-select
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
          <a-col :md="5" :sm="24" >
            <a-form-item label="角色" >
              <a-select
                allowClear
                :value="queryParam.roleId"
                placeholder="请选择角色"
                style="width: 200px"
                :defaultActiveFirstOption="false"
                :showArrow="false"
                :filterOption="false"
                @search="handleSearch"
                @change="handleChange2"
                :notFoundContent="null">
                <a-select-option v-for="d in roleList" :key="d.roleId">{{d.roleName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col  :sm="24" :md="3">
            <span class="table-page-search-submitButtons" :style=" { float: 'left', overflow: 'hidden' }  ">
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
      <span slot="userStatus" slot-scope="text, record">
        <template>
              <a-switch checkedChildren="激活" unCheckedChildren="禁用"  @change="statusSwitch"/>
        </template>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm title="是否要删除此账号？" @confirm="remove(record.orgId)">
                <a>删除</a>
           </a-popconfirm>
        </template>
      </span>
    </s-table>
<!--    <create-form ref="createModal" @ok="handleOk" />-->
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable } from '@/components'
// import CreateForm from './CreateForm'
import { queryUserList } from '@/api/user'
import { getOrgAll } from '@/api/org'
import { getRoleAll } from '@/api/role'

const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '运行中'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}

export default {
  name: 'TableList',
  components: {
    STable
  },
  data () {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      // advanced: false,
      // 查询参数
      queryParam: { 'orgId': null, 'roleId': null },
      orgList: [],
      roleList: [],
      // 表头
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '用户名',
          dataIndex: 'userName'
        },
        {
          title: '真实姓名',
          dataIndex: 'realName'
        },
        {
          title: '所属部门',
          dataIndex: 'orgName'
        },
        {
          title: '角色',
          dataIndex: 'roleNames'
        },
        {
          title: '状态',
          dataIndex: 'userStatus',
          scopedSlots: { customRender: 'userStatus' }
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
        return queryUserList(this.queryParam, parameter.pageNo, parameter.pageSize)
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
      return statusMap[type].status
    }
  },
  created () {
    this.tableOption()
    getOrgAll().then(res => {
      this.orgList = res.data
    })
    getRoleAll().then(res => {
      console.log(res.data)
      this.roleList = res.data
    })
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
    remove (orgId) {
      // deleteOrg(orgId).then(res => {
      //   if (res.success) {
      //     this.$message.success(`删除成功`)
      //     this.$refs.table.refresh(true)
      //   }
      // })
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
    },
    handleChange2 (value) {
      this.queryParam.roleId = value
    },
    resetSearchForm () {
      this.queryParam = {}
    },
    statusSwitch(value){
      alert(value)
    }
  }
}
</script>
