import { createRouter, createWebHistory } from "vue-router";
import { getToken } from "utils/auth";

const routes = [
  { path: "/login", component: () => import("views/login.vue") },
  {
    path: "/",
    name: "index",
    component: () => import("views/layout.vue"),
    redirect: "/dashboard",
    children: [
		
		{
		  path: "/UserDocuments",
		  name: "UserDocuments",
		  component: () => import("views/UserDocuments.vue"),
		  meta: {
		    title: "用户文献库",
		  },
		},
		{
		  path: "/TeamList",
		  name: "TeamList",
		  component: () => import("views/TeamList.vue"),
		  meta: {
		    title: "团队列表",
		  },
		},
		{
		  path: "/TeamDocuments",
		  name: "TeamDocuments",
		  component: () => import("views/TeamDocuments.vue"),
		  meta: {
		    title: "团队文献库",
		  },
		},
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("views/dashboard/index.vue"),
        meta: {
          title: "仪表盘",
        },
      },
      {
        path: "/orderManage",
        name: "orderManage",
        component: () => import("views/orderManage.vue"),
        meta: {
          title: "订单管理",
        },
      },
      {
        path: "/depositList",
        name: "depositList",
        component: () => import("views/depositList.vue"),
        meta: {
          title: "存款列表",
        },
      },
      {
        path: "/depositDetail",
        name: "depositDetail",
        component: () => import("views/depositDetail/index.vue"),
        meta: {
          title: "存款详情",
        },
      },
      {
        path: "/depositRelease",
        name: "depositRelease",
        component: () => import("views/depositRelease/index.vue"),
        meta: {
          title: "存款发布",
        },
      },
      {
        path: "/loanList",
        name: "loanList",
        component: () => import("views/loanList.vue"),
        meta: {
          title: "贷款列表",
        },
      },
      {
        path: "/loanRelease",
        name: "loanRelease",
        component: () => import("views/loanRelease/index.vue"),
        meta: {
          title: "贷款发布",
        },
      },
      {
        path: "/loanDetail",
        name: "loanDetail",
        component: () => import("views/loanDetail/index.vue"),
        meta: {
          title: "贷款详情",
        },
      },
      {
        path: "/ruleList",
        name: "ruleList",
        component: () => import("views/ruleList.vue"),
        meta: {
          title: "规则列表",
        },
      },
      {
        path: "/ruleGroup",
        name: "ruleGroup",
        component: () => import("views/ruleGroup.vue"),
        meta: {
          title: "规则组合",
        },
      },
      {
        path: "/customerList",
        name: "customerList",
        component: () => import("views/customerList.vue"),
        meta: {
          title: "客户列表",
        },
      },
      {
        path: "/adminList",
        name: "adminList",
        component: () => import("views/adminList.vue"),
        meta: {
          title: "管理员列表",
        },
      },
	  {
	    path: "/TeamManagement",
	    name: "TeamManagement",
	    component: () => import("views/TeamManagement.vue"),
	    meta: {
	      title: "团队管理界面",
	    },
	  },
    ],
  },
  {
    path: "/404",
    name: "404",
    component: () => import("views/404.vue"),
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/404",
  },
  
];

const router = createRouter({
  history: createWebHistory('/admin'),
  routes,
});

// router.beforeEach(async (to, from, next) => {
//   if (to.path !== "/login" && !getToken()) {
//     next({
//       path: "/login",
//     });
//   } else {
//     next();
//   }
// });

export default router;
