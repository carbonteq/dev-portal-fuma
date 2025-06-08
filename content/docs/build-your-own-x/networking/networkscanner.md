---
title: Network Scanner
---

A client wants you to do a security audit on his networks. The system admin provided you the IP address range of their networks for you to scan, he has also provided you a list of IP addresses that you should not scan.

Write a script that takes an IP address range to scan and list of IP addresses using ARP to exclude from the scan as input(command line arguments)  
The output of the script should be a final list of IP addresses (includes all the IP address from the range provided, excludes the IP's that client wanted to be excluded).

![how-arp-works-2](https://ipcisco.com/wp-content/uploads/how-arp-works-2.jpg)

ARP (Address Resolution Protocol) is a Layer 2 Protocol. Layer 2 uses Physical addresses (MAC addresses)\*\* and Layer 3 uses Logical addresses (IP Addresses) for the communication. ARP Protocol is used to discover the MAC Address of a node associated with a given IPv4 Address. This important duty makes this protocol a key protocol for Ethernet based networks. ARP is used with IPv4 only. For IPv6, there is another protocol is used for similar role named IPv6 NDP.

Basically for the transfer of the IP packets in a network, beside the IP address, the destination hardware address (MAC Address) also must be known by the sender (Source). If the source do not know the destinatin MAC address, then it sends the packets to everyone in the network. In other words, it **floods** the traffic. This will cause an unnecessary traffic in the network. But, if this destination MAC Address is known, then the source can send this packet directly to the destination. So, if the destination MAC Address is not known before the transmission, it must be learned. ARP does this role.
