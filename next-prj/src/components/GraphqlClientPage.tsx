'use client'

import { gql, useQuery } from '@apollo/client'
import { Order } from '@/types'

const GET_ORDERS = gql`
  query GetOrders {
    orders {
      id
      title
      date
    }
  }
`

const GraphPage = () => {
  const { data, loading, error } = useQuery<{ orders: Order[] }>(GET_ORDERS)

  if (loading || error) {
    return <p>{error?.message || 'Загрузка...'}</p>
  }

  return (
    <div className="p-4">
      <h3>Orders (GraphQL):</h3>
      <ul>
        {data?.orders.map((order) => (
          <li key={order.id}>
            <strong>{order.title}</strong> — {order.date}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default GraphPage