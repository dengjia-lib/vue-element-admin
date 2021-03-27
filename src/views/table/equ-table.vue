<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input
          v-model="listQuery.equKeyWord"
          size="mini"
          placeholder="设备名称"
          style="width: 120px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        &emsp;
        <el-select
          v-model="listQuery.equCate"
          size="mini"
          placeholder="类别"
          clearable
          style="width: 85px"
          class="filter-item"
        >
          <el-option v-for="(item,index) in equCateInfo" :key="item" :label="item" :value="index+1" />
        </el-select>
        &emsp;
        <el-select
          v-model="listQuery.equRoom"
          v-permission="['SUPERADMIN']"
          size="mini"
          placeholder="存放地"
          clearable
          style="width: 90px"
          class="filter-item"
        >
          <el-option v-for="(item,index) in equRoomInfo" :key="item" :label="item" :value="index+1" />
        </el-select>
        &emsp;
        <el-select
          v-model="listQuery.equState"
          size="mini"
          placeholder="状态"
          clearable
          style="width: 85px"
          class="filter-item"
        >
          <el-option v-for="(item,index) in equStateInfo" :key="item" :label="item" :value="index+1" />
        </el-select>
        &emsp;
        <el-select v-model="listQuery.sort" size="mini" style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
        &emsp;
        <el-button
          v-waves
          size="mini"
          class="filter-item"
          type="plain"
          icon="el-icon-search"
          @click="handleFilter"
        >
          按条件查询
        </el-button>
        <el-button
          v-permission="['ADMIN','SUPERADMIN']"
          size="mini"
          class="filter-item"
          style="margin-left: 10px;"
          type="warning"
          icon="el-icon-edit"
          @click="handleAddEqu();dialogAddFormVisible = true"
        >添加设备
        </el-button>
        <el-button
          v-waves
          size="mini"
          :loading="downloadLoading"
          class="filter-item"
          type="info"
          icon="el-icon-download"
          @click="handleDownload"
        >导出
        </el-button>
        &emsp;
        <el-badge v-permission="['VISITOR']" :value="visitor_to_do_number" class="item" type="primary">
          <el-button
            v-waves
            v-permission="['VISITOR']"
            class="filter-item"
            type="warning"
            icon="el-icon-chat-dot-square"
            @click="myApplyTable = true;handleShowMyApplyOrApproval()"
          >我的申请
          </el-button>
        </el-badge>
        <el-badge v-permission="['SUPERADMIN','ADMIN']" :value="admin_to_do_number" class="item" type="primary">
          <el-button
            v-waves
            v-permission="['SUPERADMIN','ADMIN']"
            class="filter-item"
            type="primary"
            icon="el-icon-chat-dot-square"
            @click="myApproveTable=true;handleShowMyApplyOrApproval()"
          >申请与归还
          </el-button>
        </el-badge>
        &emsp;
        <el-checkbox
          v-model="showLoginName"
          v-permission="['SUPERADMIN']"
          size="mini"
          class="filter-item"
          style="margin-left:15px;"
          @change="tableKey=tableKey+1"
        >显示设备负责人
        </el-checkbox>
        <el-checkbox
          v-model="showLoginName"
          v-permission="['VISITOR','ADMIN']"
          size="mini"
          class="filter-item"
          style="margin-left:15px;"
          @change="tableKey=tableKey+1"
        >{{ currentRoom }} - 所有负责人
        </el-checkbox>
      </div>
      <!-- 设备列表展示信息（table） -->
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        element-loading-text="正在请求设备数据"
        :data="equTableData"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
      >
        <!--        <el-table-column fixed="left" prop="id" label="ID" width="65" align="center"></el-table-column>-->
        <el-table-column
          prop="id"
          label="ID"
          sortable="custom"
          align="center"
          width="70"
          :class-name="getSortClass('id')"
        >
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="equName" label="设备名称" width="120" align="center" />
        <el-table-column prop="equPrice" label="单价" width="60" align="center" />
        <el-table-column prop="equQuantity" label="余量" width="60" align="center" />
        <el-table-column prop="equRoom" label="库存室" width="100" align="center" />
        <el-table-column
          v-if="showLoginName"
          prop="equUser"
          label="负责人"
          width="100"
          align="center"
        >
          <template slot-scope="{row}">
            <span
              style="font-weight:bold;font-style:italic;color:#4070ff;"
              class="link-type"
              @click="findTheUserInCharge(row.equUser);dialogEquUserDetailFormVisible = true"
            >{{
              row.equUser
            }}</span>
          </template>
        </el-table-column>

        <!--        <el-table-column label="Title" min-width="150px">
                  <template slot-scope="{row}">
                    <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
                    <el-tag>{{ row.type | typeFilter }}</el-tag>
                  </template>
                </el-table-column>-->

        <!--        <el-table-column prop="equUser" label="负责人" width="100" align="center"></el-table-column>-->
        <el-table-column prop="equState" label="设备状态" width="80" align="center" />
        <el-table-column prop="purchaseTime" align="center" label="购置时间" width="180">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span> {{ scope.row.purchaseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="{row,$index}">
            <el-button plain size="mini" @click="handleShowEqu(row);dialogDetailFormVisible = true">查看</el-button>
            <el-button
              v-permission="['ADMIN','SUPERADMIN']"
              type="primary"
              plain
              size="mini"
              @click="handleModifyEqu(row,$index);dialogModifyFormVisible = true"
            >编辑
            </el-button>
            <el-button
              v-permission="['VISITOR']"
              plain
              type="success"
              size="mini"
              @click="handleApplyForEquipment(row,$index);dialogApplyForEquipment = true"
            >
              申请使用
            </el-button>
            <el-button
              v-permission="['SUPERADMIN']"
              type="danger"
              size="mini"
              @click="handleDeleteEqu(row,$index)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页导航条 -->
      <el-pagination
        background
        layout="prev, pager, next, jumper, sizes"
        :hide-on-single-page="isPageSinglePage"
        :current-page.sync="currentPage"
        :page-size="currentSize"
        :page-sizes="arrays"
        :pager-count="13"
        :total="total"
        @current-change="handleCurrentPageChange"
        @size-change="handlePageSizeChange"
      />
      <!-- pv -->
      <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
        <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
          <el-table-column prop="key" label="Channel" />
          <el-table-column prop="pv" label="Pv" />
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 添加新设备 模态框 -->
    <div>
      <el-dialog title="添加设备" :visible.sync="dialogAddFormVisible">
        <el-form ref="dataForm" :inline="true" :rules="rules" :model="detailForm" label-width="100px" size="mini">
          <el-form-item label="设备编号" style="width: 100%" class="change-label-class">
            <el-input v-model="detailForm.equCode" />
          </el-form-item>
          <el-form-item label="设备名">
            <el-input v-model="detailForm.equName" />
          </el-form-item>
          <el-form-item label="设备类别">
            <el-select v-model="detailForm.equCate" class="filter-item" placeholder="请选择设备类别...">
              <el-option v-for="(item,index) in equCateInfo" :key="item" :label="item" :value="index+1" />
            </el-select>
          </el-form-item>
          <el-form-item label="生产厂商">
            <el-input v-model="detailForm.equFirm" />
          </el-form-item>
          <el-form-item label="设备品牌">
            <el-input v-model="detailForm.equBrand" />
          </el-form-item>
          <el-form-item label="设备型号">
            <el-input v-model="detailForm.equModel" />
          </el-form-item>
          <el-form-item label="设备规格">
            <el-input v-model="detailForm.equStandard" />
          </el-form-item>
          <el-form-item label="设备单价">
            <el-input v-model="detailForm.equPrice" />
          </el-form-item>
          <el-form-item label="库存数量">
            <el-input v-model="detailForm.equQuantity" />
          </el-form-item>
          <el-form-item label="出厂日期">
            <el-col>
              <el-date-picker
                v-model="detailForm.outFirmTime"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-col>
          </el-form-item>
          <el-form-item label="使用年限">
            <el-input v-model="detailForm.equLife" />
          </el-form-item>
          <el-form-item label="购置日期">
            <el-col>
              <el-date-picker
                v-model="detailForm.purchaseTime"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-col>
          </el-form-item>
          <el-form-item label="目前状态">
            <el-select v-model="detailForm.equState" class="filter-item" placeholder="请选择设备状态...">
              <el-option v-for="(item,index) in equStateInfo" :key="item" :label="item" :value="index+1" />
            </el-select>
          </el-form-item>
          <!--          <el-form-item label="存放实践室" v-permission="['SUPERADMIN']">
                      <el-select v-model="detailForm.equRoom" class="filter-item" placeholder="请选择实践室...">
                        <el-option v-for="(item,index) in equRoomInfo" :key="item" :label="item" :value="index+1"/>
                      </el-select>
                    </el-form-item>-->
          <el-form-item label="存放实践室">
            <el-input v-model="this.$store.getters.room" readonly />
          </el-form-item>
          <el-form-item label="设备负责人">
            <el-input v-model="this.$store.getters.realName" readonly />
          </el-form-item>
          <el-form-item label="主要电器参数">
            <el-input v-model="detailForm.equOtherParam" style="width: 400px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="detailForm.remark"
              style="width:400px"
              :autosize="{ minRows: 2, maxRows: 3}"
              type="textarea"
              placeholder="用户备注信息..."
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAddFormVisible = false">返 回</el-button>
          <el-button @click="clearDetailForm()">重 置</el-button>
          <!--          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">添加</el-button>-->
          <el-button type="primary" @click="dialogAddFormVisible = false;submitAddForm()">添加</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 设备详细信息 模态框 -->
    <div>
      <el-dialog title="详细信息" :visible.sync="dialogDetailFormVisible">
        <el-form ref="detailForm" :inline="true" :model="detailForm" label-width="100px" size="mini">
          <el-form-item label="设备id" class="change-label-class">
            <el-input v-model="detailForm.id" disabled readonly />
          </el-form-item>
          <el-form-item label="设备编号" class="change-label-class">
            <el-input v-model="detailForm.equCode" readonly />
          </el-form-item>
          <el-form-item label="设备名">
            <el-input v-model="detailForm.equName" readonly />
          </el-form-item>
          <el-form-item label="设备类别">
            <el-input v-model="detailForm.equCate" readonly />
          </el-form-item>
          <el-form-item label="生产厂商">
            <el-input v-model="detailForm.equFirm" readonly />
          </el-form-item>
          <el-form-item label="设备品牌">
            <el-input v-model="detailForm.equBrand" readonly />
          </el-form-item>
          <el-form-item label="设备型号">
            <el-input v-model="detailForm.equModel" readonly />
          </el-form-item>
          <el-form-item label="设备规格">
            <el-input v-model="detailForm.equStandard" readonly />
          </el-form-item>
          <el-form-item label="设备单价">
            <el-input v-model="detailForm.equPrice" readonly />
          </el-form-item>
          <el-form-item label="库存数量">
            <el-input v-model="detailForm.equQuantity" readonly />
          </el-form-item>
          <el-form-item label="出厂日期">
            <el-input v-model="detailForm.outFirmTime" readonly />
          </el-form-item>
          <el-form-item label="购置日期">
            <el-input v-model="detailForm.purchaseTime" readonly />
          </el-form-item>
          <el-form-item label="入库日期">
            <el-input v-model="detailForm.purchaseTime" readonly />
          </el-form-item>
          <el-form-item label="使用年限">
            <el-input v-model="detailForm.equLife" readonly />
          </el-form-item>
          <el-form-item label="目前状态">
            <el-input v-model="detailForm.equState" readonly />
          </el-form-item>
          <el-form-item label="存放实践室">
            <el-input v-model="detailForm.equRoom" readonly />
          </el-form-item>
          <el-form-item label="设备负责人">
            <el-input v-model="detailForm.equUser" readonly />
          </el-form-item>
          <el-form-item label="主要电器参数">
            <el-input v-model="detailForm.equOtherParam" style="width: 400px;" readonly />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="detailForm.remark"
              style="width:400px"
              :autosize="{ minRows: 2, maxRows: 3}"
              type="textarea"
              placeholder="用户备注信息..."
              readonly
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogDetailFormVisible = false">返 回</el-button>
          <el-button type="primary" size="mini" @click="dialogDetailFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 普通用户申请使用设备 模态框 -->
    <div>
      <el-dialog title="设备申请信息表" :visible.sync="dialogApplyForEquipment">
        <el-form ref="form" :model="applyForEquipmentForm" label-width="80px" size="mini" inline>
          <el-form-item label="设备名称">
            <el-input v-model="applyForEquipmentForm.equName" readonly />
          </el-form-item>
          <el-form-item label="申请数量">
            <el-input-number
              v-model="equNum"
              :min="1"
              :max="applyForEquipmentForm.equQuantity"
              :step="1"
            />
          </el-form-item>
          <el-form-item label="使用方向">
            <el-select v-model="applyForEquipmentForm.equUseCate" placeholder="请选择使用方向">
              <el-option v-for="(item,index) in equUseCateInfo" :key="item" :label="item" :value="index+1" />
            </el-select>
          </el-form-item>
          <el-form-item label="使用时间">
            <el-col :span="11">
              <el-date-picker
                v-model="applyForEquipmentForm.equUseTime1"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-time-picker
                v-model="applyForEquipmentForm.equUseTime2"
                placeholder="选择时间"
                style="width: 100%;"
              />
            </el-col>
          </el-form-item>
          <el-form-item label="借用天数">
            <el-input-number v-model="equDay" :min="1" :max="maxDay" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="applyForEquipmentForm.remark"
              type="textarea"
              style="width:400px"
              :autosize="{ minRows: 2, maxRows: 3}"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogApplyForEquipment = false">返 回</el-button>
          <el-button type="primary" size="mini" @click="dialogApplyForEquipment = false;submitApplyEquForm()">提 交
          </el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 普通用户的申请[抽屉]表格 -->
    <div>
      <el-drawer
        title="我的申请记录"
        :visible.sync="myApplyTable"
        direction="rtl"
        size="60%"
      >
        <div>
          <el-tabs v-model="activeName" type="border-card" style="left: 100px" @tab-click="handleClick()">
            <el-tab-pane label="审核中" name="first">
              <el-table :data="myApplyTableData" stripe>
                <el-table-column property="userName" label="申请人" width="70" />
                <el-table-column property="equName" label="申请设备" width="80" />
                <el-table-column property="equQuantity" label="申请数量" width="80" />
                <el-table-column property="approvalTime" label="申请时间" width="170" />
                <el-table-column property="approvalStatusName" label="审核状态" width="100">
                  <template slot-scope="{row}">
                    <el-tag :type="row.status | statusFilter">
                      {{ row.status }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center">
                  <template slot-scope="{row,$index}">
                    <el-button
                      type="text"
                      size="mini"
                      icon="el-icon-circle-check"
                    >查看
                    </el-button>
                    <el-button
                      v-if="row.status==='审核中'||row.status==='待审核'||row.status==='审核不通过'"
                      type="text"
                      size="mini"
                      icon="el-icon-thumb"
                      @click="handleCancelApplication(row)"
                    >取消
                    </el-button>
                    <el-button
                      v-if="row.status === '审核不通过'"
                      type="text"
                      size="mini"
                      icon="el-icon-circle-check"
                      @click="handleReApply(row)"
                    >重申
                    </el-button>
                    <el-button
                      v-if="row.status === '审核通过'"
                      type="text"
                      size="mini"
                      icon="el-icon-circle-check"
                      @click="handleUseEquipment(row)"
                    >使用设备
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="使用中" name="second">
              <el-table :data="usingEquTableTableData">
                <el-table-column property="userName" label="申请人" width="70" />
                <el-table-column property="equName" label="设备" width="80" />
                <el-table-column property="equQuantity" label="数量" width="80" />
                <el-table-column property="approvalTime" label="时间" width="170" />
                <el-table-column property="approvalStatusName" label="设备状态" width="100">
                  <template slot-scope="{row}">
                    <el-tag :type="row.status | statusFilter">
                      {{ row.status }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center">
                  <template slot-scope="{row,$index}">
                    <el-button
                      type="text"
                      size="mini"
                      icon="el-icon-circle-check"
                    >查看
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      icon="el-icon-circle-check"
                      @click="handleReturnThisEquipment(row)"
                    >归还
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-drawer>
    </div>
    <!-- 管理员的审核[抽屉]表格 -->
    <div>
      <el-drawer
        title="设备申请归还记录"
        :visible.sync="myApproveTable"
        direction="rtl"
        size="60%"
      >
        <el-tabs v-model="activeName" type="border-card" style="left: 100px" @tab-click="handleClick()">
          <el-tab-pane label="待审核申请" name="first">
            <el-divider content-position="left"><i class="el-icon-s-check">《待审表》</i></el-divider>
            <el-table :data="myApproveTableData" stripe>
              <el-table-column property="userName" label="申请人" align="center" width="60" />
              <el-table-column property="equName" label="设备" align="center" width="60" />
              <el-table-column property="equQuantity" label="数量" align="center" width="60" />
              <el-table-column property="approvalTime" label="申请时间" align="center" width="160" />
              <el-table-column label="审核状态" align="center" width="80">
                <template slot-scope="{row}">
                  <el-tag :type="row.status | statusFilter">
                    {{ row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" align="center">
                <template slot-scope="{row,$index}">
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-thumb"
                    @click="approveInnerDrawer=true;handleShowOneApproval(row)"
                  >查看
                  </el-button>
                  <el-button
                    v-if="row.status === '待审核'||row.status === '审核中'"
                    type="text"
                    size="mini"
                    icon="el-icon-circle-check"
                    @click="handlePassOneApproval(row)"
                  >通过
                  </el-button>
                  <el-button
                    v-if="row.status === '待审核'||row.status === '审核中'"
                    type="text"
                    size="mini"
                    icon="el-icon-circle-close"
                    @click="handleRejectOneApproval(row)"
                  >驳回
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="用户已归还" name="second">
            <el-divider content-position="left"><i class="el-icon-star-on">《已归还设备表》</i></el-divider>
            <el-table :data="returnedEquTableTableData">
              <el-table-column property="userName" label="归还人" align="center" width="60" />
              <el-table-column property="equName" label="设备" align="center" width="60" />
              <el-table-column property="equQuantity" label="数量" align="center" width="60" />
              <el-table-column property="equReturnTime" label="归还时间" align="center" width="140" />
              <el-table-column label="设备状态" align="center" width="80">
                <template slot-scope="{row}">
                  <el-tag :type="row.status | statusFilter">
                    {{ row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" align="center">
                <template slot-scope="{row,$index}">
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-thumb"
                    @click="approveInnerDrawer=true;handleShowOneApproval(row)"
                  >查看
                  </el-button>
                  <el-button
                    v-if="row.status === '设备已归还'||row.status === '设备维修中'"
                    type="text"
                    size="mini"
                    icon="el-icon-circle-check"
                    @click="dialogStoreThisEquipmentVisible = true;handleStoreThisEquipment(row)"
                  >入库
                  </el-button>
                  <el-button
                    v-if="row.status === '设备已归还'"
                    type="text"
                    size="mini"
                    icon="el-icon-circle-check"
                    @click="dialogRepairThisEquipmentVisible = true;handleRepairThisEquipment(row)"
                  >维修
                  </el-button>
                  <el-button
                    v-if="row.status === '设备已归还'||row.status === '设备维修中'"
                    type="text"
                    size="mini"
                    icon="el-icon-circle-close"
                    @click="dialogScrapThisEquipmentVisible = true;handleScrapThisEquipment(row)"
                  >报废
                  </el-button>
                  <el-button
                    v-if="row.status === '设备已入库'||row.status === '设备已报废'"
                    type="text"
                    size="mini"
                    icon="el-icon-folder-checked"
                    @click="completeABorrowingRecord(row)"
                  >完成记录
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="设备已入库" name="third">
            <el-divider content-position="left"><i class="el-icon-success">《已入库设备名单》</i></el-divider>
            <el-table :data="storedEquTableTableData">
              <el-table-column property="userName" label="入库人" align="center" width="60" />
              <el-table-column property="equName" label="设备" align="center" width="60" />
              <el-table-column property="equQuantity" label="数量" align="center" width="60" />
              <el-table-column property="equReturnTime" label="入库时间" align="center" width="140" />
              <el-table-column label="设备状态" align="center" width="80">
                <template slot-scope="{row}">
                  <el-tag :type="row.status | statusFilter">
                    {{ row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" align="center">
                <template slot-scope="{row,$index}">
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-thumb"
                    @click="approveInnerDrawer=true;handleShowOneApproval(row)"
                  >查看
                  </el-button>
                  <el-button
                    v-if="row.status === '设备已入库'||row.status === '设备已报废'"
                    type="text"
                    size="mini"
                    icon="el-icon-folder-checked"
                    @click="completeABorrowingRecord(row)"
                  >完成记录
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="设备维修中" name="fourth">
            <el-divider content-position="left"><i class="el-icon-loading" />&emsp;<span>《维修中设备表》</span></el-divider>
            <el-table :data="maintainEquTableTableData">
              <el-table-column property="userName" label="送修人" align="center" width="70" />
              <el-table-column property="equName" label="维修设备" align="center" width="70" />
              <el-table-column property="equQuantity" label="维修数量" align="center" width="70" />
              <el-table-column property="equMaintainTime" label="送修时间" align="center" width="150" />
              <el-table-column label="设备状态" align="center" width="90">
                <template slot-scope="{row}">
                  <el-tag :type="row.status | statusFilter">
                    {{ row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" align="center">
                <template slot-scope="{row,$index}">
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-thumb"
                    @click="approveInnerDrawer=true;handleShowOneApproval(row)"
                  >查看
                  </el-button>
                  <el-button
                    v-if="row.status === '维修已完成'"
                    type="text"
                    size="mini"
                    icon="el-icon-circle-check"
                    @click="dialogStoreThisEquipmentVisible = true;handleStoreThisEquipment(row)"
                  >入库
                  </el-button>
                  <el-button
                    v-if="row.status === '维修已完成'"
                    type="text"
                    size="mini"
                    icon="el-icon-circle-close"
                    @click="dialogScrapThisEquipmentVisible = true;handleScrapThisEquipment(row)"
                  >报废
                  </el-button>
                  <el-button
                    v-if="row.status === '设备已入库'||row.status === '设备已报废'"
                    type="text"
                    size="mini"
                    icon="el-icon-folder-checked"
                    @click="completeABorrowingRecord(row)"
                  >完成记录
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="设备已报废" name="fifth">
            <el-divider content-position="left"><i class="el-icon-delete-solid">《已报废设备表》</i></el-divider>
            <el-table :data="scrapEquTableTableData">
              <el-table-column property="userName" label="操作人" align="center" width="60" />
              <el-table-column property="equName" label="设备" align="center" width="60" />
              <el-table-column property="equQuantity" label="数量" align="center" width="60" />
              <el-table-column property="equReturnTime" label="报废时间" align="center" width="140" />
              <el-table-column label="设备状态" align="center" width="80">
                <template slot-scope="{row}">
                  <el-tag :type="row.status | statusFilter">
                    {{ row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" align="center">
                <template slot-scope="{row,$index}">
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-thumb"
                    @click="approveInnerDrawer=true;handleShowOneApproval(row)"
                  >查看
                  </el-button>
                  <el-button
                    v-if="row.status === '设备已入库'||row.status === '设备已报废'"
                    type="text"
                    size="mini"
                    icon="el-icon-folder-checked"
                    @click="completeABorrowingRecord(row)"
                  >完成记录
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <el-drawer
          title="用户的申请信息"
          :append-to-body="true"
          :before-close="handleBeforeCloseInner"
          :visible.sync="approveInnerDrawer"
          size="25%"
        >
          <el-form label-position="right" label-width="120px" :model="innerForm" style="margin-right: 30px">
            <el-form-item label="申请人">
              <el-input v-model="innerForm.userName" readonly />
            </el-form-item>
            <el-form-item label="申请设备">
              <el-input v-model="innerForm.equName" readonly />
            </el-form-item>
            <el-form-item label="申请数量">
              <el-input v-model="innerForm.equQuantity" readonly />
            </el-form-item>
            <el-form-item label="使用方向">
              <el-input v-model="innerForm.equUseCate" readonly />
            </el-form-item>
            <el-form-item label="发起申请时间">
              <el-input v-model="innerForm.approvalTime" readonly />
            </el-form-item>
            <el-form-item label="申请使用时间">
              <el-input v-model="innerForm.equUseTime" readonly />
            </el-form-item>
            <el-form-item label="借用设备天数">
              <el-input v-model="innerForm.equDay" readonly />
            </el-form-item>
            <el-form-item label="申请备注">
              <el-input
                v-model="innerForm.remark"
                :autosize="{ minRows: 2, maxRows: 3}"
                type="textarea"
                readonly
              />
            </el-form-item>
            <el-form-item label="当前审核状态">
              <el-input v-model="innerForm.status" readonly />
            </el-form-item>
          </el-form>
          <div style="float: right;margin-right: 30px">
            <el-button
              v-if="innerForm.status === '待审核'||innerForm.status === '审核中'"
              type="warning"
              size="mini"
              icon="el-icon-circle-close"
              @click="handleRejectOneApproval(innerForm)"
            >驳回
            </el-button>
            <el-button
              v-if="innerForm.status === '待审核'||innerForm.status === '审核中'"
              type="success"
              size="mini"
              icon="el-icon-circle-check"
              @click="handlePassOneApproval(innerForm)"
            >通过
            </el-button>
          </div>
        </el-drawer>
      </el-drawer>
    </div>
    <!-- 负责人详细信息 模态框 -->
    <div>
      <el-dialog title="设备负责人详细信息" :visible.sync="dialogEquUserDetailFormVisible">
        <el-form ref="detailForm" :inline="true" :model="equUserDetailForm" label-width="100px" size="mini">
          <el-form-item label="用户id" class="change-label-class">
            <el-input v-model="equUserDetailForm.id" disabled readonly />
          </el-form-item>
          <el-form-item label="登录名">
            <el-input v-model="equUserDetailForm.loginName" readonly />
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input v-model="equUserDetailForm.realName" readonly />
          </el-form-item>
          <el-form-item label="性别">
            <el-radio v-model="equUserDetailForm.userSex" label="男" disabled>男</el-radio>
            <el-radio v-model="equUserDetailForm.userSex" label="女" disabled>女</el-radio>
            <el-radio v-model="equUserDetailForm.userSex" label="保密" disabled>保密</el-radio>
          </el-form-item>
          <el-form-item label="用户角色">
            <el-select v-model="inChargeUserRoles" multiple placeholder="用户角色列表" disabled>
              <el-option v-for="item in roleInfo" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="负责设备库">
            <el-input v-model="equUserDetailForm.userRoom" readonly />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="equUserDetailForm.userPhone" readonly />
          </el-form-item>
          <el-form-item label="电子邮箱">
            <el-input v-model="equUserDetailForm.userEmail" readonly />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="equUserDetailForm.createTime" readonly />
          </el-form-item>
          <el-form-item label="登录时间">
            <el-input v-model="equUserDetailForm.loginTime" readonly />
          </el-form-item>
          <el-form-item label="上一次登录">
            <el-input v-model="equUserDetailForm.lastLoginTime" readonly />
          </el-form-item>
          <el-form-item label="登录次数">
            <el-input v-model="equUserDetailForm.loginCount" readonly />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="equUserDetailForm.remark"
              style="width:400px"
              :autosize="{ minRows: 2, maxRows: 3}"
              type="textarea"
              placeholder="用户备注信息..."
              readonly
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogEquUserDetailFormVisible = false">返 回</el-button>
          <el-button type="primary" size="mini" @click="dialogEquUserDetailFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 编辑设备信息 模态框 -->
    <div>
      <el-dialog title="编辑设备" :visible.sync="dialogModifyFormVisible">
        <el-form ref="dataForm" :inline="true" :model="detailForm" label-width="100px" size="mini">
          <el-form-item label="设备id" class="change-label-class">
            <el-input v-model="detailForm.id" disabled readonly />
          </el-form-item>
          <el-form-item label="设备编号" class="change-label-class">
            <el-input v-model="detailForm.equCode" />
          </el-form-item>
          <el-form-item label="设备名">
            <el-input v-model="detailForm.equName" />
          </el-form-item>
          <el-form-item label="设备类别">
            <el-select v-model="detailForm.equCate" class="filter-item" placeholder="请选择设备类别...">
              <el-option v-for="(item,index) in equCateInfo" :key="item" :label="item" :value="index+1" />
            </el-select>
          </el-form-item>
          <el-form-item label="生产厂商">
            <el-input v-model="detailForm.equFirm" />
          </el-form-item>
          <el-form-item label="设备品牌">
            <el-input v-model="detailForm.equBrand" />
          </el-form-item>
          <el-form-item label="设备型号">
            <el-input v-model="detailForm.equModel" />
          </el-form-item>
          <el-form-item label="设备规格">
            <el-input v-model="detailForm.equStandard" />
          </el-form-item>
          <el-form-item label="设备单价">
            <el-input v-model="detailForm.equPrice" />
          </el-form-item>
          <el-form-item label="库存数量">
            <el-input v-model="detailForm.equQuantity" />
          </el-form-item>
          <el-form-item label="出厂日期">
            <el-input v-model="detailForm.outFirmTime" readonly disabled />
          </el-form-item>
          <el-form-item label="购置日期">
            <el-input v-model="detailForm.purchaseTime" readonly disabled />
          </el-form-item>
          <el-form-item label="入库日期">
            <el-input v-model="detailForm.purchaseTime" readonly disabled />
          </el-form-item>
          <el-form-item label="使用年限">
            <el-input v-model="detailForm.equLife" />
          </el-form-item>
          <el-form-item label="目前状态">
            <el-select v-model="detailForm.equState" class="filter-item" placeholder="请选择设备状态...">
              <el-option v-for="(item,index) in equStateInfo" :key="item" :label="item" :value="index+1" />
            </el-select>
          </el-form-item>
          <el-form-item label="存放实践室">
            <el-select v-model="detailForm.equRoom" class="filter-item" placeholder="请选择实践室...">
              <el-option v-for="(item,index) in equRoomInfo" :key="item" :label="item" :value="index+1" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备负责人">
            <el-select v-model="detailForm.equUser" class="filter-item" placeholder="请选择设备状态...">
              <el-option v-for="(item,index) in equUserInfo" :key="item" :label="item" :value="index+1" />
            </el-select>
          </el-form-item>
          <el-form-item label="主要电器参数">
            <el-input v-model="detailForm.equOtherParam" style="width: 400px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="detailForm.remark"
              style="width:400px"
              :autosize="{ minRows: 2, maxRows: 3}"
              type="textarea"
              placeholder="用户备注信息..."
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogModifyFormVisible = false">取 消</el-button>
          <el-button size="mini" @click="clearDetailForm">清 空</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="dialogModifyFormVisible = false;submitModifyForm()"
          >
            修 改
          </el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 设备使用完毕入库 模态框 -->
    <el-dialog title="入库用户归还的设备" :visible.sync="dialogStoreThisEquipmentVisible">
      <el-form :model="storageForm">
        <el-form-item label="入库设备名称" :label-width="storageFormLabelWidth">
          <el-input v-model="storageForm.equName" autocomplete="off" />
        </el-form-item>

        <el-form-item label="入库数量" :label-width="storageFormLabelWidth">
          <el-input-number
            v-model="storageForm.storageQuantity"
            :min="1"
            :max="storageForm.returnQuantity"
            :step="1"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogStoreThisEquipmentVisible = false">取 消</el-button>
        <el-button
          type="success"
          @click="dialogStoreThisEquipmentVisible = false;submitStoreThisEquipment()"
        >入 库
        </el-button>
      </div>
    </el-dialog>
    <!-- 设备使用完毕维修 模态框 -->
    <div>
      <el-dialog title="设备故障报修表" :visible.sync="dialogRepairThisEquipmentVisible">
        <el-form ref="repairForm" :model="repairForm" label-width="100px" size="mini">
          <el-form-item label="填表日期">
            <el-col :span="11">
              <el-date-picker
                v-model="repairForm.approvalTime"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
                readonly
              />
            </el-col>
          </el-form-item>
          <el-form-item label="故障发生日期">
            <el-col :span="11">
              <el-date-picker
                v-model="repairForm.equDowntime"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-col>
          </el-form-item>
          <el-form-item label="故障设备名称">
            <el-input v-model="repairForm.equName" readonly />
          </el-form-item>
          <el-form-item label="报修数量">
            <el-input-number
              v-model="repairForm.maintainQuantity"
              :min="1"
              :max="repairForm.returnQuantity"
              :step="1"
            />
          </el-form-item>
          <el-form-item label="设备负责人">
            <el-input v-model="repairForm.userName" readonly />
          </el-form-item>

          <el-form-item label="故障说明">
            <el-input
              v-model="repairForm.remark"
              style="width:400px"
              :autosize="{ minRows: 2, maxRows: 3}"
              type="textarea"
              placeholder="简单说明故障设备的情况..."
            />
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogRepairThisEquipmentVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" plain @click="">清 空</el-button>
          <el-button
            type="warning"
            size="mini"
            @click="dialogRepairThisEquipmentVisible = false;submitRepairThisEquipment()"
          >
            维 修
          </el-button>
        </div>
      </el-dialog>
    </div>
    <!--    <el-dialog title="维修用户归还的设备" :visible.sync="dialogRepairThisEquipmentVisible">
          <el-form :model="repairForm">
            <el-form-item label="填表日期">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="repairForm.date1" style="width: 100%;"
                ></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="故障发生日期">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="repairForm.date1" style="width: 100%;"
                ></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="报修设备名称">
              <el-input v-model="repairForm.name"></el-input>
            </el-form-item>
            <el-form-item label="报修数量">
              <el-input-number v-model="repairForm.storageQuantity"
                               :min="1"
                               :max="repairForm.returnQuantity"
                               :step="1"
              />
            </el-form-item>
            <el-form-item label="设备负责人">
              <el-input v-model="repairForm.name"></el-input>
            </el-form-item>
            <el-form-item label="故障说明">
              <el-input v-model="repairForm.name"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogRepairThisEquipmentVisible = false">取 消</el-button>
            <el-button
              type="warning"
              @click="dialogRepairThisEquipmentVisible = false;submitRepairThisEquipment()"
            >维 修
            </el-button>
          </div>
        </el-dialog>-->
    <!-- 设备使用完毕报废 模态框 -->
    <el-dialog title="报废用户归还的设备" :visible.sync="dialogScrapThisEquipmentVisible">
      <el-form :model="scrapForm">
        <el-form-item label="报废设备名称" :label-width="storageFormLabelWidth">
          <el-input v-model="scrapForm.equName" autocomplete="off" />
        </el-form-item>

        <el-form-item label="报废数量" :label-width="storageFormLabelWidth">
          <el-input-number
            v-model="scrapForm.scrapQuantity"
            :min="1"
            :max="scrapForm.returnQuantity"
            :step="1"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogScrapThisEquipmentVisible = false">取 消</el-button>
        <el-button
          type="danger"
          @click="dialogScrapThisEquipmentVisible = false;submitScrapThisEquipment()"
        >报 废
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createArticle, fetchPv, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import MdInput from '@/components/MDinput'
import { fetchEquListByQuery, getEquList, getRoomInfo } from '@/api/table'
import {
  addEqu,
  applyInfoForUseEquipment,
  deleteEqu,
  getEquById,
  getEquCate,
  getEquState,
  getEquUseCate,
  modifyEqu,
  showMyApplyRecords,
  showMyApprovalRecords,
  cancelApplication,
  showOneApproval,
  passOneApproval,
  startUseEquipment,
  rejectOneApproval,
  reApplyUseEquipment,
  removeOneApproval,
  returnThisEquipment,
  showReturnedEqu,
  showStoredEqu,
  showScrappedEqu,
  showUsingEqu,
  storeReturnedEqu,
  storePartReturnedEqu,
  maintainReturnedEqu,
  scrapReturnedEqu,
  scrapPartReturnedEqu,
  recordALog
} from '@/api/equipment'
import { getAllUsers, getUserByLoginName } from '@/api/user'
import permission from '@/directive/permission'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  inject: ['reload'],
  name: 'EquTable',
  components: {
    Pagination,
    MdInput
  },
  directives: { waves, permission },
  filters: {
    statusFilter(status) {
      const statusMap = {
        待审核: 'info',
        审核中: 'info',
        审核通过: '',
        审核不通过: 'warning',

        设备使用中: '',
        设备已归还: 'info',
        设备已入库: '',
        设备维修中: 'warning',
        设备已报废: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      currentRoom: this.$store.getters.room,
      // 默认 详细信息、修改模态框 表单不可见（通过点击按钮方可显示）
      dialogDetailFormVisible: false,
      dialogApplyForEquipment: false,
      dialogShowMyApply: false,
      dialogEquUserDetailFormVisible: false,
      dialogModifyFormVisible: false,
      dialogAddFormVisible: false,
      dialogStoreThisEquipmentVisible: false,
      dialogScrapThisEquipmentVisible: false,
      dialogRepairThisEquipmentVisible: false,

      // 当前页面所有设备的简略信息
      equTableData: null,
      // 详细的设备表单信息
      detailForm: {
        id: null,
        equCode: null,
        equName: null,
        equCate: null,
        equFirm: null,
        equModel: null,
        equStandard: null,
        equBrand: null,
        equOtherParam: null,
        equPrice: null,
        equQuantity: null,
        outFirmTime: null,
        purchaseTime: null,
        storageTime: null,
        equLife: null,
        equRoom: null,
        equUser: null,
        equState: null,
        remark: null
      },
      // 普通用户申请使用设备的信息（设备有库存且状态为可借用方能申请）
      applyForEquipmentForm: {
        id: null,
        equName: null,
        equQuantity: 1,
        equUseCate: null,
        equUseTime1: null,
        equUseTime2: null,
        equDay: null,
        remark: null
      },
      // 设备入库表单
      storageForm: {
        id: '',
        userName: '',
        equName: '',
        storageQuantity: 1,
        returnQuantity: null
      },
      // 设备报修表单
      repairForm: {
        id: null,
        approvalTime: '',
        equDowntime: '',
        equName: '',
        userName: '',
        maintainQuantity: null,
        returnQuantity: null,
        remark: ''
      },
      // 设备报废表单
      scrapForm: {
        id: '',
        equName: '',
        scrapQuantity: 1,
        returnQuantity: null
      },
      storageFormLabelWidth: '120px',

      // minNum: 1,
      equNum: 1,
      maxNum: 100,
      // minDay: 1,
      equDay: 1,
      maxDay: 31,
      admin_to_do_number: '',
      visitor_to_do_number: '',

      myApplyTable: false,
      myApproveTable: false,
      approveInnerDrawer: false,

      innerForm: {
        id: '',
        userName: '',
        equName: '',
        equQuantity: '',
        equUseCate: '',
        approvalTime: '',
        equUseTime: '',
        equReturnTime: '',
        equDay: '',
        remark: '',
        status: ''
      },

      activeName: 'first',

      // 普通用户的申请记录列表
      myApplyTableData: null,
      // 管理员的审核列表
      myApproveTableData: null,
      // 归还的设备列表
      returnedEquTableTableData: null,
      // 入库的设备列表
      storedEquTableTableData: null,
      // 维修的设备列表
      // maintainEquTableTableData: {
      //   userName: '阿华',
      //   equName: '高精度分析仪',
      //   equQuantity: 3,
      //   equMaintainTime: '2021-03-19'
      // },
      maintainEquTableTableData: null,
      // 报废的设备列表
      scrapEquTableTableData: null,
      // 使用中的设备列表
      usingEquTableTableData: null,

      // 方便在设备列表查看负责人信息
      equUserDetailForm: {
        id: null,
        loginName: null,
        loginPwd: null,
        realName: null,
        userSex: null,
        userRole: null,
        userRoom: null,
        userPhone: null,
        userEmail: null,
        createTime: null,
        loginTime: null,
        lastLoginTime: null,
        loginCount: null
      },

      inChargeUserRoles: [],
      roleInfo: [],

      // 几个外键select数组
      /* [][][]  */
      equCateInfo: [],
      equStateInfo: [],
      equUseCateInfo: [],
      equRoomInfo: [],
      equUserInfo: [],

      /* 有关分页导航条的信息 */
      isPageSinglePage: true, // 查询的所有数据只有一页？true：隐藏导航条；false：展示导航条。
      total: null, // 总共的记录条数
      pages: this.$store.state.pages, // 共有多少页
      currentPage: this.$store.state.currentPage, // 第一次请求默认就是第1页，取5条数据展示在第1页
      currentSize: this.$store.state.currentSize, // 指定当前页需要展示多少条数据
      arrays: [3, 5, 9, 11, 15, 20, 100], // 指定每一页显示多少条数据

      /* 框架自带 */
      tableKey: 0,
      list: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        equKeyWord: undefined,
        equCate: undefined,
        equRoom: undefined,
        equState: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showLoginName: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  watch: {},
  created() {
    // 第一次进入设备列表页面，自动加载页面。
    // this.getList()
    const page = this.currentPage
    const size = this.currentSize

    // 加载当前用户的 申请列表或者审批列表
    this.handleShowMyApplyOrApproval()
    // 加载设备分页列表
    this.getEquList(page, size)
    // getEquCate 获取所有设备类别的信息
    this.getEquCate()
    // getEquState 获取所有设备目前状态信息
    this.getEquState()
    // getEquUseCate 获取所有 供设备使用的方向信息
    this.getEquUseCate()
    // getRoomInfo 获取所有设备仓库（实践室）的信息
    this.getRoomInfo()
    // getAllUsers 获取所有设备管理员的信息
    this.getAllUsers()
  },
  mounted() {
    this.$nextTick(function() {
      // Code that will run only after the entire view has been rendered
    })
  },
  methods: {
    // getEquList()
    getEquList(page, size) {
      new Promise((resolve, reject) => {
        getEquList({ page: page, limit: size })
          .then(resp => {
            this.backendTransferToFrontend(resp)
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // getEquCate()
    getEquCate() {
      new Promise((resolve, reject) => {
        getEquCate()
          .then(resp => {
            for (let i = 0; i < resp.data.length; i++) {
              this.equCateInfo[i] = resp.data[i].cateName
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // getEquState
    getEquState() {
      new Promise((resolve, reject) => {
        getEquState()
          .then(resp => {
            for (let i = 0; i < resp.data.length; i++) {
              this.equStateInfo[i] = resp.data[i].equState
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // getEquUseCate
    getEquUseCate() {
      new Promise((resolve, reject) => {
        getEquUseCate()
          .then(resp => {
            for (let i = 0; i < resp.data.length; i++) {
              this.equUseCateInfo[i] = resp.data[i].useCate
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // getRoomInfo
    getRoomInfo() {
      new Promise((resolve, reject) => {
        getRoomInfo()
          .then(resp => {
            for (let i = 0; i < resp.data.length; i++) {
              this.equRoomInfo[i] = resp.data[i].roomName
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // getAllUsers
    getAllUsers() {
      new Promise((resolve, reject) => {
        getAllUsers()
          .then(resp => {
            for (let i = 0; i < resp.data.length; i++) {
              this.equUserInfo[i] = resp.data[i].loginName
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    handleBeforeCloseInner(done) {
      console.log('工作完成，关闭抽屉！！！！！！！')
      done()
      // this.$confirm('还有未保存的工作哦确定关闭吗？')
      //   .then(_ => {
      //     done()
      //   })
      //   .catch(_ => {
      //   })
    },
    // 后台数据 ===> 前端数据
    backendTransferToFrontend(resp) {
      this.total = resp.data.total
      this.pages = resp.data.pages
      this.currentSize = resp.data.size
      for (const record of resp.data.data) {
        record.equPrice = '￥' + record.equPrice
      }
      this.equTableData = resp.data.data
    },
    // 加载列表操作
    getListByQuery() {
      this.listLoading = true
      const query = {
        page: this.currentPage,
        limit: this.currentSize,
        equName: this.listQuery.equKeyWord,
        equCate: this.listQuery.equCate,
        equRoom: this.listQuery.equRoom,
        equState: this.listQuery.equState
      }
      new Promise((resolve, reject) => {
        fetchEquListByQuery(query)
          .then((resp) => {
            this.listLoading = false
            this.backendTransferToFrontend(resp)
            resolve(resp)
          }, (err) => {
            this.listLoading = false
            reject(err)
          })
      })
    },
    // 用于添加/修改设备的时候清空表单
    clearDetailForm() {
      this.detailForm.id = null
      this.detailForm.equCode = null
      this.detailForm.equName = null
      this.detailForm.equCate = null
      this.detailForm.equFirm = null
      this.detailForm.equModel = null
      this.detailForm.equStandard = null
      this.detailForm.equBrand = null
      this.detailForm.equOtherParam = null
      this.detailForm.equPrice = null
      this.detailForm.equQuantity = null
      this.detailForm.outFirmTime = null
      this.detailForm.purchaseTime = null
      this.detailForm.equLife = null
      this.detailForm.equRoom = null
      this.detailForm.equUser = null
      this.detailForm.equState = null
      this.detailForm.remark = null
    },
    // 清空申请表单，保留默认值。
    clearApplyForEquipmentForm() {
      this.equNum = ''
      this.equDay = ''

      const form = this.applyForEquipmentForm
      form.id = undefined
      form.equName = undefined
      form.equQuantity = undefined
      form.equUseCate = undefined
      form.equUseTime1 = undefined
      form.equUseTime2 = undefined
      form.remark = undefined
    },
    // 处理新添加一个设备的请求
    handleAddEqu() {
      this.clearDetailForm()
      // this.resetForm('detailForm')
      // this.dialogAddFormVisible = true
      /* this.resetTemp()
      this.dialogStatus = 'create'*/
      /* this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })*/
    },
    // 提交添加表单请求
    submitAddForm() {
      const form = this.detailForm
      form.outFirmTime = form.outFirmTime.getTime()
      form.purchaseTime = form.purchaseTime.getTime()
      form.equLife = parseInt(form.equLife)
      form.equPrice = parseFloat(form.equPrice)
      form.equQuantity = parseInt(form.equQuantity)
      form.equUser = this.$store.getters.realName
      form.equRoom = this.$store.getters.room
      new Promise((resolve, reject) => {
        addEqu(form)
          .then(resp => {
            console.log(resp)
            const isSuccess = resp.data.code === 1
            const updatedUserId = resp.data.t.id
            isSuccess
              ? this.$message({
                showClose: true,
                message: '设备【' + this.detailForm.loginName + '】入库成功。',
                type: 'success'
              })
              : this.$message({
                // 失败，给出提示信息
                showClose: true,
                message: '设备【' + this.detailForm.loginName + '】入库失败，请检查后重新提交。',
                type: 'warning'
              })
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 处理展示设备详情信息请求
    handleShowEqu(row) {
      this.detailForm = row
    },
    // 处理普通用户点击申请使用设备
    handleApplyForEquipment(row) {
      // 清空表单，保留默认值
      this.clearApplyForEquipmentForm()
      this.applyForEquipmentForm.id = row.id
      new Promise((resolve, reject) => {
        getEquById(row.id)
          .then(resp => {
            this.detailForm = resp.data
            this.applyForEquipmentForm.equName = this.detailForm.equName
            this.applyForEquipmentForm.equQuantity = this.detailForm.equQuantity
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 提交申请使用设备的请求
    submitApplyEquForm() {
      const form = this.applyForEquipmentForm
      const data = {
        userId: this.$store.getters.id,
        equId: form.id,
        equQuantity: this.equNum,
        equUseCate: form.equUseCate,
        equUseTime: form.equUseTime1.getTime(),
        equDay: this.equDay,
        remark: form.remark
      }
      new Promise((resolve, reject) => {
        applyInfoForUseEquipment(data)
          .then(resp => {
            const isSuccess = resp.data === true
            isSuccess
              ? this.$message({
                showClose: true,
                message: '申请成功，等待审核。',
                type: 'success'
              })
              : this.$message({
                showClose: true,
                message: '申请失败，请检查后重新提交。',
                type: 'warning'
              })
            this.getEquList(this.currentPage, this.currentSize)
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 处理 用户点击查看‘我的申请’ 或者 管理员点击查看‘申请与归还’
    handleShowMyApplyOrApproval() {
      const roles = this.$store.getters.roles
      roles.includes('VISITOR')
      const AdminOrSuper = roles.includes('ADMIN') || roles.includes('SUPERADMIN')
      if (AdminOrSuper) {
        // 待审核申请
        new Promise((resolve, reject) => {
          showMyApprovalRecords()
            .then(resp => {
              this.myApproveTableData = resp.data
              const l = resp.data.length
              this.admin_to_do_number = l === 0 ? '' : l
              for (const e of this.myApproveTableData) {
                e.status = e.approvalStatusName
              }
              this.getEquList(this.currentPage, this.currentSize)
              resolve(resp)
            })
            .catch(err => {
              reject(err)
            })
        })
        // 用户已归还
        new Promise((resolve, reject) => {
          showReturnedEqu()
            .then(resp => {
              this.returnedEquTableTableData = resp.data
              for (const e of this.returnedEquTableTableData) {
                e.status = e.approvalStatusName
              }
              resolve(resp)
            })
            .catch(err => {
              reject(err)
            })
        })
        // 设备已入库
        new Promise((resolve, reject) => {
          showStoredEqu()
            .then(resp => {
              this.storedEquTableTableData = resp.data
              this.storedEquTableTableData.forEach(e => {
                e.status = e.approvalStatusName
                e.userName = this.$store.getters.realName
              })
              resolve(resp)
            })
            .catch(err => {
              reject(err)
            })
        })
        // 设备已报废
        new Promise((resolve, reject) => {
          showScrappedEqu()
            .then(resp => {
              this.scrapEquTableTableData = resp.data
              this.scrapEquTableTableData.forEach(e => {
                e.status = e.approvalStatusName
                e.userName = this.$store.getters.realName
              })
              resolve(resp)
            })
            .catch(err => {
              reject(err)
            })
        })
      } else {
        // 获取申请记录（审核中）
        new Promise((resolve, reject) => {
          showMyApplyRecords()
            .then(resp => {
              this.myApplyTableData = resp.data
              const l = resp.data.length
              this.visitor_to_do_number = l === 0 ? '' : l
              for (const e of this.myApplyTableData) {
                e.status = e.approvalStatusName
              }
              this.getEquList(this.currentPage, this.currentSize)
              resolve(resp)
            })
            .catch(err => {
              reject(err)
            })
        })
        // 使用中
        new Promise((resolve, reject) => {
          showUsingEqu()
            .then(resp => {
              this.usingEquTableTableData = resp.data
              for (const e of this.usingEquTableTableData) {
                e.status = e.approvalStatusName
              }
              resolve(resp)
            })
            .catch(err => {
              reject(err)
            })
        })
      }
    },
    // 切换抽屉内嵌的标签页
    handleClick() {
      this.handleShowMyApplyOrApproval()
    },
    // 普通用户取消申请设备的使用
    handleCancelApplication(row) {
      this.$confirm('取消申请？', '申请操作', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '返回',
        type: 'warning'
      })
        .then(() => {
          new Promise((resolve, reject) => {
            cancelApplication(row.id)
              .then(resp => {
                const isSuccess = resp.data === true
                isSuccess
                  ? this.$message({
                    showClose: true,
                    message: '取消申请成功',
                    type: 'success',
                    duration: 5000
                  })
                  : this.$message({
                    showClose: true,
                    message: '取消申请失败，请检查后重新提交。',
                    type: 'warning',
                    duration: 0
                  })
                this.handleShowMyApplyOrApproval()
                resolve(resp)
              })
              .catch(err => {
                reject(err)
              })
          })
        })
    },
    // 管理员点击：’显示已归还的设备‘
    handleShowReturnedEqu() {
      new Promise((resolve, reject) => {
        showReturnedEqu()
          .then(resp => {
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 管理员查看普通用户申请详情
    handleShowOneApproval(row) {
      this.innerForm = row
      new Promise((resolve, reject) => {
        showOneApproval(row.id)
          .then(resp => {
            this.handleShowMyApplyOrApproval()
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 管理员通过普通用户申请
    handlePassOneApproval(row) {
      this.$confirm('确定通过？', '审核申请', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '返回',
        type: 'success'
      })
        .then(() => {
          new Promise((resolve, reject) => {
            passOneApproval(row.id)
              .then(resp => {
                this.handleShowMyApplyOrApproval()
                row.status = '审核通过'
                this.handleShowOneApproval(row)
                resolve(resp)
              })
              .catch(err => {
                reject(err)
              })
          })
        })
    },
    // 普通用户开始 使用设备
    handleUseEquipment(row) {
      this.$confirm('开始使用', '开始使用', {
        distinguishCancelAndClose: true,
        confirmButtonText: '使用',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
          new Promise((resolve, reject) => {
            startUseEquipment(row.id)
              .then(resp => {
                this.handleShowOneApproval(row)
                this.$notify({
                  title: 'SUCCESS',
                  dangerouslyUseHTMLString: true,
                  message: '开始使用设备【xxx】，<br/>请于xx月xx日之前归还。',
                  type: 'success',
                  duration: 0
                })
                resolve(resp)
              })
              .catch(err => {
                reject(err)
              })
          })
        })
    },
    // 普通用户使用完设备，需要归还设备。
    handleReturnThisEquipment(row) {
      this.$confirm('设备使用期限为xx月xx日，确定归还？', '用户操作', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '返回',
        type: 'info'
      })
        .then(() => {
          new Promise((resolve, reject) => {
            returnThisEquipment(row.id)
              .then(resp => {
                const isSuccess = resp.data === true
                isSuccess
                  ? this.$message({
                    showClose: true,
                    message: '归还成功',
                    type: 'success',
                    duration: 5000
                  })
                  : this.$message({
                    showClose: true,
                    message: '归还失败，请检查后重新提交。',
                    type: 'warning',
                    duration: 0
                  })
                this.handleShowMyApplyOrApproval()
                resolve(resp)
              })
              .catch(err => {
                reject(err)
              })
          })
        })
    },
    // 管理员驳回普通用户申请
    handleRejectOneApproval(row) {
      this.$confirm('确定驳回？', '审核申请', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '返回',
        type: 'warning'
      })
        .then(() => {
          new Promise((resolve, reject) => {
            rejectOneApproval(row.id)
              .then(resp => {
                this.handleShowMyApplyOrApproval()
                row.status = '审核不通过'
                this.handleShowOneApproval(row)
                this.getEquList(this.currentPage, this.currentSize)
                resolve(resp)
              })
              .catch(err => {
                reject(err)
              })
          })
        })
    },
    // 普通用户 重新申请使用设备
    handleReApply(row) {
      this.$confirm('发起重申请求？', '申请操作', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '返回',
        type: 'success'
      })
        .then(() => {
          // 重新申请：将这个条申请的状态id，从4（不通过）置为1（待审核）即可。
          new Promise((resolve, reject) => {
            reApplyUseEquipment(row.id)
              .then(resp => {
                const isSuccess = resp.data === true
                isSuccess
                  ? this.$message({
                    showClose: true,
                    message: '重申成功，等待管理员审核。',
                    duration: 5000,
                    type: 'success'
                  })
                  : this.$message({
                    showClose: true,
                    message: '重申失败，请检查后重新申请。',
                    duration: 0,
                    type: 'warning'
                  })
                this.handleShowMyApplyOrApproval()
                resolve(resp)
              })
              .catch(err => {
                reject(err)
              })
          })
        })
    },
    // 管理员已经处理完（通过/驳回），单击删除这条申请记录。
    handleComplete(row) {
      new Promise((resolve, reject) => {
        removeOneApproval(row.id)
          .then(resp => {
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    // 管理员查看返还的设备后选择入库设备（点击入库按钮）
    handleStoreThisEquipment(row) {
      const sf = this.storageForm
      sf.id = row.id
      sf.storageQuantity = 1
      sf.equName = row.equName
      sf.returnQuantity = row.equQuantity
    },
    // 管理员查看返还的设备后选择入库设备（提交入库表单）
    submitStoreThisEquipment() {
      // this.$confirm('设备是否完好无缺，确定入库设备？（请选择入库的数量）', '管理员操作', {
      //   distinguishCancelAndClose: true,
      //   confirmButtonText: '确定',
      //   cancelButtonText: '返回',
      //   type: 'success'
      // })
      //   .then(() => {
      //     new Promise((resolve, reject) => {
      //       storeReturnedEqu(row.id)
      //         .then(resp => {
      //           const isSuccess = resp.data === true
      //           isSuccess
      //             ? this.$message({
      //               showClose: true,
      //               message: '设备已入库',
      //               duration: 5000,
      //               type: 'success'
      //             })
      //             : this.$message({
      //               showClose: true,
      //               message: '设备入库失败，请检查后重新提交。',
      //               duration: 0,
      //               type: 'warning'
      //             })
      //           this.handleShowMyApplyOrApproval()
      //           this.getEquList(this.currentPage, this.currentSize)
      //           resolve(resp)
      //         })
      //         .catch(err => {
      //           reject(err)
      //         })
      //     })
      //   })

      const data = {
        id: this.storageForm.id,
        num: this.storageForm.storageQuantity
      }
      new Promise((resolve, reject) => {
        storePartReturnedEqu(data.id, data.num)
          .then(resp => {
            const isSuccess = resp.data === true
            isSuccess
              ? this.$message({
                showClose: true,
                message: data.num + ' 台设备已入库',
                duration: 5000,
                type: 'success'
              })
              : this.$message({
                showClose: true,
                message: '设备入库失败，请检查后重新提交。',
                duration: 0,
                type: 'warning'
              })
            this.handleShowMyApplyOrApproval()
            this.getEquList(this.currentPage, this.currentSize)
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    // 管理员查看返还的设备后选择维修设备（点击维修按钮）
    handleRepairThisEquipment(row) {
      const rf = this.repairForm
      rf.id = row.id
      rf.approvalTime = row.approvalTime
      rf.equName = row.equName
      rf.userName = row.userName
      rf.returnQuantity = row.equQuantity
    },
    // 管理员查看返还的设备后选择维修设备（提交维修表单）
    submitRepairThisEquipment() {
      new Promise((resolve, reject) => {
        maintainReturnedEqu(row.id)
          .then(resp => {
            const isSuccess = resp.data === true
            isSuccess
              ? this.$message({
                showClose: true,
                message: '操作成功',
                duration: 5000,
                type: 'success'
              })
              : this.$message({
                showClose: true,
                message: '操作失败，请检查后重新提交。',
                duration: 0,
                type: 'warning'
              })
            this.handleShowMyApplyOrApproval()
            this.getEquList(this.currentPage, this.currentSize)
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    // 管理员查看返还的设备后选择报废设备（点击报废按钮）
    handleScrapThisEquipment(row) {
      const sf = this.scrapForm
      sf.id = row.id
      sf.scrapQuantity = 1
      sf.equName = row.equName
      sf.returnQuantity = row.equQuantity
    },
    // 管理员查看返还的设备后选择报废设备（提交报废表单）
    submitScrapThisEquipment() {
      // this.$confirm('设备损坏严重，已无法使用，确定报废？', '管理员操作', {
      //   distinguishCancelAndClose: true,
      //   confirmButtonText: '确定',
      //   cancelButtonText: '返回',
      //   type: 'success'
      // })
      //   .then(() => {
      //     new Promise((resolve, reject) => {
      //       scrapReturnedEqu(row.id)
      //         .then(resp => {
      //           const isSuccess = resp.data === true
      //           isSuccess
      //             ? this.$message({
      //               showClose: true,
      //               message: '设备已报废',
      //               duration: 5000,
      //               type: 'success'
      //             })
      //             : this.$message({
      //               showClose: true,
      //               message: '执行报废操作失败，请检查后重新提交。',
      //               duration: 0,
      //               type: 'warning'
      //             })
      //           this.handleShowMyApplyOrApproval()
      //           this.getEquList(this.currentPage, this.currentSize)
      //           resolve(resp)
      //         })
      //         .catch(err => {
      //           reject(err)
      //         })
      //     })
      //   })

      const data = {
        id: this.scrapForm.id,
        num: this.scrapForm.scrapQuantity
      }
      new Promise((resolve, reject) => {
        scrapPartReturnedEqu(data.id, data.num)
          .then(resp => {
            const isSuccess = resp.data === true
            isSuccess
              ? this.$message({
                showClose: true,
                message: data.num + ' 台设备已报废',
                duration: 5000,
                type: 'success'
              })
              : this.$message({
                showClose: true,
                message: '执行报废操作失败，请检查后重新提交。',
                duration: 0,
                type: 'warning'
              })
            this.handleShowMyApplyOrApproval()
            this.getEquList(this.currentPage, this.currentSize)
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    // 管理员完成一条设备借用记录的 记录
    completeABorrowingRecord(row) {
      this.$confirm('记录此设备借用情况', '管理员操作', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '返回',
        type: 'success'
      })
        .then(() => {
          new Promise((resolve, reject) => {
            recordALog(row.id)
              .then(resp => {
                const isSuccess = resp.data === true
                isSuccess
                  ? this.$message({
                    showClose: true,
                    message: '设备借用情况已记录在册',
                    duration: 5000,
                    type: 'success'
                  })
                  : this.$message({
                    showClose: true,
                    message: '记录失败，请检查后重新提交。',
                    duration: 0,
                    type: 'warning'
                  })
                this.handleShowMyApplyOrApproval()
                // this.getEquList(this.currentPage, this.currentSize)
                resolve(resp)
              })
              .catch(err => {
                reject(err)
              })
          })
        })
    },
    // 处理点击负责人登录名事件（展示负责人详细信息）
    findTheUserInCharge(equUserLoginName) {
      new Promise((resolve, reject) => {
        getUserByLoginName(equUserLoginName)
          .then(resp => {
            const user = resp.data

            // 设置用户性别
            let userSex = null
            userSex = user.userSex
            user.userSex = userSex === 1 ? '男' : (userSex === 2 ? '女' : '保密')

            // 设置用户角色列表
            const authorities = user.authorities
            const authLength = authorities.length
            const roleList = []
            for (let i = 0; i < authLength; i++) {
              const roleName = authorities[i].authority
              roleList.push(roleName.substring(5))
            }
            user.userRole = roleList.toString()
            const roleStr = roleList.toString()
            this.inChargeUserRoles = []
            const list = roleStr.split(',')
            // 用户角色列表的展示
            for (let i = 0; i < list.length; i++) {
              this.inChargeUserRoles.push(list[i])
            }

            this.equUserDetailForm = resp.data
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    // 处理点击修改按钮
    handleModifyEqu(row, index) {
      // index：当前表格页面的index值。
      // 用户点击修改按钮，发送异步请求到后端，后端处理请求并且返回给前端进行展示。
      new Promise((resolve, reject) => {
        getEquById(row.id)
          .then(resp => {
            this.detailForm = resp.data
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 提交修改表单
    submitModifyForm() {
      new Promise((resolve, reject) => {
        modifyEqu(this.detailForm)
          .then(resp => {
            const isSuccess = resp.data === true
            isSuccess
              ? this.$message({
                showClose: true,
                message: '设备【' + this.detailForm.id + '】修改成功。',
                type: 'success'
              })
              : this.$message({
                // 失败，给出提示信息
                showClose: true,
                message: '设备【' + this.detailForm.id + '】修改失败，请检查后重新提交。',
                type: 'warning'
              })
            // this.reload()
            this.getEquList(this.currentPage, this.currentSize)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    // 处理删除请求
    handleDeleteEqu(row, index) {
      this.$confirm('此操作将永久删除' + row.equName + ', 是否继续?', '删除设备', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删 除',
        cancelButtonText: '取 消',
        type: 'warning'
      })
        .then(() => {
          new Promise((resolve, reject) => {
            deleteEqu(row.id)
              .then(resp => {
                this.$notify({
                  title: 'Success',
                  dangerouslyUseHTMLString: true,
                  message: '<strong>删除设备 <i>' + row.equName + '</i> 成功</strong>',
                  type: 'success',
                  duration: 3000
                })
                // this.reload()
                this.getEquList(this.currentPage, this.currentSize)
                resolve(resp)
              })
              .catch(err => {
                reject(err)
              })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            showClose: true,
            message: '取消删除'
          })
        })
    },

    // 处理当前页码的改变，去到页码为：`currentPage`的那一页。
    handleCurrentPageChange(currentPage) {
      this.$store.state.currentPage = currentPage
      const size = this.$store.state.currentSize

      const query = {
        page: currentPage,
        limit: size,
        equName: this.listQuery.equKeyWord,
        equCate: this.listQuery.equCate,
        equRoom: this.listQuery.equRoom,
        equState: this.listQuery.equState
      }
      new Promise((resolve, reject) => {
        fetchEquListByQuery(query)
          .then(resp => {
            this.backendTransferToFrontend(resp)
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 处理每一页展示数据条数的变换，每一页展示`val`条数据。
    handlePageSizeChange(val) {
      this.$store.state.currentSize = `${val}`

      const query = {
        page: this.currentPage,
        limit: `${val}`,
        equName: this.listQuery.equKeyWord,
        equCate: this.listQuery.equCate,
        equRoom: this.listQuery.equRoom,
        equState: this.listQuery.equState
      }
      new Promise((resolve, reject) => {
        fetchEquListByQuery(query)
          .then(resp => {
            this.$store.state.pages = resp.data.pages
            this.backendTransferToFrontend(resp)
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 按条件进行过滤
    handleFilter() {
      this.listQuery.page = 1
      this.getListByQuery()
    },

    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
