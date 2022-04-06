<template>
  <!--  操作栏-->
  <div class="action-bar d-flex ai-center mb">
    <el-icon color="#5DC40E" :size="25" class="cursor mr" @click="openDialog">
      <plus/>
    </el-icon>
    <el-icon color="#d3d7d4" :size="25" class="cursor mr">
      <refresh-right/>
    </el-icon>
    <el-select v-model="optionValue"
               clearable
               class="mr"
               @change="SelectHandleChange"
               placeholder="请选择时间">
      <el-option
          v-for="item in data.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      />
    </el-select>
    <el-input-number
        v-model="optionNum"
        :min="0"
        :max="10"
        class="mx-4 mr"
        controls-position="right"
        @change="NumberhandleChange"
    />
    <el-date-picker
        v-model="startTime"
        type="datetime"
        class="mr"
        placeholder="选择开始时间"
    />
    <el-date-picker
        v-model="endTime"
        type="datetime"
        class="mr"
        placeholder="选择结束时间"
    />
    <div class="action-search cursor mr">
      <img src="../assets/img/icon-Search.png">
    </div>
    <div class="action-search active-cha cursor mr">
      <img src="../assets/img/icon-cha.png">
    </div>
    <div class="action-search active-cha cursor mr">
      <img src="../assets/img/icon-wen.png">
    </div>
    <div class="action-search active-cha cursor mr">
      <img src="../assets/img/icon_baocun.png">
    </div>
    <el-dropdown @command="dropdownHandleClick" class="mr">
      <el-button type="info">
        {{ content }}
        <el-icon class="el-icon--right">
          <arrow-down/>
        </el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="0">点组</el-dropdown-item>
          <el-dropdown-item command="1">线组</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <div class="snapshot mr">
      <el-select v-model="snapshotValue" class="m-2" placeholder="请选择">
        <el-option
            v-for="item in data.snapshotOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </div>
    <div class="snapshot mr">
      <el-select v-model="discountValue" class="m-2" placeholder="请选择" @change="curveSwitching">
        <el-option
            v-for="item in data.discountOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </div>
    <!--    添加的弹窗-->
    <el-dialog
        v-model="dialogVisible"
        title="测点值"
        width="80%"
        @close="handleClose">
      <div v-loading="loading">
        <!--      表格操作栏-->
        <div class="table-operation d-flex">
          <div class="table-select d-flex">
            <el-select v-model="tableValue" clearable placeholder="请选择表">
              <el-option
                  v-for="item in data.tableOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
            </el-select>
            <el-form :model="form" label-width="65px" class="d-flex ml">
              <el-form-item label="标签名">
                <el-input v-model="form.TagName"/>
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="form.Describe"/>
              </el-form-item>
            </el-form>
          </div>
          <el-button type="primary" :icon="Search" @click="search">查询</el-button>
          <el-button type="success" plain @click="selectHandle">选中</el-button>
        </div>
        <!--    添加的表格-->
        <el-table
            ref="multipleTableRef"
            :data="data.tableData"
            border
            style="width: 100%"
            @selection-change="actionHandleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column property="id" label="id" header-align="center" show-overflow-tooltip/>
          <el-table-column property="tagname" label="标签点名" header-align="center" show-overflow-tooltip/>
          <el-table-column property="unit" label="站名" header-align="center" show-overflow-tooltip/>
          <el-table-column property="desp" label="描述" header-align="center" show-overflow-tooltip/>
          <el-table-column property="" label="自定义描述" header-align="center" width="100" show-overflow-tooltip/>
          <el-table-column property="name" label="映射标签点名" header-align="center" min-width="110" show-overflow-tooltip/>
          <el-table-column property="name" label="单位" header-align="center" show-overflow-tooltip/>
          <el-table-column property="max" label="最大值" header-align="center" show-overflow-tooltip/>
          <el-table-column property="min" label="最小值" header-align="center" show-overflow-tooltip/>
          <el-table-column property="" label="KKS编码" header-align="center" show-overflow-tooltip/>
          <el-table-column property="" label="设备名称" header-align="center" show-overflow-tooltip/>
          <el-table-column property="" label="机构id" header-align="center" show-overflow-tooltip/>
          <el-table-column property="" label="租户" header-align="center" show-overflow-tooltip/>
        </el-table>
        <!--      分页-->
        <div class="mt">
          <el-pagination
              v-model:currentPage="paging.pageIndex"
              v-model:page-size="paging.pageSize"
              :page-sizes="[10, 20, 30, 50]"
              :background="background"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"/>
        </div>
      </div>

    </el-dialog>
  </div>
  <!--  echarts图-->
  <div>
    <div id="emain"></div>
  </div>
  <!--  表格-->
  <div v-if="data.pointTableData.length !== 0" class="d-flex jc-center mt">
    <el-table
        ref="multipleTableRef"
        :data="data.pointTableData"
        style="width: 90%"
        border
        @selection-change="tableHandleSelectionChange">
      <el-table-column type="selection" width="55"/>
      <el-table-column property="id" label="id" header-align="center" show-overflow-tooltip/>
      <el-table-column property="tagname" label="标签点名" header-align="center" show-overflow-tooltip/>
      <el-table-column property="unit" label="站名" header-align="center" show-overflow-tooltip/>
      <el-table-column property="desp" label="描述" header-align="center" show-overflow-tooltip/>
      <el-table-column property="" label="自定义描述" header-align="center" min-width="90" show-overflow-tooltip/>
      <el-table-column property="name" label="映射标签点名" header-align="center" min-width="100" show-overflow-tooltip/>
      <el-table-column property="name" label="单位" header-align="center" show-overflow-tooltip/>
      <el-table-column property="max" label="最大值" header-align="center" show-overflow-tooltip/>
      <el-table-column property="min" label="最小值" header-align="center" show-overflow-tooltip/>
      <el-table-column property="" label="KKS编码" header-align="center" show-overflow-tooltip/>
      <el-table-column property="" label="设备名称" header-align="center" show-overflow-tooltip/>
      <el-table-column property="" label="机构id" header-align="center" show-overflow-tooltip/>
      <el-table-column property="" label="租户" header-align="center" show-overflow-tooltip/>
      <el-table-column label="操作" width="120" align="center">
        <template #default="scope">
          <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script setup>
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import {Plus, RefreshRight, Search, ArrowDown} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {ref, reactive, onMounted} from 'vue'
//引入封装的接口
import {getTagInfoSiteAll, getData, postDate} from '../request/getData'

