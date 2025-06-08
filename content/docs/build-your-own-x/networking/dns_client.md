---
title: DNS Client
---

The goal of this exercise is to implement a dns client library which supports querying a public DNS server (configurable) for A record (IPv4), AAAA records (IPv6) and CNAME records (alias).

## Overview / Explanation

### What is the DNS protocol?

The Domain Network System (DNS) protocol helps Internet users and network devices discover websites using human-readable host-names, instead of numeric IP addresses.

The DNS process, simplified, works as follows:

- A browser, application or device called the DNS client, issues a DNS request or DNS address lookup, providing a hostname such as “example.com”.
- The request is received by a DNS resolver, which is responsible for finding the correct IP address for that hostname. The DNS resolver looks for a DNS name server that holds the IP address for the hostname in the DNS request.
- The resolver starts from the Internet’s root DNS server, moving down the hierarchy to Top Level Domain (TLD) DNS servers (“.com” in this case), down to the name server responsible for the specific domain “example.com”.
- When the resolver reaches the authoritative DNS name server for “example.com”, it receives the IP address and other relevant details, and returns it to the DNS client. The DNS request is now resolved.
- The DNS client device can connect to the server directly using the correct IP address.

### Transport Protocol

DNS uses the User Datagram Protocol (UDP) on port 53 to serve DNS queries. UDP is preferred because it is fast and has low overhead. A DNS query is a single UDP request from the DNS client followed by a single UDP reply from the server.

If a DNS response is larger than 512 bytes, or if a DNS server is managing tasks like zone transfers (transferring DNS records from primary to secondary DNS server), the Transmission Control Protocol (TCP) is used instead of UDP, to enable data integrity checks.

### Message Format

DNS communication occurs via two types of messages: queries and replies. Both DNS query format and reply format consist of the following sections:

- The header section contains Identification; Flags; Number of questions; Number of answers; Number of authority resource records (RRs); and Number of additional resource records.
- The flag field contains sections of one or four bits, indicating type of message, whether the name server is authoritative; whether the query is recursive or not, whether request was truncated, and status.
- The question section contains the domain name and type of record (A, AAAA, MX, TXT, etc.) being resolved. Each label in the domain name is prefixed by its length.
- The answer section has the resource records of the queried name.

Details on these sections is given below.

### Packet Structure

| Section            | Size     | Type              | Purpose                                                                                                                             |
| ------------------ | -------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Header             | 12 Bytes | Header            | Information about the query/response.                                                                                               |
| Question Section   | Variable | List of Questions | In practice only a single question indicating the query name (domain) and the record type of interest.                              |
| Answer Section     | Variable | List of Records   | The relevant records of the requested type.                                                                                         |
| Authority Section  | Variable | List of Records   | An list of name servers (NS records), used for resolving queries recursively. (NOT required in this exercise)                       |
| Additional Section | Variable | List of Records   | Additional records, that might be useful. For instance, the corresponding A records for NS records. (NOT required in this exercise) |

#### Header Fields

| RFC Name | Descriptive Name     | Length  | Description                                                                                                                                                                         |
| -------- | -------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID       | Packet Identifier    | 16 bits | A random identifier is assigned to query packets. Response packets must reply with the same id. This is needed to differentiate responses due to the stateless nature of UDP.       |
| QR       | Query Response       | 1 bit   | 0 for queries, 1 for responses.                                                                                                                                                     |
| OPCODE   | Operation Code       | 4 bits  | Typically always 0, see RFC1035 for details.                                                                                                                                        |
| AA       | Authoritative Answer | 1 bit   | Set to 1 if the responding server is authoritative - that is, it "owns" - the domain queried.                                                                                       |
| TC       | Truncated Message    | 1 bit   | Set to 1 if the message length exceeds 512 bytes. Traditionally a hint that the query can be reissued using TCP, for which the length limitation doesn't apply.                     |
| RD       | Recursion Desired    | 1 bit   | Set by the sender of the request if the server should attempt to resolve the query recursively if it does not have an answer readily available.                                     |
| RA       | Recursion Available  | 1 bit   | Set by the server to indicate whether or not recursive queries are allowed.                                                                                                         |
| Z        | Reserved             | 3 bits  | Originally reserved for later use, but now used for DNSSEC queries. (For a query, set this to `010=2`)                                                                              |
| RCODE    | Response Code        | 4 bits  | Set by the server to indicate the status of the response, i.e. whether or not it was successful or failed, and in the latter case providing details about the cause of the failure. |
| QDCOUNT  | Question Count       | 16 bits | The number of entries in the Question Section                                                                                                                                       |
| ANCOUNT  | Answer Count         | 16 bits | The number of entries in the Answer Section                                                                                                                                         |
| NSCOUNT  | Authority Count      | 16 bits | The number of entries in the Authority Section                                                                                                                                      |
| ARCOUNT  | Additional Count     | 16 bits | The number of entries in the Additional Section                                                                                                                                     |

