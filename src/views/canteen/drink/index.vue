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
        ref="foodTable"
        v-loading="listLoading"
        :data="list"
        style="width: 100%;"
        border
      >
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="饮料名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <!-- <el-table-column label="饮料图片" align="center" width="130">
          <template slot-scope="scope">
            <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" fit="cover" style="width: 100px; height: 100px" />
          </template>
        </el-table-column> -->
        <el-table-column label="饮料价格" align="center">
          <template slot-scope="scope">{{ scope.row.price }} 元</template>
        </el-table-column>
        <el-table-column label="饮料库存" align="center">
          <template slot-scope="scope">{{ scope.row.margin }}</template>
        </el-table-column>
        <el-table-column label="添加时间" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.createTime | formatData }}</template>
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
      :title="isEdit?'编辑饮料':'添加饮料'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="foodForm"
        :model="drink"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="名称：" prop="name">
          <el-input v-model="drink.name" style="width: 250px" />
        </el-form-item>
        <el-form-item label="价格：" prop="price">
          <el-input v-model="drink.price" style="width: 250px" step="0.01" />
        </el-form-item>
        <el-form-item label="数量：" prop="margin">
          <el-input v-model.number="drink.margin" style="width: 250px" />
        </el-form-item>
        <!-- <el-form-item label="图片：" prop="image">
          <icon ref="tabIcon" v-model="drink.image" @callFather="getChild" />
        </el-form-item> -->
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
import { listDrink, addDrink, updateDrink, deleteDrink } from '@/api/drink'
const defaultDrink = {
  id: null,
  name: null,
  price: null,
  margin: null,
  image: null
}
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null
}
export default {
  name: 'ListDrink',
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
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: false,
      list: null,
      total: null,
      drink: Object.assign({}, defaultDrink),
      dialogVisible: false,
      isEdit: false,
      rules: {
        name: [
          { required: true, message: '请输入饮料名称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在2到15个字符之间', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { required: true, message: '请填写正确的金额,保留两位小数', pattern: /(^\+?(?:[1-9]\d*(?:\.\d{1,2})?|0\.(?:\d[1-9]|[1-9]\d))$)/ }
        ],
        margin: [
          { required: true, message: '库存不能为空' },
          { required: true, message: '库存格式错误，应为整数', pattern: /^[1-9]\d*$/ }
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
      listDrink(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.drink = Object.assign({}, defaultDrink)
    },
    getChild() {
      this.drink.image = this.$refs.tabIcon.fileList[0].url
    },
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    handleUpdate(index, row) {
      this.dialogVisible = true
      this.isEdit = true
      this.drink = Object.assign({}, row)
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
      this.getList()
    },
    handleDialogConfirm(formName) {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          this.changeDrink()
          this.$router.go(0)
        } else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.saveDrink()
              this.$router.go(0)
            } else {
              this.$message.error('请填写正确再提交')
            }
          })
        }
      })
    },
    changeDrink() {
      updateDrink(this.drink.id, this.drink).then(response => {
        const message = '修改成功！'
        const type = 'success'
        this.tips(message, type)
        this.dialogVisible = false
        this.getList()
      })
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该饮料?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDrink(row.id).then(response => {
          const message = '删除成功'
          const type = 'success'
          this.tips(message, type)
          this.getList()
        })
      })
    },
    saveDrink() {
      addDrink(this.drink).then(response => {
        const message = '添加成功'
        const type = 'success'
        this.tips(message, type)
        this.dialogVisible = false
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
