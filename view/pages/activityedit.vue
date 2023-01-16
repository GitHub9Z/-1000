<template>
	<view class="content" v-if="get_system_info.normal">
		<cu-custom class="content-title" bgColor="bg-red text-white" border :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">{{page_status.mode === 'edit' ? '编辑活动' : '发起活动'}}</block>
		</cu-custom>
		<view class="content-main">
			<view class="cu-list menu sm-border ">
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">活动名称</text>
					</view>
					<view class="action">
						<input placeholder="请输入活动名称" v-model="page_data.activity_info.activity_name" name="input" style="width: 100%; text-align: right;"></input>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">谁能参与</text>
					</view>
					<view class="action">
						<picker @change="handleRolesPickerChange" :range="page_config.leval_array">
							<view class="picker">
								{{roles}}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-item" v-if="page_data.activity_info.roles.length > 0">
					<view class="padding-bottom-sm">
						<view class='cu-tag line-red margin-top-sm margin-lr-xs' v-for="(item, index) in page_data.activity_info.roles"
						 @click="handleRoleDelete(index)">{{item.leval_name}}</view>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">性别限制</text>
					</view>
					<view class="action">
						<switch @change="page_status.dos = !page_status.dos" :class="page_status.dos ? 'checked' : ''" :checked="page_status.dos"></switch>
					</view>
				</view>
				<view class="cu-item" v-if="!page_status.dos">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">参与人数</text>
					</view>
					<view class="action">
						<input placeholder="不限" v-model="page_data.activity_info.num" type="number" name="input" style="width: 100%; text-align: right;"></input>
					</view>
				</view>
				<template v-else>
					<view class="cu-item">
						<view class="content">
							<text class="cuIcon-title text-green"></text>
							<text class="text-grey">男性人数</text>
						</view>
						<view class="action">
							<input placeholder="不限" v-model="page_data.activity_info.male_num" type="number" name="input" style="width: 100%; text-align: right;"></input>
						</view>
					</view>
					<view class="cu-item">
						<view class="content">
							<text class="cuIcon-title text-green"></text>
							<text class="text-grey">女性人数</text>
						</view>
						<view class="action">
							<input placeholder="不限" v-model="page_data.activity_info.female_num" type="number" name="input" style="width: 100%; text-align: right;"></input>
						</view>
					</view>
				</template>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">开始日期</text>
					</view>
					<view class="action">
						<picker mode="date" :value="page_data.activity_info.start_date" :start="new Date().format('yyyy-MM-dd')" @change="handleSDPickerChange">
							<view class="picker">
								{{page_data.activity_info.start_date || '选择日期'}}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">开始时间</text>
					</view>
					<view class="action">
						<picker mode="time" :value="page_data.activity_info.start_time" start="00:00" end="23:59" @change="handleSTPickerChange">
							<view class="picker">
								{{page_data.activity_info.start_time || '选择时间'}}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">结束日期</text>
					</view>
					<view class="action">
						<picker mode="date" :value="page_data.activity_info.end_date" :start="end_date_start" @change="handleEDPickerChange">
							<view class="picker">
								{{page_data.activity_info.end_date || '选择日期'}}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">结束时间</text>
					</view>
					<view class="action">
						<picker mode="time" :value="page_data.activity_info.end_time" :start="end_time_start" end="23:59" @change="handleETPickerChange">
							<view class="picker">
								{{page_data.activity_info.end_time || '选择时间'}}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">活动地点</text>
					</view>
					<view class="action">
						<picker mode="multiSelector" @change="handleAreaMultiChange" @columnchange="handleAreaMultiColumnChange" :value="areaMultiIndex"
						 :range="page_config.areaMultiArray">
							<view class="picker">
								{{area}}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">详细地址</text>
					</view>
					<view class="action">
						<input placeholder="请输入详细地址" v-model="page_data.activity_info.address" name="input" style="width: 100%; text-align: right;"></input>
					</view>
				</view>
				<view class="cu-item">
					<view style="width: 100%;">
						<view class="content padding-top">
							<text class="cuIcon-titles text-green"></text>
							<text class="text-grey">活动照片</text>
						</view>
						<view class="content padding-tb padding-lr-sm">
							<view class="grid col-4 grid-square flex-sub">
								<view class="bg-img" v-for="(item,index) in page_data.activity_info.imgList" :key="index" @tap="ViewImage"
								 :data-url="page_data.activity_info.imgList[index]">
									<image :src="page_data.activity_info.imgList[index]" mode="aspectFill"></image>
									<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
										<text class='cuIcon-close'></text>
									</view>
								</view>
								<view class="solids" @tap="ChooseImage" v-if="page_data.activity_info.imgList.length<4">
									<text class='cuIcon-cameraadd'></text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="cu-item" style="margin-bottom: 50px;">
					<view style="width: 100%;">
						<view class="content padding-top">
							<text class="cuIcon-titles text-green"></text>
							<text class="text-grey">活动介绍</text>
						</view>
						<view class="content padding-tb padding-lr-sm">
							<textarea maxlength="140" placeholder="请输入活动介绍" v-model="page_data.activity_info.introduction"></textarea>
						</view>
					</view>
				</view>
