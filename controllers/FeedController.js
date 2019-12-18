'use strict'

const {Feed, Tag, FeedTags} = require('../models');
const fs = require('fs');

class FeedController {
    static showFeed(req, res) {
        const options = {
            include: Tag,
            order: [['createdAt','ASC']]
        };
        Feed.findAll(options)
            .then((feeds) => {
                // res.send(feeds);
                res.render('feeds/list', {feeds});
            }).catch((err) => {
                res.send(err);
            });
    }

    static showAddFeedForm(req, res) {
        res.render('feeds/add');
    }

    static addFeed(req, res) {
        // const data = {
        //     file: req.file.filename,
        //     body: req.body
        // };
        // res.send(data);
        const tagsAdd = req.body.tagsName.split(',');
        const tagsIdFound = [];
        const arrFeedTags = [];
        console.log(req.params.id);
        const options = {
            where: {
                name: tagsAdd
            }
        };
        Tag.findAll(options)
            .then((tags) => {
                tags.forEach(tag => {
                    tagsAdd.splice(tagsAdd.indexOf(tag.getDataValue('name')),1);
                    tagsIdFound.push(tag.getDataValue('id'));
                });
                for (let i = 0; i < tagsAdd.length; i++) {
                    tagsAdd[i] = {
                        name: tagsAdd[i]
                    }
                }

                // res.send(tagsAdd);
                return Tag.bulkCreate(tagsAdd);
            }).then((addedTags) => {
                addedTags.forEach(tag => {
                    tagsIdFound.push(tag.getDataValue('id'));
                });

                return Feed.create({
                    title: req.body.title,
                    content: req.body.content,
                    UserId: req.params.id
                });
            }).then((addedFeed) => {
                tagsIdFound.forEach(tagId => {
                    arrFeedTags.push({
                        FeedId: addedFeed.id,
                        TagId: tagId
                    });
                });

                return FeedTags.bulkCreate(arrFeedTags);
            }).then((addedFeedTags) => {
                // res.send(addedFeedTags);
                res.redirect(`/user/${req.params.id}`);
            }).catch((err) => {
                res.send(err);
                // res.redirect('/feed?err='+err);
            });
    }

    static showEditFeedForm(req, res) {
        const options = {
            include: Tag,
            where: req.params
        };
        Feed.findOne(options)
            .then((feed) => {
                // res.send(feed);
                res.render('feeds/edit', {feed});
            }).catch((err) => {
                res.send(err);
            });
    }

    static uploadImage(req, res) {
        const tempPath = req.file.path;
        const targetPath = path.join(__dirname, "./uploads/image.png");

        if (path.extname(req.file.originalname).toLowerCase() === ".png") {
            fs.rename(tempPath, targetPath, err => {
                if (err) return handleError(err, res);

                res
                    .status(200)
                    .contentType("text/plain")
                    .end("File uploaded!");
            });
        } else {
            fs.unlink(tempPath, err => {
                if (err) return handleError(err, res);

                res
                    .status(403)
                    .contentType("text/plain")
                    .end("Only .png files are allowed!");
            });
        }
    }
}

module.exports = FeedController

