import { config } from "../../../config/env.js";
import {
  isExpiringSoon,
  getDaysUntilExpiry,
} from "../../../utils/subscription.js";

export function mapVpsServer(doc) {
  if (!doc) return null;
  return {
    id: String(doc?._id ?? doc?.id),
    name: doc.name,
    serverDetails: doc.serverDetails,
    ip: doc.ip,
    credentials: doc.credentials,
    availabilityStatus: doc.availabilityStatus,
    pingStatus: doc.pingStatus,
    isActive: doc.isActive,
    lastPingedAt: doc.lastPingedAt,
    assignedVpsUserId: doc.assignedVpsUserId
      ? String(doc.assignedVpsUserId)
      : null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export function mapVpsServers(docs) {
  return docs.map(mapVpsServer);
}

export function mapVpsUser(doc, vpsServers = []) {
  const endDate = doc.subscriptionEndDate;
  const expiringSoon = isExpiringSoon(endDate, config.subscriptionWarningDays);
  const daysUntilExpiry = getDaysUntilExpiry(endDate);

  return {
    id: String(doc?._id ?? doc?.id),
    customerName: doc.customerName,
    customerEmail: doc.customerEmail,
    customerPhone: doc.customerPhone,
    vpsServerIds: doc.vpsServerIds ? doc.vpsServerIds.map(String) : [],
    vpsServers: vpsServers.map(mapVpsServer),
    subscriptionPlan: doc.subscriptionPlan,
    subscriptionStartDate: doc.subscriptionStartDate,
    subscriptionEndDate: doc.subscriptionEndDate,
    status: doc.status,
    notes: doc.notes,
    expiringSoon,
    daysUntilExpiry,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export function mapVpsUsers(docs, serverMap = {}) {
  return docs.map((doc) => {
    const serverIds = doc.vpsServerIds || [];
    const servers = serverIds
      .map((id) => serverMap[String(id)])
      .filter(Boolean);

    return mapVpsUser(doc, servers);
  });
}
