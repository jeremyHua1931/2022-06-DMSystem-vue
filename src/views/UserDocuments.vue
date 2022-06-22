<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <div class="input">
        <input
          type="text"
          v-model="query.name"
          @keyup.enter.capture="getList"
          placeholder="请输入产品名"
        />
        <el-button @click="getList" :icon="Search" type="text" circle></el-button>
      </div>
      <el-select
        v-model="query.status"
        @change="getList"
        placeholder="请选择销售状态"
        size="large"
      >
        <el-option label="请选择销售状态" value=""> </el-option>
        <el-option label="未开始" :value="0"> </el-option>
        <el-option label="进行中" :value="1"> </el-option>
        <el-option label="已结束" :value="2"> </el-option>
      </el-select>
    </div>
    <div class="toolbar-right">
     <el-badge :value="noticeList.length" class="item">
         <el-button :icon="Message" type="primary" @click="drawer = true">未读消息</el-button>
       </el-badge>
    </div>
  </div>
  <div class="table">
    <el-table :data="depositList" border style="width: 100%">
      <!-- <el-table-column prop="avatar" label="图片" width="65">
        <template #default="scope">
          <el-avatar :src="scope.row.image"></el-avatar></template
      ></el-table-column> -->
      <el-table-column align="center" prop="document_id" label="文献编号" width="" />
      <el-table-column align="center" prop="document_name" label="文献名称" width="" />
      <el-table-column align="center" prop="library_from_team_id" label="文献库所属团队编号" width="" />
      <el-table-column align="center" prop="library_from_team_name" label="文献库所属团队名称" width="" />
      <el-table-column align="center" label="操作" fixed="right" width="180"><template #default="scope">
          <el-button size="small" @click="modify(scope.row)">进入文献库</el-button>
          <el-divider direction="vertical"></el-divider>
		  <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确认删除该文献库？"
            @confirm="handleDelete(scope.$index, scope.row)"
          >
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
	
    <el-pagination
      v-model:currentPage="query.page"
      :page-size="query.size"
      layout="prev, pager, next, jumper"
      :total="count"
      @current-change="getList"
      :hide-on-single-page="true"
    >
    </el-pagination>
  </div>
  
  <el-drawer
      v-model="drawer"
      title="未读消息"
      :direction="rtl"
      :before-close="handleClose"
    >
      <!-- <span>Hi, there!</span> -->
	  <div id="table">
		  <el-table :data="noticeList" border style="width: 100%" >  
		  
		  <el-table-column type="expand">
		        <template #default="props">
		          <div m="4">
		            <p m="t-0 b-2" style="width: 100%;height: 45px;display: block;line-height: 45px;text-align: center;">{{ props.row.content}}</p>
		          </div>
		        </template>
		      </el-table-column>
		  
		   <el-table-column align="center" label="消息" width="" >邀请通知</el-table-column>
		   <el-table-column align="center" label="操作1" fixed="right" width="75"><template #default="scope">
		       <el-button size="small" @click="Confirm_Notice_yes(scope.row)">接受</el-button>
		     </template>
		   </el-table-column>
		  <el-table-column align="center" label="操作2" fixed="right" width="75"><template #default="scope">
		  		  <el-popconfirm
		        confirm-button-text="确认"
		        cancel-button-text="取消"
		        icon="el-icon-info"
		        icon-color="red"
		        title="确认拒绝该消息？"
		        @confirm="Confirm_Notice_no(scope.row)"
		      >
		        <template #reference>
		          <el-button size="small" type="danger">拒绝</el-button>
		        </template>
		      </el-popconfirm>
		    </template>
		  </el-table-column>
		  

		  
		  
		</el-table>
		  
		  
	        <!-- <li v-for="item in items" v-bind:key="item.message">
	          {{ item.message }}
	        </li> -->
	        <!-- <button v-on:click="add">接受（已读）</button>
			<button v-on:click="add">拒绝（忽略）type="danger"</button> -->
	      </div>
    </el-drawer>
  
  
</template>

