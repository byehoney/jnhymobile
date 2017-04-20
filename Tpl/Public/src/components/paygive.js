import React, { PropTypes, Component } from 'react'
import ReactDom from 'react-dom';
import { List,Toast, InputItem, WhiteSpace,Popup,Icon,Button,ImagePicker,DatePicker,Picker,TextareaItem,Modal,Flex} from 'antd-mobile';
import { createForm } from 'rc-form';
import moment from 'moment';
import ask from './assets/ask.svg';
import dateicon from './assets/date.svg';
import add from './assets/add.svg'
import del from './assets/del.svg'
import './css/paygive.css';
import { Router, Route,hashHistory} from 'react-router';
import ReactCoreImageUpload  from 'react-core-image-upload';

import WeekPop from './weekpop.js';
import ShopPop from './shoppop.js';

const format = 'HH:mm';
weekPop =Popup.newInstance();
shopPop =Popup.newInstance();
useshopPop =Popup.newInstance();
let uuid = 0;
const start_time = moment('00:00','HH:mm Z');
const end_time = moment('23:59','HH:mm Z');

const Item = List.Item;
const CustomChildren = props => (
  <span>
    <span style={{ float: 'left', color: '#888'}} onClick={props.onClick}>{props.extra}
      <img src={dateicon} className='dateiconpic'/>
      {props.dateType==='start'?'至':''}
    </span>
  </span>
)
//优惠券类型

const time_types = [{
	value: '1',
	label: '全天'
},{
	value: '2',
	label: '自定义时间段'
}];

const minDate = moment(new Date(), 'YYYY-MM-DD').utcOffset(8);
const endDate = moment(new Date(new Date().getTime() + 86400000*7), 'YYYY-MM-DD')
class BasicInputExample extends React.Component {
  constructor(props){
  	super(props)
  	this.state={
  		modal1: false,
  		askShow:'none',//显示设置出的问号
  		setShow:'block',//显示高级设置
  		cType:[
		    {
		      label: '代金券',
		      value: '代金券',
		    },
		    {
		      label: '兑换券',
		      value: '兑换券',
		    },
		],
  		cValue:'1',
  		cTerm:[
		    {
		      label: '相对日期',
		      value: '1',
		    },
		    {
		      label: '固定日期',
		      value: '2',
		    },
		],

		weekData:[],
		week_txt:'全周',

		useShopData:[],
		shopData:[],
		shoplist:[],

		picId:'',
		picUrl:'',
		picLocUrl:''
  	}
  }
  /*店铺*/
	getShopData = (data) => {
		this.setState({
			shopData:data
		})
		shopPop.hide();
		shopPop.isShow = false;
	}

	getUseShopData = (data) => {
		this.setState({
			useShopData:data
		})
		useshopPop.hide();
		useshopPop.isShow = false;
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

	/*周*/
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



	/*时间*/ 

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





















	ajaxShopInfo = () => {
	    var that = this;
	      
	      
	      $.ajax({
		      url: AJAX_URL+"/Couponphone/ajaxGetShopInfos"+token,
		      type: 'POST',
		      data: {},
		      dataType: 'json',
		      timeout: 40000,
		      success: function(data){

		        if( Number(data.status) ){
		          
				const shopCheckedArr = [];
	            if( data.data.shoplist.length ){
	            	data.data.shoplist.forEach(function(val,key){
	            		shopCheckedArr.push(val.shop_id)
	            	})
	            }

	            that.setState({
					shopData:shopCheckedArr,
					useShopData:shopCheckedArr,
					shoplist:data.data.shoplist,
					picUrl:data.data.logo.url,
					picId:data.data.logo.id
	            });
	            that.props.form.setFieldsValue({
					      "actBrand":data.data.shoplist[0].main_shop_name
					    });
		
		        }else{
		          errorCallback(data);
		        }
		      },
		      error: function(xhr, type){
		        if( type != 'parsererror' ){
		          Toast.loading('加载超时,请重试', 2, () => {
		            window.location.reload();
		          });
		        }
		      }
		    })
	}

  componentDidMount =() =>{
  	this.ajaxShopInfo();
  	const { setFieldsValue } = this.props.form;
  	setFieldsValue("cType","代金券");
  	this.ajaxShopInfo();
  }
  //验证活动开始结束
  checkStart = (rule, value, callback) => {
    const { validateFields } = this.props.form;
    validateFields(['end'], {
      force: true
    });
    callback();
  }

  checkEnd = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    const start = moment(getFieldValue('start'), 'YYYY-MM-DD');
    const end = moment(new Date(value), 'YYYY-MM-DD');
    
    if (!end || !start) {
      callback('请选择开始日期和结束日期');
    } else if (end < start ) {
      callback('开始日期须小于结束日期');
    } else {
      callback();
    }
  }
  //验证券有效期开始结束
  checkStartDate = (rule, value, callback) => {
    const { validateFields } = this.props.form;
    validateFields(['endDate'], {
      force: true
    });
    callback();
  }

