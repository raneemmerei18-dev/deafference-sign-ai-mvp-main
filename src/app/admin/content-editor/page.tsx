'use client'

import { useState, useCallback, useEffect } from 'react'
import { Save, Eye, EyeOff, RefreshCw } from 'lucide-react'
import HeroEditor from '@/components/admin/content-editor/hero-editor'
import AboutUsEditor from '@/components/admin/content-editor/about-us-editor'
import PricingEditor from '@/components/admin/content-editor/pricing-editor'
import FeaturesEditor from '@/components/admin/content-editor/features-editor'
import HeroPreview from '@/components/admin/content-editor/previews/hero-preview'
import AboutUsPreview from '@/components/admin/content-editor/previews/about-us-preview'
import PricingPreview from '@/components/admin/content-editor/previews/pricing-preview'
import FeaturesPreview from '@/components/admin/content-editor/previews/features-preview'

type TabType = 'hero' | 'about' | 'pricing' | 'features'

export interface HeroContent {
  status: string
  headline: string[]
  intro: string
  primaryCta: string
  secondaryCta: string
  scenariosCta: string
  badges: string[]
  modeLabel: string
  modeValue: string
  modeAccent: string
  privacyLabel: string
  privacyValue: string
}

export interface AboutContent {
  title: string
  description: string
  storyEyebrow: string
  storyLead: string
  storyBody: string
  storyMore: string
}

export interface PricingContent {
  title: string
  description: string
  plans: Array<{
    name: string
    price: string
    description: string
    features: string[]
    cta: string
  }>
}

export interface FeaturesContent {
  title: string
  description: string
  features: Array<{
    title: string
    description: string
    icon: string
  }>
}

