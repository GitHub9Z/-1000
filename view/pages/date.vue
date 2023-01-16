<template>
	<view class="content" v-if="get_system_info.normal">
		<cu-custom :isBack="true" bgColor="bg-red text-white">
			<block slot="backText">返回</block>
			<block slot="content">{{page_config.title_config[page_status.mode]}}</block>
		</cu-custom>
		<view class="cu-bar fixed" style="flex-direction: column; align-items: stretch;" :style="[{top:CustomBar + 'px'}]">
			<view class="cu-bar bg-white search">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input type="text" v-model="page_status.key_word" placeholder="输入搜索的用户名" confirm-type="search"></input>
				</view>
				<view class="action" @click="handleSearchClick">
					<text>搜索</text>
				</view>
			</view>
			<view class="border-top" v-if="page_status.mode === 'manage'">
				<scroll-view scroll-x class="bg-white nav" scroll-with-animation>
					<view class="cu-item" style="height: 35px; line-height: 35px;" :class="page_status.current_tab==item.value?'text-green cur':''"
					 v-for="(item,index) in page_config.tab_config" :key="index" @tap="handleTabSelect(item.value)">
						{{item.label}}
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="content-main" v-if="page_data.date_list.length > 0" :style="[{height:'calc(100vh - '+ CustomBar + (page_status.mode === 'manage' ? 'px - 90px)' : 'px - 50px)'), 'padding-top': page_status.mode === 'manage' ? '90px' : '50px'}]">
			<view class="content-main-item" v-for="date in page_data.date_list" :class="date.status === 5 ? 'disable' : ''">
				<view class="content-main-item-time">{{getDateDiff(date.create_time)}}</view>
				<view class="content-main-item-info">
					<navigator class="content-main-item-info-card" style="justify-content: flex-end;" hover-class='none' :url="`/view/pages/detail?user_id=${date.from_user[0].user_id}`"
					 navigateTo>
						<view class="content-main-item-info-card-name" style="text-align: right;">
							<view class="content-main-item-info-card-name-main">{{date.from_user[0].user_name}}</view>
							<view class="content-main-item-info-card-name-info">发起人</view>
						</view>
						<image :src="date.from_user[0].avatar_url || get_global_config.app_logo"></image>
					</navigator>
					<text class="cuIcon-radioboxfill text-red margin-lr-xs" style="font-size: 24px;"></text>
					<navigator class="content-main-item-info-card" hover-class='none' :url="`/view/pages/detail?user_id=${date.to_user[0].user_id}`"
					 navigateTo>
						<image :src="date.to_user[0].avatar_url || get_global_config.app_logo"></image>
						<view class="content-main-item-info-card-name">
							<view class="content-main-item-info-card-name-main">{{date.to_user[0].user_name}}</view>
							<view class="content-main-item-info-card-name-info">接受人</view>
						</view>
					</navigator>
					<!-- 					<view class="content-main-item-info-bar">
						<view class="content-main-item-info-bar-undate">
							<button class="cu-btn sm" style="border-radius: 2px;" :class="['bg-red']" @click="handleUndateClick(date)">取消收藏</button>
						</view>
					</view> -->
				</view>
				<view class="bg-white padding" v-if="date.status < 5">
					<view class="cu-steps">
						<view class="cu-item" :class="Number(index) > date.status ? 'text-gray' : 'text-red'" v-for="(item, index) in page_config.basics_list">
							<text :class="Number(index) === date.status ? 'cuIcon-usefullfill' : 'cuIcon-title'"></text> {{item.name}}
						</view>
					</view>
				</view>
				<view class="content-main-item-console">
					<button class="cu-btn" style="border-radius: 2px; margin-top: 10px; margin-left: 10px;" :class="['bg-green']"
					 @click="handleTelClick(date)">联系方式</button>
					<button class="cu-btn" style="border-radius: 2px; margin-top: 10px; margin-left: 10px;" :class="['line-red']" v-if="date.status === 0"
					 @click="handleAllowClick(date)">同意申请</button>
					<button class="cu-btn" style="border-radius: 2px; margin-top: 10px; margin-left: 10px;" :class="['bg-grey']" v-if="date.status === 5">约会已结束</button>
					<button class="cu-btn" style="border-radius: 2px; margin-top: 10px; margin-left: 10px;" :class="['line-grey']"
					 v-else @click="handleEndClick(date)">结束关系</button>
					<button class="cu-btn" style="border-radius: 2px; margin-top: 10px; margin-left: 10px;" :class="['bg-red']" v-if="date.status > 0 && date.status < 4"
					 @click="handleNextClick(date)">下一步</button>
				</view>
			</view>
			<!-- <view @click="handleMoreClick">加载更多</view> -->
		</view>
		<empty :text="page_config.empty_config[page_status.mode]" v-else></empty>
	</view>
	<view v-else>
		<image style="width: 100vw" mode="widthFix" src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01f0aa5632bd736ac7259e0fd710d4.jpg%401280w_1l_2o_100sh.png&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1626514551&t=14341f62bcbb3a98a3b03dade4cbafbe"></image>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapActions,
		mapMutations
	} from 'vuex'
	import Empty from '../component/empty.vue'
	export default {
		components: {
			Empty
		},
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				page_config: {
					tab_config: [{
						label: '所有',
						value: -1
					}, {
						label: '约会中',
						value: 1
					}, {
						label: '恋爱中',
						value: 2
					}, {
						label: '已订婚',
						value: 3
					}, {
						label: '已结婚',
						value: 4
					}, {
						label: '已结束',
						value: 5
					}],
					basics_list: [{
						icon: 'attentionfavorfill',
						name: '初识'
					}, {
						icon: 'emojiflashfill',
						name: '约会'
					}, {
						icon: 'hotfill',
						name: '恋爱'
					}, {
						icon: 'evaluate_fill',
						name: '订婚'
					}, {
						icon: 'roundcheckfill',
						name: '结婚'
					}],
					title_config: {
						normal: '我的约会',
						apply: '申请管理',
						manage: '约会管理'
					},
					empty_config: {
						normal: '暂无约会哦',
						apply: '暂无申请哦',
						manage: '暂无约会哦'
					}
				},
				page_data: {
					date_list: []
				},
				page_status: {
					mode: 'normal',
					current_tab: -1,
					key_word: '',
					page_no: 0,
					page_size: 5
				}
			};
		},
		onPullDownRefresh() {
			this.clearData()
			this.fetchData()
			console.log('--------下拉刷新-------')
			uni.showNavigationBarLoading() //在标题栏中显示加载
			uni.stopPullDownRefresh()
		},
		onReachBottom() {
			console.log('--------上滑更多-------')
			uni.showNavigationBarLoading() //在标题栏中显示加载
			this.fetchData()
		},
		onLoad: function({
			mode
		}) {
			if (mode) this.page_status.mode = mode
			this.fetchData()
		},
		watch: {
			'page_status.key_word'() {
				if (!this.page_status.key_word) {
					this.handleSearchClick()
				}
			}
		},
		computed: {
			...mapGetters(['get_system_info', 'get_global_config'])
		},
		methods: {
			fetchData() {
				uni.request({
					url: 'https://www.imgker.com/venus/date/get_date_list',
					data: {
						mode: this.page_status.mode,
						tab: this.page_status.current_tab,
						key_word: this.page_status.key_word,
						page_no: this.page_status.page_no,
						page_size: this.page_status.page_size
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						if (res.data.length === this.page_status.page_size) this.page_status.page_no++
						this.page_data.date_list = [
							...this.page_data.date_list,
							...res.data.filter(_i => this.page_data.date_list.every(__i => __i.date_id !== _i.date_id))
						]
					}
				})
			},
			handleMoreClick() {
				this.fetchData()
			},
			handleSearchClick() {
				this.clearData()
				this.fetchData()
			},
			handleTabSelect(index) {
				this.clearData()
				this.page_status.current_tab = index
				this.fetchData()
			},
			handleTelClick(date) {
				let list = [date.from_user[0].user_phone, date.to_user[0].user_phone]
				uni.showActionSheet({
					title: '联系方式',
					itemList: [date.from_user[0].user_name, date.to_user[0].user_name],
					success: e => {
						uni.makePhoneCall({
							phoneNumber: list[e.tapIndex],
							fail(e) {
								console.log(e)
							}
						})
					}
				});
			},
			handleNextClick(date) {
				uni.showModal({
					title: '提示',
					content: '请在征求对方同意后进入下一步哦',
					cancelText: "取消", // 取消按钮的文字  
					confirmText: "确认", // 确认按钮文字  
					showCancel: true, // 是否显示取消按钮，默认为 true
					confirmColor: '#f55850',
					cancelColor: '#39B54A',
					success: (res) => {
						if (res.confirm) {
							uni.request({
								url: 'https://www.imgker.com/venus/date/next',
								data: {
									date_id: date.date_id
								},
								header: {
									'custom-header': 'hello' //自定义请求头信息
								},
								success: (res) => {
									this.clearData()
									this.fetchData()
								}
							})
						} else {}
					}
				})
			},
			handleAllowClick(date) {
				uni.showModal({
					title: '提示',
					content: '是否确认同意约会申请?',
					cancelText: "取消", // 取消按钮的文字  
					confirmText: "确认", // 确认按钮文字  
					showCancel: true, // 是否显示取消按钮，默认为 true
					confirmColor: '#f55850',
					cancelColor: '#39B54A',
					success: (res) => {
						if (res.confirm) {
							uni.request({
								url: 'https://www.imgker.com/venus/date/agree_apply',
								data: {
									date_id: date.date_id
								},
								header: {
									'custom-header': 'hello' //自定义请求头信息
								},
								success: (res) => {
									this.clearData()
									this.fetchData()
								}
							})
						} else {}
					}
				})
			},
			handleEndClick(date) {
				uni.showModal({
					title: '提示',
					content: '是否确认关闭约会?(该操作不可逆)',
					cancelText: "取消", // 取消按钮的文字  
					confirmText: "确认", // 确认按钮文字  
					showCancel: true, // 是否显示取消按钮，默认为 true
					confirmColor: '#f55850',
					cancelColor: '#39B54A',
					success: (res) => {
						if (res.confirm) {
							uni.request({
								url: 'https://www.imgker.com/venus/date/end',
								data: {
									date_id: date.date_id
								},
								header: {
									'custom-header': 'hello' //自定义请求头信息
								},
								success: (res) => {
									this.clearData()
									this.fetchData()
								}
							})
						} else {}
					}
				})
			},
			clearData() {
				this.page_status.page_no = 0
				this.page_data.date_list = []
				uni.pageScrollTo({
				    scrollTop: 0
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.disable {
		filter: grayscale(100%);
		opacity: 0.5;
	}

	.content {
		.content-main {
			.content-main-item {
				padding: 10px;
				background-color: white;
				border-bottom: 1px solid rgba(0, 0, 0, 0.05);
				margin: 10px 10px 0 10px;

				// border-bottom: 1px solid rgba(0, 0, 0, 0.05);
				// box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
				.content-main-item-time {
					padding: 8px;
					text-align: center;
					font-size: 14px;
					color: gray;
				}

				.content-main-item-info {
					display: flex;
					align-items: center;
					justify-content: center;

					.content-main-item-info-card {
						flex: 1;
						margin: 0 10px;
						//flex: 1;
						display: flex;
						//flex-direction: column;
						align-items: center;

						// box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
						// border: 1px solid rgba(0, 0, 0, 0.05);
						image {
							height: 50px;
							width: 50px;
							min-width: 50px;
							border-radius: 50%;
							margin: 10px;
						}

						.content-main-item-info-card-name {

							// display: flex;
							// flex-direction: column;
							// align-items: center;
							.content-main-item-info-card-name-main {
								font-size: 16px;
								font-weight: bold;
								// white-space: nowrap;
								// /*文本溢出显示省略号*/
								// text-overflow: ellipsis;
								// /*溢出的部分隐藏*/
								// overflow: hidden;
							}

							.content-main-item-info-card-name-info {
								font-size: 14px;
								color: gray;
							}
						}
					}

					.content-main-item-info-title {
						flex: 1;
						font-weight: bold;
						color: #303133;
						margin-right: 5px;
					}

					.content-main-item-info-bar {
						padding: 0 10px;
					}
				}

				.content-main-item-console {
					background-color: white;
					border-top: 1px solid rgba(0, 0, 0, 0.05);
					text-align: right;
				}
			}
		}
	}
</style>
