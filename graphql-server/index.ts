import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { products, orders } from './mockData';

const typeDefs = `#graphql
  type Price {
    value: Float
    symbol: String
    isDefault: Boolean
  }

  type Guarantee {
    start: String
    end: String
  }

  type Product {
    id: Int
    serialNumber: Int
    isNew: Boolean
    photo: String
    title: String
    type: String
    specification: String
    guarantee: Guarantee
    price: [Price]
    order: Int
    date: String
  }

  type Order {
    id: Int
    title: String
    date: String
    description: String
  }

  type Query {
    products: [Product]
    orders: [Order]
    productsByOrder(orderId: Int!): [Product]
  }
`;

const resolvers = {
  Query: {
    products: () => products,
    orders: () => orders,
    productsByOrder: (_: any, { orderId }: { orderId: number }) =>
      products.filter((p) => p.order === orderId),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});