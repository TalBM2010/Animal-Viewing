// Curated roster of unusual animals. Images are direct Wikimedia Commons URLs
// (public domain / Creative Commons). If an image fails to load, the
// ProjectorView shows a colored placeholder with the emoji + name instead.
//
// rarityScore: 1 = common, 2 = rare, 3 = very rare. Used for capture bonuses
// and weighted random selection in detectAnimal().

export const animals = [
  {
    id: 'axolotl',
    name: 'Axolotl',
    emoji: '🦎',
    category: 'amphibian',
    rarity: 'very rare',
    rarityScore: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/AxolotlBE.jpg/640px-AxolotlBE.jpg',
    fact: 'Axolotls can regrow lost limbs, parts of their heart, and even sections of their brain — and they keep their feathery gills for life.',
  },
  {
    id: 'fennec-fox',
    name: 'Fennec Fox',
    emoji: '🦊',
    category: 'mammal',
    rarity: 'rare',
    rarityScore: 2,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Fennec_Fox_%28cropped%29.jpg/640px-Fennec_Fox_%28cropped%29.jpg',
    fact: 'The fennec fox has ears as long as 15 cm — they help it hear prey under the sand and stay cool in the Sahara.',
  },
  {
    id: 'okapi',
    name: 'Okapi',
    emoji: '🦓',
    category: 'mammal',
    rarity: 'very rare',
    rarityScore: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Okapi2.jpg/640px-Okapi2.jpg',
    fact: 'Despite its zebra-striped legs, the okapi is actually the giraffe’s only living relative.',
  },
  {
    id: 'pangolin',
    name: 'Pangolin',
    emoji: '🦔',
    category: 'mammal',
    rarity: 'very rare',
    rarityScore: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Manis_temminckii.jpg/640px-Manis_temminckii.jpg',
    fact: 'Pangolins are the only mammals covered in scales — and they roll into a tight ball when threatened.',
  },
  {
    id: 'quokka',
    name: 'Quokka',
    emoji: '🐹',
    category: 'mammal',
    rarity: 'rare',
    rarityScore: 2,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Cute_Quokka.jpg/640px-Cute_Quokka.jpg',
    fact: 'Often called "the world’s happiest animal," quokkas live mostly on Rottnest Island in Australia.',
  },
  {
    id: 'aye-aye',
    name: 'Aye-Aye',
    emoji: '🐒',
    category: 'mammal',
    rarity: 'very rare',
    rarityScore: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Aye-aye_at_night_in_the_wild_in_Madagascar.jpg/640px-Aye-aye_at_night_in_the_wild_in_Madagascar.jpg',
    fact: 'The aye-aye taps trees with its long middle finger and listens for hollow tunnels where grubs are hiding.',
  },
  {
    id: 'maned-wolf',
    name: 'Maned Wolf',
    emoji: '🐺',
    category: 'mammal',
    rarity: 'rare',
    rarityScore: 2,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Maned_Wolf_pup.jpg/640px-Maned_Wolf_pup.jpg',
    fact: 'The maned wolf isn’t a wolf at all — it’s a long-legged South American canid in a genus all its own.',
  },
  {
    id: 'saiga-antelope',
    name: 'Saiga Antelope',
    emoji: '🐐',
    category: 'mammal',
    rarity: 'very rare',
    rarityScore: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Saiga_tatarica.jpg/640px-Saiga_tatarica.jpg',
    fact: 'Saigas have a bulbous, drooping nose that filters dust in summer and warms freezing air in winter.',
  },
  {
    id: 'tarsier',
    name: 'Tarsier',
    emoji: '🐵',
    category: 'mammal',
    rarity: 'rare',
    rarityScore: 2,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Tarsier_Hugs_Mossy_Branch_-_Bohol_-_Philippines.jpg/640px-Tarsier_Hugs_Mossy_Branch_-_Bohol_-_Philippines.jpg',
    fact: 'Each of a tarsier’s eyeballs is bigger than its brain — they help it hunt insects in the dark.',
  },
  {
    id: 'narwhal',
    name: 'Narwhal',
    emoji: '🦄',
    category: 'mammal',
    rarity: 'very rare',
    rarityScore: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Narwhals_breach.jpg/640px-Narwhals_breach.jpg',
    fact: 'A narwhal’s long "horn" is actually a tooth — a giant spiral tusk packed with millions of nerve endings.',
  },
  {
    id: 'glass-frog',
    name: 'Glass Frog',
    emoji: '🐸',
    category: 'amphibian',
    rarity: 'rare',
    rarityScore: 2,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Hyalinobatrachium_valerioi_-_Costa_Rica.jpg/640px-Hyalinobatrachium_valerioi_-_Costa_Rica.jpg',
    fact: 'You can see a glass frog’s heart, liver, and intestines right through its translucent belly.',
  },
  {
    id: 'star-nosed-mole',
    name: 'Star-Nosed Mole',
    emoji: '⭐',
    category: 'mammal',
    rarity: 'very rare',
    rarityScore: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Condylura.jpg/640px-Condylura.jpg',
    fact: 'The star-nosed mole has 22 fleshy tentacles on its snout and identifies prey in under 0.25 seconds — the fastest forager on Earth.',
  },
];

export function findAnimal(id) {
  return animals.find((a) => a.id === id);
}
