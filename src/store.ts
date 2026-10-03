import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseOrange, type OrangeState } from "./orange";

const KEY = "share-the-orange-v1";

export async function loadOrange(): Promise<OrangeState> {
  const raw = await AsyncStorage.getItem(KEY);
  return parseOrange(raw);
}

export async function saveOrange(state: OrangeState): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}
