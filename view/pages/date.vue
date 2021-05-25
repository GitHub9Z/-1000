<template>
	<view class="content">
		<cu-custom :isBack="true" bgColor="bg-red text-white">
			<block slot="backText">返回</block>
			<block slot="content">{{page_config.title_config[page_status.mode]}}</block>
		</cu-custom>
		<view class="content-main" v-if="page_data.date_list.length > 0">
			<view class="content-main-item" v-for="date in page_data.date_list" :class="date.status === 5 ? 'disable' : ''">
				<view class="content-main-item-time">{{getDateDiff(date.create_time)}}</view>
				<view class="content-main-item-info">
					<navigator class="content-main-item-info-card" style="justify-content: flex-end;" hover-class='none' :url="`/view/pages/detail?user_id=${date.from_user[0].user_id}`"
					 navigateTo>
						<view class="content-main-item-info-card-name" style="text-align: right;">
							<view class="content-main-item-info-card-name-main">{{date.from_user[0].user_name}}</view>
							<view class="content-main-item-info-card-name-info">发起人</view>
						</view>
						<image :src="date.from_user[0].avatar_url || '/static/venus.png'"></image>
					</navigator>
					<text class="cuIcon-radioboxfill text-red margin-lr-xs" style="font-size: 24px;"></text>
					<navigator class="content-main-item-info-card" hover-class='none' :url="`/view/pages/detail?user_id=${date.to_user[0].user_id}`"
					 navigateTo>
						<image :src="date.to_user[0].avatar_url || '/static/venus.png'"></image>
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
					<button class="cu-btn" style="border-radius: 2px; margin-top: 10px; margin-left: 10px;" :class="['line-red']" v-if="date.status === 0"
					 @click="handleAllowClick(date)">同意申请</button>
					<button class="cu-btn" style="border-radius: 2px; margin-top: 10px; margin-left: 10px;" :class="['bg-grey']" v-if="date.status === 5">约会已结束</button>
					<button class="cu-btn" style="border-radius: 2px; margin-top: 10px; margin-left: 10px;" :class="['line-grey']"
					 v-else @click="handleEndClick(date)">结束关系</button>
					<button class="cu-btn" style="border-radius: 2px; margin-top: 10px; margin-left: 10px;" :class="['bg-red']" v-if="date.status > 0 && date.status < 4"
					 @click="handleNextClick(date)">下一步</button>
				</view>
			</view>
		</view>
		<empty :text="page_config.empty_config[page_status.mode]" v-else></empty>
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
				page_config: {
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
					mode: 'normal'
				}
			};
		},
		onLoad: function({
			mode
		}) {
			if (mode) this.page_status.mode = mode
			this.fetchData()
		},
		computed: {
			//...mapGetters(['get_user_info'])
		},
		methods: {
			fetchData() {
				uni.request({
					url: 'https://www.imgker.com/venus/date/get_date_list',
					data: {
						mode: this.page_status.mode
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						this.page_data.date_list = res.data
					}
				})
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
									this.fetchData()
								}
							})
						} else {}
					}
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

	.move {
		width: 100px !important;
	}

	.action {
		min-width: 100px !important;
	}

	.move-cur {
		transform: translateX(-100px) !important;
	}

	.content {
		.content-main {
			.content-main-item {
				padding: 10px;
				background-color: white;
				border-bottom: 1px solid rgba(0, 0, 0, 0.05);
				margin: 0 0 15px 0;
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
