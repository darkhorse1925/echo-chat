const sendForm= document.getElementById('sendForm')
const sendInput = document.getElementById('sendInput')
const msgContainer = document.querySelector('.msgContainer')

let username = prompt('What is your name ?') 

if (!username)
	username = "Anonymous"

const socket = io()

socket.emit('username', username)

socket.on('welcome', data => {
	appendEvent(`You entered the chat ${timeStamp()}`)
	console.log(data)
})

socket.on('username', data => {
	appendEvent(`${data} entered the chat ${timeStamp()}`)
})

function appendEvent(data) {
	let info = document.createElement('p')
	info.setAttribute('id', 'infoEvent')
	info.textContent= data
	msgContainer.appendChild(info)
	msgContainer.scrollTo(0, msgContainer.scrollHeight)
}

function timeStamp () {
	return (new Date()).toLocaleString('en-US',{hour: 'numeric', minute: 'numeric', hour12: 'true'})
}

sendForm.addEventListener('submit',(e) =>{
	e.preventDefault()
	if(sendInput.value) {
		socket.emit('message',sendInput.value)

		let item = document.createElement('div')
		item.textContent = sendInput.value
		sendInput.value = ''
		item.setAttribute('id', 'youBubble')

		let nameStamp = document.createElement('small')
		nameStamp.textContent = `You ${timeStamp()}`

		let bubble = document.createElement('div')
		bubble.classList.add('bubble')
		bubble.setAttribute('id', 'youMsg')
		bubble.appendChild(item)
		bubble.appendChild(nameStamp)

		msgContainer.appendChild(bubble)
		msgContainer.scrollTo(0, msgContainer.scrollHeight)
	}
})

//Getting Broadcasted message
socket.on('message', data =>{

	let item = document.createElement('div')
	item.textContent = data.msg
	item.setAttribute('id', 'otherBubble')

	let nameStamp = document.createElement('small')
	nameStamp.setAttribute('id', 'smallOther')
	nameStamp.textContent = `${data.name} ${timeStamp()}`

	let bubble = document.createElement('div')
	bubble.classList.add('bubble')
	bubble.setAttribute('id', 'otherMsg')
	bubble.appendChild(item)
	bubble.appendChild(nameStamp)

	msgContainer.appendChild(bubble)
	msgContainer.scrollTo(0, msgContainer.scrollHeight)
})

//Disconnected user 
socket.on('user-disconnect',data => {
	appendEvent(`${data} left the chat ${timeStamp()}`)
})

