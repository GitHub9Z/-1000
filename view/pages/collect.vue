<template>
	<view class="content" v-if="get_system_info.normal">
		<cu-custom :isBack="true" bgColor="bg-red text-white">
			<block slot="backText">返回</block>
			<block slot="content">我的关注</block>
		</cu-custom>
		<view class="content-main" v-if="page_data.collect_list.length > 0">
			<view class="content-main-item" v-for="collect in page_data.collect_list">
				<navigator class="content-main-item-head" hover-class='none' :url="`/view/pages/detail?user_id=${collect.user[0].user_id}`" navigateTo>
					<image :src="collect.user[0].avatar_url || '/static/logo.png'"></image>
				</navigator>
				<view class="content-main-item-title">{{collect.user[0].user_name}}</view>
				<view class="content-main-item-bar">
					<view class="content-main-item-bar-uncollect">
						<button class="cu-btn sm" style="border-radius: 2px;" :class="['bg-red']" @click="handleUncollectClick(collect)">取消关注</button>
					</view>
				</view>
			</view>
		</view>
		<empty text="暂无关注用户哦" v-else></empty>
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
				page_data: {
					collect_list: []
				}
			};
		},
		onLoad: function() {
			this.fetchData()
		},
		computed: {
			...mapGetters(['get_system_info'])
		},
		methods: {
			fetchData() {
				uni.request({
					url: 'https://www.imgker.com/venus/collect/get_collect_list',
					data: {},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						this.page_data.collect_list = res.data
					}
				})
			},
			handleUncollectClick(item) {
				uni.request({
					url: 'https://www.imgker.com/venus/collect/uncollect',
					data: {
						collected_user_id: item.collected_user_id
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						this.fetchData()
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
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
				display: flex;
				align-items: center;
				border-bottom: 1px solid rgba(0, 0, 0, 0.05);
				.content-main-item-head {
					padding: 0 10px;

					image {
						height: 50px;
						width: 50px;
						border-radius: 50%;
					}
				}

				.content-main-item-title {
					flex: 1;
					font-weight: bold;
					color: #303133;
					margin-right: 5px;
				}

				.content-main-item-bar {
					padding: 0 10px;
				}
			}
		}
	}
</style>
