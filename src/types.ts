export type Category = 
  | 'সব' 
  | '❤️ ভালোবাসা' // Love
  | '💔 কষ্ট' // Sad
  | '✨ অনুপ্রেরণা' // Motivation
  | '😎 অ্যাটিটিউড' // Attitude
  | '🤝 বন্ধুত্ব' // Friendship
  | '😂 মজার' // Funny
  | '🕌 ইসলামিক' // Islamic
  | '🌱 জীবন'; // Life

export type Status = {
  id: string;
  text: string;
  category: Category;
};

export type Vibe = 'Romantic' | 'Sad' | 'Aggressive' | 'Peaceful' | 'Funny' | 'Philosophical' | 'Islamic';
export type Size = 'small' | 'medium' | 'long';
