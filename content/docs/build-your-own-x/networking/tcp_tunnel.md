---
title: TCP Tunnel + Sniffer
---

## Objective

Write a simple cli which takes two arguments, `--from {socket-addr-a}` and `--to {socket-addr-b}`. On starting the program, it should start a TCP server at `socket-addr-a`. Then, for every connection made to `socket-addr-a`, it should make a TCP connection to `socket-addr-b` and create a TCP tunnel. Whenever a TCP packet comes from the client, it should print the packet as bytes to the console, and then pass on the packet to the server at `socket-addr-b`. It should then wait for the server's response, print it, and pass it onto the client.

`CLIENT <-> TCP TUNNEL <-> SERVER (at socket-addr-b)`.

## Bonus

- Separate out the cli from the actual library logic, allowing other developers to use it in their programs and build upon it.
- Add the option of passing a kind of encoder/decoder function while initializing the TCP tunnel via the library. This function will run with the packet bytes as the arguments, allowing the user to do more than just print those bytes. (E.g. maybe the user wants to save those bytes to a log file, or perform some transformations on it).
  Here, user refers to a developer using your library.

## Pseudo Code

```typescript
listener = tcp.listen(socket-addr-a)

loop {
  client = listener.accept_next_connection()
  handle_client(client)
}

default_msg_cb = (bytes, from_server=false) => {
  prefix = from_server ? "Server -> " : "Client ->"

  console.log(`${prefix} ${bytes}`)
}

handleClient = (client, msg_cb = default_msg_cb) => {
   server_conn = tcp.connect(socket-addr-b)

   loop {
      client_msg = client.await_next_message()
      msg_cb(client_msg, false)
      server_conn.send(msg)
      server_msg = server_conn.await_next_message()
      msg_cb(server_msg, true)
      client.send(server_msg)
   }
}
```

## Tips

- Use async for `next_message` and `next_conn` operations.
- Use threads (lightweight or normal) to handle each connection.
- Use channels etc to pass around messages, rather than using shared memory (mutex/semaphore). [Don't communicate by sharing memory; share memory by communicating](https://go.dev/blog/codelab-share).

## Reference Program

- [Linux](https://dev-portal-tools.s3.eu-central-1.amazonaws.com/tcp_tunn)

## Resources

- [TCP Sockets in C](https://www.educative.io/answers/how-to-implement-tcp-sockets-in-c)
- [TCP Chat Server - C++](https://dens.website/tutorials/cpp-asio/tcp-chat-server)
- [Socket Programming in Nodejs](https://www.hacksparrow.com/nodejs/tcp-socket-programming-in-node-js.html)
- [TCP Chat - Rust](https://github.com/tokio-rs/tokio/blob/master/examples/chat.rs)
- [TCP Chat - Python](https://www.neuralnine.com/tcp-chat-in-python/)
- [Communicating Sequential Processes](https://en.wikipedia.org/wiki/Communicating_sequential_processes)
