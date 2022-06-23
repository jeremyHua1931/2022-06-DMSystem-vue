<template>
	<div class="toolbar-right">
	  <el-button @click="add" type="primary" plain>新增</el-button>
	</div>
  <div class="table">
    <el-table :data="TeamList" border style="width: 100%">
		<el-table-column align="center" prop="team_id" label="团队编号" width=""/>
		<el-table-column align="center" prop="team_name" label="团队名称" width=""/>
		<el-table-column align="center" prop="team_leader_id" label="团队组长" width=""/>
		<el-table-column align="center" prop="team_administrators" label="团队管理员" width=""/>
		<el-table-column align="center" prop="team_member_num" label="团队组员数" width=""/>
		<el-table-column align="center" label="管理" fixed="right" width="180">
			<template #default="scope">
				<div>
			<el-link
				:href="'/#/TeamManagement?teamid=' + scope.row.team_id +'&&userid='+ userid"
				type="primary"
				:underline="false"
				>成员管理
			</el-link>
			<el-divider direction="vertical"></el-divider>
			<el-link
				:href="'/#/TeamDocuments?teamid=' + scope.row.team_id"
				type="primary"
				:underline="false"
				>文献管理
			</el-link>
			</div>
			
		
			</template>
			</el-table-column>
			
			
			<el-table-column align="center" label="操作" fixed="right" width="180">
				<template #default="scope">
					
				<!-- <el-button size="small" @click="modify(scope.row)">进入团队</el-button> -->
				<el-popconfirm
				v-if="scope.row.owner=='yes'"
			      confirm-button-text="确认"
			      cancel-button-text="取消"
			      icon="el-icon-info"
			      icon-color="red"
			      title="确认删除该团队？"
			      @confirm="handleDelete(scope.$index, scope.row)"
				>
			    <template #reference>
			      <el-button v-if="scope.row.owner=='yes'" size="small" type="danger">删除</el-button>
			    </template>
				</el-popconfirm>
				<p v-if="scope.row.owner=='no'">暂无权限，无法操作</p>
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
import {ref, reactive, onBeforeMount, computed} from "vue";
import {useRouter} from "vue-router";
import {Search} from "@element-plus/icons-vue";
// import { getToken } from "utils/auth";
// import { getDepositList, deleteDeposit } from "apis/good.js";
import {getTeams,deleteteam} from "../apis/team.js";


//消息
const open1 = () => {
  ElMessage({
    showClose: true,
    message: '删除成功！',
    type: 'success',
  })
}

const open2 = () => {
  ElMessage({
    showClose: true,
    message: 'Oops！删除失败',
    type: 'error',
  })
}




const userid = localStorage.getItem("userid");
const count = ref(0);
const query = reactive({
  userid: userid,
});
const TeamList = ref([]);
const getList = () => {
	getTeams(query)
      .then((res) => {
        if (res.code == 0) {
          console.log(res.data);
          console.log(res.msg);
          TeamList.value = res.data;
        }
      })
      .catch((err) => {
            console.log(err);
          }
      );
};


const add = () => {
  // router.push("/depositRelease");
};

const router = useRouter();
const modify = (row) => {
  // router.push({
  //   path: "/depositRelease",
  //   query: { isModify: true, id: row.id },
  // });
  alert("进入该团队页面");
};

const handleDelete = (index, row) => {
    const post_delete_team = {
		userid:localStorage.getItem("userid"),
		teamid:row.team_id
	};
	deleteteam(post_delete_team)
	  .then((res) => {
	    if (res.code == 0) {
		TeamList.value.splice(index, 1);
	      open1();
	    }
	  })
	  .catch((err) => {
	        open2();
	      }
	  );
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
  margin-bottom: 5px;
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
