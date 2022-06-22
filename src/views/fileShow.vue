<template>
	<div class="toolbar">
	    <div>
			<el-button type="text" @click="ReturnTo">返回上一级</el-button>
	    </div>
		<div class="toolbar-right">
			<el-button @click="MkdirTo" type="primary" plain>创建文件夹</el-button>
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
	<el-dialog  title="文件修改" v-model="EditFormVisible" :before-close="handleClose">
	   <el-form :model="EditForm">
	      <el-form-item label="操作" :label-width="formLabelWidth">
	        <el-select v-model="EditForm.OperationType" placeholder="请选择操作">
	          <el-option label="移动" value="move" />
	          <el-option label="复制" value="copy" />
	        </el-select>
	      </el-form-item>
		  <el-form-item label="目标路径" :label-width="formLabelWidth">
		    <el-input v-model="EditForm.DestinationPath" :placeholder="ThisPath"/>
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
		  <el-form-item label="文件夹名" :label-width="formLabelWidth">
		    <el-input v-model="MkdirForm.NewName" :placeholder="请输入新建文件夹名"/>
		  </el-form-item>
	    </el-form>
	    <template #footer>
	      <span class="dialog-footer">
	        <el-button @click="MkdirFormVisible = false">取消</el-button>
	        <el-button type="primary" @click="MkdirFormVisible = false">确认</el-button>
	      </span>
	    </template>
	</el-dialog>
	
</template>

<script setup>
import {ref, reactive, onBeforeMount, computed, watch} from "vue";
import {useRouter} from "vue-router";
import {getFiles} from "../apis/file.js";

var FormerPath="";
var ThisPath='/';
var JumpPath="/";
var userid = '';
var SourcePath = '';
var TimeStamp = '';
const EditFormVisible=ref(false);
const MkdirFormVisible=ref(false);
const libraryid = "default";
const router = useRouter();
const formLabelWidth = '140px';
const identity = '/person';

var FileList = ref([]);

const EditTo = function(ThisFile){
	SourcePath = ((ThisPath != '/')? ThisPath +'/'+ThisFile : ThisPath+ThisFile);
};

const EditForm = reactive({
	SourcePath : SourcePath,
	DestinationPath :'',
	OperationType :'',
});

const MkdirForm = reactive({
	NewName :'', 
})

const getList = () => {
	var query = {
		  option: "list",
		  currentpath : ThisPath,
		  userid: userid,
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
		source: ((ThisPath != '/')? ThisPath +'/'+ThisFile : ThisPath+ThisFile),
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
	FileList = Filelist.filter(function(item){
		return item.Title!== RelPath;
	})
}

const MkdirTo = function(){
	var query = {
		option: "mkdir",
		dest: ThisPath,
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
	FileList.push({})
}

const JumpTo = function(RelPath){
	FormerPath=ThisPath;
	JumpPath=((ThisPath!='/')? ThisPath+'/'+RelPath : ThisPath+RelPath);
	ThisPath=JumpPath
	var query = {
		  option: "list",
		  currentpath : ThisPath,
		  userid: userid,
		  libraryid : libraryid,
		  identity : identity,
		  };
	JumpPath='';
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
	alert(CurrentPath)
};
const getUser = function(){
	var MyUrl= window.location.search;
	console.log(MyUrl)
	userid =new URLSearchParams(MyUrl).get('userid')
};
const ReturnTo = function(){
	if(ThisPath!='/')
	{
		JumpPath=FormerPath
		ThisPath=JumpPath
		if(ThisPath=='/')
		{
			FormerPath=''
		}
		else{
			var TmpPath=FormerPath.split("/")
			var i = 0
			FormerPath=''
			while( i < TmpPath.length-2)
			{
				FormerPath = FormerPath  + TmpPath[i] + '/'
				i++
			}
			FormerPath += TmpPath[i]
		}
		var query = {
			  option: "list",
			  currentpath : ThisPath,
			  userid: userid,
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
		FormerPath=''
		alert("此目录已是根目录,无法返回")
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