<!-- 				<view class="cu-item" style="margin-bottom: 50px;">
					<view style="width: 100%;">
						<view class="content padding-top">
							<text class="cuIcon-titles text-green"></text>
							<text class="text-grey">活动标签</text>
						</view>
						<view class="padding-tb padding-lr-sm">
							<view class='cu-tag' :class="'line-' + page_config.color_config[index]" style="margin: 0 10rpx 10rpx 0" v-for="(item, index) in page_data.activity_info.tag"
							 @click="handleTagDelete(index)">{{item}}<text class="cuIcon-close text-red margin-left-xs"></text></view>
							<view class='cu-tag line-grey' style="margin: 0 10rpx 10rpx 0" @click="handleTagAdd">添加 +</view>
						</view>
					</view>
				</view> -->
			</view>
		</view>
		<view class="content-save">
			<view class="cu-bar bg-white tabbar border flex" v-if="page_status.mode === 'edit'">
				<button class="cu-btn bg-red lg" style="flex: 100" @click="handleEditClick">编辑</button>
				<button class="action" @click="handleDeleteClick">
					<view class="cuIcon-deletefill text-gray">
						<!-- <view class="cu-tag badge">5</view> -->
					</view> 删除
				</button>
			</view>
			<button v-if="page_status.mode === 'create'" class="cu-btn bg-red lg" @click="handleCreateClick">发起</button>
		</view>
		<view class="cu-modal" :class="page_status.tag_modal_visible ? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content" style="padding-bottom: 0;">添加活动标签</view>
					<view class="action" @tap="page_status.tag_modal_visible = false">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<view style="background-color: white; margin-bottom: 20px; padding: 5px; border-radius: 5px;"><input placeholder="请输入标签内容"
						 v-model="page_status.input_tag" name="input" style="width: 100%;"></input></view>
					<view><button class="cu-btn block bg-red margin-tb-sm lg" style="width: 100%;" :disabled="!page_status.input_tag"
						 @click="handleAddTagConfirm">确定</button></view>
				</view>
			</view>
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
					color_config: ['red', 'orange', 'yellow', 'olive', 'green', 'cyan', 'blue', 'purple', 'mauve', 'pink', 'brown',
						'grey', 'gray'
					],
					areaMultiArray: [
						areaJson.map(_i => _i.name),
						areaJson[0].city.map(_i => _i.name),
						areaJson[0].city[0].area
					],
					activity_id: '',
					leval_array: []
				},
				page_data: {
					activity_info: {
						imgList: [],
						introduction: '',
						tag: [],
						start_date: '',
						start_time: '',
						end_date: '',
						end_time: '',
						activity_name: '',
						areaMultiIndex: null,
						address: '',
						roles: [],
						num: '',
						female_num: '',
						male_num: '',
					},
				},
				page_status: {
					mode: 'create',
					dos: false,
					tag_modal_visible: false,
					input_tag: '',
					areaChoosingIndex: [0, 0, 0],
				}
			};
		},
		onLoad: function({
			activity_id
		}) {
			if (activity_id) {
				this.page_status.mode = 'edit'
				this.page_config.activity_id = activity_id
			}

			this.fetchData()
		},
		onShow() {
			//this.fetchData()
		},
		computed: {
			...mapGetters(['get_system_info', 'get_user_info']),
			area() {
				if (!this.page_data.activity_info.areaMultiIndex) return '请选择'
				let [province_index, city_index, area_index] = this.page_data.activity_info.areaMultiIndex
				// if (!province_index && !city_index && !area_index) return '请选择'
				// if (!city_index && !area_index) return areaJson[province_index].name
				// if (!area_index) return `${areaJson[province_index].name} ${areaJson[province_index].city[city_index].name}`
				return `${areaJson[province_index].name} ${areaJson[province_index].city[city_index].name} ${areaJson[province_index].city[city_index].area[area_index]}`
			},
			end_date_start() {
				return this.page_data.activity_info.start_date || new Date().format('yyyy-MM-dd')
			},
			end_time_start() {
				return (this.page_data.activity_info.start_date === this.page_data.activity_info.end_date) ? this.page_data.activity_info
					.start_time : '00:00'
			},
			modified_activity_info() {
				let ai = this.page_data.activity_info
				let modified_activity_info = {
					start_time: new Date(ai.start_date + ' ' + ai.start_time).valueOf(),
					end_time: new Date(ai.end_date + ' ' + ai.end_time).valueOf(),
					activity_name: ai.activity_name,
					imgList: JSON.stringify(ai.imgList),
					tag: JSON.stringify(ai.tag),
					areaMultiIndex: JSON.stringify(ai.areaMultiIndex),
					address: ai.address,
					roles: ai.roles.map(_i => `[${_i.leval_id}]`).join(''),
					num: this.page_status.dos ? '' : ai.num,
					female_num: this.page_status.dos ? ai.female_num : '',
					male_num: this.page_status.dos ? ai.male_num: '',
					introduction: ai.introduction,
					snapshoot: JSON.stringify(ai)
				}
				return modified_activity_info
			},
			roles() {
				return this.page_data.activity_info.roles.length <= 0 ? '不限' : `已选${this.page_data.activity_info.roles.length}个`
			}
		},
		methods: {
			...mapActions(['GET_USER_INFO', 'UPLOAD_FILE']),
			async fetchData() {
				await this.GET_USER_INFO()
				this.page_config.leval_array = JSON.parse(this.get_user_info.leval_manage).map(_i => _i.leval_name)
				if (this.page_status.mode === 'create') return
				uni.request({
					url: 'https://www.imgker.com/venus/activity/get_activity_list', //仅为示例，并非真实接口地址。
					data: {
						activity_id: this.page_config.activity_id
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						if (res.data && res.data.length > 0) {
							let activity = res.data[0]
							this.page_data.activity_info = JSON.parse(activity.snapshoot)
							if (activity.female_num || activity.male_num) this.page_status.dos = true
						} else {
						}
					}
				})
			},
			handleTagAdd() {
				this.page_status.tag_modal_visible = true
			},
			handleAddTagConfirm() {
				this.page_data.activity_info.tag.push(this.page_status.input_tag)
				this.page_status.input_tag = ''
				this.page_status.tag_modal_visible = false
			},
			handleTagDelete(index) {
				uni.showModal({
					title: '提示',
					content: '是否删除该标签',
					cancelText: "取消", // 取消按钮的文字  
					confirmText: "确认", // 确认按钮文字  
					showCancel: true, // 是否显示取消按钮，默认为 true
					confirmColor: '#f55850',
					cancelColor: '#39B54A',
					success: (res) => {
						if (res.confirm) {
							this.page_data.activity_info.tag.splice(index, 1)
						} else {}
					}
				})
			},
			handleRolesPickerChange(e) {
				let leval = JSON.parse(this.get_user_info.leval_manage)[e.detail.value]
				// 查重
				if (this.page_data.activity_info.roles.find(_i => _i.leval_id === leval.leval_id)) return
				this.page_data.activity_info.roles.push(leval)
			},
			handleRoleDelete(index) {
				uni.showModal({
					title: '提示',
					content: '是否删除该角色',
					cancelText: "取消", // 取消按钮的文字  
					confirmText: "确认", // 确认按钮文字  
					showCancel: true, // 是否显示取消按钮，默认为 true
					confirmColor: '#f55850',
					cancelColor: '#39B54A',
					success: (res) => {
						if (res.confirm) {
							this.page_data.activity_info.roles.splice(index, 1)
						} else {}
					}
				})
			},
			handleEDPickerChange(e) {
				this.$set(this.page_data.activity_info, 'end_date', e.detail.value)
			},
			handleETPickerChange(e) {
				this.$set(this.page_data.activity_info, 'end_time', e.detail.value)
			},
			handleSDPickerChange(e) {
				this.$set(this.page_data.activity_info, 'start_date', e.detail.value)
			},
			handleSTPickerChange(e) {
				this.$set(this.page_data.activity_info, 'start_time', e.detail.value)
			},
			ChooseImage() {
				uni.chooseImage({
					count: 4, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: async (res) => {
						uni.showLoading({
							title: '上传中',
							mask: true
						})
						let pool = res.tempFilePaths.map(_i => this.UPLOAD_FILE(_i))
						let upload_res = await Promise.all(pool)
						uni.hideLoading()
						uni.hidden
						if (this.page_data.activity_info.imgList.length != 0) {
							this.page_data.activity_info.imgList = this.page_data.activity_info.imgList.concat(upload_res)
						} else {
							this.page_data.activity_info.imgList = upload_res
						}
					}
				});
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.page_data.activity_info.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				uni.showModal({
					title: '亲爱的用户',
					content: '确定删除这张照片？',
					cancelText: '取消',
					confirmText: '确认',
					success: res => {
						if (res.confirm) {
							this.page_data.activity_info.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			handleAreaMultiChange(e) {
				this.page_data.activity_info.areaMultiIndex = e.detail.value
				this.$forceUpdate()
			},
			handleAreaMultiColumnChange(e) {
				this.page_status.areaChoosingIndex[e.detail.column] = e.detail.value
				if (e.detail.column === 0) {
					this.page_config.areaMultiArray[1] = areaJson[e.detail.value].city.map(_i => _i.name)
					if (!areaJson[e.detail.value].city[this.page_status.areaChoosingIndex[1]]) {
						this.page_status.areaChoosingIndex[1] = areaJson[e.detail.value].city.length - 1
					}
					this.page_config.areaMultiArray[2] = areaJson[e.detail.value].city[this.page_status.areaChoosingIndex[1]].area
				}
				if (e.detail.column === 1) {
					this.page_config.areaMultiArray[2] = areaJson[this.page_status.areaChoosingIndex[0]].city[e.detail.value].area
				}
				this.$forceUpdate()
			},
			handleDeleteClick() {
				uni.showModal({
					title: '提示',
					content: '确认删除该活动？',
					cancelText: '取消',
					confirmText: '确认',
					success: res => {
						if (res.confirm) {
							uni.request({
								url: 'https://www.imgker.com/venus/activity/delete', //仅为示例，并非真实接口地址。
								data: {
									activity_id: this.page_config.activity_id
								},
								header: {
									'custom-header': 'hello' //自定义请求头信息
								},
								success: (res) => {
									if (res.data === 'success') {
										uni.showToast({
											title: '删除成功',
											duration: 2000
										})
										uni.navigateBack()
									} else {
										uni.showToast({
											title: res.data,
											duration: 2000
										})
									}
								}
							})
						}
					}
				})
			},
			handleCreateClick() {
				uni.request({
					url: 'https://www.imgker.com/venus/activity/create', //仅为示例，并非真实接口地址。
					data: {
						...this.modified_activity_info
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						if (res.data === 'success') {
							uni.showToast({
								title: '发起成功',
								duration: 2000
							})
							uni.navigateBack()
						} else {
							uni.showToast({
								title: res.data,
								duration: 2000
							})
						}
					}
				})
			},
			handleEditClick() {
				uni.request({
					url: 'https://www.imgker.com/venus/activity/edit', //仅为示例，并非真实接口地址。
					data: {
						activity_id: this.page_config.activity_id,
						...this.modified_activity_info
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						if (res.data === 'success') {
							uni.showToast({
								title: '编辑成功',
								duration: 2000
							})
							uni.navigateBack()
						} else {
							uni.showToast({
								title: res.data,
								duration: 2000
							})
						}
					}
				})
			}
		},
	}
</script>

<style lang="less" scoped>
	.box {
		width: 100%;
		position: fixed;
		bottom: 0;
		box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
	}

	.diy-btn-group {
		flex: 1;
		display: flex;
		justify-content: flex-end;
		height: 100%;

		.diy-btn-group-btn {
			//margin-right: 10px;
		}
	}

	.content {

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
			padding: 4px 10px;
			box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
		}
	}
</style>
