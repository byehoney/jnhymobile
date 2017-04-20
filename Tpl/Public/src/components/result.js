import React from 'react'
import './css/result.css'
import chart from './assets/chart.svg'
import member from './assets/member.svg'
import money from './assets/money.svg'
import { Toast,Popup } from 'antd-mobile';

export default class myHome extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        totalTakenCnt:0,
        totalAmt:0,
        totalUsedCnt:0,
        merNumNew:0,
        merNumTotal:0,
        tradeTwiceUser:0,
        CouponProfit:0,
        consumptionTotal:0,
        consumptionavg:0
    }
}

    componentDidMount =() => {
      this.ajaxShopInfo();
        var that=this;

         $.ajax({
            url: AJAX_URL+'/Couponphone/ajaxGetVariousTongji'+token,
            type: 'POST',
            data: {},
            dataType: 'json',
            timeout: 40000,
            success: function(data){
                if(data.status){
                    that.setState({
                        totalTakenCnt:data.data.total7days.totalTakenCnt,
                        totalAmt:data.data.total7days.totalAmt,
                        totalUsedCnt:data.data.total7days.totalUsedCnt,
                        merNumNew:data.data.memberCount.merNumNew,
                        merNumTotal:data.data.memberCount.merNumTotal,
                        tradeTwiceUser:data.data.memberCount.tradeTwiceUser,
                        CouponProfit:data.data.ConsumptionTotal.CouponProfit,
                        consumptionTotal:data.data.ConsumptionTotal.consumptionTotal,
                        consumptionavg:data.data.ConsumptionTotal.consumptionavg
                    })
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


    render(){
        return (
            <div className="result_content">
              <div className="result-card">
                <div className="card_left">
                  <p><img src={chart}/>过去7天营销收益(元)</p>
                  <p style={{color:'#ef5522',fontSize:'0.4rem'}}>{this.state.totalAmt}</p>
                </div>
                <div className="card_right">
                  <div className="card_data_top">
                    <p>过去7天发券量</p>
                    <p style={{color:'#ef5522'}}>{this.state.totalTakenCnt}</p>
                  </div>
                  <div className="card_data_bot">
                    <p>过去7天核销券量</p>
                    <p style={{color:'#ef5522'}}>{this.state.totalUsedCnt}</p>
                  </div>
                </div>
              </div>
              <p style={{paddingTop:20,width:'96%',margin:'0 auto'}}>我的运营数据</p>
              <div className="result-card">
                <div className="card_left">
                  <p><img src={member}/>今日新增会员人数(人)</p>
                  <p style={{color:'#ef5522',fontSize:'0.4rem'}}>{this.state.merNumNew}</p>
                </div>
                <div className="card_right">
                  <div className="card_data_top">
                    <p>总会员</p>
                    <p style={{color:'#ef5522'}}>{this.state.merNumTotal}</p>
                  </div>
                  <div className="card_data_bot">
                    <p>交易二次以上会员</p>
                    <p style={{color:'#ef5522'}}>{this.state.tradeTwiceUser}</p>
                  </div>
                </div>
              </div>
              <div className="result-card" style={{marginBottom:'1.5rem'}}>
                <div className="card_left">
                  <p><img src={money}/>今日消费额(元)</p>
                  <p style={{color:'#ef5522',fontSize:'0.4rem'}}>{this.state.CouponProfit}</p>
                </div>
                <div className="card_right">
                  <div className="card_data_top">
                    <p>总消费额</p>
                    <p style={{color:'#ef5522'}}>{this.state.consumptionTotal}</p>
                  </div>
                  <div className="card_data_bot">
                    <p>平均每单消费额</p>
                    <p style={{color:'#ef5522'}}>{this.state.consumptionavg}</p>
                  </div>
                </div>
              </div>
            </div>
        )
    }
}