import { Redirect, Stack } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

export default function Layout() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return null; // This is for a better user experience to avoid flickering from the login page to the home page
  }

  if (!isSignedIn) {
    return <Redirect href={"/sign-in"} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
