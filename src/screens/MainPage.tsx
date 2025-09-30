import React, { useState, useEffect } from 'react';
import {
  Image,
  Animated,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
  useWindowDimensions,
  ScrollView,
  Modal,
  Button,
  Dimensions
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
  const [showModal, setShowModal] = useState(false);
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
          docs.push({ id: doc.id, ...doc.data() });
        });
        setPizzalar(docs);
      });
    return () => unsubscribe();
  }, []);

  return (

    <ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <ScrollView>
          <View style={styles.modalContainer}>
            <View style={styles.sideMenu}>
              <Text style={styles.filterTitle}>Filtreler</Text>

              {/* Kategori Seçimi */}
              <Text style={styles.filterLabel}>Kategori</Text>
              <TouchableOpacity style={styles.filterOption}>
                <Text>Pizza</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterOption}>
                <Text>Burger</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterOption}>
                <Text>Tavuk</Text>
              </TouchableOpacity>

              {/* Fiyat Aralığı */}
              <Text style={styles.filterLabel}>Fiyat</Text>
              <TouchableOpacity style={styles.filterOption}>
                <Text>0 - 50 TL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterOption}>
                <Text>50 - 100 TL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterOption}>
                <Text>100+ TL</Text>
              </TouchableOpacity>

              {/* Sıralama */}
              <Text style={styles.filterLabel}>Sıralama</Text>
              <TouchableOpacity style={styles.filterOption}>
                <Text>En Yeni</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterOption}>
                <Text>En Ucuz</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterOption}>
                <Text>En Pahalı</Text>
              </TouchableOpacity>

              {/* Kapat Butonu */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.closeButtonText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>


      <Button title="buton" onPress={() => setShowModal(true)} />
      {Pizzalar.map((item) => (
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
  const routes = [
    { key: 'first', title: 'Kampanya' },
    { key: 'second', title: 'Pizzalar' },
    { key: 'third', title: 'Tavuklar' },
    { key: 'fourth', title: 'Burgerler' },
    { key: 'fifth', title: 'Tatlılar' },
  ];


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

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  filterLabel: {
    marginTop: 16,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "600",
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#f5f5f5",
    marginBottom: 8,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: "midnightblue",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "rgba(0,0,0,0.3)", // arka plan saydam
  },
  sideMenu: {
    width: width / 2, // 📌 ekranın yarısı
    height: "100%",
    backgroundColor: "white",
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
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
