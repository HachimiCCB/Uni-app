<template>
  <view class="submit-comments">

    <!-- 显示评论区 -->
    <unicloud-db ref="udb" v-slot:default="{ data, loading, error, options }" :options="formData" :collection="commentCollection" :field="commentFields" @load="loadComments">
      <uni-list>
        <!-- 循环并显示评论 -->
        <uni-list-item direction="column" v-for="item in data" :key="item._id">
          <template v-slot:header>
            <view class="uni-title">评论内容</view>
          </template>
          <template v-slot:body>
            <view class="uni-list-box">
              <view class="uni-content">
                <view class="uni-title-sub uni-ellipsis-2">{{ item.content }}</view>
                <view class="uni-note">{{ item.user_id }} | 发表时间: {{ item.create_time }}</view>
              </view>
            </view>
          </template>
        </uni-list-item>
      </uni-list>

      <!-- 加载状态，没有更多数据显示 -->
      <uni-load-more v-if="loading || options.status === 'noMore'" :status="options.status" />
    </unicloud-db>
	
	<!-- 提交新评论的按钮 -->
	<button @click="submitComments()">发表我的评论</button>
  </view>

  <!-- 底部导航栏 -->
  <tab-bar :selected="3"></tab-bar>
</template>

<script setup>
  import { ref } from 'vue';
  import tabBar from '@/components/tab-bar/tabBar.vue';
  import { onShow } from '@dcloudio/uni-app';

  // 定义评论集合名称和查询字段
  const commentCollection = 'comment';  // 评论集合名称
  const commentFields = '_id, user_id, content, create_time'; // 查询的字段
  
  // 用于管理表单数据和加载状态的状态变量
  const formData = ref({ status: 'loading' });

  // 加载评论的方法
  const loadComments = (data, ended) => {
    if (ended) {
      formData.value.status = 'noMore';
    }
  };

  onShow(() => {
    // 页面显示时触发的逻辑，例如加载数据
    console.log('Page is shown, load data if necessary');
  });
</script>

<style lang="scss" scoped>
  .submit-comments {
    height: calc(100vh - 120px);
    background-color: #8D6549;
    padding: 10px;

    button {
      margin: 10px;
      background-color: #fbefcb;
    }
  }

  .uni-content {
    padding: 10px;
  }

  .uni-title-sub {
    font-size: 16px;
    color: #333;
  }

  .uni-note {
    font-size: 12px;
    color: #999;
  }

  .uni-footer {
    display: flex;
    justify-content: space-between;
  }

  .uni-footer-text {
    font-size: 14px;
  }
</style>