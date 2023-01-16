<template>
	<view class="content" v-if="get_system_info.normal">
		<view class="content-main">
			<view class="content-main-logo">
				<image style="border-radius: 50%;" :src="get_global_config.app_logo" mode="aspectFill"></image>
			</view>
			<view class="content-main-user">
				<navigator hover-class='none' url="/view/pages/user" navigateTo>
					<image src="/static/user_center.png" mode="aspectFill"></image>
				</navigator>
				<view class="cu-tag badge" style="padding: 8px;" v-if="get_user_info.user_type === 0 && get_user_info.integrity && get_user_info.integrity < 100">资料完整度{{get_user_info.integrity}}% 去完善</view>
				<view class="cu-tag badge" style="padding: 8px;" v-else-if="get_user_info.user_type === 0 && !get_user_info.integrity">资料未填写 去完善</view>
			</view>
			<view class="content-main-msg">
				<navigator hover-class='none' url="/view/pages/msg" navigateTo>
					<image src="/static/user_msg.png" mode="aspectFill"></image>
				</navigator>
				<view class="cu-tag badge" v-if="Number(get_user_info.unread_msg_sum)">{{get_user_info.unread_msg_sum}}</view>
			</view>
			<view class="content-main-scan" @click="handleScanClick">
				<image src="/static/user_scan.png" mode="aspectFill"></image>
			</view>
			<view class="content-main-welcom">
				欢迎来到<view class="content-main-welcom-logo">{{get_global_config.app_name}}</view>
			</view>
			<view class="content-main-luck">
				我们将为您带来额外的收入
			</view>
			<view class="content-main-btns" v-if="get_user_info.user_type === 0">
				<view @click="handleNavigatorTo('/view/pages/recommend')">
					<view class="content-main-btns-btn">
						<text class="cuIcon-discoverfill text-green"></text>
						<text class="content-main-btns-btn-label">推荐</text>
					</view>
				</view>
				<view @click="handleNavigatorTo('/view/pages/find')">
					<view class="content-main-btns-btn">
						<text class="cuIcon-radioboxfill text-red"></text>
						<text class="content-main-btns-btn-label">发现</text>
					</view>
				</view>
				<view @click="handleNavigatorTo('/view/pages/date')">
					<view class="content-main-btns-btn">
						<text class="cuIcon-weixin text-brown"></text>
						<text class="content-main-btns-btn-label">约会</text>
					</view>
				</view>
				<view @click="handleNavigatorTo('/view/pages/activityList')">
					<view class="content-main-btns-btn">
						<text class="cuIcon-favorfill text-yellow"></text>
						<text class="content-main-btns-btn-label">活动</text>
					</view>
				</view>
				<!-- <view class="content-main-btns-btn disabled" @click="handleBagClick">
					<text class="cuIcon-presentfill text-yellow"></text>
					<text class="content-main-btns-btn-label">订制</text>
				</view> -->
			</view>
			<view class="content-main-btns" v-if="get_user_info.user_type === 1">
				<view @click="handleNavigatorTo('/view/pages/find')">
					<view class="content-main-btns-btn">
						<text class="cuIcon-radioboxfill text-red"></text>
						<text class="content-main-btns-btn-label">发现</text>
					</view>
				</view>
				<view @click="handleNavigatorTo('/view/pages/apply')">
					<view class="content-main-btns-btn">
						<text class="cuIcon-myfill text-green"></text>
						<text class="content-main-btns-btn-label">新的用户</text>
					</view>
				</view>
			</view>
		</view>
		<view class="content-course" v-if="get_user_info.user_type === 0 && !get_user_info.user_info && page_status.current_course <= 4">
			<view class="content-course-card">
				<image :src="'https://venus-image.oss-cn-beijing.aliyuncs.com/client_step_' + page_status.current_course + '.png'" mode="widthFix"/>
				<view class="content-course-card-console bg-red">
					<button class="cu-btn bg-red lg" @click="handleCourseNextClick">我知道了</button>
				</view>
			</view>
		</view>
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
	export default {
		data() {
			return {
				page_status: {
					current_course: 1
				},
				page_data: {
					scan_specie: null
				}
			}
		},
		async onLoad() {
			this.GET_ADMIN_INFO()
		},
		async onShow() {
			await this.GET_USER_INFO()
			this.set_find_condition(JSON.parse(this.get_user_info.user_require || '{}'))
		},
		computed: {
			...mapGetters(['get_system_info', 'get_user_info', 'get_global_config'])
		},
		methods: {
			...mapActions(['GET_USER_INFO', 'GET_ADMIN_INFO']),
			...mapMutations(['set_find_condition']),
			handleNavigatorTo(url) {
				uni.navigateTo({
					url
				})
			},
			handleModalClose() {
				this.page_data.scan_specie = null
			},
			handleBagClick() {
				uni.showToast({
					title: "暂未开放",
					icon: 'none',
					//image: '/static/venus.png', //自定义图标的本地路径，image 的优先级高于 icon
					duration: 2000, //提示的延迟时间，单位毫秒，默认：1500 
				})
			},
			handlInspectClick() {
				uni.request({
					url: 'https://www.imgker.com/venus/msg/luck_apply',
					data: {
						specie_id: this.page_data.scan_specie.id
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						uni.showToast({
							title: res.data === 'success' ? '申请成功' : res.data,
							duration: 2000
						})
						this.page_data.scan_specie = null
					}
				})
			},
			handlTransferClick() {
				uni.request({
					url: 'https://www.imgker.com/venus/msg/transfer_apply',
					data: {
						specie_id: this.page_data.scan_specie.id
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						uni.showToast({
							title: res.data === 'success' ? '申请成功' : res.data,
							duration: 2000
						})
						this.page_data.scan_specie = null
					}
				})
			},
			handleScanClick() {
				uni.scanCode({
					success: res => {
						if (res.result) {
							let { user_id, user_type, invite_id } = JSON.parse(res.result)
							if (user_type === 0) uni.navigateTo({
								url: `./detail?user_id=${user_id}`
							})
							if (user_type === 1) uni.navigateTo({
								url: `./find?invite_id=${invite_id}`
							})
						}
					},
					fail: function(res) {
						console.log('失败：', res);
					}
				})
			},
			handleCourseNextClick() {
				this.page_status.current_course ++
			}
		}
	}
