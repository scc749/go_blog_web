<template>
<div id="chart" :style="{height: '300px'}">
</div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import {defineProps, onMounted} from "vue";
import type {UserChartResponse} from "@/api/user";

const props = defineProps<{
  chart: UserChartResponse;
}>();

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);

onMounted(() => {
  const chartDom = document.getElementById('chart');
  const myChart = echarts.init(chartDom);
  let option;

  option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['登录', '注册']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.chart.date_list
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '登录',
        type: 'line',
        data: props.chart.login_data
      },
      {
        name: '注册',
        type: 'line',
        data: props.chart.register_data
      }
    ]
  };

  option && myChart.setOption(option);
})

</script>

<style scoped lang="scss">

</style>
