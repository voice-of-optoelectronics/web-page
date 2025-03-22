<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElCard, ElRow, ElCol, ElTag, ElButton, ElIcon } from 'element-plus'
import { Connection, Position, Timer, Histogram, Warning } from '@element-plus/icons-vue'

type Pose = 'standing' | 'walking' | 'falling' | 'running'

// 状态数据
const currentPose = ref<Pose>('standing')
const duration = ref(0)
const confidence = ref(97.5)
const densityData = ref<number[][]>([
  [0.1, 0.3, 0.2],
  [0.4, 0.8, 0.5],
  [0.2, 0.6, 0.9]
])
// 补充类型定义
const poseLabels = {
  standing: '站立状态',
  walking: '步行中',
  falling: '跌倒警报',
  running: '快速移动'
}

const poseDescriptions = {
  standing: '检测到稳定站立姿势，身体平衡状态良好',
  walking: '检测到规律步行运动，步态分析正常',
  falling: '⚠️ 检测到异常跌倒动作，请立即查看!',
  running: '检测到快速移动状态，运动幅度较大'
}
// 计算属性
const poseConfig = computed(() => ({
  standing: { color: 'success', icon: '🕴️' },
  walking: { color: 'primary', icon: '🚶' },
  falling: { color: 'danger', icon: '⚠️' },
  running: { color: 'warning', icon: '🏃' }
}))

const maxDensity = computed(() => Math.max(...densityData.value.flat()))
const avgDensity = computed(() => {
  const flatData = densityData.value.flat()
  return flatData.reduce((a, b) => a + b, 0) / flatData.length
})

// 颜色计算
const getDensityColor = (value: number) => {
  const hue = (1 - value) * 240
  return `hsl(${hue}, 70%, 50%)`
}

// 模拟数据更新
setInterval(() => {
  const poses: Pose[] = ['standing', 'walking', 'falling', 'running']
  currentPose.value = poses[Math.floor(Math.random() * poses.length)]
  densityData.value = densityData.value.map(row =>
      row.map(() => Math.random() * 0.9 + 0.1)
  )
  duration.value = duration.value >= 60 ? 0 : duration.value + 3
  confidence.value = 95 + Math.random() * 5
}, 3000)
</script>

