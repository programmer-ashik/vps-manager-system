import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetPartnerPaymentQuery,
  useUpdatePartnerPaymentStatusMutation,
  useDeletePartnerPaymentMutation,
} from '../../api/partnerPaymentApi';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/common/useToast';
import { getAssetUrl } from '../../utils/assets';

export default function PartnerPaymentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: item, isLoading, isError } = useGetPartnerPaymentQuery(id ?? '');
  const [updateStatus] = useUpdatePartnerPaymentStatusMutation();
  const [deletePayment] = useDeletePartnerPaymentMutation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { showToast } = useToast();

  if (isLoading) return <div className="p-4">Loading…</div>;
  if (isError || !item) {
    return (
      <div className="p-6 border border-red-200 rounded-lg text-red-700">
        Partner payment not found.
        <Button className="mt-4" variant="secondary" onClick={() => navigate('/partner-payments')}>
          Back
        </Button>
      </div>
    );
  }

  const markStatus = async (status) => {
    try {
      await updateStatus({ id: item.id, status }).unwrap();
      showToast(`Marked as ${status}`);
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const onDelete = async () => {
    try {
      await deletePayment(item.id).unwrap();
      showToast('Deleted');
      navigate('/partner-payments');
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-wrap justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{item.partnerName}</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Partner payment details</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/partner-payments')}>Back</Button>
          <Button variant="secondary" onClick={() => setConfirmDelete(true)}>Delete</Button>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-white dark:bg-neutral-800 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-neutral-500 text-sm">Status</span>
          <StatusBadge status={item.status} />
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div><dt className="text-neutral-500">Email</dt><dd>{item.partnerEmail}</dd></div>
          <div><dt className="text-neutral-500">Amount</dt><dd>${item.amount}</dd></div>
          <div><dt className="text-neutral-500">Payment Type</dt><dd>{item.paymentType}</dd></div>
          <div><dt className="text-neutral-500">Transaction ID</dt><dd>{item.transactionId}</dd></div>
          <div className="sm:col-span-2">
            <dt className="text-neutral-500">Notes</dt>
            <dd>{item.notes || '—'}</dd>
          </div>
          <div><dt className="text-neutral-500">Submitted</dt><dd>{new Date(item.createdAt).toLocaleString()}</dd></div>
        </dl>

        {item.screenshotUrl && (
          <div>
            <p className="text-sm text-neutral-500 mb-2">Screenshot</p>
            <a href={getAssetUrl(item.screenshotUrl)} target="_blank" rel="noreferrer">
              <img
                src={getAssetUrl(item.screenshotUrl)}
                alt="Payment screenshot"
                className="max-h-80 rounded-md border"
              />
            </a>
          </div>
        )}

        {item.status === 'pending' && (
          <div className="flex gap-2 pt-2">
            <Button onClick={() => markStatus('paid')}>Mark Paid</Button>
            <Button variant="secondary" onClick={() => markStatus('rejected')}>Reject</Button>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={onDelete}
        title="Delete Partner Payment"
        message="Are you sure you want to delete this payment?"
      />
    </div>
  );
}
