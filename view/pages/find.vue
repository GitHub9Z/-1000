<template>
	<view class="content" v-if="get_system_info.normal">
		<view class="content-head fixed">
			<cu-custom :isBack="true" bgColor="bg-white text-red">
				<block slot="backText">返回</block>
				<block slot="content">{{page_data.admin_info.user_name ? '俱乐部' : '发现'}}</block>
			</cu-custom>
			<view class="cu-bar bg-white search" style="width: 100vw;">
				<view class="search-form radius">
					<text class="cuIcon-search"></text>
					<input v-model="page_status.key_word" :adjust-position="false" type="text" placeholder="请输入搜索关键词" confirm-type="search"></input>
				</view>
				<view class="action" @click="page_status.next_page = 0; this.page_data.user_list = []; handleSearchClick()">
					<!-- <text class="cuIcon-search"></text> -->
					<text>搜索</text>
				</view>
			</view>
			<view class="content-head-console">
				<view class="content-head-console-sort" :class="[page_status.priority_sort === 'stature' ? 'text-orange' : 'text-gray']"
				 @click="handleStatureSortClick">身高{{page_status.stature_sort ? '降序' : '升序'}}<text :class="[page_status.stature_sort ? 'cuIcon-triangledownfill' : 'cuIcon-triangleupfill']"></text></view>
				<view class="content-head-console-age" :class="[page_status.priority_sort === 'age' ? 'text-orange' : 'text-gray']"
				 @click="handleAgeSortClick">年龄{{page_status.age_sort ? '降序' : '升序'}}<text :class="[page_status.stature_sort ? 'cuIcon-triangledownfill' : 'cuIcon-triangleupfill']"></text></view>
				<view class="content-head-console-cond" @click="handleConditionClick">筛选条件{{condition_num ? ` (${condition_num})` : ''}}</view>
			</view>
		</view>
		<view class="content-main" :style="{ 'padding-top': `${get_system_info.custom_bar + 100}px` }">
			<view class="content-main-admin" v-if="page_data.admin_info.user_name">
			<view class="content-main-admin-user" @click="handleLoginClick">
				<view class="content-main-admin-user-head">
					<image :src="page_data.admin_info.avatar_url || get_global_config.app_logo" mode="aspectFill"></image>
				</view>
				<view class="content-main-admin-user-info">
					<view class="content-main-admin-user-info-name">{{page_data.admin_info.user_name}}
					</view>
					<view class="content-main-admin-user-info-intro">
						<text class="cuIcon-location text-gray"></text>{{page_data.admin_info.address}}
					</view>
				</view>
			</view>
			<view class="content-main-admin-info">
				<view class="content-main-admin-info-tel" style="width: 100%;" @click="handlePhoneClick">
					<view class="content-main-admin-info-tel-label">
						联系方式
					</view>
					<view class="content-main-admin-info-tel-value">
						{{page_data.admin_info.user_phone}}
					</view>
				</view>
				<view class="content-main-admin-info-usernum" style="width: 100%;">
					<view class="content-main-admin-info-usernum-label">
						用户
					</view>
					<view class="content-main-admin-info-usernum-value">
						{{page_data.admin_info.date_num || 0}}
					</view>
				</view>
				<view class="content-main-admin-info-join" style="width: 100%;" v-if="get_user_info.user_type == 0 && !get_user_info.invite_id.includes(page_data.admin_info.invite_id)" @click="handleJoinClubClick">
					<view class="content-main-admin-info-join-label">
						点击
					</view>
					<view class="content-main-admin-info-join-value">
						立即加入
					</view>
				</view>
			</view>
			</view>
			<template v-if="page_data.user_list.length > 0">
				<view class="cu-card dynamic">
					<view class="cu-item shadow" @click="handleItemClick(user)" v-for="user in page_data.user_list">
						<view class="padding-sm solid-bottom bg-red text-white">

							<view class="action" v-if="user.admin">
								<text class="cuIcon-title text-white"></text>
								<text>信息来源：{{user.admin.user_name}}</text>
							</view>
						</view>
						<view class="padding" style="padding-bottom: 0;" v-if="user.tag">
							<view class="text-gray text-sm flex flex-wrap">
								<template v-for="(tag, index) in user.tag">
									<template v-if="index === 0">
									<view class='cu-tag bg-blue light' style="margin: 0 10rpx 10rpx 0" v-if="user.gender == 0"><text class="cuIcon-male text-blue" style="margin-right: 5rpx"/>{{tag}}</view>
									<view class='cu-tag bg-pink light' style="margin: 0 10rpx 10rpx 0" v-else><text class="cuIcon-female text-pink" style="margin-right: 5rpx"/>{{tag}}</view>
									</template>
									<view class='cu-tag' :class="'line-' + page_config.color_config[index]" style="margin: 0 10rpx 10rpx 0" v-else>{{tag}}</view>
								</template>
							</view>
						</view>
						<view class="text-content" style="padding-top: 20rpx; max-height: none;">
							<text class="text-content text-df">{{user.introduction}}</text>
						</view>
						<view class="grid flex-sub padding-lr col-1" v-if="user.imgList">
							<view class="bg-img only-img" :style="'background-image:url(' + user.imgList[0] + ')'"></view>
						</view>
						<view class="text-gray text-sm padding" style="display: flex; align-items: center; line-height: 20px;">
							<view style="flex: 1; display: flex;">
								<image :src="user.avatar_url || 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201912%2F25%2F20191225224833_zloky.thumb.400_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1623481033&t=2492609cde122393a99b4af1a177bf8d'"
								 mode="aspectFill" style="width: 20px; height: 20px; border-radius: 50%; margin-right: 10px;"></image>
								<text style="color: #333333">{{user.user_name}}</text>
								<text style="margin-left: 10px;">活跃于{{getDateDiff(user.update_time)}}</text>
							</view>
							<text class="cuIcon-attentionfill margin-lr-xs"></text>{{user.hot || 0}}
						</view>
					</view>
				</view>
			</template>
			<empty text="暂无符合条件的用户" v-else></empty>
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
					page_size: 5,
					color_config: ['red', 'orange', 'yellow', 'olive', 'green', 'cyan', 'blue', 'purple', 'mauve', 'pink', 'brown',
						'grey', 'gray'
					],
				},
				page_status: {
					key_word: '',
					next_page: 0,
					stature_sort: true,
					age_sort: true,
					priority_sort: 'age'
				},
				page_data: {
					user_list: [],
					admin_info: {},
					doing: 'list'
				}
			}
		},
		onLoad({
			invite_id
		}) {
			if (invite_id) this.page_status.invite_id = invite_id
		},
		onPullDownRefresh() {
			this.clearData()
			console.log('--------下拉刷新-------')
			uni.showNavigationBarLoading() //在标题栏中显示加载
			uni.stopPullDownRefresh()
			if (this.page_status.invite_id) this.fetchAdminInfo()
			this.handleSearchClick()
		},
		onReachBottom() {
			console.log('--------上滑更多-------')
			uni.showNavigationBarLoading() //在标题栏中显示加载
			this.handleSearchClick()
		},
		onShow() {
			this.GET_USER_INFO()
			if (this.page_status.doing === 'detail') {
				this.page_status.doing = 'list'
				return
			}
			this.clearData()
			if (this.page_status.invite_id) this.fetchAdminInfo()
			this.handleSearchClick()
		},
		onReady() {
			uni.hideLoading()
		},
		watch: {
			'page_status.key_word'() {
				if (!this.page_status.key_word) {
					this.clearData()
					this.handleSearchClick()
				}
			}
		},
		computed: {
			...mapGetters(['get_system_info', 'get_user_info', 'get_find_condition']),
			condition_num() {
				let num = 0
				let _c = this.get_find_condition
				if (_c.genderIndex > 0) num++
				if (_c.educationIndex > 0) num++
				if (_c.marriageIndex > 0) num++
				if (_c.ageMultiIndex && (_c.ageMultiIndex[0] != 0 || _c.ageMultiIndex[1] != 0)) num++
				if (_c.statureMultiIndex && (_c.statureMultiIndex[0] != 0 || _c.statureMultiIndex[1] != 0)) num++
				if (_c.bornPool && _c.bornPool.length > 0) num++
				if (_c.livePool && _c.livePool.length > 0) num++
				return num
			}
		},
		methods: {
			...mapActions(['GET_USER_INFO']),
			handlePhoneClick() {
				uni.makePhoneCall({
					phoneNumber: this.page_data.admin_info.user_phone,
					fail(e) {
						console.log(e)
					}
				})
			},
			handleJoinClubClick() {
				uni.showModal({
					title: '提示',
					content: `是否申请加入${this.page_data.admin_info.user_name}？${this.get_user_info.invite_id ? '(申请后将退出原俱乐部且会员信息不再保留，且在此之前的俱乐部申请将自动取消)' : ''}`,
					cancelText: "取消", // 取消按钮的文字  
					confirmText: "确认", // 确认按钮文字  
					showCancel: true, // 是否显示取消按钮，默认为 true
					confirmColor: '#f55850',
					cancelColor: '#39B54A',
					success: (res) => {
						if (res.confirm) {
							uni.request({
								url: 'https://www.imgker.com/venus/user/bind_admin', //仅为示例，并非真实接口地址。
								data: {
									invite_id: this.page_data.admin_info.invite_id + '=='
								},
								header: {
									'custom-header': 'hello' //自定义请求头信息
								},
								success: (res) => {
									uni.showToast({
										title: '申请成功',
										duration: 2000
									})
									this.GET_USER_INFO()
								}
							})
						} else {
						}
					}
				})
			},
			fetchAdminInfo() {
				uni.request({
					url: 'https://www.imgker.com/venus/user/get_admin_info', //仅为示例，并非真实接口地址。
					data: {
						invite_id: this.page_status.invite_id
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						this.page_data.admin_info = res.data
						this.$forceUpdate()
					}
				})
			},
			handleItemClick(user) {
				this.page_status.doing = 'detail'
				if (this.get_user_info.user_type === 0 && (!this.get_user_info.integrity || this.get_user_info.integrity < 100)) {
					uni.showModal({
						title: '提示',
						content: `请先完善自己的个人信息哦，当前资料完成度${this.get_user_info.integrity || 0}%。`,
						cancelText: "取消", // 取消按钮的文字  
						confirmText: "确认", // 确认按钮文字  
						showCancel: true, // 是否显示取消按钮，默认为 true
						confirmColor: '#f55850',
						cancelColor: '#39B54A',
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: `./detailedit`
								})
							} else {}
						}
					})
					return 
				}
				uni.navigateTo({
					url: `./detail?user_id=${user.user_id}`
				})
			},
			ages(str) {
				var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
				if (r == null) return false;
				var d = new Date(r[1], r[3] - 1, r[4]);
				if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
					var Y = new Date().getFullYear();
					return (Y - r[1]);
				}
				return ("输入的日期格式错误！");
			},
			handleSearchClick() {
				uni.request({
					url: 'https://www.imgker.com/venus/user/find_users', //仅为示例，并非真实接口地址。
					data: {
						keyword: this.page_status.key_word,
						inviteId: this.page_status.invite_id || '',
						condition: JSON.stringify(this.get_find_condition),
						ageSort: this.page_status.age_sort,
						statureSort: this.page_status.stature_sort,
						prioritySort: this.page_status.priority_sort,
						pageNo: this.page_status.next_page,
						pageSize: this.page_config.page_size
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						if (res.data.length === this.page_config.page_size) {
							this.page_status.next_page++
						}
						this.page_data.user_list = [
							...this.page_data.user_list,
							...res.data.filter(_i => _i.user_info).map(_i => {
								let user_id = _i.user_id
								let admin = _i.admin
								let avatar_url = _i.avatar_url
								let user_name = _i.user_name
								let hot = _i.hot
								let update_time = _i.update_time
								let match_rate = _i.match_rate
								_i = JSON.parse(_i.user_info || '{}')
								_i.user_id = user_id
								_i.admin = admin
								_i.avatar_url = avatar_url
								_i.user_name = user_name
								_i.hot = hot
								_i.update_time = update_time
								_i.match_rate = match_rate
								let [b_province_index, b_city_index, b_area_index] = _i.bornMultiIndex || []
								let [l_province_index, l_city_index, l_area_index] = _i.liveMultiIndex || []
								try {
									_i.tag = [
										`${_i.date ? this.ages(_i.date) : ''}` || null,
										//`${_i.gender ? ['♂', '♀'][_i.gender] : ''}${_i.date ? this.ages(_i.date) : ''}` || null,
										// _i.gender ? ['男', '女'][_i.gender] : null,
										// _i.date ? _i.date[2] + _i.date[3] + '年' : null,
										(_i.stature && Number(_i.stature) > -1) ? Number(_i.stature) + 130 + 'cm' : null,
										((this.get_user_info.user_type === 0) && _i.match_rate) ? `匹配度${_i.match_rate}%` : null,
										_i.bornMultiIndex ? `${areaJson[b_province_index].city[b_city_index].area[b_area_index]}` : null,
										_i.liveMultiIndex ? `${areaJson[l_province_index].city[l_city_index].area[l_area_index]}工作` : null,
										..._i.hobby
									].filter(_i => _i)
								} catch (e) {
									console.log(e)
								}
								return _i
							}).filter(_i => this.page_data.user_list.every(__i => __i.user_id !== _i.user_id))
						]
						this.$forceUpdate()
					}
				})
			},
			handleConditionClick() {
				uni.navigateTo({
					url: './findcond'
				})
			},
			handleStatureSortClick() {
				this.clearData()
				this.page_status.stature_sort = !this.page_status.stature_sort
				this.page_status.priority_sort = 'stature';
				this.handleSearchClick()
			},
			handleAgeSortClick() {
				this.clearData()
				this.page_status.age_sort = !this.page_status.age_sort
				this.page_status.priority_sort = 'age';
				this.handleSearchClick()
			},
			clearData() {
				this.page_status.next_page = 0
				this.page_data.user_list = []
				uni.pageScrollTo({
				    scrollTop: 0
				})
			}
		},
	}
