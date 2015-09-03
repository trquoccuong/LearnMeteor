Meteor.subscribe("Categories");
Session.set('adding_category', false);
Template.categories.helpers({
    lists: function () {
        return lists.find({}, {sort: {Category: 1}});
    },
    new_cat: function () {
        return Session.equals('adding_category', true);
    },
    list_status: function () {
        if (Session.equals('current_list', this._id))
            return " btn-info";
        else
            return " btn-primar";
    }
});

Template.categories.events({
    'click #btnNewCat': function (e, t) {
        Session.set('adding_category', true);
        Tracker.flush();
        focusText(t.find("#add-category"))
    },
    'keyup #add-category': function (e, t) {
        if (e.which === 13) {
            var catVal = String(e.target.value || '')
            if (catVal) {
                lists.insert({Category: catVal});
                Session.set('adding_category', false)
            }
        }
    },
    'focusout #add-category': function () {
        Session.set('adding_category', false)
    },
    'click .category': function (e, t) {
        Session.set('current_list', this._id)
    }

});
function focusText(i) {
    i.focus();
    i.select();
}

Template.list.helpers({
    items: function () {
        if (Session.equals('current_list', null)) {
            return null;
        } else {
            var cats = lists.findOne({
                _id: Session.get('current_list')
            });
            if (cats && cats.items) {
                for (var i = 0; i < cats.items.length; i++) {
                    var itm = cats.items[i];
                    itm.Lendee = itm.LentTo ? itm.Lento : "free";
                    itm.lendClass = itm.LentTo ? "label-danger" : "label-success";
                }
                return cats.items
            }
        }
    },
    list_selected: function () {
        return ((Session.get('current_list') != null) && (!Session.equals(
            'current_list', null)));
    },
    list_adding: function () {
        return (Session.equals('list_adding', true));
    },
    lendee_editing: function () {
        return (Session.equals('lendee_input', this.Name));
    }
})

Template.list.events({
    'click #btnAddItem': function (e, t) {
        Session.set('list_adding', true);
        Tracker.flush();
        focusText(t.find("#item_to_add"));
    },
    'keyup #item_to_add': function (e, t) {
        if (e.which === 13) {
            addItem(Session.get('current_list'), e.target.value);
            Session.set('list_adding', false);
        }
    },
    'focusout #item_to_add': function (e, t) {
        Session.set('list_adding', false);
    },
    'click .delete_item': function (e, t) {
        removeItem(Session.get('current_list'), e.target.id);
    },
    'click .lendee': function (e, t) {
        Session.set('lendee_input', this.Name);
        Tracker.flush();
        focusText(t.find("#edit_lendee"), this.LentTo);
    },
    'keyup #edit_lendee': function (e, t) {
        if (e.which === 13) {
            updateLendee(Session.get('current_list'), this.Name,
                e.target.value);
            Session.set('lendee_input', null);
        }
        if (e.which === 27) {
            Session.set('lendee_input', null);
        }
    }
});

function addItem(list_id, item_name) {
    if (!item_name && !list_id) return;
    lists.update({_id: list_id},
        {$addToSet: {items: {Name: item_name}}});
};

function removeItem(list_id, item_name) {
    if (!item_name && !list_id)
        return;
    lists.update({_id: list_id},
        {$pull: {items: {Name: item_name}}});
};

function updateLendee(list_id, item_name, lendee_name) {
    var l = lists.findOne({
        "_id": list_id,
        "items.Name": item_name
    });
    if (l && l.items) {
        for (var i = 0; i < l.items.length; i++) {
            if (l.items[i].Name === item_name) {
                var updateItem = {};
                updateItem['items.' + i + '.LentTo'] = lendee_name;
                lists.update({'_id': list_id}, {$set: updateItem});
                break;
            }
        }
    }
};

Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});