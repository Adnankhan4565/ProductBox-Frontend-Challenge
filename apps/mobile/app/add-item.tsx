// app/add-item.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { apiService } from "@/services/api";

const itemSchema = z.object({
  name: z.string().trim().min(1, "Item name is required."),
  price: z
    .string()
    .trim()
    .min(1, "Price is required.")
    .refine((val) => !isNaN(parseFloat(val)), { message: "Must be a number." })
    .refine((val) => parseFloat(val) > 0, { message: "Must be > 0." }),
  imageUrl: z
    .string()
    .trim()
    .min(1, "Image URL is required.")
    .url("Enter a valid URL."),
});
type FormData = z.infer<typeof itemSchema>;

export default function AddItemPage() {
  const { id } = useLocalSearchParams<{ id?: string }>(); // ← query param
  const isEdit = Boolean(id);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [loadingItem, setLoadingItem] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: { name: "", price: "", imageUrl: "" },
  });

  // Fetch existing item if editing
  useEffect(() => {
    if (!isEdit) return;
    setLoadingItem(true);
    apiService
      .getItem(Number(id))
      .then((it) => {
        reset({ name: it.name, price: it.price, imageUrl: it.img });
      })
      .catch((err) => {
        Alert.alert("Error", err.message, [
          { text: "OK", onPress: () => router.back() },
        ]);
      })
      .finally(() => setLoadingItem(false));
  }, [id, isEdit, reset, router]);

  const onSubmit = async (data: FormData) => {
    const payload = {
      id: Number(id),
      name: data.name.trim(),
      price: parseFloat(data.price).toFixed(2),
      img: data.imageUrl.trim(),
    };
    try {
      if (isEdit) {
        await apiService.updateItem(Number(id), payload);
        Alert.alert("Updated", "Item has been updated.", [
          { text: "OK", onPress: () => router.replace("/") },
        ]);
      } else {
        const created = await apiService.createItem(payload);
        Alert.alert("Created", `${created.name} added!`, [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  if (loadingItem) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <Text style={[styles.title, { color: colors.text }]}>
              {isEdit ? "Edit Item" : "Add New Item"}
            </Text>
            <Text style={[styles.subtitle, { color: colors.icon }]}>
              {isEdit
                ? "Update the details below."
                : "Fill in the item details to add it."}
            </Text>

            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Item Name *
              </Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.card,
                        borderColor: errors.name ? "red" : colors.border,
                        color: colors.text,
                      },
                    ]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Enter item name"
                    placeholderTextColor={colors.icon}
                  />
                )}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name.message}</Text>
              )}
            </View>

            {/* Price */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Price (USD) *
              </Text>
              <Controller
                control={control}
                name="price"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.card,
                        borderColor: errors.price ? "red" : colors.border,
                        color: colors.text,
                      },
                    ]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="0.00"
                    placeholderTextColor={colors.icon}
                    keyboardType="decimal-pad"
                  />
                )}
              />
              {errors.price && (
                <Text style={styles.errorText}>{errors.price.message}</Text>
              )}
            </View>

            {/* Image URL */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Image URL *
              </Text>
              <Controller
                control={control}
                name="imageUrl"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.card,
                        borderColor: errors.imageUrl ? "red" : colors.border,
                        color: colors.text,
                      },
                    ]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="https://..."
                    placeholderTextColor={colors.icon}
                    autoCapitalize="none"
                  />
                )}
              />
              {errors.imageUrl && (
                <Text style={styles.errorText}>{errors.imageUrl.message}</Text>
              )}
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.muted }]}
                onPress={() => router.back()}
                disabled={isSubmitting}
              >
                <Text style={[styles.cancelText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  {
                    backgroundColor: isSubmitting
                      ? colors.icon
                      : colors.primary,
                  },
                ]}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={colors.primaryForeground} />
                ) : (
                  <Text
                    style={[
                      styles.submitText,
                      { color: colors.primaryForeground },
                    ]}
                  >
                    {isEdit ? "Update Item" : "Add Item"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContainer: { flexGrow: 1, justifyContent: "center" },
  form: { padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: { fontSize: 16, marginBottom: 32, textAlign: "center" },

  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  errorText: { color: "red", fontSize: 12, marginTop: 4 },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 12,
  },
  cancelText: { fontSize: 16, fontWeight: "600" },

  submitButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: { fontSize: 16, fontWeight: "bold" },
});
