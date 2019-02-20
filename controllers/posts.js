const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  console.log('Userdata: ' + req.userData.email);
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post Added Successfully!',
      post: {
        ...createdPost,
        id: createdPost._id
      }
   });
  }).catch(error => {
    res.status(500).json({ message: 'Creating a Post failed!'})
  });

}

exports.getAllPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments();
    }).then(count => {
      return res.status(200).json({
        message: 'Posts fetched successfully',
        posts: fetchedPosts,
        totalPosts: count
      });
    }).catch(error => {
      console.log(error);
      res.status(500).json({ message: 'Fetching Posts Failed !'});
    });
  }

  exports.getPostById = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'Post not Found!' });
      }
    }).catch(error => {
      res.status(500).json({ message: 'Fetching Post Failed !'});
    });
  }

  exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/' + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    Post.updateOne( { _id: req.params.postId, creator: req.userData.userId }, post )
    .then((response) => {
      if (response.n > 0) {
        res.status(200).json({ message: 'Update Successful' });
      } else {
        res.status(401).json({ message: 'Not Authorised!' });
      }
    }).catch(error => {
      res.status(500).json({ message: 'Could not Update Post!' });
    });
  }

  exports.deletePostById = (req, res, next) => {
    Post.deleteOne( {_id: req.params.id, creator: req.userData.userId} ).then(response => {
      if (response.n > 0) {
        res.status(200).json({ message: 'Deletion Successful' });
      } else {
        res.status(200).json({ message: 'You are not Authorised!' });
      }
    }).catch(error => {
      res.status(401).json({ message: 'Deleting Post Failed!'});
    });

  }
