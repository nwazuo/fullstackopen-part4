const blogsRouter = require('express').Router();
const Blog = require('../models/blogs');
const User = require('../models/users');

blogsRouter.get('/', async (request, response) => {
    let blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    response.json(blogs);
})

blogsRouter.get('/:id', async (request, response) => {
    let blog = await Blog.findById(request.params.id)
        .populate('user', { username: 1, name: 1 });

    response.json(blog);
})

blogsRouter.post('/', async (request, response) => {
    if (!request.body.title || !request.body.url) {
        response.status(400).json({ error: 'Blog title or URL missing from request' });
        return;
    }
    let user = await User.findOne({});

    const newBlog = {
        _id: request.body._id,
        title: request.body.title,
        url: request.body.url,
        author: request.body.author,
        user: user.id
    }

    const blog = new Blog(newBlog);
    let savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog);
    await user.save();

    response.status(201).json(savedBlog);
})

blogsRouter.delete('/:id', async (request, response) => {
    let toBeDeleted = await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
})

blogsRouter.put('/:id', async (request, response) => {
    let updated = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true });
    response.status(400).json(updated);
})

module.exports = blogsRouter;