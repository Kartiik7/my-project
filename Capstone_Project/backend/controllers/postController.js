const Post = require('../models/postModel');

// @desc    Get all posts
// @route   GET /api/posts
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'name email');
        res.json({ success: true, count: posts.length, data: posts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create a post
// @route   POST /api/posts
exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = await Post.create({
            title,
            content,
            author: req.user.id
        });
        res.status(201).json({ success: true, data: post });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
exports.updatePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        
        // --- OWNERSHIP CHECK ---
        if (req.user.role === 'Editor' && post.author.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'User is not authorized to update this post' 
            });
        }

        post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.json({ success: true, data: post });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // --- OWNERSHIP CHECK ---
        if (req.user.role === 'Editor' && post.author.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'User is not authorized to delete this post' 
            });
        }
        
        await post.deleteOne();
        res.json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