#### Question

| Field | Type           | Description                                                             |
| ----- | -------------- | ----------------------------------------------------------------------- |
| Name  | Label Sequence | The domain name, encoded as a sequence of labels as described below.    |
| Type  | 2-byte Integer | The record type.                                                        |
| Class | 2-byte Integer | The class, in practice always set to 1. (1 is the code for IN=Internet) |

#### Record

| Field | Type           | Description                                                                                                                                                |
| ----- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name  | Label Sequence | The domain name, encoded as a sequence of labels as described below.                                                                                       |
| Type  | 2-byte Integer | The record type.                                                                                                                                           |
| Class | 2-byte Integer | The class, in practice always set to 1.                                                                                                                    |
| TTL   | 4-byte Integer | Time-To-Live, i.e. how long a record can be cached before it should be requeried.                                                                          |
| Len   | 2-byte Integer | Length of the record type specific data (in bytes).                                                                                                        |
| RData | Variable       | The record data (like the IPv4 returned as the response for the query). The length of this field depends on the record type, and is equal to the Len field |

##### RData - A Record (IPv4)

The `Len` field must have the value 4. The `RData` field will contain an IPv4 address encoded as 4-bytes, with each byte representing one octet.

#### RData - AAAA Record (IPv6)

The `Len` field will have the value 16 (16\*8 = 128 bits). Two bytes per group (4 hex digits), total 8 groups. If a group is all zeros `0000`, it's replaced by a color `:`. Sequences of three or more colons are replaced by a double colon `::`. In Some formats, all the groups are separated by a colon `:`. In others, the last 4 groups are separated by a period `.` (to easily read the IPv4 part of the address), and the rest by colon (or a double colon for cases stated above).

##### RData - CNAME Record

The `Len` field will contain the hostname to which the query data points (e.g. `api.domain.com` may point to `domain.com`). Note that the data may not contain the whole name. It may just contain a pointer to an earlier part of the DNS packet. This is known as DNS Name/Message Compression. Using the earlier example, `domain.com` part is repeated in both the query and response. It doesn't make any sense to encode it again as bytes, so rdata field will contain a "pointer" to the part of the packet where `domain.com` part of `api.domain.com` starts. Let's say `api.domain.com` starts at byte 13 (directly after the header, as the first Question). The rdata field of the Record (/Answer) would therefore point to byte 17.

Note that this is not an actual, language level pointer primitive (&variable), but rather just a way to conceptually understand the redirection which is a part of the message compression. A better name would be "jump directive". Details with example are provided in the resources section.

##### Label Sequence

Domain names are encoded in a DNS packet as a null terminated sequence of "labels" preceded by it's length as 1-byte integer, with each "label" corresponding to one part of the domain name. E.g. "carbonteq.com" would be encoded as two labels. The first one will be `carbonteq` => `09 96 63 36 61 17 72 26 62 26 6f f6 6e e7 74 46 65 57 71`, with the first byte `09` specifying the length of this label, and the rest being the encoded ascii representation of each character in `carbonteq`. Similarly, `com` would be encoded as `03 36 63 36 6f f6 6d`. The whole name would therefore be encoded as `09 96 63 36 61 17 72 26 62 26 6f f6 6e e7 74 46 65 57 71 03 36 63 36 6f f6 6d 00` (the last byte is a null byte marking the end of this sequence).

## Implementation

### Goals

