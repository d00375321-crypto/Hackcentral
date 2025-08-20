import { SubmissionReviewList } from '@/components/judge/submission-review-list';

export default function JudgePage() {
  return (
    <div className="space-y-6">
       <h1 className="text-2xl font-semibold">Judge Dashboard</h1>
       <SubmissionReviewList />
    </div>
  );
}
