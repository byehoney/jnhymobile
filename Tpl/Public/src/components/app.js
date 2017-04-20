'use strict';
import './css/Footer.css';
import React from 'react';
import hokIcon from './assets/hok.svg';
import hnoIcon from './assets/hno.svg';
import mokIcon from './assets/mok.svg';
import mnoIcon from './assets/mno.svg';
import eokIcon from './assets/eok.svg';
import enoIcon from './assets/eno.svg';

import curResultIcon from './assets/result_fill.svg';
import defResultIcon from './assets/result.svg';

import classnames from 'classnames';
import ReactDom from 'react-dom';
import { Router, Route, Link, hashHistory, IndexRoute} from 'react-router';

// 引入单个页面（包括嵌套的子页面）
import home from './home.js';
import create from './create.js';
import result from './result.js';
import kefu from './kefu.js';
import paygive from './paygive.js';
import payfullgive from './payfullgive.js';
import pullnew from './pullnew.js';

import { Toast,Popup,Modal } from 'antd-mobile';
const alert = Modal.alert;





errorCallback = (data) => {
	if( data.data.sq ){
		alertInstance = alert('需要授权', <div>{data.info}</div>, [
	      { text: '确认', onPress: () =>{ window.location.href = data.data.url} }
	    ])

	}else{
		alertInstance = alert('提示', <div>{data.info}</div>, [
	      { text: '确认', onPress: () => console.log(' ') }
	    ])
	}
}





var that="";
// 配置导航
class Sider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: ''
        };
    }
    render() {
    	var arr = [1];
	    let footer = '';
    	let pathName = this.props.location.pathname;
	    footer = arr.map(function(key,val){
			let ft = '';
			if (pathName === '/' || pathName === '/create' || pathName === '/result' || pathName === '/kefu') {
				ft = (
						<section className="footer-nav text-center">
							<nav>
								<Link to='/'>
									<div className={classnames({
										'nav-icon': true, 'rel': true, 'hic': true,
										'nav-s': pathName === '/'
									})}>
										<img src={pathName === '/' ? hokIcon : hnoIcon} />
									</div>
								</Link>
							</nav>
							<nav>
								<Link to="/create">
									<div className={classnames({
										'nav-icon': true, 'rel': true, 'nic': true,
										'nav-s': pathName === '/create'
									})}>
										<img src={pathName === '/create' ? mokIcon : mnoIcon} />
									</div>
								</Link>
							</nav>
							<nav>
								<Link to="/result">
									<div className={classnames({
										'nav-icon': true, 'rel': true, 'eic': true,
										'nav-s': pathName === '/result'
									})}>
										<img src={pathName === '/result' ? curResultIcon : defResultIcon} />
									</div>
								</Link>
							</nav>
							<nav>
								<a href="https://pamilu.cn/mobile.php/Coupon/send">
									<div className={classnames({
										'nav-icon': true, 'rel': true, 'kf': true,
										'nav-s': pathName === '/kefu'
									})}>
										<img src={pathName === '/kefu' ? eokIcon : enoIcon} />
									</div>
								</a>
							</nav>
						</section>
					)
			}
			return ft
	    })
        return (
        	
            <div className='container'>
			    <div className='core-layout__viewport'>
			      { this.props.children }
			    </div>
			    {footer}
			</div>
        )
    }
}

const onEnterRouter = () => {
	// console.log('Popup.hide()')
	// Popup.hide();
	// Toast.hide();
	// console.log('Popup.hide()2')
}
const onLeaveRouter = () => {
	Popup.hide();
	Toast.hide();
	if(alertInstance){
		alertInstance.close();
	}

	CreatePop.isShow?CreatePop.hide():false;
	weekPop.isShow?weekPop.hide():false;
	shopPop.isShow?shopPop.hide():false;
	useshopPop.isShow?useshopPop.hide():false;
}
// 配置路由
ReactDom.render((
    <Router history={hashHistory} >
        <Route path="/" component={Sider} >
            <IndexRoute component={home} onEnter={onEnterRouter} onLeave={onLeaveRouter} />
            <Route path="home" component={home} onEnter={onEnterRouter} onLeave={onLeaveRouter} />
            <Route path="create" component={create} onEnter={onEnterRouter} onLeave={onLeaveRouter} />
            <Route path="result" component={result} onEnter={onEnterRouter} onLeave={onLeaveRouter} />
            <Route path="kefu" component={kefu} onEnter={onEnterRouter} onLeave={onLeaveRouter} />
            <Route path="paygive" component={paygive} onEnter={onEnterRouter} onLeave={onLeaveRouter} />
            <Route path="payfullgive" component={payfullgive} onEnter={onEnterRouter} onLeave={onLeaveRouter} />
            <Route path="pullnew" component={pullnew} onEnter={onEnterRouter} onLeave={onLeaveRouter} />
        </Route>
    </Router>
), document.getElementById('app'));
