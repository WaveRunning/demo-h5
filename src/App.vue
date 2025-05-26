<template>
  <div class="container" @scroll.passive="handleScroll">
    <div class="tip">
      <p>当前路由参数type为：{{currentType}}</p>
      <p>因为所有图片视频资源都是加载第三方网站且都是随机加载，所以实现不同type的不同内容意义不大</p>
      <p>不同url的逻辑是： vue举例可以vueroute获取query参数 根据参数动态获取数据进行渲染.</p>
    </div>
    <div class="waterfall">
      <div class="column" v-for="(col, i) in columns" :key="i">
        <div v-for="item in col" :key="item.id" class="card">
          <video 
            v-if="item.type === 'video'" 
            :poster="item.cover"
            controls
            playsinline
            class="media"
          >
            <source :src="item.url" type="video/mp4">
          </video>
          <img v-else :src="item.url" class="media" alt="加载失败" >
          <div class="textBox">
            <div class="title">{{ item.title }}</div>
            <div class="subTitle">{{ item.subTitle }}</div>
            <div class="authorBox">
              <div class="author">{{ item.author }}</div>
              <div class="good"><span>❤</span>{{ item.good > 10000 ? '9999+' : item.good }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="loading" class="loading">加载中...</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
const videoUrls = [
  'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
];
const randomVideo = videoUrls[Math.floor(Math.random() * videoUrls.length)] 
const props = defineProps({
  dataType: {
    type: String,
    default: 'type1'
  }
})
const currentType = computed(() => {
  const location = window.location.search
  const params = new URLSearchParams(location);
  const type = params.get('type');
  console.log(type, '312')
  return type
})
// 瀑布流配置
const COLUMN_COUNT = 2
const columns = ref(Array.from({ length: COLUMN_COUNT }, () => []))
const page = ref(1)
const loading = ref(false)
const isFirstFinish = ref(false)
const scrollDebounce = ref(null)

// 响应式布局
const columnWidth = computed(() => {
  return `${100 / COLUMN_COUNT}%`
})
const generateMockData = async (type, page = 1) => {
  const getRandomSize = () => Math.floor(200 + Math.random() * 300)
  
  return Array.from({ length: 10 }, (_, i) => {
    const isVideo = Math.random() > 0.7
    const id = Date.now() + i + (type === 'type1' ? 1000 : 2000)
    isFirstFinish.value = true
    return {
      id,
      type: isVideo ? 'video' : 'image',
      title: `标题 ${page}-${i}`,
      subTitle: `次级标题${page}-${i}`,
      author: `作者${i}`,
      url: isVideo 
        ? videoUrls[Math.floor(Math.random() * videoUrls.length)]
        : `https://picsum.photos/${getRandomSize()}/${getRandomSize()}`,
      cover: `https://picsum.photos/200/200?random=${id}`,
      height: getRandomSize(),
      good: Math.floor(Math.random() * (20000 - 0 + 1)) + 0
    }
  })
}
// 数据加载
const loadData = async () => {
  loading.value = true
  const newData = await generateMockData(props.dataType, page.value)
  
  // 瀑布流布局分配
  newData.forEach(item => {
    const minHeightColumn = columns.value.reduce((prev, curr) => 
      getColumnHeight(curr) < getColumnHeight(prev) ? curr : prev
    )
    minHeightColumn.push(item)
  })
  
  page.value++
  setTimeout(() => {
    loading.value = false
  }, 1000);
}

const getColumnHeight = (column) => {
  return column.reduce((sum, item) => sum + item.height, 0)
}

// 滚动处理
const handleScroll = (e) => {
  clearTimeout(scrollDebounce.value)
  scrollDebounce.value = setTimeout(() => {
    const { scrollTop, scrollHeight, clientHeight } = e.target
    if (scrollHeight - scrollTop - clientHeight < 100) {
      loadData()
    }
  }, 50)
}

onMounted(() => {
  isFirstFinish.value = false
  loadData()
})
</script>

<style scoped>
.container {
  height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.waterfall {
  display: flex;
  padding: 8px;
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  /* padding: 2px; */
  font-size: 14px;
  color: #333;
}
.subTitle {
  /* padding: 2px; */
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
  /* padding: 2px; */
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
.tip {
  font-size:12px;
  color:#666
}
</style>