import React from 'react';
import { StyleSheet, Dimensions, ScrollView,View,Button, SafeAreaView, Text, FlatList, Alert,StatusBar,AsyncStorage } from 'react-native';
import { Block, theme } from 'galio-framework';
import MapView,{Marker} from 'react-native-maps';
import { Card } from '../components';
import articles from '../constants/articles';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import axios from 'axios';

const { width } = Dimensions.get('screen');

class Home extends React.Component {
  _isMounted = false;
  constructor(props){
    super(props);
    this.state= {
      location:null,
      lat:-6.121435,
      lng:106.774124,
      geocode:null,
      errorMessage:"",
      //x:null,
      //data:[],
    }
  }
  static navigationOptions = { // remove header on this page
    header: null
}


  componentDidMount(){
    this.getLocationAsync();
  }
  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.BestForNavigation});
    const { latitude , longitude } = location.coords
    this.getGeocodeAsync({latitude, longitude})
    this.setState({ location: {latitude, longitude}});
    this.setState({ lat: latitude});
    this.setState({ lng: longitude});

  };

  changeMarker(){
    let lokasi = this.state.location;
    console.log(lokasi);
    this.props.navigation.navigate('Report', {
     lokasi : lokasi
    });
    //this.props.navigation.navigate('Report',{loc : lokasi } );
  }

  getGeocodeAsync= async (location) => {
    let geocode = await Location.reverseGeocodeAsync(location)
    this.setState({ geocode})
  }
  render(){
    const { navigation } = this.props;
    const {location,data} = this.state;
   
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
        <MapView
        showsMyLocationButton={true}
        showsUserLocation={true}
        region={{
          latitude: this.state.lat,
          longitude: this.state.lng,
          latitudeDelta: 0.012,
          longitudeDelta: 0.0121,
        }}
        style={styles.mapStyle} >
          <Marker draggable
            coordinate={{
              latitude: this.state.lat,
              longitude: this.state.lng,
              latitudeDelta: 0.012,
              longitudeDelta: 0.0121,
            }}
            onDragEnd={(e) => this.setState({ location: e.nativeEvent.coordinate })}
          />
        </MapView>
        <View style={ styles.buttonsContainer }>
          <Button style={styles.BtnStyle} title={ 'Pilih Lokasi Kejadian' } onPress={() => this.changeMarker()} />
          
        </View>
      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height*0.98,
  },
  BtnStyle: {
    width: Dimensions.get('window').width,
  },
  mapViewContainer: { flex: 1 },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16
  },
  home: {
    width: width,    
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },
});

export default Home;
