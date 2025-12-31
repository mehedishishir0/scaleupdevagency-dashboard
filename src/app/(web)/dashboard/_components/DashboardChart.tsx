// "use client"

// import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"
// import { useQuery } from "@tanstack/react-query"

// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
//     CardDescription,
// } from "@/components/ui/card"
// import {
//     ChartContainer,
//     ChartTooltip,
//     ChartTooltipContent,
//     type ChartConfig,
// } from "@/components/ui/chart"

// export const description = "Monthly projects area chart"

// const chartConfig = {
//     totalProjects: {
//         label: "Total Projects",
//         color: "#FACC15", // yellow
//     },
// } satisfies ChartConfig

// export function MonthlyProjectsChart() {
//     const { data, isLoading } = useQuery({
//         queryKey: ["monthlyProjects"],
//         queryFn: async () => {
//             const res = await fetch(
//                 `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/overview/projects/monthly`
//             )
//             const result = await res.json()
//             return result.data
//         },
//     })

//     if (isLoading) return <p>Loading...</p>

//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle>Monthly Projects</CardTitle>
//                 <CardDescription>Showing total projects for the last 12 months</CardDescription>
//             </CardHeader>

//             <CardContent className="h-[400px] w-full">
//                 <ChartContainer config={chartConfig} className="h-full w-full">
//                     <ResponsiveContainer width="100%" height="100%">
//                         <AreaChart data={data} margin={{ left: 12, right: 12 }}>
//                             <CartesianGrid vertical={false} />
//                             <XAxis
//                                 dataKey="month"
//                                 tickLine={false}
//                                 axisLine={false}
//                                 tickMargin={8}
//                                 tickFormatter={(value) => value.slice(0, 3)} // Jan, Feb, etc.
//                             />
//                             <ChartTooltip
//                                 cursor={false}
//                                 content={<ChartTooltipContent indicator="line" />}
//                             />
//                             <Area
//                                 dataKey="totalProjects"
//                                 type="natural"
//                                 fill="#FACC15"   // yellow fill
//                                 fillOpacity={0.4}
//                                 stroke="#F59E0B" // darker yellow stroke
//                             />
//                         </AreaChart>
//                     </ResponsiveContainer>
//                 </ChartContainer>
//             </CardContent>
//         </Card>
//     )
// }


"use client"

import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"
import { useQuery } from "@tanstack/react-query"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

export const description = "Monthly projects area chart"

const chartConfig = {
    totalProjects: {
        label: "Total Projects",
        color: "#FACC15", // yellow
    },
} satisfies ChartConfig

export function MonthlyProjectsChart() {
    const { data, isLoading } = useQuery({
        queryKey: ["monthlyProjects"],
        queryFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/overview/projects/monthly`
            )
            const result = await res.json()
            return result.data
        },
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Projects</CardTitle>
                <CardDescription>Showing total projects for the last 12 months</CardDescription>
            </CardHeader>

            <CardContent className="h-[400px] w-full">
                {isLoading ? (
                    // Skeleton Loader
                    <div className="h-full w-full animate-pulse flex flex-col justify-center items-center bg-gray-100 rounded-md">
                        <div className="h-6 w-1/3 bg-gray-300 mb-4 rounded"></div>
                        <div className="h-[300px] w-full bg-gray-200 rounded"></div>
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ left: 12, right: 12 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 3)} // Jan, Feb, etc.
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="line" />}
                                />
                                <Area
                                    dataKey="totalProjects"
                                    type="natural"
                                    fill="#FACC15"   // yellow fill
                                    fillOpacity={0.4}
                                    stroke="#F59E0B" // darker yellow stroke
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
