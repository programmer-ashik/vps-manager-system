import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import {
  useGetVpsUserQuery,
  useUpdateVpsUserMutation,
  useRenewVpsUserMutation,
  useDeleteVpsUserMutation,
} from "../../api/vpsUserApi";
import { useGetVpsServersQuery } from "../../api/vpsServerApi";
import StatusBadge from "../../components/common/StatusBadge";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Modal from "../../components/common/Modal";
import Button from "../../components/ui/Button";
import { useToast } from "../../components/common/useToast";
import { motion } from "framer-motion";
const PLAN_LABELS = {
  monthly: "Monthly",
  "3_monthly": "3 Monthly",
  "6_monthly": "6 Monthly",
  yearly: "Yearly",
};

export default function VpsUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useGetVpsUserQuery(id);
  const { data: availableServers = [] } = useGetVpsServersQuery({
    availabilityStatus: "available",
  });
  console.log(user);
  const [updateUser, { isLoading: saving }] = useUpdateVpsUserMutation();
  const [renewUser, { isLoading: renewing }] = useRenewVpsUserMutation();
  const [deleteUser] = useDeleteVpsUserMutation();
  const [showDelete, setShowDelete] = useState(false);
  const [showRenew, setShowRenew] = useState(false);
  const [renewPlan, setRenewPlan] = useState("monthly");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const { showToast } = useToast();

  if (isLoading) return <div className='p-4'>Loading…</div>;
  if (isError || !user)
    return <div className='p-4 text-red-500'>VPS user not found.</div>;

  const serverOptions = [
    ...(user.vpsServer ? [user.vpsServer] : []),
    ...availableServers.filter((s) => s.id !== user.vpsServerId),
  ];

  const startEdit = () => {
    setForm({
      customerName: user.customerName,
      customerEmail: user.customerEmail,
      customerPhone: user.customerPhone ?? "",
      vpsServerId: user.vpsServerId ?? "",
      notes: user.notes ?? "",
    });
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateUser({
        id,
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone || undefined,
        vpsServerId: form.vpsServerId || null,
        notes: form.notes || undefined,
      }).unwrap();
      showToast("VPS user updated");
      setEditing(false);
    } catch {
      showToast("Failed to update", "error");
    }
  };

  const handleRenew = async () => {
    try {
      await renewUser({ id, subscriptionPlan: renewPlan }).unwrap();
      showToast("Subscription renewed");
      setShowRenew(false);
    } catch {
      showToast("Failed to renew", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(id).unwrap();
      showToast("VPS user deleted");
      navigate("/vps-users");
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  return (
    <div className='max-w-3xl mx-auto'>
      <div className='flex flex-wrap items-start justify-between gap-4 mb-6'>
        <div>
          <Link
            to='/vps-users'
            className='text-sm text-accent-600 hover:underline'
          >
            ← Back to VPS Users
          </Link>
          <div className='flex items-center gap-3 mt-2'>
            <h1 className='text-3xl font-bold'>{user.customerName}</h1>
            {user.expiringSoon && (
              <span
                title={`Expires in ${user.daysUntilExpiry} day(s) — contact customer`}
                className='inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
              >
                ⚠ Renew soon ({user.daysUntilExpiry}d left)
              </span>
            )}
          </div>
        </div>
        <div className='flex gap-2 flex-wrap'>
          <Button
            onClick={() => {
              setRenewPlan(user.subscriptionPlan);
              setShowRenew(true);
            }}
          >
            Renew
          </Button>
          {!editing && (
            <Button variant='secondary' onClick={startEdit}>
              Edit
            </Button>
          )}
          <Button variant='secondary' onClick={() => setShowDelete(true)}>
            Delete
          </Button>
        </div>
      </div>

      <div className='border rounded-lg bg-white dark:bg-neutral-800 shadow-sm divide-y'>
        <div className='p-6 grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <p className='text-xs text-neutral-500 uppercase tracking-wide'>
              Status
            </p>
            <div className='mt-1'>
              <StatusBadge status={user.status} />
            </div>
          </div>
          <div>
            <p className='text-xs text-neutral-500 uppercase tracking-wide'>
              Plan
            </p>
            <p className='mt-1 text-sm'>{PLAN_LABELS[user.subscriptionPlan]}</p>
          </div>
          <div>
            <p className='text-xs text-neutral-500 uppercase tracking-wide'>
              Start Date
            </p>
            <p className='mt-1 text-sm'>
              {new Date(user.subscriptionStartDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className='text-xs text-neutral-500 uppercase tracking-wide'>
              End Date
            </p>
            <p className='mt-1 text-sm'>
              {new Date(user.subscriptionEndDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {editing ? (
          <div className='p-6 space-y-4'>
            <input
              placeholder='Customer name'
              value={form.customerName}
              onChange={(e) =>
                setForm({ ...form, customerName: e.target.value })
              }
              className='w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-neutral-900'
            />
            <input
              placeholder='Email'
              value={form.customerEmail}
              onChange={(e) =>
                setForm({ ...form, customerEmail: e.target.value })
              }
              className='w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-neutral-900'
            />
            <input
              placeholder='Phone'
              value={form.customerPhone}
              onChange={(e) =>
                setForm({ ...form, customerPhone: e.target.value })
              }
              className='w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-neutral-900'
            />
            <select
              value={form.vpsServerId}
              onChange={(e) =>
                setForm({ ...form, vpsServerId: e.target.value })
              }
              className='w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-neutral-900'
            >
              <option value=''>No server assigned</option>
              {serverOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.ip}
                </option>
              ))}
            </select>
            <textarea
              placeholder='Notes'
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className='w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-neutral-900'
            />
            <div className='flex gap-2'>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
              <Button variant='secondary' onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className='p-6'>
              <p className='text-xs text-neutral-500 uppercase tracking-wide mb-1'>
                Contact
              </p>
              <p className='text-sm'>{user.customerEmail}</p>
              {user.customerPhone && (
                <p className='text-sm text-neutral-500'>{user.customerPhone}</p>
              )}
            </div>
            {user.vpsServers && user.vpsServers.length > 0 ? (
              <div className='p-6'>
                <p className='text-xs text-neutral-500 uppercase tracking-wide mb-3'>
                  Assigned VPS Servers ({user.vpsServers.length})
                </p>
                <div className='grid gap-3'>
                  {user.vpsServers.map((server) => (
                    <motion.div
                      key={server.id}
                      whileHover={{
                        scale: 1.01,
                        backgroundColor: "rgba(245, 245, 245, 0.5)",
                      }}
                      className='border border-neutral-200 dark:border-neutral-700 p-4 rounded-lg flex items-center justify-between dark:hover:bg-neutral-800/50 transition-colors'
                    >
                      <div>
                        <p className='font-medium'>{server.name}</p>
                        <p className='text-sm font-mono text-neutral-500'>
                          {server.ip}
                        </p>
                      </div>
                      <Link
                        to={`/vps-servers/${server.id}`}
                        className='text-sm text-accent-600 hover:underline'
                      >
                        View →
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Credential সেকশন যদি একটি সার্ভারের জন্য দেখাতে চান, তা এখানে লজিক অনুযায়ী রাখতে পারেন */}
              </div>
            ) : (
              <div className='p-6'>
                <p className='text-sm text-neutral-500 italic'>
                  No servers assigned.
                </p>
              </div>
            )}
            {user.notes && (
              <div className='p-6'>
                <p className='text-xs text-neutral-500 uppercase tracking-wide mb-1'>
                  Notes
                </p>
                <p className='text-sm whitespace-pre-wrap'>{user.notes}</p>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title='Delete VPS User'
        message='Are you sure? The assigned VPS server will be released back to available.'
      />

      <Modal
        isOpen={showRenew}
        onClose={() => setShowRenew(false)}
        title='Renew Subscription'
      >
        <div className='space-y-4'>
          <p className='text-sm text-neutral-600 dark:text-neutral-400'>
            Extend subscription for <strong>{user.customerName}</strong>
          </p>
          <select
            value={renewPlan}
            onChange={(e) => setRenewPlan(e.target.value)}
            className='w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-neutral-900'
          >
            <option value='monthly'>Monthly</option>
            <option value='3_monthly'>3 Monthly</option>
            <option value='6_monthly'>6 Monthly</option>
            <option value='yearly'>Yearly</option>
          </select>
          <div className='flex gap-2 justify-end'>
            <Button variant='secondary' onClick={() => setShowRenew(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenew} disabled={renewing}>
              {renewing ? "Renewing…" : "Confirm Renewal"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