export default function ContentEditorPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hero')
  const [showPreview, setShowPreview] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')

  const [heroContent, setHeroContent] = useState<HeroContent>({
    status: 'Real-time sign ↔ speech',
    headline: ['BREAKING', 'COMMUNICATION', 'BARRIERS'],
    intro: 'Deafference translates sign language into speech and text — and speech back into sign — in real time.',
    primaryCta: 'Try Deafference',
    secondaryCta: 'Watch it in action',
    scenariosCta: 'Explore scenarios',
    badges: ['Privacy-first', 'Real-time translation', 'Built for accessibility', 'English & Arabic', 'AI-powered'],
    modeLabel: 'Mode',
    modeValue: 'Live',
    modeAccent: 'two-way',
    privacyLabel: 'Privacy',
    privacyValue: 'You stay in control',
  })

  const [aboutContent, setAboutContent] = useState<AboutContent>({
    title: 'A small team building the bridge between spoken and signed language',
    description: 'Deafference started from a simple observation: everyday spoken interactions still leave Deaf and hard-of-hearing people waiting on an interpreter.',
    storyEyebrow: 'Our story',
    storyLead: 'Deafference began after watching a routine clinic visit turn stressful for reasons that had nothing to do with the diagnosis:',
    storyBody: 'no interpreter was booked, the front desk defaulted to writing notes back and forth, and a five-minute check-in took forty.',
    storyMore: 'We started in healthcare and public-service settings because the stakes are highest there.',
  })

  const [pricingContent, setPricingContent] = useState<PricingContent>({
    title: 'Simple, transparent pricing',
    description: 'Choose the plan that fits your needs',
    plans: [
      {
        name: 'Starter',
        price: 'Free',
        description: 'For individuals',
        features: ['Real-time translation', 'Basic support'],
        cta: 'Get started',
      },
      {
        name: 'Professional',
        price: '$29/month',
        description: 'For organizations',
        features: ['Unlimited translations', 'Priority support', 'Custom branding'],
        cta: 'Start trial',
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        description: 'For large deployments',
        features: ['Everything in Pro', 'Dedicated support', 'SLA guarantee'],
        cta: 'Contact sales',
      },
    ],
  })

  const [featuresContent, setFeaturesContent] = useState<FeaturesContent>({
    title: 'Powerful features for real-time communication',
    description: 'Everything you need to break communication barriers',
    features: [
      {
        title: 'Live Sign Language Recognition',
        description: 'AI-powered real-time sign language to text conversion',
        icon: '👁️',
      },
      {
        title: 'Speech to Sign Translation',
        description: 'Spoken words converted to clear sign language video',
        icon: '🎤',
      },
      {
        title: 'Text-to-Speech Support',
        description: 'Written text read aloud in natural-sounding voices',
        icon: '🔊',
      },
    ],
  })

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('contentEditorData')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.hero) setHeroContent(data.hero)
        if (data.about) setAboutContent(data.about)
        if (data.pricing) setPricingContent(data.pricing)
        if (data.features) setFeaturesContent(data.features)
      } catch (e) {
        console.error('Failed to load saved content:', e)
      }
    }
  }, [])

  const handleSaveContent = useCallback(async () => {
    setIsSaving(true)
    setSaveStatus('Saving...')

    try {
      const contentData = {
        hero: heroContent,
        about: aboutContent,
        pricing: pricingContent,
        features: featuresContent,
      }

      // Save to localStorage (in production, would be API call)
      localStorage.setItem('contentEditorData', JSON.stringify(contentData))

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800))

      setSaveStatus('✓ Saved successfully')
      setTimeout(() => setSaveStatus(''), 3000)
    } catch (error) {
      console.error('Save failed:', error)
      setSaveStatus('✗ Save failed')
      setTimeout(() => setSaveStatus(''), 3000)
    } finally {
      setIsSaving(false)
    }
  }, [heroContent, aboutContent, pricingContent, featuresContent])

  const handleReset = useCallback(() => {
    if (confirm('Reset all changes to defaults?')) {
      localStorage.removeItem('contentEditorData')
      setHeroContent({
        status: 'Real-time sign ↔ speech',
        headline: ['BREAKING', 'COMMUNICATION', 'BARRIERS'],
        intro: 'Deafference translates sign language into speech and text — and speech back into sign — in real time.',
        primaryCta: 'Try Deafference',
        secondaryCta: 'Watch it in action',
        scenariosCta: 'Explore scenarios',
        badges: ['Privacy-first', 'Real-time translation', 'Built for accessibility', 'English & Arabic', 'AI-powered'],
        modeLabel: 'Mode',
        modeValue: 'Live',
        modeAccent: 'two-way',
        privacyLabel: 'Privacy',
        privacyValue: 'You stay in control',
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Content Editor</h1>
          <p className="text-gray-600">Manage landing page content and see live preview updates</p>
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap gap-3 items-center justify-between bg-white rounded-lg shadow-sm p-4">
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors"
            >
              {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>

          <div className="flex items-center gap-3">
            {saveStatus && (
              <span className={`text-sm font-medium ${saveStatus.includes('✓') ? 'text-green-600' : saveStatus.includes('✗') ? 'text-red-600' : 'text-blue-600'}`}>
                {saveStatus}
              </span>
            )}
            <button
              onClick={handleSaveContent}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 bg-white rounded-lg shadow-sm p-1 overflow-x-auto">
          {(['hero', 'about', 'pricing', 'features'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Editor + Preview Layout */}
        <div className={`grid gap-6 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Editor Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Editor
            </h2>

            {activeTab === 'hero' && (
              <HeroEditor content={heroContent} onChange={setHeroContent} />
            )}
            {activeTab === 'about' && (
              <AboutUsEditor content={aboutContent} onChange={setAboutContent} />
            )}
            {activeTab === 'pricing' && (
              <PricingEditor content={pricingContent} onChange={setPricingContent} />
            )}
            {activeTab === 'features' && (
              <FeaturesEditor content={featuresContent} onChange={setFeaturesContent} />
            )}
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="bg-white rounded-lg shadow-md p-6 overflow-auto max-h-[80vh]">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Preview</h2>

              {activeTab === 'hero' && (
                <HeroPreview content={heroContent} />
              )}
              {activeTab === 'about' && (
                <AboutUsPreview content={aboutContent} />
              )}
              {activeTab === 'pricing' && (
                <PricingPreview content={pricingContent} />
              )}
              {activeTab === 'features' && (
                <FeaturesPreview content={featuresContent} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
