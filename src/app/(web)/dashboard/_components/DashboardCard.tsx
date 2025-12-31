// "use client"

// import { Card, CardContent } from '@/components/ui/card'
// import { useQuery } from '@tanstack/react-query'
// import { Box, ClockFading, PartyPopper, User2 } from 'lucide-react'
// import React from 'react'

// const DashboardCard = () => {
//     const { data, isLoading } = useQuery({
//         queryKey: ["stats"],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/overview`)
//             const data = await res.json()
//             return data.data // this matches your API response
//         },
//     })

//     if (isLoading) return <p>Loading...</p>

//     return (
//         <div className="grid grid-cols-4 gap-5">
//             <Card className="py-9 px-4">
//                 <CardContent className="flex justify-between items-center">
//                     <div className="space-y-[6px]">
//                         <p className="text-[#6B7280] font-medium text-[12px]">Total Users</p>
//                         <p className="text-[#1F2937] font-medium text-[20px]">{data?.totalUsers}</p>
//                     </div>
//                     <div className="bg-[#FACC15] p-2 rounded-lg text-[#be9905]">
//                         <User2 />
//                     </div>
//                 </CardContent>
//             </Card>

//             <Card className="py-9 px-4">
//                 <CardContent className="flex justify-between items-center">
//                     <div className="space-y-[6px]">
//                         <p className="text-[#6B7280] font-medium text-[12px]">Total Projects</p>
//                         <p className="text-[#1F2937] font-medium text-[20px]">{data?.totalProjects}</p>
//                     </div>
//                     <div className="bg-[#FACC15] p-2 rounded-lg text-[#be9905]">
//                         <Box />
//                     </div>
//                 </CardContent>
//             </Card>

//             <Card className="py-9 px-4">
//                 <CardContent className="flex justify-between items-center">
//                     <div className="space-y-[6px]">
//                         <p className="text-[#6B7280] font-medium text-[12px]">Total Categories</p>
//                         <p className="text-[#1F2937] font-medium text-[20px]">{data?.totalCategories}</p>
//                     </div>
//                     <div className="bg-[#FACC15] p-2 rounded-lg text-[#be9905]">
//                         <PartyPopper />
//                     </div>
//                 </CardContent>
//             </Card>

//             <Card className="py-9 px-4">
//                 <CardContent className="flex justify-between items-center">
//                     <div className="space-y-[6px]">
//                         <p className="text-[#6B7280] font-medium text-[12px]">Total Profiles</p>
//                         <p className="text-[#1F2937] font-medium text-[20px]">{data?.totalProfiles}</p>
//                     </div>
//                     <div className="bg-[#FACC15] p-2 rounded-lg text-[#be9905]">
//                         <ClockFading />
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }

// export default DashboardCard

"use client"

import { Card, CardContent } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { Box, ClockFading, PartyPopper, User2 } from 'lucide-react'
import React from 'react'

const DashboardCard = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["stats"],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/overview`)
            const data = await res.json()
            return data.data
        },
    })

    if (isLoading) {
        // Skeleton loader
        return (
            <div className="grid grid-cols-4 gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="py-9 px-4">
                        <CardContent className="flex justify-between items-center">
                            <div className="space-y-[6px] w-full">
                                <div className="h-3 w-20 bg-gray-300 rounded"></div>
                                <div className="h-6 w-14 bg-gray-300 rounded"></div>
                            </div>
                            <div className="h-10 w-10 bg-gray-300 rounded-lg"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-4 gap-5">
            <Card className="py-9 px-4">
                <CardContent className="flex justify-between items-center">
                    <div className="space-y-[6px]">
                        <p className="text-[#6B7280] font-medium text-[12px]">Total Users</p>
                        <p className="text-[#1F2937] font-medium text-[20px]">{data?.totalUsers}</p>
                    </div>
                    <div className="bg-[#FACC15] p-2 rounded-lg text-[#be9905]">
                        <User2 />
                    </div>
                </CardContent>
            </Card>

            <Card className="py-9 px-4">
                <CardContent className="flex justify-between items-center">
                    <div className="space-y-[6px]">
                        <p className="text-[#6B7280] font-medium text-[12px]">Total Projects</p>
                        <p className="text-[#1F2937] font-medium text-[20px]">{data?.totalProjects}</p>
                    </div>
                    <div className="bg-[#FACC15] p-2 rounded-lg text-[#be9905]">
                        <Box />
                    </div>
                </CardContent>
            </Card>

            <Card className="py-9 px-4">
                <CardContent className="flex justify-between items-center">
                    <div className="space-y-[6px]">
                        <p className="text-[#6B7280] font-medium text-[12px]">Total Categories</p>
                        <p className="text-[#1F2937] font-medium text-[20px]">{data?.totalCategories}</p>
                    </div>
                    <div className="bg-[#FACC15] p-2 rounded-lg text-[#be9905]">
                        <PartyPopper />
                    </div>
                </CardContent>
            </Card>

            <Card className="py-9 px-4">
                <CardContent className="flex justify-between items-center">
                    <div className="space-y-[6px]">
                        <p className="text-[#6B7280] font-medium text-[12px]">Total Profiles</p>
                        <p className="text-[#1F2937] font-medium text-[20px]">{data?.totalProfiles}</p>
                    </div>
                    <div className="bg-[#FACC15] p-2 rounded-lg text-[#be9905]">
                        <ClockFading />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default DashboardCard
