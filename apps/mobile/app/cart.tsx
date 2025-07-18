import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCartStore } from "@/store/cartStore";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { CartItem } from "@randostore/types";

export default function CartPage() {
  const { cart, removeItem, updateQuantity, getTotalPrice, getCartCount } =
    useCartStore();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const insets = useSafeAreaInsets();
  const FOOTER_HEIGHT = 80;

  const totalPrice = getTotalPrice();
  const cartCount = getCartCount();

  const handleRemoveItem = (id: number, name: string) => {
    Alert.alert(
      "Remove Item",
      `Are you sure you want to remove ${name} from your cart?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeItem(id),
        },
      ]
    );
  };

  const handleQuantityChange = (
    id: number,
    currentQuantity: number,
    change: number
  ) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) {
      const cartItem = cart.items.find((i) => i.item.id === id);
      if (cartItem) handleRemoveItem(id, cartItem.item.name);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      Alert.alert(
        "Empty Cart",
        "Please add some items to your cart before checking out."
      );
      return;
    }
    router.push("/checkout");
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View
      style={[
        styles.cartItem,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Image source={{ uri: item.item.img }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, { color: colors.text }]}>
          {item.item.name}
        </Text>
        <Text style={[styles.itemPrice, { color: colors.primary }]}>
          ${parseFloat(item.item.price).toFixed(2)}
        </Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: colors.muted }]}
            onPress={() =>
              handleQuantityChange(item.item.id, item.quantity, -1)
            }
          >
            <Text style={[styles.quantityButtonText, { color: colors.text }]}>
              −
            </Text>
          </TouchableOpacity>

          <Text style={[styles.quantity, { color: colors.text }]}>
            {item.quantity}
          </Text>

          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: colors.primary }]}
            onPress={() => handleQuantityChange(item.item.id, item.quantity, 1)}
          >
            <Text
              style={[
                styles.quantityButtonText,
                { color: colors.primaryForeground },
              ]}
            >
              +
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.subtotal, { color: colors.text }]}>
          Subtotal: ${(parseFloat(item.item.price) * item.quantity).toFixed(2)}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.removeButton, { backgroundColor: colors.destructive }]}
        onPress={() => handleRemoveItem(item.item.id, item.item.name)}
      >
        <Text
          style={[styles.removeButtonText, { color: colors.primaryForeground }]}
        >
          Remove
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (cart.items.length === 0) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: colors.background }]}
        edges={["top", "bottom"]}
      >
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Your cart is empty
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.icon }]}>
            Add some items to get started!
          </Text>
          <TouchableOpacity
            style={[styles.shopButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text
              style={[
                styles.shopButtonText,
                { color: colors.primaryForeground },
              ]}
            >
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Shopping Cart ({cartCount} {cartCount === 1 ? "item" : "items"})
        </Text>
      </View>

      <FlatList
        data={cart.items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: insets.bottom + FOOTER_HEIGHT },
        ]}
      />

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            paddingBottom: insets.bottom + 16,
          },
        ]}
      >
        <View style={styles.totalContainer}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>
            Total:
          </Text>
          <Text style={[styles.totalPrice, { color: colors.primary }]}>
            ${totalPrice.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.checkoutButton, { backgroundColor: colors.primary }]}
          onPress={handleCheckout}
        >
          <Text
            style={[
              styles.checkoutButtonText,
              { color: colors.primaryForeground },
            ]}
          >
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },

  listContainer: {
    padding: 16,
  },

  cartItem: {
    flexDirection: "row",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantity: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: "600",
    minWidth: 30,
    textAlign: "center",
  },

  subtotal: {
    fontSize: 14,
    fontWeight: "600",
  },

  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    height: 36,
    justifyContent: "center",
  },
  removeButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },

  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "bold",
  },

  checkoutButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  shopButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