//echarts的参数
let myChart = ''
let echartsOptions = {}

const optionValue = ref('')
let optionNum = ref(0)
let startTime = ref('')
let endTime = ref('')
let dialogVisible = ref(false)
let multipleTableRef = ref()
let tableValue = ref('')
let content = ref('点组')
let snapshotValue = ref('')
let discountValue = ref('')
//表格 加载框
let loading = ref(false)
//分页相关参数
let background = ref(true)
let total = ref(40)
const paging = reactive({
  pageIndex: 1,
  pageSize: 10,
})
//表格查询的参数
const form = reactive({
  TagName: '',
  Describe: ''
})

//用到的数组对象类型的数据
let data = reactive({
  options: [
    {label: "固定时间段30分钟", value: 30},
    {label: "固定时间段1小时", value: 60},
    {label: "固定时间段2小时", value: 120},
    {label: "固定时间段8小时", value: 480},
    {label: "固定时间段12小时", value: 720},
    {label: "固定时间段1天", value: 1440},
    {label: "固定时间段2天", value: 2880},
    {label: "固定时间段4天", value: 5760},
    {label: "固定时间段6天", value: 8640},
    {label: "固定时间段7天", value: 10080},
    {label: "固定时间段10天", value: 14400},
    {label: "固定时间段15天", value: 21600},
    {label: "固定时间段30天", value: 43200},
    {label: "自定义时间段时", value: 0}
  ],
  tableData: [
    {
      date: '2016-05-03',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-04',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-01',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-08',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-06',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-07',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
  ],
  tableOptions: [
    {
      value: 'Option1',
      label: 'Option1',
    }
  ],
  command: ['点组', '线组'],
  snapshotOptions: [
    {label: "快照值", value: 1},
    {label: "原始数据", value: 2},
    {label: "平均值", value: 3},
    {label: "最大值", value: 4},
    {label: "最小值", value: 5}
  ],
  discountOptions: [
    {label: "折线", value: 1},
    {label: "曲线", value: 2},
    {label: "面积图", value: 3},
    {label: "柱状图", value: 4},
    {label: "堆叠图", value: 5}
  ],
  pointTableData: [
    {
      date: '2016-05-03',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
    {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    },
  ],
  //解决分页的bug，用户临时存储搜索数据
  temporaryData: {
    TagName: '',
    Describe: ''
  },
  //选中数据的数组
  selectedData:[]
})

//挂载之前的生命周期函数(初始化echarts图)
onMounted(() => {
  myChart = echarts.init(document.getElementById('emain'))
  echartsOptions = {
    // backgroundColor:'#100C2A',
    dataZoom: [
      {
        type: 'slider',//slider表示有滑动块的，inside表示内置的
        show: true,
        xAxisIndex: [0],
        start: 10,
        end: 35
      },
      {
        type: 'slider',
        show: true,
        yAxisIndex: [0],
        left: '93%',
        start: 0, //数据窗口范围的起始百分比
        end: 36
      },
    ],
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      },
      right: '5%'
    },
    grid: {
      left: '5%'
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false
      }
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260, 123, 456, 789, 121, 445, 1, 5, 42, 445, 12, 21,],
        type: 'line'
      }
    ]
  }
  myChart.setOption(echartsOptions)
  window.addEventListener('resize', () => {
    myChart.resize()
  })
})

