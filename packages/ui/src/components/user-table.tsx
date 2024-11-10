'use client'

import { useSession } from "@clerk/nextjs";
import {
    ColumnDef,
    PaginationState,
    SortingState,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable
} from "@tanstack/react-table";
import * as React from 'react';
import { useEffect, useState } from 'react';
import { CreateUsersParams } from "../clients/clerkClient";
import { useCreateUsers as useAddUsersToClerk, useRemoveUserFromClerk } from "../hooks/integrations/clerkHooks";
import { useGetOrgsByQuery } from "../hooks/orgHooks";
import { useGetUsers, useUpdateUser } from "../hooks/userHooks";
import { User } from "../models/userModels";
import { ColorfullTable } from "./colorfull-table";
import { DataTableColumnHeader } from "./datatable-column-header";
import FilterableHeader from "./filterable-header";
import { useMobileView } from "./orders-table";
import { PageTitleDisplay } from "./page-title-display";
import { TableIdColumn } from "./table-id-column";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { UserCard } from "./user-card";
import { DEFAULT_GLOBAL_FILTER_PAGE_SIZE } from "..";


interface UserTableProps {
    orgClerkId?: string;
    subtitle?: string;
    isInVangaurd?: boolean;
    getUserPath?: (user: User) => string; // New prop for generating user-specific paths
    noTitle?: boolean;
}

