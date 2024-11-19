export interface PixelArt {
  id:          number;
  image:       string;
  title:       string;
  description: string;
  userName:  String;
}

export interface PixelArtCreateDto {
  image:       string;
  title:       string;
  description: string;
  id_user: string | null ;
}

export interface PixelArtUpdateDto {
  title:       string;
  description: string;
}
