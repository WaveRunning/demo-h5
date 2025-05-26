<template>
  <div
    class="container"
    @scroll.passive="handleScroll"
    @touchstart.passive="handleTouchStart"
    @touchmove.passive="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <div
      class="pull-tip"
      :style="{ marginTop: `${pullDistance}px` }"
    >
      <div class="pull-text">
        <span v-if="pullDistance < pullThreshold">下拉刷新</span>
        <span v-else>释放刷新</span>
      </div>
    </div>

    <div class="tip">
      <p>当前路由参数type为：{{ currentType }}</p>
      <p>因为所有图片视频资源都是加载第三方网站且都是随机加载，所以实现不同type的不同内容意义不大</p>
      <p>不同url的逻辑是： vue举例可以vueroute获取query参数 根据参数动态获取数据进行渲染.</p>
    </div>

    <div class="waterfall">
      <div class="column" v-for="(col, i) in columns" :key="i">
        <div v-for="item in col" :key="item.id" class="card">
          <video
            v-if="item.type === 'video'"
            controls
            muted
            playsinline
            class="media"
            webkit-playsinline
            x5-playsinline
            x-webkit-airplay="true"
            x5-video-player-type="h5"
            x5-video-player-fullscreen="false"
            t7-video-player-type="inline"
            preload="auto"
          >
            <source :src="item.url" type="video/mp4" />
          </video>
          <img v-else :src="item.url" class="media" alt="加载失败" />
          <div class="textBox">
            <div class="title">{{ item.title }}</div>
            <div class="subTitle">{{ item.subTitle }}</div>
            <div class="authorBox">
              <div class="author">{{ item.author }}</div>
              <div class="good">
                <span>❤</span>{{ item.good > 10000 ? '9999+' : item.good }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="loading" class="loading">加载中...</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
const videoUrls = [
  'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
]
const props = defineProps({
  dataType: {
    type: String,
    default: 'type1'
  }
})

const currentType = computed(() => {
  const location = window.location.search
  const params = new URLSearchParams(location)
  return params.get('type')
})

const COLUMN_COUNT = 2
const columns = ref(Array.from({ length: COLUMN_COUNT }, () => []))
const page = ref(1)
const loading = ref(false)
const scrollDebounce = ref(null)
const pulling = ref(false)
const pullThreshold = 60
const pullDistance = ref(-pullThreshold) 
const startY = ref(0)

const generateMockData = async (type, page = 1) => {
  const getRandomSize = () => Math.floor(200 + Math.random() * 300)
  return Array.from({ length: 10 }, (_, i) => {
    const isVideo = Math.random() > 0.7
    const id = Date.now() + i + (type === 'type1' ? 1000 : 2000)
    return {
      id,
      type: isVideo ? 'video' : 'image',
      title: `标题 ${page}-${i}`,
      subTitle: `次级标题${page}-${i}`,
      author: `作者${i}`,
      url: isVideo ? videoUrls[Math.floor(Math.random() * videoUrls.length)] : `https://picsum.photos/${getRandomSize()}/${getRandomSize()}`,
      cover: `https://picsum.photos/200/200?random=${id}`,
      height: getRandomSize(),
      good: Math.floor(Math.random() * 20001)
    }
  })
}

const getColumnHeight = (column) => column.reduce((sum, item) => sum + item.height, 0)

const loadData = async () => {
  loading.value = true
  const newData = await generateMockData(props.dataType, page.value)
  newData.forEach(item => {
    const minHeightColumn = columns.value.reduce((prev, curr) =>
      getColumnHeight(curr) < getColumnHeight(prev) ? curr : prev
    )
    minHeightColumn.push(item)
  })
  page.value++
  setTimeout(() => loading.value = false, 1000)
}

const refreshData = async () => {
  loading.value = true
  page.value = 1
  columns.value = Array.from({ length: COLUMN_COUNT }, () => [])
  const newData = await generateMockData(props.dataType, page.value)
  newData.forEach(item => {
    const minHeightColumn = columns.value.reduce((prev, curr) =>
      getColumnHeight(curr) < getColumnHeight(prev) ? curr : prev
    )
    minHeightColumn.push(item)
  })
  page.value++
  setTimeout(() => loading.value = false, 1000)
}

const handleScroll = (e) => {
  clearTimeout(scrollDebounce.value)
  scrollDebounce.value = setTimeout(() => {
    const { scrollTop, scrollHeight, clientHeight } = e.target
    const threshold = 100
    if (scrollTop + clientHeight >= scrollHeight - threshold) loadData()
  }, 50)
}

const handleTouchStart = (e) => {
  const container = document.querySelector('.container')
  if (container.scrollTop === 0) {
    startY.value = e.touches[0].clientY
    pulling.value = true
  }
}

const handleTouchMove = (e) => {
  if (!pulling.value) return
  const deltaY = e.touches[0].clientY - startY.value
  if (deltaY > 0) pullDistance.value = Math.min(deltaY, pullThreshold * 2) - pullThreshold
}

const handleTouchEnd = async () => {
  if (!pulling.value) return
  if (pullDistance.value >= 0) {
    await refreshData()
  }
  pulling.value = false
  pullDistance.value = -pullThreshold
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.container {
  height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
  height: calc(100vh - 60px); /* 调整容器高度 */
  background-color: #fff;
}

.pull-tip {
  /* position: fixed; */
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 14px;
  z-index: 10;
  transition: transform 0.2s ease;
  background-color: #fff;
}

.tip {
  padding: 10px;
  font-size: 12px;
  color: #666;
  background: #fff;
}

.waterfall {
  display: flex;
  padding: 8px;
  min-height: calc(100% + 1px);
}

.column {
  flex: 1;
  padding: 0 4px;
  box-sizing: border-box;
}

.card {
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.media {
  width: 100%;
  border-radius: 8px 8px 0 0;
  display: block;
  min-height: 200px;
  min-width: 120px;
}

.textBox {
  text-align: left;
  display: grid;
  gap: 4px;
  padding: 4px;
}

.title {
  font-size: 14px;
  color: #333;
}

.subTitle {
  font-size: 10px;
  color: #666;
  background: #f0f0f0;
  padding: 2px;
  width: 60px;
  border-radius: 4px;
}

.authorBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author {
  font-size: 12px;
  color: #666;
}

.good {
  font-size: 12px;
  color: #666;
}

.good span {
  margin-right: 4px;
}

.loading {
  text-align: center;
  padding: 10px;
  color: #666;
}

video {
  object-fit: cover;
}
</style>
