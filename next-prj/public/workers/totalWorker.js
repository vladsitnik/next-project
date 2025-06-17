self.onmessage = function (e) {
  const { products, orderId, currency } = e.data

  const total = products
    .filter((p) => p.order === orderId)
    .reduce((sum, p) => {
      const val = p.price.find((x) => x.symbol === currency)?.value || 0
      return sum + val
    }, 0)

  self.postMessage({ orderId, currency, total })
}