</script>

<style lang="less" scoped>
	.disabled {
		-webkit-filter: grayscale(60%);
		opacity: 0.5;
		//pointer-events:none;
	}

	.modal-content {
		padding: 0 20px 20px 20px;

		.modal-content-info {
			background-color: white;
			padding: 10px;
			margin-bottom: 20px;
			border-radius: 5px;
			display: flex;
			box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

			.modal-content-info-head {
				image {
					height: 50px;
					width: 50px;
					border-radius: 50%;
				}
			}

			.modal-content-info-right {
				font-size: 14px;
				text-align: left;
				padding: 0 20px;

				.modal-content-info-right-title {
					font-size: 16px;
					font-weight: bold;
				}

				.modal-content-info-right-id {
					color: gray;
				}

				.modal-content-info-right-user {}
			}
		}
	}

	.content {
		height: 100vh;
		background-color: white;

		.content-main {
			height: 100%;
			display: flex;
			flex-direction: column;
			letter-spacing: 2px;
			padding: 30px;
			font-size: 30px;
			font-weight: 100;

			.content-main-user {
				height: 40px;
				width: 40px;
				display: flex;
				align-items: center;
				justify-content: center;
				position: fixed;
				right: 25px;
				bottom: 35px;
				border-radius: 50%;
				//box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
				box-shadow: 0px 2px 12px 0px rgba(235, 0, 0, 0.3);

				image {
					height: 22px;
					width: 22px;
					opacity: 0.7;
				}
			}

			.content-main-msg {
				height: 40px;
				width: 40px;
				display: flex;
				align-items: center;
				justify-content: center;
				position: fixed;
				right: 25px;
				bottom: 95px;
				border-radius: 50%;
				//box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
				box-shadow: 0px 2px 12px 0px rgba(235, 0, 0, 0.3);

				image {
					height: 18px;
					width: 18px;
					opacity: 0.7;
				}
			}

			.content-main-scan {
				height: 40px;
				width: 40px;
				display: flex;
				align-items: center;
				justify-content: center;
				position: fixed;
				right: 25px;
				bottom: 155px;
				border-radius: 50%;
				//box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
				box-shadow: 0px 2px 12px 0px rgba(235, 0, 0, 0.3);

				image {
					height: 18px;
					width: 18px;
					opacity: 0.7;
				}
			}

			.content-main-logo {
				margin-bottom: 20px;

				image {
					width: 35px;
					height: 35px;
				}
			}

			.content-main-welcom {
				.content-main-welcom-logo {
					font-weight: 500;
					//color: #4e952e;
					color: red;
					font-size: 35px;
					animation: glow 19800ms ease-out infinite alternate;
				}
			}

			.content-main-luck {
				flex: 1;

				.content-main-luck-score {
					//font-weight: normal;
					color: #F56C6C;
					font-size: 35px;
				}
			}

			.content-main-btn {
				padding: 5px 0;
				font-size: 14px;
				color: #4e952e;
				font-weight: normal;
			}

			.content-main-btns {
				display: flex;
				flex-wrap: wrap;

				.content-main-btns-btn {
					position: relative;
					height: 30vw;
					width: 30vw;
					margin: 20px 20px 0 0;
					box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					.content-main-btns-btn-label {
						font-size: 16px;
						margin-top: 10px;
					}

					.content-main-btns-btn-tag {
						font-size: 14px;
						font-weight: normal;
						position: absolute;
						top: 0px;
						right: 0px;
					}
				}
			}

			.content-main-card {
				position: fixed;
				bottom: 30%;
				left: 0;
				width: 100%;
				padding: 15px 30px;
				margin-top: 10px;
				box-shadow: 12px 12px 12px 12px rgba(0, 0, 0, 0.1);
				//box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
				font-size: 14px;
				font-weight: bold;
				color: white;
				background-color: #F56C6C;
			}
		}
		.content-course {
			position: fixed;
			top: 0;
			left: 0;
			height: 100vh;
			width: 100vw;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: rgba(0, 0, 0, 0.8);
			.content-course-card {
				background-color: white;
				border-radius: 10px;
				overflow: hidden;
				image {
					vertical-align: bottom;
				}
				.content-course-card-console {
					display: flex;
					align-items: center;
					justify-content: center;
					button {
						width: 100%;
					}
				}
			}
		}
	}

	@keyframes glow {
		0% {
			opacity: 0.5;
			color: red;
		}

		25% {
			opacity: 1;
			color: #4e952e;
		}

		50% {
			opacity: 0.5;
			//color: #409EFF;
			color: red;
		}

		75% {
			opacity: 1;
			//color: #E6A23C;
			color: #4e952e;
		}

		100% {
			opacity: 0.5;
			color: red;
		}
	}
</style>
