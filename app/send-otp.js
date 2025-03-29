import supabase from "@/lib/supabase";

export async function sendOtp(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true, 
      emailRedirectTo: null,  // This prevents the magic link!
    },
  });

  if (error) throw new Error(error.message);
}
