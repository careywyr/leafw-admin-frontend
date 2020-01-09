<template>
  <a-modal
    title="新建部门"
    :width="1024"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <div>
      <a-row>
      <a-col :span="12">
        <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="角色名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input v-decorator="['roleName', {rules: [{required: true, max: 20, message: '角色名称不能超过20个字！'}]}]" />
        </a-form-item>
        <a-form-item
          label="角色描述"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input v-decorator="['roleDesc', {rules: [{required: true, max: 20, message: '角色名称不能超过20个字！'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
      </a-col>
      <a-col :span="12">
        <a-tree
          checkable
          @expand="onExpand"
          :expandedKeys="expandedKeys"
          :autoExpandParent="autoExpandParent"
          v-model="checkedKeys"
          @select="onSelect"
          :selectedKeys="selectedKeys"
          :treeData="treeData"
        />
      </a-col>
    </a-row>
    </div>
  </a-modal>
</template>

<script>
import { saveOrg, updateOrg } from '@/api/org'
const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' },
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' },
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0' },
      { title: '0-1-0-1', key: '0-1-0-1' },
      { title: '0-1-0-2', key: '0-1-0-2' },
    ],
  },
  {
    title: '0-2',
    key: '0-2',
  },
];
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

      form: this.$form.createForm(this),

      expandedKeys: ['0-0-0', '0-0-1'],
      autoExpandParent: true,
      checkedKeys: ['0-0-0'],
      selectedKeys: [],
      treeData
    }
  },
    watch: {
      checkedKeys(val) {
        console.log('onCheck', val);
      },
    },
  methods: {
    add () {
      this.visible = true
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          saveOrg(values).then(res => {
            console.log(this.form)
            this.form.resetFields()
          })
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

    onExpand(expandedKeys) {
      console.log('onExpand', expandedKeys);
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck(checkedKeys) {
      console.log('onCheck', checkedKeys);
      this.checkedKeys = checkedKeys;
    },
    onSelect(selectedKeys, info) {
      console.log('onSelect', info);
      this.selectedKeys = selectedKeys;
    },
  }
}
</script>
