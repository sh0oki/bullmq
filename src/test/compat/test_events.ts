import {
  Queue3 as Queue,
  Job3 as Job,
  JobId3 as JobId,
  JobStatus3 as JobStatus,
  QueueOptions3 as QueueOptions,
  JobOptions3 as JobOptions,
} from '@src/classes/compat';
import _ from 'lodash';
import IORedis from 'ioredis';
import { expect } from 'chai';
import sinon from 'sinon';
import { v4 as uuid } from 'node-uuid';
import * as utils from './utils';
import { Scripts } from '@src/classes/scripts';

describe('events', () => {
  let queue: Queue;

  beforeEach(() => {
    const client = new IORedis();
    return client.flushdb().then(() => {
      queue = utils.buildQueue('test events', {
        settings: {
          stalledInterval: 100,
          lockDuration: 50,
        },
      });
      return queue;
    });
  });

  afterEach(() => {
    return queue.close();
  });

  // TODO
  it('should emit waiting when a job has been added', done => {
    queue.on('waiting', () => {
      done();
    });

    queue.add({ foo: 'bar' });
  });

  // TODO
  // it('should emit global:waiting when a job has been added', done => {
  //   queue.on('global:waiting', () => {
  //     done();
  //   });
  //
  //   queue.add({ foo: 'bar' });
  // });

  // TODO waiting for moveStalledJobsToWait
  // it('should emit stalled when a job has been stalled', done => {
  //   queue.on('completed', (/*job*/) => {
  //     done(new Error('should not have completed'));
  //   });
  //
  //   queue.process((/*job*/) => {
  //     return utils.sleep(250);
  //   });
  //
  //   queue.add({ foo: 'bar' });
  //
  //   const queue2 = utils.buildQueue('test events', {
  //     settings: {
  //       stalledInterval: 100
  //     }
  //   });
  //
  //   queue2.on('stalled', (/*job*/) => {
  //     queue2.close().then(() => { done(); });
  //   });
  //
  //   queue.on('active', () => {
  //     queue2.startMoveUnlockedJobsToWait();
  //     queue.close();
  //   });
  // });

  // TODO waiting for moveStalledJobsToWait
  // it('should emit global:stalled when a job has been stalled', done => {
  //   queue.on('completed', (/*job*/) => {
  //     done(new Error('should not have completed'));
  //   });
  //
  //   queue.process((/*job*/) => {
  //     return utils.sleep(250);
  //   });
  //
  //   queue.add({ foo: 'bar' });
  //
  //   const queue2 = utils.buildQueue('test events', {
  //     settings: {
  //       stalledInterval: 100
  //     }
  //   });
  //
  //   queue2.on('global:stalled', (/*job*/) => {
  //     queue2.close().then(() => { done(); });
  //   });
  //
  //   queue.on('active', () => {
  //     queue2.startMoveUnlockedJobsToWait();
  //     queue.close();
  //   });
  // });

  // TODO
  // it('emits waiting event when a job is added', done => {
  //   const queue = utils.buildQueue();
  //
  //   queue.once('waiting', jobId => {
  //     Job.fromId(queue, jobId).then(job => {
  //       expect(job.data.foo).to.be.equal('bar');
  //       queue.close().then(() => { done(); });
  //     });
  //   });
  //   queue.add({ foo: 'bar' });
  // });

  // TODO
  // it('emits drained and global:drained event when all jobs have been processed', done => {
  //   const queue = utils.buildQueue('event drained', {
  //     settings: { drainDelay: 1 }
  //   });
  //
  //   queue.process((job, done) => {
  //     done();
  //   });
  //
  //   const drainedCallback = _.after(2, () => {
  //     queue.getJobCountByTypes('completed').then(completed => {
  //       expect(completed).to.be.equal(2);
  //       return queue.close().then(() => { done(); });
  //     });
  //   });
  //
  //   queue.once('drained', drainedCallback);
  //   queue.once('global:drained', drainedCallback);
  //
  //   queue.add({ foo: 'bar' });
  //   queue.add({ foo: 'baz' });
  // });

  // TODO
  // it('should emit an event when a new message is added to the queue', done => {
  //   const client = new IORedis(6379, '127.0.0.1', {});
  //   client.select(0);
  //   const queue = new Queue('test pub sub');
  //   queue.on('waiting', jobId => {
  //     expect(jobId).to.be.eql("1");
  //     client.quit();
  //     done();
  //   });
  //   queue.add({ test: 'stuff' });
  // });

  it('should emit an event when a job becomes active', done => {
    const queue = utils.buildQueue();
    queue.process((job, jobDone) => {
      jobDone();
    });
    queue.add({});
    queue.once('active', () => {
      queue.once('completed', () => {
        queue.close().then(() => {
          done();
        });
      });
    });
  });

  // TODO
  // it('should listen to global events', done => {
  //   const queue1 = utils.buildQueue();
  //   const queue2 = utils.buildQueue();
  //   queue1.process((job, jobDone) => {
  //     jobDone();
  //   });
  //
  //   let state: JobStatus;
  //   queue2.on('global:waiting', () => {
  //     expect(state).to.be.undefined;
  //     state = 'waiting';
  //   });
  //   queue2.once('global:active', () => {
  //     expect(state).to.be.equal('waiting');
  //     state = 'active';
  //   });
  //   queue2.once('global:completed', () => {
  //     expect(state).to.be.equal('active');
  //     queue1.close().then(() => {
  //       queue2.close().then(() => { done(); });
  //     });
  //   });
  //
  //   queue1.add({});
  // });
});