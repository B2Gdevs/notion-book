'use client'

import React, { useState } from 'react';
import { BatchRunResultsCard, JobCard, PageTitleDisplay, Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, useGetBatchRunResults } from 'ui';

const BatchRunResultsComponent: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [visitedPages, setVisitedPages] = useState([1]);
    const pageSize = 10; // Define your page size here

    const { data: batchRunResults, isFetching } = useGetBatchRunResults({
        page: currentPage,
        pageSize: pageSize,
        sortBy: 'created_at',
        sortDirection: 'desc',
    });

    // State variable for the selected job
    const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);

    // Handle page change
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        if (!visitedPages.includes(newPage)) {
            setVisitedPages(prevPages => [...prevPages, newPage].sort((a, b) => a - b));
        }
    };

    // Calculate visible pages
    const visiblePages = visitedPages.filter(page => {
        if (currentPage <= 3) {
            return page <= 5;
        } else if (currentPage >= visitedPages.length - 2) {
            return page >= visitedPages.length - 4;
        } else {
            return Math.abs(currentPage - page) <= 2;
        }
    });

    return (
        <div>
            <Pagination className='my-2'>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} isActive={currentPage === 1} className="border-2 border-black rounded-lg text-black cursor-pointer" />
                    </PaginationItem>
                    {currentPage > 3 && visitedPages.length > 5 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}
                    {visiblePages.map(page => (
                        <PaginationItem key={page}>
                            <PaginationLink onClick={() => handlePageChange(page)} isActive={currentPage === page} className={`border-2 border-black rounded-lg cursor-pointer ${currentPage === page ? 'bg-black text-white' : 'text-black'}`}>
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    {currentPage < visitedPages.length - 2 && visitedPages.length > 5 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}
                    <PaginationItem>
                        <PaginationNext onClick={() => handlePageChange(currentPage + 1)} isActive={currentPage === visitedPages.length} className="border-2 border-black rounded-lg text-black cursor-pointer" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            <div className="flex items-top">
                <div className="w-2/6 space-y-6">
                    <BatchRunResultsCard
                        key={"batch_run_starter_card"}
                    />
                    {batchRunResults?.map((result) => (
                        <BatchRunResultsCard
                            key={result.id}
                            batchRunResult={result}
                            onShowJobs={() => {
                                setSelectedJobIds(result.job_ids);
                            }}
                        />
                    ))}
                    {isFetching && <div>Loading...</div>}
                </div>
                <div className="w-4/6 space-y-4">
                    <PageTitleDisplay overrideTitle="Jobs" additionalText={`(${selectedJobIds?.length}) jobs`}/>
                    {selectedJobIds.map((jobId, idx) => (
                        <JobCard key={jobId} jobId={jobId} step={idx+1} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BatchRunResultsComponent;