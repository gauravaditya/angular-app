const express = require('express');

const router = express.Router();

const PostsController = require('../controllers/posts');

const checkAuth = require('../middleware/check-auth');

const extractFile = require('../middleware/file-extract');


router.post('', checkAuth, extractFile, PostsController.createPost);

router.get('', PostsController.getAllPosts);

router.get('/:id', PostsController.getPostById);

router.put('/:postId', checkAuth, extractFile, PostsController.updatePost);

router.delete('/:id', checkAuth, PostsController.deletePostById );

module.exports = router;
