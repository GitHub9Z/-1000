<template>
	<view class="content" v-if="get_system_info.normal">
		<view class="content-head fixed">
			<cu-custom :isBack="true" bgColor="bg-white text-red">
				<block slot="backText">返回</block>
				<block slot="content">推荐</block>
			</cu-custom>
		</view>
		<view class="content-main" :style="{ 'padding-top': `${get_system_info.custom_bar}px` }">
			<template v-if="page_data.user_list.length > 0">
				<view class="cu-card dynamic">
					<view class="cu-item shadow" @click="handleItemClick(user)" v-for="user in page_data.user_list">
						<view class="padding-sm solid-bottom bg-red text-white">
							
							<view class="action" v-if="user.admin">
										<text class="cuIcon-title text-white"></text>
											<text>{{user.admin.user_name}}</text>
										</view>
						</view>
						<view class="padding padding-bottom-sm" v-if="user.tag">
									<view class="text-gray text-sm flex flex-wrap">
										<view class='cu-tag' :class="'line-' + page_config.color_config[index]" style="margin: 0 10rpx 10rpx 0" v-for="(tag, index) in user.tag">{{tag}}</view>
									</view>
						</view>
						<view class="text-content">
							<text class="text-content text-df">{{user.introduction}}</text>
						</view>
						<view class="grid flex-sub padding-lr col-1" v-if="user.imgList">
							<view class="bg-img only-img" :style="'background-image:url(' + user.imgList[0] + ')'"></view>
						</view>
						<view class="text-gray text-sm padding" style="display: flex; align-items: center;">
							<view style="flex: 1; display: flex;">
								<image :src="user.avatar_url || 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201912%2F25%2F20191225224833_zloky.thumb.400_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1623481033&t=2492609cde122393a99b4af1a177bf8d'" mode="aspectFill" style="width: 20px; height: 20px; border-radius: 50%; margin-right: 10px;"></image>
								<text style="line-height: 20px;">{{user.user_name}}</text>
							</view>
							<text class="margin-lr-xs">由{{user.recommend_user}}推荐</text>
						</view>
					</view>
				</view>
			</template>
			<empty text="暂无更多信息哦" v-else></empty>
		</view>
	</view>
	<view v-else>
		<image style="width: 100vw" mode="widthFix" src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01f0aa5632bd736ac7259e0fd710d4.jpg%401280w_1l_2o_100sh.png&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1626514551&t=14341f62bcbb3a98a3b03dade4cbafbe"></image>
	</view>
</template>

<script>
	import areaJson from '../../utils/area.js'
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
					page_size: 10,
					color_config: ['red', 'orange', 'yellow', 'olive', 'green', 'cyan', 'blue', 'purple', 'mauve', 'pink', 'brown', 'grey', 'gray'],
				},
				page_status: {
					page_no: 1
				},
				page_data: {
					user_list: [],
				}
			}
		},
		onLoad({
		}) {
		},
		onShow() {
			this.fetchData()
		},
		onReady() {
			uni.hideLoading()
		},
		computed: {
			...mapGetters(['get_system_info', 'get_user_info'])
		},
		methods: {
			handleItemClick(user) {
				uni.navigateTo({
					url: `./detail?user_id=${user.user_id}`
				})
			},
			fetchData() {
				uni.request({
					url: 'https://www.imgker.com/venus/recommend/get_recommend_list', //仅为示例，并非真实接口地址。
					data: {
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						this.page_data.user_list = res.data.map(_i => {
							let user_id = _i.user_id
							let admin = _i.admin
							let avatar_url = _i.avatar_url
							let user_name = _i.user_name
							let recommend_user = _i.recommend_user
							_i = JSON.parse(_i.user_info)
							_i.user_id = user_id
							_i.admin = admin
							_i.avatar_url = avatar_url
							_i.user_name = user_name
							_i.recommend_user = recommend_user.user_name
							let [b_province_index, b_city_index, b_area_index] = _i.bornMultiIndex || []
							let [l_province_index, l_city_index, l_area_index] = _i.liveMultiIndex || []
							console.log(b_province_index, b_city_index, b_area_index)
							console.log(l_province_index, l_city_index, l_area_index)
							_i.tag = [
								_i.gender ? ['男', '女'][_i.gender] : null,
								_i.date ? _i.date[2] + _i.date[3] + '年' : null,
								_i.bornMultiIndex ? `${areaJson[b_province_index].city[b_city_index].area[b_area_index]}` : null, 
								_i.liveMultiIndex ? `${areaJson[l_province_index].city[l_city_index].area[l_area_index]}工作` : null,
								..._i.hobby
							].filter(_i => _i)
							return _i
						})
						console.log(this.page_data.user_list)
						this.$forceUpdate()
					}
				})
			}
		},
	}
</script>

<style lang="less" scoped>
	.content {
		.content-head {
		}

		.content-main {
			overflow: hidden;
		}
	}

	.fixed {
		position: fixed;
		z-index: 99;
	}

	.VerticalNav.nav {
		width: 200upx;
		white-space: initial;
	}

	.VerticalNav.nav .cu-item {
		width: 100%;
		text-align: center;
		background-color: #fff;
		margin: 0;
		border: none;
		height: 50px;
		line-height: 50px;
		position: relative;
	}

	.VerticalNav.nav .cu-item.cur {
		background-color: #f1f1f1;
	}

	.VerticalNav.nav .cu-item.cur::after {
		content: "";
		width: 8upx;
		height: 30upx;
		border-radius: 10upx 0 0 10upx;
		position: absolute;
		background-color: currentColor;
		top: 0;
		right: 0upx;
		bottom: 0;
		margin: auto;
	}

	.VerticalBox {
		display: flex;
	}

	.VerticalMain {
		background-color: #f1f1f1;
		flex: 1;
	}
</style>
