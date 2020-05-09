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
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" />
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" style="margin-left: 20px" @click="handleAdd()">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="adminTable"
        v-loading="listLoading"
        :data="list"
        style="width: 100%;"
        border
      >
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="部门名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="部门描述" align="center">
          <template slot-scope="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="添加时间" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.createTime | formatDateTime }}</template>
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
      :title="isEdit?'编辑用户':'添加用户'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="adminForm"
        :model="department"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="部门名称：" prop="name">
          <el-input v-model="department.name" style="width: 250px" />
        </el-form-item>
        <el-form-item label="部门描述：" prop="description">
          <el-input
            v-model="department.description"
            type="textarea"
            :rows="5"
            style="width: 250px"
          />
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-radio-group v-model="department.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
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
import { addDepartment, listDepartment, updateDepartment, deleteDepartment } from '@/api/department'
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null
}
const defaultDepartment = {
  id: null,
  name: null,
  description: null,
  status: 1
}
export default {
  name: 'DepartmentList',
  filters: {
    formatDateTime(time) {
      if (time == null || time === '') {
        return 'N/A'
      }
      return time
    }
  },
  data() {
    return {
      list: null,
      listQuery: Object.assign({}, defaultListQuery),
      department: Object.assign({}, defaultDepartment),
      listLoading: false,
      total: null,
      isEdit: false,
      dialogVisible: false,
      rules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在2到15个字符之间', trigger: 'blur' }
        ],
        description: [
          { min: 6, max: 15, message: '长度在6到100个字符之间', trigger: 'blur' }
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
      listDepartment(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
      this.getList()
    },
    handleSizeChange() {

    },
    handleCurrentChange() {
    },
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.department = Object.assign({}, defaultDepartment)
    },
    handleDialogConfirm(formName) {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updateDepartment(this.department.id, this.department).then(response => {
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
    saveDepartment() {
      addDepartment(this.department).then(response => {
        const message = '添加成功'
        const type = 'success'
        this.tips(message, type)
        this.dialogVisible = false
        this.getList()
      })
    },
    handleUpdate(index, row) {
      this.dialogVisible = true
      this.isEdit = true
      this.department = Object.assign({}, row)
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该资源?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDepartment(row.id).then(response => {
          const message = '删除成功'
          const type = 'success'
          this.tips(message, type)
          this.getList()
        })
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
