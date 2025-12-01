import { createContext, useContext } from "react"

// ✅ Define filter context interface
interface FiltersContextType {
  filters: {
    search: string
    ordering: string
  }
}

// ✅ Create the React Context
export const FiltersContext = createContext<FiltersContextType | undefined>(undefined)

// ✅ Export a hook for children to use it easily
export const useFiltersContext = () => {
  const ctx = useContext(FiltersContext)
  if (!ctx) throw new Error('useFiltersContext must be used within <FiltersProvider>')
  return ctx
}