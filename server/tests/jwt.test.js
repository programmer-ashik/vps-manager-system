import { describe, expect, it } from 'vitest'
import { signAccessToken, verifyAccessToken } from '../src/core/auth/jwt.js'

describe('jwt', () => {
  it('round-trips claims', () => {
    const token = signAccessToken({
      sub: 'user-1',
      email: 'a@b.com',
      role: 'admin',
    })
    expect(token.split('.')).toHaveLength(3)
    const claims = verifyAccessToken(token)
    expect(claims.sub).toBe('user-1')
    expect(claims.email).toBe('a@b.com')
    expect(claims.role).toBe('admin')
  })
})
