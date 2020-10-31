<template>
  <div class="app-container">
    <upload @parentFuction="getList" />
    <el-button v-if="list != null && list.tableData.length > 0" class="btn-save" type="primary" icon="el-icon-document" @click="save">
      保存
    </el-button>
  </div>
</template>
<script>
import Upload from '@/components/UploadExcel/upload'
import { importExpend } from '@/api/expend'
export default {
  name: 'ImportExpend',
  components: { Upload },
  data() {
    return {
      list: null
    }
  },
  methods: {
    getList(list) {
      this.list = list
    },
    setData() {
      const list = this.list.tableData
      return list.map((item) => {
        const expend = {}
        expend.nickname = item.支出人
        expend.typeName = item.支出类型
        expend.description = item.支出描述
        expend.expendMoney = item.支出金额
        return expend
      })
    },
    save() {
      const data = this.setData()
      importExpend(data).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
      })
    }
  }
}
</script>
<style scoped>
.btn-save {
  margin: 15px 0px;
  float: right;
}
</style>
