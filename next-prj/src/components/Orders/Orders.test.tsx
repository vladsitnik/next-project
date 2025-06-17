import { render, screen, fireEvent } from '@testing-library/react'
import Orders from './Orders'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import ordersReducer from '@/store/ordersSlice'
import productsReducer from '@/store/productsSlice'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'


const orders = [
  { id: 1, title: 'Order 1', date: '2017-06-29 12:09:33', description: 'desc' },
  { id: 2, title: 'Order 2', date: '2017-06-29 12:09:33', description: 'desc' },
  { id: 3, title: 'Order 3', date: '2017-06-29 12:09:33', description: 'desc' },
]

const products = [
  {
    id: 1,
    serialNumber: 1234,
    isNew: true,
    photo: 'pathToFile.jpg',
    title: 'Product 1',
    type: 'Monitors',
    specification: 'Specification 1',
    guarantee: {
      start: '2017-06-29 12:09:33',
      end: '2018-06-29 12:09:33',
    },
    price: [
      { value: 100, symbol: 'USD', isDefault: false },
      { value: 2600, symbol: 'UAH', isDefault: true },
    ],
    order: 1,
    date: '2017-06-29 12:09:33',
  },
  {
    id: 2,
    serialNumber: 5678,
    isNew: false,
    photo: 'pathToFile.jpg',
    title: 'Product 2',
    type: 'Monitors',
    specification: 'Specification 2',
    guarantee: {
      start: '2017-06-29 12:09:33',
      end: '2019-06-29 12:09:33',
    },
    price: [
      { value: 200, symbol: 'USD', isDefault: false },
      { value: 5200, symbol: 'UAH', isDefault: true },
    ],
    order: 2,
    date: '2017-06-29 12:09:33',
  },
]
class WorkerMock {
  postMessage = jest.fn()
  terminate = jest.fn()
  onmessage: ((e: MessageEvent<{ total: number }>) => void) | null = null
}
global.Worker = WorkerMock as unknown as typeof Worker

const customRender = () => {
  const store = configureStore({
    reducer: {
      orders: ordersReducer,
      products: productsReducer,
    },
    preloadedState: {
      orders: {
        list: orders,
        selectedOrderId: null,
      },
      products: {
        list: products,
      },
    },
  })

  return render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <Orders />
      </I18nextProvider>
    </Provider>
  )
}

describe('Orders component', () => {
  it('renders all orders', () => {
    customRender()
    expect(screen.getByText('Order 1')).toBeInTheDocument()
    expect(screen.getByText('Order 2')).toBeInTheDocument()
    expect(screen.getByText('Order 3')).toBeInTheDocument()
  })

  it('shows chart when button clicked', () => {
    customRender()
    const button = screen.getByRole('button', { name: /показать график/i })
    fireEvent.click(button)
    expect(screen.getByText(/скрыть график/i)).toBeInTheDocument()
  })

  it('opens delete modal on trash icon click', () => {
    customRender()
    const trashButtons = screen.getAllByRole('button')
    fireEvent.click(trashButtons[0]) 
     expect(screen.findByText(/вы уверены/i)).resolves.toBeInTheDocument()
  })
})