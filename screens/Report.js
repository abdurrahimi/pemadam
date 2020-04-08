import * as React from 'react';
import { TextInput, StyleSheet, View, Alert, Dimensions,Image, AsyncStorage } from 'react-native';
import { Block,  Text, theme } from "galio-framework";
import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Loader from 'react-native-modal-loader';
import { TouchableOpacity } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get("screen");

export default class Report extends React.Component {
  state = {
    image: "https://www.tibs.org.tw/images/default.jpg",
    isLoading: false,
    nama: "",
    detail: [""],
    lokasi: null,
    userid:null,
  };

  static navigationOptions = { // remove header on this page
    header: null
  }


  render() {
    let { image } = this.state;
    const { navigation } = this.props;
    return (

      <View style={{ marginTop: height * 0.1, flex: 1, alignItems: 'center' }}>
        <Loader size="large" loading={this.state.isLoading} color="#ff66be" />
        <Block width={width * 0.8} style={{ marginBottom: 55 }}>
          <Text bold size={24} color={argonTheme.COLORS.BLACK}>
            FORM SUBMIT LAPORAN
                        </Text>
        </Block>
        <Block width={width * 0.8} style={{ marginBottom: 15 }}>
        <Text style={{marginBottom:0}}>Nama Pelapor</Text>
          <Input
            placeholder="Nama Pelapor"
            onChangeText={this.onNameChange}
            autoCapitalize='none'
            style={styles.textInput}
            iconContent={
              <Icon
                size={0}
              />
            }
          />
        </Block>
        <TouchableOpacity onPress={()=>this.onPressPickLocation()}>
        <Block width={width * 0.8}>
        
    <Block middle style={styles.notify} />
        <Text style={{marginBottom:5}}>Lokasi Kejadian</Text>
          <Text style={{padding:25, borderRadius:5, backgroundColor: argonTheme.COLORS.WHITE }}>{this.state.detail[0]}</Text>
        </Block>
        </TouchableOpacity>
        <Block style={{ marginBottom: 15, marginTop: 25 }}>
        <Text style={{textAlign:'center',marginBottom:15}}>Foto Kejadian</Text>
        {image &&
          <TouchableOpacity onPress={() => this._pickImage()}>
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
          </TouchableOpacity> }
        </Block>
        <Block style={{  marginBottom: 15, marginTop: 25 }}>
          <Button
            
            onPress={() => this.doReportKebakaran()}
            style={styles.createButton}
          >
            <Text bold size={14} color={argonTheme.COLORS.WHITE}>
              Kirim Laporan
            </Text>
          </Button>
        </Block>
      </View>
    );
  }

  onPressPickLocation() {
    const { navigation } = this.props;
    navigation.navigate("Home");
  }

  onNameChange = nama => {
    this.setState({ nama });
  };

  componentDidMount() {
    AsyncStorage.getItem('userID', (err, value) => {
      if (err) {
          console.log(err)
      } else {
          this.setState({userid:JSON.parse(value)}); // boolean false
      }
  })
    this.getPermissionAsync();
    //console.log("NAV =>",Location.reverseGeocodeAsync(this.props.route.params.lokasi));
    this._attemptReverseGeocodeAsync();
  }

  UNSAFE_componentWillReceiveProps () {
    this.getPermissionAsync();
    this._attemptReverseGeocodeAsync();
  }

  _attemptReverseGeocodeAsync = async () => {
    this.setState({ inProgress: true });
    try {
      let result = await Location.reverseGeocodeAsync(
        this.props.route.params.lokasi
      );
      //this.setState({ detail:result.street});
      //console.log(result.map((item,key)=>(item.street+" , No. "+item.name+" ,"+item.city+" ,"+item.region+" ,"+item.postalCode)));
      this.setState({ detail: result.map((item, key) => (item.street + " , No. " + item.name + " ," + item.city + " ," + item.region + " ," + item.postalCode)) });
      console.log(this.state.detail);
    } catch (e) {
      // this.setState({ error: e });
      console.log(e);
    } finally {
      //this.setState({ inProgress: false });
    }
  };

  doReportKebakaran = () => {
    let image = this.state.image;
    let loc = this.props.route.params.lokasi;
    //console.log(loc.latitude);
    
    this.setState({ isLoading: true });
    let uploadData = new FormData();
    uploadData.append('file', { type: 'image/jpg', uri: image, name: 'tmp.jpg' });
    uploadData.append('nama', this.state.nama);
    uploadData.append('detail', this.state.detail[0]);
    uploadData.append('latitude',loc.latitude );
    uploadData.append('longitude',loc.longitude );
    uploadData.append('userid',this.state.userid );
    let url = "http://newdemo.aplikasiskripsi.com/fungky_ws/api/services/report";
    fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: uploadData
    }).then(response => {
      response.json().then((res) => {
        this.setState({ isLoading: false });
        console.log(res);
        Alert.alert(JSON.stringify(res.results.msg));
        this.onPressPickLocation();

      })
    }).catch(err => {
      Alert.alert(err);
      this.setState({ isLoading: false });
    })
  }


  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      //this.uploadImageToServer(result.uri);
    }
  };

}
const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center'
  },
  textArea: {
    height: 150,
    justifyContent: "flex-start"
  },
  textInput: {
    //height: 150,
    justifyContent: "flex-start"
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25
  }
});