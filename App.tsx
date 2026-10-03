import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import {
  EMPTY_ORANGE,
  give,
  grandpaLine,
  hasProgress,
  kidLine,
  resetOrange,
  shareLine,
  sliceLabel,
  takeBack,
  type OrangeState,
  type Person,
} from "./src/orange";
import { loadOrange, saveOrange } from "./src/store";

export default function App() {
  const [state, setState] = useState<OrangeState>(EMPTY_ORANGE);
  const [note, setNote] = useState("Look at the orange.");
  const [ready, setReady] = useState(false);
  const [confirmNew, setConfirmNew] = useState(false);

  useEffect(() => {
    let alive = true;
    loadOrange()
      .then((loaded) => {
        if (!alive) return;
        setState(loaded);
        setNote(hasProgress(loaded) ? "Saved orange loaded." : "Look at the orange.");
        setReady(true);
      })
      .catch(() => {
        if (alive) setNote("Could not read the orange.");
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveOrange(state).catch(() => setNote("Could not save the orange."));
  }, [ready, state]);

  if (!ready && note === "Look at the orange.") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.loading}>Loading the orange</Text>
        </View>
      </SafeAreaView>
    );
  }

  function onGive(person: Person) {
    const result = give(state, person);
    setState(result.state);
    setConfirmNew(false);
    setNote(result.note);
  }

  function onBack() {
    const result = takeBack(state);
    setState(result.state);
    setConfirmNew(false);
    setNote(result.note);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <Text style={styles.title}>Share the Orange</Text>
        <Text style={styles.note}>{note}</Text>
        <Text style={styles.count}>{kidLine(state)}</Text>
        <Text style={styles.count}>{grandpaLine(state)}</Text>
        <Text style={styles.pose}>{sliceLabel(state)}</Text>
        <Text style={styles.line}>{shareLine(state)}</Text>
        <View style={styles.row}>
          <BigButton label="Give to Kid" inRow onPress={() => onGive("kid")} />
          <BigButton label="Give to Grandpa" inRow onPress={() => onGive("grandpa")} />
        </View>
        <BigButton label="Take back" onPress={onBack} />
        {confirmNew ? (
          <View style={styles.row}>
            <BigButton label="Confirm new" filled inRow onPress={onConfirmNew} />
            <BigButton label="Cancel new" inRow onPress={onCancelNew} />
          </View>
        ) : (
          <BigButton label="New orange" onPress={() => setConfirmNew(true)} />
        )}
      </View>
    </SafeAreaView>
  );

  function onConfirmNew() {
    const result = resetOrange();
    setState(result.state);
    setConfirmNew(false);
    setNote(result.note);
  }

  function onCancelNew() {
    setConfirmNew(false);
    setNote("New orange canceled.");
  }
}

function BigButton({
  label,
  onPress,
  filled,
  inRow,
}: {
  label: string;
  onPress: () => void;
  filled?: boolean;
  inRow?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.button, inRow && styles.buttonRow, filled && styles.buttonFilled]}
    >
      <Text style={[styles.buttonText, filled && styles.buttonTextFilled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F3EA" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loading: { fontSize: 28, fontWeight: "800", color: "#2C2416" },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 12, gap: 6 },
  title: { fontSize: 32, fontWeight: "800", color: "#2C2416" },
  note: { fontSize: 18, color: "#5C4A32", minHeight: 24 },
  count: { fontSize: 20, fontWeight: "700", color: "#2C2416" },
  pose: { fontSize: 22, fontWeight: "700", color: "#2C2416" },
  line: { fontSize: 36, fontWeight: "800", color: "#C2410C", lineHeight: 42 },
  row: { flexDirection: "row", gap: 8 },
  button: {
    minHeight: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#2C2416",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
  },
  buttonRow: { flex: 1 },
  buttonFilled: { backgroundColor: "#2C2416" },
  buttonText: { fontSize: 18, fontWeight: "800", color: "#2C2416", textAlign: "center" },
  buttonTextFilled: { color: "#FFFFFF" },
});
