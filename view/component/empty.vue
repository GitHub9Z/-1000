<template>
	<view class="content">
		<view class="content-main">
			<image :src="get_global_config.app_logo" mode="aspectFill"></image>
			{{text || '暂无数据哦'}}
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
		props: {
			text: {
				type: String
			}
		},
		computed: {
			...mapGetters(['get_global_config'])
		},
		data() {
			return {
			}
		}
	}
</script>

<style lang="less" scoped>
	.content {
		padding: 80px;
		.content-main {
			padding: 40px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			//background: white;
			//box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
			font-size: 16px;
			filter: grayscale(100%);
			opacity: 0.3;
			text-align: center;
			image {
				height: 70px;
				width: 70px;
				border-radius: 50%;
				margin-bottom: 20px;
			}
		}
	}
</style>
