<template>
  <div class="box" style="position: realative">
    <el-container style="height: 100vh; border: 1px solid #eee">
      <el-header style="height: 8vh" class="header">
        <span style="font-size: 26px; color: #c5c2c2">学生信息管理</span>
        <span style="font-size: 18px"
          ><i class="el-icon-setting" style="margin-right: 10px"></i>
          <span @click="logOut" class="logOut">登出</span></span
        >
      </el-header>
      <el-container>
        <el-aside width="200px" style="background: #1f3a5f">
          <el-menu style="background: #1f3a5f">
            <el-submenu index="1">
              <template slot="title"
                ><i
                  style="font-size: 26px; margin-left: -7px"
                  class="el-icon-more-outline"
                ></i
              ></template>
              <el-menu-item-group style="background: #1f3a5f">
                <el-menu-item
                  index="1-1"
                  @click="changeShow"
                  style="color: #e4e0e0"
                  ><template slot="title">
                    <i class="el-icon-s-grid"></i>学生信息
                  </template></el-menu-item
                >
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main style="padding: 4vh 3vh">
          <div
            style="background: #fff; padding-left: 1vh; min-width: 550px"
            v-show="show"
          >
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
              <el-table-column fixed="right" label="操作" width="140">
                <template slot="header" slot-scope="scope">
                  <el-input
                    size="mini"
                    placeholder="输入关键字搜索"
                    v-model="search"
                    @keyup.enter.native="searchKey"
                  />
                </template>
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
                :total="total"
              >
              </el-pagination>
            </div>
          </div>
          <!-- <div class="revise">hello World!</div> -->
        </el-main>
      </el-container>
    </el-container>

    <el-dialog :visible.sync="isShow" :close-on-click-modal="false">
      <router-view></router-view>
    </el-dialog>
  </div>
</template>
<script>
import request from "../api/index";
import debounce from "../myPlguin/debounce";
export default {
  name: "manage",
  beforeRouteEnter(to, from, next) {
    if (localStorage.getItem("token")) {
      next();
    } else {
      next("/login");
    }
  },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      isShow: false,
      search: "",
      show: false,
      total: 5,
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
        this.tableData = resposne.data.data.list;
        this.total = resposne.data.data.total;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  watch: {
    search: {
      handler: debounce(function () {
        if (this.search !== "") {
          request({
            method: "get",
            url: "/get/searchForm",
            params: {
              keyWord: this.search,
              page: this.currentPage,
              numPerPage: this.pageSize,
            },
          }).then((resposne) => {
            let res = resposne.data.data.total / this.pageSize;
            if (this.currentPage > Math.ceil(res)) {
              this.$alert("该页不存在内容", "警告", {
                confirmButtonText: "确定",
              });
            } else {
              this.tableData = resposne.data.data.list;
              this.total = resposne.data.data.total;
            }
          });
        } else {
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
              this.tableData = resposne.data.data.list;
              this.total = resposne.data.data.total;
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }),
    },
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
            .then(() => {
              this.send();
            })
            .catch((error) => {
              console.log(error);
            });
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
      this.send();
    },
    getTheInfo(val) {
      this.currentPage = val;
      this.send();
      // console.log(val);
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
          updata: this.updataForm,
        },
      });
    },
    logOut() {
      localStorage.removeItem("token");
      this.$router.push({
        name: "login",
      });
    },
    updataForm() {
      this.send();
    },
    searchKey() {
      this.send();
    },
    changeShow() {
      if (this.show) {
        return true;
      }
      this.show = true;
    },
    send() {
      if (this.search !== "") {
        request({
          method: "get",
          url: "/get/searchForm",
          params: {
            keyWord: this.search,
            page: this.currentPage,
            numPerPage: this.pageSize,
          },
        }).then((resposne) => {
          let res = resposne.data.data.total / this.pageSize;
          if (this.currentPage > Math.ceil(res)) {
            this.$alert("该页不存在内容", "警告", {
              confirmButtonText: "确定",
            });
          } else {
            this.tableData = resposne.data.data.list;
            this.total = resposne.data.data.total;
          }
        });
      } else {
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
            this.tableData = resposne.data.data.list;
            this.total = resposne.data.data.total;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
};
</script>
<style scoped>
.el-header {
  background-color: rgb(34, 32, 32);
  color: #c5c2c2;
  line-height: 8vh;
}
.el-aside {
  background: #1f3a5f;
}

.el-dialog__body {
  overflow: auto;
}

.revise {
  top: 0%;
  width: 100%;
  height: 100vh;
  background: rgba(24, 20, 20, 0.6);
  position: absolute;
  z-index: 999;
}
.inner {
  top: 3%;
  left: 35%;
  position: absolute;
  background: #d4d3d3;
  padding-left: 10vh;
  padding-right: 9vh;
  padding-bottom: 2vh;
}

.header {
  display: flex;
  justify-content: space-between;
}

.logOut {
  cursor: pointer;
}
</style>