//打开添加测点方法
const openDialog = async () => {
  dialogVisible.value = true
  loading.value = true
  //测点列表
  let res = await getTagInfoSiteAll()
  //去除数组中为null的选项
  for (let i = 0; i < res.length; i++) {
    if (res[i] == null) {
      res.splice(i, 1)
    }
  }
  data.tableOptions = res.map(item => {
    return {value: item.site, label: item.site}
  })
  //表格数据
  let {data: tableAll, total: totals, pageSize} = await getData()
  total.value = totals
  paging.pageSize = pageSize
  data.tableData = tableAll
  loading.value = false
}
//表格的条件查询
const search = async () => {
  data.temporaryData = {...form}  //临时存储搜索数据用于分页使用
  paging.pageIndex = 1
  paging.pageSize = 10
  ChangeSwitching(form)
}
//封装条件查询
const encapsulation = async (baseFilter) => {
  loading.value = true
  let fromData = new FormData()
  if (baseFilter) {
    fromData.append('baseFilter', baseFilter)
  }
  fromData.append('pageIndex', paging.pageIndex - 1)
  fromData.append('pageSize', paging.pageSize)
  let {data: tableAll, total: totals, pageSize} = await postDate(fromData)
  total.value = totals
  paging.pageSize = pageSize
  data.tableData = tableAll
  loading.value = false
}
//封装页数变化和数量变化和查询的请求
const ChangeSwitching = (obj) => {
  if (tableValue.value == '' && data.temporaryData.TagName == '' && data.temporaryData.Describe == '') {
    encapsulation()
    return
  }
  let baseFilter = `((a.site LIKE '%${tableValue.value}%')) AND ((a.tagname LIKE '%${obj.TagName}%')) AND ((a.desp LIKE '%${obj.Describe}%'))`
  encapsulation(baseFilter)
}

//选中的事件
const selectHandle=()=>{
  dialogVisible.value = false
  data.pointTableData=data.selectedData
}

//时间选择器
const SelectHandleChange = (value) => {
  if (!value || (value === 0)) return
  startTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
  endTime.value = dayjs(new Date().getTime() - 60 * 1000 * value).format('YYYY-MM-DD HH:mm:ss')
}
//数字选择器
const NumberhandleChange = (value) => {
  console.log(value)
}
//表格选择项发送变化时
const actionHandleSelectionChange = (sel) => {
  console.log(sel);
  data.selectedData = sel
}
const tableHandleSelectionChange = (sel) => {
  console.log(sel)
}

//切换一页展示的数量变化
const handleSizeChange = () => {
  ChangeSwitching(data.temporaryData)
}
//当前页数切换触发
const handleCurrentChange = () => {
  ChangeSwitching(data.temporaryData)
}

//关闭Dialog时的操作
const handleClose = () => {
  tableValue.value = ''
  multipleTableRef.value.clearSelection()
}
//下拉菜单
const dropdownHandleClick = (val) => {
  content.value = data.command[val]
}
//切换echarts图类型
const curveSwitching = (val) => {
  let newdata = [150, 230, 224, 218, 135, 147, 260, 123, 456, 789, 121, 445, 1, 5, 42, 445, 12, 21,]
  switch (val) {
    case 1:
      return myChart.setOption({
        series: [
          {
            data: newdata,
            type: 'line',
            smooth: false,
            areaStyle: {
              opacity: 0
            }
          }
        ]
      })
    case 2:
      return myChart.setOption({
        series: [
          {
            data: newdata,
            type: 'line',
            smooth: true,
            areaStyle: {
              opacity: 0
            }
          }
        ]
      })
    case 3:
      return myChart.setOption({
        series: [
          {
            data: newdata,
            type: 'line',
            smooth: false,
            areaStyle: {
              opacity: 0.8
            }
          }
        ]
      })
    case 4:
      return myChart.setOption({
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260, 123, 456, 789, 121, 445, 1, 5, 42, 445, 12, 21,],
            type: 'bar'
          }
        ]
      })
    case 5:
      return myChart.setOption({
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260, 123, 456, 789, 121, 445, 1, 5, 42, 445, 12, 21,],
            type: 'bar',
            barGap: '-100%',
          }
        ]
      })
  }
}
//表格删除行
const handleDelete = (id, row) => {
  ElMessageBox.confirm(
      '确定要删除吗?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    data.pointTableData.splice(id, 1)
    console.log(id, row.name)
  }).catch(() => {
  })
}
</script>

<style lang="scss">
.action-bar {
  flex-wrap: wrap;

  .el-select .el-input {
    width: 150px !important;
  }

  .el-input-number {
    width: 80px;
  }

  .el-dialog__body {
    padding-top: 0;
  }

  .table-operation {
    padding: 10px;
  }

  .table-select {
    margin-right: 10px;
  }

  .action-search {
    width: 20px;
    height: 20px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .active-cha {
    width: 25px;
    height: 25px;
  }

  .snapshot {
    .el-select .el-input {
      width: 90px !important;
    }
  }
}

#emain {
  width: 100%;
  height: 500px;
}

.el-select-dropdown__item {
  padding: 0 10px;
}
</style>
