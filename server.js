import cors from 'cors'
import {createServer} from 'http'
import express from 'express'
import  {Server} from 'socket.io'

const app = express()
const server = createServer(app)
const io = new Server(server)

app.use(cors())
app.use(express.static('client'))

/*Backend*/
let users = {}

io.on('connection', socket => {
	socket.emit('welcome','Welcome to the chat')

	socket.on('username', data => {
		users[socket.id] = data
		socket.broadcast.emit('username', data)
	})

	socket.on('message', data => {
		let msgBroadcast =  {name: users[socket.id], msg: data}
		socket.broadcast.emit('message', msgBroadcast)
	})

	socket.on('disconnect', () => {
		socket.broadcast.emit('user-disconnect', users[socket.id])
		delete users[socket.id]
	})
})


/*listen*/
server.listen(8080,()=>{
	console.log('server listening at 8080...')
})


