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
          <!-- <el-form-item label="时间：">
            <el-select v-model="listQuery.timeOption" placeholder="默认选择全部" clearable class="input-width">
              <el-option
                v-for="item in timeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item label="时间：">
            <el-date-picker
              v-model="selectPicker"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="支出分类：">
            <el-select v-model="listQuery.expendOption" placeholder="默认选择全部" clearable class="input-width">
              <el-option
                v-for="item in expendOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
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
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <!-- <el-table-column label="支出人" align="center">
          <template slot-scope="scope">{{ scope.row.userId }}</template>
        </el-table-column> -->
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
import { listBySelf, listBySelfAll } from '@/api/expend'

import ExportExcel from '@/components/ExportExcel'
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null,
  timeOption: 0,
  expendOption: 0,
  pickerFirst: null,
  pickerLast: null
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
      listLoading: false,
      list: null,
      total: null,
      selectPicker: 0,
      exportExcel: {
        parentId: 0,
        tHeader: null,
        filterVal: null,
        listData: null
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      timeOptions: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '今天'
        },
        {
          value: -1,
          label: '昨天'
        },
        {
          value: 30,
          label: '当月'
        }
      ],
      expendOptions: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '午餐'
        },
        {
          value: 2,
          label: '饮料'
        },
        {
          value: 3,
          label: '报销'
        }
      ],
      expendType: [
        '全部',
        '午餐',
        '饮料',
        '报销'
      ]
    }
  },
  created() {
    this.getList()
    this.getListAll()
  },
  methods: {
    getList() {
      this.listLoading = true
      listBySelf(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    getListAll() {
      listBySelfAll(this.listQuery).then(response => {
        this.setExcelData(response.data)
      })
    },
    setExcelData(list) {
      this.exportExcel.listData = list.map((item) => {
        item.expendType = this.expendType[item.type]
        return item
      })
      this.exportExcel.tHeader = ['支出类型', '支出描述', '支出金额', '添加时间', '修改时间']
      this.exportExcel.filterVal = ['expendType', 'description', 'money', 'createTime', 'updateTime']
    },
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.listQuery.pickerFirst = this.selectPicker[0]
      this.listQuery.pickerLast = this.selectPicker[1]
      this.getList()
      this.getListAll()
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
      this.getList()
      this.getListAll()
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    }
  }
}
</script>
