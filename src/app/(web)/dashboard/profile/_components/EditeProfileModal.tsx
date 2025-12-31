
"use client"

import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import Image from "next/image"
import { useSession } from "next-auth/react"

type Profile = {
    _id: string
    name: string
}

type Props = {
    open: boolean
    onClose: () => void
    profile: Profile
    onSuccess: () => void
}

type FormData = {
    name: string
}

export default function EditProfileModal({ open, onClose, profile, onSuccess }: Props) {
    const [name, setName] = useState(profile.name || "")
    const queryClient = useQueryClient()
    const session = useSession()
    const token = (session?.data?.user as { accessToken: string })?.accessToken

    // Update name when profile prop changes
    useEffect(() => {
        setName(profile.name || "")
    }, [profile])

    const { mutate, isPending } = useMutation<unknown, Error, FormData>({
        mutationFn: async (body) => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/profile/${profile._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name: body.name }),
                }
            )

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.message || "Failed to update profile")
            }

            return res.json()
        },

        onSuccess: () => {
            toast.success("Profile updated successfully")
            queryClient.invalidateQueries({ queryKey: ["profiles"] })
            onSuccess() // Refresh parent list
            onClose()
        },

        onError: (error) => {
            toast.error(error.message || "Failed to update profile")
        },
    })

    const handleSubmit = () => {
        if (!name.trim()) {
            toast.error("Profile name is required")
            return
        }

        mutate({ name })
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="mb-4">
                    <div className="mx-auto">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={900}
                            height={900}
                            className="h-14 w-auto"
                        />
                    </div>
                    <DialogTitle className="text-gray-600 text-center text-lg">Edit Profile</DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    <Input
                        placeholder="Profile name"
                        value={name}
                        className="py-5"
                        onChange={(e) => setName(e.target.value)}
                        disabled={isPending}
                    />
                </div>

                <DialogFooter className="pt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        disabled={isPending}
                    >
                        Save {isPending && <Spinner className="ml-2" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
