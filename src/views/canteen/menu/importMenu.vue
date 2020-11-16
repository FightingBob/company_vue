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
import { importCanteenMenu } from '@/api/canteenMenu'
export default {
  name: 'ImportMenu',
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
        const canteenExpend = {}
        canteenExpend.departmentName = item.部门
        canteenExpend.nickname = item.姓名
        canteenExpend.status = item.状态
        canteenExpend.storeName = item.店家
        canteenExpend.foodName = item.餐品
        canteenExpend.money = item.小计
        return canteenExpend
      })
    },
    save() {
      const menuId = this.$route.query.menuId
      const data = this.setData()
      importCanteenMenu(data, menuId).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        this.$router.push('/')
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
