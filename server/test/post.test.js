const axios = require('axios');
const { log } = require('console');
const crypto = require('crypto');
const { hasUncaughtExceptionCaptureCallback } = require('process');
const postService = require('../service/postService');

const generate = function(){
    return crypto.randomBytes(20).toString('hex');
}

const request = function(url, method, data){
    return axios({url, method, data, validateStatus: false});
};

test('Should get posts', async function(){
    const post1 = await postService.savePost({title: generate(), content: generate()});
    const post2 = await postService.savePost({title: generate(), content: generate()});
    const post3 = await postService.savePost({title: generate(), content: generate()});
    
    const response = await request('http://localhost:3000/posts','get');

    expect(response.status).toBe(200);

    const posts = response.data;
    expect(posts).toHaveLength(3);
    await postService.deletePost(post1.id);
    await postService.deletePost(post2.id);
    await postService.deletePost(post3.id);

});

test('Should save post', async function(){
    const data = {title: generate(), content: generate()};
    const response = await request('http://localhost:3000/posts', 'post', data);
    expect(response.status).toBe(201);

    const post = response.data;
    expect(post.title).toBe(data.title);
    expect(post.content).toBe(data.content);
    await postService.deletePost(post.id);
});

test('Should update a post', async function(){
    const post = await postService.savePost({title: generate(), content: generate()});
    post.title = generate();
    post.content = generate();
    const response = await request(`http://localhost:3000/posts/${post.id}`, 'put', post);
    expect(response.status).toBe(204);
    const updatedPost = await postService.getPost(post.id);
    expect(updatedPost.title).toBe(post.title);
    expect(updatedPost.content).toBe(post.content);
    await postService.deletePost(post.id);
});

test('Should delete a post', async function(){
    const post = await postService.savePost({title: generate(), content: generate()});

    const response = await request(`http://localhost:3000/posts/${post.id}`, 'delete');
    expect(response.status).toBe(204);
    const posts = await postService.getPosts();
    expect(posts).toHaveLength(0);
});

test('Should not update a post', async function(){
    const post = {
        id: 1
    };
    const response = await request(`http://localhost:3000/posts/${post.id}`, 'put', post);
    expect(response.status).toBe(404);
});

test('Should not delete a post', async function(){
    const post = {
        id: 1
    };
    const response = await request(`http://localhost:3000/posts/${post.id}`, 'delete');
    expect(response.status).toBe(404);
});

test('Should not save post', async function(){
    const data = {title: generate(), content: generate()};
    
    const response1 = await request('http://localhost:3000/posts', 'post', data);
    const response2 = await request('http://localhost:3000/posts', 'post', data);
    
    expect(response2.status).toBe(409);

    const post = response1.data;
    await postService.deletePost(post.id);
});
