<template>
	<view class="content" v-if="get_system_info.normal">
		<cu-custom class="content-title" bgColor="bg-red text-white" border :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">择偶标准</block>
		</cu-custom>
		<view class="content-main">
			<form class=" sm-border ">
				<view class="cu-form-group">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">性别</text>
					</view>
					<view class="action">
						<picker @change="handleGenderPickerChange" :value="page_data.user_require.genderIndex" :range="genderArray">
							<view class="picker">
								{{ genderArray[page_data.user_require.genderIndex] }}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-form-group">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">年龄</text>
					</view>
					<view class="action">
						<picker mode="multiSelector" @change="handleAgeMultiChange" @columnchange="handleAgeMultiColumnChange" :value="page_data.user_require.ageMultiIndex"
						 :range="ageMultiArray">
							<view class="picker">
								{{age}}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-form-group">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">身高</text>
					</view>
					<view class="action">
						<picker mode="multiSelector" @change="handleStatureMultiChange" @columnchange="handleStatureMultiColumnChange"
						 :value="page_data.user_require.statureMultiIndex" :range="statureMultiArray">
							<view class="picker">
								{{stature}}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-form-group">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">户籍地</text>
					</view>
					<view class="action">
						<picker mode="multiSelector" @change="handleBornMultiChange" @columnchange="handleBornMultiColumnChange" :value="bornMultiIndex"
						 :range="bornMultiArray">
							<view class="picker">
								{{born}}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-form-group" v-if="page_data.user_require.bornPool.length > 0">
					<view class="padding-bottom-sm">
						<view class='cu-tag line-red margin-top-sm margin-lr-xs' v-for="(item, index) in page_data.user_require.bornPool" @click="handleBornDelete(index)">{{areaJson[item[0]].name}}{{areaJson[item[0]].city[item[1]] ? ` - ${areaJson[item[0]].city[item[1]].name}` : ''}}{{areaJson[item[0]].city[item[1]].area[item[2]] ? ` - ${areaJson[item[0]].city[item[1]].area[item[2]]}` : ''}}</view>
					</view>
				</view>
				<view class="cu-form-group">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">居住地</text>
					</view>
					<view class="action">
						<picker mode="multiSelector" @change="handleLiveMultiChange" @columnchange="handleLiveMultiColumnChange" :value="liveMultiIndex"
						 :range="liveMultiArray">
							<view class="picker">
								{{live}}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-form-group" v-if="page_data.user_require.livePool.length > 0">
					<view class="padding-bottom-sm">
						<view class='cu-tag line-red margin-top-sm margin-lr-xs' v-for="(item, index) in page_data.user_require.livePool" @click="handleLiveDelete(index)">{{areaJson[item[0]].name}}{{areaJson[item[0]].city[item[1]] ? ` - ${areaJson[item[0]].city[item[1]].name}` : ''}}{{areaJson[item[0]].city[item[1]].area[item[2]] ? ` - ${areaJson[item[0]].city[item[1]].area[item[2]]}` : ''}}</view>
					</view>
				</view>
				<view class="cu-form-group">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">最低学历</text>
					</view>
					<view class="action">
						<picker @change="handleEducationPickerChange" :value="page_data.user_require.educationIndex" :range="educationArray">
							<view class="picker">
								{{ educationArray[page_data.user_require.educationIndex] }}
							</view>
						</picker>
					</view>
				</view>
				<view class="cu-form-group">
					<view class="content">
						<text class="cuIcon-title text-green"></text>
						<text class="text-grey">婚姻状况</text>
					</view>
					<view class="action">
						<picker @change="handleMarriagePickerChange" :value="page_data.user_require.marriageIndex" :range="marriageArray">
							<view class="picker">
								{{ marriageArray[page_data.user_require.marriageIndex] }}
							</view>
						</picker>
					</view>
				</view>
			</form>
		</view>
		<view class="content-save">
			<button class="cu-btn bg-red lg" @click="handleSaveClick">保存</button>
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
	import areaJson from '../../utils/area.js'
	export default {
		components: {
			Empty
		},
		data() {
			return {
				areaJson,
				genderArray: ['不限', '男', '女'],
				educationArray: ['不限', '小学', '初中', '中专/高中', '专科 ', '本科', '硕士', '博士'],
				marriageArray: ['不限', '未婚', '离异', '丧偶'],
				ageMultiArray: [
					['不限', ...Array.from(Array(43)).map((e, i) => 18 + i + '岁')],
					['不限', ...Array.from(Array(43)).map((e, i) => 18 + i + '岁')],
				],
				statureMultiArray: [
					['不限', ...Array.from(Array(81)).map((e, i) => 130 + i + 'cm')],
					['不限', ...Array.from(Array(81)).map((e, i) => 130 + i + 'cm')]
				],
				bornMultiArray: [
					areaJson.map(_i => _i.name),
					['不限', ...areaJson[0].city.map(_i => _i.name)],
					['不限', ...areaJson[0].city[0].area]
				],
				bornMultiIndex: [0, 0, 0],
				bornChoosingIndex: [0, 0, 0],
				liveMultiArray: [
					areaJson.map(_i => _i.name),
					['不限', ...areaJson[0].city.map(_i => _i.name)],
					['不限', ...areaJson[0].city[0].area]
				],
				liveMultiIndex: [0, 0, 0],
				liveChoosingIndex: [0, 0, 0],
				page_config: {},
				page_data: {
					user_require: {
						genderIndex: 0,
						educationIndex: 0,
						marriageIndex: 0,
						ageMultiIndex: [0, 0],
						statureMultiIndex: [0, 0],
						bornPool: [],
						livePool: []
					}
				},
				page_status: {

				}
			};
		},
		onLoad: function({
			coin_id
		}) {
			this.page_data.current_coin_id = coin_id
			this.fetchData()
		},
		onShow() {
			this.fetchData()
		},
		computed: {
			...mapGetters(['get_system_info', 'get_user_info']),
			stature() {
				let statureMultiIndex = this.page_data.user_require.statureMultiIndex
				let statureMultiArray = this.statureMultiArray
				if (statureMultiIndex[0] === 0 && statureMultiIndex[1] === 0) return '不限'
				else if (statureMultiIndex[1] === 1) return `${statureMultiArray[1][statureMultiIndex[1]]}`
				else if (statureMultiIndex[0] === 0 && statureMultiIndex[1] > 0) return `${statureMultiArray[1][statureMultiIndex[1]]}以下`
				else if (statureMultiIndex[0] > 0 && statureMultiIndex[1] === 0) return `${statureMultiArray[0][statureMultiIndex[0]]}以上`
				else return `${statureMultiArray[0][statureMultiIndex[0]]} - ${statureMultiArray[1][statureMultiIndex[1]]}`
			},
			age() {
				let ageMultiIndex = this.page_data.user_require.ageMultiIndex
				let ageMultiArray = this.ageMultiArray
				if (ageMultiIndex[0] === 0 && ageMultiIndex[1] === 0) return '不限'
				else if (ageMultiIndex[1] === 1) return `${ageMultiArray[1][ageMultiIndex[1]]}`
				else if (ageMultiIndex[0] === 0 && ageMultiIndex[1] > 0) return `${ageMultiArray[1][ageMultiIndex[1]]}以下`
				else if (ageMultiIndex[0] > 0 && ageMultiIndex[1] === 0) return `${ageMultiArray[0][ageMultiIndex[0]]}以上`
				else return `${ageMultiArray[0][ageMultiIndex[0]]} - ${ageMultiArray[1][ageMultiIndex[1]]}`
			},
			born() {
				return this.page_data.user_require.bornPool.length <= 0 ? '不限' : `已选${this.page_data.user_require.bornPool.length}个`
			},
			live() {
				return this.page_data.user_require.livePool.length <= 0 ? '不限' : `已选${this.page_data.user_require.livePool.length}个`
			},
			modified_user_require() {
				return JSON.stringify(this.page_data.user_require)
			}
		},
		methods: {
			...mapActions(['GET_USER_INFO']),
			async fetchData() {
				await this.GET_USER_INFO()
				this.page_data.user_require = JSON.parse(this.get_user_info.user_require)
			},
			handleBornDelete(index) {
				uni.showModal({
					title: '提示',
					content: '是否删除该地址',
					cancelText: "取消", // 取消按钮的文字  
					confirmText: "确认", // 确认按钮文字  
					showCancel: true, // 是否显示取消按钮，默认为 true
					confirmColor: '#f55850',
					cancelColor: '#39B54A',
					success: (res) => {
						if (res.confirm) {
							this.page_data.user_require.bornPool.splice(index, 1)
						} else {}
					}
				})
			},
			handleLiveDelete(index) {
				uni.showModal({
					title: '提示',
					content: '是否删除该地址',
					cancelText: "取消", // 取消按钮的文字  
					confirmText: "确认", // 确认按钮文字  
					showCancel: true, // 是否显示取消按钮，默认为 true
					confirmColor: '#f55850',
					cancelColor: '#39B54A',
					success: (res) => {
						if (res.confirm) {
							this.page_data.user_require.livePool.splice(index, 1)
						} else {}
					}
				})
			},
			handleEducationPickerChange(e) {
				this.page_data.user_require.educationIndex = e.detail.value
			},
			handleGenderPickerChange(e) {
				this.page_data.user_require.genderIndex = e.detail.value
			},
			handleMarriagePickerChange(e) {
				this.page_data.user_require.marriageIndex = e.detail.value
			},
			handleAgeMultiChange(e) {
				this.page_data.user_require.ageMultiIndex = e.detail.value
				this.$forceUpdate()
			},
			handleAgeMultiColumnChange(e) {
				if (e.detail.column === 1) return
				if (e.detail.column === 0 && e.detail.value === 0) return
				this.ageMultiArray[1] = ['不限', ...Array.from(Array(61 - parseInt(this.ageMultiArray[0][e.detail.value]))).map((item,
						i) =>
					parseInt(this.ageMultiArray[0][e.detail.value]) + i + '岁')]
				this.$forceUpdate()
			},
			handleStatureMultiChange(e) {
				this.page_data.user_require.statureMultiIndex = e.detail.value
				this.$forceUpdate()
			},
			handleStatureMultiColumnChange(e) {
				if (e.detail.column === 1) return
				if (e.detail.column === 0 && e.detail.value === 0) return
				this.statureMultiArray[1] = ['不限', ...Array.from(Array(211 - parseInt(this.ageMultiArray[0][e.detail.value]))).map(
					(item, i) =>
					parseInt(this.statureMultiArray[0][e.detail.value]) + i + 'cm')]
				this.$forceUpdate()
			},
			handleBornMultiChange(e) {
				this.bornMultiIndex = e.detail.value
				let tmp = JSON.parse(JSON.stringify(e.detail.value))
				if (tmp[1] >= 0) tmp[1] -- 
				if (tmp[2] >= 0) tmp[2] -- 
				if (this.page_data.user_require.bornPool.find(_i => JSON.stringify(_i) === JSON.stringify(tmp))) return
				this.page_data.user_require.bornPool.push(tmp)
				this.$forceUpdate()
			},
			handleBornMultiColumnChange(e) {
				this.bornChoosingIndex[e.detail.column] = e.detail.value
				if (e.detail.column === 0) {
					this.bornMultiArray[1] = ['不限', ...areaJson[e.detail.value].city.map(_i => _i.name)]
					if (!areaJson[e.detail.value].city[this.bornChoosingIndex[1]]) {
						this.bornChoosingIndex[1] = areaJson[e.detail.value].city.length - 1
					}
					if (this.bornChoosingIndex[1] > 0) this.bornMultiArray[2] = ['不限', ...areaJson[e.detail.value].city[this.bornChoosingIndex[1] - 1].area]
					else this.bornMultiArray[2] = []
				}
				if (e.detail.column === 1) {
					if (e.detail.value > 0) this.bornMultiArray[2] = ['不限', ...areaJson[this.bornChoosingIndex[0]].city[e.detail.value - 1].area]
					else this.bornMultiArray[2] = []
				}
				this.$forceUpdate()
			},
			handleLiveMultiChange(e) {
				this.liveMultiIndex = e.detail.value
				let tmp = JSON.parse(JSON.stringify(e.detail.value))
				if (tmp[1] >= 0) tmp[1] -- 
				if (tmp[2] >= 0) tmp[2] -- 
				if (this.page_data.user_require.livePool.find(_i => JSON.stringify(_i) === JSON.stringify(tmp))) return
				this.page_data.user_require.livePool.push(tmp)
				this.$forceUpdate()
			},
			handleLiveMultiColumnChange(e) {
				this.liveChoosingIndex[e.detail.column] = e.detail.value
				if (e.detail.column === 0) {
					this.liveMultiArray[1] = ['不限', ...areaJson[e.detail.value].city.map(_i => _i.name)]
					if (!areaJson[e.detail.value].city[this.liveChoosingIndex[1]]) {
						this.liveChoosingIndex[1] = areaJson[e.detail.value].city.length - 1
					}
					if (this.liveChoosingIndex[1] > 0) this.liveMultiArray[2] = ['不限', ...areaJson[e.detail.value].city[this.liveChoosingIndex[1] - 1].area]
					else this.liveMultiArray[2] = []
				}
				if (e.detail.column === 1) {
					if (e.detail.value > 0) this.liveMultiArray[2] = ['不限', ...areaJson[this.liveChoosingIndex[0]].city[e.detail.value - 1].area]
					else this.liveMultiArray[2] = []
				}
				this.$forceUpdate()
			},
			handleSaveClick() {
				uni.request({
					url: 'https://www.imgker.com/venus/user/update_user_require', //仅为示例，并非真实接口地址。
					data: {
						user_require: this.modified_user_require
					},
					header: {
						'custom-header': 'hello' //自定义请求头信息
					},
					success: (res) => {
						if (res.data === 'success') {
							uni.showToast({
								title: '保存成功',
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
			padding: 10px;
			box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
		}
	}
</style>
