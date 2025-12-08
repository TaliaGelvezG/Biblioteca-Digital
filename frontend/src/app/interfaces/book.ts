export interface Book {
  id : string,
  title: string,
  author: string,
  year: number,
  description: string,
  image: string,
  category: string,
  state: 'loaned' | 'available',
}
