"use client"

import { ResultPanel } from "./result-panel"
import type { Status, TranslationResult } from "./data"

export function OutputPanel({
  result,
  status,
  noMatch,
}: {
  result: TranslationResult | null
  status: Status
  noMatch?: boolean
}) {
  return <ResultPanel result={result} status={status} noMatch={noMatch} />
}
