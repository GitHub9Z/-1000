<template>
	<view class="content">
		<cu-custom :isBack="true" bgColor="bg-red text-white">
			<block slot="backText">返回</block>
			<block slot="content">消息</block>
		</cu-custom>
		<view class="content-main">
			<view class="cu-list menu-avatar" v-if="page_data.msg_list.length > 0">
				<view class="content-main-item cu-item" :class="[modalName=='move-box-'+ index?'move-cur':'']" v-for="(item, index) in page_data.msg_list"
				 :key="index" @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index">
					<text class="cuIcon-title text-red" style="margin-left: 10px;" v-if="item.msg_status === '未读'"></text>
					<text class="cuIcon-title text-blue" style="margin-left: 10px;" v-else></text>
					<view class="content-main-item-head" @click="handleMsgClick(item)">
						<image :src="`${item.msg_pic || '/static/venus.png'}`"></image>
					</view>
					<view style="width: 100%;" @click="handleMsgClick(item)">
						<text class="content-main-item-title">#{{item.msg_title}}#</text>
						<text class="content-main-item-content">{{item.msg_content}}</text>
					</view>
					<view class="action">
						<view class="content-main-item-action">{{getDateDiff(item.create_time)}}</view>
						<!-- 						<view class="content-main-item-action" v-if="item.title.includes('申请')">
							<button class="cu-btn bg-green sm" disabled style="border-radius: 2px;" v-if="item.ori.msg_status === '已同意'">已同意</button>
							<button class="cu-btn bg-green sm" style="border-radius: 2px;" @click="handleAgreeClick(item)" v-else>同意</button>
						</view> -->
					</view>
					<view class="move">
						<view class="bg-red" @click="handleDeleteClick(item)">删除</view>
					</view>
				</view>
			</view>
			<empty text="暂无收到消息哦" v-else></empty>
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
	import Empty from '../component/empty.vue'
	export default {
		components: {
			Empty
		},
		data() {
			return {
				modalName: '',
				page_data: {
					msg_list: []
				}
			};
		},
		onLoad: function() {
			this.fetchData()
		},
		computed: {
			...mapGetters(['get_user_info'])
		},
		methods: {
			fetchData() {
				uni.request({
					url: 'https://www.imgker.com/venus/msg/get_msg_by_user_id',
					data: {},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						this.page_data.msg_list = res.data
						// this.page_data.msg_list.forEach(_i => {
						// 	try {
						// 		_i.msg_pic = JSON.parse(_i.msg_pic)
						// 	} catch (e) {
						// 		console.log(e)
						// 	}
						// })
					}
				})
			},
			handleMsgClick(msg) {
				if (msg.msg_url) {
					uni.navigateTo({
						url: msg.msg_url
					})
				}
			},
			handleDeleteClick(msg) {
				uni.request({
					url: 'https://www.imgker.com/venus/msg/delete_msg',
					data: {
						msg_id: msg.msg_id
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						this.fetchData()
					}
				})
			},
			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},

			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},

			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			},

			handleItemOpen(modalName) {
				this.modalName = modalName
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
				.content-main-item-head {
					padding: 0 10px;

					image {
						height: 50px;
						width: 50px;
						border-radius: 50%;
					}
				}

				.content-main-item-title {
					font-weight: bold;
					color: #303133;
					margin-right: 5px;
				}

				.content-main-item-content {
					font-weight: normal;
					color: #909399;
				}

				.content-main-item-action {
					padding: 0 10px;
					display: flex;
					justify-content: flex-end;
					font-size: 14px;
					color: gray;
				}
			}
		}
	}
</style>
