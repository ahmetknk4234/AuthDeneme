import React, { useState, useEffect, useContext } from 'react';
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
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { UserContext } from '../context/userContext';

const Profile = () => {
  const { user, updateUser } = useContext(UserContext);

  const [AdSoyad, setAdSoyad] = useState(user.name);
  const [Mail, setMail] = useState(user.email);
  const [Number, setNumber] = useState(user.number);
  const [Address, setAddress] = useState(user.address);

  const uid = auth().currentUser?.uid;

  // İlk açılışta Firestore'dan oku
  useEffect(() => {
    if (!uid) return;

    const unsubscribe = firestore()
      .collection('users')
      .doc(uid)
      .onSnapshot(doc => {
        if (doc.exists) {
          const data = doc.data();
          if (data) {
            const updatedUser = {
              name: data.adsoyad || '',
              email: data.email || '',
              number: data.numara || '',
              address: data.adres || '',
            };

            // hem state'e hem context'e set et
            setAdSoyad(updatedUser.name);
            setMail(updatedUser.email);
            setNumber(updatedUser.number);
            setAddress(updatedUser.address);

            updateUser(updatedUser);
          }
        }
      });

    return () => unsubscribe();
  }, [uid]);

  // Firestore + Context güncelleme
  const handleGuncelle = async () => {
    if (!uid) return;

    try {
      await firestore().collection('users').doc(uid).update({
        adsoyad: AdSoyad,
        email: Mail,
        numara: Number,
        adres: Address,
      });

      // Context'i de güncelle
      updateUser({
        name: AdSoyad,
        email: Mail,
        number: Number,
        address: Address,
      });

      Alert.alert('Kullanıcı bilgileri güncellendi!');
    } catch (error) {
      console.error(error);
      Alert.alert('Güncelleme hatası!', String(error));
    }
  };

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

          <TouchableOpacity style={styles.button1} onPress={handleGuncelle}>
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
    justifyContent: 'center',
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
