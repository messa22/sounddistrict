import type { ImageSourcePropType } from "react-native";
import type { RoomId } from "@sounddistrict/booking-core";

export const roomImages: Record<RoomId, ImageSourcePropType> = {
  blue: require("../assets/blueroom-new1.jpg"),
  red: require("../assets/space2-new.jpg"),
  infinity: require("../assets/infinity.jpg")
};
