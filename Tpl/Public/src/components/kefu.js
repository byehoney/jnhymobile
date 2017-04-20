import React from 'react'
import { Card, WingBlank, WhiteSpace } from 'antd-mobile';
import dd from '../images/dd.png'
import ww from '../images/ww.jpg'
import wx from '../images/wxx.jpg'
export default class Kf extends React.Component {
   constructor (props){
    super(props)
 
   }

    render(){
        return (
            <div className="kf_container" style={{backgroundColor:'#fff',marginBottom:'1rem'}}>
              <div className="kf_box" style={{paddingTop:'0.5rem',textAlign:'center'}}>
                <p style={{marginBottom:'0.2rem'}}><span style={{color:'#000',fontWeight:'bold'}}>客服旺旺号:</span>全能促销插件</p>
                <img style={{width:'3rem',height:'3rem',marginBottom:'0.3rem'}} src={ww}/>
                <p style={{marginBottom:'0.2rem'}}><span style={{color:'#000',fontWeight:'bold'}}>客服钉钉号:</span>13121960260</p>
                <img style={{width:'3rem',height:'3rem',marginBottom:'0.3rem'}} src={dd}/>
                <p style={{marginBottom:'0.2rem'}}><span style={{color:'#000',fontWeight:'bold'}}>客服微信号:</span>jinniukefu</p>
                <img style={{width:'3rem',height:'3rem',marginBottom:'0.3rem'}} src={wx}/>
              </div>
            </div>
        )
    }
}
