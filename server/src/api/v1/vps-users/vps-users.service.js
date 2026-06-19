import {
  findAllVpsUsers,
  createVpsUserRecord,
  findVpsUserById,
  updateVpsUserById,
  renewVpsUserById,
  deleteVpsUserById,
  syncExpiredVpsUsers,
} from "./vps-users.repo.js";
import { findVpsServerById } from "../vps-servers/vps-servers.repo.js";
import { VpsServerModel } from "../vps-servers/VpsServer.model.js";

export async function listVpsUsers(query) {
  await syncExpiredVpsUsers();
  return findAllVpsUsers(query);
}

export async function createVpsUser(input) {
  return createVpsUserRecord(input);
}

export async function getVpsUserById(id) {
  await syncExpiredVpsUsers();
  const user = await findVpsUserById(id);
  if (!user) return null;
  let vpsServers = [];
  if (user.vpsServerIds && user.vpsServerIds.length > 0) {
    vpsServers = await VpsServerModel.find({
      _id: { $in: user.vpsServerIds },
    })
      .lean()
      .exec();
  }
  return { user, vpsServers };
}

export async function updateVpsUser(id, input) {
  return updateVpsUserById(id, input);
}

export async function renewVpsUser(id, subscriptionPlan) {
  return renewVpsUserById(id, subscriptionPlan);
}

export async function deleteVpsUser(id) {
  return deleteVpsUserById(id);
}
