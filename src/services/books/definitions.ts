export interface IBook {
  id: number;
  title: string;
  editorial: string;
  price: number;
  cover?: string;
  level?: string;
  grade?: number;
  stock: number;
  active: boolean;
}
