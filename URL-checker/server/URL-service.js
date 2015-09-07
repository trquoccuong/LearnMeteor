var conn = DDP.connect('localhost:3000');
Snippets =  new Mongo.Collection('snippets',conn);

Tokens =  new Mongo.Collection('user-tokens');

var token = Tokens.findOne({});

if(!token) {
    initLogin();
} else {
    loginWithToken(token);
}

if(token) {
    conn.subscribe('snippets-admin', function () {
        Snippets.find({}).observeChanges({
            added: function (id,s) {
                if(!s.text || s.URL) return;
                if(s.text.indexOf('http')==0) {
                    s.URL = s.text;
                    try {
                        Snippets.update({_id : id},{$set:s});
                    }
                    catch(e){
                        console.log('Error updating',id);
                        console.log(e)
                    }
                }
            }
        })
    })
}

function initLogin () {
    conn.call("login",{
        user: {email: 'admin@gmail.com'},
        password: "123456"
    }, function (err, result) {
        if(err) {
            console.log('error logging in:');
            console.log(err);
            return;
        }
        Tokens.upsert({userid: result.id},{$set: result});
    })
}

function loginWithToken(token) {
    conn.call("login", {
        'resume' : token.token
    }, function (err,res) {
        if(err){
            Tokens.remove({});
            console.log('error logging in with token:');
            console.log(err);
            initLogin();
            return;
        }
        Tokens.upsert({userid: res.id},{$set: res});

    })
}