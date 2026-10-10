import { PricingContent } from '@/app/admin/content-editor/page'

interface PricingPreviewProps {
  content: PricingContent
}

export default function PricingPreview({ content }: PricingPreviewProps) {
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

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {content.plans.map((plan, index) => (
          <div
            key={index}
            className={`rounded-lg border-2 p-6 ${
              index === 1
                ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-200'
                : 'bg-white border-gray-300'
            }`}
          >
            {/* Plan Header */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <p className="text-4xl font-bold text-gray-900 mb-2">
                {plan.price}
              </p>
              <p className="text-gray-700">
                {plan.description}
              </p>
            </div>

            {/* Features */}
            <div className="mb-6 space-y-3">
              {plan.features.length > 0 ? (
                plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm italic">No features added yet</p>
              )}
            </div>

            {/* CTA */}
            <button
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                index === 1
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Empty State Help */}
      {content.plans.length === 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 text-center">
          <p className="text-gray-700">
            Add pricing plans to see them rendered here. Click "Add Plan" in the editor.
          </p>
        </div>
      )}
    </div>
  )
}
