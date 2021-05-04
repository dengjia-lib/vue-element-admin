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
    <div style="margin-left: 60%;margin-top: 30px;">
      <div class="startBtn example-btn" @click="start">
        计算得分
      </div>
      <br>
    </div>
    <div style="text-align: center">
      <el-button
        v-permission="['ADMIN']"
        type="info"
        style="margin-left: 16px;"
        @click="scoringStrategyDrawer = true"
      >

        查看计分策略
      </el-button>
      <el-button
        v-permission="['SUPERADMIN']"
        type="primary"
        style="margin-left: 16px;"
        @click="scoringStrategyDrawer = true"
      >

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
        <el-row :gutter="24">
          <el-col :span="22">
            <div class="grid-content bg-purple"><p style="text-align: center">
              纳入计算绩效得分的选项（当前实践室：{{ this.$store.getters.room }}）</p></div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content bg-purple">
              <el-button type="primary" size="medium" @click="saveStrategy">保存</el-button>
            </div>
          </el-col>
        </el-row>
        <el-divider><i class="el-icon-data-analysis" /></el-divider>
        <el-row>
          <!-- 设备总借用次数 -->
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-switch
                v-model="showNumOfBorrow"
                inactive-text=""
                active-text="设备总借用次数"
                active-color="#13ce66"
                :disabled="admin"
              />
              <br><br>
              <span style="font-size: 10px">
                说明：用户的一次申请使用设备计一次【借用次数】，<br>
                当前设备库所受理的总的申请数即为【设备总借用次数】。<br>
                计算方法：基础次数 x 权重数，<br>
                例如：本月【实践室C】有3条借用记录，权重指定为10，<br>
                计算得分为 3 x 10 = 30（分）<br>
              </span>
              <br>
              <span v-if="showNumOfBorrow" class="weightText">所占权重：</span>
              <el-input-number
                v-if="showNumOfBorrow"
                v-model="timesWeight"
                :min="1"
                :max="10"
                size="mini"
                :disabled="admin"
              />
            </div>
          </el-col>
          <!-- 设备总借用数量 -->
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-switch
                v-model="showQuantityOfBorrow"
                inactive-text=""
                active-text="设备总借用数量"
                active-color="#13ce66"
                :disabled="admin"
              />
              <br><br>
              <span style="font-size: 10px">
                说明：用户申请使用设备时需填写申请数量，<br>
                当前设备库所借出的设备总数即【设备总借用数量】。<br>
                计算方法：基础数量 x 权重数，<br>
                例如：本月【实践室C】共有100台设备借出，权重指定为5，<br>
                计算得分为 100 x 5 = 500（分）<br>
              </span>
              <br>
              <span v-if="showQuantityOfBorrow" class="weightText">所占权重：</span>
              <el-input-number
                v-if="showQuantityOfBorrow"
                v-model="quantityWeight"
                :min="1"
                :max="10"
                size="mini"
                :disabled="admin"
              />
            </div>
          </el-col>
          <!-- 设备使用方向 -->
          <el-col :span="8">
            <div class="grid-content bg-purple-light">
              <el-switch v-model="showUseCate" inactive-text="" active-text="借用设备使用方向" />
              <br><br>
              <span style="font-size: 10px">
                说明：用户借用的设备投入不同方向使用将计不同的分数，<br>
                勾选不同的选项来决定其是否纳入绩效得分的计算，<br>
                并且指定对应项目的权重。<br>
              </span>
              <br>
              <el-checkbox-group v-if="showUseCate" v-model="checkList">
                <el-checkbox label="科研项目" @change="showKeYan=!showKeYan" />
                <el-input-number
                  v-if="showKeYan"
                  v-model="keYanXiangMu"
                  :min="1"
                  :max="10"
                  size="mini"
                />
                <br>
                <el-checkbox label="参加比赛" @change="showBiSai=!showBiSai" />
                <el-input-number
                  v-if="showBiSai"
                  v-model="canJiaBiSai"
                  :min="1"
                  :max="10"
                  size="mini"
                />
                <br>
                <el-checkbox label="老师授课" @change="showShouKe=!showShouKe" />
                <el-input-number
                  v-if="showShouKe"
                  v-model="laoShiShouKe"
                  :min="1"
                  :max="10"
                  size="mini"
                />
                <br>
                <el-checkbox label="学生个人" @change="showGeRen=!showGeRen" />
                <el-input-number
                  v-if="showGeRen"
                  v-model="xueShengGeRen"
                  :min="1"
                  :max="10"
                  size="mini"
                />
                <br>
                <el-checkbox label="校外借用" @change="showXiaoWai=!showXiaoWai" />
                <el-input-number
                  v-if="showXiaoWai"
                  v-model="xiaoWaiJieYong"
                  :min="1"
                  :max="10"
                  size="mini"
                />
                <br>
                <el-checkbox label="其他用途" @change="showQiTa=!showQiTa" />
                <el-input-number
                  v-if="showQiTa"
                  v-model="qiTaYongTu"
                  :min="1"
                  :max="10"
                  size="mini"
                />
              </el-checkbox-group>
              <br>
              <!--              <span v-if="showUseCate" class="weightText">所占权重：</span>
                            <el-input-number v-if="showUseCate"
                                             v-model="useCateWeight"
                                             :min="1"
                                             :max="10"
                                             size="mini"
                            />-->
            </div>
          </el-col>
        </el-row>

        <!--        <el-divider/>
                <el-row>
                  <el-col :span="8">
                    <div class="grid-content bg-purple">
                      <el-switch
                        v-model="showOkRate"
                        inactive-text=""
                        active-text="检验所有借用设备的达标率"
                        active-color="#13ce66"
                      />
                      <br><br>
                      <span v-if="showOkRate" class="weightText">所占权重：</span>
                      <el-input-number v-if="showOkRate" v-model="okWeight" size="mini"/>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    待开发...
                  </el-col>
                </el-row>-->

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
import {
  getTheNumOfBorrow,
  getTheQuantityOfBorrow,
  getTheUseCateScore,
  getStrategy,
  saveStrategy
} from '@/api/performance'
import permission from '@/directive/permission'
import waves from '@/directive/waves'

