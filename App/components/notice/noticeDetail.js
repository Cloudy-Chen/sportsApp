import React,{Component} from 'react';
import {
    Dimensions,
    ListView,
    ScrollView,
    Image,
    View,
    StyleSheet,
    Text,
    Platform,
    TouchableOpacity,
    RefreshControl,
    Animated,
    Easing
} from 'react-native';
import {Toolbar,OPTION_SHOW,OPTION_NEVER,ACTION_ADD} from 'react-native-toolbar-wrapper'
import {
    fetchNotices,disableNoticeMemberOnFresh,enableNoticeMemBerOnFresh
} from '../action/NoticeActions';
import { connect } from 'react-redux';
var {height, width} = Dimensions.get('window');

class NoticeDetail extends Component{


    _onRefresh() {
        this.setState({isRefreshing: true, fadeAnim: new Animated.Value(0)});
        setTimeout(function () {
            this.setState({
                isRefreshing: false,
            });
            Animated.timing(          // Uses easing functions
                this.state.fadeAnim,    // The value to drive
                {
                    toValue: 1,
                    duration: 600,
                    easing: Easing.bounce
                },           // Configuration
            ).start();
        }.bind(this), 500);
        this.props.dispatch(enableNoticeMemberOnFresh());

    }

    fetchData(){
        this.state.doingFetch=true;
        this.state.isRefreshing=true;
        var content=this.rowData.content;
        var noticeId=this.rowData.id;
            this.props.dispatch(fetchNoticeMember()).then((json)=> {
            if(json.re==-100){
                this.props.dispatch(getAccessToken(false));
            }
            this.props.dispatch(disableNoticeMemberOnFresh());
            this.setState({doingFetch:false,isRefreshing:false})
        }).catch((e)=>{
            this.props.dispatch(disableNoticeMemberOnFresh());
            this.setState({doingFetch:false,isRefreshing:false});
            alert(e)
        });
    }


    constructor(props) {
        super(props);
        this.state={
            doingFetch: false,
            isRefreshing: false,
            fadeAnim: new Animated.Value(1)
        }
    }


    renderRow(rowData,sectionId,rowId){
        var row=(
            <View style={{flex:1,backgroundColor:'#fff',marginTop:5,marginBottom:5,borderBottomWidth:1,borderBottomColor:'#aaa'}}>
                <View style={{flex:1,flexDirection:'row',padding:5,borderBottomWidth:1,borderColor:'#ddd',backgroundColor:'transparent',}}>
                    <View style={{flex:1,justifyContent:'center',alignItems: 'center'}}>
                        <Image resizeMode="stretch" style={{height:40,width:40,borderRadius:20}} source={require('../../../img/portrait.jpg')}/>
                    </View>

                    <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems: 'center'}}
                                      onPress={()=>{
                                          this.navigateNoticeMember(rowData,'公开活动');
                                      }}>
                        <Text style={{marginRight:5,color:'#66CDAA'}}>成员</Text>
                        <Icon name={'angle-right'} size={25
                        } color="#66CDAA"/>
                    </TouchableOpacity>
                </View>

                <View style={{flex:3,padding:10}}>

                    <View style={{flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center'}}>
                            <Icon name={'circle'} size={10} color="#aaa"/>
                        </View>
                        <Text style={{flex:7,fontSize:13,color:'#343434',justifyContent:'center',alignItems: 'center'}}>
                            {'消息编号：'+rowData.noticeid}
                        </Text>
                    </View>

                    <View style={{flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center'}}>
                            <Icon name={'circle'} size={10} color="#aaa"/>
                        </View>
                        <Text style={{flex:7,fontSize:13,color:'#343434',justifyContent:'center',alignItems: 'center'}}>
                            {'消息编号：'+rowData.personid}
                        </Text>
                    </View>

                    <View style={{flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center'}}>
                            <Icon name={'circle'} size={10} color="#aaa"/>
                        </View>
                        <Text style={{flex:7,fontSize:13,color:'#343434',justifyContent:'center',alignItems: 'center'}}>
                            {'已阅读：'+rowData.haveSeen}；
                        </Text>
                    </View>

                    <View style={{flexDirection:'row',marginBottom:3}}>
                        <View style={{flex:1,justifyContent:'flex-start',alignItems: 'center'}}>
                            <Icon name={'circle'} size={10} color="#aaa"/>
                        </View>
                        <Text style={{flex:7,fontSize:13,color:'#343434',justifyContent:'center',alignItems: 'center'}}>
                            {'阅览时间：'+rowData.seenTime}；
                        </Text>
                    </View>


                </View>

            </View>
        );
        return row;
    }


    render() {

        var noticeListView=null;
        var {noticeMemberList,noticeMemberFresh}=this.props;
        //var competitionList=this.state.competitionList;
        if(noticeFresh==true)
        {
            if(this.state.doingFetch==false)
                this.fetchData();
        }else{
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if (noticeMemberList !== undefined && noticeMemberList !== null && noticeList.length > 0)
            {
                noticeListView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(noticeMemberList)}
                        renderRow={this.renderRow.bind(this)}
                    />
                );
            }
        }

        return (
            <View style={styles.container}>
                <Toolbar width={width} title="消息列表" actions={[]} navigator={this.props.navigator}>

                    {<View style={{flex:5,backgroundColor:'#eee'}}>
                        <Animated.View style={{opacity: this.state.fadeAnim,height:height-150,paddingTop:5,paddingBottom:5,}}>
                            <ScrollView
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isRefreshing}
                                        onRefresh={this._onRefresh.bind(this)}
                                        tintColor="#9c0c13"
                                        title="刷新..."
                                        titleColor="#9c0c13"
                                        colors={['#ff0000', '#00ff00', '#0000ff']}
                                        progressBackgroundColor="#ffff00"
                                    />
                                }
                            >
                                {noticeListView}
                                {
                                    noticeListView==null?
                                        null:
                                        <View style={{justifyContent:'center',alignItems: 'center',backgroundColor:'#eee',padding:10}}>
                                            <Text style={{color:'#343434',fontSize:13,alignItems: 'center',justifyContent:'center'}}>已经全部加载完毕</Text>
                                        </View>
                                }

                            </ScrollView>

                        </Animated.View>
                    </View>}



                </Toolbar>

            </View>
        );
    }

}

var styles = StyleSheet.create({


});

const mapStateToProps = (state, ownProps) => {

    const props = {

    }
    return props
}

module.exports = connect(state=>({
        accessToken:state.user.accessToken,
        noticeMemberList:state.notice.noticeMemberList,
        noticeMemberFresh:state.notice.noticeMemberFresh,
    })
)(NoticeMember);

