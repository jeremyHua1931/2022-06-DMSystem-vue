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
      <el-popover placement="bottom" :width="400" trigger="hover">
        <template #reference>
          <el-button type="primary" plain
            >客户属性上传<el-icon><iUpload /></el-icon
          ></el-button>
        </template>
        <template #default>
          <h3>请按以下要求上传客户属性表格</h3>
          <ul>
            <li>请按参考模板标准上传</li>
            <li>用户名请使用系统客户用户名</li>
            <li>对于是否类型的数据，使用0、1代替即可</li>
            <li>客户属性名需以英文开头,只允许包含英文、数字、下划线</li>
            <li>请避免空单元格</li>
          </ul>
          <div class="file">
            <el-button type="primary" plain @click="downloadTemplate"
              >模板下载<el-icon><download /></el-icon
            ></el-button>
            <el-upload
              ref="upload"
              :action="baseURL + '/admin/client/userAttribute'"
              :headers="headers"
              :on-progress="handelProgress"
              :on-success="handelUpload"
              accept=".xlsx, .xls"
              :limit="1"
              ><el-button type="primary" plain
                >点击上传<el-icon><iUpload /></el-icon
              ></el-button>
            </el-upload>
          </div>
        </template>
      </el-popover>
    </div>
  </div>
  <div class="table">
    <el-table :data="customerList" border style="width: 100%">
      <el-table-column type="expand">
        <template #default="scope">
          <el-descriptions title="用户属性" :column="3" border>
            <el-descriptions-item
              v-for="(item, key) in scope.row.attribute"
              :key="key"
              :label="key"
            >
              {{ item }}
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column prop="avatar" label="头像" width="65">
        <template #default="scope">
          <el-avatar :src="scope.row.avatar"></el-avatar></template
      ></el-table-column>
      <el-table-column prop="id" label="ID" width="" />
      <el-table-column prop="name" label="姓名" width="" />
      <el-table-column prop="username" label="用户名" width="" />
      <el-table-column prop="phone" label="手机号" width="" />
      <el-table-column prop="idCard" label="身份证" width="" />
      <el-table-column prop="createTime" label="注册时间" width="" />
      <el-table-column label="操作" fixed="right"
        ><template #default="scope">
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
</template>

<script setup>
import { ref, reactive, onBeforeMount, computed } from "vue";
import { Search, Download, Upload as iUpload } from "@element-plus/icons-vue";
import "element-plus/es/components/loading/style/css";
import { ElLoading } from "element-plus";
import { getToken } from "utils/auth.js";
import { baseURL } from "utils/request.js";
import {
  getCustomerList,
  deleteCustomer,
  getCustomerExcelTemplate,
} from "apis/customer.js";

const count = ref(0);
const query = reactive({
  username: null,
  phone: null,
  page: 1,
  size: 10,
});
const customerList = ref([]);
const getList = () => {
  getCustomerList(query)
    .then((res) => {
      if (res.code == 200) {
        customerList.value = res.data.userList;
        count.value = res.data.count;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const handleDelete = (index, invalid, list) => {
  deleteCustomer({ id: customerList.value[index].id })
    .then((res) => {
      if (res.code == 200) {
        customerList.value.splice(index, 1);
        ElMessage.success(res.msg);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const dialogVisible = ref(false);
const upload = ref();
const headers = computed(() => {
  return {
    token: getToken(),
  };
});
let loading;
const handelProgress = () => {
  console.log("handelProgress");
  loading = ElLoading.service({
    lock: true,
    fullscreen: true,
    text: "数据处理中,请稍后。",
    background: "rgba(0, 0, 0, 0.7)",
  });
};
const handelUpload = (res, file, fileList) => {
  loading.close();
  if (res.code == 200) {
    ElMessage.success(res.msg);
  } else if (res.code == 600) {
    ElMessage.error(`文件中第${res.data.row}行${res.data.column}列存在空值！`);
  } else {
    ElMessage.error(`文件中第${res.data.row}行的用户名不存在！`);
  }
  upload.value.clearFiles();
  //   upload.value.handleStart(files[0]);
};
const downloadTemplate = () => {
  getCustomerExcelTemplate()
    .then((res) => {
      //   let uri = URL.createObjectURL(res);
      //   window.open(uri);
      //   window.URL.revokeObjectURL(uri);
      const link = document.createElement("a"); // 生成一个a标签。
      link.href = window.URL.createObjectURL(res.data); // href属性指定下载链接
      link.download = "客户模板.xls"; // dowload属性指定文件名
      link.click(); // click()事件触发下载
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
ul {
  margin: 10px 0 0 10px;
}
ul li {
  margin-bottom: 2px;
}
:deep(.el-link.el-link--primary) {
  margin: 0 15px !important;
}
.file {
  display: flex;
}
.file [data-v-49ac04b6] .el-link.el-link--primary {
  display: inline-block;
}
button.el-button.el-button--primary.el-button--default.is-plain {
  margin-right: 15px;
}
.table {
  margin-top: 20px;
  margin-right: 20px;
  text-align: center !important;
}
:deep(.el-table .cell) {
  word-break: inherit;
}
:deep(.el-table) {
  --el-table-row-hover-bg-color: #fff;
}
:deep(.attributeKey) {
  --el-table-border: 0px;
}
:deep(.el-descriptions__title) {
  margin: 1px 1px -7px 14px;
  font-weight: 500;
}
.el-pagination {
  justify-content: center;
}
</style>
