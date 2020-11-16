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
import { importLastMonthSave } from '@/api/statistics'
export default {
  name: 'ImportStatistics',
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
        const statistics = {}
        statistics.nickname = item.姓名
        statistics.strLastMonthSave = item.上个月剩余餐费
        return statistics
      })
    },
    save() {
      const data = this.setData()
      importLastMonthSave(data).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        this.$router.go(-1)
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
