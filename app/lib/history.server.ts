import * as fs from 'node:fs/promises'
import * as z from 'zod'
import * as dF from 'date-fns'
import validator from 'validator'

const historyFileItemSchema = z.object({
  arrivedAt: z.string().refine((value) => {
    return validator.isISO8601(value)
  }),
  location: z.string(),
})
type HistoryFileItem = z.infer<typeof historyFileItemSchema>

const historyFileSchema = z.array(historyFileItemSchema)
type HistoryFile = z.infer<typeof historyFileSchema>

type HistoryItem = {
  arrivedAt: Date
  location: string
  departedAt: Date | undefined
  days: number
}
type History = HistoryItem[]

const fetchHistoryFile = async (): Promise<HistoryFile|Error> => {
  const historyJsonString = await fs.readFile('./history.data.json')
  const historyJson = JSON.parse(historyJsonString.toString('utf8'))
  const result = historyFileSchema.safeParse(historyJson)
  if (!result.success) {
    return result.error
  }
  return result.data
}

const fetchHistory = async (): Promise<History|Error> => {
  const historyFile = await fetchHistoryFile()
  if (historyFile instanceof Error) {
    return historyFile
  }

  return historyFile.sort((a, b) => {
    return a.arrivedAt > b.arrivedAt ? -1 : 1
  }).map((item, index) => {
    const nextDestination = historyFile[index - 1]
    const arrivedAt = dF.parseISO(item.arrivedAt)
    const departedAt = nextDestination ? dF.parseISO(nextDestination.arrivedAt) : undefined
    const days = dF.differenceInDays(departedAt ?? new Date(), arrivedAt)

    return {
      arrivedAt,
      departedAt,
      days,
      location: item.location,
    }
  })
}

export { fetchHistory, fetchHistoryFile }
export type { HistoryFile, HistoryFileItem, History, HistoryItem }
