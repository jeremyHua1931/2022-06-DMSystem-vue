<template>
	<el-button type="primary" @click="dialogFormVisible1 = true"
	    >修改信息</el-button
	  >
	  <el-button type="primary" @click="dialogFormVisible2 = true"
	      >修改密码</el-button
	    >
  <div>
    <el-row :gutter="12" style="margin-top:10px;">
      <el-col :span="24">
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
            注册时间：{{dataForm.time}}
            <li class="fa fa-clock-o"></li>
            
          </span>
            </div>
            <el-divider></el-divider>
            <div class="personal-relation">
              <div class="relation-item">手机号: {{dataForm.phone}} </div>
            </div>
<!--            <div class="personal-relation">-->
<!--              <div class="relation-item">所属企业:  <div style="float: right; padding-right:20px;">杭州诚聚</div></div>-->
<!--            </div>-->
            <div class="personal-relation">
              <div class="relation-item">邮箱: {{dataForm.email}} </div>
            </div>
            <div class="personal-relation">
              <div class="relation-item">个人简介: {{dataForm.desc}}</div>
            </div>
          </el-card>
        </div>
      </el-col>
	  
	  
	   <el-dialog v-model="dialogFormVisible1" title="修改个人信息">
	      <el-form :model="dataForm">
	        <el-form-item label="昵称" :label-width="formLabelWidth">
	          <el-input v-model="dataForm.nickName" autocomplete="off" />
	        </el-form-item>
			<el-form-item label="手机号" :label-width="formLabelWidth">
			  <el-input v-model="dataForm.phone" autocomplete="off" />
			</el-form-item>
			<el-form-item label="邮箱" :label-width="formLabelWidth">
			  <el-input v-model="dataForm.email" autocomplete="off" />
			</el-form-item>
			<el-form-item label="个人描述" :label-width="formLabelWidth">
			  <el-input v-model="dataForm.desc" autocomplete="off" />
			</el-form-item>
	       
	      </el-form>
	      <template #footer>
	        <span class="dialog-footer">
	          <el-button @click="dialogFormVisible1 = false">取消</el-button>
	          <el-button type="primary" @click="confirm1()"
	            >确定</el-button
	          >
	        </span>
	      </template>
	    </el-dialog>
		
		
		
		<el-dialog v-model="dialogFormVisible2" title="修改密码">
		   <el-form :model="pwdForm">
		     <el-form-item label="旧密码" :label-width="formLabelWidth">
		       <el-input v-model="pwdForm.formerPwd" autocomplete="off" />
		     </el-form-item>
					<el-form-item label="新密码" :label-width="formLabelWidth">
					  <el-input v-model="pwdForm.pwd" autocomplete="off" />
					</el-form-item>
					
		    
		   </el-form>
		   <template #footer>
		     <span class="dialog-footer">
		       <el-button @click="dialogFormVisible2 = false">取消</el-button>
		       <el-button type="primary" @click="confirm2()"
		         >确定</el-button
		       >
		     </span>
		   </template>
		 </el-dialog>
      <!-- <el-col :span="10">
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

      </el-col> -->


    </el-row>


  </div>

</template>

<script setup>
const userid = localStorage.getItem("userid");
import axios from "axios";
import {baseURL} from "../utils/request";
import { ref, reactive, onBeforeMount, computed, getCurrentInstance } from "vue";
import {getUserInfo,editinfo,editpassword} from "../apis/user.js"


import { ElMessage } from 'element-plus'

var post_info_edit;
var post_pass_edit;
let dialogFormVisible1 = ref(false);
let dialogFormVisible2 = ref(false);


var dataForm_copy;

//系统消息通知
//成功
const open1 = () => {
  ElMessage({
    showClose: true,
    message: '成功修改！',
    type: 'success',
  })
}
//失败


const open2 = () => {
  ElMessage.error('修改失败，请稍后再试')
}


// const open3 = () => {
//   ElMessage({
//     showClose: true,
//     message: '您已拒绝该消息',
//     type: 'warning',
//   })
// }





const confirm1 = () =>{
	
	console.log(dataForm.nickName);
	dialogFormVisible1.value = false;
	
	post_info_edit = {
		userid:localStorage.getItem("userid"),
		name:dataForm.nickName,
		email:dataForm.email,
		phone:dataForm.phone,
		description:dataForm.desc
	}
	
	editinfo(post_info_edit)
	    .then((res) => {
	      if (res.code == 0) {
	       open1();
	      }
	    })
	    .catch((err) => {
	      open2();
		  dataForm = dataForm_copy;
	    });

	
};


