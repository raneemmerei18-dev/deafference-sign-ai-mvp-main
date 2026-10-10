import { FeaturesContent } from '@/app/admin/content-editor/page'

interface FeaturesPreviewProps {
  content: FeaturesContent
}

export default function FeaturesPreview({ content }: FeaturesPreviewProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          {content.title}
        </h2>
        <p className="text-xl text-gray-700">
          {content.description}
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.features.map((feature, index) => (
          <div
            key={index}
            className="border-2 border-gray-300 rounded-lg p-6 hover:border-blue-600 transition-colors bg-white"
          >
            <div className="text-5xl mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Empty State Help */}
      {content.features.length === 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 text-center">
          <p className="text-gray-700">
            Add features to see them rendered here. Click "Add Feature" in the editor.
          </p>
        </div>
      )}
    </div>
  )
}
