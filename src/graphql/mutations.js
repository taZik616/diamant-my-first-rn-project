/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPost = /* GraphQL */ `
  mutation CreatePost(
    $input: CreatePostInput!
    $condition: ModelPostConditionInput
  ) {
    createPost(input: $input, condition: $condition) {
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
export const updatePost = /* GraphQL */ `
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
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
export const deletePost = /* GraphQL */ `
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
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
export const createProduct = /* GraphQL */ `
  mutation CreateProduct(
    $input: CreateProductInput!
    $condition: ModelProductConditionInput
  ) {
    createProduct(input: $input, condition: $condition) {
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
export const updateProduct = /* GraphQL */ `
  mutation UpdateProduct(
    $input: UpdateProductInput!
    $condition: ModelProductConditionInput
  ) {
    updateProduct(input: $input, condition: $condition) {
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
export const deleteProduct = /* GraphQL */ `
  mutation DeleteProduct(
    $input: DeleteProductInput!
    $condition: ModelProductConditionInput
  ) {
    deleteProduct(input: $input, condition: $condition) {
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
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
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
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
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
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
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
export const createPerformance = /* GraphQL */ `
  mutation CreatePerformance(
    $input: CreatePerformanceInput!
    $condition: ModelPerformanceConditionInput
  ) {
    createPerformance(input: $input, condition: $condition) {
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
export const updatePerformance = /* GraphQL */ `
  mutation UpdatePerformance(
    $input: UpdatePerformanceInput!
    $condition: ModelPerformanceConditionInput
  ) {
    updatePerformance(input: $input, condition: $condition) {
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
export const deletePerformance = /* GraphQL */ `
  mutation DeletePerformance(
    $input: DeletePerformanceInput!
    $condition: ModelPerformanceConditionInput
  ) {
    deletePerformance(input: $input, condition: $condition) {
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
export const createCart = /* GraphQL */ `
  mutation CreateCart(
    $input: CreateCartInput!
    $condition: ModelCartConditionInput
  ) {
    createCart(input: $input, condition: $condition) {
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
export const updateCart = /* GraphQL */ `
  mutation UpdateCart(
    $input: UpdateCartInput!
    $condition: ModelCartConditionInput
  ) {
    updateCart(input: $input, condition: $condition) {
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
export const deleteCart = /* GraphQL */ `
  mutation DeleteCart(
    $input: DeleteCartInput!
    $condition: ModelCartConditionInput
  ) {
    deleteCart(input: $input, condition: $condition) {
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
export const createSwiperItem = /* GraphQL */ `
  mutation CreateSwiperItem(
    $input: CreateSwiperItemInput!
    $condition: ModelSwiperItemConditionInput
  ) {
    createSwiperItem(input: $input, condition: $condition) {
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
export const updateSwiperItem = /* GraphQL */ `
  mutation UpdateSwiperItem(
    $input: UpdateSwiperItemInput!
    $condition: ModelSwiperItemConditionInput
  ) {
    updateSwiperItem(input: $input, condition: $condition) {
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
export const deleteSwiperItem = /* GraphQL */ `
  mutation DeleteSwiperItem(
    $input: DeleteSwiperItemInput!
    $condition: ModelSwiperItemConditionInput
  ) {
    deleteSwiperItem(input: $input, condition: $condition) {
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
export const createArticles = /* GraphQL */ `
  mutation CreateArticles(
    $input: CreateArticlesInput!
    $condition: ModelArticlesConditionInput
  ) {
    createArticles(input: $input, condition: $condition) {
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
export const updateArticles = /* GraphQL */ `
  mutation UpdateArticles(
    $input: UpdateArticlesInput!
    $condition: ModelArticlesConditionInput
  ) {
    updateArticles(input: $input, condition: $condition) {
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
export const deleteArticles = /* GraphQL */ `
  mutation DeleteArticles(
    $input: DeleteArticlesInput!
    $condition: ModelArticlesConditionInput
  ) {
    deleteArticles(input: $input, condition: $condition) {
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
