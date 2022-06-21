<template>
  <div class="background">
    <div class="contain">
      <h2>摘月 admin</h2>
      <form @submit.prevent="void 0">
        <div class="item">
          <input type="text" v-model="loginForm.username" required />
          <lable for="">用户名</lable>
        </div>
        <div class="item">
          <input type="password" v-model="loginForm.password" required />
          <lable for="">密码</lable>
        </div>
        <button class="btn" @click="submitForm">登录</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { login } from "apis/admin.js";
import { setToken } from "@/utils/auth";
const router = useRouter();
const loginForm = reactive({
  username: "",
  password: "",
});

const submitForm = () => {
  if (loginForm.username !== "" && loginForm.password !== "") {
    login(loginForm)
      .then((res) => {
        if (res.code == 200) {
          ElMessage.success({
            message: res.msg,
          });
          setToken(res.data.token);
          router.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
</script>

<style scoped>
.background {
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  font-size: 16px;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(107deg, #063dbc, #275ec9, #347fd6, #38a1e3);
}
.contain {
  width: 340px;
  height: 280px;
  background: rgb(255, 255, 255);
  box-shadow: 0 0 1px 0 #aaa;
  padding: 35px;
  border-radius: 6px;
}
h2 {
  font-size: 25px;
  font-weight: 700;
  color: #999;
  text-align: center;
  margin-bottom: 20px;
}
input,
button {
  background: transparent;
  border: none;
  outline: none;
}
.item {
  position: relative;
  height: 45px;
  margin-bottom: 30px;
  border-bottom: 2px solid #c5d3f7;
}
.item input,
button {
  width: 100%;
  height: 100%;
  padding-top: 20px;
  box-sizing: border-box;
}
.item input:focus + lable,
.item input:valid + lable {
  top: 0px;
  font-size: 12px;
}
.item lable {
  position: absolute;
  left: 0;
  top: 18px;
  transition: all 0.15s linear;
}
.btn {
  padding: 10px 20px;
  margin-top: 10px;
  color: #fff;
  background-color: #188ae2;
  border-radius: 4px;
  cursor: pointer;
}
</style>
