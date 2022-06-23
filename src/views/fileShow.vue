<template>
	<div class="toolbar">
	    <div>
			<el-button type="text" @click="ReturnTo">返回上一级</el-button>
	    </div>
		<div class="toolbar-right">
			<el-button @click="MkdirFormVisible = true" type="primary" plain>创建文件夹</el-button>
			<el-button @click="UploadFormVisible = true" type="primary" plain>上传</el-button>
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
		<span style="margin-left: 10px  text-aligned=left" @dblclick="JumpTo(scope.row.Title)" show-overflow-tooltip="true">{{scope.row.ModifyDate}}</span>
		</template>
		</el-table-column>
		<el-table-column label="操作" fixed="right" width="280">
  		<template #default="scope">
			<el-button size="small" @click='ShareTo(scope.row.fileid)'>分享</el-button>
			<el-divider direction="vertical"></el-divider>
			<el-button size="small" @click="PatchTo(scope.row.fileid)">批注</el-button>
			<el-divider direction="vertical"></el-divider>
			<el-button size="small" @click="EditFormVisible = true;EditTo(scope.row.Title,scope.row.ObjectType,scope.row.fileid)">编辑</el-button>
			<el-divider direction="vertical"></el-divider>
			<el-popconfirm
			  confirm-button-text="确认"
			  cancel-button-text="取消"
			  icon="el-icon-info"
			  icon-color="red"
			  title="确认删除？"
			  @confirm="DeleTo(scope.row.Title)">
			  <template #reference>
			    <el-button size="small" type="danger">删除</el-button>
			  </template>
			</el-popconfirm>
		</template>
		</el-table-column>
	</el-table>
	<el-dialog  title="文件修改" v-model="EditFormVisible">
	   <el-form :model="EditForm">
	      <el-form-item label="操作" :label-width="formLabelWidth">
	        <el-select v-model="EditForm.OperationType" placeholder="请选择操作">
				<el-option label="重命名" value="rename" />
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
	        <el-button type="primary" @click="EditFormVisible = false;EditConfirm()">确认</el-button>
	      </span>
	    </template>
	</el-dialog>
	<el-dialog  title="创建文件夹 文本框内为当前文件夹路径" v-model="MkdirFormVisible">
	   <el-form :model="MkdirForm">
		  <el-form-item label="新建文件夹名:" :label-width="formLabelWidth">
		    <el-input v-model="MkdirForm.NewName" :placeholder="Paths.ThisPath"/>
		  </el-form-item>
	    </el-form>
	    <template #footer>
	      <span class="dialog-footer">
	        <el-button @click="MkdirFormVisible = false">取消</el-button>
	        <el-button type="primary" @click="MkdirFormVisible = false; ; MkdirConfirm()">确认</el-button>
	      </span>
	    </template>
	</el-dialog>
	<el-dialog title="上传文件" v-model="UploadFormVisible">
		<p> 选择文件:<input id="upload_file" type="file" name="files">
		        <input type="button" value="提交" @click="uploadFile()" id="upload"> </p>
		<p> 请上传PDF文件,文件体积小于100M</p>
	</el-dialog>
	<el-dialog title="分享" v-model="ShareVisible">
		<p>直接分享链接 : {{ShareUrl}}</p><br>
		<p>登录分享链接 : {{ShareUrl2}}</p>
	</el-dialog>
</template>

<script setup>
import {ref, reactive, onBeforeMount, computed, watch} from "vue";
import {useRouter,useRoute} from "vue-router";
import {getFiles} from "../apis/file.js";
import {baseURL} from "../utils/request.js";
import axios from "axios";

/* var localurl = window.location.href;
var userid = localurl.split("?userid=")[1];
const Instance = getCurrentInstance();
const { appContext : { config: { globalProperties } } } = getCurrentInstance();
globalProperties.$userid = userid; */

const Paths = reactive({
	FormerPath:"",
	ThisPath:"/",
	JumpPath:"/",
	UserId:'1',
	SourcePath:'',
	TimeStap:'',
	PlaceHolder:'',
	PrePath:"/person/",
})
const EditFormVisible=ref(false);
const MkdirFormVisible=ref(false);
const UploadFormVisible=ref(false);
const ShareVisible=ref(false);
const libraryid = "0";
const router = useRouter();
const formLabelWidth = '140px';
const identity = '/person';
var FileList = ref([]);
var ShareUrl = ref("");
var ShareUrl2 = ref("");
var TimeStamp = ref("");
localStorage.setItem("userid","1")

