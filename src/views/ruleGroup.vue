<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <input
        type="text"
        v-model="query.name"
        @keyup.enter.capture="getList"
        placeholder="请输入规则名称"
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
    <el-table :data="ruleGroupList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="" />
      <el-table-column prop="name" label="组合名称" width="" />
      <el-table-column prop="description" label="描述" width="" />
      <el-table-column label="规则" width=""
        ><template #default="scope">
          <ul>
            <li v-for="(rule, index) in scope.row.ruleList" :key="index">
              <el-popover
                :width="500"
                placement="left"
                popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
              >
                <template #reference>{{ rule.name }} </template>
                <template #default>
                  <el-descriptions
                    :title="rule.name"
                    direction="vertical"
                    :column="3"
                    border
                  >
                    <el-descriptions-item label="决策类型">
                      <span v-if="rule.type == 0">等于</span>
                      <span v-else-if="rule.type == 1">大于</span>
                      <span v-else-if="rule.type == 2">小于</span>
                      <span v-else-if="rule.type == 3">大于A，小于B</span>
                      <span v-else>属于</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="决策数值">{{
                      rule.value
                    }}</el-descriptions-item>
                    <el-descriptions-item label="驱动变量">{{
                      rule.variable
                    }}</el-descriptions-item>
                    <el-descriptions-item label="风险控制">
                      <el-tag v-if="rule.control" type="success">通过</el-tag>
                      <el-tag v-else type="danger">拒绝</el-tag></el-descriptions-item
                    >
                    <el-descriptions-item label="规制描述">{{
                      rule.description
                    }}</el-descriptions-item>
                  </el-descriptions>
                </template>
              </el-popover>
            </li>
          </ul>
        </template></el-table-column
      >
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
  <el-dialog title="新建规则组合" v-model="dialogVisible">
    <el-form
      ref="ruleGroupFormRef"
      :model="ruleGroupForm"
      :rules="formRule"
      label-width="80px"
    >
      <el-form-item v-if="dialogFlag == 'modify'" label="ID" prop="id">
        <el-input v-model="ruleGroupForm.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="组合名称" prop="name">
        <el-input v-model="ruleGroupForm.name"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="ruleGroupForm.description"></el-input>
      </el-form-item>
      <el-form-item label="规则" prop="type">
        <el-transfer
          v-model="rightValue"
          style="text-align: left; display: inline-block"
          filterable
          :titles="['规制列表', '已选择']"
          :button-texts="['移除', '添加']"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}',
          }"
          :data="ruleOptions"
        >
          <template #default="{ option }">
            <span>{{ option.key }} - {{ option.label }}</span>
          </template>
          <!-- <template #left-footer>
            <el-button class="transfer-footer" size="small">规则组合</el-button>
          </template> -->
        </el-transfer>
      </el-form-item>
      <el-form-item>
        <el-button v-if="dialogFlag == 'add'" @click="resetForm(ruleGroupFormRef)"
          >重置</el-button
        >
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleGroupFormRef)"
          >确认</el-button
        ></el-form-item
      >
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onBeforeMount } from "vue";
import { Search } from "@element-plus/icons-vue";
import {
  getRuleGroupList,
  getRuleList,
  addRuleGroup,
  updateRuleGroup,
  deleteRuleGroup,
} from "apis/rule.js";

const count = ref(0);

const query = reactive({
  name: "",
  page: 1,
  size: 10,
});

const ruleGroupList = ref([]);

const getList = () => {
  getRuleGroupList(query)
    .then((res) => {
      if (res.code == 200) {
        ruleGroupList.value = res.data.ruleGroupList;
        // ruleGroupList.value.forEach((item) => {
        //   console.log(item.ruleList);
        //   //   item.ruleList = JSON.parse(item.ruleList);
        // });
        count.value = res.data.count;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const dialogVisible = ref(false);
const dialogFlag = ref("add");

const ruleOptions = ref([]);
const initRuleOptions = () => {
  getRuleList({
    name: "",
    type: null,
    page: 1,
    size: 100000,
  })
    .then((res) => {
      if (res.code == 200) {
        for (let index = 0; index < res.data.ruleList.length; index++) {
          const element = res.data.ruleList[index];
          ruleOptions.value.push({
            key: index,
            label: element.name,
            id: element.id,
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const leftValue = ref([]);
const rightValue = ref([]);

const ruleGroupForm = ref({
  name: "",
  description: "",
  ruleList: [],
});

const ruleGroupFormRef = ref(null);

const formRule = reactive({
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
  value: [
    {
      required: true,
      validator: (ruleGroup, value, callback) => {
        if (value.length == 0) {
          callback(new Error("至少选择一项规则"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
});

const add = () => {
  dialogVisible.value = true;
  dialogFlag.value = "add";
  delete ruleGroupForm.value["id"];
  ruleGroupForm.value = {
    name: "",
    description: "",
    ruleList: [],
  };
  leftValue.value = [];
  rightValue.value = [];
};

const modify = (row) => {
  dialogVisible.value = true;
  dialogFlag.value = "modify";
  leftValue.value = [];
  rightValue.value = [];
  ruleGroupForm.value = row;
  for (let index = 0; index < row.ruleList.length; index++) {
    const rule = row.ruleList[index];
    for (let j = 0; j < ruleOptions.value.length; j++) {
      const element = ruleOptions.value[j];
      if (rule.id == element.id) {
        rightValue.value.push(j);
        break;
      }
    }
  }
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  ruleGroupForm.value = {
    name: "",
    description: "",
    ruleList: [],
  };
  leftValue.value = [];
  rightValue.value = [];
};

const submitForm = (formEl) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      ruleGroupForm.value.ruleList = [];
      for (let index = 0; index < rightValue.value.length; index++) {
        const element = ruleOptions.value[index];
        ruleGroupForm.value.ruleList.push(element.id);
      }
      if (dialogFlag.value == "add") {
        addRuleGroup(ruleGroupForm.value)
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
        updateRuleGroup(ruleGroupForm.value)
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
      resetForm(ruleGroupFormRef.value);
    } else {
      return false;
    }
  });
};

const handleDelete = (index, invalid, list) => {
  deleteRuleGroup({ id: ruleGroupList.value[index].id })
    .then((res) => {
      if (res.code == 200) {
        ruleGroupList.value.splice(index, 1);
        ElMessage.success(res.msg);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

onBeforeMount(() => {
  getList();
  initRuleOptions();
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
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  border-radius: 6px;
}
.toolbar-right {
  margin-right: 30px;
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
  /* width: 70%; */
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
ul {
  list-style: none;
}
</style>
