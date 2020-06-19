<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" />
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" style="margin-left: 20px" @click="toggleSelection()">取消选择</el-button>
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
        <el-table-column label="饮料图片" align="center" width="130">
          <template slot-scope="scope">
            <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" fit="cover" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
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
  </div>
</template>
<script>
export default {
  name: 'Retail',
  data() {
    return {
      list: null
    }
  },
  methods: {

  }
}
</script>
