<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" />
      <span>数据列表</span>
      <el-button v-if="menu.status == 1 && menu.ended == 1" size="mini" class="btn-add" style="margin-left: 20px" @click="dialogHelpVisible = true">帮同事点餐</el-button>
      <el-button v-if="menu.status == 1 && menu.ended == 1" size="mini" class="btn-add" style="margin-left: 20px" @click="importExcel">导入</el-button>
      <!-- <el-button v-if="menu.status == 1 && menu.ended == 1" size="mini" class="btn-add" style="margin-left: 20px" @click="finishMenu">完成点餐</el-button> -->
      <el-button v-if="menu.status == 1 && menu.ended == 0" size="mini" class="btn-add" style="margin-left: 20px" @click="endMenu">截止点餐</el-button>
      <el-button v-if="menu.id != undefined" size="mini" class="btn-add" style="margin-left: 20px" @click="deleteThisMenu">删除菜单</el-button>
      <el-button v-if="menu.id != undefined" size="mini" class="btn-add" style="margin-left: 20px" @click="addFood">添加美食</el-button>
      <el-button v-if="menu.id == undefined" size="mini" class="btn-add" style="margin-left: 20px" @click="createMenu">添加菜单</el-button>
    </el-card>
    <div v-if="menu.id != undefined" class="table-container">
      <el-table
        ref="foodTable"
        v-loading="listLoading"
        :data="list"
        style="width: 100%;"
        border
      >
        <el-table-column label="店家名称" align="center">
          <template slot-scope="scope">{{ scope.row.storeName | formatData }}</template>
        </el-table-column>
        <el-table-column label="美食名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="美食价格" align="center">
          <template slot-scope="scope">{{ scope.row.price }} 元</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status != 0"
              size="mini"
              type="primary"
              @click="handleUpdate(scope.$index, scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.status != 0 && orderList == null"
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="menu.id != undefined && orderList != null" class="table-container">
      <export-excel
        :theader="exportExcel.tHeader"
        :filterval="exportExcel.filterVal"
        :list="exportExcel.listData"
        style="margin-top: 15px"
      />
      <el-table
        ref="orderDetailTable"
        v-loading="listLoading"
        :data="orderList"
        style="width: 100%;"
        border
      >
        <!-- <el-table-column
          type="selection"
        /> -->
        <el-table-column label="部门" align="center">
          <template slot-scope="scope">{{ scope.row.departmentName | formatData }}</template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">{{ scope.row.username }}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">{{ scope.row.status }}</template>
        </el-table-column>
        <el-table-column label="店家" align="center">
          <template slot-scope="scope">{{ scope.row.storeName }}</template>
        </el-table-column>
        <el-table-column label="餐品" align="center">
          <template slot-scope="scope">
            {{ scope.row.foodName }}
          </template>
        </el-table-column>
        <el-table-column label="小计" align="center">
          <template slot-scope="scope">{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status != 0 && !ifChangeFood"
              size="mini"
              type="primary"
              @click="updateOrder(scope.row)"
            >
              换餐
            </el-button>
            <el-button
              v-if="scope.row.status != 0 && !ifChangeFood"
              size="mini"
              type="primary"
              @click="deleteOrder(scope.$index, scope.row)"
            >
              删除
            </el-button>
            <el-button
              v-if="scope.row.status != 0 && ifChangeFood"
              size="mini"
              type="primary"
              @click="changeOrder(scope.$index, scope.row)"
            >
              确认
            </el-button>
            <el-button
              v-if="scope.row.status != 0 && ifChangeFood"
              size="mini"
              type="danger"
              @click="dialogMenuVisible = false"
            >
              取消
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
        :model="food"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="店家：" prop="storeName">
          <el-input v-model="food.storeName" style="width: 250px" />
        </el-form-item>
        <el-form-item label="名称：" prop="name">
          <el-input v-model="food.name" style="width: 250px" />
        </el-form-item>
        <el-form-item label="价格：" prop="price">
          <el-input v-model="food.price" style="width: 250px" step="0.01" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm('foodForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogMenuVisible"
    >
      <el-form
        ref="menuForm"
        :rules="menuRules"
        :model="menu"
        label-width="150px"
      >
        <el-form-item label="选餐：">
          <el-select v-model="selectFoodName" clearable class="input-width" value-key="id" @change="selectGet($event, orderChange)">
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelChange">
          取消
        </el-button>
        <el-button type="primary" @click="handleMenuDialogConfirm('menuForm')">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogHelpVisible"
    >
      <el-form
        ref="helpForm"
        label-width="150px"
        :rules="orderRules"
        :model="helpOrder"
      >
        <el-form-item label="员工" prop="userId">
          <el-select v-model="helpOrder.userId" filterable placeholder="请选择">
            <el-option
              v-for="item in adminList"
              :key="item.id"
              :label="item.nickname"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="午餐" prop="foodId">
          <el-select v-model="helpOrder.foodId" filterable placeholder="请选择">
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogHelpVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleHelpDialogConfirm('helpForm')">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { create, todayMenu, addFood, updateFood, deleteFood, deleteMenu, update, orderDetail, endOrder, finishOrder, changeOrder, helpOrder, deleteUser } from '@/api/canteenMenu'
import { listAll } from '@/api/user'
import ExportExcel from '@/components/ExportExcel'
const defaultFood = {
  id: undefined,
  name: null,
  menuId: undefined,
  price: null,
  storeName: null,
  status: 1
}
const defaultMenu = {
  id: undefined,
  endTime: null,
  status: undefined,
  ended: undefined,
  finished: undefined
}
const defaultOrder = {
  foodName: null,
  foodId: null,
  userId: null,
  username: null,
  departmentName: null,
  departmentId: null,
  status: null,
  price: null,
  storeName: null
}
const defaultUser = {
  id: null,
  menuId: null,
  userId: null,
  foodId: null
}
const defaultAdmin = {
  id: null,
  nickname: null
}
export default {
  name: 'CanteenMenuList',
  components: { ExportExcel },
  filters: {
    formatData(data) {
      if (data == null || data === '') {
        return '----'
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
      dialogMenuVisible: false,
      dialogHelpVisible: false,
      isEdit: false,
      endTime: '',
      isMenuEdit: false,
      orderList: null,
      selectionOrderList: null,
      ifChangeFood: false,
      selectFoodName: null,
      selectFoodId: null,
      helpOrder: {
        id: null,
        foodId: null,
        userId: null,
        menuId: null
      },
      orderRules: {
        userId: [
          { required: true, message: '请选择员工', trigger: 'change' }
        ],
        foodId: [
          { required: true, message: '请选择午餐', trigger: 'change' }
        ]
      },
      rules: {
        name: [
          { required: true, message: '请输入美食名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在2到50个字符之间', trigger: 'blur' }
        ],
        storeName: [
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { required: true, message: '请填写正确的金额,保留两位小数', pattern: /(^\+?(?:[1-9]\d*(?:\.\d{1,2})?|0\.(?:\d[1-9]|[1-9]\d))$)/ }
        ],
        description: [
          { min: 0, max: 100, message: '长度不超过100个字符', trigger: 'blur' }
        ]
      },
      menuRules: {
        endTime: [
          { required: true, message: '截止时间不能为空', trigger: 'change' }
        ]
      },
      menu: Object.assign({}, defaultMenu),
      food: Object.assign({}, defaultFood),
      orderChange: Object.assign({}, defaultOrder),
      user: Object.assign({}, defaultUser),
      admin: Object.assign({}, defaultAdmin),
      adminList: [Object.assign({}, defaultAdmin)],
      exportExcel: {
        parentId: 0,
        tHeader: null,
        filterVal: null,
        listData: null
      }
    }
  },
  created() {
    this.getList()
    this.getUserAll()
  },
  methods: {
    importExcel() {
      this.$router.push('/canteen/importMenu??menuId=' + this.menu.id)
    },
    getList() {
      this.listLoading = true
      todayMenu().then(response => {
        this.listLoading = false
        if (response.data == null) {
          this.list = null
          return
        }
        this.menu = response.data.menu
        this.list = response.data.list
        this.getOrderList()
      })
    },
    getUserAll() {
      listAll().then(response => {
        this.adminList = response.data
      })
    },
    cancelChange() {
      this.dialogMenuVisible = false
      this.$router.go(0)
    },
    updateOrder(selectOrder) {
      this.orderChange = selectOrder
      this.selectFoodName = selectOrder.foodName
      this.selectFoodId = selectOrder.foodId
      this.dialogMenuVisible = true
    },
    selectGet(selectFood, currentFood) {
      if (selectFood.id !== currentFood.foodId) {
        this.user.userId = currentFood.userId
        this.user.menuId = currentFood.menuId
        this.user.foodId = selectFood.id
      }
    },
    getOrderList() {
      orderDetail(this.menu.id).then(response => {
        if (response.data == null) {
          this.orderList = null
          return
        }
        this.orderList = response.data
        this.setExcelData()
      })
    },
    formatTime(time) {
      this.menu.endTime = time
    },
    addMenu() {
      if (this.menu.id === undefined) {
        this.dialogMenuVisible = true
        this.isMenuEdit = false
      }
    },
    addFood() {
      this.dialogVisible = true
      this.isEdit = false
      this.food = Object.assign({}, defaultFood)
      this.food.menuId = this.menu.id
    },
    createMenu() {
      create(this.menu).then(response => {
        const message = '创建菜单成功'
        const type = 'success'
        this.tips(message, type)
        this.$router.go(0)
      })
    },
    updateMenu() {
      update(this.menu).then(response => {
        const message = '修改菜单成功'
        const type = 'success'
        this.tips(message, type)
        this.$router.go(0)
      })
    },
    handleUpdate(index, row) {
      this.dialogVisible = true
      this.isEdit = true
      this.food = Object.assign({}, row)
    },
    handleDialogConfirm(formName) {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.isEdit) {
              this.changeFood()
            } else {
              this.saveFood()
            }
            this.$router.go(0)
          } else {
            this.$message.error('请填写正确再提交')
          }
        })
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
    handleHelpDialogConfirm(formName) {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.helpOrder.menuId = this.menu.id
            helpOrder(this.helpOrder).then(response => {
              const message = '点餐成功'
              const type = 'success'
              this.tips(message, type)
              this.$router.go(0)
            })
          }
        })
      })
    },
    handleMenuDialogConfirm(formName) {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.user.userId !== null && this.user.foodId !== this.orderChange.foodId) {
              changeOrder(this.user).then(response => {
                const message = '换餐成功'
                const type = 'success'
                this.tips(message, type)
                this.$router.go(0)
              })
            } else {
              const message = '请更换午餐'
              const type = 'error'
              this.tips(message, type)
            }
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
    changeOrder(index, row) {
      this.ifChangeFood = true
    },
    deleteOrder(index, row) {
      this.$confirm('是否要取消这个人的点餐?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteCanteenUser(row.canteenUserId)
      })
    },
    deleteCanteenUser(id) {
      deleteUser(id).then(response => {
        const message = '删除成功'
        const type = 'success'
        this.tips(message, type)
        this.$router.go(0)
      })
    },
    deleteMenuFood(id) {
      deleteFood(id).then(response => {
        const message = '删除成功'
        const type = 'success'
        this.tips(message, type)
        this.$router.go(0)
      })
    },
    deleteThisMenu() {
      deleteMenu(this.menu.id).then(response => {
        const message = '删除成功'
        const type = 'success'
        this.tips(message, type)
        this.$router.go(0)
      })
    },
    setExcelData() {
      this.exportExcel.listData = this.orderList
      this.exportExcel.tHeader = ['部门', '姓名', '状态', '店家', '餐品', '小计']
      this.exportExcel.filterVal = ['departmentName', 'username', 'status', 'storeName', 'foodName', 'price']
    },
    endMenu() {
      endOrder(this.menu.id).then(response => {
        const message = '该点餐活动已截止'
        const type = 'success'
        this.tips(message, type)
        this.$router.go(0)
      })
    },
    finishMenu() {
      finishOrder(this.menu.id).then(response => {
        const message = '该点餐活动已完成'
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
<style scoped>
.end-time {
  line-height: 40px;
  margin-top: 20px;
}
.line {
  text-align: center
}
</style>
