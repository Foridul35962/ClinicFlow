import CTA from '@/components/home/CTA'
import Features from '@/components/home/Features'
import HeroSection from '@/components/home/HeroSection'
import ProblemSection from '@/components/home/ProblemSection'
import SolutionSection from '@/components/home/SolutionSection'
import Work from '@/components/home/Work'
import React from 'react'

const page = () => {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <Work />
      <Features />
      <CTA />
    </>
  )
}

export default page