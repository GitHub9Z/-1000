<template>
	<view>
		<cu-custom bgColor="bg-red text-white" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">{{page_config.share_user_id ? '将该用户推荐给' : '用户列表'}}</block>
		</cu-custom>
		<!-- 		<view class="cu-bar bg-white search fixed" :style="[{top:CustomBar + 'px'}]">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" placeholder="输入搜索的关键词" confirm-type="search"></input>
			</view>
			<view class="action">
				<button class="cu-btn bg-gradual-green shadow-blur round">搜索</button>
			</view>
		</view> -->
		<button class="content-share" open-type="share" v-if="page_config.share_user_id">
			<view>分享到微信</view>
			<view class="content-share-btn"><text class="cuIcon-weixin text-white"></text></view>
		</button>
		<scroll-view scroll-y class="indexes" :scroll-into-view="'indexes-'+ listCurID" :style="[{height:'calc(100vh - '+ CustomBar + 'px)'}]"
		 :scroll-with-animation="true" :enable-back-to-top="true" v-if="page_data.user_list.length > 0">
			<block v-for="(item,index) in modified_list" :key="index">
				<view :class="'indexItem-' + item.name" :id="'indexes-' + item.name" :data-index="item.name">
					<view class="padding">{{item.name}}</view>
					<view class="cu-list menu-avatar no-padding">
						<view class="cu-item" v-for="user in item.sub" @click="handleItemClick(user)">
							<view class="cu-avatar round lg" style="overflow: hidden;">
								<image style="height: 52px; width: 52px;" :src="user.avatar_url || '/static/venus.png'" mode="aspectFill"></image>
							</view>
							<view class="content">
								<view class="text-grey">{{user.user_name}}</view>
								<view class="text-gray text-sm">
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</scroll-view>
		<empty text="暂无用户信息哦" v-else></empty>
		<view class="indexBar" :style="[{height:'calc(100vh - ' + CustomBar + 'px)'}]">
			<view class="indexBar-box" @touchstart="tStart" @touchend="tEnd" @touchmove.stop="tMove">
				<view class="indexBar-item" v-for="(item,index) in list" :key="index" :id="index" @touchstart="getCur" @touchend="setCur">
					{{item.name}}</view>
			</view>
		</view>
		<!--选择显示-->
		<view v-show="!hidden" class="indexToast">
			{{listCur}}
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
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				hidden: true,
				listCurID: '',
				list: [],
				listCur: '',
				page_config: {
					share_user_id: null
				},
				page_data: {
					user_list: []
				}
			};
		},
		components: {
			Empty
		},
		computed: {
			...mapGetters(['get_user_info']),
			modified_list() {
				return this.list.filter(_i => _i.sub && _i.sub.length > 0)
			}
		},
		onShareAppMessage() {
			this.handleShareClick()
			let shareObj = {
				title: "欢迎体验INLAY婚恋服务", // 默认是小程序的名称(可以写slogan等)
				path: `/view/pages/detail?user_id=${this.page_config.share_user_id}`,
				imageUrl: this.page_config.image
			}
			return shareObj
		},
		// onShareTimeline() {
		// 	let shareObj = {
		// 		title: "欢迎体验INLAY婚恋服务", // 默认是小程序的名称(可以写slogan等)
		// 		query: `user_id=${this.page_config.share_user_id}`,
		// 		imageUrl: this.page_config.image
		// 	}
		// 	return shareObj
		// },
		onLoad({
			share_user_id,
			image
		}) {
			if (share_user_id) {
				this.page_config.share_user_id = share_user_id
				this.page_config.image = image
			}
			let list = [{}];
			for (let i = 0; i < 26; i++) {
				list[i] = {
					sub: null,
					name: null
				};
				list[i].name = String.fromCharCode(65 + i);
			}
			this.list = list;
			this.listCur = list[0];
			this.fetchData()
		},
		onReady() {
			let that = this;
			uni.createSelectorQuery().select('.indexBar-box').boundingClientRect(function(res) {
				that.boxTop = res.top
			}).exec();
			uni.createSelectorQuery().select('.indexes').boundingClientRect(function(res) {
				that.barTop = res.top
			}).exec()
		},
		methods: {
			fetchData() {
				uni.request({
					url: 'https://www.imgker.com/venus/user/find_manage_users',
					data: {
						inviteId: this.get_user_info.invite_id
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						this.page_data.user_list = res.data.sort(function(a, b) {
							return a.pinyin.localeCompare(b.pinyin)
						})
						this.list.forEach(_i => {
							_i.sub = this.page_data.user_list.filter(__i => __i.pinyin[0].toLowerCase() === _i.name.toLowerCase())
						})
						console.log(this.list)
					}
				})
			},
			handleItemClick(user) {
				if (this.page_config.share_user_id) {
					uni.request({
						url: 'https://www.imgker.com/venus/recommend/recommend',
						data: {
							user_id: this.get_user_info.user_id,
							recommended_user_id: this.page_config.share_user_id,
							recommended_to_user_id: user.user_id
						},
						header: {
							'custom-header': 'hello' //自定义请求头信息
						},
						success: (res) => {
							uni.navigateBack()
						}
					})
				} else {
					uni.navigateTo({
						url: `./detail?user_id=${user.user_id}`
					})
				}
			},
			//获取文字信息
			getCur(e) {
				this.hidden = false;
				this.listCur = this.list[e.target.id].name;
			},
			setCur(e) {
				this.hidden = true;
				this.listCur = this.listCur
			},
			//滑动选择Item
			tMove(e) {
				let y = e.touches[0].clientY,
					offsettop = this.boxTop,
					that = this;
				//判断选择区域,只有在选择区才会生效
				if (y > offsettop) {
					let num = parseInt((y - offsettop) / 20);
					this.listCur = that.list[num].name
				};
			},

			//触发全部开始选择
			tStart() {
				this.hidden = false
			},

			//触发结束选择
			tEnd() {
				this.hidden = true;
				this.listCurID = this.listCur
			},
			indexSelect(e) {
				let that = this;
				let barHeight = this.barHeight;
				let list = this.list;
				let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
				for (let i = 0; i < list.length; i++) {
					if (scrollY < i + 1) {
						that.listCur = list[i].name;
						that.movableY = i * 20
						return false
					}
				}
			},
			handleShareClick() {
				uni.share({
					provider: 'weixin',
					scene: "WXSceneSession",
					type: 5,
					imageUrl: this.page_config.image,
					title: '欢迎体验INLAY婚恋服务',
					miniProgram: {
						id: 'gh_c3f8cc2d889f',
						path: `pages/detail?user_id=${this.page_config.share_user_id}`,
						type: 2,
						webUrl: 'http://uniapp.dcloud.io'
					},
					success: ret => {}
				});
			}
		}
	}
