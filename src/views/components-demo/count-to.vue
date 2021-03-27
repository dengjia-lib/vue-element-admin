<template>
  <div class="components-container">
    <!--<aside>-->
    <!--  基于：<a href="https://github.com/PanJiaChen/vue-countTo" target="_blank">countTo-component</a>-->
    <!--</aside>-->
    <count-to
      ref="example"
      :start-val="_startVal"
      :end-val="_endVal"
      :duration="_duration"
      :decimals="_decimals"
      :separator="_separator"
      :prefix="_prefix"
      :suffix="_suffix"
      :autoplay="false"
      class="example"
    />
    <div style="margin-left: 15%;margin-top: 30px;">
      <label class="label" for="startValInput">startVal:
        <input v-model.number="setStartVal" type="number" name="startValInput">
      </label>
      <label class="label" for="endValInput">endVal:
        <input v-model.number="setEndVal" type="number" name="endVaInput">
      </label>
      <label class="label" for="durationInput">duration:
        <input v-model.number="setDuration" type="number" name="durationInput">
      </label>
      <div class="startBtn example-btn" @click="start">
        计算得分
      </div>
      <div class="pause-resume-btn example-btn" @click="pauseResume">
        暂停/恢复
      </div>
      <br>
      <label class="label" for="decimalsInput">decimals:
        <input v-model.number="setDecimals" type="number" name="decimalsInput">
      </label>
      <label class="label" for="separatorInput">separator:
        <input v-model="setSeparator" name="separatorInput">
      </label>
      <label class="label" for="prefixInput">prefix:
        <input v-model="setPrefix" name="prefixInput">
      </label>
      <label class="label" for="suffixInput">suffix:
        <input v-model="setSuffix" name="suffixInput">
      </label>
    </div>
    <div style="text-align: center">
      <el-button type="primary" style="margin-left: 16px;" @click="scoringStrategyDrawer = true">
        管理计分策略
      </el-button>
    </div>
    <el-drawer
      title="设备绩效计分策略"
      :with-header="false"
      :visible.sync="scoringStrategyDrawer"
      :direction="direction"
      size="70%"
    >
      <div id="myScoringStrategy">
        <p style="text-align: center">纳入计算绩效得分的选项：（实践室xxx）</p>
        <el-divider><i class="el-icon-data-analysis" /></el-divider>
        <el-row>
          <el-col :span="10">
            <div class="grid-content bg-purple">
              <el-switch
                v-model="showNumOfBorrow"
                inactive-text=""
                active-text="设备总借用次数"
                active-color="#13ce66"
              />
              <br><br>
              <span v-if="showNumOfBorrow" class="weightText">所占权重：</span>
              <el-input-number v-if="showNumOfBorrow" v-model="timesWeight" size="mini" />
            </div>
          </el-col>
          <el-col :span="14">
            <div class="grid-content bg-purple-light">
              <el-switch v-model="showUseCate" inactive-text="" active-text="借用设备使用方向" />
              <br><br>
              <el-checkbox-group v-if="showUseCate" v-model="checkList">
                <el-checkbox label="科研项目" />
                <el-checkbox label="参加比赛" />
                <el-checkbox label="老师授课" />
                <el-checkbox label="学生个人" />
                <el-checkbox label="校外借用" />
                <el-checkbox label="其他用途" />
              </el-checkbox-group>
            </div>
          </el-col>
        </el-row>
        <el-divider />
        <el-row>
          <el-col :span="10">
            <div class="grid-content bg-purple">
              <el-switch
                v-model="showOkRate"
                inactive-text=""
                active-text="检验所有借用设备的达标率"
                active-color="#13ce66"
              />
              <br><br>
              <span v-if="showOkRate" class="weightText">所占权重：</span>
              <el-input-number v-if="showOkRate" v-model="okWeight" size="mini" />
            </div>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
    <!--<aside>&lt;count-to :start-val=&#x27;{{ _startVal }}&#x27; :end-val=&#x27;{{ _endVal }}&#x27;-->
    <!--  :duration=&#x27;{{ _duration }}&#x27;-->
    <!--  :decimals=&#x27;{{ _decimals }}&#x27; :separator=&#x27;{{ _separator }}&#x27; :prefix=&#x27;{{ _prefix }}&#x27;-->
    <!--  :suffix=&#x27;{{ _suffix }}&#x27;-->
    <!--  :autoplay=false&gt;-->
    <!--</aside>-->
  </div>
