<template>
  <div class="box" style="position: realative">
    <el-container style="height: 100vh; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1', '3']">
          <el-submenu index="1">
            <template slot="title"
              ><i class="el-icon-message"></i>导航一</template
            >
            <el-menu-item-group>
              <el-menu-item index="1-1">选项1</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 15px">
          <i class="el-icon-setting" style="margin-right: 10px"></i>
          <span @click="logOut" class="logOut">登出</span>
        </el-header>

        <el-main>
          <div style="background: #fff">
            <el-table :data="tableData">
              <el-table-column prop="studentId" label="学号" width="90">
              </el-table-column>
              <el-table-column prop="name" label="姓名"> </el-table-column>
              <el-table-column prop="qq" label="QQ" min-width="100">
              </el-table-column>
              <el-table-column prop="phoneNum" label="电话" min-width="115">
              </el-table-column>
              <el-table-column prop="major" label="专业" width="140">
              </el-table-column>
              <el-table-column prop="className" label="班级"> </el-table-column>
              <el-table-column
                prop="organizationName1"
                label="志愿1"
                min-width="100"
              >
              </el-table-column>
              <el-table-column prop="branch1" label="部门"> </el-table-column>
              <el-table-column prop="reason1" label="原因" min-width="90">
              </el-table-column>
              <el-table-column
                prop="organizationName2"
                label="志愿2"
                min-width="100"
              >
              </el-table-column>
              <el-table-column prop="branch2" label="部门"> </el-table-column>
              <el-table-column prop="reason2" label="原因"> </el-table-column>
              <el-table-column prop="isDispensing" label="是否调剂">
                <template slot-scope="scope">
                  {{ scope.row.isDispensing === 1 ? "是" : "否" }}
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="120">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, tableData)"
                    type="text"
                    size="small"
                  >
                    移除
                  </el-button>
                  <el-button
                    @click.native.prevent="reviseRow(scope.$index, tableData)"
                    type="text"
                    size="small"
                  >
                    修改
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="block">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="getTheInfo"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                :page-sizes="[5, 10, 15, 20]"
                layout="prev, pager, next, jumper,sizes"
                :total="100"
              >
              </el-pagination>
            </div>
          </div>
          <!-- <div class="revise">hello World!</div> -->
        </el-main>
      </el-container>
    </el-container>
    <div class="revise" v-show="isShow">
      <div class="inner">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import request from "../api/index";
export default {
  name: "manage",
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      isShow: false,
    };
  },
  mounted() {
    request({
      method: "get",
      url: "/get/allForm",
      params: {
        page: this.currentPage,
        numPerPage: this.pageSize,
      },
    })
      .then((resposne) => {
        // console.log(resposne);
        this.tableData = resposne.data.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    deleteRow(index, tableData) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          let res = tableData.splice(index, 1);
          request({
            method: "post",
            url: "/deleteForm",
            data: {
              studentId: res[0].studentId,
            },
          })
            .then((resposne) => {
              console.log(resposne);
            })
            .catch((error) => {
              console.log(error);
            });
          console.log(res[0].studentId);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      console.log(this.pageSize);
      request({
        method: "get",
        url: "/get/allForm",
        params: {
          page: this.currentPage,
          numPerPage: this.pageSize,
        },
      })
        .then((resposne) => {
          console.log(resposne);
          this.tableData = resposne.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getTheInfo(val) {
      this.currentPage = val;
      request({
        method: "get",
        url: "/get/allForm",
        params: {
          page: this.currentPage,
          numPerPage: this.pageSize,
        },
      })
        .then((resposne) => {
          console.log(resposne);
          this.tableData = resposne.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
      console.log(val);
    },
    changeIsShow() {
      this.isShow = !this.isShow;
    },
    reviseRow(index, tableData) {
      let res = tableData.slice(index, index + 1);
      // console.log(res);
      this.isShow = true;
      this.$router.push({
        name: "regist",
        params: {
          obj: res,
          change: this.changeIsShow,
        },
      });
    },
    logOut() {
      localStorage.removeItem("token");
      this.$router.push({
        name: "login",
      });
    },
  },
  computed: {
    total() {
      return this.tableData.length;
    },
  },
};
</script>
<style scoped>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

.revise {
  top: 0%;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  position: absolute;
  z-index: 999;
}
.inner {
  top: 3%;
  left: 35%;
  position: absolute;
  background: #fff;
  padding-left: 10vh;
  padding-right: 9vh;
  padding-bottom: 2vh;
}

.logOut {
  cursor: pointer;
}
</style>