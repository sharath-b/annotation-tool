/* eslint-disable */
/**
 * Replaces
 *  /documents/:id
 *   with { id: "1" }
 * @param linkTemplate
 * @param params
 * @return {*}
 */
module.exports = (linkTemplate, params = {}) => {
  try {
    let link = linkTemplate;

    for (const paramName in params) {
      const regexForReplaceParam = new RegExp(`:${paramName}`);
      link = link.replace(regexForReplaceParam, params[paramName]);
    }

    return link;
  } catch (e) {
    return linkTemplate;
  }
};
