const asyncHandler = require('express-async-handler');
const {getModel} = require('ottoman');
const Article = getModel('Article');
const  {Logger} = require('../config/logger');
const log = Logger.child({
    namespace: 'TagsController',
});

const getTags = asyncHandler( async (req, res) => {
    // distinct "tagList" will return either an error or a list of distinct tags
    const tags = await Article.find({}, {lean:true, select: [{ $distinct: { $field: { name: 'tagList' } }}] }).catch(e => log.debug(e, "Error fetching tags"));

    const flattenTags = tags.rows.flatMap(a => {return a.tagList});
    const filteredTags = flattenTags.filter((value, index, array) => {
        return array.indexOf(value) === index;
    });
    res.status(200).json({
        tags: filteredTags
    });
});

module.exports = {
    getTags
}
