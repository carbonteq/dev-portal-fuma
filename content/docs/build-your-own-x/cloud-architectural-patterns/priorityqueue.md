---
title: Priority Queue (Single Pool)
---

## Pattern Overview

### Explanation

A queue is usually a first-in, first-out (FIFO) structure, and consumers typically receive messages in the same order that they were posted to the queue. However, some message queues support priority messaging. The application posting a message can assign a priority and the messages in the queue are automatically reordered so that those with a higher priority will be received before those with a lower priority. The figure illustrates a queue with priority messaging.

![Figure 1 - Using a queuing mechanism that supports message prioritization](https://lh6.googleusercontent.com/20Mt3vruZRk2OSFjt2R78zkCOzSO-W_CVpUyxcdeLPNIkPY8eNxbNH49KtBuzc4z3epx0JVn9XToGqeAwrCihrXqnEV56cFzBEkrpKwac1gGBe61R2dWyeLNxueBip3d_XmIu12A)

### Reference Material

[Priority Queue](https://docs.microsoft.com/en-us/azure/architecture/patterns/priority-queue)

[Video Explanation](https://www.youtube.com/watch?v=wptevk0bshY)

### When to Use

- The system must handle multiple tasks that have different priorities.
- Different users or tenants should be served with different priority.

## Design Considerations

### General

**Telemetry**

Monitor the processing speed on different labels to ensure that the messages in these queues are processed at the expected rates.

**Handling Edge Case**

Dynamically increase the priority of a queued message as it ages. To ensure it eventually get processed.

### API Design

- We need to ensure the following methods are available for normal operations

  - dequeue
  - enqueue
  - peek
  - remove

- We need to provide incoming/outgoing flow rate for different priorities in a configurable sliding time window
- We should be able to configure the rate and intensity at which old message will be increased in priority

### References

[Fastpriorityqueue](https://www.npmjs.com/package/fastpriorityqueue)

[Rx.priorityqueue](https://github.com/Reactive-Extensions/rx.priorityqueue)

### Possible Future Improvements

- Make it compatible for distributed systems possibly through redis.
- Make the stats available for grafana and prometheus.
