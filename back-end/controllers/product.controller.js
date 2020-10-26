/**
 * product.controller.js Created by sandy on 1/30/2020
 */
const Product = require('../models/product.schema');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

exports.product_create = function (req, res) {
    let product = new Product(
        {
            name: req.body.name,
            price: req.body.price
        }
    );

    product.save(function (err) {
        if (err) {
            return res.status(400).json({ 'code': err.code });
            // return next(err);
        }
        res.send('Product Created successfully')
    })
};

exports.product_list = function (req, res) {
    Product.find({}, function (err, product) {
        if (err) return res.status(400).json({ 'code': err.code });
        res.send(product);
    })
}
exports.product_details = function (req, res) {
    Product.findById(req.params.id, function (err, product) {
        if (err) return res.status(400).json({ 'code': err.code });
        res.send(product);
    })
};

exports.product_update = function (req, res) {
    Product.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, product) {
        if (err) return res.status(400).json({ 'code': err.code });
        res.send('Product udpated.');
    });
};

exports.product_delete = function (req, res) {
    Product.findByIdAndRemove(req.params.id, function (err) {
        if (err) return res.status(400).json({ 'code': err.code });
        res.send('Deleted successfully!');
    })
};
