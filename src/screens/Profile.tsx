import React, {useState, useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";


const Profile = () => {
  const [AdSoyad, setAdSoyad] = useState('');
  const [Mail, setMail] = useState('');
  const [Number, setNumber] = useState('');
  const [Address, setAddress] = useState('');

  useEffect(() => {
      const uid = auth().currentUser?.uid;
      if (!uid) return;

      const unsubscribe = firestore()
        .collection("users")
        .doc(uid)
        .onSnapshot((doc) => {
          setMail(doc.data().email);
          setAddress(doc.data().adres);
          setNumber(doc.data().numara);
          setAdSoyad(doc.data().adsoyad);
        });

      return unsubscribe;
    }, []);

  const handleGuncelle = () => {
        const uid = auth().currentUser?.uid;
              if (!uid) return;

              const unsubscribe = firestore()
                .collection("users")
                .doc(uid)
                .update({
                    adsoyad: AdSoyad,
                    email: Mail,
                    numara: Number,
                    adres: Address,
                    })

        Alert.alert("Kullanıcı bilgileri güncellendi!");
      }


  return (
    <SafeAreaView style={styles.anaekran}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <View style={styles.menu}>
          <Text style={styles.title}>Profilim</Text>

          <Image style={styles.icon} source={require('../img/pizza.png')} />

          <TextInput
            style={styles.input}
            placeholder="Ad Soyad"
            placeholderTextColor="black"
            onChangeText={setAdSoyad}
            value={AdSoyad}
          />

          <TextInput
            style={styles.input}
            placeholder="E-Posta"
            placeholderTextColor="black"
            onChangeText={setMail}
            value={Mail}
          />

          <TextInput
            style={styles.input}
            placeholder="Telefon Numarası"
            placeholderTextColor="black"
            onChangeText={setNumber}
            value={Number}
          />

          <TextInput
            style={styles.input}
            placeholder="Adres Bilgilerim"
            placeholderTextColor="black"
            onChangeText={setAddress}
            value={Address}
          />

          <TouchableOpacity
            style={styles.button1}
            onPress={handleGuncelle}
          >
            <Text style={styles.buttonText}>Güncelle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button2}
            onPress={() => Alert.alert('Ayarlar butonuna basıldı')}
          >
            <Text style={styles.buttonText}>Ayarlar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  anaekran: {
    backgroundColor: 'white',
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center', // dikey ortalama
    alignItems: 'center',
    paddingVertical: 20,
  },
  menu: {
    borderRadius: 20,
    backgroundColor: 'azure',
    width: '90%',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  icon: {
    backgroundColor: 'white',
    borderRadius: 50,
    borderWidth: 2,
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  input: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    borderWidth: 2,
    paddingHorizontal: 10,
  },
  button1: {
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
    backgroundColor: 'midnightblue',
    height: 50,
    justifyContent: 'center',
  },
  button2: {
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
    backgroundColor: 'darkgray',
    height: 50,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Profile;