/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCart = /* GraphQL */ `
  query GetCart($id: ID!) {
    getCart(id: $id) {
      id
      owner
      username
      productsId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listCarts = /* GraphQL */ `
  query ListCarts(
    $filter: ModelCartFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCarts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        owner
        username
        productsId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncCarts = /* GraphQL */ `
  query SyncCarts(
    $filter: ModelCartFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncCarts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        owner
        username
        productsId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      title
      description
      image
      text
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        image
        text
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncPosts = /* GraphQL */ `
  query SyncPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPosts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        title
        description
        image
        text
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getProduct = /* GraphQL */ `
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      name
      performance {
        items {
          id
          prodID
          title
          value
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      image
      cost
      availability
      category
      subCategory
      subCategoryId
      stars
      totalStars
      discount
      article
      comments {
        items {
          id
          prodID
          owner
          username
          commentText
          stars
          createDate
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      commentators
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listProducts = /* GraphQL */ `
  query ListProducts(
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        performance {
          nextToken
          startedAt
        }
        image
        cost
        availability
        category
        subCategory
        subCategoryId
        stars
        totalStars
        discount
        article
        comments {
          nextToken
          startedAt
        }
        commentators
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncProducts = /* GraphQL */ `
  query SyncProducts(
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncProducts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        performance {
          nextToken
          startedAt
        }
        image
        cost
        availability
        category
        subCategory
        subCategoryId
        stars
        totalStars
        discount
        article
        comments {
          nextToken
          startedAt
        }
        commentators
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      prodID
      prod {
        id
        name
        performance {
          nextToken
          startedAt
        }
        image
        cost
        availability
        category
        subCategory
        subCategoryId
        stars
        totalStars
        discount
        article
        comments {
          nextToken
          startedAt
        }
        commentators
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      owner
      username
      commentText
      stars
      createDate
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        prodID
        prod {
          id
          name
          image
          cost
          availability
          category
          subCategory
          subCategoryId
          stars
          totalStars
          discount
          article
          commentators
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        owner
        username
        commentText
        stars
        createDate
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncComments = /* GraphQL */ `
  query SyncComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncComments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        prodID
        prod {
          id
          name
          image
          cost
          availability
          category
          subCategory
          subCategoryId
          stars
          totalStars
          discount
          article
          commentators
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        owner
        username
        commentText
        stars
        createDate
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getPerformance = /* GraphQL */ `
  query GetPerformance($id: ID!) {
    getPerformance(id: $id) {
      id
      prodID
      prod {
        id
        name
        performance {
          nextToken
          startedAt
        }
        image
        cost
        availability
        category
        subCategory
        subCategoryId
        stars
        totalStars
        discount
        article
        comments {
          nextToken
          startedAt
        }
        commentators
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      title
      value
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listPerformances = /* GraphQL */ `
  query ListPerformances(
    $filter: ModelPerformanceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPerformances(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        prodID
        prod {
          id
          name
          image
          cost
          availability
          category
          subCategory
          subCategoryId
          stars
          totalStars
          discount
          article
          commentators
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        title
        value
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncPerformances = /* GraphQL */ `
  query SyncPerformances(
    $filter: ModelPerformanceFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPerformances(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        prodID
        prod {
          id
          name
          image
          cost
          availability
          category
          subCategory
          subCategoryId
          stars
          totalStars
          discount
          article
          commentators
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        title
        value
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getSwiperItem = /* GraphQL */ `
  query GetSwiperItem($id: ID!) {
    getSwiperItem(id: $id) {
      id
      href
      buttonText
      image
      text
      hrefPath
      toScreen
      category
      subCategory
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listSwiperItems = /* GraphQL */ `
  query ListSwiperItems(
    $filter: ModelSwiperItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSwiperItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        href
        buttonText
        image
        text
        hrefPath
        toScreen
        category
        subCategory
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncSwiperItems = /* GraphQL */ `
  query SyncSwiperItems(
    $filter: ModelSwiperItemFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncSwiperItems(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        href
        buttonText
        image
        text
        hrefPath
        toScreen
        category
        subCategory
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getArticles = /* GraphQL */ `
  query GetArticles($id: ID!) {
    getArticles(id: $id) {
      id
      allArticle
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listArticles = /* GraphQL */ `
  query ListArticles(
    $filter: ModelArticlesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listArticles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        allArticle
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncArticles = /* GraphQL */ `
  query SyncArticles(
    $filter: ModelArticlesFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncArticles(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        allArticle
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
