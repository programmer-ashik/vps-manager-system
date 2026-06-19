import { config } from "../../../config/env.js";
import { VpsUserModel } from "./VpsUser.model.js";
import { VpsServerModel } from "../vps-servers/VpsServer.model.js";
import {
  calculateSubscriptionEndDate,
  calculateRenewalEndDate,
  isExpiringSoon,
} from "../../../utils/subscription.js";
import {
  assignVpsServerToUser,
  releaseVpsServer,
  findVpsServerById,
} from "../vps-servers/vps-servers.repo.js";

function buildFilter(query = {}) {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.subscriptionPlan) filter.subscriptionPlan = query.subscriptionPlan;
  if (query.search) {
    const regex = new RegExp(query.search, "i");
    filter.$or = [
      { customerName: regex },
      { customerEmail: regex },
      { notes: regex },
    ];
  }
  return filter;
}

export async function findAllVpsUsers(query) {
  const filter = buildFilter(query);
  let docs = await VpsUserModel.find(filter)
    .sort({ createdAt: -1 })
    .lean()
    .exec();
  if (query.expiringSoon === "true") {
    docs = docs.filter((doc) =>
      isExpiringSoon(doc.subscriptionEndDate, config.subscriptionWarningDays),
    );
  } else if (query.expiringSoon === "false") {
    docs = docs.filter(
      (doc) =>
        !isExpiringSoon(
          doc.subscriptionEndDate,
          config.subscriptionWarningDays,
        ),
    );
  }
  const allServerIds = docs.flatMap((d) => d.vpsServerIds || []).map(String);

  const uniqueServerIds = [...new Set(allServerIds)];
  const servers = uniqueServerIds.length
    ? await VpsServerModel.find({ _id: { $in: uniqueServerIds } })
        .lean()
        .exec()
    : [];
  const serverMap = Object.fromEntries(servers.map((s) => [String(s._id), s]));

  return { docs, serverMap };
}

export async function createVpsUserRecord(input) {
  const startDate = input.subscriptionStartDate ?? new Date();
  const subscriptionEndDate = calculateSubscriptionEndDate(
    startDate,
    input.subscriptionPlan,
  );
  const user = await VpsUserModel.create({
    ...input,
    subscriptionStartDate: startDate,
    subscriptionEndDate,
    status: "active",
  });

  if (input.vpsServerId) {
    const server = await findVpsServerById(input.vpsServerId);
    if (server && server.availabilityStatus === "available") {
      await assignVpsServerToUser(input.vpsServerId, user._id);
    }
  }

  return user;
}

export async function findVpsUserById(id) {
  return VpsUserModel.findById(id).exec();
}

export async function updateVpsUserById(id, input) {
  const existing = await VpsUserModel.findById(id).exec();
  if (!existing) return null;

  const oldServerId = existing.vpsServerId
    ? String(existing.vpsServerId)
    : null;
  const newServerId =
    input.vpsServerId === null
      ? null
      : input.vpsServerId !== undefined
        ? input.vpsServerId
        : oldServerId;

  if (input.vpsServerId !== undefined && oldServerId !== newServerId) {
    if (oldServerId) await releaseVpsServer(oldServerId);
    if (newServerId) {
      const server = await findVpsServerById(newServerId);
      if (server?.availabilityStatus === "available") {
        await assignVpsServerToUser(newServerId, id);
      }
    }
  }

  return VpsUserModel.findByIdAndUpdate(id, input, { new: true }).exec();
}

export async function renewVpsUserById(id, plan) {
  const existing = await VpsUserModel.findById(id).exec();
  if (!existing) return null;

  const subscriptionEndDate = calculateRenewalEndDate(
    existing.subscriptionEndDate,
    plan,
  );

  return VpsUserModel.findByIdAndUpdate(
    id,
    {
      subscriptionPlan: plan,
      subscriptionEndDate,
      status: "active",
    },
    { new: true },
  ).exec();
}

export async function deleteVpsUserById(id) {
  const existing = await VpsUserModel.findById(id).exec();
  if (!existing) return null;

  if (existing.vpsServerId) {
    await releaseVpsServer(String(existing.vpsServerId));
  }

  return VpsUserModel.findByIdAndDelete(id).exec();
}

export async function syncExpiredVpsUsers() {
  const now = new Date();
  await VpsUserModel.updateMany(
    { subscriptionEndDate: { $lt: now }, status: "active" },
    { status: "expired" },
  ).exec();
}
