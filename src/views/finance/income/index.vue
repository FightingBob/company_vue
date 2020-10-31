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
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="部门名称" clearable />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!-- <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" />
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" style="margin-left: 20px" @click="handleAdd()">添加</el-button>
      <el-button size="mini" class="btn-add" style="margin-left: 20px" @click="toggleSelection()">取消选择</el-button>
    </el-card> -->
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
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="支出人" align="center">
          <template slot-scope="scope">{{ scope.row.nickname }}</template>
        </el-table-column>
        <el-table-column label="支出类型" align="center">
          <template slot-scope="scope">{{ expendType[scope.row.type] }}</template>
        </el-table-column>
        <el-table-column label="支出描述" align="center">
          <template slot-scope="scope">{{ scope.row.description | formatData }}</template>
        </el-table-column>
        <el-table-column label="支出金额" align="center">
          <template slot-scope="scope">{{ scope.row.money }} 元</template>
        </el-table-column>
        <el-table-column label="添加时间" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.createTime | formatData }}</template>
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
  </div>
</template>
<script>
import { listAllIncome, listIncome } from '@/api/income'
import ExportExcel from '@/components/ExportExcel'
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null
}
const defaultIncome = {
  id: null,
  money: null,
  description: null,
  type: null,
  userId: null
}
export default {
  name: 'ExpendList',
  components: { ExportExcel },
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
      listQuery: Object.assign({}, defaultListQuery),
      income: Object.assign({}, defaultIncome),
      listLoading: false,
      listAll: null,
      list: null,
      total: null,
      exportExcel: {
        parentId: 0,
        tHeader: null,
        filterVal: null,
        listData: null
      },
      expendType: [
        '全部',
        '餐补'
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listIncome(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      })
      listAllIncome(this.listQuery).then(response => {
        this.listLoading = false
        this.listAll = response.data
      })
    },
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.income = Object.assign({}, defaultIncome)
    },
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
      this.getList()
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
    setExcelData(list) {
      this.exportExcel.listData = list.map((item) => {
        item.expendType = this.expendType[item.type]
        return item
      })
      this.exportExcel.tHeader = ['支出人', '支出类型', '支出描述', '支出金额', '添加时间', '修改时间']
      this.exportExcel.filterVal = ['nickname', 'expendType', 'description', 'money', 'createTime', 'updateTime']
    }
  }
}
</script>
