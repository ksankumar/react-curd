/**
 * index.js Created by sandy on 1/29/2020
 */
module.exports = {
    DB_URL: process.env.MONGODB_URI || 'mongodb://sandy:San.2020@ds233258.mlab.com:33258/ffn-assessment' || 'mongodb://localhost/demodb',
    // MLAB: 'mongodb://sandy:San.2020@ds233258.mlab.com:33258/ffn-assessment',
    PORT: '9090',
    options: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }
}
