export type RuleCategory = 'Sacred Rule' | 'Calculation Rule' | 'Narrative Rule';

export type RuleWorkflowStatus = 
  | 'draft' 
  | 'expert_review' 
  | 'admin_approval' 
  | 'review' 
  | 'approved' 
  | 'published';

export type UserRole = 'Viewer' | 'Editor' | 'Reviewer' | 'Admin';

export interface ImpactAnalysis {
  affectedModules: string[];
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  dependencyChain: string[];
}

export interface KnowledgeDocument {
  id: string; // Document ID
  category: RuleCategory;
  module: string; // Sub-categorization/module (e.g. 'Struktur Hari Jawa', 'GISIR HARI', etc.)
  title: string;
  slug: string;
  content: string;
  version: number;
  status: RuleWorkflowStatus;
  created_at: string;
  updated_at: string;
  createdBy: string;
  updatedBy: string;
  changeReason: string;
  impactAnalysis: ImpactAnalysis;
  history?: DocumentRevision[];
}

export interface DocumentRevision {
  revisionId: string;
  documentId: string;
  title: string;
  content: string;
  version: number;
  status: RuleWorkflowStatus;
  updated_at: string;
  updatedBy: string;
  changeReason: string;
  impactAnalysis: ImpactAnalysis;
}

export interface PromptRegistry {
  id: string;
  prompt_id: string;
  module: string;
  prompt_text: string;
  version: number;
  created_at: string;
  createdBy: string;
}

export interface AiAuditReport {
  id: string;
  report_type: string; // e.g. 'consistency_audit', 'conflict_detection'
  module: string;
  content: string;
  created_at: string;
  statusCount?: {
    errors: number;
    warnings: number;
    resolved: boolean;
  };
}

export interface ChangeLog {
  id: string;
  module: string;
  old_version: string | number;
  new_version: string | number;
  summary: string;
  changeReason: string;
  updatedBy: string;
  created_at: string;
  riskLevel?: string;
}

export interface SystemAssumption {
  id: string;
  module: string;
  assumption: string;
  status: 'active' | 'deprecated';
  created_at: string;
  createdBy: string;
}
