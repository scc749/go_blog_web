<template>
  <el-card class="calendar">
    <el-row class="title" calendarInfo>今日日历</el-row>
    <el-row>时间：{{ calendarInfo.date }} {{ currentTime }}</el-row>
    <el-row>农历：{{ calendarInfo.lunar_date }}</el-row>
    <el-row>干支：{{ calendarInfo.ganzhi }}</el-row>
    <el-row>星座：{{ calendarInfo.zodiac }}</el-row>
    <el-row>天次：{{ calendarInfo.day_of_year }}</el-row>
    <el-row>节气：{{ calendarInfo.solar_term }}</el-row>
    <el-row>宜项：{{ calendarInfo.auspicious }}</el-row>
    <el-row>禁忌：{{ calendarInfo.inauspicious }}</el-row>
  </el-card>
</template>

<script setup lang="ts">
import {onUnmounted, ref} from "vue";
import {websiteCalendar, type WebsiteCalendarResponse} from "@/api/website";

const calendarInfo = ref<WebsiteCalendarResponse>({
  date: '',
  lunar_date: '',
  ganzhi: '',
  zodiac: '',
  day_of_year: '',
  solar_term: '',
  auspicious: '',
  inauspicious: '',
})

let timerId: number | null = null
const currentTime = ref('')

function updateCurrentTime() {
  currentTime.value = new Date().toLocaleTimeString()
}

function initializeTimer() {
  updateCurrentTime()
  timerId = setInterval(updateCurrentTime, 1000)
}

onUnmounted(() => {
  clearInterval(timerId as number)
})

initializeTimer()

const getCalendarInfo = async () => {
  const res = await websiteCalendar()
  if (res.code == 0) {
    calendarInfo.value = res.data
  }
}
getCalendarInfo()
</script>

<style scoped lang="scss">
.calendar {
  margin-bottom: 20px;

  .title {
    font-size: 24px;
    margin-bottom: 20px;
  }
}
</style>
