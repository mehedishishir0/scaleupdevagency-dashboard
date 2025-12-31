"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import Image from "next/image"

type Props = {
    open: boolean
    onClose: () => void
}

type FormData = {
    name: string
}

export default function AddProfileModal({ open, onClose }: Props) {
    const [name, setName] = useState("")
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation<
        unknown,
        Error,
        FormData
    >({
        mutationFn: async (body) => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/profile`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: body.name,
                    }),
                }
            )

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.message || "Failed to add profile")
            }

            return res.json()
        },

        onSuccess: () => {
            toast.success("Profile created successfully")
            queryClient.invalidateQueries({ queryKey: ["profiles"] })
            setName("")
            onClose()
        },

        onError: (error) => {
            toast.error(error.message || "Failed to add profile")
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
                    <DialogTitle className="text-gray-600 text-lg text-center">Add New Profile</DialogTitle>
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
                        className="flex items-center gap-2"
                    >
                        {isPending && <Spinner className="h-4 w-4" />}
                        Add Profile
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
