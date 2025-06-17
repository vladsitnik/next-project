import { createSlice} from '@reduxjs/toolkit'
import { Order } from '../types'

interface OrdersState {
  list: Order[]
  selectedOrderId: number | null
}

const initialState: OrdersState = {
  list: [],
  selectedOrderId: null,
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.list = action.payload
    },
    removeOrder: (state, action) => {
      state.list = state.list.filter((order) => order.id !== action.payload)
    },
    selectOrder: (state, action) => {
      state.selectedOrderId = action.payload
    },
    clearSelectedOrder: (state) => {
      state.selectedOrderId = null
    },
  },
})

export const { setOrders, removeOrder, selectOrder, clearSelectedOrder } = ordersSlice.actions
export default ordersSlice.reducer