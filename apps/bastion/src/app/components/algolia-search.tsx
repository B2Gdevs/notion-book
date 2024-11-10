import algoliasearch from 'algoliasearch/lite';
import type { SearchClient } from 'instantsearch.js';
import { Configure, Hits, Index, InstantSearch, SearchBox } from 'react-instantsearch';
import { BrandHitComponent } from './brand-hit-component';
import { DeliveryJobHitComponent } from './delivery-job-hit-component';
import { OrderHitComponent } from './order-hit-component';
import { OrgHitComponent } from './org-hit-component';
import { UserHitComponent } from './user-hit-component';
import { Dialog, DialogContent, TitleComponent } from 'ui';
import React, { useRef, useEffect } from 'react'; // Import useRef and useEffect

const algoliaClient = algoliasearch(
    'QI1DNGUJM5',
    'daa5f0846f85f470b33390efdf6bbde9'
);

const searchClient = {
    ...algoliaClient,
    search(requests: any) {
        if (requests.every(({ params }: any) => !params.query)) {
            return Promise.resolve({
                results: requests.map(() => ({
                    hits: [],
                    nbHits: 0,
                    processingTimeMS: 0,
                })),
            });
        }

        return algoliaClient.search(requests);
    },
} as SearchClient;

export enum SearchIndex {
    ORGS = 'orgs',
    USERS = 'users',
    ORDERS = 'orders',
    BRANDS = 'brands',
    DELIVERY_JOBS = 'delivery_jobs'
}

export interface HitComponentProps {
    hit: any;
}

export function AlgoliaSearch() {
    const [open, setOpen] = React.useState(false)
    const searchInputRef = useRef<HTMLInputElement>(null); // Create a ref for the search input

    // Toggle the menu when ⌘K is pressed
    useEffect(() => {
        const down = (e: any) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    // Focus on the search input when the dialog opens
    useEffect(() => {
        if (open) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 0);
        }
    }, [open])

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}>
            <DialogContent
                className='w-full bg-transparent border-none'
                style={{ width: '800px', height: '600px' }} // Adjust width and height to make the dialog bigger
            >
                <TitleComponent
                leftTitle='System'
                >
                    <InstantSearch
                        searchClient={searchClient}
                        indexName={SearchIndex.ORGS}
                        stalledSearchDelay={5000}
                    >
                        <Configure
                            hitsPerPage={2}
                        />
                        <SearchBox
                            ref={searchInputRef} // Assign the ref to the SearchBox
                            placeholder={"Search..."}
                            submitIconComponent={() => (
                                <></>
                            )}
                            resetIconComponent={() => (
                                <></>
                            )}
                            classNames={{
                                root: '',
                                form: 'p-0 m-0',
                                input: 'block w-full p-2 bg-white border border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 rounded-md focus:ring-1',
                            }}
                            className="p-2  w-full" />
                        <div className='flex-col space-y-4 h-[500px] overflow-auto pt-2'> {/* Set fixed height and overflow with Tailwind CSS */}
                            <Index indexName={SearchIndex.ORGS}>
                                <Hits hitComponent={OrgHitComponent} />
                            </Index>
                            <Index indexName={SearchIndex.USERS}>
                                <Hits hitComponent={UserHitComponent} />
                            </Index>
                            <Index indexName={SearchIndex.ORDERS}>
                                <Hits hitComponent={OrderHitComponent} />
                            </Index>
                            <Index indexName={SearchIndex.BRANDS}>
                                <Hits hitComponent={BrandHitComponent} />
                            </Index>
                            <Index indexName={SearchIndex.DELIVERY_JOBS}>
                                <Hits hitComponent={DeliveryJobHitComponent} />
                            </Index>
                        </div>
                    </InstantSearch>
                </TitleComponent>
            </DialogContent>
        </Dialog>
    );
}