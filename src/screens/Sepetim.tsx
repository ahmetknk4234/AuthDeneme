import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import notifee, { TriggerType, TimestampTrigger, RepeatFrequency } from '@notifee/react-native';
import { UserContext } from '../context/userContext';

const Sepetim = () => {
  const [Sepet, setSepet] = useState<any[]>([]);
  const [Pizza, setPizza] = useState<any[]>([]);
  const { user } = useContext(UserContext);
  const uid = auth().currentUser?.uid;

  const images: any = {
    görsel: require("../img/pizza.png"),
  };

  useEffect(() => {
    if (!uid) return;

    // ✅ Kullanıcının sepetini dinle
    const unsubscribe = firestore()
      .collection("sepet")
      .where("userId", "==", uid)
      .onSnapshot(async (querySnapshot) => {
        const docs: any[] = [];
        const pizzaIds: string[] = [];

        querySnapshot.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() };
          docs.push(data);
          pizzaIds.push(data.pizzaId); // sadece pizzaId'leri al
        });

        setSepet(docs);

        // ✅ Pizza bilgilerini topluca çek
        if (pizzaIds.length > 0) {
          const snapshot = await firestore()
            .collection("pizza")
            .where(
              firestore.FieldPath.documentId(),
              "in",
              pizzaIds
            )
            .get();

          const pizzas = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setPizza(pizzas);
        } else {
          setPizza([]);
        }
      });

    return () => unsubscribe();
  }, [uid]);

  // ✅ Sepetten ürün kaldırma
  const handleDelete = async (pizzaId: string) => {
    if (!uid) return;

    const querySnapshot = await firestore()
      .collection("sepet")
      .where("userId", "==", uid)
      .where("pizzaId", "==", pizzaId)
      .get();

    querySnapshot.forEach(async (doc) => {
      await firestore().collection("sepet").doc(doc.id).delete();
    });

    await notifee.requestPermission();//bildirm izni isteme

    const date = new Date(Date.now() + 10 * 1000); // milisaniye cinsinden bildirim zamanı burada 10 saniye sonrası

    // Create a time-based trigger
    const trigger: TimestampTrigger = { //bildirimin triggerlanma koşulları
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
      repeatFrequency: RepeatFrequency.HOURLY,
    };

    const channelId = await notifee.createChannel({// bildirimin gönderileceği kanal
      id: 'default',
      name: 'Default Channel',

    });

    // Create a trigger notification
    await notifee.createTriggerNotification(// gönderilecek bildirim
      {
        title: 'bildiirm',
        body: 'sepetten ürün kaldırıldı saatlik tekrar',
        android: {
          channelId: 'default',
        },
      },
      trigger,
    );

  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {Pizza.length === 0 ? (
          <Text style={styles.emptyText}>{user.name}</Text>
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
    textAlign: "center",
    fontSize: 18,
    marginTop: 50,
    color: "gray",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "floralwhite",
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
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
    backgroundColor: "darkred",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  button: {
    backgroundColor: "midnightblue",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default Sepetim;
