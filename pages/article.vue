<template>
  <view class="article-container">
    <unicloud-db
      ref="udb"
      v-slot:default="{ data, loading, error }"
      collection="article"
      field="title,author,summary,coverImage,publishDate"
      orderby="publishDate desc"
    >
      <view class="article-list">
        <view
          class="article-card"
          v-for="item in data"
          :key="item._id"
          @click="goToDetail(item._id)"
        >
          <image :src="item.coverImage" class="cover-image" mode="aspectFill" />
          <view class="article-info">
            <text class="title">{{ item.title }}</text>
            <text class="author">作者：{{ item.author }}</text>
<!--            <text class="summary">{{ item.summary }}</text> -->
            <text class="date">{{ formatDate(item.publishDate) }}</text>
          </view>
        </view>
      </view>

      <uni-load-more v-if="loading" status="loading" />
    </unicloud-db>
	
	<view class="comment-footer">
	  <button class="submit-btn" @click="openArticleCreate()">
	    <uni-icons type="compose" size="20" color="#fff"></uni-icons>
	    <text>发表评论</text>
	  </button>
	</view>
	
	<tab-bar :selected="3"></tab-bar>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import tabBar from '@/components/tab-bar/tabBar.vue';
import { onShow } from '@dcloudio/uni-app';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const openArticleCreate = () => {
	// uni.setStorageSync('commentCreate', npc)
	uni.navigateTo({
		url: '/pages/articleCreate'
	})
}

const goToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/articleDetail?id=${id}`,
  });
};

onShow(() => {
  console.log('文章列表页面加载');
});
</script>

<style scoped>
.article-container {
  padding: 20rpx;
  background-color: #f5f5f5;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.article-card {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 5rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.article-card:active {
  transform: scale(0.98);
}

.cover-image {
  width: 100%;
  height: 200rpx;
}

.article-info {
  padding: 20rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.author,
.date {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

.summary {
  font-size: 26rpx;
  color: #555;
  margin-top: 10rpx;
  line-height: 1.4;
}
.comment-footer {
	position: fixed;
	bottom: 120rpx;
	left: 0;
	right: 0;
	padding: 20rpx 30rpx;
	background-color: #f8f3ee;
	border-top: 1rpx solid #e8e1d9;

	.submit-btn {
	  height: 80rpx;
	  line-height: 80rpx;
	  background: linear-gradient(145deg, #D2B48C, #B8860B);
	  color: #fff;
	  border-radius: 40rpx;
	  font-size: 30rpx;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  
	  text {
		margin-left: 10rpx;
	  }
	  
	  &:active {
		background: linear-gradient(145deg, #B8860B, #D2B48C);
		transform: scale(0.98);
	  }
	}
}

</style>
