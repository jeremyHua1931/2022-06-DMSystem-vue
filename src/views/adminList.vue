<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <input
        type="text"
        v-model="query.username"
        @keyup.enter.capture="getList"
        placeholder="请输入用户名"
      />
      <el-button @click="getList" :icon="Search" type="text" circle></el-button>
    </div>
    <div class="toolbar-right">
      <!-- <div class="add"> -->
      <el-button @click="add" type="primary" plain>新增</el-button>
      <!-- </div> -->
    </div>
  </div>
  <div class="table">
    <el-table :data="adminList" border style="width: 100%">
      <el-table-column prop="avatar" label="头像" width="65">
        <template #default="scope">
          <el-avatar :src="scope.row.avatar"></el-avatar></template
      ></el-table-column>
      <el-table-column prop="id" label="ID" width="" />
      <el-table-column prop="name" label="姓名" width="" />
      <el-table-column prop="username" label="用户名" width="" />
      <el-table-column prop="phone" label="手机号" width="" />
      <el-table-column prop="createTime" label="注册时间" width="" />
      <el-table-column label="操作" fixed="right"
        ><template #default="scope">
          <el-button size="small" @click="modify(scope.row)">编辑</el-button>
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确认删除该条信息？"
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
  <el-dialog title="新建管理员" v-model="dialogVisible">
    <el-form :model="adminForm" label-width="80px">
      <el-form-item v-if="dialogFlag == 'modify'" label="ID">
        <el-input v-model="adminForm.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="adminForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="adminForm.password"></el-input>
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          :action="baseURL + '/file/image'"
          :headers="headers"
          :on-success="uploadAvatar"
          :on-remove="removeAvatar"
          :limit="1"
          ><el-button type="primary" plain>点击上传</el-button>
        </el-upload></el-form-item
      >
      <el-form-item label="姓名">
        <el-input v-model="adminForm.name"></el-input>
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model.number="adminForm.phone"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onBeforeMount, computed } from "vue";
import { Search } from "@element-plus/icons-vue";
import { getToken } from "utils/auth.js";
import { baseURL } from "utils/request.js";
import { getAdminList, addAdmin, updateAdminInfo, deleteAdmin } from "apis/admin.js";

const count = ref(0);
const query = reactive({
  username: null,
  phone: null,
  page: 1,
  size: 10,
});
const adminList = ref([]);
const getList = () => {
  getAdminList(query)
    .then((res) => {
      if (res.code == 200) {
        adminList.value = res.data.userList;
        count.value = res.data.count;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const dialogVisible = ref(false);
const dialogFlag = ref("add");

const adminForm = ref({
  username: "",
  password: "",
  name: "",
  avatar: "https://xzj-pic-1306183757.cos.ap-nanjing.myqcloud.com/picgo/摘月蓝底.jpg",
  phone: null,
});

const add = () => {
  dialogVisible.value = true;
  dialogFlag.value = "add";
  delete adminForm.value["id"];
};

const modify = (row) => {
  dialogVisible.value = true;
  dialogFlag.value = "modify";
  adminForm.value = row;
};

const headers = computed(() => {
  return {
    token: getToken(),
  };
});
const uploadAvatar = (response, file, fileList) => {
  adminForm.value.avatar = response.data;
};
const removeAvatar = () => {
  adminForm.value.avatar =
    "https://lx-b2b-1306183757.cos.ap-nanjing.myqcloud.com/img/star1.jpg";
};

const submit = () => {
  if (dialogFlag.value == "add") {
    addAdmin(adminForm.value)
      .then((res) => {
        if (res.code == 200) {
          ElMessage.success(res.msg);
          getList();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    updateAdminInfo(adminForm.value)
      .then((res) => {
        if (res.code == 200) {
          ElMessage.success(res.msg);
          getList();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  dialogVisible.value = false;
};

const handleDelete = (index, invalid, list) => {
  deleteAdmin({ id: adminList.value[index].id })
    .then((res) => {
      if (res.code == 200) {
        adminList.value.splice(index, 1);
        ElMessage.success(res.msg);
      }
    })
    .catch((err) => {
      console.log(err);
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
/* .add {
  display: inline-block;
  height: 36px;
  width: 80px;
  padding: 0.1rem 0.65rem;
  text-align: center;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  border-radius: 6px;
}
.add el-button {
  text-align: center;
} */
.table {
  margin-top: 20px;
  margin-right: 20px;
  text-align: center !important;
}
.el-pagination {
  justify-content: center;
}
/* display: block; */
/* position: relative; */
/* float: left; */
/* width: 100%; */
/* height: 100%; */
/* margin: 0 auto; */
/* padding: 0, 0; */
/* font-display: Arial, "Helvetica Neue", Helvetica, sans-serif; */
/* color: #fff; */
/* background: #000; */
/* border-radius: 0px; */
</style>
