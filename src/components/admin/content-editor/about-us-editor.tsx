import { AboutContent } from '@/app/admin/content-editor/page'

interface AboutUsEditorProps {
  content: AboutContent
  onChange: (content: AboutContent) => void
}

export default function AboutUsEditor({ content, onChange }: AboutUsEditorProps) {
  const handleFieldChange = (field: keyof AboutContent, value: string) => {
    onChange({ ...content, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Section Title</label>
        <input
          type="text"
          value={content.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
        <textarea
          value={content.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Story Section */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Story Section</h3>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Story Eyebrow</label>
          <input
            type="text"
            value={content.storyEyebrow}
            onChange={(e) => handleFieldChange('storyEyebrow', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Story Lead</label>
          <textarea
            value={content.storyLead}
            onChange={(e) => handleFieldChange('storyLead', e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Story Body</label>
          <textarea
            value={content.storyBody}
            onChange={(e) => handleFieldChange('storyBody', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Story Continuation</label>
          <textarea
            value={content.storyMore}
            onChange={(e) => handleFieldChange('storyMore', e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}
