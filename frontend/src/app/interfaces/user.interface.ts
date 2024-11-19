export interface UserInterface {
  id:        number;
  username:  string;
  password:  string;
  email:     string;
  pixelArts: PixelArtUserDto[];
}

export interface PixelArtUserDto {
  id:          number;
  image:       string;
  title:       string;
  description: string;
}
