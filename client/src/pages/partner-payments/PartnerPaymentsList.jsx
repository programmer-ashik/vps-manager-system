import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
  useGetPartnerPaymentsQuery,
  useDeletePartnerPaymentMutation,
  useUpdatePartnerPaymentStatusMutation,
} from '../../api/partnerPaymentApi';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusBadge from '../../components/common/StatusBadge';
import { useToast } from '../../components/common/useToast';
import { getAssetUrl } from '../../utils/assets';

export default function PartnerPaymentsList() {
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const params = useMemo(() => {
    const q = {};
    if (statusFilter) q.status = statusFilter;
    if (search.trim()) q.search = search.trim();
    return q;
  }, [statusFilter, search]);

  const { data = [], isLoading, isError } = useGetPartnerPaymentsQuery(params);
  const [deletePayment] = useDeletePartnerPaymentMutation();
  const [updateStatus] = useUpdatePartnerPaymentStatusMutation();
  const [deleteId, setDeleteId] = useState(null);
  const { showToast } = useToast();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePayment(deleteId).unwrap();
      showToast('Partner payment deleted');
      setDeleteId(null);
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  const markStatus = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      showToast(`Marked as ${status}`);
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  if (isLoading) return <div className="p-4">Loading…</div>;
  if (isError) return <div className="p-4 text-red-500">Failed to load partner payments.</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Partner Payments</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Review payment submissions from partners
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search partner, transaction…"
          className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-neutral-900 min-w-[220px]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-neutral-900"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="overflow-x-auto border rounded-lg bg-white dark:bg-neutral-800 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b">
            <tr>
              <th className="text-left p-4">Partner</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Screenshot</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-neutral-500">No partner payments found</td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="border-b hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                  <td className="p-4">
                    <div className="font-medium">{item.partnerName}</div>
                    <div className="text-xs text-neutral-500">{item.partnerEmail}</div>
                  </td>
                  <td className="p-4">${item.amount}</td>
                  <td className="p-4">{item.paymentType}</td>
                  <td className="p-4"><StatusBadge status={item.status} /></td>
                  <td className="p-4">
                    {item.screenshotUrl ? (
                      <a
                        href={getAssetUrl(item.screenshotUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent-600 hover:underline text-xs"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-neutral-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2 flex-wrap">
                      {item.status === 'pending' && (
                        <>
                          <button
                            onClick={() => markStatus(item.id, 'paid')}
                            className="px-2 py-1 text-xs border rounded-md text-emerald-700"
                          >
                            Mark Paid
                          </button>
                          <button
                            onClick={() => markStatus(item.id, 'rejected')}
                            className="px-2 py-1 text-xs border rounded-md text-red-700"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <Link to={`/partner-payments/${item.id}`} className="px-2 py-1 text-xs border rounded-md">
                        View
                      </Link>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="px-2 py-1 text-xs border border-red-300 text-red-600 rounded-md"
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
        title="Delete Partner Payment"
        message="Are you sure you want to delete this payment submission?"
      />
    </div>
  );
}
