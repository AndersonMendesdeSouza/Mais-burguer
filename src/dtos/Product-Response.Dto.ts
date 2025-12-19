export interface ProductResponseDto {
  id: number;
  name: string;
  desc?: string;
  price: number;
  img: string;
  badge?: string;
  category: string;
};