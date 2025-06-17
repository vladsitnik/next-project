import { createSlice } from '@reduxjs/toolkit';
import { Product } from '@/types';

interface ProductsState {
  list: Product[];
}

const initialState: ProductsState = {
  list: [],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.list = action.payload;
    },
    removeProduct: (state, action) => {
      state.list = state.list.filter((product) => product.id !== action.payload);
    },
  },
});

export const { setProducts, removeProduct } = productsSlice.actions;
export default productsSlice.reducer;