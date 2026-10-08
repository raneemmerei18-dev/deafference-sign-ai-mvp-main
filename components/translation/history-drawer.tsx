"use client"

import { useState, useMemo } from "react"
import { useLanguage } from "@/components/i18n/language-provider"
import { useHistory } from "@/components/translation/history-context"
import { CloseIcon, CopyIcon } from "@/components/landing/icons"
import styles from "./history-drawer.module.css"

interface HistoryDrawerProps {
  isOpen: boolean
  onClose: () => void
  onReplay?: (text: string) => void
}

const CATEGORIES = [
  { id: "all", label: "All items" },
  { id: "medical", label: "Medical" },
  { id: "education", label: "Education" },
  { id: "general", label: "General" },
  { id: "other", label: "Other" },
]

export function HistoryDrawer({ isOpen, onClose, onReplay }: HistoryDrawerProps) {
  const { dict } = useLanguage()

  let items: any[] = []
  let deleteItem = () => {}
  let clearAll = () => {}

  try {
    const context = useHistory()
    items = context.items
    deleteItem = context.deleteItem
    clearAll = context.clearAll
  } catch {
    // Fallback if context not available
  }

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.inputText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.outputText.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [items, searchTerm, selectedCategory])

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleClearAll = () => {
    clearAll()
    setShowClearConfirm(false)
    setSearchTerm("")
    setSelectedCategory("all")
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />}

      {/* Drawer */}
      <aside
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}
        aria-label="Translation history"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>📋 History</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close history drawer"
            type="button"
          >
            <CloseIcon size={24} />
          </button>
        </div>

        {/* Search */}
        <div className={styles.searchSection}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search translations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search translation history"
          />
        </div>

        {/* Filters */}
        <div className={styles.filterSection}>
          <label className={styles.filterLabel}>Filter by category:</label>
          <div className={styles.filterButtons}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.filterButton} ${
                  selectedCategory === cat.id ? styles.filterButtonActive : ""
                }`}
                onClick={() => setSelectedCategory(cat.id)}
                aria-pressed={selectedCategory === cat.id}
                type="button"
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        <div className={styles.listContainer}>
          {filteredItems.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>
                {items.length === 0
                  ? "No translation history yet. Start translating!"
                  : "No results found. Try adjusting your search or filters."}
              </p>
            </div>
          ) : (
            <ul className={styles.historyList}>
              {filteredItems.map((item) => (
                <li key={item.id} className={styles.historyItem}>
                  <div className={styles.itemContent}>
                    <div className={styles.itemMeta}>
                      <span className={styles.timestamp}>
                        {new Date(item.timestamp).toLocaleDateString()} at{" "}
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className={styles.categoryBadge}>{item.category}</span>
                    </div>
                    <div className={styles.itemText}>
                      <p className={styles.itemLabel}>Input:</p>
                      <p className={styles.itemValue}>{item.inputText}</p>
                    </div>
                    <div className={styles.itemText}>
                      <p className={styles.itemLabel}>Output:</p>
                      <p className={styles.itemValue}>{item.outputText}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={styles.itemActions}>
                    {onReplay && (
                      <button
                        className={styles.actionButton}
                        onClick={() => {
                          onReplay(item.inputText)
                          onClose()
                        }}
                        title="Replay this translation"
                        type="button"
                      >
                        ▶️
                      </button>
                    )}
                    <button
                      className={styles.actionButton}
                      onClick={() => handleCopy(item.outputText, item.id)}
                      title="Copy to clipboard"
                      type="button"
                    >
                      {copiedId === item.id ? "✓" : "📋"}
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                      onClick={() => deleteItem(item.id)}
                      title="Delete this item"
                      type="button"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={styles.footer}>
            <button
              className={styles.clearButton}
              onClick={() => setShowClearConfirm(true)}
              type="button"
            >
              Clear All History
            </button>
          </div>
        )}

        {/* Clear Confirmation Dialog */}
        {showClearConfirm && (
          <div className={styles.confirmDialog}>
            <div className={styles.confirmContent}>
              <h3 className={styles.confirmTitle}>Clear all history?</h3>
              <p className={styles.confirmText}>This action cannot be undone.</p>
              <div className={styles.confirmButtons}>
                <button
                  className={styles.confirmCancel}
                  onClick={() => setShowClearConfirm(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className={styles.confirmConfirm}
                  onClick={handleClearAll}
                  type="button"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
