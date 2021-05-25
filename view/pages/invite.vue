<template>
	<view class="content">
		<!-- 		<cu-custom class="content-title" bgColor="text-white bg-blue" :isBack="true">
		</cu-custom> -->
		<view class="content-back bg-red">
			<image class="content-back-logo" src="/static/venus.png" mode="aspectFill"></image>
		</view>
		<view class="content-main">
			<view class="content-main-title">请输入邀请码</view>
			<view class="cu-form-group">
				<view class="title"><text class="lg text-gray cuIcon-mail"></text></view>
				<input placeholder="邀请码" name="input" v-model="page_status.invite_id"></input>
				<button class='cu-btn bg-red' @click="hanldeNoInviteClick">没有邀请码</button>
			</view>
			<view class="content-main-btn"><button class="cu-btn bg-red margin-tb-sm lg round" style="width: 100%;" :disabled="!page_status.invite_id"
				 @click="hanldeConfirmClick">确认</button></view>
			<view class="content-main-tip"><text class="lg text-gray cuIcon-questionfill" style="margin-right: 3px;"></text>INLAY采用1对1私人服务模式，将为您提供一名专属红娘。
			<text class="lg text-red" style="margin-right: 3px;" @click="hanldeConfirmAdminClick">我是红娘</text></view>
		</view>
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
					invite_id: ''
				}
			}
		},
		async onLoad() {},
		async onShow() {},
		computed: {
			...mapGetters(['get_user_info'])
		},
		methods: {
			hanldeConfirmClick() {
				uni.request({
					url: 'https://www.imgker.com/venus/user/bind_admin', //仅为示例，并非真实接口地址。
					data: {
						invite_id: this.page_status.invite_id
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						uni.showToast({
							title: '绑定成功',
							duration: 2000
						})
						uni.redirectTo({
							url: './home'
						})
					}
				})
			},
			hanldeConfirmAdminClick() {
				uni.request({
					url: 'https://www.imgker.com/venus/user/i_am_admin', //仅为示例，并非真实接口地址。
					data: {
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						uni.redirectTo({
							url: './home'
						})
					}
				})
			},
			hanldeNoInviteClick() {
				uni.redirectTo({
					url: './adminList'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.content {
		height: 100vh;

		.content-back {
			height: 30vh;
			position: relative;

			.content-back-logo {
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				margin: auto;
				//border: 1px solid white;
				box-shadow: 0px 2px 12px 0px rgba(255, 255, 255, 1);
				height: 70px;
				width: 70px;
				border-radius: 50%;
			}

			&::after {
				content: '';
				width: 140%;
				height: 100px;
				position: absolute;
				left: -20%;
				bottom: -100px;
				z-index: -1;
				border-radius: 0 0 50% 50%;
				background: inherit;
			}
		}


		.content-main {
			width: 90vw;
			position: fixed;
			top: 25vh;
			left: 0;
			right: 0;
			margin: auto;
			background-color: white;
			padding: 20px;
			border-radius: 5px;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

			// display: flex;
			// flex-direction: column;
			// align-items: center;
			.content-main-title {
				padding: 0 10px;
				margin-bottom: 10px;
				color: #606266;
				font-size: 16px;
			}

			.content-main-btn {
				margin-top: 20px;
			}

			.content-main-tip {
				font-size: 12px;
				color: gray;
				position: absolute;
				bottom: -40px;
			}
		}
	}
</style>
