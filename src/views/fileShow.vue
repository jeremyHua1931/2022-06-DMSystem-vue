<template>
  <p>测试</p>
</template>
<script>
//http:/file?userid=1

import {ref, reactive, onBeforeMount, computed} from "vue";
import {useRouter} from "vue-router";
import {getFiles } from "../apis/file.js";

const userid = '1';

const query = reactive({
  userid: userid,
});
const router = useRouter();

const getList = () => {
  console.log("开始post")
  getFiles(query)
      .then((res) => {
        if (res.code === 0) {
          console.log(res.data);
          console.log(res.msg);
        }
      })
      .catch((err) => {
            console.log(err);
          }
      );
};
onBeforeMount(() => {

  getList();
});
</script>

