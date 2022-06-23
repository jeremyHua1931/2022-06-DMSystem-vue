<template>
  <div>
    <el-row :gutter="20" style="margin-top:10px;">
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>个人中心</span>
            </div>
            <div class="name-role">
              <span class="sender">{{dataForm.nickName}}</span>
            </div>
            <div class="registe-info">
          <span class="registe-info">
            注册时间：
            <li class="fa fa-clock-o"></li>
             {{dataForm.time}}
          </span>
            </div>
            <el-divider></el-divider>
            <div class="personal-relation">
              <div class="relation-item">手机号:  <div style="float: right; padding-right:20px;">{{dataForm.phone}}</div></div>
            </div>
<!--            <div class="personal-relation">-->
<!--              <div class="relation-item">所属企业:  <div style="float: right; padding-right:20px;">杭州诚聚</div></div>-->
<!--            </div>-->
            <div class="personal-relation">
              <div class="relation-item">邮箱:  <div style="float: right; padding-right:20px;">{{dataForm.homeUrl}}</div></div>
            </div>
            <div class="personal-relation">
              <div class="relation-item">个人简介:  <div style="float: right; padding-right:20px;">{{dataForm.desc}}</div></div>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>基本资料</span>
            </div>
            <div>
              <el-form label-width="80px" v-model=editForm size="small" label-position="right">
                <el-form-item label="用户昵称" prop="nickName">
                  <el-input  auto-complete="off" v-model="editForm.nickName"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input auto-complete="off" v-model="editForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="homeUrl">
                  <el-input  maxlength="18" v-model="editForm.homeUrl"></el-input>
                </el-form-item>
                <el-form-item label="个人简介" prop="homeUrl">
                  <el-input  maxlength="18" v-model="editForm.desc"></el-input>
                </el-form-item>

              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click="submitInfo">提交</el-button>

              </div>


            </div>
          </el-card>
        </div>

      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>密码</span>
            </div>
            <div>
              <el-form label-width="80px" v-model=pwdForm size="small" label-position="right">
                <el-form-item label="旧密码" prop="nickName">
                  <el-input  auto-complete="off" v-model="pwdForm.formerPwd"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="phone">
                  <el-input auto-complete="off" v-model="pwdForm.pwd"></el-input>
                </el-form-item>

              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="warning" @click="submitPwd">修改密码</el-button>
              </div>


            </div>
          </el-card>
        </div>

      </el-col>


    </el-row>


  </div>

</template>

<script>
const userid = localStorage.getItem("userid");
import axios from "axios";
import {baseURL} from "../utils/request";
export default {

  data(){
    return{
      dataForm:{
        nickName: '请求中...',
        phone: '请求中...',
        homeUrl: '请求中...',
        desc:'请求中...',
        formerPwd:"若要修改密码则必填",
        time:'请求中...',
        pwd:"新密码"
      },
      editForm:{
        nickName: '请输入新昵称',
        phone: '请输入新电话号码',
        homeUrl: '请输入新邮箱地址',
        desc:'请输入新个人简介',
        formerPwd:"若要修改密码则必填",
        time:'请求中...可点击右上角刷新按钮重试',
        pwd:"新密码"
      },
      pwdForm:{
        formerPwd:"请输入旧密码",
        pwd:"请输入新密码"
      },
      alreadyGet:false,
      show : true
    }
  },
  methods: {
    getInfo() {
      let data = {
        "userid": userid
      };
      axios.post(baseURL + '/user/info', data)
          .then(
              res => {
                console.log(res.data.data)
            this.dataForm = {
              nickName: res.data.data[0].name,
              phone: res.data.data[0].phone,
              homeUrl: res.data.data[0].email,
              desc: res.data.data[0].description,
              time: res.data.data[0].registertime,
              formerPwd: "若要修改密码则必填",
              pwd: "新密码"
            }
            this.editForm = {
              nickName: res.data.data[0].name,
              phone: res.data.data[0].phone,
              homeUrl: res.data.data[0].email,
              desc: res.data.data[0].description,
              time: res.data.data[0].registertime,
              formerPwd: "若要修改密码则必填",
              pwd: "新密码"
            }
            this.alreadyGet=true
          }).catch(()=>alert("请求失败"))
    },
    submitInfo(){
      console.log(this.editForm)
        let data = {
          "userid": userid,
          name: this.editForm.nickName,
          phone: this.editForm.phone,
          email: this.editForm.homeUrl,
          description: this.editForm.desc,
          time: this.editForm.time,
          formerPwd: "若要修改密码则必填",
          pwd: "新密码"
        };
        axios.post(baseURL + '/user/editinfo', data)
            .then(
                res => {
                  console.log(res.data.data)
                  if(res.data.code==0){
                    this.dataForm = this.editForm
                  }
                  this.getInfo()
                })
      },
    submitPwd(){
      console.log(this.pwdForm)
      if(this.pwdForm.pwd.length<6){
        alert("密码长度需大于等于6")
      }else if(this.pwdForm.pwd=="请输入新密码"||this.pwdForm.formerPwd=="请输入旧密码"){
        alert("请输入新/旧密码")
      }
      else
      {
      let data = {
        "userid": userid,
        "oldPassword": this.pwdForm.formerPwd,
        "newPassword": this.pwdForm.pwd
      };
      console.log(data)
      axios.post(baseURL + '/user/editpassword', data)
          .then(
              res => {
                console.log(res.data.code)
                if(res.data.code==0){
                      alert("密码修改成功")
                }else{
                  alert("密码修改失败，请检查旧密码是否有误")
                }
                this.getInfo()
              })
    }
    }

  },
  mounted() {
      this.getInfo()
  },


}
</script>

<style lang="scss" scoped>
//卡片样式
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 100%;
}
//文本样式区
.name-role {
  font-size: 16px;
  padding: 5px;
  text-align:center;
}
.sender{
  text-align:center;
}
.registe-info{
  text-align: center;
  padding-top:10px;
}
.personal-relation {
  font-size: 16px;
  padding: 0px 5px 15px;
  margin-right: 1px;
  width: 100%
}

.relation-item {
  padding: 12px;

}
.dialog-footer{
  padding-top:10px ;
  padding-left: 10%;
}
//布局样式区
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
