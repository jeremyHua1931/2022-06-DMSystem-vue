<template>
  <div class="table">
    <el-table :data="TeamList" border style="width: 100%">
      <el-table-column prop="team_id" label="团队编号" width="" />
      <el-table-column prop="team_name" label="团队名称" width="" />
      <el-table-column prop="team_leader_id" label="团队组长" width="" />
      <el-table-column prop="team_administrators" label="团队管理员" width="" />
      <el-table-column prop="team_member_num" label="团队组员数" width="" />
      <el-table-column label="操作" fixed="right" width="180"
        ><template #default="scope">
			<el-link
			  
			  :href="'/admin/TeamManagement?teamid=' + scope.row.team_id +'&&userid='+ userid"
			  type="primary"
			  :underline="false"
			  >进入该团队</el-link
			><el-divider v-if="scope.row.owner=='yes'" direction="vertical"></el-divider>
          <!-- <el-button size="small" @click="modify(scope.row)">进入团队</el-button> -->
          <el-popconfirm
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
import { ref, reactive, onBeforeMount, computed } from "vue";
import { useRouter } from "vue-router";
import { Search } from "@element-plus/icons-vue";
import { getToken } from "utils/auth";
// import { getDepositList, deleteDeposit } from "apis/good.js";
import {getTeams} from "../apis/team.js";







const userid = '1';

const count = ref(0);
const query = reactive({
  userid : userid,
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
  router.push("/depositRelease");
};

const router = useRouter();
const modify = (row) => {
  // router.push({
  //   path: "/depositRelease",
  //   query: { isModify: true, id: row.id },
  // });
  alert("进入该团队页面");
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
