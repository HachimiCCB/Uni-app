<template>
	<view class="auth-container">
	    <!-- 顶部公告栏 -->
	    <uv-notice-bar 
	      :text="notice" 
	      color="#830000"
	      bgColor="#fbefcb"
	    ></uv-notice-bar>
	    
	    <!-- 加载状态 -->
	    <uv-loading-page 
	      :loading="loading" 
	      loading-text="加载中..." 
	      font-size="20px"
	      loading-mode="semicircle" 
	      bgColor="#8D6549"
	    ></uv-loading-page>
	    
	    <!-- 主界面 -->
	    <view class="auth-box">
	      <!-- 登录/注册切换 -->
	      <view class="auth-tabs">
	        <text 
	          :class="['tab-item', activeTab === 'login' ? 'active' : '']"
	          @click="switchTab('login')"
	        >登录</text>
	        <text 
	          :class="['tab-item', activeTab === 'register' ? 'active' : '']"
	          @click="switchTab('register')"
	        >注册</text>
	      </view>
	      
	      <!-- 登录表单 -->
	      <view v-if="activeTab === 'login'" class="auth-form">
	        <uv-input
	          v-model="loginForm.username"
	          placeholder="请输入用户名"
	          border="none"
	          bgColor="#fbefcb"
	          class="auth-input"
	        ></uv-input>
	        
	        <uv-input
	          v-model="loginForm.password"
	          type="password"
	          placeholder="请输入密码"
	          border="none"
	          bgColor="#fbefcb"
	          class="auth-input"
	        ></uv-input>
	        
	        <button 
	          @click="handleLogin"
	          class="auth-btn"
	        >登录</button>
	        
	        <view class="auth-extra">
	          <text @click="showForgetModal">忘记密码?</text>
	          <text @click="showQuickLoginModal">快捷登录</text>
	        </view>
	      </view>
	      
	      <!-- 注册表单 -->
	      <view v-else class="auth-form">
	        <uv-input
	          v-model="registerForm.username"
	          placeholder="设置用户名"
	          border="none"
	          bgColor="#fbefcb"
	          class="auth-input"
	        ></uv-input>
	        
	        <uv-input
	          v-model="registerForm.password"
	          type="password"
	          placeholder="设置密码(6-20位)"
	          border="none"
	          bgColor="#fbefcb"
	          class="auth-input"
	        ></uv-input>
	        
	        <uv-input
	          v-model="registerForm.confirmPwd"
	          type="password"
	          placeholder="确认密码"
	          border="none"
	          bgColor="#fbefcb"
	          class="auth-input"
	        ></uv-input>
	        
	        <button 
	          @click="handleRegister"
	          class="auth-btn"
	        >注册</button>
	        
	        <view class="auth-agreement">
	          <uv-checkbox v-model="agreeChecked"></uv-checkbox>
	          <text>我已阅读并同意</text>
	          <text class="link" @click="showAgreement">《用户协议[](@replace=10001)》</text>
	        </view>
	      </view>
	    </view>
	    
	    <!-- 底部导航 -->
	    <tab-bar :selected="4"></tab-bar>
	    
	    <!-- 各种模态框 -->
	    <uv-modal 
	      ref="forgetModal" 
	      title="找回密码"
	      :showCancelButton="true"
	    >
	      <uv-input placeholder="请输入注册邮箱"></uv-input>
	    </uv-modal>
	    
	    <uv-modal 
	      ref="quickLoginModal"
	      title="快捷登录"
	      :showCancelButton="true"
	    >
	      <button open-type="getPhoneNumber">微信一键登录</button>
	    </uv-modal>
	    
	    <uv-modal 
	      ref="agreementModal"
	      title="用户协议"
	      :showConfirmButton="false"
	    >
	      <scroll-view>这里是用户协议内容...</scroll-view>
	    </uv-modal>
	    
	    <uv-toast ref="toast"></uv-toast>
	  </view>
</template>

<script setup>
	import { ref } from 'vue'
	import tabBar from '@/components/tab-bar/tabBar.vue'
	
	const notice = ref('沟槽巫女说每注册一个用户就发三百金圆券当工资（真发吗？')
	const loading = ref(false)
	const activeTab = ref('login')
	
	const loginForm = ref({
	  username: '',
	  password: ''
	})
	
	const registerForm = ref({
	  username: '',
	  password: '',
	  confirmPwd: ''
	})
	
	const agreeChecked = ref(false)
	
	const switchTab = (tab) => {
	  activeTab.value = tab
	}
	
	const handleLogin = () => {
	  console.log('登录数据:', loginForm.value)
	  // 这里添加登录逻辑
	}
	
	const handleRegister = () => {
	  console.log('注册数据:', registerForm.value)
	  // 这里添加注册逻辑
	}
	
	const showForgetModal = () => {
	  forgetModal.value.open()
	}
	
	const showQuickLoginModal = () => {
	  quickLoginModal.value.open()
	}
	
	const showAgreement = () => {
	  agreementModal.value.open()
	}
	
	// 模态框引用
	const forgetModal = ref(null)
	const quickLoginModal = ref(null)
	const agreementModal = ref(null)
	const toast = ref(null)
</script>

<style lang="scss" scoped>
.auth-container {
  height: 100vh;
  background-color: #8D6549;
  padding: 20rpx;
  
  .auth-box {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 40rpx;
    margin-top: 30rpx;
    
    .auth-tabs {
      display: flex;
      justify-content: center;
      margin-bottom: 40rpx;
      
      .tab-item {
        padding: 20rpx 40rpx;
        font-size: 32rpx;
        color: #666;
        
        &.active {
          color: #8D6549;
          font-weight: bold;
          border-bottom: 4rpx solid #8D6549;
        }
      }
    }
    
    .auth-form {
      .auth-input {
        margin-bottom: 30rpx;
        border-radius: 8rpx;
        padding: 20rpx;
      }
      
      .auth-btn {
        background-color: #8D6549;
        color: #fff;
        border-radius: 50rpx;
        padding: 20rpx;
        margin: 40rpx 0;
      }
      
      .auth-extra {
        display: flex;
        justify-content: space-between;
        color: #666;
        font-size: 24rpx;
      }
      
      .auth-agreement {
        display: flex;
        align-items: center;
        font-size: 24rpx;
        color: #666;
        
        .link {
          color: #8D6549;
          margin-left: 8rpx;
        }
      }
    }
  }
}
</style>