<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search" />
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          size="small"
          @click="handleSearchList"
        >
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          size="small"
          @click="handleResetSearch"
        >
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="美食名称" clearable />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" />
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" style="margin-left: 20px" @click="handleAdd()">添加</el-button>
      <el-button v-if="!hasTodayMenu" size="mini" class="btn-add" style="margin-left: 20px" @click="handleAddMenu()">添加今日菜单</el-button>
      <el-button size="mini" class="btn-add" style="margin-left: 20px" @click="toggleSelection()">取消选择</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="foodTable"
        v-loading="listLoading"
        :data="list"
        style="width: 100%;"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
        />
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="美食名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="美食图片" align="center" width="130">
          <template slot-scope="scope">
            <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" fit="cover" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="美食描述" align="center">
          <template slot-scope="scope">{{ scope.row.description | formatData }}</template>
        </el-table-column>
        <el-table-column label="美食价格" align="center">
          <template slot-scope="scope">{{ scope.row.price }} 元</template>
        </el-table-column>
        <el-table-column label="添加时间" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.createTime | formatData }}</template>
        </el-table-column>
        <el-table-column label="是否启用" width="140" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
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
            <el-button
              v-if="hasTodayMenu"
              size="mini"
              type="text"
              @click="todayMenuAddFood(scope.$index, scope.row)"
            >加到菜单
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[10,15,20]"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      :title="isEdit?'编辑美食':'添加美食'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="foodForm"
        :model="food"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="名称：" prop="name">
          <el-input v-model="food.name" style="width: 250px" />
        </el-form-item>
        <el-form-item label="价格：" prop="price">
          <el-input v-model="food.price" style="width: 250px" step="0.01" />
        </el-form-item>
        <el-form-item label="图片：" prop="image">
          <icon ref="tabIcon" v-model="food.image" @callFather="getChild" />
        </el-form-item>
        <el-form-item label="描述：" prop="description">
          <el-input
            v-model="food.description"
            type="textarea"
            :rows="5"
            style="width: 250px"
          />
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-radio-group v-model="food.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
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
import Icon from '@/views/profile/components/Icon'
import { addFood, updateFood, listFood, deleteFood, updateFoodStatus } from '@/api/food'
import { createMenu, menuAddFood, todayMenu } from '@/api/canteenMenu'
const defaultFood = {
  id: null,
  name: null,
  image: '',
  price: null,
  description: null,
  status: 1

}
const defaultMenu = {
  id: null,
  foodList: null,
  status: 1
}
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null
}
export default {
  name: 'FoodList',
  filters: {
    formatData(data) {
      if (data == null || data === '') {
        return 'N/A'
      }
      return data
    }
  },
  components: { Icon },
  data() {
    return {
      list: null,
      listQuery: Object.assign({}, defaultListQuery),
      listMenu: Object.assign({}, defaultMenu),
      dialogVisible: false,
      todayDialogVisible: false,
      listLoading: false,
      total: null,
      isEdit: false,
      todayMenuId: null,
      hasTodayMenu: false,
      multipleSelection: [],
      food: Object.assign({}, defaultFood),
      listFoodMenuRelation: [],
      rules: {
        name: [
          { required: true, message: '请输入美食名称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在2到15个字符之间', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { required: true, message: '请填写正确的金额,保留两位小数', pattern: /(^\+?(?:[1-9]\d*(?:\.\d{1,2})?|0\.(?:\d[1-9]|[1-9]\d))$)/ }
        ],
        description: [
          { min: 0, max: 100, message: '长度不超过100个字符', trigger: 'blur' }
        ]
      },
      photo: ''
    }
  },
  created() {
    this.getList()
    this.getTodayMenu()
  },
  methods: {
    getList() {
      this.listLoading = true
      listFood(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    getTodayMenu() {
      todayMenu().then(response => {
        var list = response.data.list
        if (list !== undefined && list.length > 0) {
          this.hasTodayMenu = true
          this.todayMenuId = list[0].menuId
        } else {
          console.log('no todayMenu')
        }
      })
    },
    handleUpdate(index, row) {
      this.dialogVisible = true
      this.isEdit = true
      this.food = Object.assign({}, row)
    },
    addFood() {
      this.dialogVisible = true
    },
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.food = Object.assign({}, defaultFood)
    },
    handleDialogConfirm(formName) {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          this.changeFood()
          this.$router.go(0)
        } else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.saveFood()
              this.$router.go(0)
            } else {
              this.$message.error('请填写正确再提交')
            }
          })
        }
      })
    },
    handleStatusChange(index, row) {
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateFoodStatus(row.id, { status: row.status }).then(response => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改'
        })
        this.getList()
      })
    },
    changeFood() {
      updateFood(this.food.id, this.food).then(response => {
        const message = '修改成功！'
        const type = 'success'
        this.tips(message, type)
        this.dialogVisible = false
        this.getList()
      })
    },
    saveFood() {
      addFood(this.food).then(response => {
        const message = '添加成功'
        const type = 'success'
        this.tips(message, type)
        this.dialogVisible = false
        this.getList()
      })
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
      this.getList()
    },
    getChild() {
      this.food.image = this.$refs.tabIcon.fileList[0].url
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该美食?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFood(row.id).then(response => {
          const message = '删除成功'
          const type = 'success'
          this.tips(message, type)
          this.getList()
        })
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      // console.log(this.multipleSelection)
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.foodTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.foodTable.clearSelection()
      }
    },
    addTodayMenu() {
      this.listFoodMenuRelation = this.multipleSelection.map(food => this.setFoodMenuRelation(food))
    },
    todayMenuAddFood(index, row) {
      const foodMenuRelation = this.setFoodMenuRelation(row)
      foodMenuRelation.menuId = this.todayMenuId
      const data = {
        relation: foodMenuRelation,
        menuId: this.todayMenuId
      }
      menuAddFood(row.id, data).then(response => {
        const message = '添加成功'
        const type = 'success'
        this.tips(message, type)
        this.getList()
      })
    },
    setFoodMenuRelation(food) {
      const foodMenuRelation = {}
      foodMenuRelation.foodId = food.id
      foodMenuRelation.foodName = food.name
      foodMenuRelation.foodPrice = food.price
      foodMenuRelation.foodImage = food.image
      foodMenuRelation.foodDescription = food.description
      return foodMenuRelation
    },
    handleAddMenu() {
      this.addTodayMenu()
      createMenu(this.listFoodMenuRelation).then(response => {
        const message = '添加成功'
        const type = 'success'
        this.tips(message, type)
        this.$router.go(0)
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

