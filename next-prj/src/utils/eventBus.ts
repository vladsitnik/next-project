export interface EventMap {
  'order:deleted': { id: number }
  'product:added': { productId: number; orderId: number }
}

type EventKey = keyof EventMap
type Handler<K extends EventKey> = (payload: EventMap[K]) => void

class EventBus {
  private listeners: {
    [K in EventKey]: Set<Handler<K>>
  } = {
    'order:deleted': new Set<Handler<'order:deleted'>>(),
    'product:added': new Set<Handler<'product:added'>>(),
  }

  on<K extends EventKey>(event: K, handler: Handler<K>): void {
    this.listeners[event].add(handler)
  }

  off<K extends EventKey>(event: K, handler: Handler<K>): void {
    this.listeners[event].delete(handler)
  }

  emit<K extends EventKey>(event: K, payload: EventMap[K]): void {
    this.listeners[event].forEach(handler => handler(payload))
  }

  clear<K extends EventKey>(event: K): void {
    this.listeners[event].clear()
  }
}

const eventBus = new EventBus()
export default eventBus