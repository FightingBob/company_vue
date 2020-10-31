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
import { batchSuppliesInsert } from '@/api/supplies'
export default {
  name: 'ImportSupplies',
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
    formatDate(numb) {
      if (numb > 0) { //  先解析时间
        const time = new Date((numb - 1) * 24 * 3600000 + 1)

        let h = time.getHours() + 16

        const yeraData = new Date(1900, 0, numb - 1)

        const year = yeraData.getFullYear()

        let month = yeraData.getMonth() + 1

        month = month < 10 ? '0' + month : month

        let day = yeraData.getDate()

        day = day < 10 ? '0' + day : day

        if (h > 23) {
          h = h - 24
        }
        return `${year}-${month}-${day}`
      } else {
        return '非法日期格式'
      }
    },
    setData() {
      const list = this.list.tableData
      return list.map((item) => {
        const suppliesItem = {}
        if (!/^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/.test(item.使用日期)) {
          suppliesItem.useTime = this.formatDate(item.使用日期)
        } else {
          suppliesItem.useTime = item.使用日期
        }
        suppliesItem.serialNumber = item.物资编号
        suppliesItem.departmentName = item.使用部门
        suppliesItem.nickname = item.使用人
        suppliesItem.status = item.使用状态
        suppliesItem.typeName = item.类别名称
        suppliesItem.description = item.配置信息
        suppliesItem.price = item.采购价格
        return suppliesItem
      })
    },
    save() {
      const data = this.setData()
      batchSuppliesInsert(data).then(response => {
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
