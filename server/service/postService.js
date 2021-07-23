const postData = require('../data/postData');

exports.getPosts = function(){
    return postData.getPosts();
};

exports.getPost = async function(id){
    const post = await postData.getPost(id);
    if (!post) throw new Error('Post not found');
    return post;
}

exports.savePost = async function(post){
    const existingPost = await postData.getPostByTitle(post.title);
    if (existingPost) throw new Error("Post already exists")
    return postData.savePost(post);
};

exports.deletePost = async function(id){
    await exports.getPost(id);
    return postData.deletePost(id);
};

exports.updatePost = async function(id, post){
    await exports.getPost(id);
    return postData.updatePost(id, post);
};
