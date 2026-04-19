type SupabasePlaceholderResponse = {
  message: string;
  connected: boolean;
};

export const supabase = {
  async ping(): Promise<SupabasePlaceholderResponse> {
    return Promise.resolve({
      message: "Supabase placeholder active. Real backend integration comes later.",
      connected: false
    });
  }
};
