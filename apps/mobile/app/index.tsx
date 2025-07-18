import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useCartStore } from "@/store/cartStore";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Item } from "@randostore/types";
import { apiService } from "@/services/api";

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addItem, updateQuantity, getItemQuantity, getCartCount } =
    useCartStore();

  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // load all items
  const loadItems = async () => {
    try {
      setError(null);
      const fetched = await apiService.getItems();
      setItems(fetched);
    } catch (err: any) {
      setError(err.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!loading) loadItems();
    }, [loading])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  };

  const cartCount = getCartCount();

  const CartIconWithBadge = () => (
    <TouchableOpacity
      style={[styles.iconButton, { backgroundColor: colors.primary }]}
      onPress={() => router.push("/cart")}
    >
      <Ionicons name="bag-outline" size={20} color={colors.primaryForeground} />
      {cartCount > 0 && (
        <View style={[styles.badge, { backgroundColor: colors.destructive }]}>
          <Text style={[styles.badgeText, { color: colors.primaryForeground }]}>
            {cartCount > 99 ? "99+" : cartCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: Item }) => {
    const qty = getItemQuantity(item.id);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push(`/${item.id}`)}
      >
        <View
          style={[
            styles.itemCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Image source={{ uri: item.img }} style={styles.itemImage} />

          <View style={styles.itemInfo}>
            <Text style={[styles.itemName, { color: colors.text }]}>
              {item.name}
            </Text>

            <View style={styles.itemFooter}>
              <Text style={[styles.itemPrice, { color: colors.primary }]}>
                ${item.price}
              </Text>

              {qty === 0 ? (
                <TouchableOpacity
                  style={[
                    styles.addButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={() => addItem(item)}
                >
                  <Text
                    style={[
                      styles.addButtonText,
                      { color: colors.primaryForeground },
                    ]}
                  >
                    Add to Cart
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, qty - 1)}
                  >
                    <Ionicons
                      name="remove-circle-outline"
                      size={28}
                      color={colors.primary}
                    />
                  </TouchableOpacity>

                  <Text style={[styles.quantityText, { color: colors.text }]}>
                    {qty}
                  </Text>

                  <TouchableOpacity onPress={() => addItem(item)}>
                    <Ionicons
                      name="add-circle-outline"
                      size={28}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading items...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && items.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.centerContainer}>
          <Text style={[styles.errorTitle, { color: colors.text }]}>
            {error}
          </Text>
          <TouchableOpacity onPress={loadItems}>
            <Text style={[styles.retryButtonText, { color: colors.primary }]}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>RandoStore</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/add-item")}
          >
            <Ionicons
              name="add-outline"
              size={20}
              color={colors.primaryForeground}
            />
          </TouchableOpacity>
          <CartIconWithBadge />
        </View>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(i) => i.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.centerContainer}>
              <Ionicons
                name="storefront-outline"
                size={64}
                color={colors.icon}
              />
              <Text style={[styles.errorTitle, { color: colors.text }]}>
                No Items Found
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: { fontSize: 24, fontWeight: "bold" },
  headerButtons: { flexDirection: "row" },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: { fontSize: 11, fontWeight: "bold" },

  listContainer: { padding: 16 },

  itemCard: {
    flexDirection: "row",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 3,
  },
  itemImage: { width: 100, height: 100, resizeMode: "cover" },

  itemInfo: { flex: 1, padding: 12 },
  itemName: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },

  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemPrice: { fontSize: 20, fontWeight: "bold" },

  addButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  addButtonText: { fontSize: 14, fontWeight: "600" },

  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 8,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 16, fontSize: 16 },

  errorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  retryButtonText: { fontSize: 16, fontWeight: "600" },
});
