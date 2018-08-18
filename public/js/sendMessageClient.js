window.onload = function(){


    const chatList = document.getElementById('chatList');
    const temp = chatList.innerHTML;
    const textAreaElement = document.querySelector('textarea');
    const sendButton = document.querySelector('button');
    const message = document.getElementById('message');
    const callPage = document.getElementById('callPage');
    const videoButton = document.getElementById('callBtn');
    var connectToOtherUsernameBtn = document.querySelector('#connectToOtherUsernameBtn'); 
    var connectedUser, myConnection, dataChannel;

// var loginPage = document.querySelector('#loginPage'); 
var usernameInput = document.querySelector('#userName'); 
var loginBtn = document.querySelector('#loginBtn');

// var callPage = document.querySelector('#callPage'); 
var callToUsernameInput = document.querySelector('#callToUsernameInput');
// var callBtn = document.querySelector('#callBtn'); 

var hangUpBtn = document.querySelector('#hangUpBtn'); 
var localAudio = document.querySelector('#localVideo'); 
var remoteAudio = document.querySelector('#remoteVideo'); 

var yourConn; 
var stream; 

function hasUserMedia() { 
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia 
       || navigator.mozGetUserMedia || navigator.msGetUserMedia; 
    return !!navigator.getUserMedia; 
 }
    sendButton.onclick=function(){
        //send one message, append it to the message list

        var val = textAreaElement.value; 
        const div = document.createElement('div');
        div.setAttribute('class',"messageSentRow");
        const p = document.createElement('p');
        p.innerHTML=textAreaElement.value;
        p.setAttribute('class',"messageSent");
        div.appendChild(p);
        // chatPage.removeChild(message);
        chatList.appendChild(div);
        textAreaElement.value="";
        dataChannel.send(val); 
    }
    textAreaElement.addEventListener('keypress', (event) => {
        // event.preventDefault();
        var val = textAreaElement.value; 
        const keyName = event.key;
        // console.log('keycode',event.key);
        if(keyName=='Enter'){
            console.log('enter');
            event.preventDefault();
            const div = document.createElement('div');
            div.setAttribute('class',"messageSentRow");
            const p = document.createElement('p');
            p.innerHTML=textAreaElement.value;
            p.setAttribute('class',"messageSent");
            div.appendChild(p);
            // chatPage.removeChild(message);
            chatList.appendChild(div);
            textAreaElement.value="";

            dataChannel.send(val); 
        }
      });

     
  videoButton.onclick = function(){
        chatList.innerHTML=callPage.innerHTML;
        callPage.setAttribute('visibility','visible');

         name = usernameInput.innerHTML; 
	       console.log('login with name',name);
         if (name.length > 0) { 
            send({ 
               type: "videochat", 
               name: name 
            }); 
         } 
        //  var callToUsername = callToUsernameInput.innerHTML; 
	
        // if (callToUsername.length > 0) { 
        //     connectedUser = callToUsername; 
        //     // create an offer 
        //     yourConn.createOffer(function (offer) { 
        //       send({
        //           type: "offer", 
        //           offer: offer 
        //       }); 
            
        //       yourConn.setLocalDescription(offer); 
        //     }, function (error) { 
        //       alert("Error when creating an offer"); 
        //     }); 
        // } 

      }
    //   const hangUpBtn = this.document.getElementById('hangUpBtn');
      hangUpBtn.onclick = function(){
        chatList.innerHTML = temp;
      }

//our username 
var name; 

 
//connecting to our signaling server 
var conn = new WebSocket('ws://localhost:9090');
 
conn.onopen = function () { 
   console.log("Connected to the signaling server"); 
};
 
//when we got a message from a signaling server 
conn.onmessage = function (msg) { 
   console.log("Got message", msg.data); 
   var data = JSON.parse(msg.data); 
	
   switch(data.type) { 
      case "login": 
        onLogin(data.success);
         break; 
      case "videochat": 
        videoChat(); 
          break;    
      //when somebody wants to call us 
      case "offer": 
        onOffer(data.offer, data.name); 
        //  handleOffer(data.offer, data.name); 
         break; 
      case "answer": 
        onAnswer(data.answer); 
        //  handleAnswer(data.answer); 
         break; 
      //when a remote peer sends an ice candidate to us 
      case "candidate": 
      onCandidate(data.candidate); 
        //  handleCandidate(data.candidate); 
         break; 
      case "leave": 
         handleLeave(); 
         break; 
      default: 
         break; 
   } 
}; 
//when a user logs in 
function onLogin(success) { 

  if (success === false) { 
     alert("oops...try a different username"); 
  } else { 
     //creating our RTCPeerConnection object 
     var configuration = { 
        "iceServers": [{ "url": "stun:stun.1.google.com:19302" }] 
     }; 
   
     myConnection = new webkitRTCPeerConnection(configuration, { 
         //  optional: [{RtpDataChannels: true}] 
         
       }); 
       myConnection.onicecandidate = function (event) { 
           
           if (event.candidate) { 
               send({ 
                   type: "candidate", 
                   candidate: event.candidate 
               });
           } 
       }; 
       //function when get a message from server
       myConnection.ondatachannel = function(event) {
           var receiveChannel = event.channel;
           receiveChannel.onmessage = function(event) {
               console.log("ondatachannel message:", event.data);
               const div = document.createElement('div');
               div.setAttribute('class',"messageReceivedRow");
               const p = document.createElement('p');
               p.innerHTML=event.data;
               p.setAttribute('class',"messageReceived");
               div.appendChild(p);
               // chatPage.removeChild(message);
               chatList.appendChild(div);
             
           };
       };
       
       console.log("RTCPeerConnection object was created"); 
       //   console.log(myConnection); 
       
       //setup ice handling 
       //when the browser finds an ice candidate we send it to another peer 
       myConnection.onicecandidate = function (event) { 
           
           if (event.candidate) { 
               send({ 
                   type: "candidate", 
                   candidate: event.candidate 
               });
           } 
       }; 
   
       openDataChannel();
  } 
};

conn.onerror = function (err) { 
   console.log("Got error", err); 
};
 
//alias for sending JSON encoded messages 
function send(message) { 
   //attach the other peer username to our messages 
   if (connectedUser) { 
      message.name = connectedUser; 
   } 
	
   conn.send(JSON.stringify(message)); 
};
 
//****** 
//UI selectors visible 
//****** 



// callPage.style.visibility = "hidden";
// callPage.setAttribute('visibility','hidden');
 
// Login when the user clicks the button 
loginBtn.addEventListener("click", function (event) { 
   name = usernameInput.innerHTML; 
   callPage.setAttribute('visibility','visible');
	console.log('login with name',name);
   if (name.length > 0) { 
      send({ 
         type: "login", 
         name: name 
      }); 
   } 
	
});
 
function videoChat() { 
   
      //getting local audio stream 
      if (hasUserMedia()) { 
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
           || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  
  //getting local audio stream 
        navigator.getUserMedia({ video: true, audio: true }, function (stream)  { 
			
         //visibilitying local audio stream on the page 
         localAudio.src = window.URL.createObjectURL(stream);
			
         //using Google public stun server 
         var configuration = { 
            "iceServers": [{ "url": "stun:stun2.1.google.com:19302" }] 
         }; 
			
         yourConn = new webkitRTCPeerConnection(configuration); 
			
         // setup stream listening 
         yourConn.addStream(stream); 
			
         //when a remote user adds stream to the peer connection, we visibility it 
         yourConn.onaddstream = function (e) { 
            remoteAudio.src = window.URL.createObjectURL(e.stream); 
         }; 
			
         // Setup ice handling 
        //  yourConn.onicecandidate = function (event) { 
        //     if (event.candidate) { 
        //        send({ 
        //           type: "candidate", 
        //           candidate: event.candidate 
        //        }); 
        //     } 
        //  }; 
			
      }, function (error) { 
         console.log(error); 
      }); 
		
   } 
};
 
//initiating a call 
callBtn.addEventListener("click", function () { 
   
  var callToUsername = callToUsernameInput.innerHTML; 
	
   if (callToUsername.length > 0) { 
      connectedUser = callToUsername; 
		
      // create an offer 
      yourConn.createOffer(function (offer) { 
         send({
            type: "offer", 
            offer: offer 
         }); 
			
         yourConn.setLocalDescription(offer); 
      }, function (error) { 
         alert("Error when creating an offer"); 
      }); 
   } 
});
 
//when somebody sends us an offer 
function handleOffer(offer, name) { 
   connectedUser = name; 
   yourConn.setRemoteDescription(new RTCSessionDescription(offer)); 
	
   //create an answer to an offer 
   yourConn.createAnswer(function (answer) { 
      yourConn.setLocalDescription(answer); 
		
      send({ 
         type: "answer", 
         answer: answer 
      });
		
   }, function (error) { 
      alert("Error when creating an answer"); 
   }); 
	
};
 
//when we got an answer from a remote user 
function handleAnswer(answer) { 
   yourConn.setRemoteDescription(new RTCSessionDescription(answer)); 
};
 
//when we got an ice candidate from a remote user 
function handleCandidate(candidate) { 
   yourConn.addIceCandidate(new RTCIceCandidate(candidate)); 
};
 
//hang up
hangUpBtn.addEventListener("click", function () { 
   send({ 
      type: "leave" 
   }); 
	
   handleLeave(); 
});
 
function handleLeave() { 
   connectedUser = null; 
   remoteAudio.src = null; 
	
   yourConn.close(); 
   yourConn.onicecandidate = null; 
   yourConn.onaddstream = null; 
};
//setup a peer connection with another user 
connectToOtherUsernameBtn.addEventListener("click", function () {
  
  var otherUsername = callToUsernameInput.innerHTML; 
  console.log('hi click connect button!',otherUsername);
  connectedUser = otherUsername;
 
  if (otherUsername.length > 0) { 
     //make an offer 
     myConnection.createOffer(function (offer) { 
        console.log(); 
     
        send({ 
           type: "offer", 
           offer: offer 
        }); 
     
        myConnection.setLocalDescription(offer); 
     }, function (error) { 
        alert("An error has occurred."); 
     }); 
  } 
});
//creating data channel 
function openDataChannel() { 

  var dataChannelOptions = { 
     reliable:true 
  }; 
   
  dataChannel = myConnection.createDataChannel("myDataChannel", dataChannelOptions);
   
  dataChannel.onerror = function (error) { 
     console.log("Error:", error); 
  };
   
  dataChannel.onmessage = function (event) { 
     console.log("Got message:", event.data); 
  };  
}
 
//when a user clicks the send message button 
// sendMsgBtn.addEventListener("click", function (event) { 
//   console.log("send message");
//   var val = msgInput.value; 
//   dataChannel.send(val); 
// });
//when somebody wants to call us 
function onOffer(offer, name) { 
  connectedUser = name; 
  myConnection.setRemoteDescription(new RTCSessionDescription(offer));
 
  myConnection.createAnswer(function (answer) { 
     myConnection.setLocalDescription(answer); 
   
     send({ 
        type: "answer", 
        answer: answer 
     }); 
   
  }, function (error) { 
     alert("oops...error"); 
  }); 
}

//when another user answers to our offer 
function onAnswer(answer) { 
  myConnection.setRemoteDescription(new RTCSessionDescription(answer)); 
}
 
//when we got ice candidate from another user 
function onCandidate(candidate) { 
  myConnection.addIceCandidate(new RTCIceCandidate(candidate)); 
}

}