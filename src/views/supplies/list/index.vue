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
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="物资编号/使用人" clearable />
          </el-form-item>
          <el-form-item label="使用状态：">
            <el-select v-model="listQuery.statusOption" placeholder="默认选择全部" clearable class="input-width">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
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
    <div class="table-container">
      <export-excel
        :theader="exportExcel.tHeader"
        :filterval="exportExcel.filterVal"
        :list="exportExcel.listData"
        style="margin-top: 15px"
      />
      <el-table
        ref="adminTable"
        v-loading="listLoading"
        :data="list"
        style="width: 100%;"
        border
      >
        <el-table-column label="采购日期" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.buyTime }}</template>
        </el-table-column>
        <el-table-column label="物资编号" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.serialNumber }}</template>
        </el-table-column>
        <el-table-column label="使用部门" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.departmentName }}</template>
        </el-table-column>
        <el-table-column label="使用人" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.userName }}</template>
        </el-table-column>
        <el-table-column label="使用状态" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.status }}</template>
        </el-table-column>
        <el-table-column label="类别名称" width="200" align="center">
          <template slot-scope="scope">{{ scope.row.typeName }}</template>
        </el-table-column>
        <el-table-column label="配置信息" align="center">
          <template slot-scope="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="采购价格" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.price }}</template>
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
      :title="isEdit?'编辑物资':'添加物资'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="adminForm"
        :model="supplies"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="物资编号：" prop="serialNumber">
          <el-input v-model="supplies.serialNumber" style="width: 250px" disabled />
        </el-form-item>
        <el-form-item label="使用状态：">
          <el-select v-model="supplies.status" placeholder="默认选择全部" clearable class="input-width">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="使用部门：" prop="departmentName">
          <el-input v-model="supplies.departmentName" style="width: 250px" />
        </el-form-item>
        <el-form-item label="使用人：" prop="userName">
          <el-input v-model="supplies.userName" style="width: 250px" />
        </el-form-item>
        <el-form-item label="配置信息：" prop="description">
          <el-input
            v-model="supplies.description"
            type="textarea"
            :rows="5"
            style="width: 250px"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm('adminForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
import ExportExcel from '@/components/ExportExcel'
import { listAll } from '@/api/user'
import { suppliesList, deleteSupplies, suppliesListByPagination, updateSupplies } from '@/api/supplies'
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null,
  statusOption: -1
}
const defaultSupplies = {
  id: null,
  serialNumber: null,
  typeName: null,
  price: null,
  status: 0,
  buyTime: null,
  description: null,
  userName: null,
  departmentName: null
}
export default {
  name: 'SuppliesList',
  components: { ExportExcel },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      isEdit: false,
      dialogVisible: false,
      list: null,
      excelList: null,
      total: null,
      listLoading: false,
      exportExcel: {
        parentId: 0,
        tHeader: null,
        filterVal: null,
        listData: null
      },
      statusOptions: [
        {
          value: -1,
          label: '全部'
        },
        {
          value: 0,
          label: '闲置'
        },
        {
          value: 1,
          label: '使用中'
        },
        {
          value: 2,
          label: '报废'
        },
        {
          value: 3,
          label: '维修中'
        },
        {
          value: 4,
          label: '转赠'
        }
      ],
      demoList: [
        {
          departmentId: 1,
          departmentName: '人资行政中心',
          userName: '王荣廷',
          price: '180',
          buyTime: '2017-01-02',
          serialNumber: 'BG283',
          status: '使用中',
          suppliesId: 1,
          typeName: '三层文件柜',
          userId: 202
        }
      ],
      supplies: Object.assign({}, defaultSupplies),
      rules: {
        departmentName: [
          { required: true, message: '请输入使用部门名称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在2到15个字符之间', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入使用人名称', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在1到15个字符之间', trigger: 'blur' }
        ],
        description: [
          { max: 15, message: '长度不超过100个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getUserAll()
  },
  methods: {
    formatStatus(status) {
      var result = ''
      switch (status) {
        case 0:
          result = '闲置'
          break
        case 1:
          result = '使用中'
          break
        case 2:
          result = '报废'
          break
        case 3:
          result = '维修中'
          break
        case 4:
          result = '转赠'
          break
        default:
          return '其他情况'
      }
      return result
    },
    formatStatus2(status) {
      var result = ''
      switch (status) {
        case '闲置':
          result = 0
          break
        case '使用中':
          result = 1
          break
        case '报废':
          result = 2
          break
        case '维修中':
          result = 3
          break
        case '转赠':
          result = 4
          break
        default:
          return 5
      }
      return result
    },
    getUserAll() {
      listAll().then(response => {
        this.adminList = response.data
      })
    },
    handleDialogConfirm(formName) {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updateSupplies(this.supplies).then(response => {
            const message = '修改成功！'
            const type = 'success'
            this.tips(message, type)
            this.dialogVisible = false
            this.getList()
          })
        } else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.saveDepartment()
            } else {
              this.$message.error('请填写正确再提交')
            }
          })
        }
      })
    },
    tips(message, type) {
      this.$message({
        message,
        type,
        duration: 1000
      })
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
      this.getList()
    },
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    importExcel() {
      this.$router.push('/supplies/importSupplies')
    },
    getList() {
      suppliesList(this.listQuery).then(response => {
        this.listLoading = false
        this.excelList = response.data
        this.excelList = this.excelList.map(supplies => {
          supplies.status = this.formatStatus(supplies.status)
          return supplies
        })
        this.setExcelData()
      })
      suppliesListByPagination(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.list = this.list.map(supplies => {
          supplies.status = this.formatStatus(supplies.status)
          return supplies
        })
        this.total = response.data.total
      })
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该物资?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSupplies(row.suppliesId).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
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
    handleUpdate(index, row) {
      this.dialogVisible = true
      this.isEdit = true
      this.supplies = Object.assign({}, row)
      this.supplies.status = this.formatStatus2(this.supplies.status)
    },
    setExcelData() {
      if (this.excelList.length === 0) {
        this.exportExcel.listData = this.demoList
      } else {
        this.exportExcel.listData = this.excelList
      }
      this.exportExcel.tHeader = ['采购日期', '物资编号', '使用部门', '使用人', '使用状态', '类别名称', '配置信息', '采购价格']
      this.exportExcel.filterVal = ['buyTime', 'serialNumber', 'departmentName', 'userName', 'status', 'typeName', 'description', 'price']
    }
  }
}
</script>
