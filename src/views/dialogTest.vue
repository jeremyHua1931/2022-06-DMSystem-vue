<template>
  <h1>正文</h1>

  <el-dialog title="测试弹出框" v-model="show">

    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="80px">
      <!--      <el-form-item v-if="dialogFlag == 'modify'" label="ID" prop="id">-->
      <!--        <el-input v-model="ruleForm.id" disabled></el-input>-->
      <!--      </el-form-item>-->
      <el-form-item label="规则名称" prop="name">
        <el-input v-model="ruleForm.name">{{ruleForm.name}}</el-input>
<!--        <p>{{ruleForm.name}}</p>-->
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
        <el-button @click="resetForm(ruleFormRef)"
        >重置
        </el-button
        >
        <el-button @click="dialogVisible = false">取消</el-button>

        <el-button type="primary" @click="submitForm()"
        >确认
        </el-button
        >
      </el-form-item
      >
    </el-form>

  </el-dialog>

</template>

<script setup>

import {ref, reactive, onBeforeMount} from "vue";

const show = true

const ruleForm = ref({
  name: "测试",
  description: "",
  type: 0,
  value: [""],
  variable: "",
  control: 0,
});

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

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};

const submitForm = () => {
  show=false
  console.log(show)
};

</script>