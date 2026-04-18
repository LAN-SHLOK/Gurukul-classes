"use client";

import { Card } from "@/components/ui/Card";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-32">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Terms & Conditions</h1>
        <Card>
          <div className="prose prose-blue max-w-none">
            <p>Welcome to Gurukul Classes. By using our services, you agree to the following terms...</p>
            <h3>1. Admissions</h3>
            <p>Admission is subject to availability and fulfilling the entrance criteria of the respective course.</p>
            <h3>2. Fees</h3>
            <p>All fees are non-refundable once paid, except under specific circumstances outlined in the physical admission form.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
