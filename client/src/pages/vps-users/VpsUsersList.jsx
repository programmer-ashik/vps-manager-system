import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  useGetVpsUsersQuery,
  useDeleteVpsUserMutation,
  useRenewVpsUserMutation,
} from "../../api/vpsUserApi";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";
import { useToast } from "../../components/common/useToast";

const PLAN_LABELS = {
  monthly: "Monthly",
  "3_monthly": "3 Monthly",
  "6_monthly": "6 Monthly",
  yearly: "Yearly",
};

function ExpiryWarning({ user }) {
  if (!user.expiringSoon) return null;
  return (
    <span
      title={`Subscription expires in ${user.daysUntilExpiry} day(s) — contact customer to renew`}
      className='inline-flex items-center gap-1 text-amber-600 dark:text-amber-400'
    >
      <svg
        className='w-4 h-4'
        fill='currentColor'
        viewBox='0 0 20 20'
        aria-hidden='true'
      >
        <path
          fillRule='evenodd'
          d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
          clipRule='evenodd'
        />
      </svg>
      <span className='text-xs font-medium'>Renew soon</span>
    </span>
  );
}

export default function VpsUsersList() {
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [expiringFilter, setExpiringFilter] = useState("");
  const [search, setSearch] = useState("");
  const params = useMemo(() => {
    const q = {};
    if (statusFilter) q.status = statusFilter;
    if (planFilter) q.subscriptionPlan = planFilter;
    if (expiringFilter) q.expiringSoon = expiringFilter;
    if (search.trim()) q.search = search.trim();
    return q;
  }, [statusFilter, planFilter, expiringFilter, search]);

  const { data = [], isLoading, isError } = useGetVpsUsersQuery(params);
  const [deleteUser] = useDeleteVpsUserMutation();
  const [renewUser, { isLoading: renewing }] = useRenewVpsUserMutation();
  const [deleteId, setDeleteId] = useState(null);
  const [renewTarget, setRenewTarget] = useState(null);
  const [renewPlan, setRenewPlan] = useState("monthly");
  const { showToast } = useToast();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteUser(deleteId).unwrap();
      showToast("VPS user deleted");
      setDeleteId(null);
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  const handleRenew = async () => {
    if (!renewTarget) return;
    try {
      await renewUser({
        id: renewTarget.id,
        subscriptionPlan: renewPlan,
      }).unwrap();
      showToast("Subscription renewed");
      setRenewTarget(null);
    } catch {
      showToast("Failed to renew", "error");
    }
  };

  if (isLoading) return <div className='p-4'>Loading…</div>;
  if (isError)
    return <div className='p-4 text-red-500'>Failed to load VPS users.</div>;

  const expiringCount = data.filter((u) => u.expiringSoon).length;

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex flex-wrap items-start justify-between gap-4 mb-6'>
        <div>
          <h1 className='text-3xl font-bold'>VPS Users</h1>
          <p className='text-sm text-neutral-600 dark:text-neutral-400 mt-1'>
            Purchased VPS customers with subscription plans
            {expiringCount > 0 && (
              <span className='ml-2 text-amber-600 font-medium'>
                · {expiringCount} expiring within 5 days
              </span>
            )}
          </p>
        </div>
        <Link
          to='/vps-users/new'
          className='px-4 py-2 text-sm font-medium rounded-md bg-accent-500 text-white hover:bg-accent-600'
        >
          Add VPS User
        </Link>
      </div>

      <div className='flex flex-wrap gap-3 mb-4'>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search customer name, email…'
          className='border rounded-md px-3 py-2 text-sm bg-white dark:bg-neutral-900 min-w-[220px]'
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className='border rounded-md px-3 py-2 text-sm bg-white dark:bg-neutral-900'
        >
          <option value=''>All statuses</option>
          <option value='active'>Active</option>
          <option value='expired'>Expired</option>
          <option value='cancelled'>Cancelled</option>
        </select>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className='border rounded-md px-3 py-2 text-sm bg-white dark:bg-neutral-900'
        >
          <option value=''>All plans</option>
          <option value='monthly'>Monthly</option>
          <option value='3_monthly'>3 Monthly</option>
          <option value='6_monthly'>6 Monthly</option>
          <option value='yearly'>Yearly</option>
        </select>
        <select
          value={expiringFilter}
          onChange={(e) => setExpiringFilter(e.target.value)}
          className='border rounded-md px-3 py-2 text-sm bg-white dark:bg-neutral-900'
        >
          <option value=''>All expiry</option>
          <option value='true'>Expiring soon</option>
          <option value='false'>Not expiring soon</option>
        </select>
      </div>

      <div className='overflow-x-auto border rounded-lg bg-white dark:bg-neutral-800 shadow-sm'>
        <table className='w-full text-sm'>
          <thead className='bg-neutral-50 dark:bg-neutral-900 border-b'>
            <tr>
              <th className='text-left p-4'>Customer</th>
              <th className='text-left p-4'>Plan</th>
              <th className='text-left p-4'>Expires</th>
              <th className='text-left p-4'>VPS Server</th>
              <th className='text-left p-4'>Status</th>
              <th className='text-right p-4'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan='6' className='p-8 text-center text-neutral-500'>
                  No VPS users found
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className='border-b hover:bg-neutral-50 dark:hover:bg-neutral-900/50'
                >
                  <td className='p-4'>
                    <div className='flex items-center gap-2'>
                      <div>
                        <div className='font-medium'>{item.customerName}</div>
                        <div className='text-neutral-500 text-xs'>
                          {item.customerEmail}
                        </div>
                      </div>
                      <ExpiryWarning user={item} />
                    </div>
                  </td>
                  <td className='p-4'>
                    {PLAN_LABELS[item.subscriptionPlan] ??
                      item.subscriptionPlan}
                  </td>
                  <td className='p-4'>
                    <div>
                      {new Date(item.subscriptionEndDate).toLocaleDateString()}
                    </div>
                    {item.daysUntilExpiry !== null &&
                      item.status === "active" && (
                        <div className='text-xs text-neutral-500'>
                          {item.daysUntilExpiry} days left
                        </div>
                      )}
                  </td>
                  <td className='p-4'>
                    {item.vpsServers && item.vpsServers.length > 0 ? (
                      <div className='flex items-center gap-2'>
                        <div className='text-sm truncate max-w-[120px]'>
                          {item.vpsServers[0].name}
                        </div>
                        {item.vpsServers.length > 1 && (
                          <span className='px-2 py-0.5 text-[10px] font-bold bg-cyan-100 text-cyan-700 rounded-full'>
                            +{item.vpsServers.length - 1} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className='text-neutral-400 text-sm italic'>
                        Not assigned
                      </span>
                    )}
                  </td>
                  <td className='p-4'>
                    <StatusBadge status={item.status} />
                  </td>
                  <td className='p-4'>
                    <div className='flex justify-end gap-2 flex-wrap'>
                      <button
                        onClick={() => {
                          setRenewTarget(item);
                          setRenewPlan(item.subscriptionPlan);
                        }}
                        className='px-2 py-1 text-xs border rounded-md hover:bg-emerald-50 text-emerald-700'
                      >
                        Renew
                      </button>
                      <Link
                        to={`/vps-users/${item.id}`}
                        className='px-2 py-1 text-xs border rounded-md hover:bg-neutral-100'
                      >
                        View
                      </Link>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className='px-2 py-1 text-xs border border-red-300 text-red-600 rounded-md'
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title='Delete VPS User'
        message='Are you sure you want to delete this VPS user? The assigned server will be released.'
      />

      <Modal
        isOpen={!!renewTarget}
        onClose={() => setRenewTarget(null)}
        title='Renew Subscription'
      >
        {renewTarget && (
          <div className='space-y-4'>
            <p className='text-sm text-neutral-600 dark:text-neutral-400'>
              Renew subscription for <strong>{renewTarget.customerName}</strong>
            </p>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Subscription Plan
              </label>
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
            </div>
            <div className='flex gap-2 justify-end'>
              <button
                onClick={() => setRenewTarget(null)}
                className='px-4 py-2 text-sm border rounded-md'
              >
                Cancel
              </button>
              <button
                onClick={handleRenew}
                disabled={renewing}
                className='px-4 py-2 text-sm rounded-md bg-accent-500 text-white disabled:opacity-50'
              >
                {renewing ? "Renewing…" : "Confirm Renewal"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
