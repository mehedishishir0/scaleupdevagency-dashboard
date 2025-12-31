"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
    ExternalLinkIcon,
    PencilIcon,
    TrashIcon,
    SearchIcon,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import EditProjectModal from "./EditProjectModal"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

type Project = {
    _id: string
    name: string
    figmaLink: string
    websiteLink: string
    adminLink: string
    category: { _id: string; name: string }
    profile: { _id: string; name: string }
    orderId: string
}

type Category = {
    _id: string
    name: string
}

export default function ProjectsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const limit = 10
    const [editOpen, setEditOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const session = useSession()
    const token = (session?.data?.user as { accessToken: string })?.accessToken
    const role = (session?.data?.user as { role: string })?.role

    const profileColors = [
        "bg-blue-50",
        "bg-green-50",
        "bg-yellow-50",
        "bg-pink-50",
        "bg-purple-50",
        "bg-orange-50",
    ];


    // Reset page to 1 when search or category changes
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, selectedCategory])

    // Fetch projects
    const { data, refetch, isLoading } = useQuery({
        queryKey: ["projects", searchQuery, selectedCategory, currentPage],
        queryFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/projects?search=${searchQuery}&category=${selectedCategory ? selectedCategory == "all" ? "" : selectedCategory : ""}&page=${currentPage}&limit=${limit}`
            )
            return res.json()
        },
    })

    // Fetch categories from API
    const { data: categories, isLoading: categoryLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/categories`)
            const data = await res.json()
            return data.data as Category[]
        },
    })

    // Delete profile
    const handleDelete = async () => {
        if (!deleteId) return

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/projects/${deleteId}`,
            { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
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

    const projects: Project[] = data?.data || []
    const pagination = data?.pagination

    function getProfileColor(profileId: string) {
        // Use hash to pick a color consistently
        let hash = 0;
        for (let i = 0; i < profileId.length; i++) {
            hash = profileId.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % profileColors.length;
        return profileColors[index];
    }


    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-semibold">All Projects</h2>
                {role === "admin" &&
                    <Button size="sm" asChild>
                        <Link href="/dashboard/projects/add-project">Add New Project</Link>
                    </Button>
                }
            </div>

            {/* Search & Filter */}
            <Card className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search projects by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                        disabled={categoryLoading}
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {categories?.map((category) => (
                                <SelectItem key={category._id} value={category._id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            {/* Projects Table */}
            <Card className="overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="py-4 px-6">Client Name</TableHead>
                            <TableHead className="py-4">Profile</TableHead>
                            <TableHead className="py-4">Order ID</TableHead>
                            <TableHead className="py-4">Figma Link</TableHead>
                            <TableHead className="py-4">Website Link</TableHead>
                            <TableHead className="py-4">Admin Dashboard</TableHead>
                            <TableHead className="py-4">Category</TableHead>
                            {role === "admin" &&

                                <TableHead className="py-4 px-6 text-right">Actions</TableHead>
                            }
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="py-16 text-center text-muted-foreground">
                                    Loading projects...
                                </TableCell>
                            </TableRow>
                        ) : projects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="py-16 text-center text-muted-foreground">
                                    No projects found
                                </TableCell>
                            </TableRow>
                        ) : (
                            projects.map((project) => (
                                <TableRow key={project?._id} className="hover:bg-muted/40 transition-colors">
                                    <TableCell className="py-5 font-medium px-6">{project?.name}</TableCell>
                                    <TableCell className={`py-5  ${getProfileColor(project.profile._id)} font-medium`}>
                                        {project.profile.name}
                                    </TableCell>
                                    <TableCell className="py-5">{project?.orderId}</TableCell>
                                    {[project?.figmaLink, project?.websiteLink, project?.adminLink].map((link, i) => (
                                        <TableCell key={i} className="py-5">
                                            <a
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-primary hover:underline"
                                            >
                                                <span className="max-w-[220px] truncate">{link}</span>
                                                <ExternalLinkIcon className="size-4 opacity-70" />
                                            </a>
                                        </TableCell>
                                    ))}
                                    <TableCell className="py-5">
                                        <Badge className="px-3 py-1 text-xs">{project?.category?.name}</Badge>
                                    </TableCell>
                                    {role === "admin" &&
                                        <TableCell className="py-5 px-2 text-right">
                                            <div className="flex items-center justify-end">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setSelectedProject(project)
                                                        setEditOpen(true)
                                                    }}
                                                >
                                                    <PencilIcon className="size-4" />
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive"
                                                    onClick={() => setDeleteId(project._id)}
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </Button>

                                            </div>
                                        </TableCell>
                                    }
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Pagination */}
            {pagination && (
                <div className="mt-6 flex justify-between items-center pt-4 border-t">
                    <p className="text-xs text-gray-500">
                        Showing {((currentPage - 1) * limit + 1)} to {Math.min(currentPage * limit, pagination.total)} of {pagination.total} results
                    </p>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                            <Button
                                key={p}
                                variant={currentPage === p ? "default" : "outline"}
                                size="sm"
                                className={cn(currentPage === p && "bg-gray-200")}
                                onClick={() => setCurrentPage(p)}
                            >
                                {p}
                            </Button>
                        ))}

                        <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === pagination.totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
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
                            Delete Project?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. The project will be permanently removed.
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

            <EditProjectModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                project={selectedProject}
            />
        </div>
    )
}
