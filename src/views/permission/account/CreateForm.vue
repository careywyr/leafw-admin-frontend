<template>
  <a-modal
    title="创建账号"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="用户名"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input  v-decorator="['userName', {rules: [{required: true, max: 16, message: '用户名不可超过16位！'}]}]" />
        </a-form-item>
        <a-form-item
          label="真实姓名"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input  v-decorator="['realName', {rules: [{required: true, max: 16, message: '真实姓名不可超过16位！'}]}]" />
        </a-form-item>
        <a-form-item
          label="邮箱"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input  v-decorator="['email', {rules: [{required: true, min: 1, message: '请输入正确的邮箱！'}]}]" />
        </a-form-item>
        <a-form-item
          label="所属部门"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            allowClear
            placeholder="请选择所属部门"
            @change="handleOrgChange"
            style="width: 100%"
            v-decorator="['orgId']">
                <a-select-option v-for="d in orgList" :key="d.orgId">{{d.orgName}}</a-select-option>
              </a-select>
        </a-form-item>
        <a-form-item
          label="角色"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            mode="multiple"
            style="width: 100%"
            @change="handleRoleChange"
            placeholder="请选择角色"
            v-decorator="['roleIds']">
                <a-select-option v-for="d in roleList" :key="d.roleId">{{d.roleName}}</a-select-option>
              </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      confirmLoading: false,
      orgList: [],
      roleList: [],
      form: this.$form.createForm(this)
    }
  },
  methods: {
    add (orgList, roleList) {
      this.visible = true
      this.orgList = orgList
      this.roleList = roleList
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          setTimeout(() => {
            this.visible = false
            this.confirmLoading = false
            this.$emit('ok', values)
          }, 1500)
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false
    },
    handleRoleChange (value) {
      // console.log(`selected ${value}`)
    },
    handleOrgChange (value) {
    }
  }
}
</script>
