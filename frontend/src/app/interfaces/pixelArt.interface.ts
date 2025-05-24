export interface PixelArt {
  id:          number;
  image:       string;
  title:       string;
  description: string;
  category:    string;
  tags:        string[];
  userName:    string;
}

export interface PixelArtForm {
  image: File | Blob;
  title: string;
  description: string;
  category_id: number;
  tags: string[];
  userId: number;
}


export interface PixelArtUpdateDto {
  title:       string;
  description: string;
}

export interface Categories {
  id:     number;
  name:   string;
}