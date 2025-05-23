<template>
  <view class="article-container">
    <unicloud-db
      ref="udb"
      v-slot:default="{ data, loading, error }"
      :where="articleWhere"
      :collection="articleCollection"
      :field="articleFields"
      :getone="true"
    >
      <view v-if="loading" class="loading-text">加载中...</view>
      <view v-else-if="error" class="error-text">加载失败，请稍后再试。</view>
      <view v-else-if="data">
        <view class="article-title">{{ data.title }}</view>
        <view class="article-meta">
          <text class="author">作者：{{ data.author }}</text>
          <text class="date">{{ formatDate(data.publishDate) }}</text>
        </view>
        
        <!-- 封面图 -->
        <image v-if="data.coverImage" :src="data.coverImage" class="cover-image" mode="widthFix" />
        
        <!-- 文章内容图片展示区域 -->
        <view class="article-images" v-if="data.images && data.images.length">
          <view class="image-grid">
            <view 
              class="image-item" 
              v-for="(img, index) in data.images" 
              :key="index" 
              @click="previewImage(index, data.images)"
            >
              <image :src="img" class="content-image" mode="aspectFill" />
            </view>
          </view>
        </view>
        
        <view class="article-content">
          <rich-text :nodes="data.content"></rich-text>
        </view>
        <view class="article-tags">
          <text v-for="tag in data.tags" :key="tag" class="tag">{{ tag }}</text>
        </view>
      </view>
    </unicloud-db>

    <!-- 底部导航栏 -->
    <!-- <tab-bar :selected="0"></tab-bar> -->
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import tabBar from '@/components/tab-bar/tabBar.vue';

const articleCollection = 'article';
// 添加images字段到查询字段中
const articleFields = '_id, title, author, content, coverImage, images, tags, publishDate';

const articleWhere = ref({});
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

// 图片预览方法
const previewImage = (current, urls) => {
  uni.previewImage({
    current,
    urls
  });
};

onLoad((options) => {
  if (options.id) {
    articleWhere.value = `_id == "${options.id}"`;
  } else {
    uni.showToast({
      title: '缺少文章ID',
      icon: 'none'
    });
  }
});
</script>

<style lang="scss">
.article-container {
  padding: 30rpx;
  background-color: #f5e8d0;

  .loading-text, .error-text {
    text-align: center;
    color: #999;
    padding: 40rpx 0;
  }

  .article-title {
    font-size: 40rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    color: #333;
  }

  .article-meta {
    font-size: 24rpx;
    color: #888;
    margin-bottom: 20rpx;
    display: flex;
    justify-content: space-between;
  }

  .cover-image {
    width: 100%;
    border-radius: 12rpx;
    margin: 20rpx 0;
  }

  /* 新增图片展示区域样式 */
  .article-images {
    margin: 20rpx 0;
    
    .image-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20rpx;
      
      .image-item {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 100%;
        border-radius: 12rpx;
        overflow: hidden;
        
        .content-image {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
      }
    }
  }

  .article-content {
    font-size: 30rpx;
    line-height: 1.6;
    white-space: pre-line;
    color: #444;
    
    /* 确保富文本中的图片也能正常显示 */
    img {
      max-width: 100%;
      border-radius: 8rpx;
      margin: 20rpx 0;
    }
  }

  .article-tags {
    margin-top: 30rpx;
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;

    .tag {
      display: inline-block;
      background-color: #eee;
      padding: 10rpx 20rpx;
      border-radius: 30rpx;
      font-size: 24rpx;
      color: #666;
    }
  }
}
</style>