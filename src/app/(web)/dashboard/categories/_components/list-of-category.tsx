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
import AddCategoryModal from "./AddCategoryModal"
import EditeCategoryModal from "./EditeCategoryModal"
import { toast } from "sonner"

type Category = {
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

export default function ListOfCategory() {
    const [currentPage, setCurrentPage] = useState(1)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const limit = 10
    const [openAddModal, setOpenAddModal] = useState(false)
    const [editCategory, setEditCategory] = useState<Category | null>(null)

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["categories", currentPage],
        queryFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/categories/pagination?limit=${limit}&page=${currentPage}`
            )
            return res.json()
        },
    })

    const categories: Category[] = data?.data || []
    const pagination: Pagination | null = data?.pagination || null

    // Delete category
    const handleDelete = async () => {
        if (!deleteId) return

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/categories/${deleteId}`,
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
                <h2 className="text-2xl font-semibold">All Categories</h2>
                <Button size="sm" variant="default" onClick={() => setOpenAddModal(true)}>
                    Add New Category
                </Button>
            </div>

            {/* Table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="py-4 px-6">Name</TableHead>
                            <TableHead>Created</TableHead>
                            {/* <TableHead>Status</TableHead> */}
                            <TableHead className="text-right px-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="py-16 text-center">
                                    Loading categories...
                                </TableCell>
                            </TableRow>
                        ) : categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="py-16 text-center">
                                    No categories found
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category) => (
                                <TableRow key={category._id}>
                                    <TableCell className="font-medium px-6 py-5">
                                        {category.name}
                                    </TableCell>

                                    <TableCell>
                                        {new Date(category.createdAt).toLocaleDateString()}
                                    </TableCell>

                                    {/* <TableCell>
                                        <Badge variant="secondary">Active</Badge>
                                    </TableCell> */}

                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-primary"
                                                onClick={() => setEditCategory(category)}
                                            >

                                                <PencilIcon className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive"
                                                onClick={() => setDeleteId(category._id)}
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
                                className={cn(
                                    currentPage === p && "bg-muted text-black"
                                )}
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

            {/* Delete Confirmation Modal */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete Category?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. The category will be
                            permanently removed.
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

            <AddCategoryModal
                open={openAddModal}
                onClose={() => setOpenAddModal(false)} />
            {/* Edit Category Modal */}
            {editCategory && (
                <EditeCategoryModal
                    open={!!editCategory}
                    onClose={() => setEditCategory(null)}
                    category={editCategory}
                    onSuccess={refetch}
                />
            )}

        </div>
    )
}
