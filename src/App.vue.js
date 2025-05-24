/// <reference types="../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onMounted, onUnmounted } from 'vue';
const videoUrls = [
    'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
];
const randomVideo = videoUrls[Math.floor(Math.random() * videoUrls.length)];
const props = defineProps({
    dataType: {
        type: String,
        default: 'type1'
    }
});
// 瀑布流配置
const COLUMN_COUNT = 2;
const columns = ref(Array.from({ length: COLUMN_COUNT }, () => []));
const page = ref(1);
const loading = ref(false);
const isFirstFinish = ref(false);
const scrollDebounce = ref(null);
// 响应式布局
const columnWidth = computed(() => {
    return `${100 / COLUMN_COUNT}%`;
});
const generateMockData = async (type, page = 1) => {
    const getRandomSize = () => Math.floor(200 + Math.random() * 300);
    return Array.from({ length: 10 }, (_, i) => {
        const isVideo = Math.random() > 0.7;
        const id = Date.now() + i + (type === 'type1' ? 1000 : 2000);
        isFirstFinish.value = true;
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
        };
    });
};
// 数据加载
const loadData = async () => {
    loading.value = true;
    const newData = await generateMockData(props.dataType, page.value);
    // 瀑布流布局分配
    newData.forEach(item => {
        const minHeightColumn = columns.value.reduce((prev, curr) => getColumnHeight(curr) < getColumnHeight(prev) ? curr : prev);
        minHeightColumn.push(item);
    });
    page.value++;
    setTimeout(() => {
        loading.value = false;
    }, 1000);
};
const getColumnHeight = (column) => {
    return column.reduce((sum, item) => sum + item.height, 0);
};
// 滚动处理
const handleScroll = (e) => {
    clearTimeout(scrollDebounce.value);
    scrollDebounce.value = setTimeout(() => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop - clientHeight < 100) {
            loadData();
        }
    }, 50);
};
onMounted(() => {
    isFirstFinish.value = false;
    loadData();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['good']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onScroll: (__VLS_ctx.handleScroll) },
    ...{ class: "container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tip" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "waterfall" },
});
for (const [col, i] of __VLS_getVForSourceType((__VLS_ctx.columns))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "column" },
        key: (i),
    });
    for (const [item] of __VLS_getVForSourceType((col))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (item.id),
            ...{ class: "card" },
        });
        if (item.type === 'video') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.video, __VLS_intrinsicElements.video)({
                poster: (item.cover),
                controls: true,
                playsinline: true,
                ...{ class: "media" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.source, __VLS_intrinsicElements.source)({
                src: (item.url),
                type: "video/mp4",
            });
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.img, __VLS_intrinsicElements.img)({
                src: (item.url),
                ...{ class: "media" },
                alt: "加载失败",
            });
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "textBox" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "title" },
        });
        (item.title);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "subTitle" },
        });
        (item.subTitle);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "authorBox" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "author" },
        });
        (item.author);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "good" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (item.good > 10000 ? '9999+' : item.good);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "loading" },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['tip']} */ ;
/** @type {__VLS_StyleScopedClasses['waterfall']} */ ;
/** @type {__VLS_StyleScopedClasses['column']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['media']} */ ;
/** @type {__VLS_StyleScopedClasses['media']} */ ;
/** @type {__VLS_StyleScopedClasses['textBox']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['subTitle']} */ ;
/** @type {__VLS_StyleScopedClasses['authorBox']} */ ;
/** @type {__VLS_StyleScopedClasses['author']} */ ;
/** @type {__VLS_StyleScopedClasses['good']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            $props: __VLS_makeOptional(props),
            ...props,
            columns: columns,
            loading: loading,
            handleScroll: handleScroll,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {
            $props: __VLS_makeOptional(props),
            ...props,
        };
    },
});
; /* PartiallyEnd: #4569/main.vue */
