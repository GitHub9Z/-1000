<template>
	<view class="content">
		<cu-custom class="content-title" bgColor="bg-red text-white" border :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">我的二维码</block>
		</cu-custom>
		<view class="content-main">
			<view class="content-main-qrcode">
				<canvas style="width: 200px; height: 200px;" canvas-id="myQrcode"></canvas>
			</view>
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
		components: {
		},
		data() {
			return {
				page_config: {},
				page_data: {
				},
				page_status: {

				}
			};
		},
		onLoad: function() {
			console.log(JSON.stringify({
					user_type: this.get_user_info.user_type,
					user_id: this.get_user_info.user_id,
					invite_id: this.get_user_info.invite_id
				}))
			this.$drawQrcode({
				width: 200,
				height: 200,
				canvasId: 'myQrcode',
				ctx: wx.createCanvasContext('myQrcode'),
				text: JSON.stringify({
					user_type: this.get_user_info.user_type,
					user_id: this.get_user_info.user_id,
					invite_id: this.get_user_info.invite_id
				})
			})
		},
		onShow() {},
		computed: {
			...mapGetters(['get_system_info', 'get_user_info'])
		},
		methods: {
		},
	}
</script>

<style lang="less" scoped>
	.content-main {
		width: 100vw;
		height: 70vh;
		display: flex;
		align-items: center;
		justify-content: center;
		.content-main-qrcode {
			background: white;
			border-radius: 5px;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 20px;
		}
	}
</style>
