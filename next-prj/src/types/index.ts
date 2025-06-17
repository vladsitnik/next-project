export interface Order {
  id: number
  title: string
  date: string
  description: string
}

export interface Guarantee {
  start: string
  end: string
}

export interface Price {
  value: number
  symbol: string
  isDefault: boolean
}

export interface Product {
  id: number
  serialNumber: number
  isNew: boolean
  photo: string
  title: string
  type: string
  specification: string
  guarantee: Guarantee
  price: Price[]
  order: number
  date: string
}
