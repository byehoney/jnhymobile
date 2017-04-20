import React from 'react';
import { List, InputItem, Button,DatePicker,Popup,Flex } from 'antd-mobile';
const Item = List.Item;
import './css/pullnew.css';
import CreateRulePop from './CreateRulePop.js';

CreatePop =Popup.newInstance();

class RulePop extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			formData:null,
			worth_value:'1',
			user_min_consume:'1'
		}
	}
	saveCreateForm = (data,fthis) => {
		
		this.setState({
			formData:data,
			worth_value:data.formValues.worth_value,
			user_min_consume:data.formValues.user_min_consume
		})
		this.closeCreateForm();
	}
	closeCreateForm = () => {
		CreatePop.hide();
		CreatePop.isShow = false;
	}
	toSave = () => {
		this.props.getFormInfo(this.state.formData);
		Popup.hide();
	}

	componentDidMount() {
        if( this.props.formData ){
			var formData = this.props.formData;
			this.setState({
				formData:formData,
				worth_value:formData.formValues.worth_value,
				user_min_consume:formData.formValues.user_min_consume
			})
		}
    }

	render(){
		

		return (
			<div>
				<div className="am-list-item ">
		    		<div className="am-input-control" style={{textAlign:'center'}}>
		    		送券规则
		        	</div>
		        </div>
				
		        <p className="rule_title">订单笔单价{this.state.user_min_consume}元</p>
		        <p className="rule_title"  style={{borderBottom:'none'}}>规则1</p>
		        
		        <List className="my-list">
		        <div className="am-list-item am-input-item">
		    		<div className="am-input-control" style={{borderBottom:'none'}}>
		    		从未到店买单的顾客，自动获得：
		        	</div>
		        </div>
					<Item arrow="horizontal" onClick={() => {
							CreatePop.show(<CreateRulePop formData={this.state.formData} saveCreateForm={this.saveCreateForm} closeCreateForm={this.closeCreateForm}></CreateRulePop>, { animationType: 'slide-up', maskClosable: false })
							CreatePop.isShow = true;
					}}>{this.state.worth_value}元代金券，{this.state.user_min_consume}元可用</Item>
		     	</List>

	     	 	<Flex className="rule_btn_box">
			    	<Flex.Item>
			    		<Button className="btn" onClick={()=>{ Popup.hide() }}>取消</Button>
			    	</Flex.Item>
			    	<Flex.Item>
	    				<Button className="btn" type="primary" onClick={this.toSave}>保存</Button>
			    	</Flex.Item>
			    </Flex>

	        </div>

		)
	}
}





















export default RulePop;