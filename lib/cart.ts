type CartItem = {
  handle: string;
  title: string;
  brand: string;
  volume?: string | null;
  price: number;
  image: string;
  quantity: number;
  sku: string;
  type?: string;
};

export const addToCart = (item: CartItem) => {
  if (typeof window !== 'undefined') {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cart.findIndex((i: CartItem) => i.sku === item.sku);
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
  }
};
