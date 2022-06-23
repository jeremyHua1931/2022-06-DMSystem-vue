<template>
	<div class="toolbar">
	    <div>
			<el-button type="text" @click="ReturnTo">返回上一级</el-button>
	    </div>
		<div class="toolbar-right">
			<el-button @click="MkdirFormVisible = true" type="primary" plain>创建文件夹</el-button>
			<el-button @click="FileUpload" type="primary" plain>上传</el-button>
		</div>
	</div>
	<el-table :data="FileList" border style="width: 100%" highlight-current-row="true">
	<el-table-column label="文件名"> 
		<template #default="scope">
		<el-icon v-if="scope.row.ObjectType=='file'">
			<Document/>
		</el-icon>
		<el-icon v-else-if="scope.row.ObjectType=='directory'">
			<Folder/>
		</el-icon>
		<span style="margin-left: 10px  text-aligned=left" @dblclick="JumpTo(scope.row.Title)" show-overflow-tooltip="true"> {{scope.row.Title}} </span>
		</template>
		</el-table-column>
		<el-table-column label="日期">
		<template #default="scope">
		<span style="margin-left: 10px  text-aligned=left" @dblclick="JumpTo(scope.row.Title)" show-overflow-tooltip="true" > {{scope.row.ModifyDate}} </span>
		</template>
		</el-table-column>
		<el-table-column label="操作" fixed="right" width="220">
		<template #default="scope">
			<el-button size="small">批注</el-button>
			<el-divider direction="vertical"></el-divider>
			<!-- <el-button size="small" @click="EditTo(scope.row.Title)">编辑</el-button> -->
			<el-button size="small" @click="EditFormVisible = true;EditTo(scope.row.Title)">编辑</el-button>
			<el-divider direction="vertical"></el-divider>
			<!-- <el-button size="small" type="danger" @click=DeleTo(scope.row.Title)>删除</el-button> -->
			<el-button size="small" type="danger">删除</el-button>
		</template>
		</el-table-column>
	</el-table>
	<el-dialog  title="文件修改" v-model="EditFormVisible">
	   <el-form :model="EditForm">
	      <el-form-item label="操作" :label-width="formLabelWidth">
	        <el-select v-model="EditForm.OperationType" placeholder="请选择操作">
	          <el-option label="移动" value="move" />
	          <el-option label="复制" value="copy" />
	        </el-select>
	      </el-form-item>
		  <el-form-item label="目标路径" :label-width="formLabelWidth">
		    <el-input v-model="EditForm.DestinationPath" :placeholder="Paths.ThisPath"/>
		  </el-form-item>
	    </el-form>
	    <template #footer>
	      <span class="dialog-footer">
	        <el-button @click="EditFormVisible = false">取消</el-button>
	        <el-button type="primary" @click="EditFormVisible = false">确认</el-button>
	      </span>
	    </template>
	</el-dialog>
	<el-dialog  title="创建文件夹" v-model="MkdirFormVisible">
	   <el-form :model="EditForm">
		  <el-form-item label="新建文件夹名" :label-width="formLabelWidth">
		    <el-input v-model="MkdirForm.NewName" :placeholder="Paths.ThisPath"/>
		  </el-form-item>
	    </el-form>
	    <template #footer>
	      <span class="dialog-footer">
	        <el-button @click="MkdirFormVisible = false">取消</el-button>
	        <el-button type="primary" @click="MkdirFormVisible = false ">确认</el-button>
	      </span>
	    </template>
	</el-dialog>
	
</template>

<script setup>
import {ref, reactive, onBeforeMount, computed, watch} from "vue";
import {useRouter,useRoute} from "vue-router";
import {getFiles} from "../apis/file.js";

const router = useRouter();
const route = useRoute();
/* const TeamPaths = reactive({
	
}); */

const Paths = reactive({
	FormerPath:"",
	ThisPath:"/",
	JumpPath:"/",
	UserId:'',
	SourcePath:'',
	TimeStap:'',
	PlaceHolder:'',
})
const EditFormVisible=ref(false);
const MkdirFormVisible=ref(false);
const libraryid = "default";
const formLabelWidth = '140px';
const identity = '/person';

var FileList = ref([]);

const EditTo = function(RelPath){
	Paths.SourcePath = ((Paths.ThisPath != '/')? Paths.ThisPath +'/'+RelPath : Paths.ThisPath+RelPath);
};

