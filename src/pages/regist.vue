<template>
  <div class="main">
    <h3>修改用户</h3>
    <div class="userInfo">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formData"
        class="demo-ruleForm regist"
        size="mini"
      >
        <el-form-item prop="studentId" class="input">
          <el-input
            v-model="formData.studentId"
            placeholder="请输入学号"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item prop="name" class="input">
          <el-input v-model="formData.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item prop="qq" class="input">
          <el-input v-model="formData.qq" placeholder="请输入qq号"></el-input>
        </el-form-item>
        <el-form-item prop="phoneNum" class="input">
          <el-input
            v-model="formData.phoneNum"
            placeholder="请输入手机号"
            oninput="value=value.replace(/[^\d]/g,'')"
            maxLength="11"
          ></el-input>
        </el-form-item>
        <h4>专业与班级</h4>
        <el-form-item prop="major" class="select">
          <el-select
            class="selectSon"
            v-model="formData.major"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="(m, index) in majorData"
              :key="index"
              :label="m.label"
              :value="m.value"
              @click.native="changeMajorIndex(index)"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="formData.major" prop="className" class="select">
          <el-select
            class="selectSon"
            v-model="formData.className"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="(m, index) in majorData[majorIndex].children"
              :key="index"
              :label="m.label"
              :value="m.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <h4>第一志愿</h4>
        <el-form-item class="select" prop="organization1.organizationName">
          <el-select
            class="selectSon"
            v-model="formData.organization1.organizationName"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="(m, index) in organizationData"
              :key="index"
              :label="m.label"
              :value="m.value"
              @click.native="changeOrganIndex1(index)"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          class="select"
          prop="organization1.branch"
          v-show="formData.organization1.organizationName"
        >
          <el-select
            class="selectSon"
            v-model="formData.organization1.branch"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="(m, index) in organizationData[organIndex1].children"
              :key="index"
              :label="m.label"
              :value="m.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="textarea" prop="organization1.reason">
          <el-input
            type="textarea"
            v-model="formData.organization1.reason"
          ></el-input>
        </el-form-item>
        <h4>第二志愿</h4>
        <el-form-item class="select">
          <el-select
            class="selectSon"
            v-model="formData.organization2.organizationName"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="(m, index) in organizationData"
              :key="index"
              :label="m.label"
              :value="m.value"
              @click.native="changeOrganIndex2(index)"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          class="select"
          v-show="formData.organization2.organizationName"
        >
          <el-select
            class="selectSon"
            v-model="formData.organization2.branch"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="(m, index) in organizationData[organIndex2].children"
              :key="index"
              :label="m.label"
              :value="m.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="textarea">
          <el-input
            type="textarea"
            v-model="formData.organization2.reason"
          ></el-input>
        </el-form-item>
        <h4>是否调剂</h4>
        <el-tooltip :content="'Switch value: ' + value" placement="top">
          <el-switch
            v-model="formData.isDispensing"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="true"
            inactive-value="false"
          >
          </el-switch>
        </el-tooltip>
        <div class="footer">
          <el-button type="primary" @click="submitForm('formData')" class="btn"
            >立即创建</el-button
          >
          <el-button class="btn" @click="cancel">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "register",
  props: ["obj", "change"],
  data() {
    return {
      value: "false",
      formData: {
        //报名表以学号为唯一认证，同一学号多次提交会以最后一次覆盖
        studentId: "", //学号 必填
        name: "", //姓名 必填
        qq: "", //QQ号码 必填
        phoneNum: "", //手机号  必填
        //专业和班级必须符合文档中的数据
        major: "", //专业 必填
        className: "", //班级  必填

        organization1: {
          // 必填
          organizationName: "", // 组织名 必填
          branch: "", // 组织下属部门 必填
          reason: "", // 原因 必填
        },
        organization2: {
          // 组织2选填
          organizationName: "",
          branch: "",
          reason: "",
        },
        isDispensing: "", //是否接受调剂
      },
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        studentId: [
          { required: true, message: "请输入学号", trigger: "blur" },
          {
            min: 8,
            max: 8,
            message: "必须是八位有效数字",
            trigger: "blur",
          },
        ],
        qq: [
          { required: true, message: "请输入QQ号", trigger: "blur" },
          {
            min: 8,
            max: 12,
            message: "必须是正确位数的QQ",
            trigger: "blur",
          },
        ],
        phoneNum: [
          { required: true, message: "请输入手机号", trigger: "blur" },
        ],
        major: [{ required: true, message: "请选择专业", trigger: "blur" }],
        className: [{ required: true, message: "请选择班级", trigger: "blur" }],
        "organization1.organizationName": [
          { required: true, message: "请选择组织", trigger: "blur" },
        ],
        "organization1.branch": [
          { required: true, message: "请选择部门", trigger: "blur" },
        ],
        "organization1.reason": [
          { required: true, message: "请输入理由", trigger: "blur" },
        ],
      },
      majorData: [
        {
          value: "计算机科学与技术", // value是真正存储在后端的值，也是前端需要传给后端的参数，一般来说是数字
          label: "计算机科学与技术", // label是value值对应的标签，用于对应数据和信息
          children: [
            {
              value: "一班",
              label: "一班",
            },
            {
              value: "二班",
              label: "二班",
            },
            {
              value: "三班",
              label: "三班",
            },
            {
              value: "四班",
              label: "四班",
            },
          ],
        },
        {
          value: "信息安全",
          label: "信息安全",
          children: [
            {
              value: "一班",
              label: "一班",
            },
            {
              value: "二班",
              label: "二班",
            },
            {
              value: "三班",
              label: "三班",
            },
            {
              value: "四班",
              label: "四班",
            },
          ],
        },
        {
          value: "物联网",
          label: "物联网",
          children: [
            {
              value: "一班",
              label: "一班",
            },
            {
              value: "二班",
              label: "二班",
            },
          ],
        },
        {
          value: "数据科学与大数据技术",
          label: "数据科学与大数据技术",
          children: [
            {
              value: "一班",
              label: "一班",
            },
            {
              value: "二班",
              label: "二班",
            },
          ],
        },
        {
          value: "计算机科学与技术（合作）",
          label: "计算机科学与技术（合作）",
          children: [
            {
              value: "一班",
              label: "一班",
            },
            {
              value: "二班",
              label: "二班",
            },
            {
              value: "三班",
              label: "三班",
            },
            {
              value: "四班",
              label: "四班",
            },
            {
              value: "五班",
              label: "五班",
            },
            {
              value: "六班",
              label: "六班",
            },
          ],
        },
      ],
      majorIndex: 0,
      organizationData: [
        {
          value: "科技协会", // value是真正存储在后端的值，也是前端需要传给后端的参数，一般来说是数字
          label: "科技协会", // label是value值对应的标签，用于对应数据和信息
          children: [
            {
              value: "科技协会",
              label: "科技协会",
            },
          ],
        },
        {
          value: "团委",
          label: "团委",
          children: [
            {
              value: "组织部",
              label: "组织部",
            },
            {
              value: "宣传部",
              label: "宣传部",
            },
            {
              value: "心协",
              label: "心协",
            },
            {
              value: "青协",
              label: "青协",
            },
          ],
        },
        {
          value: "学生会",
          label: "学生会",
          children: [
            {
              value: "办公室",
              label: "办公室",
            },
            {
              value: "学习部",
              label: "学习部",
            },
            {
              value: "宣传部",
              label: "宣传部",
            },
            {
              value: "文艺部",
              label: "文艺部",
            },
            {
              value: "体育部",
              label: "体育部",
            },
            {
              value: "外联部",
              label: "外联部",
            },
            {
              value: "自管会",
              label: "自管会",
            },
          ],
        },
        {
          value: "勤工助学中心",
          label: "勤工助学中心",
          children: [
            {
              value: "管理部",
              label: "管理部",
            },
            {
              value: "活动部",
              label: "活动部",
            },
            {
              value: "助贷部",
              label: "助贷部",
            },
            {
              value: "外联部",
              label: "外联部",
            },
          ],
        },
        {
          value: "新闻中心",
          label: "新闻中心",
          children: [
            {
              value: "摄影协会",
              label: "摄影协会",
            },
            {
              value: "新媒体部",
              label: "新媒体部",
            },
            {
              value: "记者团",
              label: "记者团",
            },
          ],
        },
      ],
      organIndex1: 0,
      organIndex2: 0,
    };
  },
  mounted() {
    // console.log(this.obj[0]);
    let temp = JSON.stringify(this.obj[0]);
    temp = JSON.parse(temp);
    // console.log(temp);
    this.formData = {
      studentId: temp.studentId,
      name: temp.name,
      qq: temp.qq,
      phoneNum: temp.phoneNum,
      major: temp.major,
      className: temp.className,
      organization1: {
        organizationName: temp.organizationName1 || "",
        branch: temp.branch1,
        reason: temp.reason1,
      },
      organization2: {
        organizationName: temp.organizationName2 || "",
        branch: temp.branch2 || "",
        reason: temp.reason2 || "",
      },
      isDispensing: !!temp.isDispensing,
    };
    console.log(this.formData);
  },
  computed: {
    formDatas: function () {
      if (this.formData.organization2.organizationName === "") {
        let arr = Object.entries(this.formData).filter(
          ([key, val]) => key !== "organization2"
        );
        let obj = Object.fromEntries(arr);
        obj.phoneNum = obj.phoneNum.toString();
        return obj;
      } else {
        let obj = this.formData;
        obj.phoneNum = obj.phoneNum.toString();
        return this.formData;
      }
    },
  },
  methods: {
    changeMajorIndex(index) {
      //   console.log(index);
      this.majorIndex = index;
      //   console.log(this.majorData[this.majorIndex]);
    },
    changeOrganIndex1(index) {
      //   console.log(index);
      this.organIndex1 = index;
      //   console.log(this.organizationData[this.organIndex1]);
    },
    changeOrganIndex2(index) {
      //   console.log(index);
      this.organIndex2 = index;
      //   console.log(this.organizationData[this.organIndex2]);
    },
    submitForm(formName) {
      this.$confirm("此操作将永久修改该学生信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios({
              method: "post",
              url: "http://82.157.249.75:6789/api/post/form",
              data: this.formDatas,
            })
              .then(() => {
                this.$alert("提交成功", "提交成功", {
                  confirmButtonText: "确定",
                  callback: (action) => {
                    this.$message({
                      type: "info",
                      message: `action: ${action}`,
                    });
                  },
                });
                this.change();
                this.$router.back();
              })
              .catch(() => {
                this.$alert("哎呀，出了点意外", "提交失败", {
                  confirmButtonText: "确定",
                  callback: (action) => {
                    this.$message({
                      type: "info",
                      message: `action: ${action}`,
                    });
                  },
                });
              });
          } else {
            this.$alert("内容不合规，请重写", "提交失败", {
              confirmButtonText: "确定",
              callback: (action) => {
                this.$message({
                  type: "info",
                  message: `action: ${action}`,
                });
              },
            });
            return false;
          }
        });
      });
    },
    cancel() {
      this.change();
      this.$router.back();
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.main {
  margin-top: 20px;
}
h3 {
  margin-top: 10px;
}
.userInfo {
  margin-top: 15px;
}
h4 {
  margin-bottom: 10px;
}
.regist .input {
  width: 40vh;
  margin: 0 auto;
  margin-bottom: 2vh;
}

.regist .select {
  margin: 0 auto;
  margin-bottom: 2vh;
  width: 40vh;
}

.selectSon {
  margin: 0;
  width: 40vh;
}

.regist .textarea {
  margin: 0 auto;
  margin-top: 2vh;
  margin-bottom: 2vh;
  width: 40vh;
}

.footer {
  margin-top: 2vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.footer .btn {
  width: 10vh;
  height: 4vh;
}
</style>