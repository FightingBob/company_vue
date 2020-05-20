<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" />
      <span>数据列表</span>
      <el-button v-if="(listOrder == null) && tableRadio !== null" size="mini" class="btn-add" style="margin-left: 20px" @click="dialogVisible = true">下单</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        v-if="!isEnd && !(listOrder != null)"
        ref="foodTable"
        v-loading="listLoading"
        :data="list"
        style="width: 100%;"
        border
        tooltip-effect="dark"
        highlight-current-row
        @current-change="clickChange"
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
        <el-table-column label="选择" width="55">
          <template slot-scope="scope">
            <el-radio v-model="tableRadio" :label="scope.row"><i /></el-radio>
          </template>
        </el-table-column>
      </el-table>

      <el-table
        v-else
        ref="foodTable"
        v-loading="listLoading"
        :data="list"
        style="width: 100%;"
        border
        tooltip-effect="dark"
      >
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
          <template slot-scope="scope">{{ scope.row.description | formatData }}</template>
        </el-table-column>
        <el-table-column label="美食价格" align="center">
          <template slot-scope="scope">{{ scope.row.foodPrice }} 元</template>
        </el-table-column>
        <el-table-column label="选择" width="55" align="center">
          <template slot-scope="scope">
            <span><span style="color:#909399;">x</span><span style="color:#303133;"> {{ scope.row.selectNum }}</span><i v-if="tableRadio!= null && tableRadio.foodId == scope.row.foodId" class="el-icon-success" style="color:#66b1ff; font-size: 25px;" /></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>确认选择该选项？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { todayMenu } from '@/api/canteenMenu'
import { createOrder, today } from '@/api/order'
export default {
  name: 'SelectList',
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
      currentRow: null,
      tableRadio: null,
      dialogVisible: false,
      listOrder: null,
      selectedFood: null,
      todayOrderList: null,
      menu: null,
      isEnd: false
    }
  },
  created() {
    this.getList()
    this.todayOrder()
  },
  methods: {
    getList() {
      this.listLoading = true
      todayMenu(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.menu = response.data.menu
        if (this.menu.status === 0) {
          this.isEnd = true
        }
        this.list.push({
          id: -1,
          foodName: '自带',
          foodId: -1,
          menuId: -1,
          status: -1,
          foodPrice: 0,
          foodImage: 'https://littlebob-oss.oss-cn-beijing.aliyuncs.com/company/images/%E8%87%AA%E5%B8%A6.jpg'
        })
      })
    },
    clickChange(item, index) {
      this.tableRadio = item
    },
    addOrder() {
      const defaultOrder = {
        foodId: this.tableRadio.foodId,
        menuId: this.tableRadio.menuId,
        foodPrice: this.tableRadio.foodPrice
      }
      createOrder(defaultOrder).then(response => {
        const message = '添加成功'
        const type = 'success'
        this.tips(message, type)
        this.dialogVisible = false
        this.$router.go(0)
      })
    },
    todayOrder() {
      today().then(response => {
        if (response.data == null) {
          return false
        }
        this.listOrder = response.data.today
        this.todayOrderList = response.data.list
        this.setTableRadio()
        this.setSelectedNum()
      })
    },
    setTableRadio() {
      if (this.listOrder != null) {
        this.list.map(food => {
          if (food.foodId === this.listOrder.foodId) {
            this.tableRadio = food
          }
        })
      }
    },
    setSelectedNum() {
      if (this.todayOrderList != null) {
        this.list = this.list.map(food1 => {
          this.todayOrderList.map(food2 => {
            if (food1.foodId === food2.foodId) {
              food1.selectNum = food2.selectNum
            }
          })
          if (food1.selectNum == null) {
            food1.selectNum = 0
          }
          return food1
        })
      }
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