const EditForm = reactive({
	SourcePath : Paths.SourcePath,
	DestinationPath :'',
	OperationType :'',
});

const MkdirForm = reactive({
	NewName :'', 
})

const getList = () => {
	var query = {
		  option: "list",
		  currentpath : Paths.ThisPath,
		  userid: Paths.UserId,
		  libraryid : libraryid,
		  identity : identity,
		  };
	  getFiles(query)
      .then((res) => {
        if (res.code == 0) {
		  console.log(query);
          console.log(res.data);
          console.log(res.msg);
          FileList.value = res.data;
        }
    })
    .catch((err) => {
        console.log(err);
        }
    );
};

const DeleTo = function(RelPath){
	var query = {
		option: "rm",
		source: ((Paths.ThisPath != '/')? Paths.ThisPath +'/'+RelPath : Paths.ThisPath+RelPath),
	};
	getFiles(query)
	  .then((res) => {
	    if (res.code == 0) {
		  console.log(query);
	      console.log(res.data);
	      console.log(res.msg);
	    }
	})
	.catch((err) => {
	    console.log(err);
	    }
	);
	FileList.value = Filelist.filter(function(item){
		return item.Title!== RelPath;
	})
}

const MkdirTo = function(){
	/* var query = {
		option: "mkdir",
		dest: Paths.ThisPath,
	};
	getFiles(query)
	  .then((res) => {
	    if (res.code == 0) {
		  console.log(query);
	      console.log(res.data);
	      console.log(res.msg);
	    }
	})
	.catch((err) => {
	    console.log(err);
	    }
	);
	FileList.push({}) */
	alert("MkdirTo函数");
}

const JumpTo = function(RelPath){
	Paths.FormerPath=Paths.ThisPath;
	Paths.JumpPath=((Paths.ThisPath!='/')? Paths.ThisPath+'/'+RelPath : Paths.ThisPath+RelPath);
	Paths.ThisPath=Paths.JumpPath;
	var query = {
		  option: "list",
		  currentpath : Paths.ThisPath,
		  userid: Paths.UserId,
		  libraryid : libraryid,
		  identity : identity,
		  };
	Paths.JumpPath='';
	getFiles(query)
	  .then((res) => {
	    if (res.code == 0) {
			console.log(query)
			console.log(res.data);
			console.log(res.msg);
			FileList.value = res.data;
	    }
	})
	.catch((err) => {
	    console.log(err);
	    }
	);
};
const getUser = function(){
	/* var MyUrl= window.location.search;
	console.log(MyUrl)
	Paths.UserId =new URLSearchParams(MyUrl).get('userid') */
	Paths.UserId = localStorage.getItem("userid");
};
const ReturnTo = function(){
	if(Paths.ThisPath!='/')
	{
		Paths.JumpPath=Paths.FormerPath
		Paths.ThisPath=Paths.JumpPath
		if(Paths.ThisPath=='/')
		{
			Paths.FormerPath=''
		}
		else{
			var TmpPath=FormerPath.value.split("/")
			var i = 0
			Paths.FormerPath=''
			while( i < TmpPath.length-2)
			{
				Paths.FormerPath = Paths.FormerPath  + TmpPath[i] + '/'
				i++
			}
			Paths.FormerPath += TmpPath[i]
		}
		var query = {
			  option: "list",
			  currentpath : Paths.ThisPath,
			  userid: Paths.UserId,
			  libraryid : libraryid,
			  identity : identity,
			  };
		getFiles(query)
		  .then((res) => {
			if (res.code == 0) {
			  console.log(query)
			  console.log(res.data);
			  console.log(res.msg);
			  FileList.value = res.data;
			}
		})
		.catch((err) => {
			console.log(err);
			}
		);
	}
	else
	{
		Paths.FormerPath='';
		router.push({
			path:'./TeamDocuments'
		})
	}
};
onBeforeMount(() => {
	getUser();
	getList();
});
</script>


<style type="text/css">
.toolbar {
  display: flex;
  position: relative;
  justify-content: space-between;
}
.toolbar-right {
  margin-top: 5px;
  margin-left: 20px;
  margin-bottom: 5px;
  text-align: left;
  margin-right: 30px;
}
.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>