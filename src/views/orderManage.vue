<template>
  <div class="orderList">
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="card-header">
          <h2>成交订单</h2>
          <el-input
            type="text"
            v-model.number="query.orderId"
            @keyup.enter.capture="getList"
            size="large"
            placeholder="请输入订单ID"
          />
          <el-select
            v-model="query.type"
            @change="getList"
            placeholder="请选择订单类型"
            size="large"
          >
            <el-option label="存款" :value="0"> </el-option>
            <el-option label="贷款" :value="1"> </el-option>
          </el-select>
          <el-input
            type="text"
            v-model="query.goodName"
            @keyup.enter.capture="getList"
            size="large"
            placeholder="请输入产品名称"
          />
          <el-date-picker
            v-model="timeRange"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetimerange"
            range-separator="-"
            start-placeholder="Start date"
            end-placeholder="End date"
            size="large"
          >
          </el-date-picker>
          <el-select
            v-model="query.status"
            @change="getList"
            placeholder="请选择订单状态"
            size="large"
          >
            <el-option label="请选择订单状态" value=""> </el-option>
            <el-option label="待付款" :value="0"> </el-option>
            <el-option label="已完成" :value="1"> </el-option>
            <el-option label="已退款" :value="2"> </el-option>
          </el-select>
        </div>
      </template>
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column prop="id" label="订单ID" width="" />
        <el-table-column prop="type" label="产品类型" width=""
          ><template #default="">
            <el-tag v-if="query.type == 0">存款</el-tag>
            <el-tag v-else type="warning">贷款</el-tag></template
          ></el-table-column
        >
        <el-table-column prop="username" label="用户名" width="" />
        <el-table-column prop="name" label="产品名称" width="" />
        <el-table-column prop="number" label="购买数量" width="" />
        <el-table-column prop="totalPrice" label="成交金额" width="" />
        <el-table-column prop="createTime" label="成交时间" width="" />
        <el-table-column prop="status" label="订单状态" width="">
          <template #default="scope">
            <el-tag v-if="scope.row.status == 0" type="warning">待支付</el-tag>
            <el-tag v-else-if="scope.row.status == 1" type="success">已完成</el-tag
            ><el-tag v-else type="danger">已退款</el-tag></template
          ></el-table-column
        >
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
    </el-card>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, reactive, watch } from "vue";
import { getOrderList } from "apis/good.js";
const query = reactive({
  type: 0,
  page: 1,
  size: 15,
  orderId: null,
  goodName: "",
  startTime: "",
  endTime: "",
  status: null,
});
const timeRange = ref("");
watch(
  () => timeRange.value,
  (value, pre) => {
    query.startTime = value?.[0];
    query.endTime = value?.[1];
    getList();
  }
);
const count = ref(0);
const orderList = ref([]);
const getList = () => {
  getOrderList(query)
    .then((res) => {
      if (res.code == 200) {
        count.value = res.data.count;
        orderList.value = res.data.orderList;
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
.card-header {
  display: flex;
  position: relative;
  justify-content: flex-start;
}
.orderList h2[data-v-62a1dca9] {
  width: 150px;
}
:deep(.el-input) {
  width: 200px;
  margin-right: 10px;
}
:deep(.el-range-editor--large.el-input__inner) {
  margin-right: 10px;
}
:deep([data-v-62a1dca9] .el-input) {
  width: 155px;
}
.card-header el .orderList {
  margin-bottom: 10px;
}
.orderList h2 {
  width: 300px;
  line-height: 40px;
  font-weight: 500;
  font-size: 18px;
}
.el-pagination {
  justify-content: center;
  margin-top: 5px;
}
</style>
