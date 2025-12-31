"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import Image from "next/image"

type Project = {
    _id: string
    name: string
    figmaLink: string
    websiteLink: string
    adminLink: string
    category: { _id: string }
    profile: { _id: string }
    orderId: string
}

type Props = {
    open: boolean
    onClose: () => void
    project: Project | null
}

export default function EditProjectModal({ open, onClose, project }: Props) {
    const queryClient = useQueryClient()
    const { data: session } = useSession()
    const token = (session?.user as { accessToken: string })?.accessToken

    const [formData, setFormData] = useState({
        name: "",
        figmaLink: "",
        websiteLink: "",
        adminLink: "",
        categoryId: "",
        profileId: "",
        orderId: "",
    })

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || "",
                figmaLink: project.figmaLink || "",
                websiteLink: project.websiteLink || "",
                adminLink: project.adminLink || "",
                categoryId: project.category?._id || "",
                profileId: project.profile?._id || "",
                orderId: project.orderId || "",
            })
        }
    }, [project])

    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }))
    }

    // Fetch profiles
    const { data: profiles } = useQuery({
        queryKey: ["profiles"],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/profile`)
            return (await res.json()).data
        },
    })

    // Fetch categories
    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/categories`)
            return (await res.json()).data
        },
    })

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/projects/${project?._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        figmaLink: formData.figmaLink,
                        websiteLink: formData.websiteLink,
                        adminLink: formData.adminLink,
                        category: formData.categoryId,
                        profile: formData.profileId,
                        orderId: formData.orderId,
                    }),
                }
            )

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.message)
            }
            return res.json()
        },
        onSuccess: () => {
            toast.success("Project updated successfully")
            queryClient.invalidateQueries({ queryKey: ["projects"] })
            onClose()
        },
        onError: (e) => toast.error(e.message),
    })

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader className="mb-4">
                    <div className="mx-auto ">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={900}
                            height={900}
                            className="h-14 w-auto"
                        />
                    </div>
                    <DialogTitle className="text-gray-600 text-lg text-center">Edit Project</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2 ">
                        <Label className="text-gray-600">Client Name</Label>
                        <Input
                            value={formData.name}
                            className="py-5"
                            onChange={(e) => handleChange("name", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2 ">
                        <Label className="text-gray-600">Profile</Label>
                        <Select
                            value={formData.profileId}
                            onValueChange={(v) => handleChange("profileId", v)}
                        >
                            <SelectTrigger className="py-5">
                                <SelectValue placeholder="Select profile" />
                            </SelectTrigger>
                            <SelectContent >
                                {profiles?.map((p: { _id: string; name: string }) => (
                                    <SelectItem key={p._id} value={p._id}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 ">
                        <Label className="text-gray-600">Category</Label>
                        <Select
                            value={formData.categoryId}
                            onValueChange={(v) => handleChange("categoryId", v)}
                        >
                            <SelectTrigger className="py-5">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories?.map((c: { _id: string; name: string }) => (
                                    <SelectItem key={c._id} value={c._id}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 ">
                        <Label className="text-gray-600">Order ID</Label>
                        <Input
                            className="py-5"
                            value={formData.orderId}
                            onChange={(e) => handleChange("orderId", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2 ">
                        <Label className="text-gray-600">Figma Link</Label>
                        <Input
                            className="py-5"
                            value={formData.figmaLink}
                            onChange={(e) => handleChange("figmaLink", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2 ">
                        <Label className="text-gray-600">Website Link</Label>
                        <Input
                            className="py-5"
                            value={formData.websiteLink}
                            onChange={(e) => handleChange("websiteLink", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2 ">
                        <Label className="text-gray-600">Admin Dashboard</Label>
                        <Input
                            className="py-5"
                            value={formData.adminLink}
                            onChange={(e) => handleChange("adminLink", e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={() => mutate()} disabled={isPending}>
                            {isPending ? "Updating..." : "Update Project"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
