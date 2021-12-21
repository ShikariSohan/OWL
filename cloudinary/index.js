const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage}=require('multer-storage-cloudinary');
cloudinary.config({
    cloud_name: process.env.CloudinaryCloudName,
    api_key: process.env.CloudinaryKey,
    api_secret: process.env.CloudinaryApiSecret
});
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
    folder:'StudentForum',
    allowedFormats: ['jpg','png','jpeg','ico'],
    // transformation: [{
    //     width: 300,
    //     height: 300,
    //     gravity: "faces",
    //     crop: "fill"

    // }],
    }
});
const storage2 = new CloudinaryStorage({
    cloudinary,
    params: {
    folder:'StudentForumPosts',
    allowedFormats: ['jpg','png','jpeg'],
    }
});
const IDstorage = new CloudinaryStorage({
    cloudinary,
    params: {
    folder:'StudentIDS',
    allowedFormats: ['jpg','png','jpeg'],
    }
});

module.exports = {
    cloudinary,
    storage,
    storage2,
    IDstorage
}