const ShareTo = function(pdfid){
	ShareVisible.value=true;
	ShareUrl.value = baseURL + "&&pdfid = " + pdfid + "?ownerid=" + Paths.UserId +"&&type=normal";
	ShareUrl2.value = baseURL + "&&pdfid = " + pdfid + "?ownerid=" + Paths.UserId +"&&type=indirecShare";
}
const PatchTo = function(pdfid){
	window.location.href="/index.html?"+"pdfid="+pdfid+"&&ownerid="+Paths.UserId+"&&type=normal";
}

const getList = () => {
	var query = {
		  option: "list",
		  currentpath : Paths.PrePath+Paths.UserId+"/"+libraryid+Paths.ThisPath,
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
		else if(res.code == 500){
			alert("操作失败")
		}
    })
    .catch((err) => {
        console.log(err);
        }
    );
};
const JumpTo = function(RelPath){
	Paths.FormerPath=Paths.ThisPath;
	Paths.JumpPath=((Paths.ThisPath!='/')? Paths.ThisPath+'/'+RelPath : Paths.ThisPath+RelPath);
	Paths.ThisPath=Paths.JumpPath;
	var query = {
		  option: "list",
		  currentpath : Paths.PrePath+Paths.UserId+"/"+libraryid+Paths.ThisPath,
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
			var TmpPath=Paths.FormerPath.split("/")
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
			  currentpath : Paths.PrePath+Paths.UserId+"/"+libraryid+Paths.ThisPath,
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
			else if(res.code == 500){
				alert("操作失败")
			}
		})
		.catch((err) => {
			console.log(err);
			}
		);
	}
	else
	{
		Paths.FormerPath=''
		alert("此目录已是根目录,无法返回")
	}
};
const getUser = function(){

	Paths.UserId = localStorage.getItem("userid");
};

const DeleTo = function(RelPath,pdfid){
	var query = {
		option: "rm",
		source: Paths.PrePath+Paths.UserId+"/"+libraryid+((Paths.ThisPath != '/')? Paths.ThisPath +'/'+RelPath : Paths.ThisPath+RelPath),
	};
	getFiles(query)
	  .then((res) => {
	    if (res.code == 0) {
		  console.log(query);
	      console.log(res.data);
	      console.log(res.msg);
        getList();
	    }
		else if(res.code == 500){
			alert("操作失败")
		}
	})
	.catch((err) => {
	    console.log(err);
	    }
	);

};


const EditForm = reactive({
	SourcePath : Paths.SourcePath,
	DestinationPath :'',
	OperationType :'',
	ObjectType:'',
	PdfId:'',
	EditTitle:'',
});
const EditTo = function(RelPath,type,pdfid){
	EditForm.EditTitle=RelPath;
	Paths.SourcePath = ((Paths.ThisPath != '/')? Paths.ThisPath +'/'+RelPath : Paths.ThisPath+RelPath);
	EditForm.ObjectType = type;
	EditForm.PdfId = pdfid;
};
const EditConfirm = function(){
	switch(EditForm.OperationType)
	{
		case "move": 
		if(EditForm.ObjectType=="directory"){
			alert("非法操作,不允许移动文件夹");
		}
		else{
			MoveTo();
		}
		break;
		case "rename": 
		if(EditForm.ObjectType=="directory"){
			alert("非法操作,不允许重命名文件夹");
		}
		else{
			RenameTo();
		}
		break;
		case "copy": 
		if(EditForm.ObjectType=="directory"){
			alert("非法操作,不允许复制文件夹");
		}
		else{
			CopyTo();
		};
		break;
		default: alert("请选择操作") ;
	}
};

