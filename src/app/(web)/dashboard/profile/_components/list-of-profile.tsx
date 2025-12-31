"use client"

import { useState } from "react"
import { PencilIcon, TrashIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import AddProfileModal from "./AddProfileModal"
import EditProfileModal from "./EditeProfileModal"
import { toast } from "sonner"


type Profile = {
    _id: string
    name: string
    createdAt: string
}

type Pagination = {
    total: number
    page: number
    limit: number
    totalPages: number
    hasPrevPage: boolean
    hasNextPage: boolean
}

export default function ListOfProfile() {
    const [currentPage, setCurrentPage] = useState(1)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [openAddModal, setOpenAddModal] = useState(false)
    const limit = 10
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
    const [openEditModal, setOpenEditModal] = useState(false)

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["profiles", currentPage],
        queryFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/profile/pagination?limit=${limit}&page=${currentPage}`
            )
            return res.json()
        },
    })

    const profiles: Profile[] = data?.data || []
    const pagination: Pagination | null = data?.pagination || null

    // Delete profile
    const handleDelete = async () => {
        if (!deleteId) return

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/profile/${deleteId}`,
            { method: "DELETE" }
        ).then((res) => res.json())

        if (res.success) {
            toast.success(res.message)
        }
        if (!res.success) {
            toast.error(res.message)
        }

        setDeleteId(null)
        refetch()
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">All Profiles</h2>
                <Button size="sm" onClick={() => setOpenAddModal(true)}>
                    Add New Profile
                </Button>
            </div>

            {/* Table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="px-6 py-5">Name</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right px-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="py-16 text-center">
                                    Loading profiles...
                                </TableCell>
                            </TableRow>
                        ) : profiles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="py-16 text-center">
                                    No profiles found
                                </TableCell>
                            </TableRow>
                        ) : (
                            profiles.map((profile) => (
                                <TableRow key={profile._id}>
                                    <TableCell className="font-medium px-6 py-5">
                                        {profile.name}
                                    </TableCell>

                                    <TableCell>
                                        {new Date(profile.createdAt).toLocaleDateString()}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedProfile(profile)
                                                    setOpenEditModal(true)
                                                }}
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive"
                                                onClick={() => setDeleteId(profile._id)}
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Pagination */}
            {pagination && (
                <div className="flex items-center justify-between pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                        Showing {(currentPage - 1) * limit + 1} –{" "}
                        {Math.min(currentPage * limit, pagination.total)} of{" "}
                        {pagination.total}
                    </p>

                    <div className="flex gap-1">
                        <Button
                            size="icon"
                            variant="outline"
                            disabled={!pagination.hasPrevPage}
                            onClick={() => setCurrentPage((p) => p - 1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {Array.from(
                            { length: pagination.totalPages },
                            (_, i) => i + 1
                        ).map((p) => (
                            <Button
                                key={p}
                                size="sm"
                                variant={currentPage === p ? "default" : "outline"}
                                className={cn(currentPage === p && "bg-muted text-black")}
                                onClick={() => setCurrentPage(p)}
                            >
                                {p}
                            </Button>
                        ))}

                        <Button
                            size="icon"
                            variant="outline"
                            disabled={!pagination.hasNextPage}
                            onClick={() => setCurrentPage((p) => p + 1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete Profile?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. The profile will be permanently removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive"
                            onClick={handleDelete}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Add Profile Modal */}
            <AddProfileModal
                open={openAddModal}
                onClose={() => setOpenAddModal(false)}
            />
            {/* Edit Profile Modal */}
            {selectedProfile && (
                <EditProfileModal
                    open={openEditModal}
                    onClose={() => setOpenEditModal(false)}
                    profile={selectedProfile}
                    onSuccess={refetch}
                />
            )}

        </div>
    )
}
