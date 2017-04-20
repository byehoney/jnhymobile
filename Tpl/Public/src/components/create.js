import React from 'react'
import './css/create.css';
import xs from '../images/xs.png';
import mf from '../images/mf.png';
import lx from '../images/lx.png';
import {Button,Flex} from 'antd-mobile';
import { Link } from 'react-router';







export default class myHome extends React.Component {
    constructor(props){
        super(props)
        this.state={
            
        }
    }

    render(){
        return (
            <div className="create_content">
            	<div className="create_line">
            		
            		<div className="create_card l_crad">
	            		<Link to="/paygive">
		            		<h3 className='create_title'>消费送</h3>
	                        <p className='create_detail'>支付即赠券,闪速发展会员</p>
	                        <div style={{textAlign:'center'}}>
	                            <img src={xs}/>
	                        </div>
	                        <Flex className="act_data_datile">
						      <Flex.Item>
						        	<p style={{color: '#ef5522'}}>36085 次</p>
							        <p>累计使用</p>
						      </Flex.Item>
						      <Flex.Item>
						      	<p style={{color: '#ef5522'}}>10825 元</p>
						        <p>平均收益</p>

						      </Flex.Item>
						    </Flex>
	                        <Button className="btn" type="primary" size="small" inline >立即使用</Button>  
                        </Link>
	            	</div>
	            	<div className="create_card r_crad">
		            	<Link to="/payfullgive">
		            		<h3 className='create_title'>满返券</h3>
	                        <p className='create_detail'>消费满额赠券,提升桌均</p>
	                        <div style={{textAlign:'center'}}>
	                            <img src={mf}/>
	                        </div>
	                        <Flex className="act_data_datile">
						      <Flex.Item>
						        	<p style={{color: '#ef5522'}}>4151 次</p>
	                                <p>累计使用</p>
						      </Flex.Item>
						      <Flex.Item>
						      	<p style={{color: '#ef5522'}}>1.6万元</p>
                                <p>平均收益</p>
						      </Flex.Item>
						    </Flex>
	                        <Button className="btn" type="primary" size="small" inline >立即使用</Button>
                        </Link>
	            	</div>
            	</div>
            	<div className="create_line">
            		
	            	<div className="create_card l_crad new">
	            		<Link to="/pullnew">
		            		<h3 className='create_title'>拉新</h3>
	                        <p className='create_detail'>多渠道流量曝光,将未到店消费顾客发展成为会员</p>
	                        <div style={{textAlign:'center'}}>
	                            <img src={lx}/>
	                        </div>
	                        <Flex className="act_data_datile">
						      <Flex.Item>
						        	<p style={{color: '#ef5522'}}>801 次</p>
	                                <p>累计使用</p>
						      </Flex.Item>
						      <Flex.Item>
						      	<p  style={{color: '#ef5522'}}>2.36万元</p>
                                <p>平均收益</p>
						      </Flex.Item>
						    </Flex>
	                        <Button className="btn" type="primary" size="small" inline >立即使用</Button>     
                        </Link>
	            	</div>
	            	<div className="create_card" style={{visibility:'hidden'}}>
	            		
	            	</div>
            	</div>
            </div>
        )
    }
}
