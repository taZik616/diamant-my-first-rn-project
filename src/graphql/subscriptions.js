/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateCart = /* GraphQL */ `
  subscription OnCreateCart($owner: String) {
    onCreateCart(owner: $owner) {
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
export const onUpdateCart = /* GraphQL */ `
  subscription OnUpdateCart($owner: String) {
    onUpdateCart(owner: $owner) {
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
export const onDeleteCart = /* GraphQL */ `
  subscription OnDeleteCart($owner: String) {
    onDeleteCart(owner: $owner) {
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
export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost {
    onCreatePost {
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
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost {
    onUpdatePost {
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
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost {
    onDeletePost {
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
export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct {
    onCreateProduct {
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
export const onUpdateProduct = /* GraphQL */ `
  subscription OnUpdateProduct {
    onUpdateProduct {
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
export const onDeleteProduct = /* GraphQL */ `
  subscription OnDeleteProduct {
    onDeleteProduct {
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
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment($owner: String) {
    onCreateComment(owner: $owner) {
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
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment($owner: String) {
    onUpdateComment(owner: $owner) {
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
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment($owner: String) {
    onDeleteComment(owner: $owner) {
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
export const onCreatePerformance = /* GraphQL */ `
  subscription OnCreatePerformance {
    onCreatePerformance {
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
export const onUpdatePerformance = /* GraphQL */ `
  subscription OnUpdatePerformance {
    onUpdatePerformance {
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
export const onDeletePerformance = /* GraphQL */ `
  subscription OnDeletePerformance {
    onDeletePerformance {
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
export const onCreateSwiperItem = /* GraphQL */ `
  subscription OnCreateSwiperItem {
    onCreateSwiperItem {
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
export const onUpdateSwiperItem = /* GraphQL */ `
  subscription OnUpdateSwiperItem {
    onUpdateSwiperItem {
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
export const onDeleteSwiperItem = /* GraphQL */ `
  subscription OnDeleteSwiperItem {
    onDeleteSwiperItem {
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
export const onCreateArticles = /* GraphQL */ `
  subscription OnCreateArticles {
    onCreateArticles {
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
export const onUpdateArticles = /* GraphQL */ `
  subscription OnUpdateArticles {
    onUpdateArticles {
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
export const onDeleteArticles = /* GraphQL */ `
  subscription OnDeleteArticles {
    onDeleteArticles {
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
