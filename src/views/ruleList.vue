<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <div class="input">
        <input
          type="text"
          v-model="query.name"
          @keyup.enter.capture="getList"
          placeholder="请输入规则名称"
        />
        <el-button @click="getList" :icon="Search" type="text" circle></el-button>
      </div>
      <el-select
        v-model="query.type"
        @change="getList"
        placeholder="请选择决策类型"
        size="large"
      >
        <el-option label="请选择决策类型" value=""> </el-option>
        <el-option label="等于" :value="0"> </el-option>
        <el-option label="大于" :value="1"> </el-option>
        <el-option label="小于" :value="2"> </el-option>
        <el-option label="区间" :value="3"> </el-option>
        <el-option label="属于" :value="4"> </el-option>
      </el-select>
    </div>
    <div class="toolbar-right">
      <!-- <div class="add"> -->
      <el-button @click="add" type="primary" plain>新增</el-button>
      <!-- </div> -->
    </div>
  </div>
  <div class="table">
    <el-table :data="ruleList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="" />
      <el-table-column prop="name" label="规则名" width="" />
      <el-table-column prop="description" label="规制描述" width="" />
      <el-table-column prop="type" label="决策类型" width="">
        <template #default="scope">
          {{ types[scope.row.type].label }}
        </template>
      </el-table-column>
      <el-table-column prop="value" label="决策数据" width="" />
      <el-table-column prop="variable" label="驱动变量" width="" />
      <el-table-column prop="control" label="风险控制" width="">
        <template #default="scope">
          <el-tag v-if="scope.row.control == 1" type="success">通过</el-tag>
          <el-tag v-else type="danger">拒绝</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="140"
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
  <el-dialog title="新建规则" v-model="dialogVisible">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="80px">
      <el-form-item v-if="dialogFlag == 'modify'" label="ID" prop="id">
        <el-input v-model="ruleForm.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="规则名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="规则描述" prop="description">
        <el-input v-model="ruleForm.description"></el-input>
      </el-form-item>
      <!-- TODO notice -->
      <el-form-item label="决策类型" prop="type">
        <el-select
          v-model="ruleForm.type"
          @change="handleTypeChange"
          class="m-2"
          placeholder="Select"
          size="large"
        >
          <el-option
            v-for="item in types"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="决策数值"
        v-if="ruleForm.type == 0 || ruleForm.type == 1 || ruleForm.type == 2"
        prop="value"
      >
        <el-input v-model="ruleForm.value[0]"></el-input>
      </el-form-item>
      <el-form-item label="数值A" v-if="ruleForm.type == 3" prop="value">
        <el-input v-model="ruleForm.value[0]"></el-input>
      </el-form-item>
      <el-form-item label="数值B" v-if="ruleForm.type == 3" prop="value">
        <el-input v-model="ruleForm.value[1]"></el-input>
      </el-form-item>
      <el-form-item label="标签列表" v-if="ruleForm.type == 4" prop="value">
        <el-select
          v-model="ruleForm.value"
          multiple
          clearable
          filterable
          allow-create
          default-first-option
          :reserve-keyword="false"
          placeholder="请选择/输入标签"
        >
          <el-option
            v-for="item in insideValues"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- TODO notice -->
      <el-form-item label="驱动变量" prop="variable">
        <el-input v-model="ruleForm.variable"></el-input>
      </el-form-item>
      <el-form-item label="风险控制" prop="control">
        <el-switch
          v-model="ruleForm.control"
          active-color="#21b0f1"
          inactive-color="#f56c6c"
          active-text="通过"
          inactive-text="拒绝"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button v-if="dialogFlag == 'add'" @click="resetForm(ruleFormRef)"
          >重置</el-button
        >
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)"
          >确认</el-button
        ></el-form-item
      >
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onBeforeMount } from "vue";
import { Search } from "@element-plus/icons-vue";
import { getRuleList, addRule, updateRule, deleteRule } from "apis/rule.js";

const count = ref(0);

const query = reactive({
  name: "",
  type: null,
  page: 1,
  size: 10,
});

const ruleList = ref([]);

const getList = () => {
  getRuleList(query)
    .then((res) => {
      if (res.code == 200) {
        ruleList.value = res.data.ruleList;
        count.value = res.data.count;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const dialogVisible = ref(false);
const dialogFlag = ref("add");

const types = ref([
  {
    value: 0,
    label: "等于",
  },
  {
    value: 1,
    label: "大于",
  },
  {
    value: 2,
    label: "小于",
  },
  {
    value: 3,
    label: "区间(大于A，小于B)",
  },
  {
    value: 4,
    label: "属于",
  },
]);

const insideValues = [
  {
    value: "黄牛",
    label: "黄牛",
  },
  {
    value: "老赖",
    label: "老赖",
  },
];

const ruleForm = ref({
  name: "",
  description: "",
  type: 0,
  value: [""],
  variable: "",
  control: 0,
});

const ruleFormRef = ref(null);

const rules = reactive({
  name: [
    {
      required: true,
      message: "请输入规则名称",
      trigger: "blur",
    },
  ],
  description: [
    {
      required: true,
      message: "请输入规则描述",
      trigger: "blur",
    },
  ],
  type: [
    {
      required: true,
      message: "请选择决策类型",
      trigger: "blur",
    },
  ],
  value: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (
          ruleForm.value.type == 0 ||
          ruleForm.value.type == 1 ||
          ruleForm.value.type == 2
        ) {
          if (value[0] == "") {
            callback(new Error("请输入决策数值"));
          } else {
            callback();
          }
        } else {
          if (ruleForm.value.type == 3) {
            if (value.length < 2 || value[0] == "" || value[1] == "") {
              callback(new Error("请输入决策数值"));
            } else {
              callback();
            }
          } else {
            callback();
          }
        }
      },
      trigger: "blur",
    },
  ],
  variable: [
    {
      required: true,
      message: "请输入驱动变量",
      trigger: "blur",
    },
  ],
  control: [
    {
      required: true,
      message: "请选择风险控制",
      trigger: "blur",
    },
  ],
});

const add = () => {
  dialogVisible.value = true;
  dialogFlag.value = "add";
  delete ruleForm.value["id"];
};

const modify = (row) => {
  console.log(ruleForm.value);
  console.log(row);
  dialogVisible.value = true;
  dialogFlag.value = "modify";
  ruleForm.value = { ...row };
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};

const handleTypeChange = () => {
  ruleForm.value.value = [];
};

const submitForm = (formEl) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      if (dialogFlag.value == "add") {
        addRule(ruleForm.value)
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
        updateRule(ruleForm.value)
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
      resetForm(ruleFormRef.value);
    } else {
      return false;
    }
  });
};

const handleDelete = (index, invalid, list) => {
  deleteRule({ id: ruleList.value[index].id })
    .then((res) => {
      if (res.code == 200) {
        ruleList.value.splice(index, 1);
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
  /* width: 31%; */
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

.container {
  color: #ff4949;
}
</style>
