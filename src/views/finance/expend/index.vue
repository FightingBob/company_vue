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
      <el-button size="mini" class="btn-add" style="margin-left: 20px" @click="handleAdd()">添加</el-button>
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
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
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
      :title="isEdit?'编辑支出':'添加支出'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="expendForm"
        :model="expend"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="员工：" prop="userId">
          <el-select v-model="expend.userId" filterable placeholder="请选择">
            <el-option
              v-for="item in adminList"
              :key="item.id"
              :label="item.nickname"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型：" prop="type">
          <el-select v-model="expend.type" filterable placeholder="请选择">
            <el-option
              v-for="item in expendOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="金额：" prop="money">
          <el-input v-model="expend.money" style="width: 250px" step="0.01" />
        </el-form-item>
        <el-form-item label="描述：" prop="description">
          <el-input
            v-model="expend.description"
            type="textarea"
            :rows="5"
            style="width: 250px"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm('expendForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { listExpend, listExpendAll, addExpend, deleteExpend } from '@/api/expend'
import ExportExcel from '@/components/ExportExcel'
import { listAll } from '@/api/user'
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null,
  timeOption: 0,
  expendOption: 0,
  pickerFirst: null,
  pickerLast: null,
  userId: null
}
const defaultExpend = {
  id: null,
  money: null,
  description: null,
  type: null,
  userId: null,
  nickname: null
}
const defaultAdmin = {
  id: null,
  nickname: null
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
      isEdit: false,
      dialogVisible: false,
      expend: Object.assign({}, defaultExpend),
      adminList: [Object.assign({}, defaultAdmin
      )],
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
        },
        {
          value: 4,
          label: '未点餐'
        }
      ],
      expendType: [
        '全部',
        '午餐',
        '饮料',
        '报销',
        '未点餐'
      ],
      rules: {
        userId: [
          { required: true, message: '请选择员工', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择支出类型', trigger: 'change' }
        ],
        money: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { required: true, message: '请填写正确的金额,保留两位小数', pattern: /(^\+?(?:[1-9]\d*(?:\.\d{1,2})?|0\.(?:\d[1-9]|[1-9]\d))$)/ }
        ],
        description: [
          { min: 0, max: 100, message: '长度不超过100个字符', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    selectPicker(val) {
      if (val === null || val === undefined) {
        this.listQuery.pickerFirst = null
        this.listQuery.pickerLast = null
      } else {
        this.listQuery.pickerFirst = this.selectPicker[0]
        this.listQuery.pickerLast = this.selectPicker[1]
      }
    }
  },
  created() {
    this.getList()
    this.getListAll()
    this.getUserAll()
  },
  methods: {
    getUserAll() {
      listAll().then(response => {
        this.adminList = response.data
      })
    },
    importExcel() {
      this.$router.push('/finance/importExpend')
    },
    getList() {
      this.listLoading = true

      listExpend(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    getListAll() {
      listExpendAll(this.listQuery).then(response => {
        this.setExcelData(response.data)
      })
    },
    setExcelData(list) {
      this.exportExcel.listData = list.map((item) => {
        item.expendType = this.expendType[item.type]
        return item
      })
      this.exportExcel.tHeader = ['支出人', '支出类型', '支出描述', '支出金额', '添加时间', '修改时间']
      this.exportExcel.filterVal = ['nickname', 'expendType', 'description', 'money', 'createTime', 'updateTime']
    },
    handleSearchList() {
      this.listQuery.pageNum = 1
      // this.listQuery.pickerFirst = this.selectPicker[0]
      // this.listQuery.pickerLast = this.selectPicker[1]
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
    },
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.expend = Object.assign({}, defaultExpend)
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
              // this.changeFood()
            } else {
              this.saveExpend()
            }
            this.$router.go(0)
          } else {
            this.$message.error('请填写正确再提交')
          }
        })
      })
    },
    saveExpend() {
      addExpend(this.expend).then(response => {
        const message = '添加成功'
        const type = 'success'
        this.tips(message, type)
        this.dialogVisible = false
        this.getList()
      })
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteExpend(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
      })
    }
  }
}
</script>
