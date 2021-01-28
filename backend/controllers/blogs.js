const blogsRouter = require('express').Router();
const Blog = require('../models/blogs');

blogsRouter.get('/', async (request, response) => {
    let blogs = await Blog.find({});
    response.json(blogs);
})

blogsRouter.get('/:id', async (request, response) => {
    let blog = await Blog.findById(request.params.id);
    response.json(blog);
})

blogsRouter.post('/', async (request, response) => {
    if (!request.body.title || !request.body.url) {
        response.status(400).json({ error: 'Blog title or URL missing from request' });
        return;
    }
    const blog = new Blog(request.body);
    let result = await blog.save();
    response.status(201).json(result);
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