<template>
  <div class="dashboard-container">
    <!-- 标题部分 -->
    <div class="dashboard-header">
      <el-divider>
        <div class="header-title">
          <el-icon class="radar-icon"><Position /></el-icon>
          <span class="title-text">VOICE_OF_OPTOELECTRONICS</span>
          <el-icon class="signal-icon"><Connection /></el-icon>
        </div>
      </el-divider>
      <p class="header-subtitle">智能姿态与密度监测系统</p>
    </div>

    <el-row :gutter="20">
      <!-- 姿势监测模块 -->
      <el-col :xs="24" :sm="12" :md="12" :lg="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span class="header-icon">📊</span>
              <span>实时姿势监测</span>
            </div>
          </template>

          <div class="pose-display">
            <el-tag
                :type="poseConfig[currentPose].color as any"
                class="pose-tag"
                effect="dark"
            >
              {{ poseConfig[currentPose].icon }}
              {{ poseLabels[currentPose] }}
            </el-tag>

            <div class="pose-description" :class="currentPose">
              {{ poseDescriptions[currentPose] }}
            </div>

            <div class="pose-visual" :class="[currentPose, `bg-${poseConfig[currentPose].color}`]">
              <div class="human-figure">
                <div class="head"></div>
                <div class="torso"></div>
                <div class="left-arm"></div>
                <div class="right-arm"></div>
                <div class="left-leg"></div>
                <div class="right-leg"></div>
              </div>
            </div>

            <div class="pose-status-info">
              <el-row :gutter="12">
                <el-col :span="12">
                  <div class="status-item">
                    <el-icon><Timer /></el-icon>
                    <span>持续时长：{{ duration }}s</span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="status-item">
                    <el-icon><Histogram /></el-icon>
                    <span>置信度：{{ confidence.toFixed(1) }}%</span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 密度图模块 -->
      <el-col :xs="24" :sm="12" :md="12" :lg="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span class="header-icon">🌐</span>
              <span>区域人员密度分布</span>
            </div>
          </template>

          <div class="density-map">
            <div class="density-description">
              <p class="density-summary">
                当前区域密度分析：
                <el-tag type="info" size="small">
                  最高密度 {{ maxDensity.toFixed(1) }}
                </el-tag>
                <el-tag type="info" size="small">
                  平均密度 {{ avgDensity.toFixed(1) }}
                </el-tag>
              </p>
              <p class="density-instruction">
                <el-icon><Warning /></el-icon>
                颜色从 <span class="low-density">蓝色（低密度）</span>
                到 <span class="high-density">红色（高密度）</span>
                表示人员聚集程度
              </p>
            </div>

            <el-row
                v-for="(row, i) in densityData"
                :key="i"
                :gutter="8"
                class="density-row"
            >
              <el-col
                  v-for="(value, j) in row"
                  :key="j"
                  :span="8"
                  class="density-cell"
              >
                <el-button
                    class="density-block"
                    :style="{
                    backgroundColor: getDensityColor(value),
                    borderColor: getDensityColor(value)
                  }"
                    :title="`A${i+1}区${j+1}位 密度值: ${value.toFixed(2)}`"
                >
                  <span class="density-value">
                    {{ value.toFixed(1) }}
                  </span>
                  <div class="area-label">A{{i+1}}-{{j+1}}</div>
                </el-button>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.dashboard-header {
  text-align: center;
  margin: 2rem 0 3rem;

  .header-title {
    display: inline-flex;
    align-items: center;
    gap: 1.5rem;
    padding: 0 2rem;

    .title-text {
      font-family: 'Arial Rounded MT Bold', sans-serif;
      font-size: 2.2rem;
      letter-spacing: 2px;
      background: linear-gradient(45deg, var(--el-color-primary), #667eea);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .radar-icon,
    .signal-icon {
      font-size: 2rem;
      color: var(--el-color-primary);
      animation: pulse 2s infinite;
    }

    .signal-icon {
      animation-delay: 0.5s;
    }
  }

  .header-subtitle {
    color: var(--el-text-color-secondary);
    font-size: 1.2rem;
    margin-top: 1rem;
    letter-spacing: 1px;
    position: relative;

    &::after {
      content: '';
      display: block;
      width: 60px;
      height: 2px;
      background: var(--el-color-primary);
      margin: 0.8rem auto;
    }
  }
}

.dashboard-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.box-card {
  margin-bottom: 20px;
  height: 100%;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: 600;

  .header-icon {
    margin-right: 10px;
    font-size: 1.2em;
  }
}

.pose-display {
  position: relative;
  padding: 20px 0;

  .pose-tag {
    height: 35px;
    font-size: 16px;
    padding: 10px 25px;
    border-radius: 20px;
    letter-spacing: 1px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: block;
    width: fit-content;
    margin: 0 auto 20px;
  }

  .pose-description {
    text-align: center;
    margin: 15px 0;
    font-size: 14px;
    color: var(--el-text-color-regular);
    transition: all 0.3s;
    min-height: 40px;

    &.falling {
      color: var(--el-color-danger);
      font-weight: 600;
      animation: text-blink 1s infinite;
    }
  }

  .pose-status-info {
    margin-top: 20px;
    padding: 15px;
    background: var(--el-bg-color-page);
    border-radius: 8px;

    .status-item {
      display: flex;
      align-items: center;
      font-size: 13px;
      color: var(--el-text-color-secondary);
      justify-content: center;

      .el-icon {
        margin-right: 8px;
        font-size: 16px;
      }
    }
  }
}

.pose-visual {
  position: relative;
  height: 300px;
  border-radius: 8px;
  margin: 0 auto 20px;
  transition: all 0.3s;

  &.bg-success { background-color: var(--el-color-success-light-9); }
  &.bg-primary { background-color: var(--el-color-primary-light-9); }
  &.bg-danger { background-color: var(--el-color-danger-light-9); }
  &.bg-warning { background-color: var(--el-color-warning-light-9); }

  .human-figure {
    position: absolute;
    width: 120px;
    height: 200px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    div {
      position: absolute;
      background: var(--el-color-primary);
      border-radius: 15px;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .head {
      width: 40px;
      height: 40px;
      left: 50%;
      transform: translateX(-50%);
      top: 0;
      border-radius: 50%;
    }

    .torso {
      width: 50px;
      height: 80px;
      left: 50%;
      transform: translateX(-50%);
      top: 40px;
    }

    .left-arm {
      width: 20px;
      height: 60px;
      left: -10px;
      top: 45px;
      transform-origin: bottom center;
    }

    .right-arm {
      width: 20px;
      height: 60px;
      right: -10px;
      top: 45px;
      transform-origin: bottom center;
    }

    .left-leg {
      width: 20px;
      height: 70px;
      left: 15px;
      top: 120px;
      transform-origin: top center;
    }

    .right-leg {
      width: 20px;
      height: 70px;
      right: 15px;
      top: 120px;
      transform-origin: top center;
    }
  }

  // 姿势动画
  &.standing {
    .left-arm, .right-arm { transform: rotate(10deg); }
    .left-leg, .right-leg { transform: rotate(0deg); }
  }

  &.walking {
    .left-arm { transform: rotate(-30deg); }
    .right-arm { transform: rotate(30deg); }
    .left-leg { transform: rotate(20deg); }
    .right-leg { transform: rotate(-20deg); }
  }

  &.falling {
    animation: alert-pulse 1s infinite;

    .human-figure {
      transform: translate(-50%, -50%) rotate(-30deg);

      div { background: var(--el-color-danger); }
    }
    .left-arm { transform: rotate(120deg); }
    .right-arm { transform: rotate(-90deg); }
    .left-leg { transform: rotate(60deg); }
    .right-leg { transform: rotate(-30deg); }
  }

  &.running {
    .human-figure {
      animation: run-bounce 0.8s infinite;
    }
    .left-arm { transform: rotate(-45deg); }
    .right-arm { transform: rotate(45deg); }
    .left-leg { transform: rotate(30deg); }
    .right-leg { transform: rotate(-30deg); }
  }
}

.density-map {
  padding: 10px;

  .density-row {
    margin-bottom: 8px;
  }

  .density-description {
    margin-bottom: 20px;
    padding: 15px;
    background: var(--el-bg-color-page);
    border-radius: 8px;

    .density-summary {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
      font-size: 13px;
    }

    .density-instruction {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--el-text-color-secondary);
      font-size: 12px;
      margin: 0;

      .low-density {
        color: hsl(240, 70%, 50%);
        font-weight: bold;
      }

      .high-density {
        color: hsl(0, 70%, 50%);
        font-weight: bold;
      }
    }
  }

  .density-block {
    width: 100%;
    height: 80px;
    border-radius: 6px;
    transition: all 0.3s;
    position: relative;
    flex-direction: column;

    .density-value {
      color: white;
      font-weight: bold;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    }

    .area-label {
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255, 255, 255, 0.8);
      font-size: 10px;
      white-space: nowrap;
    }
  }
}

// 动画定义
@keyframes pulse {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
}

@keyframes alert-pulse {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

@keyframes run-bounce {
  0%, 100% { transform: translate(-50%, -50%); }
  50% { transform: translate(-50%, -48%); }
}

@keyframes text-blink {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

@media (max-width: 768px) {
  .pose-visual {
    height: 200px !important;

    .human-figure {
      width: 80px;
      height: 140px;
    }
  }

  .density-block {
    height: 60px !important;
  }

  .pose-tag {
    font-size: 14px !important;
    padding: 8px 15px !important;
  }

  .pose-description {
    font-size: 12px !important;
  }
}
</style>
