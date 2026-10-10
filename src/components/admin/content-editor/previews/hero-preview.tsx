import { HeroContent } from '@/app/admin/content-editor/page'

interface HeroPreviewProps {
  content: HeroContent
}

export default function HeroPreview({ content }: HeroPreviewProps) {
  return (
    <div className="space-y-6">
      {/* Status Badge */}
      <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-3 py-1.5 text-sm font-medium text-blue-900">
        <span className="relative inline-flex size-2 bg-orange-500 rounded-full animate-pulse" />
        {content.status}
      </div>

      {/* Headline */}
      <div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          {content.headline.map((word, i) => (
            <span key={i}>
              {i === content.headline.length - 1 ? (
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {word}
                </span>
              ) : (
                word
              )}
              {i < content.headline.length - 1 && ' '}
            </span>
          ))}
        </h1>
      </div>

      {/* Intro */}
      <p className="text-xl text-gray-700 max-w-2xl leading-relaxed">
        {content.intro}
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          {content.primaryCta}
        </button>
        <button className="px-6 py-3 bg-white hover:bg-gray-100 border-2 border-gray-300 text-gray-900 rounded-lg font-medium transition-colors">
          {content.secondaryCta}
        </button>
        <button className="px-6 py-3 bg-white hover:bg-gray-100 border-2 border-gray-300 text-gray-900 rounded-lg font-medium transition-colors">
          {content.scenariosCta}
        </button>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {content.badges.map((badge, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-900"
          >
            ✓ {badge}
          </span>
        ))}
      </div>

      {/* Mode & Privacy Cards */}
      <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs font-semibold text-gray-600 mb-1">{content.modeLabel}</p>
          <p className="text-lg font-bold text-gray-900">
            {content.modeValue} <span className="text-orange-600">{content.modeAccent}</span>
          </p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs font-semibold text-gray-600 mb-1">{content.privacyLabel}</p>
          <p className="text-lg font-bold text-gray-900">{content.privacyValue}</p>
        </div>
      </div>
    </div>
  )
}
