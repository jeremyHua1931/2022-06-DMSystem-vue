<template>
  <el-container class="container">
    <el-aside class="aside" width="200px">
      <el-scrollbar>
        <div :class="[{ logoCollapse: isCollapse }, { logoNoCollapse: !isCollapse }]">
          <el-avatar
              src="https://xzj-pic-1306183757.cos.ap-nanjing.myqcloud.com/picgo/摘月白底.jpg"
              :size="38"
              alt="HY-12小组"
          >
          </el-avatar>

          <h1 v-show="!isCollapse">HY-12小组</h1>
        </div>
        <el-menu
            :default-active="active"
            unique-opened
            text-color="#fff"
            active-text-color="#fff"
            router
            mode="vertical"
            :collapse="isCollapse"
        >
          <!-- <el-menu
          :default-active="active"
          unique-opened
          router
          mode="vertical"
          :collapse="isCollapse"
          class="el-menu-vertical-demo"
        > -->
          <el-menu-item index="userdocuments" route="/UserDocuments">
            <el-icon>
              <odometer/>
            </el-icon>
            <template #title>个人模块</template>
          </el-menu-item>
          <el-sub-menu index="team_management">
            <template #title>
              <el-icon>
                <user/>
              </el-icon>
              <span>团队模块</span>
            </template>
            <el-menu-item index="teamdocuments" route="/TeamDocuments">团队文献库</el-menu-item>
            <el-menu-item index="teamlist" route="/TeamList">团队列表</el-menu-item>

          </el-sub-menu>

          <el-menu-item index="fileShow" route="/fileShow">
            <el-icon>
              <Tickets/>
            </el-icon>
            <template #title>层级页面展示</template>
          </el-menu-item>


          <!-- <el-menu-item index="dashboard" route="/dashboard">
            <el-icon><odometer /></el-icon>
            <template #title>仪表盘</template>
          </el-menu-item>
          <el-menu-item index="orderManage" route="/orderManage">
            <el-icon><tickets /></el-icon>
            <template #title>订单管理</template>
          </el-menu-item>
          <el-sub-menu index="3">
            <template #title>
              <el-icon><wallet /></el-icon>
              <span>存款秒杀</span>
            </template>
            <el-menu-item index="depositList" route="/depositList">存款列表</el-menu-item>
            <el-menu-item index="depositRelease" route="/depositRelease"
              >存款发布</el-menu-item
            >
          </el-sub-menu>
          <el-sub-menu style="sub-menu" index="4">
            <template #title>
              <el-icon><credit-card /></el-icon>
              <span>贷款产品</span>
            </template>
            <el-menu-item index="loanList" route="/loanList">贷款列表</el-menu-item>
            <el-menu-item index="loanRelease" route="/loanRelease">贷款发布</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="5">
            <template #title>
              <el-icon><finished /></el-icon>
              <span>决策引擎</span>
            </template>
            <el-menu-item index="ruleList" route="/ruleList">规则列表</el-menu-item>
            <el-menu-item index="ruleGroup" route="/ruleGroup">规则组合</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="6">
            <template #title>
              <el-icon><user /></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="customerList" route="/customerList"
              >客户列表</el-menu-item
            >
            <el-menu-item index="adminList" route="/adminList">管理员列表</el-menu-item>
          </el-sub-menu> -->
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-main>
      <el-header>
        <div class="left">
          <el-icon color="#fff" v-show="!isCollapse" @click="isCollapse = true"
          >
            <fold
            />
          </el-icon>
          <el-icon color="#fff" v-show="isCollapse" @click="isCollapse = false"
          >
            <expand
            />
          </el-icon>
          <h2>{{ routeMetaName }}</h2>
        </div>
        <div class="right">
          <el-dropdown>
            <div class="usr">
              <el-icon @click="handleRefresh">
                <refresh/>
              </el-icon>
              <el-avatar :size="31" :src="userInfo.avatar"></el-avatar>
              <span>{{ userInfo.username }}</span>
              <el-icon color="#6a748b" :size="14">
                <arrow-down/>
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="loginout"
                >
                  <el-icon>
                    <switch-button/>
                  </el-icon
                  >
                  <span>退出登录</span></el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <div class="routerView">
        <router-view></router-view>
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

import {
  Odometer,
  Tickets,
  Wallet,
  CreditCard,
  Finished,
  User,
  Fold,
  Refresh,
  Expand,
  ArrowDown,
  SwitchButton,
} from "@element-plus/icons-vue";
// import {getAdminInfo} from "apis/admin.js";
// import {removeToken} from "utils/auth.js";


const route = useRoute();
const router = useRouter();

const active = ref("dashboard");
const routeMetaName = ref("仪表盘");

watch(route, () => {
  active.value = route.name;
  routeMetaName.value = route.meta.title;
});

const isCollapse = ref(false);
const userInfo = ref({
  name: "",
  idCard: "",
  username: "管理员",
  avatar: "https://xzj-pic-1306183757.cos.ap-nanjing.myqcloud.com/picgo/摘月蓝底.jpg",
  phone: "",
});

// const loginout = () => {
//   removeToken();
//   router.go();
// };
const handleRefresh = () => {
  router.go();
};

// onMounted(() => {
//   active.value = route.name;
//   getAdminInfo()
//       .then((res) => {
//         if (res.code == 200) {
//           userInfo.value = res.data;
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
// });
</script>

<style scoped>
.container {
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
}

::-webkit-scrollbar {
  display: none;
}

.aside {
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  background-color: #001529;
}

aside.el-aside.aside {
  width: auto;
}

.logoCollapse {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 4px 0px 10px 0;
}

.logoNoCollapse {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 4px 0px 10px 16px;
}

.logoNoCollapse h1 {
  font-size: 20px;
  font-weight: 500;
  color: #fff;
  text-align: center;
  margin: 20px 27px 20px 13px;
}

.el-main {
  background-color: #f9f9f9;
}

.avatar-container {
  margin-bottom: 20px;
  text-align: center;
}

.user {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 16px;
}

i.el-icon {
  margin-right: 10px;
}

.user i {
  font-size: 14px;
  cursor: pointer;
}

.el-menu {
  border-right: 0;
  height: 100%;
  background-color: #001529;
}

.el-menu-item {
  background-color: #001529;
}

.el-menu-item:hover,
:deep(.el-menu-item:active) {
  background-color: #0960bd !important;
}

:deep(.el-sub-menu:hover) {
  background-color: #0c2135 !important;
}

:deep(.el-sub-menu__title:hover) {
  background-color: #0c2135 !important;
}

.el-menu-item.is-active {
  background-color: #0960bd !important;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

main.el-main {
  padding: 0px 0px;
}

:deep(header.el-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  height: 42px;
  margin-bottom: 15px;
}

header.el-header .left {
  display: flex;
  align-items: center;
}

header.el-header i.el-icon[data-v-8a54e678] {
  cursor: pointer;
}

header.el-header .right {
  display: flex;
  align-items: center;
}

header.el-header .right .usr {
  display: flex;
  align-items: center;
  margin-right: 4px;
}

span.el-avatar.el-avatar--circle {
  margin: 0 6px;
  font-size: 16px;
}

header.el-header .right .usr span {
  margin: 0 6px;
  font-size: 16px;
}

header.el-header i.el-icon {
  color: #6a748b;
  font-size: 21px;
}

header.el-header h2 {
  font-size: 16px;
  font-weight: 500;
  color: #6a748b;
  margin-left: 10px;
}

.routerView {
  padding: 0px 15px;
}
</style>
