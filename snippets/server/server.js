Meteor.publish("snippets", function () {
    return Snippets.find({owner: this.userId});
});
Meteor.publish("snippets-admin", function () {
    return Snippets.find({});
})

Snippets.allow({
    insert : function (userId,fields) {
        return userId;
    },
    update : function (userId,fields) {
        return userId;
    }
});