Create a library/package/module containing primitives for constructing a DNS packet. The top level API should enable us to get the DNS packet bytes for a query in two calls - one to construct the "packet" (`DNSQuery.ipv4("carbonteq.com") or DNSQuery.cname("carbonteq.com")`), and one call to "pack/encode" the query packet as a byte sequence (`packet.pack()`, `packet.bytes()` or `packet.encode()`). The second call should return whatever primitive wrapper is used in the language to work with a sequence of bytes (for js/ts, it would be [`Buffer`](https://nodejs.org/api/buffer.html), [bytes](https://docs.python.org/3/library/stdtypes.html#bytes) for python, [`Vector<u8>`](https://doc.rust-lang.org/std/vec/struct.Vec.html) for Rust and [`[]byte`](https://pkg.go.dev/bytes) for Golang).

After the library implementation, create a CLI which uses this library to allow DNS queries from the command line, or a web app which serves a similar purpose, but over the web (frontend not necessary, an API is fine).

You may not use any external library for parsing/encoding the bytes, or use any standard library functions that defeat the goal of this exercise.

Keep your code as clean and modular as possible.

### Tips (for testing and avoiding common pitfalls/gotchas)

- You can use the tools [`dig`](https://linux.die.net/man/1/dig) and [`nc` (netcat)](https://linux.die.net/man/1/nc) to save an example query and response packet for testing purposes. Test using these saved packets before moving on to sending the packets over the socket. In order to do this, you can use the following commands.

  - In one tab of the terminal, set netcat to listen on a port, like 1053, and save the received stream to a file.

  ```bash
  nc -u -l 1053 > query_packet.bin
  ```

  - In another tab, send a DNS resolution request via

  ```bash
  dig +retry=0 -p 1053 @127.0.0.1 +noedns carbonteq.com
  ```

  It will fail after a couple of seconds. That's expected.

  - Go back to the first tab, where netcat was running, and exit using `CTRL+C`. Inspect the `query_packet.bin` file using tools like [`hexdump`](https://linux.die.net/man/1/hexdump) or better yet, [`hexyl`](https://github.com/sharkdp/hexyl).
  - You can use the query packet to receive and save the response packet as well. Run

  ```bash
  nc -u 8.8.8.8 53 < query_packet.bin > response_packet.bin
  ```

  and then `CTRL+C` after a few seconds. Inspect the `response_packet.bin` file to ensure that the response was received.

- Always remember to use network endian order (or big endian if your language doesn't provide APIs for network endian) to parse from and encode to the byte sequence.
- In each submodule/class of your implementation, always remember to check whether the correct number of bytes are available for the current operation.
- Use an enum to represent the record types.
- Avoid having any magic numbers in your code.
- Write unit tests for each part of your code, and once the API is mature enough, add E2E tests.
- It would be better to create a `DNSBuffer` type class/module, which encapsulates the bytes primitive of your language of choice, keeps track of the offset, and exposes methods like `readUint16` to allow easier reading/writing of different numbers/strings without having to worry about the current buffer index (offset) and the byte order/endianness.

### Bonus features

- If you have already implemented a CLI, create the web app, or vice versa.
- Add support for more record types, like `NS` and `MX`.
- If you are feeling adventurous, write a DNS server as well (even a non-recursive resolver would do). By know, you should have enough understanding of DNS to know where to start.

## Resources

- [What is DNS - Cloudflare](https://www.cloudflare.com/learning/dns/what-is-dns/)
- [RFC 1034: "DOMAIN NAMES - CONCEPTS AND FACILITIES"](https://www.rfc-editor.org/rfc/rfc1034)
- [RFC 1035: "DOMAIN NAMES - IMPLEMENTATION AND SPECIFICATION"](https://www.rfc-editor.org/rfc/rfc1035)
- [RFC 791: "INTERNET PROTOCOL"](https://www.rfc-editor.org/rfc/rfc791)
- [RFC 8200: "Internet Protocol, Version 6 (IPv6) Specification"](https://www.rfc-editor.org/rfc/rfc8200)
- [DNS Name Compression](http://www.tcpipguide.com/free/t_DNSNameNotationandMessageCompressionTechnique-2.htm)
- [IPv6 - NS1](https://ns1.com/resources/ipv6-dns-understanding-ipv6-and-a-quick-implementation-guide)
- [IPv6 - IBM](https://www.ibm.com/docs/en/i/7.2?topic=setup-internet-protocol-version-6)
- [IPv6 Formats - IBM (Important)](https://www.ibm.com/docs/en/i/7.2?topic=concepts-ipv6-address-formats)
- [IPv6 Formats - IBM (alternative explanation)](https://www.ibm.com/docs/en/ts3500-tape-library?topic=functionality-ipv4-ipv6-address-formats)
