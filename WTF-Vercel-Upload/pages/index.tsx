import React from 'react'
import PremiumHero from '@/components/PremiumHero'
import FeatureGrid from '@/components/FeatureGrid'
import StatsBand from '@/components/StatsBand'
import CTABand from '@/components/CTABand'

export default function Home() {
  return (
    <>
      <PremiumHero />
      <FeatureGrid />
      <StatsBand />
      <CTABand />
    </>
  )
}