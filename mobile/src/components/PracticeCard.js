import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Surface, Text } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolate,
  useSharedValue,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 64; // 32px padding on each side
const CARD_HEIGHT = CARD_WIDTH * 0.6; // Maintain aspect ratio

function PracticeCard({
  word,
  meaning,
  isFlipped,
  onFlip,
  initialSide = "word",
}) {
  const flipProgress = useSharedValue(0);

  useEffect(() => {
    if (initialSide === "meaning") {
      onFlip();
    }
  }, [initialSide]);

  useEffect(() => {
    flipProgress.value = withTiming(isFlipped ? 1 : 0, {
      duration: 600,
    });
  }, [isFlipped]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipProgress.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipProgress.value, [0, 1], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, frontAnimatedStyle]}>
        <Surface style={styles.surface} onTouchEnd={onFlip}>
          <View style={styles.content}>
            <Text style={styles.text}>
              {initialSide === "word" ? word : meaning}
            </Text>
            <Text style={styles.hint}>Tap to flip</Text>
          </View>
        </Surface>
      </Animated.View>

      <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
        <Surface style={styles.surface} onTouchEnd={onFlip}>
          <View style={styles.content}>
            <Text style={styles.text}>
              {initialSide === "word" ? meaning : word}
            </Text>
            <Text style={styles.hint}>Tap to flip</Text>
          </View>
        </Surface>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginVertical: 16,
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
  },
  cardBack: {
    transform: [{ rotateY: "180deg" }],
  },
  surface: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    elevation: 4,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  hint: {
    fontSize: 14,
    color: "#666",
  },
});

export default PracticeCard;
