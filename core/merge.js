/**
 * Combines a json object with the content of a json file
 * @param {*} json1 JSON Object to merge
 * @param {*} json2 Property in the JSON to merge. If not specified, the entire object is merged
 * @param {*} mergeAt Property to merge. The rest of the object will be discarded. If null, all properties will be merged
 */
module.exports = function (json1, json2, mergeAt = null) {
    if (mergeAt) {        
        var merge1 = json1 ? json1[mergeAt] : {};
        var merge2 = json2 ? json2[mergeAt] : {};
        var result = {};
        result[mergeAt] = Object.assign({}, merge1, merge2);
        return result;
    }
    else {
        return Object.assign({}, json1, json2);
    }
}