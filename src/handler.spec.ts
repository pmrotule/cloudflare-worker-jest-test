import fetch from 'cross-fetch'
import { setup, teardown } from 'jest-process-manager'
import { COOKIE_NAME, GROUPS } from './handler'

const SERVER_TIMEOUT = 30_000
jest.setTimeout(SERVER_TIMEOUT)

describe('#handleRequest', () => {
  let response: Response

  beforeAll(async () => {
    await setup({
      command: 'yarn wrangler dev --port 8787 --host example.com',
      launchTimeout: SERVER_TIMEOUT,
      port: 8787,
      usedPortAction: 'kill',
    })
  })

  afterAll(async () => {
    await teardown()
  })

  describe('when experiment cookie is present', () => {
    describe('and when cookie equals to control group', () => {
      beforeAll(async () => {
        response = await fetch('http://localhost:8787', {
          method: 'GET',
          headers: {
            Cookie: `foo=bar; ${COOKIE_NAME}=${GROUPS.control}`,
          },
        })
      })

      it('responds with 200 status', () => {
        expect(response.status).toBe(200)
      })

      it('responds with control group content', async () => {
        expect(await response.text()).toBe('Control group')
      })

      it('does not include experiment cookie in set-cookie header', () => {
        const header = response.headers.get('Set-Cookie') || ''
        expect(header).not.toMatch(new RegExp(`${COOKIE_NAME}=[^;]+`))
      })
    })

    describe('and when cookie equals to test group', () => {
      beforeAll(async () => {
        response = await fetch('http://localhost:8787', {
          method: 'GET',
          headers: {
            Cookie: `bar=foo; ${COOKIE_NAME}=${GROUPS.test}; some=thing`,
          },
        })
      })

      it('responds with 200 status', () => {
        expect(response.status).toBe(200)
      })

      it('responds with test group content', async () => {
        expect(await response.text()).toBe('Test group')
      })

      it('does not include experiment cookie in set-cookie header', () => {
        const header = response.headers.get('Set-Cookie') || ''
        expect(header).not.toMatch(new RegExp(`${COOKIE_NAME}=[^;]+`))
      })
    })
  })

  describe('when experiment cookie is not present', () => {
    beforeAll(async () => {
      response = await fetch('http://localhost:8787', {
        method: 'GET',
        headers: {
          Cookie: `foo=bar`,
        },
      })
    })

    it('responds with 200 status', () => {
      expect(response.status).toBe(200)
    })

    it('responds with control or test group content', async () => {
      expect(await response.text()).toMatch(/^(Control|Test) group$/)
    })

    it('includes experiment cookie in set-cookie header', () => {
      const header = response.headers.get('Set-Cookie') || ''
      expect(header).toMatch(
        new RegExp(`${COOKIE_NAME}=(${GROUPS.control}|${GROUPS.test}); Path=/;`)
      )
    })
  })
})
