<template>
  <view class="comment-container">
    <!-- 显示评论区 -->
    <unicloud-db ref="udb" v-slot:default="{ data, loading, error, options }" 
      :options="formData" 
      :collection="commentCollection" 
      :field="commentFields" 
      @load="loadComments">
      
      <view class="comment-header">
        <text class="comment-title">用户评论</text>
        <text class="comment-count" v-if="data && data.length">({{data.length}}条)</text>
      </view>
      
      <view class="comment-list">
        <!-- 循环并显示评论 -->
        <view class="comment-item" v-for="item in data" :key="item._id">
          <view class="comment-avatar">
            <image src="/static/images/default-avatar.png" mode="aspectFill" />
          </view>
          <view class="comment-content">
            <view class="comment-user">
              <text class="username">{{ item.user_id || '匿名用户' }}</text>
              <text class="time">{{ formatTime(item.create_time) }}</text>
            </view>
            <view class="comment-text">{{ item.content }}</view>
            <view class="comment-actions">
              <view class="action-item">
                <uni-icons type="hand-up" size="16" color="#8B5A2B"></uni-icons>
                <text>12</text>
              </view>
              <view class="action-item">
                <uni-icons type="chat" size="16" color="#8B5A2B"></uni-icons>
                <text>回复</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <uni-load-more v-if="loading || options.status === 'noMore'" 
        :status="options.status" 
        :icon-size="16"
        color="#8B5A2B" />
    </unicloud-db>
    
    <!-- 提交新评论的按钮 -->
    <view class="comment-footer">
      <button class="submit-btn" @click="submitComments">
        <uni-icons type="compose" size="20" color="#fff"></uni-icons>
        <text>发表评论</text>
      </button>
    </view>

    <!-- 底部导航栏 -->
    <tab-bar :selected="3"></tab-bar>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import tabBar from '@/components/tab-bar/tabBar.vue';
import { onShow } from '@dcloudio/uni-app';

// 定义评论集合名称和查询字段
const commentCollection = 'comment';
const commentFields = '_id, user_id, content, create_time';

<<<<<<< HEAD
// 格式化时间显示
const formatTime = (time) => {
  const date = new Date(time);
  return `${date.getMonth()+1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const formData = ref({ status: 'loading' });
=======
  // 加载评论的方法
  const loadComments = (data, ended) => {
    if (ended) {
      formData.value.status = 'noMore';
    }
  };
>>>>>>> 5ea1b1c6684c81950abf04fa8824337082c762e5

const submitComments = () => {
  uni.navigateTo({
    url: '/pages/comments/submit'
  });
};

const loadComments = (data, ended) => {
  if (ended) {
    formData.value.status = 'noMore';
  }
};

onShow(() => {
  console.log('评论页面显示');
});
</script>

<style lang="scss">
.comment-container {
  min-height: 100vh;
  background-color: #f8f3ee;
  padding-bottom: 100rpx;
  
  .comment-header {
    padding: 20rpx 30rpx;
    border-bottom: 1rpx solid #e8e1d9;
    display: flex;
    align-items: center;
    
    .comment-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #5C3A21;
    }
    
    .comment-count {
      font-size: 24rpx;
      color: #A0866D;
      margin-left: 10rpx;
    }
  }
  
  .comment-list {
    padding: 20rpx 30rpx;
    
    .comment-item {
      display: flex;
      padding: 30rpx 0;
      border-bottom: 1rpx solid #f0e5d8;
      
      .comment-avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 20rpx;
        
        image {
          width: 100%;
          height: 100%;
        }
      }
      
      .comment-content {
        flex: 1;
        
        .comment-user {
          display: flex;
          align-items: center;
          margin-bottom: 10rpx;
          
          .username {
            font-size: 28rpx;
            color: #5C3A21;
            font-weight: bold;
            margin-right: 15rpx;
          }
          
          .time {
            font-size: 22rpx;
            color: #A0866D;
          }
        }
        
        .comment-text {
          font-size: 28rpx;
          color: #5C3A21;
          line-height: 1.5;
          margin-bottom: 15rpx;
        }
        
        .comment-actions {
          display: flex;
          
          .action-item {
            display: flex;
            align-items: center;
            margin-right: 30rpx;
            
            text {
              font-size: 24rpx;
              color: #8B5A2B;
              margin-left: 8rpx;
            }
          }
        }
      }
    }
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
}
</style>