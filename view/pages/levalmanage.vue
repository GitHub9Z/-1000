<template>
	<view class="content" v-if="get_system_info.normal">
		<cu-custom class="content-title" bgColor="bg-red text-white" border :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">等级管理</block>
		</cu-custom>
		<view class="content-main" v-if="leval_manage.length > 0">
			<view class="cu-list menu sm-border" >
					<view class="cu-item" v-for="item in leval_manage" @click="handleEditLeval(item.leval_id)"> 
						<view class="content">
							<text class="text-grey">{{item.leval_name}}</text>
						</view>
						<view class="action">
							<text class="cuIcon-right text-gray"></text>
						</view>
					</view>
			</view>
		</view>
		<empty text="暂无等级" v-else></empty>
		<view class="content-save">
			<button class="cu-btn bg-red lg" @click="handleCreateClick">添加等级</button>
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
	import Empty from '../component/empty.vue'
	export default {
		components: {
			Empty
		},
		data() {
			return {
				page_config: {},
				page_data: {
					// leval_manage: [{
					// 	name: '普通会员',
					// 	power: [0]
					// }, {
					// 	name: '白银会员',
					// 	power: [0, 1]
					// }, {
					// 	name: '黄金会员',
					// 	power: [0, 1, 2]
					// }, {
					// 	name: '钻石会员',
					// 	power: [0, 1, 2, 3]
					// }]
				},
				page_status: {

				}
			};
		},
		onShow() {
			this.GET_USER_INFO()
		},
		computed: {
			...mapGetters(['get_system_info', 'get_user_info']),
			leval_manage() {
				return JSON.parse(this.get_user_info.leval_manage)
			}
		},
		methods: {
			...mapActions(['GET_USER_INFO', 'UPLOAD_FILE']),
			handleCreateClick() {
				uni.navigateTo({
					url: '/view/pages/editleval'
				})
			},
				
			handleEditLeval(leval_id) {
				uni.navigateTo({
					url: `/view/pages/editleval?leval_id=${leval_id}`
				})
			}
		},
	}
</script>

<style lang="less" scoped>

	.content {
		image {
			max-height: 50px;
			height: 50px;
			max-width: 50px;
			width: 50px;
			border-radius: 50%;
			margin: 10px;
		}

		.content-main {
			background-color: white;
		}

		.content-save {
			background-color: white;
			position: fixed;
			bottom: 0;
			width: 100%;
			display: flex;
			flex-direction: column;
			padding: 10px;
			box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
		}
	}
</style>