const confirm2 = () =>{
	
	console.log(pwdForm.formerPwd);
	dialogFormVisible2.value = false;
	
	post_pass_edit = {
		userid:localStorage.getItem("userid"),
		oldPassword:pwdForm.formerPwd,
		newPassword:pwdForm.pwd
	}
	
	editpassword(post_pass_edit)
	    .then((res) => {
	      if (res.code == 0) {
	       open1();
	      }
	    })
	    .catch((err) => {
	     open2();
	    });
	
	
};







const formLabelWidth = '140px';


      var dataForm = reactive({
        nickName: '请求中...',
        phone: '请求中...',
        email: '请求中...',
        desc:'请求中...',
        time:'请求中...',
      });
   //    const editForm = reactive({
   //      nickName: '请输入新昵称',
   //      phone: '请输入新电话号码',
   //      homeUrl: '请输入新邮箱地址',
   //      desc:'请输入新个人简介',
   //      formerPwd:"若要修改密码则必填",
   //      time:'请求中...可点击右上角刷新按钮重试',
   //      pwd:"新密码"
   //    });
      const pwdForm = reactive({
        formerPwd:"请输入旧密码",
        pwd:"请输入新密码"
      });
   //    const alreadyGet = ref(false);
   //    const show = ref(true) ;
	  // const dialogFormVisible = ref(false),
	  
 const post_userinfo = {
	 userid : localStorage.getItem("userid"),
 };
	
    const getInfo = () => {
		console.log("111");
		getUserInfo(post_userinfo)
		    .then((res) => {
		      if (res.code == 0) {
		       dataForm.nickName = res.data[0].name;
			   dataForm.phone = res.data[0].phone;
			   dataForm.time = res.data[0].registertime;
			    dataForm.email = res.data[0].email;
				dataForm.desc = res.data[0].description;
				dataForm_copy = dataForm;
				console.log("%%%%%",dataForm_copy)
				console.log(res.data[0].name)
		      }
		    })
		    .catch((err) => {
		      console.log(err);
		    });
		  
		};
		
		
		
   //    let data = {
   //      "userid": userid
   //    };
   //    axios.post(baseURL + '/user/info', data)
   //        .then(
   //            res => {
   //              console.log(res.data.data)
   //         dataForm = {
   //            nickName: res.data.data[0].name,
   //            phone: res.data.data[0].phone,
   //            homeUrl: res.data.data[0].email,
   //            desc: res.data.data[0].description,
   //            time: res.data.data[0].registertime,
   //            formerPwd: "若要修改密码则必填",
   //            pwd: "新密码"
   //          };
   //        editForm = {
   //            nickName: res.data.data[0].name,
   //            phone: res.data.data[0].phone,
   //            homeUrl: res.data.data[0].email,
   //            desc: res.data.data[0].description,
   //            time: res.data.data[0].registertime,
   //            formerPwd: "若要修改密码则必填",
   //            pwd: "新密码"
   //          };
			// console.log("成功")
   //          alreadyGet=true;
   //        }).catch(()=>alert("请求失败"))
    // };
	
	
   //  const submitInfo = () => {
   //    console.log(editForm)
   //      let data = {
   //        "userid": userid,
   //        name: editForm.nickName,
   //        phone: editForm.phone,
   //        email: editForm.homeUrl,
   //        description: editForm.desc,
   //        time: editForm.time,
   //        formerPwd: "若要修改密码则必填",
   //        pwd: "新密码"
   //      };
   //      axios.post(baseURL + '/user/editinfo', data)
   //          .then(
   //              res => {
   //                console.log(res.data.data)
   //                if(res.data.code==0){
   //                  dataForm = editForm;
   //                }
   //                getInfo();
   //              })
   //    };
   // const submitPwd = () => {
   //    console.log(pwdForm)
   //    if(pwdForm.pwd.length<6){
   //      alert("密码长度需大于等于6")
   //    }else if(pwdForm.pwd=="请输入新密码"||pwdForm.formerPwd=="请输入旧密码"){
   //      alert("请输入新/旧密码")
   //    }
   //    else
   //    {
   //    let data = {
   //      "userid": userid,
   //      "oldPassword": pwdForm.formerPwd,
   //      "newPassword": pwdForm.pwd
   //    };
   //    console.log(data)
   //    axios.post(baseURL + '/user/editpassword', data)
   //        .then(
   //            res => {
   //              console.log(res.data.code)
   //              if(res.data.code==0){
   //                    alert("密码修改成功")
   //              }else{
   //                alert("密码修改失败，请检查旧密码是否有误")
   //              }
   //              getInfo();
   //            })
   //  }
   //  };

  onBeforeMount(() => {
	  console.log("121212")
    getInfo();
    
  });

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


.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
