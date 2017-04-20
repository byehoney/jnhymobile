import React from 'React';
import { List, InputItem, Switch, Button,DatePicker,Popup,Toast,Modal } from 'antd-mobile';
import moment from 'moment';
import { createForm } from 'rc-form';
import { Router, Route,hashHistory} from 'react-router';
import RulePop from './RulePop.js'
import dateicon from './assets/date.svg';
import './css/pullnew.css'

const Item = List.Item;
const Brief = Item.Brief;
const minDate = moment(new Date(), 'YYYY-MM-DD').utcOffset(8);
const endDate = moment(new Date(new Date().getTime() + 86400000*7), 'YYYY-MM-DD')


const CustomChildren = props => (
  <span>
    <span style={{ float: 'left', color: '#888',marginLeft:'0.15rem' }} onClick={props.onClick}>{props.extra}
      <img src={dateicon} className='dateiconpic'/>
      {props.dateType==='start'?'至':''}
    </span>
  </span>
);

class Pullnew extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      startDate:'',
      formData:null,

      checkedShops:'',
      voucher_brand_name:'',
      responseId:'',
      logoUrl:''
    }
  }

  componentDidMount() {
    this.ajaxShopInfo();
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
        console.log(data)
        if( Number(data.status) ){
          const shopCheckedArr = [];
          if( data.data.shoplist.length ){
            data.data.shoplist.forEach(function(val,key){
              shopCheckedArr.push(val.shop_id)
            })
          }

          that.setState({
            formData:{
              formState:{
                weekData:[],
                week_txt:'全周',
                shopData:shopCheckedArr,
                picId:data.data.logo.id,
                shoplist:data.data.shoplist,
                picUrl:data.data.logo.url,
              },
              timesData:[],
              formValues:{
                "voucher_brand_name":data.data.shoplist[0].main_shop_name,
                "voucherRange":["1"],
                "promo_tools_voucher_type":["1"],
                "worth_value":1,
                "user_min_consume":1,
                "validate_type":["2"],
                "start_day":1,
                "end_day":30,
                "time_type":["1"],
                "use_rule_desc":"下次到店消费可用，每次限用1张，不与店内其他优惠同享",
                "voucher_note":""
              }
            }
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

  onSubmit = () => {

    Toast.loading('加载中...', 30, () => {
      Toast.loading('加载超时,请重试', 2, () => {
        window.location.reload();
      });
    });

console.log(this.state.formData)
    let sonFormData = this.state.formData.formValues;
    let sonStateData = this.state.formData.formState;
    let timesData = this.state.formData.timesData;

    this.props.form.validateFields({ force: true }, (error,values) => {
      if (!error) {
        console.log(values);


        var formatData = {
          name:values.name,
          act_obj:"从未到店支付宝买单的顾客",
          start_time:values.start.format('YYYY-MM-DD'),
          end_time:values.end.format('YYYY-MM-DD'),
          auto_delay_flag:values.auto_delay_flag?'Y':'N',
          quantity:values.quantity,
          
          voucher_brand_name:sonFormData.voucher_brand_name,
          logo:sonStateData.picId,
          promo_tools_voucher_type:sonFormData.promo_tools_voucher_type[0],
          worth_value:sonFormData.worth_value,
          voucher_name:sonFormData.worth_value+'元代金券',
          voucher_note:sonFormData.voucher_note,
          validate_type:sonFormData.validate_type[0],

          voucher_relative_time:sonFormData.end_day,
          voucher_relative_delay:sonFormData.start_day,

          user_min_consume:sonFormData.user_min_consume,
          constraint_suit_shops:sonStateData.shopData,
          voucher_suit_shops:sonStateData.shopData,

          use_time_values:!sonStateData.weekData.length?[1,2,3,4,5,6,7]:sonStateData.weekData,
          use_forbidden_day:[],
          use_rule_desc:sonFormData.use_rule_desc,
          use_time_values_time:timesData
        };

//      var req = new Request(AJAX_URL+"/Couponphone/ajaxCreateExclusive"+token,{
//          method: 'POST',
//          credentials:'same-origin',
//          body:JSON.stringify(formatData)
//        });
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
	      url: AJAX_URL+"/Couponphone/ajaxCreateExclusive"+token,
	      type: 'POST',
	      data: formatData,
	      dataType: 'json',
	      timeout: 40000,
	      success: function(data){
	         Toast.hide();

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
        console.log( error )
        // alert('校验失败');
      }
    });
  }
  onReset = () => {
    this.props.form.resetFields();
  }
  checkStart = (rule, value, callback) => {
    const { validateFields } = this.props.form;
    validateFields(['end'], {
      force: true
    });
    callback();
  };

  checkEnd = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    const start = moment(getFieldValue('start'), 'YYYY-MM-DD');
    const end = moment(new Date(value), 'YYYY-MM-DD');

    if (!end || !start) {
      callback('请选择开始日期和结束日期');
    } else if (end < start ) {
      callback('开始日期须大于结束日期');
    } else {
      callback();
    }
  };

  getFormInfo = (data) => {
    this.setState({
      formData:data
    })
  }


  render() {
    const { getFieldProps, getFieldError } = this.props.form;

    return (<form>
      <List renderHeader={() => '活动配置'}
        renderFooter={() => getFieldError('name') && getFieldError('name').join(',')}
      >
        <InputItem
          {...getFieldProps('name', {
            	initialValue: '招募新会员',
            rules: [
            	{ required: true, message: '请输入活动名称' }
            ],
          })}
          clear
          maxLength='16'
          placeholder="请输入活动名称"
        >活动名称</InputItem>
        <div className='errorTip'>
          {getFieldError('name') ? getFieldError('name').join(',') : null}
        </div>

        <InputItem
            value="从未到店支付宝买单的顾客"
            editable={false}
          >活动对象
        </InputItem>

        <div className="am-list-item am-input-item">
          <div className="am-input-label am-input-label-5">活动时间</div>
          <div className="am-input-control" style={{fontSize:'0.26rem'}}>
            <DatePicker
              mode="date"
              title="选择日期"
              extra="请选择开始日期"
              
              minDate={minDate}
              {...getFieldProps('start', {
                initialValue: minDate,
                rules: [this.checkStart]
              })}
            >
              <CustomChildren dateType='start'></CustomChildren>
            </DatePicker>

            <DatePicker
              mode="date"
              title="选择日期"
              extra="请选择结束日期"
              minDate={minDate}
              {...getFieldProps('end', {
                initialValue: endDate,
                rules: [this.checkEnd]
              })}
            >
              <CustomChildren dateType='end'></CustomChildren>
            </DatePicker>
          </div>
        </div>
          <div className='errorTip'>
            {getFieldError('end') ? getFieldError('end').join(',') : null}
          </div>

        <div className="am-list-item am-input-item">
          <div className="am-input-label am-input-label-5">自动续期</div>
          <div className="am-input-control">
            <Switch {...getFieldProps('auto_delay_flag', { initialValue: true, valuePropName: 'checked' })} />
          </div>
          <span className='auto_tip'>*活动到期前3天自动延期一个月，最长一年</span>
        </div>


        <Item extra="已设置1个规则" arrow="horizontal"  onClick={() => {Popup.show(<div className="popup_box"><RulePop formData={this.state.formData} getFormInfo={this.getFormInfo}></RulePop></div>, { animationType: 'slide-up', maskClosable: false })}}>送券规则</Item>

        <InputItem
            value="每人可参加1次"
            editable={false}
          >参与限制
        </InputItem>

        <InputItem
            {...getFieldProps('quantity', {
              initialValue: 99999,
              rules: [{pattern:/^[1-9]*[1-9][0-9]*$/, required: true, message: '请输入正确的发券数量' }],
            })}
            maxLength='8'
            type="number"
            placeholder="请输入发券数量"
            extra="张"
        >发券总数</InputItem>
        <div className='errorTip'>
          {getFieldError('quantity') ? getFieldError('quantity').join(',') : null}
        </div>


        <Item>
          <Button type="primary" onClick={this.onSubmit}>创建活动</Button>
        </Item>
      </List>


    </form>);
  }
}

const PullnewForm = createForm()(Pullnew);
export default PullnewForm;