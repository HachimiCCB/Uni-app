<template>
    <page-meta>
        <navigation-bar :title="'人物详情'" background-color="#8D6549" />
    </page-meta>
    <view class="npc-item" :style="{ height: swiperHeight + 'px' }">
        <view class="npc-item-info" @click="back">
            <image :src="'/static/img/npc/' + npc.name + '.png'" style="width: 100px; height: 130px;margin-right: 10px;" mode="scaleToFill" lazy-load="true"/>
            <view class="tag-div">
                <view style="margin: 0px;font-weight: bold;font-size: 20px;">{{ npc.chinese }}</view>
                <view>持有: {{ npc.money }} 円</view> 
					<!-- 待修改 -->
                <view class="tag-div-location">出没地区: {{ npc.location }}</view>
					<!-- 待修改 -->
            </view>
        </view>
    </view>
</template>

<script setup>
    import { ref, nextTick } from 'vue';
	import cookBar from '@/components/cookBar.vue'
    
    const back = () => {
        uni.navigateBack()
    }
    const swiperHeight = ref('')
	nextTick(() => {
        swiperHeight.value = uni.getSystemInfoSync().windowHeight
		setTimeout(() => {
			filterDrinks('')
			filterCooks('', '')
		}, 100)
	})
    
    const tabList = ref([
        {name: '推荐'},
        {name: '烹饪'},
        {name: '饮料'},
        {name: '符卡'},
        {name: '羁绊'},
    ])
    const tabName = ref(0)
    const clickTab = (item) => {
        tabName.value = item.index
    }
    
    const npc = ref(uni.getStorageSync('selectNpc'))
    const drinks = ref(uni.getStorageSync('drinksData'))
    const npcDrinks = ref([])
    const drinksMap = ref([])
    drinks.value.forEach(item => {
        drinksMap.value[item.chinese] = item
    })
    const drinksFilter = ref(new Set())
    const filterDrinks = (item) => {
        if (!!item) {
            if (drinksFilter.value.has(item)) {
                drinksFilter.value.delete(item)
            } else {
                drinksFilter.value.add(item)
            }
        }
        // 筛选饮料
        npcDrinks.value = drinks.value.filter(item => {
            let tagList = item.tag.split(",")
            let filter = [...drinksFilter.value].concat()
            if (tagList.length < drinksFilter.value.size) {
                return false
            }
            tagList.forEach(tag => {
                filter = filter.filter(item => item !== tag.trim())
            })
            return filter.length === 0
        })
    }
    
    const cookList = ref(uni.getStorageSync('cookData'))
    const cooks = ref([])
    const cookMap = ref([])
    cookList.value.forEach(item => {
        cookMap.value[item.chinese] = item
    })
    const cookFilter = ref(new Set())
    const cookNoTagFilter = ref(new Set())
    npc.value.noTag.split(',').forEach(tag => {
        cookNoTagFilter.value.add(tag.trim())
    })
    const filterCooks = (flag, item) => {
        if (!!item) {
            if ('tag' === flag) {
                if (cookFilter.value.has(item)) {
                    cookFilter.value.delete(item)
                } else {
                    cookFilter.value.add(item)
                }
            } else {
                if (cookNoTagFilter.value.has(item)) {
                    cookNoTagFilter.value.delete(item)
                } else {
                    cookNoTagFilter.value.add(item)
                }
            }
        }
        // 筛选喜好食物
        cooks.value = cookList.value.filter(item => {
            let tagList = item.tag.split(",")
            let tagfilter = [...cookFilter.value].concat()
            let tagNofilter = [...cookNoTagFilter.value].concat()
            let tagNoResult = new Set()
            if (tagList.length < cookFilter.value.size) {
                return false
            }
            tagList.forEach(tag => {
                tagfilter = tagfilter.filter(item => item !== tag.trim())
                cookNoTagFilter.value.forEach(item => {
                    if (item === tag.trim()) {
                        tagNoResult.add(item)
                    }
                })
            })
            return tagfilter.length === 0 && tagNoResult.size === 0
        })
		spliceCook()
    }
	const cookShow = ref([])
	const spliceCook = () => {
	    cookShow.value.splice(0)
	    let end = cooks.value.length < 10 ? cooks.value.length : 10
	    for (let i = 0; i < end; i++) {
	        cookShow.value.push(cooks.value[i])
	    }
	    setTimeout(() => {
	        cookShow.value = cooks.value
	    }, 100)
	}
</script>

<style lang="scss" scoped>
    :deep(.uni-page-head__title) {
        color: #000000;
    }
    
    .npc-item {
        width: 100vw;
        background-color: #d7ad95;
        // border: 1px solid red;
        
        .npc-item-info {
            padding: 10px;
            display: flex;
            
            .tag-div {
                width: calc(100vw - 110px);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
				
				.tag-div-location {
					max-height: 70px;
					overflow: auto;
				}
				.tag-div-location::-webkit-scrollbar {
				  display: none;
				}
            }
        }
        
        .npc-item-tab {
            width: 100vw;
            
            .npc-item-tab-div {
                overflow: auto;
                padding: 5px;
                color: #000000;
                background-color: #CFBFA2;
                
                .npc-item-tab-div-recommend-cook {
                    height: 48%;
                    margin: 5px;
                    overflow: auto;
                    border-radius: 10px;
                    
                    .npc-item-tab-div-cook-div-cook {
                        margin: 5px 2px;
                        padding: 0px 5px;
                        height: auto;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        border-radius: 10px;
                        background-color: #d4aa76;
						border: 1px solid rgb(165, 115, 66);
                    }
                }
                
                .npc-item-tab-div-recommend-cook::-webkit-scrollbar {
                  display: none;
                }
                
                .npc-item-tab-div-cook-tag {
                    padding: 5px 5px;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                }
                
                .npc-item-tab-div-drinks-tag {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    margin: 5px;
                    height: 60px;
                }
                
                .npc-item-tab-div-reward-title {
                    padding: 10px;
                    font-weight: bold;
                    font-size: 20px;
                    color: #FFF3D1;
                    text-shadow: -1px 0 #FF4F56, 0 1px #FF4F56, 1px 0 #FF4F56, 0 -1px #FF4F56;
                }
                .npc-item-tab-div-reward-div {
                    padding: 20px;
                    background-image: url('/static/img/common/reward.png');
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                }
                .npc-item-tab-div-punish-title {
                    padding: 10px;
                    font-weight: bold;
                    font-size: 20px;
                    color: #FFF3D1;
                    text-shadow: -1px 0 #93596D, 0 1px #93596D, 1px 0 #93596D, 0 -1px #93596D;
                }
                .npc-item-tab-div-punish-div {
                    padding: 20px;
                    background-image: url('/static/img/common/punish.png');
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                }
                
                .npc-item-tab-div-friend {
                    padding: 10px;
                    
                    .npc-item-tab-div-friend-item {
                        margin: 10px 0px;
                        
                        .npc-item-tab-div-friend-item-view {
                            display: flex;
                            align-items: center;
                            margin: 5px 0;
                            
                            .left {
                                width: 25%;
                            }
                            
                            .right {
                                width: 75%;
                            }
                        }
                    }
                }
            }
            .npc-item-tab-div::-webkit-scrollbar {
              display: none;
            }
            .npc-item-tab-div-cook-div::-webkit-scrollbar {
              display: none;
            }
            .npc-item-tab-div-card::-webkit-scrollbar {
              display: none;
            }
            .npc-item-tab-div-drinks-div::-webkit-scrollbar {
              display: none;
            }
        }
    }
</style>