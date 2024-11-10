'use client';
import { useParams } from 'next/navigation';
import React from 'react';
import { Button, JobCard, JobSummary, PageTitleDisplay, toast, useDeleteDeliveryJob, useGetDeliveryJobById } from 'ui';

const JobDetailPage: React.FC = () => {
    const params = useParams();
    const jobId = params.id as string;
    const { data: job, isLoading: isLoadingJob } = useGetDeliveryJobById(jobId);

    const deleteJobMutation = useDeleteDeliveryJob({
        onSuccess: () => {
            toast({
                title: 'Job Deleted',
                description: `Successfully deleted job ${jobId}`,
                duration: 5000,
            });
            // Redirect or update UI accordingly
        },
        onError: (error) => {
            toast({
                title: 'Error Deleting Job',
                description: `Failed to delete job ${jobId}: ${error.message}`,
                duration: 5000,
            });
        },
    });

    const handleDeleteJob = () => {
        if (confirm('Are you sure you want to delete this job?')) {
            deleteJobMutation.mutate(jobId);
        }
    };

    if (isLoadingJob) return <div>Loading job details...</div>;
    if (!job) return <div>Job not found.</div>;

    return (
        <div className="p-4 max-w-4xl mx-auto my-8 border-2 border-black rounded-lg">
            <PageTitleDisplay overrideTitle="Job Detail" />
            <JobCard jobId={jobId} />
            <JobSummary job={job} />
            <div className="flex justify-end mt-4">
                <Button variant="destructive" onClick={handleDeleteJob}>Delete Job</Button>
            </div>
        </div>
    );
};

export default JobDetailPage;