export const COOKIE_NAME = 'experiment-0'
export enum GROUPS {
  control = 'control',
  test = 'test',
}

/**
 * @see https://developers.cloudflare.com/workers/examples/ab-testing
 */
export function handleRequest(request: Request): Response {
  // The Responses below are placeholders. You can set up a custom path for each test (e.g. /control/somepath)
  const TEST_RESPONSE = new Response('Test group') // e.g. await fetch("/test/sompath", request)
  const CONTROL_RESPONSE = new Response('Control group') // e.g. await fetch("/control/sompath", request)

  // Determine which group this requester is in.
  const cookie = request.headers.get('Cookie')
  if (cookie) {
    if (cookie.includes(`${COOKIE_NAME}=${GROUPS.control}`)) return CONTROL_RESPONSE
    if (cookie.includes(`${COOKIE_NAME}=${GROUPS.test}`)) return TEST_RESPONSE
  }
  // If there is no cookie, this is a new client. Choose a group and set the cookie.
  const group: GROUPS = Math.random() < 0.5 ? GROUPS.test : GROUPS.control // 50/50 split
  const response = group === GROUPS.control ? CONTROL_RESPONSE : TEST_RESPONSE
  response.headers.append('Set-Cookie', `${COOKIE_NAME}=${group}; Path=/;`)

  return response
}
