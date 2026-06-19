import { NotFound } from "../../../core/http/error.types.js";
import {
  listVpsUsers,
  createVpsUser,
  getVpsUserById,
  updateVpsUser,
  renewVpsUser,
  deleteVpsUser,
} from "./vps-users.service.js";
import { mapVpsUser, mapVpsUsers } from "./vps-users.mapper.js";

export async function getVpsUsers(req, res) {
  const { docs, serverMap } = await listVpsUsers(req.query ?? {});
  res.ok(mapVpsUsers(docs, serverMap));
}

export async function postVpsUser(req, res) {
  const created = await createVpsUser(req.body ?? {});
  const result = await getVpsUserById(String(created._id));
  res.ok(mapVpsUser(result.user, result.vpsServer), 201);
}

export async function getVpsUser(req, res) {
  const result = await getVpsUserById(req.params.id);
  console.log(result, "result in controller");
  if (!result) throw new NotFound("VPS user not found");
  res.ok(mapVpsUser(result.user, result.vpsServers));
}

export async function putVpsUser(req, res) {
  const updated = await updateVpsUser(req.params.id, req.body ?? {});
  if (!updated) throw new NotFound("VPS user not found");
  const result = await getVpsUserById(req.params.id);
  res.ok(mapVpsUser(result.user, result.vpsServer));
}

export async function postRenewVpsUser(req, res) {
  const renewed = await renewVpsUser(req.params.id, req.body.subscriptionPlan);
  if (!renewed) throw new NotFound("VPS user not found");
  const result = await getVpsUserById(req.params.id);
  res.ok(mapVpsUser(result.user, result.vpsServer));
}

export async function deleteVpsUserById(req, res) {
  const deleted = await deleteVpsUser(req.params.id);
  if (!deleted) throw new NotFound("VPS user not found");
  res.ok({ id: String(deleted._id) });
}
