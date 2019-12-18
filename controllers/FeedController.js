const {Feed, Tag, FeedTags} = require('../models');

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
        const tagsAdd = req.body.tagsName.split(',');
        const tagsIdFound = [];
        const arrFeedTags = [];
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
                    userId: req.params.id
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
                res.send(addedFeedTags);
                // res.redirect('/feed?success=Feed sucessfully added');
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
}

module.exports = FeedController

