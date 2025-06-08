---
title: Peer-to-Peer Communication
---

Peer-to-peer applications are a common feature of computing today. Services from BitTorrent to Skype all rely on direct client to client contact. In this programming assignment you will construct a simple peer-to-peer based relay application. This application will demonstrate the basic operation of peer-to-peer communication.

For this lab, you need to write a client and a server utilizing TCP socket connections. The client must be able to connect to the server and obtain a list of available clients. After obtaining this list, the client must be able to connect to one other client on the list. The clients must then be capable of relaying text messages directly to one another without further help from the server.

You can define whatever convention you would like to indicate that a text message is complete (e.g. hitting [Enter], clicking send). Each client must send an acknowledgement to the other client that a text message has been received and displayed. You must also provide some way to disconnect and end the conversation. After disconnecting, the user should be able to retrieve a new copy of the server’s client list and connect to a new client. The connection between the two clients must be duplex, so both clients are capable of transmitting and receiving at the same time.

This can be envisioned as a simple chat application, where you can figure out who is online from the server and then talk to those other users directly.

## Milestones

- Simple Client Server rooms and persons, with UTF-8 based message support (only with support of UDP)

- Adding concurrency support for handling multiple clients at the same time.
- Remove server for relaying messages, use server only for discovering peers and use [stun](https://www.3cx.com/pbx/what-is-a-stun-server/) to initiate a direct connection.
- Add ack and reestablish connection in case of failure and resend messages on connectivity.
- Upgrade the wire protocol to protobuf and to include other types of messages (text. Contact , location, file).

- Include both TCP and UDP support

- Add abstraction on message layer to support both TCP and UDP

- Support file send resuming and checksum verification.
- Add end to end encryption using GPG keys where server will have the public keys
- 😈 Add reverse shell capabilities just for fun

### External Reference

- https://notes.shichao.io/tcpv1/
