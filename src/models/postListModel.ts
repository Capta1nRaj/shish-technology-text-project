import mongoose from 'mongoose';

const postListModel = new mongoose.Schema({
    title: String,
    shortDescription: String,
    longDescription: String,
    category: String,
    image: String
});

postListModel.index({ treatment: 1 })

export default mongoose.models.postList || mongoose.model('postList', postListModel);