export interface BaseModel {
  created_at?: string;
  created_by?: number;
  updated_at?: string;
  updated_by?: number;
  deleted_at?: string | null; // might be null if not deleted
  deleted_by?: number | null; // might be null if not deleted
}
