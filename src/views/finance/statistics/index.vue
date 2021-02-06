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
          <el-form-item label="时间：">
            <el-date-picker
              v-model="statisticsDate"
              type="month"
              placeholder="选择月份"
              format="yyyy 年 M 月"
              value-format="yyyy-MM"
            />
          </el-form-item>
          <el-form-item label="员工: ">
            <el-select v-model="listQuery.userId" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in adminList"
                :key="item.id"
                :label="item.nickname"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" />
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" style="margin-left: 20px" @click="importExcel">导入</el-button>
    </el-card>
    <div v-if="list != null" class="table-container">
      <export-excel
        :theader="exportExcel.tHeader"
        :filterval="exportExcel.filterVal"
        :list="exportExcel.listData"
        style="margin-top: 15px"
      />
      <el-table
        ref="foodTable"
        v-loading="listLoading"
        :data="list"
        style="width: 100%;"
        border
      >
        <el-table-column label="部门" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.departmentName }}</template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">{{ scope.row.nickname }}</template>
        </el-table-column>
        <el-table-column label="上个月剩余餐费" align="center">
          <template slot-scope="scope">{{ scope.row.lastMonthSave }}</template>
        </el-table-column>
        <el-table-column label="本月经费" align="center">
          <template slot-scope="scope">{{ scope.row.monthIncome }}</template>
        </el-table-column>
        <el-table-column label="本月报销费用" align="center">
          <template slot-scope="scope">{{ scope.row.reimbursement }}</template>
        </el-table-column>
        <el-table-column label="餐费总支出" align="center">
          <template slot-scope="scope">{{ scope.row.canteenExpend }}</template>
        </el-table-column>
        <el-table-column label="饮料总支出" align="center">
          <template slot-scope="scope">{{ scope.row.drinkExpend }}</template>
        </el-table-column>
        <el-table-column label="累计剩余可报销金额" align="center">
          <template slot-scope="scope">{{ scope.row.monthSave }}</template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.$index, scope.row)"
            >编辑
            </el-button>
          </template>
        </el-table-column> -->
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
  </div>
</template>
<script>
import { listAll } from '@/api/user'
import { listStatistics, listStatisticsAll } from '@/api/statistics'
import ExportExcel from '@/components/ExportExcel'
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  statisticsDate: null,
  userId: null
}
const defaultAdmin = {
  id: null,
  nickname: null
}
export default {
  name: 'Statistics',
  components: { ExportExcel },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      statisticsDate: null,
      adminList: [Object.assign({}, defaultAdmin)],
      list: null,
      listLoading: null,
      total: null,
      exportExcel: {
        parentId: 0,
        tHeader: null,
        filterVal: null,
        listData: null
      }
    }
  },
  watch: {
    statisticsDate(val) {
      if (val === null || val === undefined) {
        this.listQuery.statisticsDate = null
      } else {
        this.listQuery.statisticsDate = this.statisticsDate
      }
    }
  },
  created() {
    this.getUserAll()
    this.getList()
    this.getListAll()
  },
  methods: {
    getUserAll() {
      listAll().then(response => {
        this.adminList = response.data
      })
    },
    importExcel() {
      this.$router.push('/finance/importStatistics')
    },
    getList() {
      this.listLoading = true
      listStatistics(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    getListAll() {
      listStatisticsAll(this.listQuery).then(response => {
        this.setExcelData(response.data)
      })
    },
    setExcelData(list) {
      this.exportExcel.listData = list
      this.exportExcel.tHeader = ['部门', '姓名', '上个月剩余餐费', '本月经费', '本月报销费用', '餐费总支出', '饮料总支出', '累计剩余可报销金额']
      this.exportExcel.filterVal = ['departmentName', 'nickname', 'lastMonthSave', 'monthIncome', 'reimbursement', 'canteenExpend', 'drinkExpend', 'monthSave']
    },
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.getList()
      this.getListAll()
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
      this.getList()
      this.getListAll()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getList()
    }
  }
}
</script>
