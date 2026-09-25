import React, { useState } from 'react';
import { AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';
import Button from './Button';
import { createReport } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const REPORT_REASONS = [
  'Misleading Information',
  'Quality / Service Issue',
  'Fraud / Spam',
  'Unprofessional Conduct',
  'Other',
];

const ReportModal = ({ isOpen, onClose, targetType, targetId, targetName }) => {
  const { isAuthenticated, role } = useAuth();
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please log in as a Customer to submit a report.');
      return;
    }
    if (role !== 'CUSTOMER') {
      setError('Only Customer accounts can submit reports.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        reason,
        description: description.trim(),
      };
      if (targetType === 'business') payload.businessId = targetId;
      if (targetType === 'order') payload.orderId = targetId;
      if (targetType === 'inquiry') payload.inquiryId = targetId;

      await createReport(payload);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
        className="bg-brand-surface border border-brand-border rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-3 border-b border-brand-border">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 id="report-modal-title" className="text-base font-bold text-brand-secondary">
              Report {targetType === 'business' ? 'Business' : targetType === 'order' ? 'Order' : 'Inquiry'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close report modal"
            className="text-brand-muted hover:text-brand-secondary text-lg"
          >
            &times;
          </button>
        </div>

        {targetName && (
          <div className="bg-brand-background border border-brand-border rounded-lg p-3 text-xs text-brand-muted">
            <span className="font-bold text-brand-secondary uppercase block mb-0.5 text-[10px]">Reporting</span>
            <span className="font-medium text-brand-text">{targetName}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-emerald-200">Report Submitted</h4>
            <p className="text-xs text-emerald-300/80">Thank you. Our admin team will review your report.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-xs text-red-400">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-brand-secondary uppercase mb-1">
                Reason *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-brand-background border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              >
                {REPORT_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-secondary uppercase mb-1">
                Additional Details (Optional)
              </label>
              <textarea
                rows={3}
                maxLength={1000}
                placeholder="Provide details about the issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-brand-background border border-brand-border rounded-lg p-3 text-sm text-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2 border-t border-brand-border">
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Report'
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
