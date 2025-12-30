// "use client"

// import type React from "react"
// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import { ArrowLeftIcon } from "lucide-react"
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import { Card } from "@/components/ui/card"
// import { toast } from "sonner"
// import { useSession } from "next-auth/react"

// const categories = ["E-commerce", "Marketing", "SaaS", "Portfolio", "Content"]

// type FormData = {
//     name: string
//     figmaLink: string
//     websiteLink: string
//     adminLink: string
//     category: string
// }

// type FormErrors = Partial<FormData>

// const initialFormData: FormData = {
//     name: "",
//     figmaLink: "",
//     websiteLink: "",
//     adminLink: "",
//     category: "",
// }

// export default function AddProjectPage() {
//     const router = useRouter()
//     const queryClient = useQueryClient()
//     const session = useSession();

//     const token = (session?.data?.user as { accessToken: string })?.accessToken;
//     const [formData, setFormData] = useState<FormData>(initialFormData)
//     const [errors, setErrors] = useState<FormErrors>({})
//     const [isSubmitting, setIsSubmitting] = useState(false)

//     const validateUrl = (url: string) => {
//         if (!url) return true
//         try {
//             new URL(url)
//             return true
//         } catch {
//             return false
//         }
//     }

//     const validateForm = () => {
//         const newErrors: FormErrors = {}

//         if (!formData.name.trim()) newErrors.name = "Project name is required"
//         if (!formData.category) newErrors.category = "Category is required"
//         if (!validateUrl(formData.figmaLink)) newErrors.figmaLink = "Invalid URL"
//         if (!validateUrl(formData.websiteLink)) newErrors.websiteLink = "Invalid URL"
//         if (!validateUrl(formData.adminLink)) newErrors.adminLink = "Invalid URL"

//         setErrors(newErrors)
//         return Object.keys(newErrors).length === 0
//     }

//     const handleChange = (key: keyof FormData, value: string) => {
//         setFormData((prev) => ({ ...prev, [key]: value }))
//     }

//     const { data: category, isLoading: categoryLoading } = useQuery({
//         queryKey: ["category"],
//         queryFn: async () => {
//             const res = await fetch(
//                 `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/categories`
//             )
//             return res.json()
//         },
//     })

//     const { data: profile, isLoading: profileLoading } = useQuery({
//         queryKey: ["profile"],
//         queryFn: async () => {
//             const res = await fetch(
//                 `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/profile`
//             )
//             return res.json()
//         },
//     })
//     console.log("profile", profile)

//     console.log(category)

