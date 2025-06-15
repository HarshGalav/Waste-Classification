'use client';

import { WasteSubmission } from '@/app/types';
import Image from 'next/image';
import { Clock, CheckCircle, XCircle, Star } from 'lucide-react';

interface WasteCardProps {
  submission: WasteSubmission;
  onVerify?: (id: string) => void;
  showVerifyButton?: boolean;
}

export default function WasteCard({ submission, onVerify, showVerifyButton }: WasteCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-400" size={20} />;
      case 'verified':
        return <CheckCircle className="text-green-400" size={20} />;
      case 'rejected':
        return <XCircle className="text-red-400" size={20} />;
      default:
        return <Clock className="text-yellow-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400';
      case 'verified':
        return 'text-green-400';
      case 'rejected':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  return (
    <div className="glass-effect rounded-xl p-6 transition-all hover:scale-[1.02]">
        <Image
          src={submission.imageUrl}
          alt="Waste submission"
          width={96}
          height={96}
          className="object-cover rounded-lg border border-dark-border"
        />
       
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-dark-text capitalize">
              {submission.wasteType}
            </h3>
            <div className="flex items-center gap-2">
              {getStatusIcon(submission.status)}
              <span className={`text-sm font-medium capitalize ${getStatusColor(submission.status)}`}>
                {submission.status}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-dark-muted text-sm">
              Quantity: <span className="text-dark-text">{submission.quantity}</span>
            </p>
            <div className="flex items-center gap-1">
              <Star className="text-yellow-400" size={16} />
              <span className="text-dark-text font-medium">{submission.estimatedPoints} points</span>
            </div>
            <p className="text-dark-muted text-xs">
              Submitted: {submission.submittedAt.toLocaleDateString()}
            </p>
          </div>
          
          {showVerifyButton && submission.status === 'pending' && (
            <button
              onClick={() => onVerify?.(submission.id)}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
            >
              Verify Submission
            </button>
          )}
      </div>
    </div>
  );
}