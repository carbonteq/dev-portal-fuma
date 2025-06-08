---
title: Real Estate Analytic Application
---

This is a fictional company whose primary goal is to analyze real estate data and find opportunities in near real time, by comparing listings.

## Background

This company was tasked to pull data from a state level [MLS](https://www.investopedia.com/terms/m/multiple-listing-service-mls.asp) Operator X at regular intervals, going through every zip code in the system and fetching the latest data (collection of listings over http) and storing it for various analytical purposes in the data warehouse as time series snapshots, as well as consuming the data in realtime over Http for their web application which provides comparison over multiple listings. On average it has to pull data for 200 million listings in 20 mins to complete a cycle.

Due to unsustainable load on the system MLS Operator X has decided to move away from pull based model to push based model where they will broadcast to change feed to all subscribers.

## Goals

Your primary goal is to ingest data and update the data warehouse and maintain a source of truth for organization internally by providing HTTP API (return all listings over a given zipcode) over data, based on this new push based model where change feed (create/update, delete) operations will be broadcast over Amazon SQS standard queues.

### Specs Of Change Feed

- Overall volume of this change feed is expected to be over 20 million.
- We will be receiving 2 types of messages,

  - Message signifying create/update in a single operation consisting of updated listing information.
  - Message indicating a delete operation containing only the id of the listing.

- Ordering of messages is not guaranteed.
- Overall size of raw data on disk in JSON format is expected to be 800TB.

## Expectations

Based on above-mentioned specs your job is now to create a system which is horizontally scalable and is resilient to failures providing accurate picture at all times and can recover gracefully in case of failures.