<script setup>
import { ref, reactive, onBeforeMount, computed, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { Search,Message } from "@element-plus/icons-vue";
import { getToken } from "utils/auth";
import {getNotice,confirmNotice} from "../apis/notification.js"

const drawer = ref(false);



// let windowHeight = document.documentElement.clientHeight || document.bodyclientHeight;
// this.TableHeight = windowHeight - 140;//数值"140"根据需要调整


var localurl = window.location.href;
var userid = localurl.split("?userid=")[1];
console.log("解析的userid为",userid);
const Instance = getCurrentInstance();
const { appContext : { config: { globalProperties } } } = getCurrentInstance();
console.log("Instance为：", Instance);
console.log("全局变量中的Userid为：", globalProperties.$userid);
globalProperties.$userid = userid;
console.log("修改后全局变量中的Userid为：", globalProperties.$userid);

const count = ref(0);
const query = reactive({
  name: null,
  status: null,
  page: 1,
  size: 10,
});
var team_info = [{
  document_id:1,
  document_name:"XXXX.pdf",
  library_from_team_id:"1",
  library_from_team_name:"羡慕死了组",
}]

const post_notice = {
	userid:globalProperties.$userid,
}



const noticeList = ref([]);
const depositList = ref([]);

const Confirm_Notice_yes = (row) => {
	const post_confirm = {
		noticeid:row.noticeid,
		choice:"1"
	};
	confirmNotice(post_confirm)
	  .then((res) => {
	    if (res.code == 0) {
	      alert("您已确认该消息");
	    }
	  })
	  .catch((err) => {
	    console.log(err);
	  });
}

const Confirm_Notice_no = (row) => {
	const post_confirm = {
		noticeid:row.noticeid,
		choice:"0"
	};
	confirmNotice(post_confirm)
	  .then((res) => {
	    if (res.code == 0) {
	      alert("您已拒绝该消息");
	    }
	  })
	  .catch((err) => {
	    console.log(err);
	  });	
}



const getList = () => {
  depositList.value = team_info;
  // getDepositList(query)
  //   .then((res) => {
  //     if (res.code == 200) {
  //       depositList.value = res.data.depositList;
  //       count.value = res.data.count;
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  
  
  //获取所有评论
  getNotice(post_notice)
    .then((res) => {
      if (res.code == 0) {
        noticeList.value = res.data;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  
};


depositList.value = team_info;

const add = () => {
  router.push("/depositRelease");
};

const router = useRouter();
const modify = (row) => {
  // router.push({
  //   path: "/depositRelease",
  //   query: { isModify: true, id: row.id },
  // });
  alert("进入该文献库页面");
};

const handleDelete = (index, invalid, list) => {
  // deleteDeposit({ id: depositList.value[index].id })
  //   .then((res) => {
  //     if (res.code == 200) {
  //       depositList.value.splice(index, 1);
  //       ElMessage.success(res.msg);
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  alert("执行了删除函数");
};

onBeforeMount(() => {
  getList();
  
});


// created() {
//     //动态计算表格高度
//     let windowHeight = document.documentElement.clientHeight || document.bodyclientHeight;
//     this.TableHeight = windowHeight - 140;//数值"140"根据需要调整
//   };

</script>

<style scoped>
.toolbar {
  display: flex;
  position: relative;
  justify-content: space-between;
}
.toolbar-left {
  flex: 0 0 auto;
}
.input {
  display: inline-block;
  margin-right: 15px;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  border-radius: 6px;
}
.toolbar input {
  width: calc(100% - 70px);
  height: 36px;
  margin-right: 10px;
  padding: 0.1rem 0.65rem;
  border: none;
  outline: none;
  font-size: 15px;
  background: transparent;
  box-shadow: none;
}
.toolbar-right {
  margin-top: 5px;
  margin-left: 20px;
  text-align: left;
  margin-right: 20px;
}
.table {
  margin-top: 20px;
  margin-right: 20px;
  text-align: center !important;
}
.el-pagination {
  justify-content: center;
}
.item {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