</script>

<style lang="less">
	page {}

	.indexes {
		position: relative;
	}

	.indexBar {
		position: fixed;
		right: 0px;
		bottom: 0px;
		padding: 20upx 20upx 20upx 60upx;
		display: flex;
		align-items: center;
	}

	.indexBar .indexBar-box {
		width: 40upx;
		height: auto;
		background: #fff;
		display: flex;
		flex-direction: column;
		box-shadow: 0 0 20upx rgba(0, 0, 0, 0.1);
		border-radius: 10upx;
	}

	.indexBar-item {
		flex: 1;
		width: 40upx;
		height: 40upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24upx;
		color: #888;
	}

	movable-view.indexBar-item {
		width: 40upx;
		height: 40upx;
		z-index: 9;
		position: relative;
	}

	movable-view.indexBar-item::before {
		content: "";
		display: block;
		position: absolute;
		left: 0;
		top: 10upx;
		height: 20upx;
		width: 4upx;
		background-color: #f37b1d;
	}

	.indexToast {
		position: fixed;
		top: 0;
		right: 80upx;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		width: 100upx;
		height: 100upx;
		border-radius: 10upx;
		margin: auto;
		color: #fff;
		line-height: 100upx;
		text-align: center;
		font-size: 48upx;
	}

	.content-share {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 15px;
		background: white;
		font-size: 16px;
		.content-share-btn {
			background: #04BE02;
			width: 40px;
			height: 40px;
			border-radius: 50%;
			font-size: 20px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
