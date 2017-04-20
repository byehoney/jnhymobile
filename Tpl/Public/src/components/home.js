import React from 'React';
import { Card,ListView,Toast } from 'antd-mobile';
import './css/my.css'
import lx from './assets/lx.svg';
import ms from './assets/ms.svg';
import xf from './assets/xf.svg';

function MyBody(props) {
  return (
    <div className="am-list-body my-body">
      {props.children}
    </div>
  );
}

// import lx from './assets/lx.svg';

let listData = [];
let index = 0;
let pageIndex = 0;

const NUM_SECTIONS = 1;
const NUM_ROWS_PER_SECTION = 10;

export default class Demo extends React.Component {
  constructor(props) {
    super(props);
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

    const dataSource = new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    this.dataBlob = {};
    this.sectionIDs = [];
    this.rowIDs = [];
    this.genData = (pIndex = 0,dataLength) => {
      for (let i = 0; i < NUM_SECTIONS; i++) {
        const ii = (pIndex * NUM_SECTIONS) + i;
        const sectionName = `Section ${ii}`;
        this.sectionIDs.push(sectionName);
        this.dataBlob[sectionName] = sectionName;
        this.rowIDs[ii] = [];

        for (let jj = 0; jj < dataLength; jj++) {
          const rowName = `S${ii}, R${jj}`;
          this.rowIDs[ii].push(rowName);
          this.dataBlob[rowName] = rowName;
        }
      }
      this.sectionIDs = [].concat(this.sectionIDs);
      this.rowIDs = [].concat(this.rowIDs);

      pageIndex++;
    };

    this.state = {
      dataSource: dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
      isLoading: false,
      hasMore:true
    };
  }

  ajaxActData = ( type ) => {

    
    if (this.state.isLoading  || !this.state.hasMore) {
      return;
    }

      this.setState({
        isLoading: true
      });

      let pageData = {
        page_num:pageIndex+1,
        page_size:10
      }


      $.ajax({
        url: AJAX_URL+"/Couponphone/ajaxGetActList"+token,
        type: 'POST',
        dataType: 'json',
        data: pageData,
        timeout: 40000,
        success: (data)=>{
          this.setState({
            isLoading: false
          });
          if(type){
            Toast.hide();
          }
          if( Number(data.status) ){
            
            if( !Number(data.data.actlist.length) ){
              this.setState({
                hasMore:false
              });
              
              return false;
            }

            listData = listData.concat(data.data.actlist);
            if( type ){
              this.genData('',data.data.actlist.length);
            }else{
              this.genData(pageIndex,data.data.actlist.length);
            }
            this.setState({
              dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
            });

          }else{
            errorCallback(data);
          }
        // },1000)
          
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

  componentDidMount() { 
    pageIndex = 0;
    listData = [];
    index = 0;

    Toast.loading('加载中...', 40, () => {
      Toast.loading('加载超时,请重试', 2, () => {
        window.location.reload();
      });
    },false);
    this.ajaxActData('DidMount');
    // this.onEndReached()

  }

  onEndReached = (event) => {
    
    if( pageIndex == 0){
      return;
    }
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading || !this.state.hasMore) {
      return false;
    }


    // if( (pageIndex+1) >= Math.ceil(listData.length/NUM_ROWS_PER_SECTION) ){
    //   this.setState({
    //     isLoading: false,
    //   });
    //   return false;
    // }



      this.ajaxActData();

  }
  render() {
    const separator = (sectionID, rowID) => (
      <div key={`${sectionID}-${rowID}`} style={{
        backgroundColor: '#F5F5F9',
        height: 8,
        borderTop: '1px solid #ECECED',
        borderBottom: '1px solid #ECECED',
      }}
      />
    );
    const row = (rowData, sectionID, rowID) => {
      const obj = listData[index++];
      if( !obj ){
        return;
      }

      const getNum = "已领券:"+obj.total_taken_cnt+"张";
      let actIcon = '';
      if( obj.act_type == '1' ){
        actIcon = xf;
      }else if( obj.act_type == '2' ){
        actIcon = ms;
      }else if( obj.act_type == '3' ){
        actIcon = lx;
      }


      return (
        <div key={rowID} className="row">
        	<Card full>
            <Card.Header
                title={obj.name}
                thumb={actIcon}
                extra={<span style={{fontSize:'.28rem',color:Number(obj.act_state)?'#ff6700':'#666'}}>{Number(obj.act_state)?'进行中':'已结束'}</span>}
              />
              <Card.Body style={{borderTop:'none',padding:0,fontSize:'.28rem'}}>
                  <div style={{textAlign:'left',paddingLeft:'100px'}}>活动时间:{obj.start_time}</div>
              </Card.Body>
            <Card.Footer content={getNum} extra={<div style={{textAlign:'center'}}>已核销:{obj.total_used_cnt}张</div>} />
          </Card>
        </div>
      );
    };
    

    return (<div className="home_list">
      <ListView ref="lv"
        dataSource={this.state.dataSource}
        renderFooter={() => <div style={{ padding: 30, textAlign: 'center' }}>
          {this.state.isLoading ? '加载中...' : '加载完毕'}
        </div>}
        
        renderBodyComponent={() => <MyBody />}
        renderRow={row}
        renderSeparator={separator}
        className="fortest"
        style={{
          height: document.documentElement.clientHeight -100,
          overflow: 'auto'
        }}
        pageSize={10}
        // scrollEventThrottle={150}
        onScroll={() => { }}
        onEndReached={this.onEndReached}
        // onEndReachedThreshold={150}
      />
    </div>);
  }
}