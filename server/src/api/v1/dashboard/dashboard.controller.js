import { countUsers } from '../users/users.repo.js'
import {
  countServerRequests,
  findRecentServerRequests,
} from '../server-requests/server-requests.repo.js'
import {
  countPartnerPayments,
  findRecentPartnerPayments,
} from '../partner-payments/partner-payments.repo.js'
import { mapServerRequests } from '../server-requests/server-requests.mapper.js'
import { mapPartnerPayments } from '../partner-payments/partner-payments.mapper.js'

export async function getDashboardSummary(_req, res) {
  const [
    usersCount,
    pendingServerRequests,
    paidServerRequests,
    processingServers,
    readyToShareServers,
    pendingPartnerPayments,
    paidPartnerPayments,
    recentServerRequests,
    recentPartnerPayments,
  ] = await Promise.all([
    countUsers(),
    countServerRequests({ paymentStatus: 'pending' }),
    countServerRequests({ paymentStatus: 'paid' }),
    countServerRequests({ serverStatus: 'processing' }),
    countServerRequests({ serverStatus: 'ready_to_share' }),
    countPartnerPayments({ status: 'pending' }),
    countPartnerPayments({ status: 'paid' }),
    findRecentServerRequests(5),
    findRecentPartnerPayments(5),
  ])

  res.ok({
    usersCount,
    pendingServerRequests,
    paidServerRequests,
    processingServers,
    readyToShareServers,
    pendingPartnerPayments,
    paidPartnerPayments,
    recentServerRequests: mapServerRequests(recentServerRequests),
    recentPartnerPayments: mapPartnerPayments(recentPartnerPayments),
  })
}
