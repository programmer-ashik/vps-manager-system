import { logger } from '../core/logging/logger.js'
import { registerJobHandler } from './job-dispatcher.js'
import { pingAllActiveVpsServers } from '../api/v1/vps-servers/vps-servers.service.js'
import { syncExpiredVpsUsers } from '../api/v1/vps-users/vps-users.repo.js'

const JOB_NAME = 'vps-ping-all'

registerJobHandler(JOB_NAME, async () => {
  logger.info('Starting VPS ping health check')
  await syncExpiredVpsUsers()
  const results = await pingAllActiveVpsServers()
  const online = results.filter((r) => r?.pingStatus === 'online').length
  logger.info('VPS ping health check completed', {
    total: results.length,
    online,
    offline: results.length - online,
  })
})

export { JOB_NAME }
