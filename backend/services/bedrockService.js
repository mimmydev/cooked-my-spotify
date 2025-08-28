const malaysianRoasts = [
  'Playlist macam mamak, sumbat semua satu playlist ada macam-macam macam kuah nasi kandar',
  'Man, whats this bruh?',
  '????? have a better taste la',
  'so many classic song, whats your age? dinousour? fossil?',
  'nice :-)',
];

export const generateMalaysianRoast = async (playlistInfo) => {
  //** Mock delay to simulate AI processing
  await new Promise((resolve) => setTimeout(resolve, 1000));

  //** Return random roast
  const randomRoast = malaysianRoasts[Math.floor(Math.random() * malaysianRoasts.length)];
  return randomRoast;
};