</template>

<script>
import countTo from 'vue-count-to'
import { getTheNumOfBorrow } from '@/api/performance'

export default {
  name: 'CountToDemo',
  components: { countTo },
  data() {
    return {
      setStartVal: 0,
      setEndVal: 2017,
      setDuration: 4000,
      setDecimals: 0,
      setSeparator: ',',
      setSuffix: ' 分',
      setPrefix: '共 ',

      checkList: ['选中且禁用', '复选框 A'],
      scoringStrategyDrawer: false,
      direction: 'btt',

      showNumOfBorrow: true,
      showOkRate: true,
      showUseCate: false,

      timesWeight: 1,
      okWeight: 1

    }
  },
  computed: {
    _startVal() {
      if (this.setStartVal) {
        return this.setStartVal
      } else {
        return 0
      }
    },
    _endVal() {
      if (this.setEndVal) {
        return this.setEndVal
      } else {
        return 0
      }
    },
    _duration() {
      if (this.setDuration) {
        return this.setDuration
      } else {
        return 100
      }
    },
    _decimals() {
      if (this.setDecimals) {
        if (this.setDecimals < 0 || this.setDecimals > 20) {
          alert('digits argument must be between 0 and 20')
          return 0
        }
        return this.setDecimals
      } else {
        return 0
      }
    },
    _separator() {
      return this.setSeparator
    },
    _suffix() {
      return this.setSuffix
    },
    _prefix() {
      return this.setPrefix
    }
  },
  methods: {
    hello() {
      alert('hello')
    },
    start() {
      const isNums = this.showNumOfBorrow
      if (isNums) {
        new Promise((resolve, reject) => {
          // 一个管理员负责一个实践室，一个实践室被多个管理员负责。
          const userId = this.$store.getters.id
          getTheNumOfBorrow(userId)
            .then(resp => {
              const multiple = this.timesWeight
              this.setEndVal = resp.data * multiple
              this.$refs.example.start()
              resolve(resp)
            })
            .catch(err => {
              reject(err)
            })
        })
      } else {
        this.setEndVal = 1
        this.$refs.example.start()
      }
    },
    pauseResume() {
      this.$refs.example.pauseResume()
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    }
  }
}
</script>

<style scoped>
.components-container {
  margin-top: 120px;
}

#myScoringStrategy {
  margin: 10px 30px 10px;
}

.weightText {
  /*margin-left: 30px;*/
  /*color: #1890ff;*/
  /*line-height: 1;*/
  /*font-size: 14px;*/
  /*display: inline-block;*/
}

.example-btn {
  display: inline-block;
  margin-bottom: 0;
  font-weight: 500;
  text-align: center;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  border: 1px solid transparent;
  white-space: nowrap;
  line-height: 1.5;
  padding: 4px 15px;
  font-size: 12px;
  border-radius: 4px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-transition: all .3s cubic-bezier(.645, .045, .355, 1);
  transition: all .3s cubic-bezier(.645, .045, .355, 1);
  position: relative;
  color: rgba(0, 0, 0, .65);
  background-color: #fff;
  border-color: #d9d9d9;
}

.example-btn:hover {
  color: #4AB7BD;
  background-color: #fff;
  border-color: #4AB7BD;
}

.example {
  font-size: 50px;
  color: #5a85fa;
  display: block;
  margin: 10px 0;
  text-align: center;
  font-size: 80px;
  font-weight: 500;
}

.label {
  color: #2f4f4f;
  font-size: 16px;
  display: inline-block;
  margin: 15px 30px 15px 0;
}

input {
  position: relative;
  display: inline-block;
  padding: 4px 7px;
  width: 70px;
  height: 28px;
  cursor: text;
  font-size: 12px;
  line-height: 1.5;
  color: rgba(0, 0, 0, .65);
  background-color: #fff;
  background-image: none;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  -webkit-transition: all .3s;
  transition: all .3s;
}

.startBtn {
  margin-left: 20px;
  font-size: 20px;
  color: #30B08F;
  background-color: #fff;
}

.startBtn:hover {
  background-color: #30B08F;
  color: #fff;
  border-color: #30B08F;
}

.pause-resume-btn {
  font-size: 20px;
  color: #E65D6E;
  background-color: #fff;
}

.pause-resume-btn:hover {
  background-color: #E65D6E;
  color: #fff;
  border-color: #E65D6E;
}
</style>