</script>

<style lang="less" scoped>
	.content {
		.content-head {
			background: white;
			.content-head-console {
				display: flex;
				align-items: center;
				padding: 10px;
				background-color: white;
				font-size: 14px;
				color: #606266;
				border-top: 1px solid #ebebeb;
				text-align: center;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

				.content-head-console-sort {
					flex: 1;
					border-right: 1px solid #ebebeb;
				}

				.content-head-console-age {
					flex: 1;
					border-right: 1px solid #ebebeb;
				}

				.content-head-console-cond {
					flex: 1
				}
			}
		}

		.content-main {
			overflow: hidden;
			.content-main-admin {
				margin: 5px 15px 2px 15px;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
				//animation: show 2800ms ease-out;
				.content-main-admin-user {
					background-color: white;
					display: flex;
					align-items: center;
					padding: 20px;
			
					//box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
					.content-main-admin-user-head {
						margin-right: 15px;
			
						image {
							max-height: 50px;
							height: 50px;
							max-width: 50px;
							width: 50px;
							border-radius: 50%;
						}
					}
			
					.content-main-admin-user-info {
						.content-main-admin-user-info-name {
							font-size: 20px;
							font-weight: bold;
							color: #303133;
						}
			
						.content-main-admin-user-info-intro {
							font-size: 12px;
							color: #909399;
						}
					}
					
				}
				.content-main-admin-info {
					display: flex;
					padding: 10px 0;
					background: white;
					border-top: 1px solid #ebebeb;
				
					.content-main-admin-info-tel {
						flex: 1;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						border-right: 1px solid #ebebeb;
						color: gray;
				
						.content-main-admin-info-tel-value {
							font-size: 14px;
							margin-top: 3px;
							color: #303133;
						}
					}
				
					.content-main-admin-info-usernum {
						flex: 1;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						border-right: 1px solid #ebebeb;
						color: gray;
				
						.content-main-admin-info-usernum-value {
							font-size: 14px;
							margin-top: 3px;
							color: #303133;
						}
					}
				
					.content-main-admin-info-join {
						flex: 1;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						color: gray;
				
						.content-main-admin-info-join-value {
							font-size: 14px;
							margin-top: 3px;
							color: #e54d42;
							font-weight: bold;
						}
					}
				}
			}
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
