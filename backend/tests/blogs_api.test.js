const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blogs');

const initialBlogs = [{ _id: "5a422a851b54a676234d17f7", title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7, __v: 0 }, { _id: "5a422aa71b54a676234d17f8", title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5, __v: 0 }
]

beforeEach(async () => {
    await Blog.deleteMany({});
    for (blog of initialBlogs) {
        let blogObject = new Blog(blog);
        await blogObject.save()
    }
})

test('returns blog posts', async () => {
    await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
})

test('id property is present in returned object', async () => {
    let returnObj = await api.get('/api/blogs');
    expect(returnObj.body[0].id).toBeDefined();
})

test('blog entries can be created', async () => {
    const newBlog = { _id: "5a422bc61b54a676234d17fc", title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2, __v: 0 };

    await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/)

    let response = await api.get('/api/blogs');

    let content = response.body.map(r => r.title)

    expect(content).toHaveLength(initialBlogs.length + 1);

    expect(content).toContain('Type wars');
})

test('missing likes field defaults to 0', async () => {
    const sampleBlog = { _id: "41224d776a326fb40f000001", title: "On Reading Documentation", author: "Chizo C. Nwazuo", url: "http://chizo.me", __v: 0 }

    await api.post('/api/blogs').send(sampleBlog).expect(201).expect('Content-Type', /application\/json/)

    let response = await api.get(`/api/blogs/${sampleBlog._id}`);
    let content = response.body;

    expect(content.title).toContain('Reading Documentation');

    expect(content.likes).toBe(0);

})

test('missing title or url field returns bad request', async () => {
    const sampleBlog = { _id: "303030303030303030303030", author: "Marijn Haverbeke" }

    await api.post('/api/blogs').send(sampleBlog).expect(400);
})

test('delete request deletes resource', async () => {
    const toBeDeletedId = '5a422a851b54a676234d17f7';
    await api.delete(`/api/blogs/${toBeDeletedId}`).expect(204);

    let getNotes = await api.get('/api/blogs');
    expect(getNotes.body).toHaveLength(initialBlogs.length - 1);
})

test.only('blog entry can be updated with new values', async () => {
    const update = {
        title: 'Something to be updated',
        author: 'Chizo Nwazuo'
    }
    const id = '5a422a851b54a676234d17f7';

    let result = await api.put(`/api/blogs/${id}`).send(update);

    expect(result.body.title).toContain('Something to be updated');

})

afterAll(() => {
    mongoose.connection.close();
})
