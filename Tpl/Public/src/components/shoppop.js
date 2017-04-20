import React,{Component} from 'react';
import { List, Checkbox, Flex,Button,Toast,Popup } from 'antd-mobile';
import { createForm } from 'rc-form';

import './css/weekpop.css';

const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;

class ShopPop extends React.Component {
	constructor(props){
		super(props);
		this.state={
			shoplist:props.shoplist,
			allState:'checked'
		}
	}

	onSubmit = (e) => {
	    console.log('submit');
	    e.preventDefault();
	    this.props.form.validateFields( (error, values) => {
	      if (!error) {
	        let validCheck = false;
	        let checkArr = [];
	        for( let vkey in values ){
	        	if( values[vkey] ){
	        		validCheck = true;
	        		checkArr.push( values[vkey] )
				}
	        }

	        if( validCheck ){
	        	this.props.getShopData(checkArr)
	        }else{
	        	Toast.info('请至少选择一个店铺', 1);
	        }

	      } else {
	        console.log('error', error, values);
	      }
	    });
	};
	checkallEvent=(e)=>{
		let checked = e.target.checked;
		this.setState({
			allState:checked
		})

		this.state.shoplist.map( (s)=>{

			var sline = {};
			sline['shop'+s.shop_id] = {
				value:checked?s.shop_id:false
			}
			this.props.form.setFields(sline)
		})
	}
	render() {
		const { form } = this.props;
		const { getFieldProps } = form;
    return (
    	<form onSubmit={this.onSubmit}>
    		<List renderHeader={() => '选择店铺'}>
		        {this.state.shoplist.map( (i) =>{

		        	let cur = i.shop_id;
		        	if( this.props.shopdata.length ){
		        		if( this.props.shopdata.indexOf(i.shop_id) != -1){
		        			cur = i.shop_id;
		        		}else{
		        			cur = false;
		        		}
		        	}

		        	return (
						<CheckboxItem
							{...getFieldProps('shop'+i.shop_id, {
			                	initialValue: cur,
			                	valuePropName: 'checked',
			                	getValueFromEvent(e) {
			                    	return e.target.checked ? i.shop_id : false;
			                	},
			                	getValueProps(value) {
				                    return {
				                      checked: !!value,
				                    };
			                  	}
			                })}

						 key={i.shop_id} >
			            	{i.main_shop_name}
			        	</CheckboxItem>
			        )
		        } 
		      )}
	      	</List>




			<List className='checkall'>
			    <List.Item
			      extra={<Button type="primary" size="small" inline onClick={this.onSubmit}>确定</Button>}
			      multipleLine
			    >
			    	<AgreeItem data-seed="logId" defaultChecked='checked' checked={this.state.allState} onChange={this.checkallEvent}>全选</AgreeItem>
			    </List.Item>

			</List>
      	</form>
	);
  }
}
const ShopPopForm = createForm()(ShopPop);

export default ShopPopForm;