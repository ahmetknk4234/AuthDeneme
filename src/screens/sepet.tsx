import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const Sepetim = () => {
  const [Sepet, setSepet] = useState<any[]>([]);
  const [Pizza, setPizza] = useState<any[]>([]);
  const uid = auth().currentUser?.uid;
  const images: any = {
    görsel: require('../img/pizza.png'),
  };

  useEffect(() => {
    if (!uid) return;

    const unsubscribe = firestore()
      .collection('sepet')
      .where('userId', '==', uid)
      .onSnapshot((querySnapshot) => {
        const docs: any[] = [];
        querySnapshot.forEach((doc) => docs.push({ id: doc.id, ...doc.data() }));
        setSepet(docs);
      });

    const fetchPizzas = async () => {
      const pizzaPromises = Sepet.map(async (c) => {
        const pizzaDoc = await firestore().collection("pizza").doc(c.pizzaId).get();
        return { id: pizzaDoc.id, ...pizzaDoc.data() };
      });

      const pizzas = await Promise.all(pizzaPromises);
      setPizza(pizzas);
    };

    fetchPizzas();
    return () => unsubscribe();
  }, [Sepet]);

  const handleDelete = async (pizzaId: string) => {
    if (!uid) return;

    const querySnapshot = await firestore()
      .collection('sepet')
      .where('userId', '==', uid)
      .where('pizzaId', '==', pizzaId)
      .get();

    querySnapshot.forEach(async (doc) => {
      await firestore().collection('sepet').doc(doc.id).delete();
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {Pizza.length === 0 ? (
          <Text style={styles.emptyText}>Sepetiniz boş</Text>
        ) : (
          Pizza.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image style={styles.icon} source={images[item.path]} />
              <View style={styles.menu}>
                <Text style={styles.itemTitle}>{item.ad}</Text>
                <Text style={styles.itemPrice}>{item.fiyat} TL</Text>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.buttonText}>Kaldır</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 50,
    color: 'gray',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'floralwhite',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  menu: {
    flex: 1,
    marginLeft: 12,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'darkred',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
  button: {
    backgroundColor: 'midnightblue',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default Sepetim;
