import React from 'react'
import DashboardCard from './_components/DashboardCard'
import { MonthlyProjectsChart } from './_components/DashboardChart'

const page = () => {
  return (
    <div className='space-y-6'>
      <DashboardCard/>
      <MonthlyProjectsChart/>
    </div>
  )
}

export default page