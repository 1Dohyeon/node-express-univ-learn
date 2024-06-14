const Tag = require("../models/tag.entity");

exports.findOrCreateTags = async (tagNames) => {
  const tags = await Promise.all(
    tagNames.map(async (name) => {
      const [tag] = await Tag.findOrCreate({ where: { name } });
      return tag;
    })
  );
  return tags;
};
