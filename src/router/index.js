import { createRouter, createWebHistory } from "vue-router";
import { getToken } from "utils/auth";

const routes = [
  // { path: "/login", component: () => import("views/login.vue") },
  {
    path: "/",
    name: "index",
    component: () => import("views/layout.vue"),
    redirect: "/UserDocuments",
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
			path: "/fileShow",
			name: "fileShow",
			component: () => import("views/fileShow.vue"),
			meta: {
				title: "文件展示",
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
	    path: "/TeamManagement",
	    name: "TeamManagement",
	    component: () => import("views/TeamManagement.vue"),
	    meta: {
	      title: "团队管理界面",
	    },
	  },
		{
			path: "/personalInfo",
			name: "personalInfo",
			component: () => import("views/personalInfo.vue"),
			meta: {
				title: "个人信息管理",
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
  history: createWebHistory(''),
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
