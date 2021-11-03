const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

//notification through firestore trigger
exports.broadcastNotification = functions.firestore.document('/messages/{messageId}').onCreate((snap,context)=>{
	let notification = snap.data();
	console.log(notification)

	let condition;

	//notification.topics.forEach((topic,index) => 
	for(let index = 0; index< notification.topics.length; index++){
		let concatTopic =`'${notification.topics[index]}' in topics `

		if(index===0){
			condition = `${concatTopic}`
			continue;
		}
		condition = condition + ` || ${concatTopic}`
	}

	console.log(`condition : ${condition}` )
	console.log(`notification payload data : ${notification}`)
	
    let message = {
		  "data"	: {
			  "senderId"	: `${notification.senderId}`,//"id",
			  "urlAccess"	: notification.urlAccess,
			  "topics"		: notification.topics.toString()
		  },
		  "notification": {
	    	"title"	: notification.title,//"judul notifikasi",
	  		"body"	: notification.description,//"deskripsi panjang notifikasi",
	  		"image"	: notification.urlImage//"url gambar besar yang ingin ditampilkan, max 1mb"
		  },
		  "condition"	: condition //string
	}

	return admin.messaging().send(message)
	.then((response) => {
    	console.log('Successfully sent message:', response);
    	return snap.ref.set({
			status : 'broadcasted'
		}, {merge : true});
  	})
  	.catch((error) => {
    	console.log('Error sending message:', error);
    	return snap.ref.set({
			status : 'failed'
		}, {merge : true});
  	});
});