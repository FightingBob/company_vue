<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" />
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" style="margin-left: 20px" @click="endMenu()">截止下单</el-button>
      <el-button size="mini" class="btn-add" style="margin-left: 20px" @click="deleteMenu()">删除</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="foodTable"
        v-loading="listLoading"
        :data="list"
        style="width: 100%;"
        border
      >
        <!-- <el-table-column
          type="selection"
        /> -->
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="美食名称" align="center">
          <template slot-scope="scope">{{ scope.row.foodName }}</template>
        </el-table-column>
        <el-table-column label="美食图片" align="center" width="130">
          <template slot-scope="scope">
            <el-image :src="scope.row.foodImage" :preview-src-list="[scope.row.foodImage]" fit="cover" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="美食描述" align="center">
          <template slot-scope="scope">{{ scope.row.foodDescription | formatData }}</template>
        </el-table-column>
        <el-table-column label="美食价格" align="center">
          <template slot-scope="scope">{{ scope.row.foodPrice }} 元</template>
        </el-table-column>
        <!-- <el-table-column label="添加时间" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.createTime | formatData }}</template>
        </el-table-column> -->
        <!-- <el-table-column label="是否启用" width="140" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.$index, scope.row)"
            />
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.$index, scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="isEdit?'编辑美食':'添加美食'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="foodForm"
        :model="foodMenuRelation"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="价格：" prop="foodPrice">
          <el-input v-model="foodMenuRelation.foodPrice" style="width: 250px" step="0.01" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm('foodForm')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { todayMenu, updatePrice, deleteFood, deleteMenu, updateStatus } from '@/api/canteenMenu'
const defaultFoodMenuRelation = {
  id: null,
  menuId: null,
  foodId: null,
  foodName: null,
  foodImage: null,
  foodDescription: null,
  foodPrice: null
}
export default {
  name: 'CanteenMenuList',
  filters: {
    formatData(data) {
      if (data == null || data === '') {
        return 'N/A'
      }
      return data
    }
  },
  data() {
    return {
      list: null,
      listLoading: false,
      total: null,
      dialogVisible: false,
      foodMenuRelation: Object.assign({}, defaultFoodMenuRelation),
      isEdit: false,
      rules: {
        foodPrice: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { required: true, message: '请填写正确的金额,保留两位小数', pattern: /^([1-9][0-9]*)+(.[0-9]{1,2})?$/ }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      todayMenu(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
      })
    },
    handleUpdate(index, row) {
      this.dialogVisible = true
      this.isEdit = true
      this.foodMenuRelation = Object.assign({}, row)
    },
    handleDialogConfirm(formName) {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs[formName].validate((valid) => {
          if (this.isEdit) {
            this.changeFood()
            this.$router.go(0)
          }
        })
      })
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该美食?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteMenuFood(row.id)
      })
    },
    deleteMenuFood(id) {
      // console.log(foodIds)
      var foodIds = this.list.filter(relation => {
        return relation.id !== id
      }).map(relation => {
        return relation.foodId
      })
      const data = {
        foodIds,
        menuId: this.list[0].menuId
      }
      deleteFood(id, data).then(response => {
        const message = '删除成功'
        const type = 'success'
        this.tips(message, type)
        this.getList()
      })
    },
    changeFood() {
      updatePrice(this.foodMenuRelation.id, this.foodMenuRelation.foodPrice).then(response => {
        const message = '修改成功'
        const type = 'success'
        this.tips(message, type)
        this.getList()
      })
    },
    deleteMenu() {
      deleteMenu(this.list[0].menuId).then(response => {
        const message = '删除成功'
        const type = 'success'
        this.tips(message, type)
        this.getList()
      })
    },
    endMenu() {
      updateStatus(this.list[0].menuId).then(response => {
        const message = '已截止'
        const type = 'success'
        this.tips(message, type)
        this.getList()
      })
    },
    tips(message, type) {
      this.$message({
        message,
        type,
        duration: 1000
      })
    }
  }
}
</script>
