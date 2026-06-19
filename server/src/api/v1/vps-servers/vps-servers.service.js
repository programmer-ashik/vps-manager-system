import {
  findAllVpsServers,
  findActiveVpsServers,
  createVpsServerRecord,
  findVpsServerById,
  updateVpsServerById,
  updateAvailabilityStatusById,
  updatePingStatusById,
  deleteVpsServerById,
} from './vps-servers.repo.js'
import { pingHost } from '../../../services/ping.service.js'

export async function listVpsServers(query) {
  return findAllVpsServers(query)
}

export async function createVpsServer(input) {
  return createVpsServerRecord(input)
}

export async function getVpsServerById(id) {
  return findVpsServerById(id)
}

export async function updateVpsServer(id, input) {
  return updateVpsServerById(id, input)
}

export async function updateAvailabilityStatus(id, availabilityStatus) {
  return updateAvailabilityStatusById(id, availabilityStatus)
}

export async function pingVpsServer(id) {
  const server = await findVpsServerById(id)
  if (!server) return null

  const result = await pingHost(server.ip)
  const pingStatus = result.online ? 'online' : 'offline'
  return updatePingStatusById(id, pingStatus)
}

export async function pingAllActiveVpsServers() {
  const servers = await findActiveVpsServers()
  const results = []

  for (const server of servers) {
    const result = await pingHost(server.ip)
    const pingStatus = result.online ? 'online' : 'offline'
    const updated = await updatePingStatusById(String(server._id), pingStatus)
    results.push(updated)
  }

  return results
}

export async function deleteVpsServer(id) {
  return deleteVpsServerById(id)
}
