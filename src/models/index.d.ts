import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type PostMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ProductMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type PerformanceMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CommentMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CartMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type SwiperItemMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ArticlesMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Post {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly text: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Post, PostMetaData>);
  static copyOf(source: Post, mutator: (draft: MutableModel<Post, PostMetaData>) => MutableModel<Post, PostMetaData> | void): Post;
}

export declare class Product {
  readonly id: string;
  readonly name: string;
  readonly performance?: (Performance | null)[] | null;
  readonly image: string;
  readonly cost: number;
  readonly availability: (boolean | null)[];
  readonly category: string;
  readonly subCategory?: (string | null)[] | null;
  readonly subCategoryId?: number | null;
  readonly stars?: (number | null)[] | null;
  readonly totalStars?: number | null;
  readonly discount?: number | null;
  readonly article: string;
  readonly comments?: (Comment | null)[] | null;
  readonly commentators?: (string | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Product, ProductMetaData>);
  static copyOf(source: Product, mutator: (draft: MutableModel<Product, ProductMetaData>) => MutableModel<Product, ProductMetaData> | void): Product;
}

export declare class Performance {
  readonly id: string;
  readonly prod: Product;
  readonly title: string;
  readonly value: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Performance, PerformanceMetaData>);
  static copyOf(source: Performance, mutator: (draft: MutableModel<Performance, PerformanceMetaData>) => MutableModel<Performance, PerformanceMetaData> | void): Performance;
}

export declare class Comment {
  readonly id: string;
  readonly prod: Product;
  readonly owner: string;
  readonly username: string;
  readonly commentText: string;
  readonly stars: number;
  readonly createDate: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Comment, CommentMetaData>);
  static copyOf(source: Comment, mutator: (draft: MutableModel<Comment, CommentMetaData>) => MutableModel<Comment, CommentMetaData> | void): Comment;
}

export declare class Cart {
  readonly id: string;
  readonly owner: string;
  readonly username: string;
  readonly productsId?: (string | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Cart, CartMetaData>);
  static copyOf(source: Cart, mutator: (draft: MutableModel<Cart, CartMetaData>) => MutableModel<Cart, CartMetaData> | void): Cart;
}

export declare class SwiperItem {
  readonly id: string;
  readonly href?: boolean | null;
  readonly buttonText?: string | null;
  readonly image: string;
  readonly text: string;
  readonly hrefPath?: string | null;
  readonly toScreen?: string | null;
  readonly category?: string | null;
  readonly subCategory?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<SwiperItem, SwiperItemMetaData>);
  static copyOf(source: SwiperItem, mutator: (draft: MutableModel<SwiperItem, SwiperItemMetaData>) => MutableModel<SwiperItem, SwiperItemMetaData> | void): SwiperItem;
}

export declare class Articles {
  readonly id: string;
  readonly allArticle?: (string | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Articles, ArticlesMetaData>);
  static copyOf(source: Articles, mutator: (draft: MutableModel<Articles, ArticlesMetaData>) => MutableModel<Articles, ArticlesMetaData> | void): Articles;
}