<template>
  <el-form>
    <el-form-item label="账号">
      <el-input v-model.trim="user.name" :disabled="isDisabled" />
    </el-form-item>
    <el-form-item label="昵称">
      <el-input v-model.trim="user.nickname" :disabled="isDisabled" />
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model.trim="user.email" :disabled="isDisabled" />
    </el-form-item>
    <el-form-item label="手机号">
      <el-input v-model.trim="user.phone" :disabled="isDisabled" />
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model.trim="user.introduction" :disabled="isDisabled" />
    </el-form-item>
    <el-form-item>
      <el-button v-if="isDisabled" type="primary" @click="isDisabled=false">修改</el-button>
      <el-button v-if="!isDisabled" type="primary" @click="submit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          nickname: '',
          phone: '',
          introduction: ''
        }
      }
    }
  },
  data() {
    return {
      isDisabled: true
    }
  },
  methods: {
    submit() {
      const infoParam = {}
      infoParam.nickname = this.user.nickname
      infoParam.email = this.user.email
      infoParam.phone = this.user.phone
      infoParam.note = this.user.introduction
      infoParam.username = this.user.name
      this.$store.dispatch('user/updateInfo', infoParam).then(() => {
        location.reload()
        this.$router.go(0)
      })
    },
    tips() {
      this.$message({
        message: 'User information has been updated successfully',
        type: 'success',
        duration: 5 * 1000
      })
    }
  }
}
</script>