  checkEndDate = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    const start = moment(getFieldValue('startDate'), 'YYYY-MM-DD');
    const end = moment(new Date(value), 'YYYY-MM-DD');
    
    if (!end || !start) {
      callback('请选择开始日期和结束日期');
    } else if (end < start ) {
      callback('开始日期须小于结束日期');
    } else {
      callback();
    }
  }

  //改变券面额
  checkMoney = (rule, value, callback) =>{
  	const { getFieldValue } = this.props.form;
  	const cMoney=getFieldValue("cMoney");
  	console.log(cMoney)
  	let reg=/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
  	if(!value||!reg.test(value)){
  		callback("输入正确的代金券面额");
  	}else{
  		callback();
  		this.setState({
		cValue:value
	})
  	}
  }
  
//券有效期相对天数验证
  checkStartDay = (rule, value, callback) => {
	const { validateFields } = this.props.form;
	validateFields(['end_day'], {
		force: true
	});
	callback();
  }
  checkEndDay = (rule, value, callback) => {
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
  //验证平均获券量
  checkPerGet = (rule, value, callback) =>{
  	const { validateFields,getFieldValue } = this.props.form;
  	const per=Number(getFieldValue('perGet'));
  	let reg=/^[0-9]*[1-9][0-9]*$/;
  	if(!per||!reg.test(per)){
  		callback("请输入正确的券数量")
  	}else{
  		validateFields(['maxGet'], {
			force: true
		});
		callback()
  	}
  }
  // 最大获券量验证
  checkMaxGet = (rule, value, callback) =>{
  	const { getFieldValue } = this.props.form;
  	const per=Number(getFieldValue('perGet'));
  	const max=Number(value);
  	let reg=/^[0-9]*[1-9][0-9]*$/;
  	if(!max||!reg.test(max)){
  		callback('请输入正确的券数量');
  	}else if(per>max){
  		callback('最大获券量不能小于平均获券量');
  	}else{
  		callback()
  	}
  }
  //高级设置切换
  moreSet = () =>{
  	this.setState({
  		setShow:'none',
  		askShow:'block'
  	})
  }
  //精简设置
  lessSet =() =>{
  	this.setState({
  		setShow:'block',
  		askShow:'none'
  	})
  }
  //点击问号
  answer = key => (e) =>{
  	e.preventDefault();
  	this.setState({
      [key]: true
    })
  }
  ask = key => () =>{
  	this.setState({
      [key]:false
    })
  }
  handleSubmit = (e) =>{
  	console.log('submit');
  	console.log(this.state)
    e.preventDefault();

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
	if(!date_vaild){
		return false;
	}




	this.props.form.validateFields(formValids, { force: true },(error, values) => {

      if (!error) {
        console.log('ok',values);
        if(values.cType[0]=="代金券"){
        	var promo_tools_voucher_type="1";
        	var worth_value=values.cMoney;
        	var voucher_name=values.cName;
        	var user_min_consume=values.minPay;
        }else{
        	var promo_tools_voucher_type="2";
        	var worth_value="";
        	var voucher_name=values.dName;
        	var user_min_consume="";
        }
        if(values.cTerm[0]=="1"){
          var validate_type="2";
          var voucher_relative_delay=values.start_day;
          var voucher_relative_time=values.end_day;
          var voucher_start_time="";
          var voucher_end_time="";
        }else{
          var validate_type="1";
          var voucher_start_time=moment(values.startDate).format('YYYY-MM-DD');
          var voucher_end_time=moment(values.endDate).format('YYYY-MM-DD');
          var voucher_relative_delay="";
          var voucher_relative_time="";
        }
        var formData={
          act_obj:'所有在支付宝口碑消费过的人群',
          name:values.actName,
          start_time:moment(values.start).format('YYYY-MM-DD'),
          end_time:moment(values.end).format('YYYY-MM-DD'),
          voucher_brand_name:values.actBrand,
          promo_tools_voucher_type:promo_tools_voucher_type,
          worth_value:worth_value,
          voucher_name:voucher_name,
          voucher_note:values.cNote,
          validate_type:validate_type,
          voucher_start_time:voucher_start_time,
          voucher_end_time:voucher_end_time,
          voucher_relative_delay:voucher_relative_delay,
          voucher_relative_time:voucher_relative_time,
		  user_min_consume:user_min_consume,
		  use_rule_desc:values.cIntro,
		  user_win_frequency_date:'D',
          user_win_frequency_num:values.perGet,
          user_win_count:values.maxGet,

          logo:this.state.picId,

          //以下数据尚未获取
          // logo:this.state.responseId,

          constraint_suit_shops:this.state.shopData,//核销门店
          voucher_suit_shops:this.state.useShopData,//适用门店

          use_time_values:!this.state.weekData.length?[1,2,3,4,5,6,7]:this.state.weekData,
          use_time_values_time:dateData
        }
    	//use_forbidden_day:newArrDate,

        console.log(formData)

        Toast.loading('加载中...', 30, () => {
	      Toast.loading('加载超时,请重试', 2, () => {
	        window.location.reload();
	      });
	    });

//      var req = new Request( AJAX_URL+"/Couponphone/ajaxCreateSend"+token,{
//          method: 'POST',
//          credentials:'same-origin',
//          body:JSON.stringify(formData)
//      });
//      fetch(req).then(function(response) {
//        // let data = {"data":{"sq":false},"info":"\u6d3b\u52a8\u540d\u79f0\u4e0d\u80fd\u4e3a\u7a7a","status":0};
//        return response.json();
//        // return data;
//      }).then(function(data) {
//        Toast.hide();
//
//        if( Number(data.status) ){
//            Modal.alert('提示', <div>{data.info}</div>, [
//              { text: '确认',onPress: () =>{ hashHistory.push("/") }}
//            ])
//
//        }else{
//          errorCallback(data);
//        }
//      });
        
        $.ajax({
		      url: AJAX_URL+"/Couponphone/ajaxCreateSend"+token,
		      type: 'POST',
		      data: formData,
		      dataType: 'json',
		      timeout: 40000,
		      success: function(data){
		      	Toast.hide();
		        console.log(data)
		        if( Number(data.status) ){
              Modal.alert('提示', <div>{data.info}</div>, [
                { text: '确认',onPress: () =>{ hashHistory.push("/") }}
              ])
		        }else{
		          errorCallback(data);
		        }
		      },
		      error: function(xhr, type){
		        if( type != 'parsererror' ){
		          Toast.loading('加载超时,请重试', 2, () => {
		            window.location.reload();
		          });
		        }
		      }
		    })







      } else {
        console.log('error', error, values);
      }
    });
  }

  render() {
    const { getFieldProps , getFieldError ,getFieldValue } = this.props.form;
    const cTypeRule=[{required: true, message: '请输入兑换券名称' }];
    let errors;

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
      <div className="ms_container">
      <form>
	        <List className="header">
	 			<Item>
	 				消费送
	 				<span onClick={this.moreSet} style={{float:'right',display:this.state.setShow,color:'#ef5522',fontSize:'0.25rem',marginTop:'0.1rem'}}>高级设置</span>
	 				<img onClick={this.answer('modal1')}  src={ask} style={{float:'right',display:this.state.askShow}}/>
	 			</Item>
	        </List>
	        <Modal
	          title="提示"
	          transparent
	          maskClosable={false}
	          visible={this.state.modal1}
	          onClose={this.ask('modal1')}
	          footer={[{ text: '确定', onPress: () => { console.log('ok'); this.ask('modal1')(); } }]}
	        >
	          领取限制:限制您的会员在活动期间,每人每天可以领取的优惠券数量!
	        </Modal>
	        <List renderHeader={() => ''} 
	        	  // renderFooter={() => getFieldError('actName') && getFieldError('actName').join(',')}
	       	>
	          <InputItem
	            {...getFieldProps('actName',{
	            	initialValue:'消费送',
	            	 rules: [
			            {
			              required: true,
			              whitespace: true,
			              message:'请输入活动名称'
			            }
			        ]
	            })}
	            placeholder="输入活动名称"
	            maxLength="16"
	          >
	          	活动名称
	          </InputItem>
	          { errors = getFieldError('actName') ?
	          	<p className="errTip">{(errors = getFieldError('actName')) ? errors.join(',') : null}</p>:
	          	""
	          }
      	  	<div className="am-list-item am-input-item">
      	  		<div className="am-input-label am-input-label-5">
      	  			活动时间
      	  		</div>
      	  		<div className="am-input-control" style={{fontSize:'0.26rem'}}>
      	  			 <DatePicker
		              mode="date"
		              extra="开始日期"
		              minDate={minDate}
		              {...getFieldProps('start', {
		                rules: [this.checkStart],
		                 initialValue:minDate
		              })}
		            >
		              <CustomChildren dateType='start'></CustomChildren>
		            </DatePicker>

		            <DatePicker
		              mode="date"
		              extra="结束日期"
		              minDate={minDate}
		              {...getFieldProps('end', {
		                rules: [this.checkEnd],
		                initialValue: endDate
		              })}
		            >
		              <CustomChildren dateType='end'></CustomChildren>
		            </DatePicker>
      	  		</div>
      	  	</div>
      	  	{ errors = getFieldError('end') ?
	          	<p className="errTip">{(errors = getFieldError('end')) ? errors.join(',') : null}</p>:
	          	""
	          }
      	  	<InputItem
	            {...getFieldProps('actMember',{
	            	initialValue:'所有使用支付宝的会员' 
	            })}
	            editable={false}
	          >
	          	活动对象
	        </InputItem>
	        <InputItem
	            {...getFieldProps('actBrand',{
	            	initialValue:' ',
	            	 rules: [
			            {
			              required: true,
			              whitespace: true,
			              message:'请输入参与品牌'
			            }
			        ]
	            })}
	            placeholder="输入参与品牌"
	            maxLength="20"
	          >
	          	参与品牌
	          </InputItem>
	          { errors = getFieldError('actBrand') ?
	          	<p className="errTip">{(errors = getFieldError('actBrand')) ? errors.join(',') : null}</p>:
	          	""
	          }


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
											     imageUploaded={this.onPicChange}>
										</ReactCoreImageUpload>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>




	        <Picker
	          className="forss"
	          data={this.state.cType}
	          extra="优惠券"
	          cols={1}

	          {...getFieldProps('cType',{
	          	initialValue: ['代金券'],
	          })}
	        >
	          <List.Item  arrow="down">券类型</List.Item>
	        </Picker>
	        <InputItem
	        	style={{display:getFieldValue('cType')[0]=='代金券'?'':'none'}}
	            {...getFieldProps('cMoney',{
	            	initialValue:this.state.cValue,
	            	rules: [this.checkMoney]
	            })}
	            placeholder="输入代金券券面额"
	            maxLength="8"
	            extra="元"
	          >
	          	券面额
	        </InputItem>
	        { errors = getFieldError('cMoney') ?
	          	<p className="errTip">{(errors = getFieldError('cMoney')) ? errors.join(',') : null}</p>:
	          	""
	          }
	        <InputItem
	        	style={{display:getFieldValue('cType')[0]=='代金券'?'':'none'}}
	            {...getFieldProps('cName',{
	            	initialValue:this.state.cValue+'元代金券',
	            	 rules: [
			            {	
			              required: true,
			            }
			        ]
	            })}
	            editable={false}
	          >
	          	券名称
	        </InputItem>
	        <div style={{display:getFieldValue('cType')[0]=='代金券'?'':'none'}}>
	        	<div className="am-list-item am-input-item" style={{paddingRight:0}}>
		        	<div className="am-input-label am-input-label-5">消费门槛</div>
		        	<div className="am-input-control">
		        		<div className="beforeInp">消费满</div>
		        		<InputItem
				            {...getFieldProps('minPay', {
				              initialValue: 1,
				              rules: [{pattern:/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/, required: true, message: '请输入正确的消费门槛' }],
				            })}
				            maxLength='8'
							placeholder="请输入券面额"
				            extra="元可用"
				        >
		        		</InputItem>
		        
		        	</div>
		        </div>
	        </div>
	        { errors = getFieldError('minPay') ?
	          	<p className="errTip">{(errors = getFieldError('minPay')) ? errors.join(',') : null}</p>:
	          	""
	          }
            <InputItem
            	style={{display:getFieldValue('cType')[0]=='代金券'?'none':''}}
	            {...getFieldProps('dName',{
				    rules: getFieldValue('cType')[0]=='代金券'?[]:cTypeRule
	            })}
	            placeholder="输入兑换券名称"
	          >
	          	券名称
	        </InputItem>
	        { errors = getFieldError('dName') ?
	          	<p style={{display:getFieldValue('cType')[0]=='代金券'?'none':'block'}} className="errTip">{(errors = getFieldError('dName')) ? errors.join(',') : null}</p>:
	          	""
	          }
	        <Picker
	          className="forss"
	          data={this.state.cTerm}
	          extra="相对日期"

	          cols={1}

	          {...getFieldProps('cTerm',{
	          	initialValue: ['1'],
	          })}
	        >
	          <List.Item  arrow="down">券有效期</List.Item>
	        </Picker>
	        <div className="relaBox" style={{display:getFieldValue('cTerm')[0]=='1'?'block':'none'}}>
		        <div className="relaDate" style={{display:'flex',justifyContent:'flex-end'}}>
			        <div className="am-list-item am-input-item" >
			        	<div className="am-input-label am-input-label-4" style={{fontSize:'0.3rem'}}>从发券第</div>
			        	<div className="am-input-control validRange hq_validRange">
			        		<InputItem
			        			style={{fontSize:'0.3rem',paddingLeft:'30px'}}
							    {...getFieldProps('start_day',{
							    	initialValue: 1,
					            	rules: [{pattern:/^[0-9]*[1-9][0-9]*$/, required: true},{validator: this.checkStartDay}]
							    })}
							    type='number'
						  	/>
						  	<span style={{fontSize:'0.3rem'}}>天-第</span>
						  	<InputItem
						  		style={{fontSize:'0.3rem'}}
							    {...getFieldProps('end_day',{
							    	initialValue: 30,
					            	rules: [{pattern:/^[0-9]*[1-9][0-9]*$/, required: true, message: '请输入正确的截止天数' },{validator: this.checkEndDay}]
							    })}
							    type='number'
						  	/>
						  	<span>天</span>
			        	</div>
			        </div>
		        </div>
		        { errors = getFieldError('end_day') ?
			          	<p className="errTip">{(errors = getFieldError('end_day')) ? errors.join(',') : null}</p>:
			          	""
			        }
	        </div>
	        <div className="fixDate" style={{display:getFieldValue('cTerm')[0]=='1'?'none':'block'}}>
	      		<div className="am-list-item am-input-item">
		      		<div className="am-input-control" style={{display:'flex',justifyContent:'flex-end'}}>
	      	  			 <DatePicker
			              mode="date"
			              extra="开始日期"
			              minDate={minDate}
			              {...getFieldProps('startDate', {
			                rules: [this.checkStartDate],
			                 initialValue:minDate
			              })}
			            >
			              <CustomChildren dateType='start'></CustomChildren>
			            </DatePicker>

			            <DatePicker
			              mode="date"
			              extra="结束日期"
			              minDate={minDate}
			              {...getFieldProps('endDate', {
			                rules: [this.checkEndDate],
			                initialValue: endDate
			              })}
			            >
			              <CustomChildren dateType='end'></CustomChildren>
			            </DatePicker>
	      	  		</div>
	      		</div>
      	  		{ errors = getFieldError('endDate') ?
		          	<p className="errTip">{(errors = getFieldError('endDate')) ? errors.join(',') : null}</p>:
		          	""
		        }
	        </div>
	        <div style={{display:this.state.askShow}}>
	        <div>
	        	<div className="am-list-item am-input-item" style={{paddingRight:0,height:'auto',borderTop:'1px solid #e9e9e9'}}>
	        		<div className="am-input-label am-input-label-5">领取限制</div>
		        	<div style={{display:'flex',flexDirection:'column'}}>
		        		<div className="am-input-control" style={{borderBottom:'1px solid #e9e9e9'}}>
			        		<div className="beforeInp">每人每天可得</div>
			        		<InputItem
					            {...getFieldProps('perGet', {
					              initialValue: 1,
					              rules: [
					              			// {pattern:/^[0-9]*[1-9][0-9]*$/, required: true, message: '请输入正确的券数量' }
					              			this.checkPerGet
					              		],
					            })}
					            maxLength='8'
								placeholder="输入券数量"
								type='number'
					            extra="张"
					        >
			        		</InputItem>
		        
			        	</div>
			        	{ errors = getFieldError('perGet') ?
				          	<p className="errTip">{(errors = getFieldError('perGet')) ? errors.join(',') : null}</p>:
				          	""
				        }
			        	<div className="am-input-control">
			        		<div className="beforeInp">每人最多可得</div>
			        		<InputItem
					            {...getFieldProps('maxGet', {
					              initialValue: 1,
					              rules: [
					              			// {pattern:/^[0-9]*[1-9][0-9]*$/, required: true, message: '请输入正确的券数量' }
					              			this.checkMaxGet
					              		],
					            })}
					            maxLength='2'
								placeholder="输入券数量"
								type='number'
					            extra="张"
					        >
			        		</InputItem>
			        
			        	</div>
			        	{ errors = getFieldError('maxGet') ?
				          	<p className="errTip">{(errors = getFieldError('maxGet')) ? errors.join(',') : null}</p>:
				          	""
				        }
		        	</div>
		        </div>
	        </div>

	        <div className="am-list-item am-input-item" style={{paddingRight:0}}>
	        	<div className="am-input-label am-input-label-5">适用门店</div>
	        	<div className="am-input-control">
					<Item extra="" arrow="horizontal" onClick={() => {
						useshopPop.show(<ShopPop shoplist={this.state.shoplist} getShopData={this.getUseShopData} shopdata={this.state.useShopData}></ShopPop>, { animationType: 'slide-up', maskClosable: false })
						useshopPop.isShow = true;
					}}>全部{this.state.useShopData.length}家门店</Item>
				</div>
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

	        <div>
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
	        </div>
	        <TextareaItem
	            title="券说明"
	            placeholder="请输入券使用说明"
	            rows="2"
	            {...getFieldProps('cIntro', {
					              initialValue:"下次到店消费可用,每桌限用一张,不与店内其他优惠同享" ,
					            
				})}
	        />
	        <TextareaItem
	            title="券备注"
	            placeholder="请输入券备注"
	            rows="3"
	            {...getFieldProps('cNote', {
					              initialValue:"" ,
					            
				})}
	        />
	        <p className="am-list-item am-textarea-item" style={{paddingTop:'0.2rem'}}>*备注内容仅在收银端可见</p>
	        </div>
	        </List>


	        <Flex className="rule_btn_box">
		    	<Flex.Item style={{display:this.state.askShow}}>
	           		<Button type="ghost"  onClick={this.lessSet}>精简模式</Button>
		    	</Flex.Item>
		    	<Flex.Item>
    				<Button type="primary"   onClick={this.handleSubmit}>确认配置</Button>
		    	</Flex.Item>
		    </Flex>
        </form>
      </div>
    );
  }
}

const BasicInputExampleWrapper = createForm()(BasicInputExample);
export default  BasicInputExampleWrapper
