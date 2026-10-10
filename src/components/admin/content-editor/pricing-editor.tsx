import { PricingContent } from '@/app/admin/content-editor/page'
import { Plus, X } from 'lucide-react'

interface PricingEditorProps {
  content: PricingContent
  onChange: (content: PricingContent) => void
}

export default function PricingEditor({ content, onChange }: PricingEditorProps) {
  const handleTitleChange = (value: string) => {
    onChange({ ...content, title: value })
  }

  const handleDescriptionChange = (value: string) => {
    onChange({ ...content, description: value })
  }

  const handlePlanChange = (index: number, field: string, value: any) => {
    const newPlans = [...content.plans]
    newPlans[index] = { ...newPlans[index], [field]: value }
    onChange({ ...content, plans: newPlans })
  }

  const handleFeatureChange = (planIndex: number, featureIndex: number, value: string) => {
    const newPlans = [...content.plans]
    const newFeatures = [...newPlans[planIndex].features]
    newFeatures[featureIndex] = value
    newPlans[planIndex] = { ...newPlans[planIndex], features: newFeatures }
    onChange({ ...content, plans: newPlans })
  }

  const addFeature = (planIndex: number) => {
    const newPlans = [...content.plans]
    newPlans[planIndex].features.push('')
    onChange({ ...content, plans: newPlans })
  }

  const removeFeature = (planIndex: number, featureIndex: number) => {
    const newPlans = [...content.plans]
    newPlans[planIndex].features = newPlans[planIndex].features.filter((_, i) => i !== featureIndex)
    onChange({ ...content, plans: newPlans })
  }

  const addPlan = () => {
    const newPlan = {
      name: '',
      price: '',
      description: '',
      features: [],
      cta: '',
    }
    onChange({ ...content, plans: [...content.plans, newPlan] })
  }

  const removePlan = (index: number) => {
    onChange({ ...content, plans: content.plans.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Section Title</label>
        <input
          type="text"
          value={content.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Section Description</label>
        <textarea
          value={content.description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Plans */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Pricing Plans</h3>
          <button
            onClick={addPlan}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Plan
          </button>
        </div>

        <div className="space-y-6">
          {content.plans.map((plan, planIndex) => (
            <div key={planIndex} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-md font-semibold text-gray-900">Plan {planIndex + 1}</h4>
                <button
                  onClick={() => removePlan(planIndex)}
                  className="p-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Plan Name</label>
                  <input
                    type="text"
                    value={plan.name}
                    onChange={(e) => handlePlanChange(planIndex, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price</label>
                  <input
                    type="text"
                    value={plan.price}
                    onChange={(e) => handlePlanChange(planIndex, 'price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={plan.description}
                  onChange={(e) => handlePlanChange(planIndex, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">CTA Text</label>
                <input
                  type="text"
                  value={plan.cta}
                  onChange={(e) => handlePlanChange(planIndex, 'cta', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700">Features</label>
                  <button
                    onClick={() => addFeature(planIndex)}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                  >
                    Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(planIndex, featureIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Feature ${featureIndex + 1}`}
                      />
                      <button
                        onClick={() => removeFeature(planIndex, featureIndex)}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
