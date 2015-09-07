PlayersList = new Mongo.Collection('players');
if(Meteor.isClient){
    Meteor.subscribe('thePlayers');
    Template.leaderboard.helpers ({
        'player': function () {
            return PlayersList.find({}, {sort : {score: -1 , name : 1}})
        },
        'selectedClass' : function () {
            var playerId = this._id;
            var selectedPlayer = Session.get('selectedPlayer');

            if(playerId === selectedPlayer) {
                return "selected"
            }
        },
        'showSelectedPlayer' : function () {
            var selectedPlayer = Session.get('selectedPlayer');
            return PlayersList.findOne(selectedPlayer)
        }
    });


    Template.leaderboard.events ({
        'click .player' : function () {
            var playerId = this._id;
            Session.set('selectedPlayer', playerId);
        },
        'click .increment' : function () {
            var selectedPlayer = Session.get('selectedPlayer');
            PlayersList.update(selectedPlayer, {$inc : {score : 5}})
        },
        'click .remove': function(){
            var selectedPlayer = Session.get('selectedPlayer');
            PlayersList.remove(selectedPlayer);
        },
        'click .decrement' : function () {
            var selectedPlayer = Session.get('selectedPlayer');
            PlayersList.update(selectedPlayer, {$inc : {score : -5}})
        }
    });

    Template.addPlayerForm.events({
        'submit form': function(event){
            event.preventDefault();
            var playerNameVar = event.target.playerName.value;
            PlayersList.insert({
                name: playerNameVar,
                score: 0
            });
        }
    })
}

if(Meteor.isServer) {
    console.log("Hello server");
    Meteor.publish('thePlayers', function(){
        return PlayersList.find()
    });
    Meteor.methods({ 'sendLogMessage': function(){
        console.log("Hello world");
    }
    });

}