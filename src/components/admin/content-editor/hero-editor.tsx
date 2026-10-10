import { HeroContent } from '@/app/admin/content-editor/page'

interface HeroEditorProps {
  content: HeroContent
  onChange: (content: HeroContent) => void
}

export default function HeroEditor({ content, onChange }: HeroEditorProps) {
  const handleFieldChange = (field: keyof HeroContent, value: any) => {
    onChange({ ...content, [field]: value })
  }

  const handleHeadlineChange = (index: number, value: string) => {
    const newHeadline = [...content.headline]
    newHeadline[index] = value
    onChange({ ...content, headline: newHeadline })
  }

  const handleBadgeChange = (index: number, value: string) => {
    const newBadges = [...content.badges]
    newBadges[index] = value
    onChange({ ...content, badges: newBadges })
  }

  const addBadge = () => {
    onChange({ ...content, badges: [...content.badges, ''] })
  }

  const removeBadge = (index: number) => {
    onChange({ ...content, badges: content.badges.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-6">
      {/* Status */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Status Badge</label>
        <input
          type="text"
          value={content.status}
          onChange={(e) => handleFieldChange('status', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Real-time sign ↔ speech"
        />
      </div>

      {/* Headline */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Headline Words</label>
        <div className="space-y-2">
          {content.headline.map((word, i) => (
            <input
              key={i}
              type="text"
              value={word}
              onChange={(e) => handleHeadlineChange(i, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Word ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Intro */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Intro Text</label>
        <textarea
          value={content.intro}
          onChange={(e) => handleFieldChange('intro', e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* CTAs */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Primary CTA</label>
          <input
            type="text"
            value={content.primaryCta}
            onChange={(e) => handleFieldChange('primaryCta', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Secondary CTA</label>
          <input
            type="text"
            value={content.secondaryCta}
            onChange={(e) => handleFieldChange('secondaryCta', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Scenarios CTA</label>
          <input
            type="text"
            value={content.scenariosCta}
            onChange={(e) => handleFieldChange('scenariosCta', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Badges */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-semibold text-gray-700">Feature Badges</label>
          <button
            onClick={addBadge}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
          >
            Add Badge
          </button>
        </div>
        <div className="space-y-2">
          {content.badges.map((badge, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={badge}
                onChange={(e) => handleBadgeChange(i, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Badge ${i + 1}`}
              />
              <button
                onClick={() => removeBadge(i)}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mode & Privacy */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Mode Label</label>
          <input
            type="text"
            value={content.modeLabel}
            onChange={(e) => handleFieldChange('modeLabel', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Mode Value</label>
          <input
            type="text"
            value={content.modeValue}
            onChange={(e) => handleFieldChange('modeValue', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Mode Accent</label>
          <input
            type="text"
            value={content.modeAccent}
            onChange={(e) => handleFieldChange('modeAccent', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Privacy Label</label>
          <input
            type="text"
            value={content.privacyLabel}
            onChange={(e) => handleFieldChange('privacyLabel', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Privacy Value</label>
          <input
            type="text"
            value={content.privacyValue}
            onChange={(e) => handleFieldChange('privacyValue', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}
