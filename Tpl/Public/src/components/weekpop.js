import React,{Component} from 'react';
import { List, Checkbox, Flex,Button,Toast,Popup } from 'antd-mobile';
import { createForm } from 'rc-form';

import './css/weekpop.css';

const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;
const weekdata = [
	{ value: 1, label: '周一' },
	{ value: 2, label: '周二' },
	{ value: 3, label: '周三' },
	{ value: 4, label: '周四' },
	{ value: 5, label: '周五' },
	{ value: 6, label: '周六' },
  	{ value: 7, label: '周日' }
];

class WeekPop extends React.Component {

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
	        	this.props.getWeekData(checkArr)
	        }else{
	        	Toast.info('请至少选择一天', 1);
	        }

	      } else {
	        console.log('error', error, values);
	      }
	    });
	};
	render() {
		const { form } = this.props;
		const { getFieldProps } = form;
		console.log('weekdata')
		console.log(this.props.weekdata)
    return (
    	<form onSubmit={this.onSubmit}>
    		<List renderHeader={() => '选择可用时间'}>
		        {weekdata.map( (i) =>{

		        	let cur = i.value;
		        	if( this.props.weekdata.length ){
		        		if( this.props.weekdata.indexOf(i.value) != -1){
		        			cur = i.value;
		        		}else{
		        			cur = false;
		        		}
		        	}

		        	return (
						<CheckboxItem
							{...getFieldProps('week'+i.value, {
			                	initialValue: cur,
			                	valuePropName: 'checked',
			                	getValueFromEvent(e) {
			                    	return e.target.checked ? i.value : false;
			                	},
			                	getValueProps(value) {
				                    return {
				                      checked: !!value,
				                    };
			                  	}
			                })}

						 key={i.value} >
			            	{i.label}
			        	</CheckboxItem>
			        )
		        } 
		      )}
	      	</List>


	        <Flex className="rule_btn_box">
		    	<Flex.Item>
		    		<Button className="btn" onClick={() => this.props.closeWeekPop() }>取消</Button>
		    	</Flex.Item>
		    	<Flex.Item>
    				<Button className="btn" type="primary" onClick={this.onSubmit}>确定</Button>
		    	</Flex.Item>
		    </Flex>
      	</form>
	);
  }
}
const WeekPopForm = createForm()(WeekPop);

export default WeekPopForm;