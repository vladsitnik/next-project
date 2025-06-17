import { render, screen } from '@testing-library/react'
import Products from './Products'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import productsReducer from '@/store/productsSlice'
import ordersReducer from '@/store/ordersSlice'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'

const preloadedState = {
  products: {
    list: [
      {
        id: 1,
        serialNumber: 1234,
        isNew: true,
        photo: '',
        title: 'Monitor Pro',
        type: 'Monitors',
        specification: 'Specs',
        guarantee: {
          start: '2023-01-01',
          end: '2024-01-01',
        },
        price: [{ value: 100, symbol: 'USD', isDefault: true }],
        order: 1,
        date: '2023-01-01',
      },
    ],
  },
  orders: {
    list: [{ id: 1, title: 'Order 1', date: '2023-01-01', description: '' }],
    selectedOrderId: null,
  },
}

const renderWithProviders = (ui: React.ReactElement, state = preloadedState) => {
  const store = configureStore({
    reducer: {
      products: productsReducer,
      orders: ordersReducer,
    },
    preloadedState: state,
  })

  return render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
    </Provider>
  )
}

describe('Products component', () => {
  it('renders product title', () => {
    renderWithProviders(<Products />)
    expect(screen.getByText('Monitor Pro')).toBeInTheDocument()
  })

  it('renders correct type in filter dropdown', () => {
    renderWithProviders(<Products />)
    expect(screen.getByRole('option', { name: 'Monitors' })).toBeInTheDocument()
  })
})