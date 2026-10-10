import { AboutContent } from '@/app/admin/content-editor/page'

interface AboutUsPreviewProps {
  content: AboutContent
}

export default function AboutUsPreview({ content }: AboutUsPreviewProps) {
  return (
    <div className="space-y-8">
      {/* Main Title & Description */}
      <div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          {content.title}
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          {content.description}
        </p>
      </div>

      {/* Story Section */}
      <div className="border-t pt-8">
        <p className="text-sm font-semibold text-orange-600 uppercase mb-2">
          {content.storyEyebrow}
        </p>

        <p className="text-xl font-semibold text-gray-900 mb-4">
          {content.storyLead}
        </p>

        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          {content.storyBody}
        </p>

        <p className="text-lg text-gray-700 leading-relaxed">
          {content.storyMore}
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mt-8">
        <p className="text-sm text-gray-700">
          <strong>Preview Note:</strong> This shows how the About section content appears to visitors. Navigate through the Story, Mission, Vision, Values, Team, and Future Goals tabs on the actual landing page.
        </p>
      </div>
    </div>
  )
}
