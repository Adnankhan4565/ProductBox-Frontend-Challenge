import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
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

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme!];

  const insets = useSafeAreaInsets();
  const FOOTER_HEIGHT = 80;

  const totalPrice = getTotalPrice();
  const taxAmount = totalPrice * 0.08;
  const shippingFee = totalPrice > 50 ? 0 : 9.99;
  const finalTotal = totalPrice + taxAmount + shippingFee;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      await new Promise((res) => setTimeout(res, 2000));
      clearCart();
      Alert.alert(
        "🎉 Order Successful!",
        "Your order has been placed successfully. Thank you for shopping with RandoStore!",
        [
          {
            text: "Continue Shopping",
            onPress: () => {
              router.dismissAll();
              router.replace("/");
            },
          },
        ]
      );
    } catch {
      Alert.alert("Error", "Failed to process your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderOrderItem = ({ item }: { item: CartItem }) => (
    <View style={[styles.orderItem, { borderBottomColor: colors.border }]}>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: colors.text }]}>
          {item.item.name}
        </Text>
        <Text style={[styles.itemDetails, { color: colors.icon }]}>
          Quantity: {item.quantity} × ${parseFloat(item.item.price).toFixed(2)}
        </Text>
      </View>
      <Text style={[styles.itemTotal, { color: colors.text }]}>
        ${(parseFloat(item.item.price) * item.quantity).toFixed(2)}
      </Text>
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
            No items to checkout
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.icon }]}>
            Your cart is empty. Add some items first!
          </Text>
          <TouchableOpacity
            style={[styles.shopButton, { backgroundColor: colors.primary }]}
            onPress={() => router.replace("/")}
          >
            <Text
              style={[
                styles.shopButtonText,
                { color: colors.primaryForeground },
              ]}
            >
              Start Shopping
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
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Order Summary
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.icon }]}>
          Review your order before placing it
        </Text>
      </View>

      {/* SCROLLABLE CONTENT */}
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + FOOTER_HEIGHT,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Items List */}
        <View
          style={[
            styles.orderSection,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Items ({cart.items.length})
          </Text>
          <FlatList
            data={cart.items}
            renderItem={renderOrderItem}
            keyExtractor={(i) => i.item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        {/* Summary */}
        <View
          style={[
            styles.summarySection,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Order Total
          </Text>
          {/** Subtotal, Tax, Shipping **/}
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.text }]}>
              Subtotal:
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ${totalPrice.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.text }]}>
              Tax (8%):
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ${taxAmount.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.text }]}>
              Shipping:
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}
            </Text>
          </View>

          {/** Final total **/}
          <View
            style={[
              styles.summaryRow,
              styles.totalRow,
              { borderTopColor: colors.border },
            ]}
          >
            <Text style={[styles.totalLabel, { color: colors.text }]}>
              Total:
            </Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>
              ${finalTotal.toFixed(2)}
            </Text>
          </View>
        </View>

        {/** Free shipping banner **/}
        {shippingFee === 0 && (
          <View
            style={[
              styles.freeShippingBanner,
              { backgroundColor: colors.success },
            ]}
          >
            <Text
              style={[
                styles.freeShippingText,
                { color: colors.primaryForeground },
              ]}
            >
              🚚 Free shipping applied!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* FOOTER */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.muted }]}
          onPress={() => router.back()}
          disabled={isProcessing}
        >
          <Text style={[styles.backButtonText, { color: colors.text }]}>
            Back to Cart
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.placeOrderButton,
            {
              backgroundColor: isProcessing ? colors.icon : colors.primary,
            },
          ]}
          onPress={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator
                color={colors.primaryForeground}
                size="small"
              />
              <Text
                style={[
                  styles.processingText,
                  { color: colors.primaryForeground },
                ]}
              >
                Processing...
              </Text>
            </View>
          ) : (
            <Text
              style={[
                styles.placeOrderButtonText,
                { color: colors.primaryForeground },
              ]}
            >
              Place Order – ${finalTotal.toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  headerSubtitle: { fontSize: 16 },

  content: { padding: 16 },

  orderSection: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  summarySection: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },

  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  itemDetails: { fontSize: 14 },
  itemTotal: { fontSize: 16, fontWeight: "600" },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  summaryLabel: { fontSize: 16 },
  summaryValue: { fontSize: 16, fontWeight: "600" },

  totalRow: { borderTopWidth: 1, marginTop: 8, paddingTop: 16 },
  totalLabel: { fontSize: 18, fontWeight: "bold" },
  totalValue: { fontSize: 20, fontWeight: "bold" },

  freeShippingBanner: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  freeShippingText: { fontSize: 14, fontWeight: "600" },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  backButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 12,
  },
  backButtonText: { fontSize: 16, fontWeight: "600" },

  placeOrderButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  placeOrderButtonText: { fontSize: 16, fontWeight: "bold" },

  processingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  processingText: { fontSize: 16, fontWeight: "bold" },

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
  shopButtonText: { fontSize: 16, fontWeight: "bold" },
});
