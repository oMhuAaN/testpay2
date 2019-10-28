/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React,{Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableHighlight,
  Alert,
  TextInput,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import * as WeChat from 'react-native-wechat'

class OButton extends Component {
  render() {
      return (
          <TouchableHighlight
              style={{
                backgroundColor:'#549490',
                alignItems:"center",
                justifyContent:"center",
                height:40,
                borderRadius:10,
                margin:10,
              }}
              underlayColor="#a5a5a5"
              onPress={this.props.onPress}>
              <Text style={{
                color:'#FFFFFF'
              }}>{this.props.text}</Text>
          </TouchableHighlight>
      );
  }
}

class ShouYe extends Component {
  state={
    url1:'cxcx.mynatapp.cc/test/testCreateOrder',
    appid:'wx604ebb6e95cc63ed',
    partnerId:'partnerid',
    prepayId:'prepayid',
    nonceStr:'noncestr',
    timeStamp:'timestamp',
    package:'package',
    sign:'sign',
    appId:'appid',
  }
  inputChange(key,value) {
    this.setState({
      [key]:value,
    })
  }
  // 微信支付函数
  payFun = async function(responseJson){
    try {
      let result = await WeChat.pay({
        partnerId: responseJson[this.state.partnerId],  // 商家向财付通申请的商家id
        prepayId: responseJson[this.state.prepayId],   // 预支付订单
        nonceStr: responseJson[this.state.nonceStr],   // 随机串，防重发
        timeStamp: responseJson[this.state.timeStamp],  // 时间戳，防重发
        package: responseJson[this.state.package],    // 商家根据财付通文档填写的数据和签名
        sign: responseJson[this.state.sign], // 商家根据微信开放平台文档对数据做的签名
        appId: responseJson[this.state.appId]
      });
      Alert.alert('支付成功了')
      console.log('支付成功了',result)
    } catch (e) {
      if (e instanceof WeChat.WechatError) {
        console.error(e.stack);
      } else {
        throw e;
      }
      Alert.alert('支付失败了')
      console.log('支付失败了', e)
    }
  }
  // 调起微信支付
  toPay = async function () {
    Alert.alert('支付是否成功')
    fetch(`https://${this.state.url1}`, {
      method: 'GET',//如果为GET方式，则不要添加body，否则会出错    GET/POST
      header: {//请求头
      },
      // body:{//请求参数
      //     'key1':'value1',
      //     'key2':'value2'
      // }
    })
      .then((response) => response.json())//将数据转成json,也可以转成 response.text、response.html
      .then((responseJson) => {//获取转化后的数据responseJson、responseText、responseHtml
        // Alert.alert(JSON.stringify(responseJson));
        console.log(responseJson);
        // 检查参数
        if (!responseJson.partnerid) {
          Alert.alert('缺少partnerid参数,注意大小写')
          return
        }
        if (!responseJson.prepayid) {
          Alert.alert('缺少prepayid参数,注意大小写')
          return
        }
        if (!responseJson.noncestr) {
          Alert.alert('缺少noncestr,注意大小写')
          return
        }
        if (!responseJson.timestamp) {
          Alert.alert('缺少timestamp,注意大小写')
          return
        }
        if (!responseJson.package) {
          Alert.alert('缺少package,注意大小写')
          return
        }
        if (!responseJson.appid) {
          Alert.alert('缺少appid,注意大小写')
          return
        }
        console.log(responseJson);
        WeChat.isWXAppInstalled()
          .then((isInstalled) => {
            if (isInstalled) {
              this.payFun(responseJson)
            } else {
              Alert.alert('请安装微信');
            }
          });
      })
      .catch((error) => {
        // Alert.alert(error.message);
        Alert.alert('链接错误');
        // console.log(error);
      })
  }
  render() {
    WeChat.registerApp(this.state.appid);
    return (
      <View>
        <View style={{ margin: 20 }}>
          <Text style={{
            fontSize:20,
            alignSelf:'center',
          }}>
            微信接口测试
                    </Text>

          <View style={{
            borderWidth: 1,
            borderColor: '#703033',
          }}>
            <Text style={{
              fontSize: 20,
            }}>当前参数：</Text>
            <Text> appid:</Text>
            <TextInput
              editable={false}
              value={this.state.appid}
              onChangeText={(text) => this.inputChange('appid', text)}
              style={{
                backgroundColor: '#aaaaaa',
                borderWidth: 1,
                borderRadius: 10,
                margin: 10,
              }}
            ></TextInput>

            
            
          </View>

          <OButton text='微信好友分享的文本'
            onPress={() => {
              WeChat.isWXAppInstalled()
                .then((isInstalled) => {
                  if (isInstalled) {
                    WeChat.shareToSession({ type: 'text', description: '测试微信好友分享的文本内容' })
                      .then((result)=>{
                        console.log('返回结果',result)
                        Alert.alert('分享成功');
                        // Toast.success('分享成功');
                      })
                      .catch((error) => {
                        Alert.alert(error.message);
                        console.log('catch到错误', error);
                        // Toast.success('catch到错误');
                      });
                  } else {
                    Alert.alert('请安装微信');
                  }
                });
            }}
          />
          <OButton text='微信好友分享链接'
            onPress={() => {
              WeChat.isWXAppInstalled()
                .then((isInstalled) => {
                  if (isInstalled) {
                    WeChat.shareToSession({
                      title: '微信好友测试的链接',
                      description: '分享的标题内容',
                      thumbImage: '分享的标题图片',
                      type: 'news',
                      webpageUrl: '分享的链接'
                    })
                      .catch((error) => {
                        Alert.alert(error.message);
                      });
                  } else {
                    Alert.alert('请安装微信');
                  }
                });
            }}
          />
          <OButton text='微信朋友圈分享的文本'
            onPress={() => {
              WeChat.isWXAppInstalled()
                .then((isInstalled) => {
                  if (isInstalled) {
                    WeChat.shareToTimeline({ type: 'text', description: '测试微信朋友圈分享的文本内容' })
                      .catch((error) => {
                        Alert.alert(error.message);
                      });
                  } else {
                    Alert.alert('请安装微信');
                  }
                });
            }}
          />
          <OButton text='微信朋友圈分享的链接'
            onPress={() => {
              WeChat.isWXAppInstalled()
                .then((isInstalled) => {
                  if (isInstalled) {
                    WeChat.shareToTimeline({
                      title: '分享的标题',
                      description: '分享的标题内容',
                      thumbImage: '分享的标题图片',
                      type: 'news',
                      webpageUrl: '分享的链接'
                    })
                      .catch((error) => {
                        Alert.alert(error.message);
                      });
                  } else {
                    Alert.alert('请安装微信');
                  }
                });
            }}
          />
          <View style={{
            borderWidth:1,
            borderColor:'#703033',
          }}>
            <Text style={{
              fontSize:20,
            }}>支付接口测试：</Text>
            <Text>要调取的后台链接:(不要加https://)</Text>
            <TextInput 
              value={this.state.url1}
              onChangeText={(text) => this.inputChange('url1',text)}
              style={{
                backgroundColor:'#aaaaaa',
                borderWidth:1,
                borderRadius:10,
                margin:10,
              }}
            ></TextInput>

            <Text>partnerId变量名:</Text>
            <TextInput
              // editable={false}
              value={this.state.partnerId}
              onChangeText={(text) => this.inputChange('partnerId', text)}
              style={{
                backgroundColor: '#aaaaaa',
                borderWidth: 1,
                borderRadius: 10,
                margin: 10,
              }}
            ></TextInput>

            <Text>prepayId变量名:</Text>
            <TextInput
              // editable={false}
              value={this.state.prepayId}
              onChangeText={(text) => this.inputChange('prepayId', text)}
              style={{
                backgroundColor: '#aaaaaa',
                borderWidth: 1,
                borderRadius: 10,
                margin: 10,
              }}
            ></TextInput>

            <Text>nonceStr变量名:</Text>
            <TextInput
              // editable={false}
              value={this.state.nonceStr}
              onChangeText={(text) => this.inputChange('nonceStr', text)}
              style={{
                backgroundColor: '#aaaaaa',
                borderWidth: 1,
                borderRadius: 10,
                margin: 10,
              }}
            ></TextInput>

            <Text>timeStamp变量名:</Text>
            <TextInput
              // editable={false}
              value={this.state.timeStamp}
              onChangeText={(text) => this.inputChange('timeStamp', text)}
              style={{
                backgroundColor: '#aaaaaa',
                borderWidth: 1,
                borderRadius: 10,
                margin: 10,
              }}
            ></TextInput>

            <Text>package变量名:</Text>
            <TextInput
              // editable={false}
              value={this.state.package}
              onChangeText={(text) => this.inputChange('package', text)}
              style={{
                backgroundColor: '#aaaaaa',
                borderWidth: 1,
                borderRadius: 10,
                margin: 10,
              }}
            ></TextInput>

            <Text>sign变量名:</Text>
            <TextInput
              // editable={false}
              value={this.state.sign}
              onChangeText={(text) => this.inputChange('sign', text)}
              style={{
                backgroundColor: '#aaaaaa',
                borderWidth: 1,
                borderRadius: 10,
                margin: 10,
              }}
            ></TextInput>

            <Text>appId变量名:</Text>
            <TextInput
              // editable={false}
              value={this.state.appId}
              onChangeText={(text) => this.inputChange('appId', text)}
              style={{
                backgroundColor: '#aaaaaa',
                borderWidth: 1,
                borderRadius: 10,
                margin: 10,
              }}
            ></TextInput>

            <OButton text='微信支付'
              onPress={() =>this.toPay()}
            />
          </View>
          
        </View>
      </View>
    )
  }
}


const App: () => React$Node = () => {
  return (
    <>
      
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <ShouYe/>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