export const UserTable = ({
    orgClerkId,
    subtitle,
    isInVangaurd,
    getUserPath,
    noTitle = false
}: UserTableProps) => {
    const isMobileView = useMobileView();
    const session = useSession();
    const userEmail = session?.session?.user?.primaryEmailAddress?.emailAddress;
    const isUserColorfull = userEmail?.includes('@colorfull.ai')
    const [sorting, setSorting] = useState<SortingState>([]);
    const [hasMoreUsers, setHasMoreUsers] = useState(true);
    const COLORFULLAI_EMAIL_DOMAIN = '@colorfull.ai';
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 1,
        pageSize: 20,
    })
    const [globalFilter, setGlobalFilter] = useState("");
    const { data: orgs } = useGetOrgsByQuery({ externalId: orgClerkId });
    const org = orgs?.[0];

    let params = {};
    if (org && orgClerkId) { // Ensure that we only add orgId to parameter if org is defined and orgClerkId is provided
        params = {
            pageSize: globalFilter ? DEFAULT_GLOBAL_FILTER_PAGE_SIZE : pageSize,
            page: globalFilter ? 1 : pageIndex,
            orgId: org.id
        };
    } else {
        // TODO: This is not great, use RBAC within Clerk to handle this check.
        // we do not want users who are not colorfull employees to see all users.
        if (userEmail?.endsWith(COLORFULLAI_EMAIL_DOMAIN)) {
            params = {
                pageSize: globalFilter ? DEFAULT_GLOBAL_FILTER_PAGE_SIZE : pageSize,
                page: globalFilter ? 1 : pageIndex,
            };
        }
    }

    const { data: usersData, isLoading: isLoadingUsers } = useGetUsers({
        ...params,
    });


    const orgId = org?.id;


    const { mutate: AddClerkUsersMutate } = useAddUsersToClerk({
        onSuccess: () => {
            // Trigger the toast upon successfully adding user to Clerk
            toast({
                title: 'User added to Clerk',
                duration: 3000,
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Failed to add user to Clerk',
                duration: 3000,
            });
            // Optionally, handle errors with a toast or other UI feedback
            console.error("Error adding user to Clerk:", error);
        },
    });

    const { mutate: removeUserFromClerkMutate } = useRemoveUserFromClerk({
        onSuccess: () => {
            toast({
                title: 'User removed from Clerk',
                duration: 3000,
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Failed to remove user from Clerk',
                duration: 3000,
            });
            console.error("Error removing user from Clerk:", error);
        },
    });

    const { mutate: updateUser } = useUpdateUser({
        onSuccess: () => {
            toast({
                title: 'User removed from organization',
                duration: 3000,
            });
        },
        onError: () => {
            toast({
                title: 'Failed to remove user from organization',
                duration: 3000,
            });
        },
    });

    const handleRemoveUserFromOrg = async (user: User) => {
        if (user.id) {
            updateUser({ userId: user.id, user: { ...user, org_id: '' } })
        }
    };

    const goNextPage = () => {
        if (hasMoreUsers) {
            setPagination(prevState => ({ ...prevState, pageIndex: prevState.pageIndex + 1 }));
        }
    };

    const goPrevPage = () => {
        if (pageIndex > 0) {
            setPagination(prevState => ({ ...prevState, pageIndex: prevState.pageIndex - 1 }));
            if (!hasMoreUsers) {
                setHasMoreUsers(true);
            }
        }
    };

    useEffect(() => {

        if (usersData && usersData.length < pageSize) {
            setHasMoreUsers(false);
        } else {
            setHasMoreUsers(true);
        }
    }, [usersData]);

    const columns: ColumnDef<User>[] = React.useMemo(() => {
        let baseColumns: ColumnDef<User>[] = [
            {
                accessorKey: 'first_name',
                header: ({ column }) => (
                    <FilterableHeader id={"first_name"} title={"First Name"} column={column} />
                ),
                enableSorting: true,
            },
            {
                accessorKey: 'last_name',
                header: ({ column }) => (
                    <FilterableHeader id={"last_name"} title={"Last Name"} column={column} />
                ),
                enableSorting: true,
            },
            {
                accessorKey: 'email',
                header: ({ column }) => (
                    <FilterableHeader id={"email"} title={"Email"} column={column} />
                ),
                enableSorting: true,
            },
            {
                accessorKey: 'work_address',
                header: ({ column }) => (
                    <FilterableHeader id={"work_address"} title={"Work Address"} column={column} />
                ),
                enableSorting: true,
            },

        ];

        if (isUserColorfull && !isInVangaurd) {
            baseColumns = baseColumns.concat([
                {
                    accessorKey: 'id',
                    header: ({ column }) => (
                        <FilterableHeader id={"id"} title={"ID"} column={column} />
                    ),
                    enableSorting: true,
                    cell: info => (
                        <TableIdColumn
                            id={info.row?.original?.id ?? ''}
                            getPath={() => getUserPath ? getUserPath(info.row.original) : `/users/${info.row?.original?.id}`}
                        />
                    ),
                },
                {
                    id: 'inClerk',
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title={"In Clerk"} />
                    ),
                    cell: info => info.row?.original?.clerk_id ? 'Yes' : 'No',
                    enableSorting: true,

                },
                {
                    id: 'addToClerk',
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title={"Add to Clerk"} />

                    ),
                    cell: info => {
                        const isUserInClerk = info.row?.original?.clerk_id;
                        return !isUserInClerk ? (
                            <Button
                                onClick={() => {
                                    let userRequest = { userIds: [info.row.original.id ?? ''], orgId: org?.id ?? '' } as CreateUsersParams
                                    AddClerkUsersMutate(userRequest);
                                }}
                                className="text-white"
                            >
                                Add
                            </Button>
                        ) : (
                            <span>In Clerk</span>
                        );
                    },
                    enableSorting: true,
                },
                {
                    id: 'removeFromClerk',
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title={"Remove from Clerk"} />
                    ),
                    cell: info => {
                        const isUserInClerk = info.row?.original?.clerk_id;
                        return isUserInClerk ? (
                            <Button
                                onClick={() => {
                                    let userRequest = { userId: info.row.original.id ?? '', clerkId: info.row.original.clerk_id ?? '', orgId: org?.id ?? '' }
                                    removeUserFromClerkMutate(userRequest);
                                }}
                                className="text-white"
                            >
                                Remove
                            </Button>
                        ) : (
                            <span>Not in Clerk</span>
                        );
                    },
                    enableSorting: true,
                },
            ]);
        }

        if (isInVangaurd) {
            baseColumns = baseColumns.concat([
                {
                    id: 'removeUserFromOrg',
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title={"Remove from Org"} />
                    ),
                    cell: info => {
                        const isUserRowTheCurrentUser = info.row?.original?.email !== userEmail;
                        const hasOrgId = !!info.row?.original?.org_id;
                        return isUserRowTheCurrentUser && hasOrgId ? (
                            <Button
                                onClick={() => {
                                    if (confirm('Are you sure you want to remove this user from the organization?')) {
                                        handleRemoveUserFromOrg(info.row.original)
                                    }

                                }}
                                className="text-white bg-red-500 hover:bg-red-600 h-fit"
                            >
                                Remove From Org
                            </Button>
                        ) : (
                            <span> </span>
                        );
                    },
                    enableSorting: false,
                }
            ]);
        } else {
            baseColumns = baseColumns.concat([
                {
                    id: 'removeUserFromOrg',
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title={"Remove from Org"} />
                    ),
                    cell: info => {
                        const hasOrgId = !!info.row?.original?.org_id;
                        return hasOrgId ? (
                            <Button
                                onClick={() => handleRemoveUserFromOrg(info.row.original)}
                                className="text-white bg-red-500 hover:bg-red-600"
                            >
                                Remove From Org
                            </Button>
                        ) : (
                            <span> </span>
                        )
                    },
                    enableSorting: false,
                }
            ]);
        }

        return baseColumns;
    }, [isUserColorfull, isInVangaurd, getUserPath]); // Make sure to include isUserColorfull in the dependency array

    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )

    const table = useReactTable({
        data: usersData ?? [],
        columns,
        state: {
            sorting,
            globalFilter,
            pagination
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        manualPagination: true, // Set to true if you're handling pagination server-side
        pageCount: -1, // Provide the total page count here if known, or -1 to indicate unknown page count
    });

    if (isMobileView) {
        return (
            <div>
                {!noTitle && <PageTitleDisplay
                    overrideTitle='Home'
                    additionalText={org?.name}
                />}
                {usersData?.map(user => {
                    const isUserTheCurrentUser = user?.email === userEmail;
                    const hasOrgId = user?.org_id === orgId;
                    return (
                        <UserCard
                            key={user.id + 'mobile-card'}
                            user={user}
                            isUserTheCurrentUser={(isUserTheCurrentUser && hasOrgId)}
                            userRemovalFunction={handleRemoveUserFromOrg}
                        />
                    )
                })}
                <div className='flex justify-start items-center gap-2 mx-2 py-2'>
                    <Button onClick={goPrevPage} disabled={pageIndex === 0}>Previous</Button> {/* Disable button when on page 1 */}
                    <Button onClick={goNextPage} disabled={!hasMoreUsers}>Next</Button> {/* Disable button when there are no more users */}
                </div>
            </div>
        );
    }


    return (
        <>
            <ColorfullTable<User>
                isTitleHidden={noTitle}
                tableInstance={table}
                subtitle={subtitle}
                title={(org && orgClerkId) ? org?.name : 'All Users'}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                isLoading={isLoadingUsers}
                globalFilterEnabled={true}
            />
        </>

    );
};
