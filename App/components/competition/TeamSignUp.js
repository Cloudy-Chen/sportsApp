/**
 * Created by dingyiming on 2017/8/1.
 */
import React, {Component} from 'react';
import {
    Dimensions,
    ListView,
    ScrollView,
    Image,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    RefreshControl,
    Animated,
    Easing,
    TextInput,
    InteractionManager
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommIcon from 'react-native-vector-icons/MaterialCommunityIcons';
var {height, width} = Dimensions.get('window');
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper';
import{
    fetchPayment,
    onPaymentUpdate,
} from '../../action/MyProfitActions';

import {
    getAccessToken,
} from '../../action/UserActions';

import CoachDetail from '../course/CoachDetail'

class TeamSignUp extends Component {

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
        }
    }

    navigate2CoachDetail(rowData){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'coachDetail',
                component: CoachDetail,
                params: {
                    coachDetail:rowData
                }
            })
        }
    }


    _onRefresh() {
        this.setState({ isRefreshing: true, fadeAnim: new Animated.Value(0) });
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
        }.bind(this), 2000);
    }

    renderCoach(rowData, sectionId, rowId) {

        var lineStyle = {
            flex: 1, flexDirection: 'row', padding:5, paddingLeft: 0, paddingRight: 0,
            justifyContent: 'flex-start', backgroundColor: 'transparent'
        };

        var row = (
            <TouchableOpacity style={lineStyle} onPress={() => {
                this.navigate2CoachDetail(rowData);
            }}>
                <View style={{width:50,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                    <Image source={require('../../../img/portrait.jpg')} style={{ width: 46, height: 46,borderRadius:23 }}
                           resizeMode="stretch" />
                </View>

                <View style={{flex:5,flexDirection:'column',borderBottomColor:'#eee',borderBottomWidth:1}}>

                    <View style={{flexDirection: 'row', alignItems: 'center', padding: 6, paddingTop: 2}}>
                        <View style={{flex:1,flexDirection:'column'}}>

                                <Text style={{fontSize:15,color:'#222'}}>
                                    邓养吾
                                </Text>
                            {
                                rowData.useType==1?
                                    <Text style={{ fontSize: 14, justifyContent: 'flex-start', fontWeight: 'bold', alignItems: 'flex-start', color: '#222' }}>
                                        群活动
                                    </Text>:
                                    <Text style={{ fontSize: 14, justifyContent: 'flex-start', fontWeight: 'bold', alignItems: 'flex-start', color: '#222' }}>
                                        购物
                                    </Text>
                            }
                        </View>
                     <View style={{flexDirection: 'row', alignItems: 'center', padding: 6, paddingTop: 2}}>

                         {
                             rowData.payType==1?
                                 <Text style={{fontSize:15,color:'#222'}}>
                                     微信：
                                 </Text>:
                                 <Text style={{fontSize:15,color:'#222'}}>
                                     手机：
                                 </Text>
                         }


                         <Text style={{fontSize:15,color:'#f00'}}>
                             {'+'+rowData.payment+'￥'}
                         </Text>

                     </View>


                    </View>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center', padding: 6, paddingTop: 2}}>
                        <View style={{width:90,flexDirection:'row',justifyContent:'flex-start',paddingRight:5}}>
                            {/*<Icon name="" size={14} color="#00f" style={{marginLeft:5}}/>*/}
                            <Text style={{fontSize:12,color:'#222'}}>
                                {rowData.payTimeStr}
                            </Text>
                        </View>
                </View>

                {/*<View style={{flex:1,alignItems:'center',justifyContent:'center',borderBottomColor:'#eee',borderBottomWidth:1}}>*/}
                    {/*<Icon name={'angle-right'} size={30} color="#66CDAA"/>*/}
                {/*</View>*/}


            </TouchableOpacity>
        );

        return row;
    }

    constructor(props) {
        super(props);

        this.state={
            total:0,
            memberLevel:['','体育本科','国家一级运动员','国家二级运动员','国家三级运动员'],
            isRefreshing: false,
            fadeAnim: new Animated.Value(1),
            qunhuodongstate:false,
            huaxiaostate:false
        };
    }


    render()
    {

        var paymentList = null;
        var qunhuodongList=null;
        var huaxiaoList=null;
        var {payments,qunhuodong,huaxiao}=this.props;

        if(payments&&payments.length>0)
        {
            var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
            paymentList = (
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor="#ff0000"
                            title="Loading..."
                            titleColor="#00ff00"
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#ffff00"
                        />

                    }
                >
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(payments)}
                        renderRow={this.renderCoach.bind(this)}
                    />
                </ScrollView>)

        }

        if(qunhuodong&&qunhuodong.length>0)
        {
            var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
            qunhuodongList = (
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor="#ff0000"
                            title="Loading..."
                            titleColor="#00ff00"
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#ffff00"
                        />
                    }
                >
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(qunhuodong)}
                        renderRow={this.renderCoach.bind(this)}
                    />
                </ScrollView>

            )

            //this.setState({qunhuodongstate:false});
        }
        if(huaxiao&&huaxiao.length>0)
        {
            var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
            huaxiaoList = (
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor="#ff0000"
                            title="Loading..."
                            titleColor="#00ff00"
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#ffff00"
                        />
                    }
                >
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(huaxiao)}
                        renderRow={this.renderCoach.bind(this)}
                    />
                </ScrollView>)
           // this.state.huaxiaostate=false;
            //this.setState({huaxiaostate:false});
        }

        return (
            <View style={styles.container}>

                <View style={{height:55,width:width,paddingTop:20,flexDirection:'row',justifyContent:'center',
                    backgroundColor:'#66CDAA',borderBottomWidth:1,borderColor:'#66CDAA'}}>
                    <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems: 'center',}}
                                      onPress={()=>{this.goBack();}}>
                        <Icon name={'angle-left'} size={30} color="#fff"/>
                    </TouchableOpacity>
                    <View style={{flex:3,justifyContent:'center',alignItems: 'center',}}>
                        <Text style={{color:'#fff',fontSize:18}}>我的群</Text>
                    </View>
                    <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems: 'center',}}
                                      onPress={this.showPopover.bind(this, 'menu')}  ref="menu">
                        <Text style={{ fontSize: 15 }}>asd</Text>>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems: 'center',}}
                                      onPress={this.showPopover.bind(this, 'menu')}  ref="menu">
                        <Ionicons name='md-add' size={26} color="#fff"/>
                    </TouchableOpacity>
                </View>


                    <View style={{ flex:1, width: width, backgroundColor: '#66CDAA' }}>
                    <View style={{flexDirection: 'row', alignItems: 'center', padding: 6, paddingTop: 2}}>
                        <View style={{width:250,flexDirection:'row',justifyContent:'flex-start',paddingRight:5}}>
                            <Icon name="" size={14} color="#00f" style={{marginLeft:5}}/>
                            <Text style={{fontSize:12,color:'#222'}}>
                                今日收益总额：
                            </Text>

                            {
                                this.state.qunhuodongstate==false&&this.state.huaxiaostate==false?
                                    <Text style={{fontSize:13,color:'#f00',}}>
                                        {this.props.total+'￥'}
                                    </Text>:
                                <View style={{width:55}}>
                                    {

                                    this.state.qunhuodongstate==true&&this.state.huaxiaostate==false?
                                        <Text style={{fontSize:13,color:'#f00',}}>
                                            {this.props.total1+'￥'}
                                        </Text>:null
                                    }
                                    {

                                        this.state.qunhuodongstate==false&&this.state.huaxiaostate==true?
                                            <Text style={{fontSize:13,color:'#f00',}}>
                                                {this.props.total2+'￥'}
                                            </Text>:null
                                    }
                                </View>
                            }
                            <View style={{width:10}}></View>

                            <View style={{width:250,flexDirection:'row',justifyContent:'flex-start',paddingRight:5,marginLeft:50}}>
                            <Text style={{fontSize:12,color:'#222'}}>筛选:</Text>
                            <TouchableOpacity style={{ flexDirection: 'row',  justifyContent: 'flex-end', alignItems: 'center', }}
                                              onPress={() => {

                                        this.setState({qunhuodongstate:true});


                             }}
                            >
                                <Text style={{ fontSize: 13 }}>群活动</Text>
                                {

                                }
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row',justifyContent: 'flex-end', alignItems: 'center',marginLeft:15}}
                                              onPress={() => {
                                                  this.setState({huaxiaostate:true});


                             }}
                            >
                                <Text style={{ fontSize: 13 }}>花销</Text>
                                {

                                }
                            </TouchableOpacity>

                                <TouchableOpacity style={{ flexDirection: 'row',justifyContent: 'flex-end', alignItems: 'center',marginLeft:15}}
                                                  onPress={() => {
                                                  this.setState({huaxiaostate:false,qunhuodongstate:false});
                             }}
                                >
                                    <Text style={{ fontSize: 13 }}>全部</Text>
                                    {

                                    }
                                </TouchableOpacity>
                            </View>

                        </View>

                    </View>


                    <View style={{ flex:1, width: width, backgroundColor: '#66CDAA' }}>
                        {
                            this.state.qunhuodongstate==false&&this.state.huaxiaostate==false?

                                <Animated.View style={{flex: 1, padding: 4,paddingTop:10,opacity: this.state.fadeAnim,backgroundColor:'#fff' }}>
                                    {paymentList}
                                </Animated.View>:
                                <View style={{ flex:1, width: width, backgroundColor: '#66CDAA' }}>
                            {
                                this.state.qunhuodongstate==true&&this.state.huaxiaostate==false?
                                <Animated.View style={{flex: 1, padding: 4,paddingTop:10,opacity: this.state.fadeAnim,backgroundColor:'#fff' }}>
                                    {qunhuodongList}
                                    {this.state.qunhuodongstate=false}
                                </Animated.View>:null
                            }

                            {
                            this.state.huaxiaostate==true&&this.state.qunhuodongstate==false?
                                <Animated.View style={{flex: 1, padding: 4,paddingTop:10,opacity: this.state.fadeAnim,backgroundColor:'#fff' }}>
                                    {huaxiaoList}
                                    {this.state.huaxiaostate=false}
                                </Animated.View>:null
                            }
                                </View>

                        }

                    </View>
                    </View>


                </View>

        )

    }

    componentDidMount()
    {
        InteractionManager.runAfterInteractions(() => {
            this.props.dispatch(fetchPayment()).then((json)=>{
            })
        });

    }


}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

});


module.exports = connect(state=>({

        username:state.user.username,
        accessToken:state.user.accessToken,
        personInfo:state.user.personInfo,
        coaches:state.coach.coaches,
        payments:state.myprofit.payments,
        total:state.myprofit.total,
        qunhuodong:state.myprofit.qunhuodong,
        total1:state.myprofit.total1,
        huaxiao:state.myprofit.huaxiao,
        total2:state.myprofit.total2

    })
)(TeamSignUp);