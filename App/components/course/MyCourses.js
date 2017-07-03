
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

import { connect } from 'react-redux';
var {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import {Toolbar,OPTION_SHOW,OPTION_NEVER} from 'react-native-toolbar-wrapper'
var Popover = require('react-native-popover');

import {
    fetchMyCourses,
    disableMyCoursesOnFresh,
    onMyCoursesUpdate
} from '../../action/CourseActions';

import {
    makeTabsHidden,
    makeTabsShown
} from '../../action/TabActions';

class MyCourses extends Component{

    goBack(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
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
        }.bind(this), 500);

        this.props.dispatch(enableMyGroupOnFresh());

    }

    showPopover(ref){
        this.refs[ref].measure((ox, oy, width, height, px, py) => {
            this.setState({
                menuVisible: true,
                buttonRect: {x: px+5, y: py+10, width: 200, height: height}
            });
        });
    }

    closePopover(){
        this.setState({menuVisible: false});
    }

    setMyGroupList(){
        this.props.dispatch(enableMyGroupOnFresh());
    }

    navigate2CreateGroup(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'create_group',
                component: CreateGroup,
                params: {
                    setMyGroupList:this.setMyGroupList.bind(this),
                }
            })
        }
    }

    navigate2AllGroup(){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'all_group',
                component: AllGroup,
                params: {
                    setMyGroupList:this.setMyGroupList.bind(this),
                }
            })
        }
    }



    renderRow(rowData,sectionId,rowId){

        var row=(
            <TouchableOpacity style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ddd', marginTop: 4 }}
                              onPress={()=>{
                              alert('press')

                }}
                              onLongPress={()=>{
                                this.props.dispatch(makeTabsHidden());
                               Animated.timing(this.state.detailPosition, {
                                    toValue: 1, // 目标值
                                    duration: 200, // 动画时间
                                    easing: Easing.linear // 缓动函数
                                }).start();
                               this.setState({title:'已选择',goBackIcon:'md-close'})
                              }}
            >
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start' }}>
                    <View style={{ padding: 4, paddingHorizontal: 12 ,flexDirection:'row',}}>

                        <View style={{padding:4,flex:1,alignItems:'center',flexDirection:'row'}}>
                            <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 15 }}>
                                {rowData.classInfo.className}
                            </Text>
                        </View>


                        <View style={{padding:4,marginLeft:10,flexDirection:'row',alignItems:'center'}}>
                            <CommIcon name="account-check" size={24} color="#0adc5e" style={{backgroundColor:'transparent',}}/>
                            <Text style={{ color: '#444', fontWeight: 'bold', fontSize: 13,paddingTop:-2 }}>
                                {rowData.classInfo.creator.perName}
                            </Text>
                        </View>
                    </View>

                    <View style={{ padding: 3, paddingHorizontal: 12 }}>
                        <Text style={{ color: '#444', fontSize: 13 }}>
                            {rowData.classInfo.detail}
                        </Text>
                    </View>

                    <View style={{ paddingTop: 12, paddingBottom: 4, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#f00', fontSize: 12, width: 50 }}>
                            ￥{rowData.classInfo.cost}
                        </Text>

                        <View style={{ backgroundColor: '#66CDAA', borderRadius: 6, padding: 4, paddingHorizontal: 6, marginLeft: 10 }}>
                            <Text style={{ color: '#fff', fontSize: 12 }}>
                                {rowData.classInfo.classCount}课次
                            </Text>
                        </View>

                        <View style={{ backgroundColor: '#ff4730', borderRadius: 6, padding: 4, paddingHorizontal: 6, marginLeft: 10 }}>
                            <Text style={{ color: '#fff', fontSize: 12 }}>
                                {rowData.classInfo.venue.name}
                            </Text>
                        </View>


                    </View>
                </View>

                <View style={{ width: 70, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Icon name={'angle-right'} size={34} color="#444" style={{ backgroundColor: 'transparent', marginTop: -10 }} />
                </View>
            </TouchableOpacity>
        );
        return row;
    }

    fetchData(){
        this.state.doingFetch=true;
        this.state.isRefreshing=true;
        this.props.dispatch(fetchMyCourses()).then((json)=> {
            if(json.re==1){
                this.props.dispatch(onMyCoursesUpdate(json.data))
                this.props.dispatch(disableMyCoursesOnFresh())

                this.setState({doingFetch:false,isRefreshing:false})
            }else{
                this.props.dispatch(disableMyCoursesOnFresh())
                this.setState({doingFetch:false,isRefreshing:false})
            }
        }).catch((e)=>{
            this.props.dispatch(disableMyCoursesOnFresh())
            this.setState({doingFetch:false,isRefreshing:false});
            alert(e)
        });
    }

    constructor(props) {
        super(props);
        this.state= {
            doingFetch: false,
            isRefreshing: false,
            fadeAnim: new Animated.Value(1),
            detailPosition: new Animated.Value(0),
            title: '已报名课程',
        }

    }

    render() {

        var displayArea = {x:5, y:10, width:width-20, height: height - 10};

        var myCoursesListView=null;
        var {myCourses,myCoursesOnFresh}=this.props;
        var {title,goBackIcon}=this.state

        if(myCoursesOnFresh==true&&(myCourses==undefined||myCourses==null))
        {
            if(this.state.doingFetch==false)
                this.fetchData();
        }else {
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            if (myCourses && myCourses.length > 0) {
                myCoursesListView = (
                    <ListView
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(myCourses)}
                        renderRow={this.renderRow.bind(this)}
                    />
                );
            }
        }



        return (
            <View style={{flex:1, backgroundColor:'#eee',}}>

                <Toolbar width={width} title={title} cancelIcon={goBackIcon} navigator={this.props.navigator}
                         actions={[{value:'取消报名',show:OPTION_NEVER}]}
                         onPress={(i)=>{
                             if(i==0)
                             {

                             }
                        }}
                        onCancel={
                            ()=>{
                                 Animated.timing(this.state.detailPosition, {
                                    toValue: 0, // 目标值
                                    duration: 200, // 动画时间
                                    easing: Easing.linear // 缓动函数
                                }).start();
                                    this.setState({goBackIcon:null,title:'已报名课程'})
                                    setTimeout(()=>{
                                        this.props.dispatch(makeTabsShown());
                                    },200)

                            }}
                >


                    <Animated.View style={{opacity: this.state.fadeAnim,height:height-150,borderTopWidth:1,borderColor:'#eee'}}>
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
                            {
                                myCoursesListView==null?
                                    this.state.doingFetch==true?
                                        <View style={{justifyContent:'center',alignItems: 'center',marginTop:20}}>
                                            <Text style={{color:'#343434'}}>正在拉取已报名的课程</Text>
                                        </View>:
                                        <View style={{justifyContent:'center',alignItems: 'center',marginTop:20}}>
                                            <Text style={{color:'#343434'}}>尚未有报名参加的课程</Text>
                                        </View> :null
                            }

                            {myCoursesListView}

                        </ScrollView>
                    </Animated.View>



                    {/*popover part*/}
                    <Popover
                        isVisible={this.state.menuVisible}
                        fromRect={this.state.buttonRect}
                        displayArea={displayArea}
                        onClose={()=>{this.closePopover()
                        }}
                        style={{backgroundColor:'transparent'}}
                        placement="bottom"
                    >

                        <TouchableOpacity style={[styles.popoverContent,{borderBottomWidth:1,borderBottomColor:'#ddd',flexDirection:'row',justifyContent:'flex-start'}]}
                                          onPress={()=>{
                                              this.closePopover();
                                              setTimeout(()=>{
                                                   this.navigate2AllGroup();
                                              },300);

                                          }}>
                            <Ionicons name='md-person-add' size={20} color="#343434"/>
                            <Text style={[styles.popoverText]}>添加群</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.popoverContent,{borderBottomWidth:1,borderBottomColor:'#ddd',flexDirection:'row'}]}
                                          onPress={()=>{
                                              this.closePopover();
                                                 setTimeout(()=>{
                                                  this.navigate2CreateGroup();
                                              },300);
                                          }}>
                            <Ionicons name='md-add' size={20} color="#343434"/>
                            <Text style={[styles.popoverText]}>创建新群</Text>
                        </TouchableOpacity>

                    </Popover>




                </Toolbar>


                <Animated.View style={[{flexDirection:'row',width:width,height:45,justifyContent:'center',
                                backgroundColor:'#ddd',borderTopWidth:1,borderColor:'#ccc'},
                                {top:this.state.detailPosition.interpolate({
                                    inputRange: [0,1],
                                    outputRange: [45, 0]
                                })}]}>
                    <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                        <Ionicons name='ios-trash' size={28} color="#555"/>
                        <Text style={{color:'#555',fontSize:11,fontWeight:'bold'}}>删除</Text>
                    </View>
                </Animated.View>

            </View>
        );
    }

}

var styles = StyleSheet.create({
    popoverContent: {
        width: 90,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText:{
        color:'#444',
        marginLeft:14,
        fontWeight:'bold'
    },

});

module.exports = connect(state=>({
        myCourses:state.course.myCourses,
        myCoursesOnFresh:state.course.myCoursesOnFresh
    })
)(MyCourses);