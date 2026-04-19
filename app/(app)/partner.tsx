import { useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";

import { FadeInView } from "@/components/FadeInView";
import { InteractiveCard } from "@/components/InteractiveCard";
import { useChallengeStore } from "@/store/useChallengeStore";
import { useCoupleStore } from "@/store/useCoupleStore";
import { theme } from "@/theme";

type ConnectionTab = "haveCode" | "shareCode";

export default function PartnerScreen() {
  const {
    partner,
    inviteCode,
    isConnected,
    pendingInvite,
    connectedAt,
    sharedChallengesCompleted,
    generateInviteCode,
    acceptInvite,
    disconnectCouple,
    getCoupleStatus
  } = useCoupleStore();
  const streak = useChallengeStore((state) => state.streak);
  const [activeTab, setActiveTab] = useState<ConnectionTab>("haveCode");
  const [codeInput, setCodeInput] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const successScale = useRef(new Animated.Value(0.84)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  const status = getCoupleStatus();

  const daysTogether = useMemo(() => {
    if (!connectedAt) {
      return 0;
    }

    const start = new Date(connectedAt).getTime();
    const diff = Date.now() - start;
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)) + 1);
  }, [connectedAt]);

  const inviteExpiry = useMemo(() => {
    if (!pendingInvite) {
      return null;
    }

    return new Date(pendingInvite.expiresAt).toLocaleString("de-AT", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  }, [pendingInvite]);

  const runSuccessAnimation = () => {
    successScale.setValue(0.84);
    successOpacity.setValue(0);

    Animated.parallel([
      Animated.spring(successScale, {
        toValue: 1,
        tension: 180,
        friction: 10,
        useNativeDriver: true
      }),
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: theme.animation.medium,
        useNativeDriver: true
      })
    ]).start();
  };

  const handleConnect = () => {
    const didConnect = acceptInvite(codeInput);

    if (!didConnect) {
      setFeedback("Please enter a valid 6-character invite code.");
      return;
    }

    setFeedback("Connection successful. Your couple space is now unlocked.");
    runSuccessAnimation();
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(inviteCode);
    setFeedback(`Invite code ${inviteCode} copied to clipboard.`);
  };

  const handleShare = async () => {
    await Share.share({
      message: `Join me on Spark. Use my invite code: ${inviteCode}`
    });
  };

  const handleGenerateNewCode = () => {
    const nextCode = generateInviteCode();
    setFeedback(`New invite code generated: ${nextCode}`);
  };

  const handleDisconnect = () => {
    Alert.alert(
      "Disconnect couple",
      "This will remove the current pairing and generate a fresh invite code.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Disconnect",
          style: "destructive",
          onPress: () => {
            disconnectCouple();
            setCodeInput("");
            setActiveTab("shareCode");
            setFeedback("Pairing removed. Share your new code whenever you're ready.");
          }
        }
      ]
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {!isConnected ? (
        <>
          <FadeInView delay={40}>
            <View style={styles.header}>
              <Text style={styles.title}>Connect with your partner</Text>
              <Text style={styles.subtitle}>
                Pair once, then unlock shared challenges, streaks and rituals for
                both of you.
              </Text>
            </View>
          </FadeInView>

          <FadeInView delay={100}>
            <View style={styles.tabRow}>
              <InteractiveCard
                style={[
                  styles.tabButton,
                  activeTab === "haveCode" && styles.tabButtonActive
                ]}
                onPress={() => setActiveTab("haveCode")}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    activeTab === "haveCode" && styles.tabLabelActive
                  ]}
                >
                  I have a code
                </Text>
              </InteractiveCard>
              <InteractiveCard
                style={[
                  styles.tabButton,
                  activeTab === "shareCode" && styles.tabButtonActive
                ]}
                onPress={() => setActiveTab("shareCode")}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    activeTab === "shareCode" && styles.tabLabelActive
                  ]}
                >
                  Share my code
                </Text>
              </InteractiveCard>
            </View>
          </FadeInView>

          {activeTab === "haveCode" ? (
            <FadeInView delay={180}>
              <View style={styles.card}>
                <Text style={styles.eyebrow}>Enter Invite</Text>
                <Text style={styles.sectionTitle}>Paste your partner's code</Text>
                <TextInput
                  value={codeInput}
                  onChangeText={(value) =>
                    setCodeInput(value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase())
                  }
                  autoCapitalize="characters"
                  maxLength={6}
                  placeholder="ABC123"
                  placeholderTextColor={theme.colors.textMuted}
                  style={styles.codeInput}
                />
                <InteractiveCard style={styles.primaryButton} onPress={handleConnect}>
                  <Text style={styles.primaryButtonText}>Connect</Text>
                </InteractiveCard>
                <Animated.View
                  style={[
                    styles.successBadge,
                    {
                      opacity: successOpacity,
                      transform: [{ scale: successScale }]
                    }
                  ]}
                >
                  <Text style={styles.successEmoji}>❤️</Text>
                  <Text style={styles.successText}>Perfect match</Text>
                </Animated.View>
              </View>
            </FadeInView>
          ) : (
            <>
              <FadeInView delay={180}>
                <InteractiveCard style={styles.codeCard}>
                  <LinearGradient
                    colors={["rgba(230,57,70,0.28)", "#251517", "#151515"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.codeGradient}
                  >
                    <Text style={styles.eyebrow}>Your Invite Code</Text>
                    <Text style={styles.displayCode}>{inviteCode}</Text>
                    <Text style={styles.copy}>
                      Share this code with your partner to unlock your private couple
                      space.
                    </Text>
                    <Text style={styles.waitingLabel}>Waiting for partner...</Text>
                    <Text style={styles.expiryLabel}>
                      Expires {inviteExpiry ?? "soon"}
                    </Text>
                  </LinearGradient>
                </InteractiveCard>
              </FadeInView>

              <FadeInView delay={240}>
                <View style={styles.actionRow}>
                  <InteractiveCard style={styles.secondaryButton} onPress={handleCopy}>
                    <Text style={styles.secondaryButtonText}>Copy code</Text>
                  </InteractiveCard>
                  <InteractiveCard style={styles.primaryButtonFlex} onPress={handleShare}>
                    <Text style={styles.primaryButtonText}>Share</Text>
                  </InteractiveCard>
                </View>
              </FadeInView>

              <FadeInView delay={300}>
                <InteractiveCard style={styles.outlineButton} onPress={handleGenerateNewCode}>
                  <Text style={styles.outlineButtonText}>Generate new code</Text>
                </InteractiveCard>
              </FadeInView>
            </>
          )}
        </>
      ) : (
        <>
          <FadeInView delay={40}>
            <View style={styles.header}>
              <Text style={styles.title}>You two are connected</Text>
              <Text style={styles.subtitle}>
                {status.partnerName} is linked to your Spark profile. Shared rituals
                and couple progress can live here now.
              </Text>
            </View>
          </FadeInView>

          <FadeInView delay={120}>
            <View style={styles.card}>
              <View style={styles.partnerRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {partner?.name.slice(0, 1) ?? "P"}
                  </Text>
                </View>
                <View style={styles.partnerMeta}>
                  <Text style={styles.sectionTitle}>{partner?.name ?? "Partner"}</Text>
                  <Text style={styles.copy}>{partner?.email ?? "partner@spark.app"}</Text>
                  <Text style={styles.statusConnected}>{status.label}</Text>
                </View>
              </View>
              <Text style={styles.illustration}>💞</Text>
            </View>
          </FadeInView>

          <FadeInView delay={190}>
            <View style={styles.statsRow}>
              <InteractiveCard style={styles.statCard}>
                <Text style={styles.statValue}>{daysTogether}</Text>
                <Text style={styles.statLabel}>Days together</Text>
              </InteractiveCard>
              <InteractiveCard style={styles.statCard}>
                <Text style={styles.statValue}>{sharedChallengesCompleted}</Text>
                <Text style={styles.statLabel}>Challenges together</Text>
              </InteractiveCard>
            </View>
          </FadeInView>

          <FadeInView delay={260}>
            <View style={styles.card}>
              <Text style={styles.eyebrow}>Couple Energy</Text>
              <Text style={styles.sectionTitle}>You're on a {streak}-day shared streak</Text>
              <Text style={styles.copy}>
                Keep the momentum alive with one playful ritual tonight.
              </Text>
            </View>
          </FadeInView>

          <FadeInView delay={320}>
            <InteractiveCard style={styles.disconnectButton} onPress={handleDisconnect}>
              <Text style={styles.primaryButtonText}>Disconnect</Text>
            </InteractiveCard>
          </FadeInView>
        </>
      )}

      {feedback ? (
        <FadeInView delay={140}>
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        </FadeInView>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  content: {
    padding: theme.spacing.md,
    gap: theme.spacing.md
  },
  header: {
    gap: theme.spacing.sm
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bold,
    fontSize: 30,
    lineHeight: 36
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 16,
    lineHeight: 24
  },
  tabRow: {
    flexDirection: "row",
    gap: theme.spacing.xs
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderStrong,
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: theme.spacing.xs
  },
  tabButtonActive: {
    backgroundColor: theme.colors.accentMuted,
    borderColor: "rgba(255,107,107,0.38)"
  },
  tabLabel: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.medium,
    fontSize: 13,
    textTransform: "uppercase"
  },
  tabLabelActive: {
    color: theme.colors.textPrimary
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    ...theme.shadows.card
  },
  codeCard: {
    borderRadius: theme.radii.lg,
    overflow: "hidden",
    ...theme.shadows.card
  },
  codeGradient: {
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg
  },
  eyebrow: {
    color: theme.colors.accentLight,
    fontFamily: theme.typography.semibold,
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: "uppercase"
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.semibold,
    fontSize: 22,
    lineHeight: 28
  },
  copy: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 15,
    lineHeight: 22
  },
  codeInput: {
    backgroundColor: theme.colors.cardElevated,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bold,
    fontSize: 28,
    letterSpacing: 5,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    textAlign: "center"
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.sm
  },
  primaryButtonFlex: {
    flex: 1,
    alignItems: "center",
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.sm
  },
  primaryButtonText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.semibold,
    fontSize: 16
  },
  secondaryButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    paddingVertical: theme.spacing.sm
  },
  secondaryButtonText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.medium,
    fontSize: 15
  },
  outlineButton: {
    alignItems: "center",
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    paddingVertical: theme.spacing.sm
  },
  outlineButtonText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.semibold,
    fontSize: 15
  },
  displayCode: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bold,
    fontSize: 40,
    letterSpacing: 8
  },
  waitingLabel: {
    color: theme.colors.accentLight,
    fontFamily: theme.typography.semibold,
    fontSize: 14
  },
  expiryLabel: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.body,
    fontSize: 13
  },
  actionRow: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  successBadge: {
    alignItems: "center",
    backgroundColor: "rgba(125,223,155,0.12)",
    borderColor: "rgba(125,223,155,0.28)",
    borderRadius: theme.radii.md,
    borderWidth: 1,
    gap: 6,
    minHeight: 72,
    justifyContent: "center"
  },
  successEmoji: {
    fontSize: 24
  },
  successText: {
    color: theme.colors.success,
    fontFamily: theme.typography.semibold,
    fontSize: 15
  },
  feedbackCard: {
    backgroundColor: theme.colors.cardElevated,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    padding: theme.spacing.sm
  },
  feedbackText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 14,
    lineHeight: 20
  },
  partnerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  avatar: {
    alignItems: "center",
    backgroundColor: theme.colors.accentMuted,
    borderRadius: 36,
    height: 72,
    justifyContent: "center",
    width: 72
  },
  avatarText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bold,
    fontSize: 28
  },
  partnerMeta: {
    flex: 1,
    gap: 4
  },
  statusConnected: {
    color: theme.colors.success,
    fontFamily: theme.typography.semibold,
    fontSize: 14
  },
  illustration: {
    alignSelf: "center",
    fontSize: 48
  },
  statsRow: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    padding: theme.spacing.md,
    ...theme.shadows.card
  },
  statValue: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bold,
    fontSize: 30
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 14,
    marginTop: 6
  },
  disconnectButton: {
    alignItems: "center",
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.sm
  }
});
