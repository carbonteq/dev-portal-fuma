---
title: Circuit Breaker
---

## Overview

### Pattern

A circuit breaker acts as a proxy for operations that might fail. The proxy should monitor the number of recent failures that have occurred, and use this information to decide whether to allow the operation to proceed, or simply return an exception immediately.

The proxy can be implemented as a state machine with the following states that mimic the functionality of an electrical circuit breaker:

#### Closed

The request from the application is routed to the operation. The proxy maintains a count of the number of recent failures, and if the call to the operation is unsuccessful the proxy increments this count. If the number of recent failures exceeds a specified threshold within a given time period, the proxy is placed into the Open state. At this point the proxy starts a timeout timer, and when this timer expires the proxy is placed into the Half-Open state.

The purpose of the timeout timer is to give the system time to fix the problem that caused the failure before allowing the application to try to perform the operation again.

#### Open

The request from the application fails immediately and an exception is returned to the application.

#### Half-Open

A limited number of requests from the application are allowed to pass through and invoke the operation. If these requests are successful, it's assumed that the fault that was previously causing the failure has been fixed and the circuit breaker switches to the Closed state (the failure counter is reset). If any request fails, the circuit breaker assumes that the fault is still present so it reverts back to the Open state and restarts the timeout timer to give the system a further period of time to recover from the failure.

The Half-Open state is useful to prevent a recovering service from suddenly being flooded with requests. As a service recovers, it might be able to support a limited volume of requests until the recovery is complete, but while recovery is in progress a flood of work can cause the service to time out or fail again.

#### Circuit Breaker states

![](https://lh6.googleusercontent.com/RLNeZucX7dGSoKCfBNvFuJaf6R8jrb0CCbWBJ4dVTmxZG7oFuCgRp8mzYTSRvRkA5go1ESiLMo9KgMF9DkHnsmF-5tI5avFfQ6mMT4oRECRX_FdRHtKZjvcQNL4-rUZiJY57Q1bW)

In the figure, the failure counter used by the Closed state is time based. It's automatically reset at periodic intervals. This helps to prevent the circuit breaker from entering the Open state if it experiences occasional failures. The failure threshold that trips the circuit breaker into the Open state is only reached when a specified number of failures have occurred during a specified interval. The counter used by the Half-Open state records the number of successful attempts to invoke the operation. The circuit breaker reverts to the Closed state after a specified number of consecutive operation invocations have been successful. If any invocation fails, the circuit breaker enters the Open state immediately and the success counter will be reset the next time it enters the Half-Open state.

### When to use this pattern

#### Use this pattern:

- To prevent an application from trying to invoke a remote service or access a shared resource if this operation is highly likely to fail.

#### This pattern isn't recommended:

- For handling access to local private resources in an application, such as in-memory data structure. In this environment, using a circuit breaker would add overhead to your system.
- As a substitute for handling exceptions in the business logic of your applications.

### Associated Material/Patterns

[Circuit Breaker Pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)

[Ambassador pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/ambassador)

[Health Endpoint Monitoring pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/health-endpoint-monitoring)

[Retry pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/retry)

[Bulk Head Pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/bulkhead)

## Design Considerations

### General

#### Strategies for Identifying failure

- Error Threshold percentage.
  - This property sets the error percentage at or above which the circuit
    should trip open and start short-circuiting requests to fallback
    logic.
- Average Response Time.
- When the average response time exceeds the threshold.

Note: All strategies will be based on rolling window stats

#### Failing Fast

- Guarantees the caller won't have to wait beyond the timeout.

Note: Always take into account the inappropriate timeouts on external services

#### Manual Override.

- In a system where the recovery time for a failing operation is
  extremely variable, It will be best if we provide force open and
  close options

#### Concurrency

- The same circuit breaker could be accessed by a large number of
  concurrent instances of an application. The implementation shouldn't
  block concurrent requests or add excessive overhead to each call to
  an operation.

#### Logging

- The circuit breaker should log all failed requests (and possibly
  successful requests) to enable an administrator to monitor the health
  of the operation.

#### Inquiring State

- Consumers should be able to inquire state and stats associated with
  circuit breakers

### API Format

- Every circuit breaker must be initiated against a valid resource name.
- Rolling/Sliding Time Window size should be configurable.
- Request Volume Threshold (Minimum number of requests in a rolling window that will trip the circuit means we will not make any decision before that) should be configurable..
- Error Threshold percentage should be configurable.
- The Sleep Window should be configurable. (How much time to wait before putting it into a half open state)
- Fallback method should be configurable on instance.
- State of the circuit breaker instance should be queryable.
- Rolling Stats should be queryable.
- A default promise based API must be used by the main run method.
- 3rd parties should be able to observe important events emitted by a circuit breaker instance.

  - **SUCCESS**
  - **FAILURE**
  - **TIMEOUT**
  - **SHORT_CIRCUITED**
  - **RECOVERED**

### Building Materials

[Stats Package](https://www.npmjs.com/package/stats-lite)

[Rolling Window](https://www.npmjs.com/package/rolling-windows)

### Real World References

[Netflix Hysterix](https://github.com/Netflix/Hystrix)

[AliBaba Sentinel](https://github.com/alibaba/Sentinel)

[Akka Breaker](https://doc.akka.io/docs/akka/current/common/circuitbreaker.html)

[Hysterix JS](https://www.npmjs.com/package/hystrixjs)

[Brakes](https://github.com/awolden/brakes)

[Abacus Breaker](https://github.com/cloudfoundry-incubator/cf-abacus/tree/master/lib/utils/breaker)

### Possible Future Improvements

1.  Detailed Metrics Interface with Hysterix Dashboard
2.  Better Execution Contexts with support of multithreading.
3.  Request Caching.
4.  Request Collapsing.
5.  Flow Control Mechanisms.

## References

[Understand CircuitBreaker Design pattern with simple practical example](https://itnext.io/understand-circuitbreaker-design-pattern-with-simple-practical-example-92a752615b42)

[Circuit Breaker design pattern in software development](https://medium.com/@iamgique/circuit-breaker-design-pattern-in-software-development-1c79a4fa6838)

[Netflix Hystrix - How to Use](https://github.com/Netflix/Hystrix/wiki/How-To-Use)

[Netflix Hystrix - Configuration](https://github.com/Netflix/Hystrix/wiki/Configuration)

[Alibaba Sentinel - Circuit Breaking](https://github.com/alibaba/Sentinel/wiki/Circuit-Breaking)

[Building a Fake API for Testing & Development](https://spin.atomicobject.com/2018/09/17/build-fake-api/)

[Beeceptor - Use Cases](https://beeceptor.com/use-cases)

[Mocklab - Simulating Faults](https://www.mocklab.io/docs/simulating-faults/)
