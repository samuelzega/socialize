'use strict'

const fs = require('fs');
const {Feed, Tag, FeedTags, User, LikeDislike} = require('../models');

class FeedController {
    static showFeed(req, res) {
        let feeds = null
        const options = {
            include: [Tag, User],
            order: [['createdAt','ASC']]
        };
        let promiseOptions;
        let feedsWithTags;
        let countLikeDislike;
        Feed.findAll(options)
            .then((feeds) => {
                feedsWithTags = feeds;
                promiseOptions = {
                    group: ['status','FeedId']
                };
                return LikeDislike.count(promiseOptions);
            }).then((countRes) => {
                countLikeDislike = countRes;
                promiseOptions = {
                    where: {
                        // nanti diubah dari session
                        UserId: 1
                    }
                };
                return LikeDislike.findAll(promiseOptions);
            }).then((userResponses) => {
                feedsWithTags.forEach(feed => {
                    let timeDiff = (new Date() - new Date(feed.createdAt).getTime()) / (1000*60*60*24);
                    let count = 0;

                    feed.setDataValue('timeDiff', timeDiff.toFixed(1));
                    feed.setDataValue('like', '0 like');
                    feed.setDataValue('dislike', '0 dislike');
                    for (let i = 0; i < countLikeDislike.length; i++) {
                        if (feed.id === countLikeDislike[i].FeedId) {
                            let msg;
                            if (countLikeDislike[i].count < 2) {
                                msg = `${countLikeDislike[i].count} ${countLikeDislike[i].status}`;
                            } else {
                                msg = `${countLikeDislike[i].count} ${countLikeDislike[i].status}s`;
                            }
                            feed.setDataValue(countLikeDislike[i].status, msg);
                            count++;
                        }
                        if (count === 2) {
                            break;
                        }
                    }
                    for (let i = 0; i < userResponses.length; i++) {
                        if (userResponses[i].FeedId === feed.id) {
                            feed.setDataValue('userResponse', userResponses[i].status);
                        }
                    }
                });

                res.render('feeds/list', {feeds: feedsWithTags});
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
                    UserId: req.session.userId
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
                res.redirect(`/user/page`);
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

    static showFeedTagged(req, res) {
        const tagOnFeeds = [];
        const tagName = req.params.tagName;
        let options = {
            include: Feed,
            where: {
                name: tagName
            }
        };

        Tag.findOne(options)
            .then((feedsTagged) => {
                if (!feedsTagged.id) {
                    throw 'Tag Not Found';
                }
                feedsTagged.Feeds.forEach(feed => {
                    options = {
                        include: [Tag, User],
                        where: {
                            id: feed.id
                        }
                    };
                    tagOnFeeds.push(Feed.findOne(options));
                });
                return Promise.all(tagOnFeeds);
            }).then((feeds) => {
                feeds.forEach(feed => {
                    let timeDiff = (new Date() - new Date(feed.createdAt).getTime()) / (1000*60*60*24);
                    feed.setDataValue('timeDiff', timeDiff.toFixed(1));
                });
                res.render('feeds/tagged', {tagName, feeds});
            }).catch((err) => {
                res.send(err);
            });
    }

    static like(req, res){
        const userId = req.session.userId

        const options = {
            where: {
                UserId: userId,
                FeedId: Number(req.params.feedId)
            }
        }
        LikeDislike.findOne(options)
            .then(data => {
                if (!data) {
                    return LikeDislike.create({
                        UserId: userId, 
                        FeedId: Number(req.params.feedId),
                        status: 'like'
                    })
                }else{
                    if (data['status'] === 'like') {
                        return LikeDislike.destroy({
                            where: {
                                UserId: userId, 
                                FeedId: Number(req.params.feedId)
                            }
                        })
                    } else {
                        return LikeDislike.update({
                            status: 'like'
                        },{
                            where: {
                                UserId: userId, 
                                FeedId: Number(req.params.feedId)
                            }
                        })
                    }
                }
            })
            .then(data => {
                res.redirect('/feeds')
            })
            .catch(err => {
                res.send(err)
            })
    }

    static dislike(req, res){
        // res.send(req.params)
        const userId = req.session.userId
        const options = {
            where: {
                UserId: userId,
                FeedId: Number(req.params.feedId)
            }
        }
        LikeDislike.findOne(options)
            .then(data => {
                if (!data) {
                    return LikeDislike.create({
                        UserId: userId, 
                        FeedId: Number(req.params.feedId),
                        status: 'dislike'
                    })
                }else{
                    if (data['status'] === 'dislike') {
                        return LikeDislike.destroy({
                            where: {
                                UserId: userId, 
                                FeedId: Number(req.params.feedId)
                            }
                        })
                    } else{
                        return LikeDislike.update({
                            status: 'dislike'
                        },{
                            where: {
                                UserId: userId, 
                                FeedId: Number(req.params.feedId)
                            }
                        })
                    }
                }
            })
            .then(data => {
                res.redirect('/feeds')
            })
            .catch(err => {
                res.send(err)
            })
    }
}

module.exports = FeedController

