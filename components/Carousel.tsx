import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { Carousel as ReanimatedCarousel } from "react-native-reanimated-carousel";

interface CarouselItem {
  _id: string;
  title: string;
  date: string;
  imageUrl?: string;
}

function getResponsiveSize(width: number) {
  if (width < 375) {
    return { slideWidth: width * 0.8, slideHeight: 350, fontSize: 22, buttonSize: 14 };
  } else if (width < 414) {
    return { slideWidth: width * 0.8, slideHeight: 420, fontSize: 26, buttonSize: 16 };
  } else if (width < 768) {
    return { slideWidth: Math.min(width * 0.9, 1000), slideHeight: 320, fontSize: 28, buttonSize: 18 };
  } else if (width < 1024) {
    return { slideWidth: Math.min(width * 0.9, 1200), slideHeight: 500, fontSize: 34, buttonSize: 21 };
  } else {
    return { slideWidth: Math.min(width * 0.9, 1400), slideHeight: 520, fontSize: 36, buttonSize: 22 };
  }
}

export default function Carousel({ items }: { items: CarouselItem[] }) {
  const { width: screenWidth } = useWindowDimensions();
  const { slideWidth, slideHeight, fontSize, buttonSize } = getResponsiveSize(screenWidth);

  const renderItem = useCallback(
    ({ item }: { item: CarouselItem }) => (
      <View style={styles.slideWrapper}>
        <View style={[styles.slide, { width: slideWidth, height: slideHeight }]}>
          <Image
            source={{ uri: item.imageUrl || "https://via.placeholder.com/400x420" }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.overlay} />
          <View style={styles.content}>
            <Text style={[styles.title, { fontSize }]} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={[styles.date, { fontSize: fontSize * 0.6 }]}>
              {new Date(item.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
            <TouchableOpacity
              style={[
                styles.button,
                { paddingHorizontal: fontSize * 0.8, paddingVertical: fontSize * 0.5 },
              ]}
              onPress={() => router.push(`/event/${item._id}`)}
              activeOpacity={0.8}
            >
              <FontAwesome name="ticket" size={buttonSize} color="#fff" />
              <Text style={[styles.buttonText, { fontSize: buttonSize }]}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ),
    [screenWidth, slideWidth, slideHeight, fontSize, buttonSize]
  );

  if (!items || items.length === 0) return null;

  return (
    <View style={styles.container}>
      <ReanimatedCarousel
        key={Math.round(screenWidth)}
        data={items}
        renderItem={renderItem}
        itemSize={screenWidth}
        autoplay={items.length > 1}
        autoplayInterval={4000}
        loop={items.length > 1}
        style={{ width: screenWidth, height: slideHeight }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    backgroundColor: "transparent",
  },
  slideWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  slide: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1f2937",
    alignSelf: "flex-start",
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#374151",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
    gap: 8,
  },
  title: {
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.75)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  date: {
    color: "#e5e7eb",
    textShadowColor: "rgba(0,0,0,0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#9333ea",
    alignSelf: "flex-start",
    borderRadius: 12,
    marginTop: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
