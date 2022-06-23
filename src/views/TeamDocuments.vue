<template>
  <div class="toolbar">
    <div class="toolbar-right">
      <el-button @click="dialogFormVisible = true" type="primary" plain>新建文献库</el-button>
    </div>
  </div>
  <div class="table">
    <el-table :data="libList" border style="width: 100%">
      <!-- <el-table-column prop="avatar" label="图片" width="65">
        <template #default="scope">
          <el-avatar :src="scope.row.image"></el-avatar></template
      ></el-table-column> -->
      <el-table-column align="center" prop="lib_id" label="文献库编号" width="" />
      <el-table-column align="center" prop="libname" label="文献库名称" width="" />
      <el-table-column align="center" prop="libteamid" label="文献库所属团队编号" width="" />
      <el-table-column align="center" prop="libteamname" label="文献库所属团队名称" width="" />
	  <el-table-column align="center" prop="libfilenumber" label="文献库文献数量" width="" />
      <el-table-column align="center" label="操作" fixed="right" width="180"><template #default="scope">
          <el-button size="small" @click="EnterTo()">进入文献库</el-button>
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
  </div>
  
  
  <el-dialog v-model="dialogFormVisible" title="新建文献库">
      <el-form :model="lib">
        <el-form-item label="请输入新建文献库名字:" :label-width="formLabelWidth">
          <el-input v-model="lib.name" autocomplete="off" />
        </el-form-item>
        
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="create_lib()"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>
  
</template>

<script setup>
import { ref, reactive, onBeforeMount, computed } from "vue";
import { useRouter } from "vue-router";
import { Search } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import { makelib , getlib } from "../apis/teamdocuments.js";



const router = useRouter();
const teamid = router.currentRoute.value.query["teamid"];
const dialogFormVisible = ref(false);
console.log("teamid为：",teamid)
const lib = reactive({
	name:'',
})

const open1 = () => {
  ElMessage({
    showClose: true,
    message: 'Oops！新建文献库失败，请稍后再试',
    type: 'error',
  })
};

const open2 = () => {
  ElMessage({
    showClose: true,
    message: '您已新建文献库，请刷新页面查看',
    type: 'success',
  })
}


const count = ref(0);

const libList = ref([]);


const EnterTo = () => {
  // router.push({
  //   path: "/depositRelease",
  //   query: { isModify: true, id: row.id },
  // });
  //alert("进入该文献库页面");
	router.push({
	  path:"/TeamFileShow",
	 query:{
		  //"option": "list",
		  //"currentpath": "/",
		  "userid": "1",
		  //"libraryid": "default",
		  //"identity": "/person"
	  }, 
	})
};








const create_lib = () => {
 dialogFormVisible.value = false;
		const post_create_lib = {
			userid:localStorage.getItem("userid"),
			teamid:teamid,
			libname:lib.name,
		};
		console.log("!@!@@!@",post_create_lib);
		makelib(post_create_lib)
		  .then((res) => {
		    if (res.code == 0) {
				open2();
				
		    }
		  })
		  .catch((err) => {
		 open1();
			
		  });
		
};




const getList = () => {

const post_get_lib = {
	teamid:teamid,
};

  getlib(post_get_lib)
    .then((res) => {
      if (res.code == 0) {
        libList.value = res.data;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};




// //TODO: 新增文献库
// const add = () => {
//   // router.push("/depositRelease");
//   alert("新建文献库")
// };

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
