<template>

  <div class="table">
    <el-table :data="allTeamers" border style="width: 100%">
      <!-- <el-table-column prop="avatar" label="图片" width="65">
        <template #default="scope">
          <el-avatar :src="scope.row.image"></el-avatar></template
      ></el-table-column> -->
      <el-table-column align="center" prop="team_id" label="团队编号" width="" />
      <el-table-column align="center" prop="team_name" label="团队名称" width="" />
	  <el-table-column align="center" prop="member_id" label="团队成员ID" width="" />
      <el-table-column align="center" prop="member_name" label="团队成员昵称" width="" />
      <el-table-column align="center" prop="member_permission" label="成员权限" width="" />
      <el-table-column align="center" key = "1" label="操作" fixed="right" width="180"
        ><template #default="scope">
          <el-button v-if="scope.row.type==1" size="small" @click="modify(scope.row)">修改权限</el-button>
		<el-divider v-if="scope.row.type==1" direction="vertical"></el-divider>
		<el-popconfirm
		  v-if="scope.row.type==1"
		  confirm-button-text="确认"
		  cancel-button-text="取消"
		  icon="el-icon-info"
		  icon-color="red"
		  title="确认删除该成员？"
		  @confirm="handleDelete(scope.$index, scope.row)"
		>
		  <template #reference>
		    <el-button v-if="scope.row.type==1" size="small" type="danger">删除</el-button>
		  </template>
		</el-popconfirm>
		<p v-if="scope.row.type==0">暂无权限，无法操作</p>
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
</template>

<script setup>
import { ref, reactive, onBeforeMount, computed} from "vue";
import { useRouter } from "vue-router";
import { Search } from "@element-plus/icons-vue";
// import { getToken } from "utils/auth";
// import { getDepositList, deleteDeposit } from "apis/good.js";
import {getAllTeamers,deleteTeamer} from "apis/team.js"
import { ElMessage } from 'element-plus'


//消息通知
const open1 = () => {
  ElMessage({
    showClose: true,
    message: '修改权限成功！',
    type: 'success',
  })
}

const open2 = () => {
  ElMessage({
    showClose: true,
    message: '删除成功！',
    type: 'success',
  })
}

const open3 = () => {
  ElMessage({
    showClose: true,
    message: 'Oops！删除失败',
    type: 'error',
  })
}




const type = ref(0);
const router = useRouter();
console.log("teamid为：",router.currentRoute.value)
const count = ref(0);
const query = reactive({
  teamid: router.currentRoute.value.query["teamid"],
  userid: router.currentRoute.value.query["userid"]
});
const allTeamers = ref([]);
const getList = () => {
  getAllTeamers(query)
    .then((res) => {
      if (res.code == 0) {
        allTeamers.value = res.data;
		
		console.log("获取到的数据为",allTeamers.value)
		type = res.data[0].type;
		console.log("type的值为：",type);
		
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

//
// const add = () => {
//   // router.push("/depositRelease");
// };


const modify = (row) => {
  // router.push({
  //   path: "/depositRelease",
  //   query: { isModify: true, id: row.id },
  // });
  alert("编辑成员权限");
};

const handleDelete = (index, row) => {
	
	const post_delete_user = {
		teamid:row.team_id,
		userid:localStorage.getItem("userid"),
		targetid:row.member_id,
	};
	
	console.log("&&&&",post_delete_user)
	
	deleteTeamer(post_delete_user)
	  .then((res) => {
	    if (res.code == 0) {
		  allTeamers.value.splice(index, 1);
	      open2();
	    }
	  })
	  .catch((err) => {
	  open3();
	  });
};

onBeforeMount(() => {
  getList();
});




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
  margin-right: 30px;
}
.table {
  margin-top: 20px;
  margin-right: 20px;
  text-align: center !important;
}
.el-pagination {
  justify-content: center;
}
</style>
