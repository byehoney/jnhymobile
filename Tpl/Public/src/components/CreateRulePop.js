import React from 'react';
import { List, InputItem, Button,Toast,DatePicker,Picker,Popup,Flex,TextareaItem,ImagePicker,Icon } from 'antd-mobile';
const Item = List.Item;
import './css/pullnew.css';
import { createForm } from 'rc-form';
import moment from 'moment';
import WeekPop from './weekpop.js';
import ShopPop from './shoppop.js';
import ReactCoreImageUpload  from 'react-core-image-upload';


import add from './assets/add.svg'
import del from './assets/del.svg'


const format = 'HH:mm';
weekPop =Popup.newInstance();
shopPop =Popup.newInstance();
let uuid = 0;
const start_time = moment('00:00','HH:mm Z');
const end_time = moment('23:59','HH:mm Z');

const voucherRanges = [{
	value: '1',
	label: '全场通用'
}];
const voucher_types = [{
	value: '1',
	label: '代金券'
}];
const validate_types = [{
	value: '2',
	label: '相对日期'
}];
const time_types = [{
	value: '1',
	label: '全天'
},{
	value: '2',
	label: '自定义时间段'
}];

const CustomChildren = props => (
  	<span>
	    <span style={{ float: 'left', color: '#888',marginLeft:'0.15rem' }} onClick={props.onClick}>{props.extra}
	    	{props.dateType==='start'?'至':''}
	    </span>
  	</span>
);


