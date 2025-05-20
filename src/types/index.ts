// Existing types...

export type MatterType = {
  abbreviation: string;
  fullForm: string;
  notes?: string;
  category: string;
};

export const MATTER_TYPES: Record<string, MatterType> = {
  CONV: { abbreviation: 'CONV', fullForm: 'Conveyancing', notes: 'Sale, purchase, transfer of property', category: 'Property & Real Estate Law' },
  ELC: { abbreviation: 'ELC', fullForm: 'Environment and Land Court', notes: 'Land disputes, environmental issues', category: 'Property & Real Estate Law' },
  SUCC: { abbreviation: 'SUCC', fullForm: 'Succession Matters', notes: 'Wills, estates, probate involving property', category: 'Property & Real Estate Law' },
  BRS: { abbreviation: 'BRS', fullForm: 'Business Registration Services', notes: 'Company registration, compliance', category: 'Corporate & Commercial Law' },
  COMM: { abbreviation: 'COMM', fullForm: 'Commercial Transactions', notes: 'Business contracts, sales, commercial dealings', category: 'Corporate & Commercial Law' },
  CORP: { abbreviation: 'CORP', fullForm: 'Corporate Law', notes: 'Company governance, mergers, acquisitions', category: 'Corporate & Commercial Law' },
  COMP: { abbreviation: 'COMP', fullForm: 'Company Law', notes: 'Formation and regulation of companies', category: 'Corporate & Commercial Law' },
  TAX: { abbreviation: 'TAX', fullForm: 'Tax Law', notes: 'Tax disputes and compliance', category: 'Corporate & Commercial Law' },
  FIN: { abbreviation: 'FIN', fullForm: 'Financial Services Law', notes: 'Banking, securities, investments', category: 'Corporate & Commercial Law' },
  REG: { abbreviation: 'REG', fullForm: 'Regulatory Compliance', notes: 'Compliance with industry regulations', category: 'Corporate & Commercial Law' },
  INS: { abbreviation: 'INS', fullForm: 'Insurance Law', notes: 'Insurance policy and claims', category: 'Corporate & Commercial Law' },
  LIT: { abbreviation: 'LIT', fullForm: 'Litigation', notes: 'Lawsuits, court proceedings', category: 'Litigation & Dispute Resolution' },
  ADR: { abbreviation: 'ADR', fullForm: 'Alternative Dispute Resolution', notes: 'Arbitration, mediation, out-of-court settlement', category: 'Litigation & Dispute Resolution' },
  ENF: { abbreviation: 'ENF', fullForm: 'Enforcement Proceedings', notes: 'Execution of court judgments, debt collection', category: 'Litigation & Dispute Resolution' },
  CIV: { abbreviation: 'CIV', fullForm: 'Civil Matters', notes: 'Contract disputes, torts, personal injury', category: 'Civil & General Law' },
  GEN: { abbreviation: 'GEN', fullForm: 'General Matters', notes: 'Miscellaneous, non-specific legal matters', category: 'Civil & General Law' },
  CRIM: { abbreviation: 'CRIM', fullForm: 'Criminal Matters', notes: 'Criminal prosecutions, defense', category: 'Criminal Law' },
  FAM: { abbreviation: 'FAM', fullForm: 'Family Law', notes: 'Divorce, custody, maintenance, adoption', category: 'Family Law' },
  IP: { abbreviation: 'IP', fullForm: 'Intellectual Property', notes: 'Patents, copyrights, trademarks', category: 'Intellectual Property & Technology' },
  ELRC: { abbreviation: 'ELRC', fullForm: 'Employment and Labour Relations Court', notes: 'Employment disputes, labor laws', category: 'Employment & Labor Law' },
  IMM: { abbreviation: 'IMM', fullForm: 'Immigration Law', notes: 'Visa, residency, citizenship', category: 'Immigration & Human Rights' },
  HRC: { abbreviation: 'HRC', fullForm: 'Human Rights Court/Commission', notes: 'Human rights violations, constitutional complaints', category: 'Immigration & Human Rights' },
  ADMIN: { abbreviation: 'ADMIN', fullForm: 'Administrative Law', notes: 'Government decisions, judicial reviews', category: 'Administrative & Constitutional Law' },
  CONST: { abbreviation: 'CONST', fullForm: 'Constitutional Matters', notes: 'Constitutional rights and laws', category: 'Administrative & Constitutional Law' }
};

export interface ClientNumbering {
  organizationPrefix: string;
  sequentialNumber: number;
}

export interface CaseNumbering {
  organizationPrefix: string;
  clientNumber: string;
  matterType: string;
  sequentialNumber: number;
  year: number;
}

export function generateClientNumber(prefix: string, number: number): string {
  return `${prefix}/${String(number).padStart(3, '0')}`;
}

export function generateCaseNumber(
  prefix: string,
  clientNumber: string,
  matterType: string,
  caseNumber: number,
  year: number
): string {
  return `${prefix}/${clientNumber}/${matterType}/${String(caseNumber).padStart(2, '0')}/${year}`;
}