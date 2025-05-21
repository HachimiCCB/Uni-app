<template>
  <view class="article-container">
    <unicloud-db
      ref="udb"
      v-slot:default="{ data, loading, error }"
      collection="article"
      field="title,author,summary,coverImage,publishDate,tags"
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
		  <view class="article-tags">
		    <text v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</text>
		  </view>
          <view class="article-info">
            <text class="title">{{ item.title }}</text>
           <text class="summary">{{ item.summary }}</text>
			<view class="meta-line"> <!-- 新增包裹容器 -->
			    <text class="author">作者：{{ item.author }}</text>
			    <text class="date">{{ formatDate(item.publishDate) }}</text>
			  </view>
          </view>
        </view>
      </view>

      <uni-load-more v-if="loading" status="loading" />
    </unicloud-db>
	
	<view class="comment-footer">
	  <button class="submit-btn" @click="openArticleCreate()">
	    <uni-icons type="compose" size="20"></uni-icons>
	    <text>发表我的文章</text>
	  </button>
	</view>
	
	<tab-bar :selected="3"></tab-bar>
  </view>
  <GlobalChatButton/>
</template>

<script setup>
import { getCurrentInstance, onMounted, ref } from 'vue';
import tabBar from '@/components/tab-bar/tabBar.vue';
import { onShow, onPullDownRefresh } from '@dcloudio/uni-app';

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

onPullDownRefresh(() => {
  console.log('触发下拉刷新');
  const udb = getCurrentInstance().refs.udb;
  if (udb) {
    udb.loadData({
      clear: true
    });
  }
  setTimeout(() => {
    uni.stopPullDownRefresh(); // 结束下拉动画
  }, 800); // 可根据网络情况调整
});

</script>

<style scoped>
.article-container {
  padding: 20rpx;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.article-card {
  background-color: #d4aa76;
  border: 2px solid rgb(165, 115, 66);
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 5rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.article-card:active {
  transform: scale(0.98);
}

.article-tags {
  position: absolute;
  top: 40rpx;
  right: 40rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10rpx;
  z-index: 2; /* 确保在图片之上 */
}

.article-tags .tag {
  display: inline-block;
  border-image-source: url('/static/img/common/tag.png');
  border-image-slice: 0 10 0 10 fill; /* 上下不切割，左右各切割10rpx */
  border-image-width: 0 10rpx 0 10rpx; /* 左右保留10rpx不拉伸区域 */
  border-image-repeat: stretch; /* 中间区域横向拉伸 */
  padding: 10rpx 30rpx;
  font-size: 24rpx;
  color: #fff;
  text-align: center;
  line-height: 1.4;
}



.cover-image {
  width: 100%;
  height: 200rpx;
}

.article-info {
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  height: 110px; /* 根据封面图高度调整 */
  position: relative; /* 新增定位上下文 */
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  white-space: normal; /* 允许标题自动换行 */
  line-height: 1.4; /* 新增行高 */
}

.author {
  font-size: 24rpx;
  color: #999;
  margin: 5rpx 0; /* 调整间距 */
}
.date {
  font-size: 24rpx;
  color: #999;
}

.summary {
  font-size: 26rpx;
  color: #555;
  margin-top: 10rpx;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;     /* 限制显示3行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta-line {
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  left: 20rpx;   /* 与 article-info 的 padding 一致 */
  right: 20rpx;  /* 与 article-info 的 padding 一致 */
  bottom: 20rpx;
}
.comment-footer {
	position: fixed;
	bottom: 110rpx;
	left: 0;
	right: 0;
	padding: 0rpx 40rpx;
}

.comment-footer .submit-btn {
	  height: 80rpx;
	  line-height: 80rpx;
	  background-color: antiquewhite;
	}
</style>
