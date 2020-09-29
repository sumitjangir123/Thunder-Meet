const socket = io.connect('http://localhost:3000');
const videoGrid = document.getElementById('video-grid')

const myVideo = document.createElement('video')
myVideo.muted = true

const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})

myPeer.on('open', (id) => {
  socket.emit('join-room', ROOM_ID, id)
})

const peers = {}


  navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        width :144,
        height: 90
      }

    }).then(stream => {
      addVideoStream(myVideo, stream,"yourself")
      myPeer.on('call', (call) => {
        //sending another user our stream
        call.answer(stream)
        const video = document.createElement('video')
        
        //getting another user's stream step-2
        call.on('stream', userVideoStream => {
          addVideoStream(video, userVideoStream)
        })
      })


      //passing another user our video stream
      socket.on('user-connected', (userId) => {
        console.log("User Connected " + userId)
        connectToNewUser(userId, stream)
      })

      socket.on('user-disconnected', userId => {
        if (peers[userId]) peers[userId].close()
      })

    })



function connectToNewUser(userId, stream) {
    //sending my audio and video to another user step-1
    const call = myPeer.call(userId, stream)

    const video = document.createElement('video')

    //another user's audio and video
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
      video.remove()
    })

    peers[userId] = call
  }



function addVideoStream(video, stream) {
  video.srcObject = stream
  video.id="youtube";
  video.style.padding="10px"
  video.classList.add("animated");
  video.classList.add("zoomInUp");
  video.classList.add("slow");
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}