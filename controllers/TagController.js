'use strict'

const {Tag, Feed} = require('../models/index')

class TagController {
    static showAllTags(req, res) {
        const fullName = req.session.fullName;
        const options = {
            include: Feed
        };
        const tagsData = [];
        Tag.findAll(options)
            .then((tags) => {
                tags.forEach(tag => {
                    tagsData.push({
                        name: tag.name,
                        count: tag.Feeds.length
                    });
                });
                // res.send(tagsData);
                res.render('tags/list', {tagsData, fullName});
            }).catch((err) => {
                res.send(err);
            });
    }
}

module.exports = TagController

