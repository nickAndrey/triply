type SuggestionPhotoDetails = {
  id: string;
  images: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
    small_s3: string;
  };
  unsplash_url: string;
  photographer_name: string;
  photographer_url: string;
  photographer_profile_image: string;
};

export type Suggestion = {
  id: string;
  title: string;
  description: string;
  photos: SuggestionPhotoDetails[];
  country?: string;
};
