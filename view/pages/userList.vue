<template>
	<view v-if="get_system_info.normal">
		<cu-custom bgColor="bg-red text-white" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">{{page_config.share_user_id ? '将该用户推荐给' : '用户列表'}}</block>
		</cu-custom>
		<view class="cu-bar bg-white search fixed" :style="[{top:CustomBar + 'px'}]">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" v-model="page_status.key_word" placeholder="输入搜索的用户名" confirm-type="search"></input>
			</view>
			<view class="action">
				<button class="cu-btn bg-red round" style="margin-left: 10px;" @click="handleModeClick"><text :class="page_status.show_mode === 'vip' ? 'cuIcon-list' : 'cuIcon-vip'" class=" text-white"></text></button>
			</view>
		</view>
		<button class="content-share" open-type="share" v-if="page_config.share_user_id">
			<view>分享到微信</view>
			<view class="content-share-btn"><text class="cuIcon-weixin text-white"></text></view>
		</button>
		<scroll-view scroll-y class="indexes" :scroll-into-view="'indexes-'+ listCurID" :style="[{height:'calc(100vh - '+ CustomBar + 'px - 50px)'}]"
		 :scroll-with-animation="true" :enable-back-to-top="true" v-if="filtered_user_list.length > 0">
		 <template v-if="page_status.show_mode === 'py'">
			<block v-for="(item,index) in list" :key="index">
				<view :class="'indexItem-' + item.name" :id="'indexes-' + item.name" :data-index="item.name">
					<view class="padding">{{item.name}}</view>
					<view class="cu-list menu-avatar no-padding">
						<view class="cu-item" v-for="user in item.sub" @click="handleItemClick(user)">
							<view class="cu-avatar round lg" style="overflow: hidden;">
								<image style="height: 52px; width: 52px;" lazy-load :src="user.avatar_url || get_global_config.app_logo" mode="aspectFill"></image>
							</view>
							<view class="content">
								<view class="text-grey">{{user.user_name}}<view v-if="user.leval_id != 0" class='cu-tag line-blue margin-lr-xs'>{{modified_leval_manage[user.leval_id]}}</view></view>
								<view class="text-gray text-sm" v-if="user.end_time != 0">
									会员到期时间:{{user.end_time}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</template>
		<template v-if="page_status.show_mode === 'vip'">
			<block v-for="(item,index) in list" :key="index">
				<view :class="'indexItem-' + item.name" :id="'indexes-' + item.name" :data-index="item.name">
					<view class="padding">{{item.name}}</view>
					<view class="cu-list menu-avatar no-padding">
						<view class="cu-item" v-for="user in item.sub" @click="handleItemClick(user)">
							<view class="cu-avatar round lg" style="overflow: hidden;">
								<image style="height: 52px; width: 52px;" lazy-load :src="user.avatar_url || get_global_config.app_logo" mode="aspectFill"></image>
							</view>
							<view class="content">
								<view class="text-grey">{{user.user_name}}<view v-if="user.leval_id != 0" class='cu-tag line-blue margin-lr-xs'>{{modified_leval_manage[user.leval_id]}}</view></view>
								<view class="text-gray text-sm" v-if="user.end_time != 0">
									会员到期时间:{{user.end_time}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</template>
		</scroll-view>
		<empty text="暂无符合条件的用户" v-else></empty>
		<view class="indexBar" :style="[{height:'calc(100vh - ' + CustomBar + 'px)'}]" v-if="page_status.show_mode === 'py'">
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
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				hidden: true,
				listCurID: '',
				listCur: '',
				page_config: {
					share_user_id: null
				},
				page_data: {
					user_list: []
				},
				page_status: {
					key_word: '',
					show_mode: 'py'
				}
			};
		},
		components: {
			Empty
		},
		computed: {
			...mapGetters(['get_system_info', 'get_user_info', 'get_global_config']),
			modified_leval_manage() {
				let obj = {}
				JSON.parse(this.get_user_info.leval_manage).forEach(_i => {
					obj[_i.leval_id] = _i.leval_name
				})
				return obj
			},
			filtered_user_list() {
				let res = this.page_data.user_list.filter(__i => __i.user_name.includes(this.page_status.key_word))
				if (this.page_status.show_mode === 'vip') {
					return res.filter(_i => _i.leval_id != 0)
				} else {
					return res
				}
			},
			list() {
				let list = [{}]
				let res
				if (this.page_status.show_mode === 'vip') {
					let leval_manage = JSON.parse(this.get_user_info.leval_manage || '[]')
					leval_manage = leval_manage.filter(_i => _i.leval_id != 0).map(_i => ({
						sub: this.filtered_user_list.filter(__i => __i.leval_id == _i.leval_id),
						name: this.modified_leval_manage[_i.leval_id]
					}))
					res = leval_manage.filter(_i => _i.sub && _i.sub.length > 0)
				}
				if (this.page_status.show_mode === 'py') {
					for (let i = 0; i < 26; i++) {
						list[i] = {
							sub: null,
							name: null
						};
						list[i].name = String.fromCharCode(65 + i)
					}
					if (!this.listCur) this.listCur = list[0]
					list.forEach(_i => {
						_i.sub = this.filtered_user_list.filter(__i => __i.pinyin[0].toLowerCase() === _i.name.toLowerCase())
					})
					res = list.filter(_i => _i.sub && _i.sub.length > 0)
				}
				console.log('fucking', res)
				return res
			}
		},
		onShareAppMessage() {
			this.handleShareClick()
			let shareObj = {
				title: `欢迎体验${this.get_global_config.app_name}婚恋服务`, // 默认是小程序的名称(可以写slogan等)
				path: `/view/pages/detail?user_id=${this.page_config.share_user_id}&single=1`,
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
							if (a.leval_id != 0 && b.leval_id == 0) return -1
							if (a.leval_id == 0 && b.leval_id != 0) return 1
							return a.pinyin.localeCompare(b.pinyin)
						})
						this.page_data.user_list.forEach(_i => _i.end_time = (_i.end_time ? new Date(_i.end_time).format("yyyy-MM-dd") : 0))
					}
				})
			},
			handleModeClick() {
				if (this.page_status.show_mode === 'py') this.page_status.show_mode = 'vip'
				else this.page_status.show_mode = 'py'
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
			handleSearchClick() {
				
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
					title: `欢迎体验${this.get_global_config.app_name}婚恋服务`,
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
	page {
		padding-top: 100upx;
	}

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
