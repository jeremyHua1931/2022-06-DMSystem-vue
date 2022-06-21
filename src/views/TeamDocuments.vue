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
      <el-button @click="add" type="primary" plain>新增</el-button>
    </div>
  </div>
  <div class="table">
    <el-table :data="depositList" border style="width: 100%">
      <!-- <el-table-column prop="avatar" label="图片" width="65">
        <template #default="scope">
          <el-avatar :src="scope.row.image"></el-avatar></template
      ></el-table-column> -->
      <el-table-column prop="library_id" label="文献库编号" width="" />
      <el-table-column prop="library_name" label="文献库名称" width="" />
      <el-table-column prop="library_from_team_id" label="文献库所属团队编号" width="" />
      <el-table-column prop="library_from_team_name" label="文献库所属团队名称" width="" />
      <el-table-column label="操作" fixed="right" width="180"><template #default="scope">
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
</template>

<script setup>
import { ref, reactive, onBeforeMount, computed } from "vue";
import { useRouter } from "vue-router";
import { Search } from "@element-plus/icons-vue";
import { getToken } from "utils/auth";
import { getDepositList, deleteDeposit } from "apis/good.js";

const count = ref(0);
const query = reactive({
  name: null,
  status: null,
  page: 1,
  size: 10,
});
const depositList = ref([]);
const getList = () => {
  getDepositList(query)
    .then((res) => {
      if (res.code == 200) {
        depositList.value = res.data.depositList;
        count.value = res.data.count;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

var team_info = [{
	library_id:1,
	library_name:"羡慕死了组的文献库",
	library_from_team_id:"1",
	library_from_team_name:"羡慕死了组",
}]

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