export default {
  name: 'CountToDemo',
  components: { countTo },
  directives: { waves, permission },
  data() {
    return {
      setStartVal: 0,
      setEndVal: 0,
      setDuration: 3000,
      setDecimals: 0,
      setSeparator: ',',
      setSuffix: ' 分',
      setPrefix: '共 ',

      checkList: ['科研项目', '参加比赛', '老师授课'],
      scoringStrategyDrawer: false,
      direction: 'btt',

      showNumOfBorrow: true,
      showQuantityOfBorrow: true,
      showUseCate: false,
      // showOkRate: false,

      timesWeight: 5,
      quantityWeight: 2,
      useCateWeight: 1,
      // okWeight: 1,

      showKeYan: true,
      showBiSai: true,
      showShouKe: true,
      showGeRen: false,
      showXiaoWai: false,
      showQiTa: false,

      keYanXiangMu: 10,
      canJiaBiSai: 8,
      laoShiShouKe: 5,
      xueShengGeRen: 3,
      xiaoWaiJieYong: 2,
      qiTaYongTu: 1

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
    },

    admin() {
      // 管理员无法修改计分策略，只允许查看！超级管理员可以修改。
      const roles = this.$store.getters.roles
      for (const role of roles) {
        if (role === 'SUPERADMIN') {
          return false
        }
      }
      return true
    }
  },
  created() {
    this.getStrategy()
  },
  methods: {
    hello() {
      alert('hello')
    },
    // 获取计分策略
    getStrategy() {
      new Promise((resolve, reject) => {
        getStrategy()
          .then(resp => {
            if (resp.data == null) {
              return
            }
            const s = resp.data
            this.showNumOfBorrow = s.isNums
            this.showQuantityOfBorrow = s.isQuantity
            this.showUseCate = s.isUseCate

            this.timesWeight = s.numsWeight
            this.quantityWeight = s.quantityWeight
            this.keYanXiangMu = s.keYanWeight
            this.canJiaBiSai = s.biSaiWeight
            this.laoShiShouKe = s.shouKeWeight
            this.xueShengGeRen = s.geRenWeight
            this.xiaoWaiJieYong = s.xiaoWaiWeight
            this.qiTaYongTu = s.qiTaWeight

            this.showKeYan = s.showKeYan
            this.showBiSai = s.showBiSai
            this.showShouKe = s.showShouKe
            this.showGeRen = s.showGeRen
            this.showXiaoWai = s.showXiaoWai
            this.showQiTa = s.showQiTa

            this.checkList = []
            this.checkList.push(s.showKeYan ? '科研项目' : '')
            this.checkList.push(s.showBiSai ? '参加比赛' : '')
            this.checkList.push(s.showShouKe ? '老师授课' : '')
            this.checkList.push(s.showGeRen ? '学生个人' : '')
            this.checkList.push(s.showXiaoWai ? '校外借用' : '')
            this.checkList.push(s.showQiTa ? '其他用途' : '')

            console.log(this.checkList)

            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    async start() {
      const isNums = this.showNumOfBorrow
      const isQuantity = this.showQuantityOfBorrow
      const isUseCate = this.showUseCate

      const timesWeight = this.timesWeight
      const quantityWeight = this.quantityWeight
      let endVal = 0
      const a = function() {
        if (isNums) {
          return new Promise(function(resolve, reject) {
            // 将借用次数纳入绩效得分
            // 一个管理员负责一个实践室，一个实践室被多个管理员负责。
            getTheNumOfBorrow()
              .then(resp => {
                endVal += resp.data * timesWeight
                resolve(resp)
              })
              .catch(err => {
                reject(err)
              })
          })
        }
      }
      const b = function() {
        if (isQuantity) {
          return new Promise((resolve, reject) => {
            // 将借用数量纳入绩效得分
            getTheQuantityOfBorrow()
              .then(resp => {
                endVal += resp.data * quantityWeight
                resolve(resp)
              })
              .catch(err => {
                reject(err)
              })
          })
        }
      }
      const c = function() {
        if (isUseCate) {
          return new Promise((resolve, reject) => {
            // 将设备的使用方向纳入绩效得分
            getTheUseCateScore()
              .then(resp => {
                endVal += resp.data
                resolve(resp)
              })
              .catch(err => {
                reject(err)
              })
          })
        }
      }
      await this.schedule([a, b, c])
      this.setEndVal = endVal
      this.$refs.example.start()
    },
    // 组织函数队列，Promise顺序调用
    schedule(arr) {
      let sequence = Promise.resolve()
      arr.forEach(function(item) {
        sequence = sequence.then(item)
      })
      return sequence
    },
    saveStrategy() {
      const data = {
        isNums: this.showNumOfBorrow,
        isQuantity: this.showQuantityOfBorrow,
        isUseCate: this.showUseCate,

        numsWeight: this.timesWeight,
        quantityWeight: this.quantityWeight,
        keYanWeight: this.keYanXiangMu,
        biSaiWeight: this.canJiaBiSai,
        shouKeWeight: this.laoShiShouKe,
        geRenWeight: this.xueShengGeRen,
        xiaoWaiWeight: this.xiaoWaiJieYong,
        qiTaWeight: this.qiTaYongTu,

        showKeYan: this.showKeYan,
        showBiSai: this.showBiSai,
        showShouKe: this.showShouKe,
        showGeRen: this.showGeRen,
        showXiaoWai: this.showXiaoWai,
        showQiTa: this.showQiTa
      }
      new Promise((resolve, reject) => {
        saveStrategy(data)
          .then(resp => {
            const isSuccess = resp.data
            isSuccess
              ? this.$message({
                showClose: true,
                message: '保存成功',
                type: 'success'
              })
              : this.$message({
                showClose: true,
                message: '保存失败',
                type: 'warning'
              })
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
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

