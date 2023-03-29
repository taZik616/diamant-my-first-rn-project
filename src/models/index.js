// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Post, Product, Performance, Comment, Cart, SwiperItem, Articles } = initSchema(schema);

export {
  Post,
  Product,
  Performance,
  Comment,
  Cart,
  SwiperItem,
  Articles
};