//     const { mutate, isPending } = useMutation<unknown, Error, {
//         name: string
//         figmaLink: string
//         websiteLink: string
//         adminLink: string
//         category: string
//     }
//     >({
//         mutationFn: async (body) => {
//             const res = await fetch(
//                 `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/projects`,
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${token}`,
//                     },
//                     body: JSON.stringify(body),
//                 }
//             );

//             if (!res.ok) {
//                 const err = await res.json();
//                 throw new Error(err.message || "Failed to create project");
//             }

//             return res.json();
//         },
//         onSuccess: () => {
//             toast.success("Project created successfully");
//             queryClient.invalidateQueries({ queryKey: ["projects"] });
//             router.push("/dashboard/projects");
//         },
//         onError: (error) => {
//             toast.error(error.message || "Failed to create project");
//         },
//     });

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault()
//         if (!validateForm()) return

//         setIsSubmitting(true)

//         const body = {
//             name: formData.name,
//             figmaLink: formData.figmaLink,
//             websiteLink: formData.websiteLink,
//             adminLink: formData.adminLink,
//             category: formData.category,
//         }
//         mutate(body)
//     }




//     return (
//         <div className="flex flex-col gap-6">
//             {/* Header */}
//             <div className="flex items-center gap-4">
//                 <Button variant="ghost" size="icon" asChild>
//                     <Link href="/dashboard/projects">
//                         <ArrowLeftIcon className="size-4" />
//                     </Link>
//                 </Button>

//                 <div>
//                     <h2 className="text-2xl font-semibold">Add New Project</h2>
//                     <p className="text-sm text-muted-foreground">Create a new project entry</p>
//                 </div>
//             </div>

//             {/* Form */}
//             <Card className="p-6">
//                 <form onSubmit={handleSubmit} className="space-y-5">
//                     {/* Name */}
//                     <div className="space-y-2">
//                         <Label>
//                             Project Name <span className="text-destructive">*</span>
//                         </Label>
//                         <Input
//                             value={formData.name}
//                             onChange={(e) => handleChange("name", e.target.value)}
//                         />
//                         {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
//                     </div>

//                     {/* Figma */}
//                     <div className="space-y-2">
//                         <Label>Figma Link</Label>
//                         <Input
//                             value={formData.figmaLink}
//                             onChange={(e) => handleChange("figmaLink", e.target.value)}
//                         />
//                         {errors.figmaLink && <p className="text-sm text-destructive">{errors.figmaLink}</p>}
//                     </div>

//                     {/* Website */}
//                     <div className="space-y-2">
//                         <Label>Website Link</Label>
//                         <Input
//                             value={formData.websiteLink}
//                             onChange={(e) => handleChange("websiteLink", e.target.value)}
//                         />
//                         {errors.websiteLink && <p className="text-sm text-destructive">{errors.websiteLink}</p>}
//                     </div>

//                     {/* Admin */}
//                     <div className="space-y-2">
//                         <Label>Admin Dashboard Link</Label>
//                         <Input
//                             value={formData.adminLink}
//                             onChange={(e) => handleChange("adminLink", e.target.value)}
//                         />
//                         {errors.adminLink && <p className="text-sm text-destructive">{errors.adminLink}</p>}
//                     </div>

//                     {/* Category */}
//                     <div className="space-y-2">
//                         <Label>
//                             Category <span className="text-destructive">*</span>
//                         </Label>
//                         <Select
//                             value={formData.category}
//                             onValueChange={(v) => handleChange("category", v)}
//                         >
//                             <SelectTrigger>
//                                 <SelectValue placeholder="Select category" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {categories.map((c) => (
//                                     <SelectItem key={c} value={c}>
//                                         {c}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                         {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
//                     </div>

//                     {/* Actions */}
//                     <div className="flex gap-4 pt-4">
//                         <Button type="submit" disabled={isSubmitting || isPending}>
//                             {isSubmitting || isPending ? "Adding..." : "Add Project"}
//                         </Button>
//                         <Button
//                             type="button"
//                             variant="outline"
//                             onClick={() => router.push("/dashboard/projects")}
//                         >
//                             Cancel
//                         </Button>
//                     </div>
//                 </form>
//             </Card>

//             <p className="text-xs text-muted-foreground">
//                 Fields marked with <span className="text-destructive">*</span> are required
//             </p>
//         </div>
//     )
// }

"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

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
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

type FormData = {
    name: string
    figmaLink: string
    websiteLink: string
    adminLink: string
    categoryId: string
    profileId: string
    orderId: string
}

type FormErrors = Partial<FormData>

const initialFormData: FormData = {
    name: "",
    figmaLink: "",
    websiteLink: "",
    adminLink: "",
    categoryId: "",
    profileId: "",
    orderId: "",
}

export default function AddProjectPage() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const session = useSession()

    const token = (session?.data?.user as { accessToken: string })?.accessToken
    const [formData, setFormData] = useState<FormData>(initialFormData)
    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validateUrl = (url: string) => {
        if (!url) return true
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    }

    const validateForm = () => {
        const newErrors: FormErrors = {}
        if (!formData.name.trim()) newErrors.name = "Project name is required"
        if (!formData.categoryId) newErrors.categoryId = "Category is required"
        if (!formData.profileId) newErrors.profileId = "Profile is required"
        if (!validateUrl(formData.figmaLink)) newErrors.figmaLink = "Invalid URL"
        if (!validateUrl(formData.websiteLink)) newErrors.websiteLink = "Invalid URL"
        if (!validateUrl(formData.adminLink)) newErrors.adminLink = "Invalid URL"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (key: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }))
    }

    // Fetch profiles
    const { data: profiles, isLoading: profileLoading } = useQuery({
        queryKey: ["profiles"],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/profile`)
            const data = await res.json()
            return data.data
        },
    })

    // Fetch categories
    const { data: categories, isLoading: categoryLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/categories`)
            const data = await res.json()
            return data.data
        },
    })

    const { mutate, isPending } = useMutation<unknown, Error, FormData>({
        mutationFn: async (body) => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/projects`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: body.name,
                    figmaLink: body.figmaLink,
                    websiteLink: body.websiteLink,
                    adminLink: body.adminLink,
                    category: body.categoryId,
                    profile: body.profileId,
                    orderId: body.orderId,
                }),
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.message || "Failed to create project")
            }
            return res.json()
        },
        onSuccess: () => {
            toast.success("Project created successfully")
            queryClient.invalidateQueries({ queryKey: ["projects"] })
            router.push("/dashboard/projects")
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create project")
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return
        setIsSubmitting(true)
        mutate(formData)
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/projects">
                        <ArrowLeftIcon className="size-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-2xl font-semibold">Add New Project</h2>
                    <p className="text-sm text-muted-foreground">Create a new project entry</p>
                </div>
            </div>

            {/* Form */}
            <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label>
                            Project Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    {/* Profile */}
                    <div className="space-y-2">
                        <Label>
                            Profile <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={formData.profileId}
                            onValueChange={(v) => handleChange("profileId", v)}
                            disabled={profileLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={profileLoading ? "Loading..." : "Select profile"} />
                            </SelectTrigger>
                            <SelectContent>
                                {profiles?.map((p: { _id: string; name: string }) => (
                                    <SelectItem key={p._id} value={p._id}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.profileId && <p className="text-sm text-destructive">{errors.profileId}</p>}
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label>
                            Category <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={formData.categoryId}
                            onValueChange={(v) => handleChange("categoryId", v)}
                            disabled={categoryLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={categoryLoading ? "Loading..." : "Select category"} />
                            </SelectTrigger>
                            <SelectContent>
                                {categories?.map((c: { _id: string; name: string }) => (
                                    <SelectItem key={c._id} value={c._id}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId}</p>}
                    </div>

                    {/* Order ID */}
                    <div className="space-y-2">
                        <Label>Order ID</Label>
                        <Input
                            value={formData.orderId}
                            onChange={(e) => handleChange("orderId", e.target.value)}
                        />
                    </div>

                    {/* Figma */}
                    <div className="space-y-2">
                        <Label>Figma Link</Label>
                        <Input
                            value={formData.figmaLink}
                            onChange={(e) => handleChange("figmaLink", e.target.value)}
                        />
                        {errors.figmaLink && <p className="text-sm text-destructive">{errors.figmaLink}</p>}
                    </div>

                    {/* Website */}
                    <div className="space-y-2">
                        <Label>Website Link</Label>
                        <Input
                            value={formData.websiteLink}
                            onChange={(e) => handleChange("websiteLink", e.target.value)}
                        />
                        {errors.websiteLink && <p className="text-sm text-destructive">{errors.websiteLink}</p>}
                    </div>

                    {/* Admin */}
                    <div className="space-y-2">
                        <Label>Admin Dashboard Link</Label>
                        <Input
                            value={formData.adminLink}
                            onChange={(e) => handleChange("adminLink", e.target.value)}
                        />
                        {errors.adminLink && <p className="text-sm text-destructive">{errors.adminLink}</p>}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <Button type="submit" disabled={isSubmitting || isPending}>
                            {isSubmitting || isPending ? "Adding..." : "Add Project"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/dashboard/projects")}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>

            <p className="text-xs text-muted-foreground">
                Fields marked with <span className="text-destructive">*</span> are required
            </p>
        </div>
    )
}
