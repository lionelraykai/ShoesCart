import type { ImageSourcePropType } from 'react-native';

// Bundled sample photos for the seeded catalog, keyed by shoe id. Kept out of Redux
// state deliberately — `require()`'d asset references aren't plain serializable values
// (particularly on web), so they don't belong in a store that redux-persist writes to
// AsyncStorage. Shoes the admin edits/adds get a real `{ uri }` from the image picker,
// which is a plain, JSON-safe value and lives on the shoe itself as `image`.
export const seedShoeImages: Record<string, ImageSourcePropType> = {
  seed_air_runner: require('../../assets/images/shoes/campus-runner.jpg'),
  seed_ultraboost: require('../../assets/images/shoes/kiprun-runner.jpg'),
  seed_classic_leather: require('../../assets/images/shoes/leather-derby.jpg'),
  seed_old_skool: require('../../assets/images/shoes/black-white-sneaker.jpg'),
  seed_574: require('../../assets/images/shoes/pink-platform-sneaker.jpg'),
};
