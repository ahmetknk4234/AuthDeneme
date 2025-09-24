import React,{useState, useEffect} from 'react';
import {
    Image,
  Animated,
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Text,
  Alert,
  useWindowDimensions,
  ScrollView,
  Button
} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const FirstRoute = () => (
  <View style={[styles.container, { backgroundColor: '#ff4081' }]}>
    <Text style={styles.pageText}>Kampanyalar</Text>
  </View>
);

const SecondRoute = () => {

    const [Pizzalar, setPizzalar] = useState<any[]>([]);
    const images: any = {
            görsel: require('../img/pizza.png'),
          };


    const handleEkle = async (pizzaId: string) => {

        const uid = auth().currentUser?.uid;
              if (!uid) return;

        await firestore().collection('sepet').add({

            userId: uid,
            pizzaId: pizzaId,
            });

        Alert.alert("pizza sepete eklendi");
        }

    useEffect(() => {
        const unsubscribe = firestore()
        .collection('pizza')
        .onSnapshot((querySnapshot) => {
            const docs: any[] = [];
            querySnapshot.forEach((doc) => {
                docs.push({id: doc.id, ...doc.data()});
                });
            setPizzalar(docs);
            });
        return () => unsubscribe();
        },[]);

    return(
        <ScrollView>
            {Pizzalar.map((item) =>(
                <View style={[styles.anasayfa]}>
                  <Image style={styles.icon} source={images[item.path]} />
                  <View style={styles.menu}>
                  <Text>{item.ad}</Text>
                  <Text>{item.fiyat} TL</Text>
                  </View>
                  <View style={styles.buton}>
                          <TouchableOpacity
                                      style={styles.button}
                                      onPress={() => handleEkle(item.id)}
                                    >
                                      <Text style={styles.buttonText}>sipariş</Text>
                                    </TouchableOpacity>
                          </View>
                </View>

                ))}
        </ScrollView>


        )
};

const ThirdRoute = () => (
  <View style={[styles.container, { backgroundColor: '#4caf50' }]}>
    <Text style={styles.pageText}>Tavuklar</Text>
  </View>
);

const FourthRoute = () => (
  <View style={[styles.container, { backgroundColor: '#4caf50' }]}>
    <Text style={styles.pageText}>Burgerler</Text>
  </View>
);

const FifthRoute = () => (
  <View style={[styles.container, { backgroundColor: '#4caf50' }]}>
    <Text style={styles.pageText}>Tatlılar</Text>
  </View>
);

export default function MainPage() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Kampanya' },
    { key: 'second', title: 'Pizzalar' },
    { key: 'third', title: 'Tavuklar' },
    { key: 'fourth', title: 'Burgerler' },
    { key: 'fifth', title: 'Tatlılar' },
  ]);

  const renderTabBar = (props: any) => {
    const inputRange = props.navigationState.routes.map((x: any, i: number) => i);

    return (
      <View>
        <ScrollView
          horizontal
          contentContainerStyle={{ flexDirection: 'row' }}
        >
          {props.navigationState.routes.map((route: any, i: number) => {
            const opacity = props.position.interpolate({
              inputRange,
              outputRange: inputRange.map((inputIndex) =>
                inputIndex === i ? 1 : 0.5
              ),
            });

            return (
              <TouchableOpacity
                key={route.key}
                style={styles.tabItem}
                onPress={() => setIndex(i)}
              >
                <Animated.Text style={[styles.tabText, { opacity }]}>
                  {route.title}
                </Animated.Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    fourth: FourthRoute,
    fifth: FifthRoute,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buton: {
      justifyContent: 'center',
      marginRight: '15%',
      },
  button: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'midnightblue',
      borderRadius: 20,
      height: '25%',
      width: '200%',
      },
  buttonText: {
      color: 'white',
      fontWeight: 'bold',
      },
  anasayfa: {
      backgroundColor: 'floralwhite',
      flex: 1,
      flexDirection: 'row',
      maxHeight: 120,
      justifyContent: 'space-between',
      marginTop: 20,
      },
  menu: {
      justifyContent: 'space-evenly',
      },
  icon: {
      backgroundColor: 'darkred',
      borderRadius: 50,
      },
  pageText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  tabItem: {
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  tabText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
});