class CreateRulePop extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			weekData:[],
			week_txt:'全周',

			shopData:[],
			shoplist:[],

			picId:'',
			picUrl:'',
			picLocUrl:''

		}
	}

	onShowWeek = () => {
		weekPop.show(<WeekPop getWeekData={this.getWeekData} closeWeekPop={this.closeWeekPop} weekdata={this.state.weekData}></WeekPop>, { animationType: 'slide-up', maskClosable: false })
		weekPop.isShow = true;
	}
	closeWeekPop = () => {
		weekPop.hide();
		weekPop.isShow = false;
	}
	getWeekData = (data,type) => {
		let week_txt = '全周';
		let week_arr = [];
		if( data.length && data.length != 7 ){

			data.map ((item)=>{
		      if(item=="1"){
		        item='周一'
		      }else if(item=='2'){
		        item='周二'
		      }else if(item=='3'){
		        item='周三'
		      }else if(item=='4'){
		        item='周四'
		      }
		      else if(item=='5'){
		        item='周五'
		      }
		      else if(item=='6'){
		        item='周六'
		      }else{
		        item='周日'
		      }
		      return week_arr.push(item);
		    });
		    week_txt = week_arr.join('、');
		}

		this.setState({
			weekData:data,
			week_txt
		})
		if( !type  ){

			weekPop.hide();
			weekPop.isShow = false;
		}
	}

	getShopData = (data) => {
		this.setState({
			shopData:data
		})
		shopPop.hide();
		shopPop.isShow = false;
	}




	checkStart = (rule, value, callback) => {
	    const { validateFields } = this.props.form;
	    validateFields(['end_day'], {
	    	force: true
	    });
	    callback();
  	}
  	checkEnd = (rule, value, callback) => {
	    const { getFieldValue } = this.props.form;
	    const start = Number(getFieldValue('start_day'));
	    const end = Number(value);
	    
	    if (!end || !start) {
	    	callback('请输入券有效日期');
	    } else if (end < start ) {
	    	callback('券有效截止天数须大于开始天数');
	    } else {
	    	callback();
	    }
  	}


  	/*上传*/

	onPicChange = (picData) => {
		Toast.hide();
		if( Number(picData.status) ){
			this.setState({
		      picUrl: this.state.picLocUrl,
		      picId: picData.data.image_id
		    })
		}else{
			Toast.info('上传失败,请重试！')
		}
	}
	onimageChanged = (picData,dd,aa,cc) => {
		Toast.loading('上传中...', 90, () => {
	      Toast.loading('上传超时,请重试', 2, () => {
	        window.location.reload();
	      });
	    });

		var reader = new FileReader();
		var that = this;
		reader.onload = function(evt){
			that.setState({
		    	picLocUrl:evt.target.result
		    })
		}


		reader.readAsDataURL(picData);
		console.log('arguments')
		
	}

	beforeUpload = (file) => {
      	this.setState({
          	uploading:true
      	})

	    const isJPG = (file.type === 'image/png'|| file.type === 'image/jpg'|| file.type === 'image/jpeg');
	    if (!isJPG) {
	      Toast.info('只能上传png,jpg,jpeg格式的图片!');
	    }
	    const isLt2M = file.size / 1024 / 1024 < 2;
	    if (!isLt2M) {
	      Toast.info('图片大小必须小于2M!');
	    }
	    console.log( file.type,isLt2M )
	    return isJPG && isLt2M;
 	}




 	add = () => {
	    uuid++;

	    const { form } = this.props;
	    // can use data-binding to get
	    let keys = form.getFieldValue('keys');
	    if( keys.length > 4 ){
	    	return false;
	    }
	    keys = keys.concat(uuid);
	    // can use data-binding to set
	    // important! notify form to detect changes

	    form.setFieldsValue({
	      keys,
	    });
	    console.log(keys)
	    console.log(uuid)
	}

	remove = (that,k) => {
	    const { form } = this.props;
	    // can use data-binding to get
	    let keys = form.getFieldValue('keys');
	    if( keys.length == 1 ){
	    	Toast.info('最少保留一个');
	    	return false;
	    }
	    keys = keys.filter((key) => {
	      return key !== k;
	    });
	    // can use data-binding to set
	    form.setFieldsValue({
	    	keys,
	    });
	}

	validEndTime = (rule, value, callback) => {
	 	var str = rule.field.split('-')[1];
	 	let getStart = this.props.form.getFieldValue(['start-'+str]);
    	var start_time = moment(getStart, format);
    	var end_time = moment(new Date(value), format);

    	if( end_time ){
    		if( start_time > end_time ){
				callback('结束时间不能大于开始时间');
	      		return;
		    }
    	}else{
    		this.setState({
				end_tip:null
			})
    		callback('结束时间不能为空');
      		return;
    	}
	    callback();
	}

	chunk = (array, size) => {
	    var result = [];
	    for (var x = 0; x < Math.ceil(array.length / size); x++) {
	        var start = x * size;
	        var end = start + size;
	        result.push(array.slice(start, end));
	    }
	    return result;
	}





	saveForm = () => {

		var data_arrs = this.props.form.getFieldsValue();
		var needValids = [];
		var formValids = [];
		for( let line in data_arrs ){
			if( line.indexOf('-') != -1 ){
				needValids.push(line);
			}else{
				formValids.push(line);
			}
		}

		let dateData = [];
		let date_vaild = true;
		if( this.props.form.getFieldValue('time_type') == '2' ){
			this.props.form.validateFields(needValids, { force: true },(err, values) => {
				if (!err) {
		    		var allArr = [];
		    		
		    		
		    		for( let jkey in values ){
			    		allArr.push(values[jkey]);
		    		}
		    		var dateArr = this.chunk(allArr,2);
		    		
		    		for( let i=0;i<dateArr.length;i++ ){
			    		let start = dateArr[i][0];
			    		let end = dateArr[i][1];
			    		
			    		let timedata = [start.format('HH:mm:ss'),end.format('HH:mm:ss')];
		    			dateData.push(timedata.join(','));
			    		
			    		for( let o=0;o<dateArr.length;o++ ){
			    			if( i != o ){
				    			let otherStart = dateArr[o][0];
				    			let otherEnd = dateArr[o][1];

								if(  moment(start).isBetween(otherStart, otherEnd) || start.isSame(otherStart)  ){
									date_vaild = false;
									break;
								}
			    			}
			    		}
			    		if( !date_vaild ){
			    			break;
			    		}
		    		}
		    		if( date_vaild ){
		    			
		    		}else{
		    			Toast.info('自定义时间重复!请重新选择');
		    			return false;
		    		}
		    	}
			})
		}
		if(date_vaild){
			this.props.form.validateFields(formValids, { force: true },(err, values) => {
				console.log( JSON.stringify(values) )
				if (!err) {
					var send = {
						formState:this.state,
						timesData:dateData,
						formValues:values
					}
					this.props.saveCreateForm( send,this );
				}
			})
		}

		


	}

	componentWillRecieveProps(){
		console.log('componentWillRecieveProps')
	}
	componentWillUpdate(){
		console.log('componentWillUpdate')
	}
	componentDidUpdate(){
		if( this.props.FormData ){
			
		}
		console.log('componentDidUpdate')
	}
	componentDidMount() {
        console.log('this.props.formData');
        console.log(this.props.formData);
        if( this.props.formData ){
        	this.props.form.setFieldsValue(
				this.props.formData.formValues
			);

			this.getWeekData(this.props.formData.formState.weekData,'isDidMount');
			this.setState({
				shopData:this.props.formData.formState.shopData,
				picId:this.props.formData.formState.picId,
				picUrl:this.props.formData.formState.picUrl,
				shoplist:this.props.formData.formState.shoplist
			})
        }

    }




	render(){
		console.log('render')
		const { getFieldProps,getFieldValue, getFieldError } = this.props.form;

		getFieldProps('keys', {
	      initialValue: [0],
	    });
	    const that = this;
	    const inputs = getFieldValue('keys').map((k) => {
	    	let btn = (<a className="timeBtn" onClick={() => { that.remove(that, k) }}><img src={del} /></a>);
	    	if( k === 0 ){
	    		btn = (<a className="timeBtn" onClick={this.add}><img src={add} /></a> );
	    	}

	    	return (
		      	<div key={k} className="am-list-line am-list-line-wrap" style={{lineHeight: '90px',paddingLeft: '30px'}}>
	      			<DatePicker
						mode="time"
						{...getFieldProps(`start-${k}`, {
							initialValue: start_time,
						})}
					>
					<CustomChildren dateType='start'></CustomChildren>
					</DatePicker>

					<DatePicker
					  mode="time"
					  {...getFieldProps(`end-${k}`, {
					    initialValue: end_time,
					    rules: [{ required: true},{validator: that.validEndTime} ],
					  })}
					>
					<CustomChildren dateType='end'></CustomChildren>
					</DatePicker>
					 
			        {btn}

			        <div className='errorTimeTip'>
	            		{getFieldError(`end-${k}`) ? getFieldError(`end-${k}`).join(',') : null}
		          	</div>
		      	</div>
				);
	    });
		return (
			<form>
				<List renderHeader={() => '活动配置'} >

			        <Picker data={voucherRanges} cols={1} {...getFieldProps('voucherRange', { initialValue: ['1']})} className="forss">
			        	<List.Item arrow="down">可用范围</List.Item>
			        </Picker>

			        <Picker data={voucher_types} cols={1} {...getFieldProps('promo_tools_voucher_type', { initialValue: ['1']})} className="forss">
			        	<List.Item arrow="down">券类型</List.Item>
			        </Picker>

			        <InputItem
			            {...getFieldProps('worth_value', {
			              initialValue: 1,
			              rules: [{pattern:/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/, required: true, message: '请输入正确的券面额' }],
			            })}
			            maxLength='8'
						placeholder="请输入券面额"
			            extra="元"
			        >券面额
			        </InputItem>
			        <div className='errorTip'>
			          {getFieldError('worth_value') ? getFieldError('worth_value').join(',') : null}
			        </div>

			        <div>
			        	<div className="am-list-item am-input-item" style={{paddingRight:0}}>
				        	<div className="am-input-label am-input-label-5">消费门槛</div>
				        	<div className="am-input-control">
				        		<div className="beforeInp">消费满</div>
				        		<InputItem
						            {...getFieldProps('user_min_consume', {
						              initialValue: 1,
						              rules: [{pattern:/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/, required: true, message: '请输入正确的消费门槛' }],
						            })}
						            maxLength='8'
									placeholder="请输入消费门槛"
						            extra="元"
						        >
				        		</InputItem>
				        
				        	</div>
				        </div>
				        <div className='errorTip'>
				          {getFieldError('user_min_consume') ? getFieldError('user_min_consume').join(',') : null}
				        </div>
			        </div>

			        <Picker data={validate_types} cols={1} {...getFieldProps('validate_type', { initialValue: ['2']})} className="forss">
			        	<List.Item arrow="down">券有效期</List.Item>
			        </Picker>

			        <div className="am-list-item am-input-item" style={{paddingRight:0}}>
			        	<div className="am-input-label am-input-label-5">从发券第</div>
			        	<div className="am-input-control validRange">
			        		<InputItem
							    {...getFieldProps('start_day',{
							    	initialValue: 1,
					            	rules: [{pattern:/^[1-9]*[1-9][0-9]*$/, required: true, message: '请输入正确的开始天数' },{validator: this.checkStart}]
							    })}
							    type='number'
						  	/>
						  	<span>天-第</span>
						  	<InputItem
							    {...getFieldProps('end_day',{
							    	initialValue: 30,
					            	rules: [{pattern:/^[1-9]*[1-9][0-9]*$/, required: true, message: '请输入正确的截止天数' },{validator: this.checkEnd}]
							    })}
							    type='number'
						  	/>
						  	<span>天</span>
			        	</div>
			        </div>
			        <div className='errorTip'>
			          {getFieldError('start_day') ? getFieldError('start_day').join(',') : null}
			          {getFieldError('end_day') ? getFieldError('end_day').join(',') : null}
			        </div>

			        <div className="am-list-item am-input-item" style={{paddingRight:0}}>
			        	<div className="am-input-label am-input-label-5">核销门店</div>
			        	<div className="am-input-control">
			        		<Item extra="" arrow="horizontal" onClick={() => {
			        			shopPop.show(<ShopPop shoplist={this.state.shoplist} getShopData={this.getShopData} shopdata={this.state.shopData}></ShopPop>, { animationType: 'slide-up', maskClosable: false })
			        			shopPop.isShow = true;
			        		}}>全部{this.state.shopData.length}家门店</Item>
			        	</div>
			        </div>

			        <InputItem
			          {...getFieldProps('voucher_brand_name', {
			            	initialValue: '赵氏奶酪',
			            rules: [
			            	{ required: true, message: '请输入参与活动的品牌名' }
			            ],
			          })}
			          maxLength='16'
			          placeholder="请输入参与活动的品牌名"
			        >参与品牌</InputItem>


					<div className="am-list-item am-input-item" style={{paddingRight: '0px', height: '2rem', paddingTop: '10px'}}>
						<div className="am-input-label am-input-label-5">品牌LOGO</div>
						<div className="am-input-control logo_cont">
							<div className="am-image-picker">
								<div className="am-image-picker-list">
									<div className="am-wingblank am-wingblank-md">
										<div className="am-flexbox am-flexbox-wrap am-flexbox-align-middle">
											<div className="am-image-picker-item" style={{width: '1.7rem', height: '1.7rem'}}>
												<div className="am-image-picker-item-content" style={{backgroundImage: 'url('+this.state.picUrl+')',transform: 'rotate(0deg)'}}></div>
											</div>
											<div className="am-image-picker-item am-image-picker-upload-btn" style={{width: '1.7rem', height: '1.7rem'}}>

											<ReactCoreImageUpload 
												  text={" "}
												  class={['pure-button', 'pure-button-primary', 'js-btn-crop']}
												   inputOfFile={'files'}
												    url={AJAX_URL+"/Couponphone/ajaxUploadImages"+token}
												imageChanged={this.onimageChanged}
												imageUploaded={this.onPicChange}
											>
											</ReactCoreImageUpload>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>



			        <div className='errorTip'>
			          {getFieldError('attachment') ? getFieldError('attachment').join(',') : null}
			        </div>


			        <div className="am-list-item am-input-item" style={{paddingRight:0}}>
			        	<div className="am-input-label am-input-label-5">可用时间</div>
			        	<div className="am-input-control">
			        		<Item extra="" arrow="down"  onClick={this.onShowWeek}>{this.state.week_txt}</Item>
			        	</div>
			        </div>

			        <Picker data={time_types} cols={1} {...getFieldProps('time_type', {
			        	onChange(){
			        		console.log(arguments)
			        	},
			        	initialValue: ['1']})} className="forss">
			        	<List.Item arrow="down"> </List.Item>
			        </Picker>

	                <div className="am-list-item am-input-item" style={{height:'auto',display:getFieldValue('time_type')=='2'?'':'none'}}>
						<div className="am-input-label am-input-label-5"></div>
						<div className="am-input-control">

							{inputs}
							
						</div>
			        </div>
			        
			          <div className='errorTip'>
			            {getFieldError('end') ? getFieldError('end').join(',') : null}
			          </div>

			        <TextareaItem
				        {...getFieldProps('use_rule_desc', {
			            	initialValue: '下次到店消费可用，每次限用1张，不与店内其他优惠同享',
			            })}
			            title="券说明"
			            maxLength = '200'
			            rows={3}
			            autoHeight
		          	/>

		          	<TextareaItem
				        {...getFieldProps('voucher_note', {
			            	initialValue: '',
			            })}
			            title="券备注"
			            maxLength='200'
			            autoHeight
			            rows={3}
		          	/>
		          	<div className='auto_tip' style={{paddingTop:10,paddingLeft:25,paddingBottom:10}}>*备注内容仅在收银端可见</div>

				</List>


	     	 	<Flex className="rule_btn_box">
			    	<Flex.Item>
			    		<Button className="btn" onClick={this.props.closeCreateForm}>取消</Button>
			    	</Flex.Item>
			    	<Flex.Item>
	    				<Button className="btn" type="primary" onClick={this.saveForm}>保存</Button>
			    	</Flex.Item>
			    </Flex>
		    </form>
		)
	}
}



















const CreateRulePopForm = createForm()(CreateRulePop);

export default CreateRulePopForm;