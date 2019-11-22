/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
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

import * as WeChat from 'react-native-wechat'

class OButton extends Component {
  render() {
    return (
      <TouchableHighlight
        style={{
          backgroundColor: '#549490',
          alignItems: "center",
          justifyContent: "center",
          height: 40,
          borderRadius: 10,
          margin: 10,
        }}
        underlayColor="#a5a5a5"
        onPress={this.props.onPress}>
        <Text style={{
          color: '#FFFFFF'
        }}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}

class ShouYe extends Component {
  state = {
    url1: 'cxcx.mynatapp.cc/wxpay/createRoomOrder',
    url2: 'cxcx.mynatapp.cc/wxpay/createMeritOrder',
    appid: 'wx604ebb6e95cc63ed',
    partnerId: 'partnerid',
    prepayId: 'prepayid',
    nonceStr: 'noncestr',
    timeStamp: 'timestamp',
    package: 'package',
    sign: 'sign',
    appId: 'appid',
    shareTxt: '我是要分享的文本',
    shareUrl: 'www.baidu.com',
    shareUrlTxt: '这是一个百度的链接',
    shareUrlImg: '没有图片',
    shareUrlTitle: '分享链接的标题',
    shareQuanTxt: '要分享到微信朋友圈的文本内容',
    shareQuanTitle: '分享的标题',
    shareQuanTitleTxt: '分享的标题内容',
    shareQuanImg: '分享的标题图片',
    shareQuanUrl: '分享的url',
    orderNo: '',
    productId: '',
    userNickName: '',
    money: '',
    donateName: '',
    days: '',
    lamps: '',
    prayType: '',
  }
  inputChange(key, value) {
    this.setState({
      [key]: value,
    })
  }
  // 微信支付函数
  payFun = async function (responseJson) {
    try {
      let result = await WeChat.pay({
        partnerId: responseJson.data[this.state.partnerId],  // 商家向财付通申请的商家id
        prepayId: responseJson.data[this.state.prepayId],   // 预支付订单
        nonceStr: responseJson.data[this.state.nonceStr],   // 随机串，防重发
        timeStamp: responseJson.data[this.state.timeStamp],  // 时间戳，防重发
        package: responseJson.data[this.state.package],    // 商家根据财付通文档填写的数据和签名
        sign: responseJson.data[this.state.sign], // 商家根据微信开放平台文档对数据做的签名
        appId: responseJson.data[this.state.appId]
      });
      Alert.alert('支付成功了')
      console.log('支付成功了', result)
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

  // 调起微信支付一
  toPay1 = async function () {
    // Alert.alert('支付是否成功')
    fetch(`https://${this.state.url1}`, {
      method: 'POST',//如果为GET方式，则不要添加body，否则会出错    GET/POST
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'Authorization':'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIxNTk1OTE1MDU1MSIsInNjb3BlIjpbImFsbCIsIndyaXRlIiwicmVhZCJdLCJleHAiOjE1NzQ5NDA2OTgsInVzZXJpZCI6MzEyNCwianRpIjoiZTVlY2Q2NWYtMmFlMi00NTNkLTlhNzEtZGVhMWMzMjQ5NzcwIiwiY2xpZW50X2lkIjoic3VubnkiLCJ1c2VybmFtZSI6IjE1OTU5MTUwNTUxIn0.RNxJdmeji1PuGqnEcGI-T8PXStYSX4ybWIfWPUsWlf0',
      },
      body: `orderNo=${this.state.orderNo}`,
    })
      .then((response) => response.json())//将数据转成json,也可以转成 response.text、response.html
      .then((responseJson) => {//获取转化后的数据responseJson、responseText、responseHtml
        Alert.alert(JSON.stringify(responseJson));
        console.log('接受参数', responseJson);
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

  // 调起微信支付二
  toPay2 = async function () {
    // Alert.alert('支付是否成功')
    fetch(`https://${this.state.url2}`, {
      // credentials: 'include',
      method: 'POST',//如果为GET方式，则不要添加body，否则会出错    GET/POST
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization':'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIxNTk1OTE1MDU1MSIsImF1dGhvciI6IkxlbW8gJiBNb2ppdG8iLCJzY29wZSI6WyJhbGwiLCJ3cml0ZSIsInJlYWQiXSwiZXhwIjoxNTczMDMzNDM2LCJ1c2VyaWQiOjMxMjQsImp0aSI6ImIxYzQ5NGVjLWRjYzgtNDU2NC04MzQ5LTI2NjM3YzAzNGQxMSIsImNsaWVudF9pZCI6InN1bm55IiwidXNlcm5hbWUiOiIxNTk1OTE1MDU1MSJ9.e5X8HHuAzzabgKtwzp7kFBQrS38w3KQb_e-iVMiiaX8',
      }),
      body: JSON.stringify({//请求参数
        productId: parseInt(this.state.productId),
        userNickName: this.state.userNickName,
        money: parseFloat(this.state.money).toFixed(2),
        donateName: this.state.donateName,
        days: parseInt(this.state.days),
        lamps: parseInt(this.state.lamps),
        prayType: parseInt(this.state.prayType),
      }),
    })
      .then((response) => response.json())//将数据转成json,也可以转成 response.text、response.html
      .then((responseJson) => {//获取转化后的数据responseJson、responseText、responseHtml
        Alert.alert(JSON.stringify(responseJson));
        console.log('接受参数', responseJson);
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

  // 输入框
  ShuRu = (title, val, key) => {
    return (
      <>
        <Text>{title}</Text>
        <TextInput
          // editable={false}
          value={val}
          onChangeText={(text) => this.inputChange(key, text)}
          style={{
            backgroundColor: '#aaaaaa',
            borderWidth: 1,
            borderRadius: 10,
            margin: 10,
          }}
        ></TextInput>
      </>
    )
  }

  render() {
    WeChat.registerApp(this.state.appid);
    return (
      <View>
        <View style={{ margin: 20 }}>
          <Text style={{
            fontSize: 20,
            alignSelf: 'center',
          }}>微信接口测试</Text>

          <View style={{
            borderWidth: 1,
            borderColor: '#703033',
            marginTop: 10,
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

          <View style={{
            borderWidth: 1,
            borderColor: '#703033',
            marginTop: 10,
          }}>
            <Text style={{
              fontSize: 20,
            }}>微信支付接口测试一：</Text>
            <Text>要调取的后台链接一:(不要加https://)</Text>
            <TextInput
              value={this.state.url1}
              onChangeText={(text) => this.inputChange('url1', text)}
              style={{
                backgroundColor: '#aaaaaa',
                borderWidth: 1,
                borderRadius: 10,
                margin: 10,
              }}
            ></TextInput>

            {this.ShuRu('请求参数orderNo', this.state.orderNo, 'orderNo')}

            <OButton text='微信支付类型一'
              onPress={() => this.toPay1()}
            />
          </View>

          <View style={{
            borderWidth: 1,
            borderColor: '#703033',
            marginTop: 10,
          }}>
            <Text style={{
              fontSize: 20,
            }}>微信支付接口测试二：</Text>
            <Text>要调取的后台链接二:(不要加https://)</Text>
            <TextInput
              value={this.state.url2}
              onChangeText={(text) => this.inputChange('url2', text)}
              style={{
                backgroundColor: '#aaaaaa',
                borderWidth: 1,
                borderRadius: 10,
                margin: 10,
              }}
            ></TextInput>

            {this.ShuRu('请求参数productId', this.state.productId, 'productId')}
            {this.ShuRu('请求参数userNickName', this.state.userNickName, 'userNickName')}
            {this.ShuRu('请求参数money', this.state.money, 'money')}
            {this.ShuRu('请求参数donateName', this.state.donateName, 'donateName')}
            {this.ShuRu('请求参数days', this.state.days, 'days')}
            {this.ShuRu('请求参数lamps', this.state.lamps, 'lamps')}
            {this.ShuRu('请求参数prayType', this.state.prayType, 'prayType')}

            <OButton text='微信支付类型二'
              onPress={() => this.toPay2()}
            />
          </View>
          <View style={{
            borderWidth: 1,
            borderColor: '#703033',
            marginTop: 10,
          }}>
            <Text style={{
              fontSize: 20,
            }}>分享文本给微信好友接口测试：</Text>

            {this.ShuRu('要分享的文本：', this.state.shareTxt, 'shareTxt')}


            <OButton text='分享文本给微信好友'
              onPress={() => {
                WeChat.isWXAppInstalled()
                  .then((isInstalled) => {
                    if (isInstalled) {
                      WeChat.shareToSession({ type: 'text', description: this.state.shareTxt })
                        .then((result) => {
                          console.log('返回结果', result)
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
          </View>

          <View style={{
            borderWidth: 1,
            borderColor: '#703033',
            marginTop: 10,
          }}>
            <Text style={{
              fontSize: 20,
            }}>分享链接给微信好友接口测试：</Text>
            {this.ShuRu('要分享的链接：', this.state.shareUrl, 'shareUrl')}
            {this.ShuRu('链接的标题内容：', this.state.shareUrlTxt, 'shareUrlTxt')}
            {this.ShuRu('链接的标题图片：', this.state.shareUrlImg, 'shareUrlImg')}
            {this.ShuRu('分享链接的标题：', this.state.shareUrlTitle, 'shareUrlTitle')}

            <OButton text='分享链接给微信好友'
              onPress={() => {
                WeChat.isWXAppInstalled()
                  .then((isInstalled) => {
                    if (isInstalled) {
                      WeChat.shareToSession({
                        title: this.state.shareUrlTitle,
                        description: this.state.shareUrlTxt,
                        thumbImage: this.state.shareUrlImg,
                        type: 'news',
                        webpageUrl: this.state.shareUrl,
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
          </View>

          <View style={{
            borderWidth: 1,
            borderColor: '#703033',
            marginTop: 10,
          }}>
            <Text style={{
              fontSize: 20,
            }}>分享文本到微信朋友圈接口测试：</Text>


            {this.ShuRu('要分享到微信朋友圈的文本内容：', this.state.shareQuanTxt, 'shareQuanTxt')}


            <OButton text='分享文本给微信朋友圈'
              onPress={() => {
                WeChat.isWXAppInstalled()
                  .then((isInstalled) => {
                    if (isInstalled) {
                      WeChat.shareToTimeline({
                        type: 'text',
                        description: this.state.shareQuanTxt,
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
          </View>

          <View style={{
            borderWidth: 1,
            borderColor: '#703033',
            marginTop: 10,
          }}>
            <Text style={{
              fontSize: 20,
            }}>分享文本到微信朋友圈接口测试：</Text>
            {this.ShuRu('分享的标题：', this.state.shareQuanTitle, 'shareQuanTitle')}
            {this.ShuRu('分享的标题内容', this.state.shareQuanTitleTxt, 'shareQuanTitleTxt')}
            {this.ShuRu('分享的标题图片', this.state.shareQuanImg, 'shareQuanImg')}
            {this.ShuRu('分享的Url', this.state.shareQuanUrl, 'shareQuanUrl')}

            <OButton text='分享链接到微信朋友圈'
              onPress={() => {
                WeChat.isWXAppInstalled()
                  .then((isInstalled) => {
                    if (isInstalled) {
                      WeChat.shareToTimeline({
                        title: this.state.shareQuanTitle,
                        description: this.state.shareQuanTitleTxt,
                        thumbImage: this.state.shareQuanImg,
                        type: 'news',
                        webpageUrl: this.state.shareQuanUrl
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
          <ShouYe />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#fafafa',
  },
  body: {
    backgroundColor: '#fff',
  },
});

export default App;
