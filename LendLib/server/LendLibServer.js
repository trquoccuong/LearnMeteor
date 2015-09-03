Meteor.startup(function () {
    Meteor.publish("Categories", function () {
        return lists.find({}, {fields: {Category: 1}});
    });
});

