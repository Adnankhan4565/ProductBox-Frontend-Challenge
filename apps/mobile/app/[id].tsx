import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { apiService } from "@/services/api";
import { Item } from "@randostore/types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? "light"];

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiService.getItem(Number(id));
        setItem(data);
      } catch (err: any) {
        Alert.alert("Error", err.message, [
          { text: "OK", onPress: () => router.replace("/") },
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  const confirmDelete = () => {
    Alert.alert("Delete Item", "Really delete this product?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await apiService.deleteItem(Number(id));
            router.replace("/");
          } catch (err: any) {
            Alert.alert("Delete failed", err.message);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ color: colors.text }}>Item not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Image source={{ uri: item.img }} style={styles.image} />
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.price, { color: colors.primary }]}>
          ${item.price}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => router.push(`/add-item?id=${id}`)}
        >
          <Text
            style={[styles.buttonText, { color: colors.primaryForeground }]}
          >
            Edit
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.destructive }]}
          onPress={confirmDelete}
        >
          <Text
            style={[styles.buttonText, { color: colors.primaryForeground }]}
          >
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },

  info: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 32,
  },
  button: {
    flex: 1,
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
