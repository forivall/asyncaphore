import test from 'ava'

import asyncaphore from '../lib'

function asleep(ms = 0) { return new Promise(r => setTimeout(r, ms)) }

test.cb('it works', t => {
  t.plan(4)
  const a = asyncaphore(() => {t.pass(); t.end()})
  ;(async () => {
    await asleep()
    a.retain()
    await asleep()
    t.pass()
    a.retain()
    await asleep()
    t.pass()
    a.release()
    await asleep()
    t.pass()
    a.release()
  })()
})


test.cb('error condition', t => {
  t.plan(1)
  const a = asyncaphore((err) => {t.ok(err)})
  ;(async () => {
    await asleep()
    a.error(new Error())
    await asleep()
    a.retain()
    await asleep()
    a.release()
    await asleep()
    a.release()
    t.end()
  })()
})

test.cb('error after release', t => {
  t.plan(2)
  let first = true;
  const a = asyncaphore((err) => {
    if (first) {
      t.notOk(err)
      first = false
    } else {
      t.ok(err)
    }
  })
  ;(async () => {
    await asleep()
    a.retain()
    await asleep()
    a.release()
    await asleep()
    a.error(new Error())
    t.end()
  })()
})

test.cb('error after retain', t => {
  t.plan(1)
  const a = asyncaphore((err) => {t.ok(err)})
  ;(async () => {
    await asleep()
    a.retain()
    await asleep()
    a.error(new Error())
    await asleep()
    a.release()
    await asleep()
    a.release()
    t.end()
  })()
})

test('release after finish', async t => {
  t.plan(2)
  const a = asyncaphore(() => {t.ok(true)})
  await asleep()
  a.retain()
  await asleep()
  a.release()
  await asleep()
  t.throws((() => a.release()), "retain/release mismatch");
})

test('retain after finish', async t => {
  t.plan(2)
  const a = asyncaphore(() => {t.ok(true)})
  await asleep()
  a.retain()
  await asleep()
  a.release()
  await asleep()
  a.retain()
  t.pass()
})

test('callback twice', async t => {
  t.plan(3)
  const a = asyncaphore(() => {t.ok(true)})
  await asleep()
  a.retain()
  await asleep()
  a.release()
  await asleep()
  a.retain()
  await asleep()
  a.release()
  await asleep()
  t.pass()
})

test('error condition', async t => {
  t.plan(3)
  const a = asyncaphore(() => {t.ok(true)})
  await asleep()
  a.retain()
  await asleep()
  a.release()
  await asleep()
  a.retain()
  await asleep()
  a.release()
  await asleep()
  t.pass()
})
