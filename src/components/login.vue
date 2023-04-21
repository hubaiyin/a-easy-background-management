<template>
  <div>
    <div class="login-box">
      <router-link to="/" class="back">return</router-link>
      <h1>login</h1>
      <div class="login">
        <input
          type="text"
          name="userName"
          id="userName"
          v-model="userInfo.username"
          required
        />
        <label>Username</label>
      </div>
      <div class="login">
        <input
          type="password"
          name="password"
          id="password"
          v-model="userInfo.password"
          required
        />
        <label>Password</label>
      </div>
      <a href="javascript:;" class="btn" @click="submit(userInfo)">submit</a>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "login",
  data() {
    return {
      userInfo: {
        username: "",
        password: "",
      },
      message: "",
    };
  },
  methods: {
    submit(userInfo) {
      //   console.log(userInfo);
      axios({
        method: "post",
        url: "http://82.157.249.75:6789/api/login",
        data: userInfo,
      })
        .then((response) => {
          // console.log(response.data.status);
          this.message = response.data.message;
          if (response.data.data)
            localStorage.setItem("token", response.data.data.token);
          else localStorage.removeItem("token");
          this.userInfo.username = "";
          this.userInfo.password = "";
          this.$alert(this.message, {
            confirmButtonText: "确定",
          });
          if (response.data.status === "00000") {
            this.$router.push({
              name: "manage",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
<style scoped>
.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 500px;
  padding: 40px;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-box .back {
  width: 48px;
  padding: 6px;
  padding-left: 9px;
  padding-right: 15px;
  display: inline-block;
  color: #03e9f4;
  font-size: 12px;
  text-decoration: none;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: 1px solid #03e9f4;
  border-radius: 5px;
  transition: 0.8s;
  position: absolute;
  top: 6%;
  left: 4%;
}

.login-box h1 {
  margin: 0 0 30px;
  padding: 0;
  color: #cfcbcb;
  text-align: center;
}

.login {
  text-align: center;
  position: relative;
  width: 100%;
}

.login input {
  width: 50%;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
}

.login label {
  position: absolute;
  top: 0;
  left: 40%;
  padding: 10px 0;
  font-size: 18px;
  color: #fff;
  pointer-events: none;
  transition: 0.5s;
}

.login input:focus {
  background-color: transparent;
}

.login input:focus ~ label,
.login input:valid ~ label {
  top: -25px;
  left: 105px;
  color: #03e9f4;
  font-size: 13px;
}

.login-box .btn {
  width: 86px;
  display: inline-block;
  padding: 5px 20px;
  color: #03e9f4;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 4px;
  border: 1px solid #03e9f4;
  transition: 0.8s;
}

.login-box .btn:hover {
  padding: 10px 25px;
  background: #039ea7;
}

.login-box .back:hover {
  padding: 6px 9px;
  background: #039ea7;
}
</style>