const RenameTo = function(){
	console.log(Paths.SourcePath)
	var query = {
		option: "rename",
		source:  Paths.PrePath+Paths.UserId+"/"+libraryid+Paths.SourcePath,
		dest: Paths.PrePath+Paths.UserId+"/"+libraryid+EditForm.DestinationPath,
		type: EditForm.ObjectType,
	};
	getFiles(query)
	  .then((res) => {
	    if (res.code == 0) {
		  console.log(query);
	      console.log(res.data);
	      console.log(res.msg);
	    }
		else if(res.code == 500){
			alert("操作失败")
		}
	})
	.catch((err) => {
	    console.log(err);
	    }
	);
	var query = {
		  option: "list",
		  currentpath : Paths.PrePath+Paths.UserId+"/"+libraryid+Paths.ThisPath,
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
		else if(res.code == 500){
			alert("操作失败")
		}
	})
	.catch((err) => {
	    console.log(err);
	    }
	);
}
const MoveTo = function(){
	var query = {
		  option: "mv",
		  dest :  Paths.PrePath+Paths.UserId+"/"+libraryid+EditForm.DestinationPath+"/"+EditForm.EditTitle,
		  source: Paths.PrePath+Paths.UserId+"/"+libraryid+Paths.SourcePath,
		  pdfid : EditForm.PdfId,
		  ownerid : Paths.UserId,
		  identity : identity,
		  };
	  getFiles(query)
	  .then((res) => {
	    if (res.code == 0) {
		  console.log(query);
	      console.log(res.data);
	      console.log(res.msg);
	    }
		else if(res.code == 500){
			alert("操作失败")
		}
	})
	.catch((err) => {
	    console.log(err);
	    }
	);
	getList();
};
const CopyTo = function(){
	if(EditForm.DestinationPath==EditForm.SourcePath)
	{
		alert("源路径与目标路径不能相同!");
	}
	else{
	var query = {
		  option: "copy",
		  dest : Paths.PrePath+Paths.UserId+"/"+libraryid + EditForm.DestinationPath + "/" +EditForm.EditTitle,
		  source: Paths.PrePath+Paths.UserId+"/"+libraryid + Paths.SourcePath,
		  pdfid : EditForm.PdfId,
		  };
	  getFiles(query)
	  .then((res) => {
	    if (res.code == 0) {
		  console.log(query);
	      console.log(res.data);
	      console.log(res.msg);
	    }
		else if(res.code == 500){
			alert("操作失败")
		}
	})
	.catch((err) => {
	    console.log(err);
	    }
	);
	var query = {
		  option: "list",
		  currentpath : Paths.PrePath+Paths.UserId+"/"+libraryid+Paths.ThisPath,
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
		else if(res.code == 500){
			alert("操作失败")
		}
	})
	.catch((err) => {
	    console.log(err);
	    }
	);
}
}

const MkdirForm = reactive({
	NewName :'', 
});
const MkdirConfirm = function(){
	MkdirTo();
};
const MkdirTo = function(){
	if(MkdirForm.NewName[0]!="/"){
		alert("目标目录必须以/开始")
	}
	else{
	var query = {
		option: "mkdir",
		dest: Paths.PrePath+Paths.UserId+"/"+libraryid + MkdirForm.NewName,
		identity: identity,
		ownerid:Paths.UserId,
	};
	getFiles(query)
	  .then((res) => {
	    if (res.code == 0) {
		  console.log(query);
	      console.log(res.data);
	      console.log(res.msg);
	    }
		else if(res.code == 500){
			alert("操作失败")
		}
	})
	.catch((err) => {
	    console.log(err);
	    }
	);
	getList();
}
}

const UploadForm = reactive({
	Source :'',
	destination : "",
});
const UploadConfirm = function()
{
	alert("UploadTo函数");
	uploadFile()();
};

const uploadFile= function(){
  console.log("start")
  let formData = new FormData();
  formData.append("file", document.getElementById('upload_file').files[0]);
  let obj = {};
  obj.info = "附属信息";//用户名
  let data = JSON.stringify(obj);
  formData.append("path",Paths.PrePath+Paths.UserId+"/"+libraryid+Paths.ThisPath);
  axios.post("http://192.168.238.1:8082/receivefile", formData)
      .then(function (response) {
        console.log(response);
        getList();
		alert(response.data.msg);
      })
  getList()
};

onBeforeMount(() => {
  console.log("开始设置userid")
  localStorage.setItem("userid","1")
  console.log("开始打印userid  ", localStorage.getItem("userid"))
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