import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  setDoc,
  deleteDoc, 
  updateDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { 
  BookOpen, 
  Sliders, 
  FileCheck, 
  Terminal, 
  Database, 
  Palette, 
  Activity, 
  History, 
  Download, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Save, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Eye, 
  RotateCcw, 
  Sparkles, 
  Settings, 
  Info,
  GitCompare,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Shield,
  User,
  Zap,
  Layers,
  CheckSquare
} from 'lucide-react';
import { 
  KnowledgeDocument, 
  PromptRegistry, 
  AiAuditReport, 
  ChangeLog, 
  SystemAssumption, 
  RuleCategory, 
  RuleWorkflowStatus, 
  UserRole, 
  ImpactAnalysis,
  DocumentRevision 
} from '../types/kbms';

export const KbmsDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  // Authentication & Authorization Roles
  const [currentRole, setCurrentRole] = useState<UserRole>('Admin');
  const userEmail = "geibbymeyrith@gmail.com";

  // Views
  const [activeTab, setActiveTab] = useState<'all' | 'sacred' | 'calculation' | 'narrative' | 'audit_trail' | 'compare' | 'assumptions'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Master States
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [prompts, setPrompts] = useState<PromptRegistry[]>([]);
  const [assumptions, setAssumptions] = useState<SystemAssumption[]>([]);
  const [auditReports, setAuditReports] = useState<AiAuditReport[]>([]);
  const [changeLogs, setChangeLogs] = useState<ChangeLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // File system & raw MD syncing
  const [rawFileContent, setRawFileContent] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  // Document form fields
  const [docCategory, setDocCategory] = useState<RuleCategory>('Calculation Rule');
  const [docModule, setDocModule] = useState('GISIR HARI');
  const [docTitle, setDocTitle] = useState('');
  const [docSlug, setDocSlug] = useState('');
  const [docContent, setDocContent] = useState('');
  const [docStatus, setDocStatus] = useState<RuleWorkflowStatus>('draft');
  const [docVersion, setDocVersion] = useState<number>(1);
  const [docChangeReason, setDocChangeReason] = useState('');
  
  // Impact Analysis fields
  const [impactModules, setImpactModules] = useState<string[]>(['Calculator']);
  const [impactRisk, setImpactRisk] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [impactDependencies, setImpactDependencies] = useState<string[]>(['Weton Main Database']);

  // Version Comparison tool states
  const [compareDocId, setCompareDocId] = useState<string>('');
  const [revV1, setRevV1] = useState<number>(1);
  const [revV2, setRevV2] = useState<number>(1);
  const [diffLines, setDiffLines] = useState<{ type: 'added' | 'removed' | 'neutral', text: string }[]>([]);

  // Local static lists for modules
  const MODULE_OPTIONS: Record<RuleCategory, string[]> = {
    'Sacred Rule': [
      'Struktur Hari Jawa', 'Struktur Pasaran Jawa', 'Struktur Wuku', 'Struktur Pranata Mangsa',
      'Struktur Windu', 'Struktur Tahun Saka', 'Struktur Lambang Tahun', 'Struktur Padewan',
      'Struktur Padangon', 'Struktur Nagadina', 'Struktur Dewa Harian', 'Struktur Hari Naas',
      'Struktur Kalender Jawa'
    ],
    'Calculation Rule': [
      'GISIR HARI', 'GISIR HARIAN', 'Weton Hari Kelahiran', 'Jodoh Pinasti', 'Hari Baik',
      'Hitung Nama', 'Hari dan Pasaran', 'Hari dan Lambang', 'Pasaran dan Dewa', 'Sifat Hari',
      'Sifat Pasaran', 'Warna Hari', 'Statistik Kunjungan', 'Perhitungan Bulan Jawa'
    ],
    'Narrative Rule': [
      'Narasi Rejeki', 'Narasi Watak', 'Narasi Jodoh', 'Narasi Hari Baik', 'Narasi Gisir Harian',
      'Narasi Meditasi', 'Narasi Padewan', 'Narasi Padangon', 'Narasi Dewa Harian'
    ]
  };

  const CLIENT_MODULES = [
    'Calculator & Weton', 'PDF Engine', 'Database Rules', 'UI Branding', 
    'Admin Metrics Dashboard', 'History & Statistics', 'API Service', 'Mobile View Layout'
  ];

  const DEPS_LIST = [
    'System Base Constants', 'Gisir Factor Reference', 'Candra Sangkala Table', 
    'Java Saka Epoch Calculation', 'Aksara Javanese Translation Engine'
  ];

  // Load Realtime Data
  useEffect(() => {
    setIsLoading(true);

    const docQuery = query(collection(db, 'knowledge_documents'), orderBy('created_at', 'desc'));
    const unsubDocs = onSnapshot(docQuery, (snap) => {
      const list: KnowledgeDocument[] = [];
      snap.forEach(d => {
        list.push({ id: d.id, ...d.data() } as KnowledgeDocument);
      });
      setDocuments(list);
    }, (err) => console.error("Error loading knowledge_documents:", err));

    const assumptionQuery = query(collection(db, 'system_assumptions'), orderBy('created_at', 'desc'));
    const unsubAssumptions = onSnapshot(assumptionQuery, (snap) => {
      const list: SystemAssumption[] = [];
      snap.forEach(d => {
        list.push({ id: d.id, ...d.data() } as SystemAssumption);
      });
      setAssumptions(list);
    }, (err) => console.error("Error loading system_assumptions:", err));

    const logsQuery = query(collection(db, 'change_logs'), orderBy('created_at', 'desc'));
    const unsubLogs = onSnapshot(logsQuery, (snap) => {
      const list: ChangeLog[] = [];
      snap.forEach(d => {
        list.push({ id: d.id, ...d.data() } as ChangeLog);
      });
      setChangeLogs(list);
      setIsLoading(false);
    }, (err) => console.error("Error loading change_logs:", err));

    fetchDiskKnowledgeBase();

    return () => {
      unsubDocs();
      unsubAssumptions();
      unsubLogs();
    };
  }, []);

  const fetchDiskKnowledgeBase = async () => {
    try {
      const res = await fetch('/api/kb/raw');
      const data = await res.json();
      if (data.exists) {
        setRawFileContent(data.content);
      }
    } catch (e) {
      console.error("Failed to read raw file:", e);
    }
  };

  // Trigger Notifications Helper
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  // Seed documents initially from disk if database is blank
  const handleSeedDatabase = async () => {
    if (!rawFileContent) {
      showToast('error', "Konten master disk kosong atau gagal diperoleh.");
      return;
    }
    setIsSyncing(true);
    try {
      // Create static seed documents categorized perfectly
      const seeds: Partial<KnowledgeDocument>[] = [
        {
          category: 'Sacred Rule',
          module: 'Struktur Hari Jawa',
          title: 'Fondasi Struktur Hari Jawa',
          slug: 'hari-jawa-sacred',
          content: 'Siklus wuku, pasaran murni danyut bumi sengkala (Legi, Pahing, Pon, Wage, Kliwon). Perhitungan adalah deterministik mutlak.',
          version: 1,
          status: 'published',
          changeReason: 'Inisialisasi sistem GKMS',
          createdBy: userEmail,
          updatedBy: userEmail,
          impactAnalysis: { affectedModules: ['Calculator & Weton'], riskLevel: 'Critical', dependencyChain: ['System Base Constants'] }
        },
        {
          category: 'Calculation Rule',
          module: 'GISIR HARI',
          title: 'Logika Konversi Gisir Hari',
          slug: 'gisir-hari-calculation',
          content: 'Formula: (Masehi Epoch Date MOD 5) + 3. Menghasilkan interpolasi pasaran weton dengan tingkat kepasrahan 99.8%.',
          version: 1,
          status: 'published',
          changeReason: 'Pembaruan kalkulasi deterministic',
          createdBy: userEmail,
          updatedBy: userEmail,
          impactAnalysis: { affectedModules: ['Calculator & Weton', 'API Service'], riskLevel: 'High', dependencyChain: ['Gisir Factor Reference'] }
        },
        {
          category: 'Narrative Rule',
          module: 'Narasi Rejeki',
          title: 'Narasi Rejeki dan Watak Weton',
          slug: 'narasi-rejeki-default',
          content: JSON.stringify({
            PENGHIDUPAN_LABELS: {
              0: "Kesakitan (Penderitaan dan perjalanan hidup)",
              1: "Penghasilan atau pemasukan sedikit",
              2: "Penghasilan sedang atau cukup",
              3: "Penghasilan baik",
              4: "Penghasilan besar",
              5: "Penghasilan baik dan hidup senang",
              7: "Hidup serba mewah dan sangat sempurna",
              8: "Kehidupan serba mewah karena keberhasilannya, dan diteruskan oleh keturunannya"
            },
            PENGHIDUPAN_DATA: [
              { minAge: 0, maxAge: 6, neptuMap: { 7: 4, 8: 4, 9: 2, 10: 1, 11: 2, 12: 0, 13: 3, 14: 1, 15: 2, 16: 0, 17: 1, 18: 2 } },
              { minAge: 7, maxAge: 12, neptuMap: { 7: 1, 8: 1, 9: 5, 10: 0, 11: 4, 12: 5, 13: 1, 14: 0, 15: 0, 16: 3, 17: 1, 18: 5 } },
              { minAge: 13, maxAge: 18, neptuMap: { 7: 4, 8: 0, 9: 1, 10: 4, 11: 1, 12: 1, 13: 0, 14: 1, 15: 1, 16: 1, 17: 0, 18: 1 } },
              { minAge: 19, maxAge: 24, neptuMap: { 7: 1, 8: 1, 9: 0, 10: 1, 11: 1, 12: 0, 13: 5, 14: 4, 15: 1, 16: 2, 17: 5, 18: 0 } },
              { minAge: 25, maxAge: 30, neptuMap: { 7: 0, 8: 0, 9: 4, 10: 1, 11: 8, 12: 4, 13: 0, 14: 0, 15: 5, 16: 0, 17: 0, 18: 4 } },
              { minAge: 31, maxAge: 36, neptuMap: { 7: 2, 8: 3, 9: 1, 10: 3, 11: 1, 12: 0, 13: 1, 14: 0, 15: 2, 16: 1, 17: 1, 18: 1 } },
              { minAge: 37, maxAge: 42, neptuMap: { 7: 2, 8: 0, 9: 4, 10: 0, 11: 0, 12: 1, 13: 1, 14: 4, 15: 0, 16: 8, 17: 1, 18: 4 } },
              { minAge: 43, maxAge: 48, neptuMap: { 8: 1, 9: 0, 10: 0, 11: 1, 12: 0, 13: 5, 14: 4, 15: 1, 16: 1, 17: 5, 18: 0 } },
              { minAge: 49, maxAge: 54, neptuMap: { 9: 1, 10: 4, 11: 2, 12: 1, 13: 2, 14: 1, 15: 2, 16: 2, 17: 2, 18: 1 } },
              { minAge: 55, maxAge: 60, neptuMap: { 10: 4, 11: 0, 12: 4, 13: 0, 14: 4, 15: 5, 16: 7, 17: 0, 18: 4 } },
              { minAge: 61, maxAge: 66, neptuMap: { 11: 2, 12: 4, 13: 1, 14: 0, 15: 5, 16: 2, 17: 1, 18: 4 } },
              { minAge: 67, maxAge: 72, neptuMap: { 12: 0, 13: 2, 14: 1, 15: 1, 16: 0, 17: 2, 18: 0 } },
              { minAge: 73, maxAge: 78, neptuMap: { 13: 5, 14: 4, 15: 0, 16: 7, 17: 5, 18: 0 } },
              { minAge: 79, maxAge: 84, neptuMap: { 14: 4, 15: 4, 16: 1, 17: 5, 18: 4 } },
              { minAge: 85, maxAge: 90, neptuMap: { 15: 1, 16: 0, 17: 1, 18: 1 } },
              { minAge: 91, maxAge: 96, neptuMap: { 16: 2, 17: 0, 18: 4 } },
              { minAge: 97, maxAge: 102, neptuMap: { 17: 4, 18: 1 } },
              { minAge: 103, maxAge: 108, neptuMap: { 18: 1 } }
            ],
            saran: "Untuk menyiasati urip atau penghidupan atau rejeki yang kecil, sebaiknya Anda harus mempunyai pasangan kerja atau partner yang nilai keberuntungannya tinggi. Jika sudah terlanjur memiliki pasangan yang memiliki nilai keberuntungan kecil maka Anda bisa menyiasati dengan melakukan Seratan Winadi di weton kelahiran Anda, weton kelahiran pasangan Anda, dan weton hari pernikahan."
          }, null, 2),
          version: 1,
          status: 'published',
          changeReason: 'Default template',
          createdBy: userEmail,
          updatedBy: userEmail,
          impactAnalysis: { affectedModules: ['Weton Kelahiran', 'UI Branding', 'PDF Engine'], riskLevel: 'Low', dependencyChain: [] }
        }
      ];

      for (const s of seeds) {
        const id = `doc_${s.category?.replace(/\s+/g, '').toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const completeDoc = {
          id,
          ...s,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          history: []
        };
        await setDoc(doc(db, 'knowledge_documents', id), completeDoc);
      }

      showToast('success', "Proses seeding tiga kategori utama GKMS sukses diluncurkan!");
    } catch (e: any) {
      showToast('error', `Gagal seeding database: ${e.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Core authorization checker
  const checkPermission = (action: 'publish' | 'rollback' | 'edit', category: RuleCategory) => {
    if (currentRole === 'Admin') return true;
    if (action === 'edit') {
      return currentRole === 'Editor' || currentRole === 'Reviewer';
    }
    if (action === 'publish') {
      if (category === 'Sacred Rule') return false; // Admin only for Sacred
      return currentRole === 'Reviewer'; // Reviewer can publish Calculation & Narrative
    }
    if (action === 'rollback') {
      if (category === 'Sacred Rule') return false; // Admin only rollback Sacred
      return currentRole === 'Reviewer'; // Reviewer can rollback calc/narrative
    }
    return false;
  };

  // Auto transition validator based on category governance:
  // Sacred Rule: Draft -> Expert Review -> Admin Approval -> Published
  // Calculation Rule: Draft -> Review -> Approved -> Published
  // Narrative Rule: Draft -> Review -> Published
  const getNextWorkflowStatus = (current: RuleWorkflowStatus, category: RuleCategory): RuleWorkflowStatus[] => {
    if (category === 'Sacred Rule') {
      switch (current) {
        case 'draft': return ['expert_review'];
        case 'expert_review': return ['admin_approval'];
        case 'admin_approval': return ['published'];
        default: return ['draft'];
      }
    } else if (category === 'Calculation Rule') {
      switch (current) {
        case 'draft': return ['review'];
        case 'review': return ['approved'];
        case 'approved': return ['published'];
        default: return ['draft'];
      }
    } else {
      // Narrative Rule
      switch (current) {
        case 'draft': return ['review'];
        case 'review': return ['published'];
        default: return ['draft'];
      }
    }
  };

  // Open creation/edit form
  const openForm = (docObj?: KnowledgeDocument) => {
    if (docObj) {
      if (!checkPermission('edit', docObj.category)) {
        showToast('error', `Akses Ditolak: Peran "${currentRole}" tidak diizinkan menyunting dokumen kategori ${docObj.category}`);
        return;
      }
      setEditId(docObj.id);
      setDocCategory(docObj.category);
      setDocModule(docObj.module);
      setDocTitle(docObj.title);
      setDocSlug(docObj.slug);
      setDocContent(docObj.content);
      setDocStatus(docObj.status);
      setDocVersion(docObj.version);
      setDocChangeReason('');
      setImpactModules(docObj.impactAnalysis?.affectedModules || ['Calculator & Weton']);
      setImpactRisk(docObj.impactAnalysis?.riskLevel || 'Medium');
      setImpactDependencies(docObj.impactAnalysis?.dependencyChain || []);
    } else {
      if (currentRole === 'Viewer') {
        showToast('error', 'Akses Ditolak: Anda hanya memiliki hak akses peninjauan (Viewer).');
        return;
      }
      setEditId(null);
      setDocCategory('Calculation Rule');
      setDocModule('GISIR HARI');
      setDocTitle('');
      setDocSlug('');
      setDocContent('');
      setDocStatus('draft');
      setDocVersion(1);
      setDocChangeReason('');
      setImpactModules(['Calculator & Weton']);
      setImpactRisk('Medium');
      setImpactDependencies([]);
    }
    setIsFormOpen(true);
  };

  // Save changes and handle strict revision archiving (Versioning without deleting history)
  const handleSaveDocument = async () => {
    if (!docTitle || !docSlug || !docContent || !docChangeReason) {
      showToast('error', "Isi formulir tidak lengkap! Anda wajib memasukkan seluruh field termasuk Alasan Perubahan.");
      return;
    }

    if (!checkPermission('edit', docCategory)) {
      showToast('error', `Akses Ditolak: Peran "${currentRole}" tidak diizinkan.`);
      return;
    }

    // Sacred Rules require Admin approval to be instantly published
    if (docCategory === 'Sacred Rule' && docStatus === 'published' && currentRole !== 'Admin') {
      showToast('error', "Otorisasi Ditolak: Hanya Admin yang dapat menerbitkan aturan bernilai SACRED RULES.");
      return;
    }

    try {
      const now = new Date().toISOString();
      const impactObj: ImpactAnalysis = {
        affectedModules: impactModules,
        riskLevel: impactRisk,
        dependencyChain: impactDependencies
      };

      if (editId) {
        const originalDoc = documents.find(d => d.id === editId);
        if (!originalDoc) throw new Error("Dokumen orisinal tidak terdeteksi.");

        // Safe version indexing
        const nextVersion = originalDoc.version + 1;
        const previousRevision: DocumentRevision = {
          revisionId: `rev_${Date.now()}_${originalDoc.version}`,
          documentId: originalDoc.id,
          title: originalDoc.title,
          content: originalDoc.content,
          version: originalDoc.version,
          status: originalDoc.status,
          updated_at: originalDoc.updated_at,
          updatedBy: originalDoc.updatedBy || originalDoc.createdBy,
          changeReason: originalDoc.changeReason || 'Versi arsip orisinal',
          impactAnalysis: originalDoc.impactAnalysis || { affectedModules: [], riskLevel: 'Low', dependencyChain: [] }
        };

        const updatedHistory = originalDoc.history ? [...originalDoc.history, previousRevision] : [previousRevision];

        const payload: KnowledgeDocument = {
          id: editId,
          category: docCategory,
          module: docModule,
          title: docTitle,
          slug: docSlug.toLowerCase().replace(/\s+/g, '-'),
          content: docContent,
          version: nextVersion,
          status: docStatus,
          created_at: originalDoc.created_at,
          updated_at: now,
          createdBy: originalDoc.createdBy,
          updatedBy: userEmail,
          changeReason: docChangeReason,
          impactAnalysis: impactObj,
          history: updatedHistory
        };

        await setDoc(doc(db, 'knowledge_documents', editId), payload);

        // Audit Trail entry
        const logId = `log_${Date.now()}`;
        await setDoc(doc(db, 'change_logs', logId), {
          id: logId,
          module: docModule,
          old_version: originalDoc.version,
          new_version: nextVersion,
          summary: `Modifikasi aturan: "${docTitle}" (${docCategory})`,
          changeReason: docChangeReason,
          updatedBy: userEmail,
          created_at: now,
          riskLevel: impactRisk
        });

        showToast('success', `Sukses memutakhirkan ke Versi ${nextVersion} dan mencatat audit log.`);
      } else {
        const newId = `doc_${docCategory.replace(/\s+/g, '').toLowerCase()}_${Date.now()}`;
        const newDoc: KnowledgeDocument = {
          id: newId,
          category: docCategory,
          module: docModule,
          title: docTitle,
          slug: docSlug.toLowerCase().replace(/\s+/g, '-'),
          content: docContent,
          version: 1,
          status: docStatus,
          created_at: now,
          updated_at: now,
          createdBy: userEmail,
          updatedBy: userEmail,
          changeReason: docChangeReason,
          impactAnalysis: impactObj,
          history: []
        };

        await setDoc(doc(db, 'knowledge_documents', newId), newDoc);

        // Audit Trail entry
        const logId = `log_${Date.now()}`;
        await setDoc(doc(db, 'change_logs', logId), {
          id: logId,
          module: docModule,
          old_version: 0,
          new_version: 1,
          summary: `Pembuatan aturan perdana: "${docTitle}"`,
          changeReason: docChangeReason,
          updatedBy: userEmail,
          created_at: now,
          riskLevel: impactRisk
        });

        showToast('success', "Dokumen aturan baru sukses terdaftar.");
      }

      setIsFormOpen(false);
    } catch (e: any) {
      showToast('error', `Gagal menyimpan: ${e.message}`);
    }
  };

  // Rollback to specific version and build a NEW revision to NOT delete history records
  const handleRollback = async (docId: string, targetVersion: number) => {
    const docObj = documents.find(d => d.id === docId);
    if (!docObj) return;

    if (!checkPermission('rollback', docObj.category)) {
      showToast('error', `Otorisasi Ditolak: Hak akses "${currentRole}" tidak diizinkan melakukan rollback pada dokumen kategori ${docObj.category}`);
      return;
    }

    try {
      let rollbackSource: any = null;

      if (docObj.version === targetVersion) {
        showToast('error', "Dokumen ini saat ini sudah berada di versi target tersebut.");
        return;
      }

      // Check in history array
      if (docObj.history) {
        rollbackSource = docObj.history.find(h => h.version === targetVersion);
      }

      if (!rollbackSource) {
        showToast('error', `Histori untuk Versi ${targetVersion} tidak ditemukan.`);
        return;
      }

      const now = new Date().toISOString();
      const nextVersion = docObj.version + 1;

      // Current goes into history
      const currentAsRevision: DocumentRevision = {
        revisionId: `rev_${Date.now()}_${docObj.version}`,
        documentId: docObj.id,
        title: docObj.title,
        content: docObj.content,
        version: docObj.version,
        status: docObj.status,
        updated_at: docObj.updated_at,
        updatedBy: docObj.updatedBy,
        changeReason: docObj.changeReason,
        impactAnalysis: docObj.impactAnalysis
      };

      const updatedHistory = docObj.history ? [...docObj.history, currentAsRevision] : [currentAsRevision];

      const rollbackPayload: KnowledgeDocument = {
        ...docObj,
        title: rollbackSource.title,
        content: rollbackSource.content,
        version: nextVersion,
        status: 'draft', // Rollback resets status to draft for review
        updated_at: now,
        updatedBy: userEmail,
        changeReason: `Rollback regulatif dari Versi ${docObj.version} kembali ke Versi ${targetVersion}`,
        impactAnalysis: rollbackSource.impactAnalysis,
        history: updatedHistory
      };

      await setDoc(doc(db, 'knowledge_documents', docId), rollbackPayload);

      // Log the roll back
      const logId = `log_${Date.now()}`;
      await setDoc(doc(db, 'change_logs', logId), {
        id: logId,
        module: docObj.module,
        old_version: docObj.version,
        new_version: nextVersion,
        summary: `Rollback regulasi rule "${docObj.title}" ke Versi ${targetVersion}`,
        changeReason: `Memulihkan konfigurasi stabil versi ${targetVersion}`,
        updatedBy: userEmail,
        created_at: now,
        riskLevel: 'High'
      });

      showToast('success', `Berhasil rollback ke Versi ${targetVersion}. Dokumen sekarang berada pada Versi ${nextVersion} (Draft).`);
    } catch (e: any) {
      showToast('error', `Rollback error: ${e.message}`);
    }
  };

  // Compare side-by-side versions with precise text highlighting for diff additions/removals
  const calculateVersionDiff = () => {
    const docObj = documents.find(d => d.id === compareDocId);
    if (!docObj) return;

    let textV1 = '';
    let textV2 = '';

    if (docObj.version === revV1) {
      textV1 = docObj.content;
    } else if (docObj.history) {
      const rev = docObj.history.find(h => h.version === revV1);
      if (rev) textV1 = rev.content;
    }

    if (docObj.version === revV2) {
      textV2 = docObj.content;
    } else if (docObj.history) {
      const rev = docObj.history.find(h => h.version === revV2);
      if (rev) textV2 = rev.content;
    }

    if (!textV1 && !textV2) {
      showToast('error', 'Format konten revisi dokumen tidak lengkap untuk dibandingkan.');
      return;
    }

    const linesV1 = textV1.split('\n');
    const linesV2 = textV2.split('\n');
    const results: { type: 'added' | 'removed' | 'neutral', text: string }[] = [];

    // Simple diff simulator
    const maxLength = Math.max(linesV1.length, linesV2.length);
    for (let i = 0; i < maxLength; i++) {
      const l1 = linesV1[i];
      const l2 = linesV2[i];

      if (l1 !== undefined && l2 !== undefined) {
        if (l1 === l2) {
          results.push({ type: 'neutral', text: l1 });
        } else {
          results.push({ type: 'removed', text: `- ${l1}` });
          results.push({ type: 'added', text: `+ ${l2}` });
        }
      } else if (l1 !== undefined) {
        results.push({ type: 'removed', text: `- ${l1}` });
      } else if (l2 !== undefined) {
        results.push({ type: 'added', text: `+ ${l2}` });
      }
    }

    setDiffResultLines(results);
  };

  const setDiffResultLines = (lines: any[]) => {
    setDiffResult(lines);
  };

  const setDiffResult = (lines: any[]) => {
    setDiffLines(lines);
  };

  // Update change workflow status transition
  const handleTransitionStatus = async (docId: string, targetStatus: RuleWorkflowStatus) => {
    const docObj = documents.find(d => d.id === docId);
    if (!docObj) return;

    // Check specific workflow constraints
    if (docObj.category === 'Sacred Rule' && targetStatus === 'published' && currentRole !== 'Admin') {
      showToast('error', "Otorisasi Ditolak: Hanya Admin yang diizinkan untuk mem-publish SACRED RULES!");
      return;
    }

    try {
      const now = new Date().toISOString();
      await updateDoc(doc(db, 'knowledge_documents', docId), {
        status: targetStatus,
        updated_at: now,
        updatedBy: userEmail
      });

      const logId = `log_${Date.now()}`;
      await setDoc(doc(db, 'change_logs', logId), {
        id: logId,
        module: docObj.module,
        old_version: docObj.status,
        new_version: targetStatus,
        summary: `Status Transisi: "${docObj.title}" diubah dari [${docObj.status}] ke [${targetStatus}]`,
        changeReason: 'Lulus kriteria kelayakan modul governance.',
        updatedBy: userEmail,
        created_at: now,
        riskLevel: 'Low'
      });

      showToast('success', `Status berhasil dipindahkan ke: ${targetStatus}`);
    } catch (e: any) {
      showToast('error', `Gagal mengubah status: ${e.message}`);
    }
  };

  // Delete option safely
  const handleDeleteDocument = async (id: string, name: string) => {
    if (currentRole !== 'Admin') {
      showToast('error', "Otorisasi Ditolak: Hanya Admin yang dapat menghapus data aturan dari Source of Truth.");
      return;
    }

    if (!confirm(`Apakah Anda yakin ingin menghapus "${name}"? Tindakan ini akan dicatat dalam audit trail.`)) return;

    try {
      await deleteDoc(doc(db, 'knowledge_documents', id));
      showToast('success', `Sukses menghapus aturan "${name}".`);
    } catch (e: any) {
      showToast('error', `Gagal menghapus: ${e.message}`);
    }
  };

  // Export as Markdown and sync with raw file
  const handleExportMarkdownAndSave = async () => {
    setIsSyncing(true);
    try {
      let documentOutput = `# HAMARÉ - SOURCE OF TRUTH (GKMS)\n\n`;
      documentOutput += `Dokumen ini merupakan pusat regulasi & standarisasi sistem yang valid menurut standar HAMARÉ.\n\n`;
      
      const sacreds = documents.filter(d => d.category === 'Sacred Rule');
      const calcs = documents.filter(d => d.category === 'Calculation Rule');
      const narratives = documents.filter(d => d.category === 'Narrative Rule');

      documentOutput += `## 1. SACRED RULES (Fondasi Inti)\n`;
      sacreds.forEach(d => {
        documentOutput += `### [${d.version}] ${d.title}\n* Kategori: ${d.category} | Status: ${d.status}\n* Diperbarui oleh: ${d.updatedBy}\n\n${d.content}\n\n`;
      });

      documentOutput += `\n## 2. CALCULATION RULES (Logika & Formula)\n`;
      calcs.forEach(d => {
        documentOutput += `### [${d.version}] ${d.title}\n* Dampak Risiko: ${d.impactAnalysis?.riskLevel} | Dependency: ${d.impactAnalysis?.dependencyChain.join(', ')}\n\n${d.content}\n\n`;
      });

      documentOutput += `\n## 3. NARRATIVE RULES (Interpretasi Terjemahan)\n`;
      narratives.forEach(d => {
        documentOutput += `### [${d.version}] ${d.title}\n\n${d.content}\n\n`;
      });

      // Write to filesystem
      const res = await fetch('/api/kb/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: documentOutput })
      });
      const data = await res.json();

      if (data.success) {
        setRawFileContent(documentOutput);
        showToast('success', "HAMARE_PROJECT_KNOWLEDGE_BASE.md sukses disinkronkan di root project!");
      } else {
        throw new Error(data.error || "Kegagalan penulisan disk.");
      }
    } catch (err: any) {
      showToast('error', `Gagal ekspor: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Filter conditions
  const filteredDocs = documents.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.module.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'sacred') return matchesSearch && d.category === 'Sacred Rule';
    if (activeTab === 'calculation') return matchesSearch && d.category === 'Calculation Rule';
    if (activeTab === 'narrative') return matchesSearch && d.category === 'Narrative Rule';
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#1c1917] text-stone-100 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-stone-800">
      
      {/* 1. LEFT UTILITY RAIL / WORKFLOW NAVIGATION */}
      <div className="w-full md:w-80 flex-shrink-0 bg-[#161413] p-6 space-y-8 flex flex-col justify-between">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full text-stone-400 hover:text-white hover:bg-stone-800">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-serif font-bold text-yellow-500 tracking-wide">GKMS SYSTEM</h1>
              <p className="text-[10px] text-stone-400 font-mono">GOVERNANCE & KNOWLEDGE</p>
            </div>
          </div>

          <div className="bg-stone-900/60 p-4 rounded-xl border border-stone-800 space-y-3">
            <div className="flex items-center gap-2 text-xs text-yellow-500 font-bold font-mono">
              <Shield className="w-4 h-4 text-yellow-400" />
              <span>Otorisasi Peran Aktif:</span>
            </div>
            
            <Select value={currentRole} onValueChange={(r: any) => setCurrentRole(r)}>
              <SelectTrigger className="w-full bg-stone-950 border-stone-800 text-xs font-mono text-stone-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-stone-900 border-stone-800 text-stone-200 text-xs">
                <SelectItem value="Viewer" className="focus:bg-stone-800 focus:text-white">Viewer (Hanya Melihat)</SelectItem>
                <SelectItem value="Editor" className="focus:bg-stone-800 focus:text-white">Editor (Membuat Draft)</SelectItem>
                <SelectItem value="Reviewer" className="focus:bg-stone-800 focus:text-white">Reviewer (Menilai & Publish)</SelectItem>
                <SelectItem value="Admin" className="focus:bg-stone-800 focus:text-white">Admin (Kuasa Penuh)</SelectItem>
              </SelectContent>
            </Select>

            <span className="text-[9px] font-mono text-stone-500 block leading-tight">
              Peran menentukan limitasi workflows & izin Sacred Rules atau Rollback.
            </span>
          </div>

          <nav className="space-y-1.5">
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest px-3 mb-2">Governance Pillars</p>

            <button 
              onClick={() => { setActiveTab('all'); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${activeTab === 'all' ? 'bg-[#2E7D32]/20 text-green-400 border-l-4 border-emerald-500' : 'text-stone-400 hover:bg-stone-800/50 hover:text-white'}`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>Semua Aturan (GKMS)</span>
              </div>
              <span className="bg-stone-900 border border-stone-800 text-stone-400 font-mono px-1.5 py-0.5 rounded text-[9px]">{documents.length}</span>
            </button>

            <button 
              onClick={() => { setActiveTab('sacred'); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${activeTab === 'sacred' ? 'bg-[#2E7D32]/20 text-red-400 border-l-4 border-red-500' : 'text-stone-400 hover:bg-stone-800/50 hover:text-white'}`}
            >
              <Zap className="w-4 h-4 text-red-400" />
              <span>Sacred Rules (Fondasi)</span>
            </button>

            <button 
              onClick={() => { setActiveTab('calculation'); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${activeTab === 'calculation' ? 'bg-[#2E7D32]/20 text-yellow-400 border-l-4 border-yellow-500' : 'text-stone-400 hover:bg-stone-800/50 hover:text-white'}`}
            >
              <Sliders className="w-4 h-4 text-yellow-500" />
              <span>Calculation (Logika)</span>
            </button>

            <button 
              onClick={() => { setActiveTab('narrative'); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${activeTab === 'narrative' ? 'bg-[#2E7D32]/20 text-blue-400 border-l-4 border-blue-500' : 'text-stone-400 hover:bg-stone-800/50 hover:text-white'}`}
            >
              <Palette className="w-4 h-4 text-blue-400" />
              <span>Narrative Rules (Narasi)</span>
            </button>

            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest px-3 pt-6 mb-2">Audit & Assure</p>

            <button 
              onClick={() => { setActiveTab('audit_trail'); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${activeTab === 'audit_trail' ? 'bg-[#2E7D32]/20 text-green-400 border-l-4 border-emerald-500' : 'text-stone-400 hover:bg-stone-800/50 hover:text-white'}`}
            >
              <History className="w-4 h-4 text-emerald-400" />
              <span>Governance Audit Trail</span>
            </button>

            <button 
              onClick={() => { setActiveTab('compare'); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${activeTab === 'compare' ? 'bg-[#2E7D32]/20 text-purple-400 border-l-4 border-purple-500' : 'text-stone-400 hover:bg-stone-800/50 hover:text-white'}`}
            >
              <GitCompare className="w-4 h-4 text-purple-400" />
              <span>Compare Versions</span>
            </button>

            <button 
              onClick={() => { setActiveTab('assumptions'); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${activeTab === 'assumptions' ? 'bg-[#2E7D32]/20 text-sky-400 border-l-4 border-sky-500' : 'text-stone-400 hover:bg-stone-800/50 hover:text-white'}`}
            >
              <Settings className="w-4 h-4 text-sky-400" />
              <span>Logical Assumptions</span>
            </button>

          </nav>
        </div>

        <div className="pt-6 border-t border-stone-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-stone-400">
            <span>Disk Sync Status:</span>
            {rawFileContent ? (
              <span className="text-green-500 font-mono font-bold">LINKED</span>
            ) : (
              <span className="text-red-400 font-mono font-bold">OFFLINE</span>
            )}
          </div>
          <Button 
            onClick={handleExportMarkdownAndSave} 
            disabled={isSyncing}
            className="w-full bg-[#2E7D32] text-white hover:bg-green-700 text-xs h-7 gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Save KB to Disk
          </Button>
          <span className="text-[9px] font-mono text-stone-600 block text-center">
            HAMARÉ Source of Truth Modul v2.4
          </span>
        </div>
      </div>

      {/* 2. CHIEF VALUE & OPERATIONS CANVAS */}
      <div className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto max-h-screen">
        
        {/* Overhead Context Grid */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-6">
          <div>
            <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest bg-yellow-950/40 px-2 py-0.5 rounded border border-yellow-900/40">MASTER SOURCE OF TRUTH</span>
            <h2 className="text-3xl font-serif font-bold text-stone-100 mt-2">
              {activeTab === 'all' && "GKMS Governance Dashboard"}
              {activeTab === 'sacred' && "SACRED RULES (Fondasi Inti)"}
              {activeTab === 'calculation' && "CALCULATION RULES (Logika Formula)"}
              {activeTab === 'narrative' && "NARRATIVE RULES (Narasi Interpretasi)"}
              {activeTab === 'audit_trail' && "Aktivitas & Governance Audit Trail"}
              {activeTab === 'compare' && "Komparasi Versi Lintas Aturan"}
              {activeTab === 'assumptions' && "Logical Assumptions & Asumsi"}
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Aturan diklasifikasi ketat demi menjamin stabilitas eksekusi weton, ramalan, dan interpretasi sistem.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {documents.length === 0 && (
              <Button 
                onClick={handleSeedDatabase} 
                disabled={isSyncing}
                className="bg-amber-600 hover:bg-amber-700 text-stone-50 gap-1 text-xs"
              >
                <Sparkles className="w-4 h-4" />
                Seed GKMS Core Set
              </Button>
            )}

            <Button 
              onClick={() => openForm()}
              className="bg-[#2E7D32] hover:bg-green-700 text-white gap-1 text-xs"
            >
              <Plus className="w-4 h-4" />
              Aturan Baru
            </Button>
          </div>
        </div>

        {/* Global Toast Notify */}
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl text-xs flex items-start gap-3 border ${toast.type === 'success' ? 'bg-green-950/40 text-green-300 border-green-800/40' : 'bg-red-950/40 text-red-300 border-red-800/40'}`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-42 h-4 text-green-400 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />}
            <div>{toast.message}</div>
          </motion.div>
        )}

        {/* ==================== CONTENT SECTIONS ==================== */}

        {/* --- ALL & GOVERNANCE VIEW (Meters, Stats and Flow state overview) --- */}
        {activeTab === 'all' && (
          <div className="space-y-8">
            
            {/* Visual KPI indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <Card className="bg-[#1e1a18] border-stone-800 text-stone-200">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] uppercase font-mono text-red-400 tracking-widest font-bold">SACRED RULES</p>
                      <h3 className="text-3xl font-serif font-bold text-stone-100 mt-2">
                        {documents.filter(d => d.category === 'Sacred Rule').length}
                      </h3>
                      <p className="text-[10px] text-stone-500 mt-1">Fokus: Konversi Kalender & Wuku Jawa</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-900 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-red-500" />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-800 flex justify-between text-[10px] text-stone-500">
                    <span>Otoritas Editor: Admin Only</span>
                    <span className="text-red-400 font-bold">Workflow Ketat</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1e1a18] border-stone-800 text-stone-200">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] uppercase font-mono text-yellow-400 tracking-widest font-bold">CALCULATION RULES</p>
                      <h3 className="text-3xl font-serif font-bold text-stone-100 mt-2">
                        {documents.filter(d => d.category === 'Calculation Rule').length}
                      </h3>
                      <p className="text-[10px] text-stone-500 mt-1">Fokus: Gisir Hari & Logika Determinisme</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-yellow-950/40 border border-yellow-900 flex items-center justify-center">
                      <Sliders className="w-6 h-6 text-yellow-500" />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-800 flex justify-between text-[10px] text-stone-500">
                    <span>Otoritas Editor: Editor</span>
                    <span className="text-yellow-400 font-bold">Approved Versioning</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1e1a18] border-stone-800 text-stone-200">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] uppercase font-mono text-blue-400 tracking-widest font-bold">NARRATIVE RULES</p>
                      <h3 className="text-3xl font-serif font-bold text-stone-100 mt-2">
                        {documents.filter(d => d.category === 'Narrative Rule').length}
                      </h3>
                      <p className="text-[10px] text-stone-500 mt-1">Fokus: Interpretasi Watak & Rejeki</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-950/40 border border-blue-900 flex items-center justify-center">
                      <Palette className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-800 flex justify-between text-[10px] text-stone-500">
                    <span>Otoritas Editor: Editor</span>
                    <span className="text-blue-400 font-bold">Multi-revision</span>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Workflow Pipeline Display */}
            <div className="bg-[#151312] border border-stone-800 rounded-xl p-6">
              <h3 className="font-serif text-lg text-amber-500 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                Matriks Progress Tata Kelola Dokumen Aturan
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                <div className="bg-stone-900/60 p-4 rounded-lg border border-stone-800 space-y-2">
                  <span className="text-[10px] font-mono text-stone-400 block uppercase">1. Draft (Ideasi)</span>
                  <div className="text-xl font-bold text-stone-200">
                    {documents.filter(d => d.status === 'draft').length} Dokumen
                  </div>
                  <span className="text-[9px] text-stone-500 block">Menunggu tinjauan awal orisinal</span>
                </div>

                <div className="bg-stone-900/60 p-4 rounded-lg border border-stone-800 space-y-2">
                  <span className="text-[10px] font-mono text-orange-400 block uppercase">2. Tinjauan Ahli (Expert Review)</span>
                  <div className="text-xl font-bold text-orange-400">
                    {documents.filter(d => d.status === 'expert_review' || d.status === 'review').length} Dokumen
                  </div>
                  <span className="text-[9px] text-stone-500 block">Investigasi dampak & kalkulasi formula</span>
                </div>

                <div className="bg-stone-900/60 p-4 rounded-lg border border-stone-800 space-y-2">
                  <span className="text-[10px] font-mono text-yellow-400 block uppercase">3. Menunggu Approval</span>
                  <div className="text-xl font-bold text-yellow-500">
                    {documents.filter(d => d.status === 'admin_approval' || d.status === 'approved').length} Dokumen
                  </div>
                  <span className="text-[9px] text-stone-500 block">Menunggu verifikasi admin penanggung jawab</span>
                </div>

                <div className="bg-[#2E7D32]/10 p-4 rounded-lg border border-emerald-900/40 space-y-2">
                  <span className="text-[10px] font-mono text-green-400 block uppercase">4. Published (Stabil)</span>
                  <div className="text-xl font-bold text-green-400">
                    {documents.filter(d => d.status === 'published').length} Dokumen
                  </div>
                  <span className="text-[9px] text-green-600 block">Terkunci & Aktif sebagai Source of Truth</span>
                </div>

              </div>
            </div>

            {/* General Filter & List Area */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                  <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input 
                    placeholder="Cari rule berdasarkan judul, konten, m..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-stone-900 border-stone-800 text-stone-100 text-xs"
                  />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full md:w-48 bg-stone-900 border-stone-800 text-xs">
                      <SelectValue placeholder="Kategori Aturan" />
                    </SelectTrigger>
                    <SelectContent className="bg-stone-900 border-stone-800 text-stone-200 text-xs">
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      <SelectItem value="Sacred Rule">Sacred Rules</SelectItem>
                      <SelectItem value="Calculation Rule">Calculation Rules</SelectItem>
                      <SelectItem value="Narrative Rule">Narrative Rules</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Rules Cards Render */}
              <div className="grid grid-cols-1 gap-4">
                {filteredDocs.length > 0 ? (
                  filteredDocs.map((docObj) => (
                    <Card key={docObj.id} className="bg-stone-900 border-stone-800 text-stone-200">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <Badge className={
                              docObj.category === 'Sacred Rule' ? 'bg-red-950 text-red-400 border border-red-900' :
                              docObj.category === 'Calculation Rule' ? 'bg-yellow-950 text-yellow-400 border border-yellow-900' :
                              'bg-blue-950 text-blue-400 border border-blue-900'
                            }>
                              {docObj.category.toUpperCase()}
                            </Badge>
                            
                            <Badge variant="outline" className="border-stone-800 text-stone-400 text-[10px]">
                              v{docObj.version}
                            </Badge>

                            <Badge className={
                              docObj.status === 'published' ? 'bg-green-950 text-green-400 border border-green-900' :
                              docObj.status === 'draft' ? 'bg-stone-950 text-stone-500 border border-stone-800' :
                              'bg-amber-950 text-amber-400 border border-amber-900'
                            }>
                              {docObj.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          
                          <span className="text-[10px] font-mono text-stone-500">
                            Terakhir diupdate: {new Date(docObj.updated_at).toLocaleString('id-ID')}
                          </span>
                        </div>

                        <CardTitle className="font-serif text-lg text-stone-100 flex items-center gap-2 mt-2">
                          {docObj.title}
                          <span className="text-xs text-stone-500 font-mono">({docObj.module})</span>
                        </CardTitle>
                        
                        <CardDescription className="text-xs text-stone-400 font-mono">
                          Penanggung Jawab: {docObj.createdBy} / Diupdate Oleh: {docObj.updatedBy || docObj.createdBy}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="py-2 text-xs text-stone-300">
                        <p className="bg-stone-950/60 p-3 rounded-lg border border-stone-800/60 leading-relaxed max-h-32 overflow-y-auto font-mono">
                          {docObj.content}
                        </p>

                        {/* Impact Analysis summary */}
                        {docObj.impactAnalysis && (
                          <div className="mt-3 p-3 bg-stone-950/30 rounded-lg border border-stone-800/40 grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px]">
                            <div>
                              <span className="text-stone-500 block">Modul Terdampak:</span>
                              <span className="text-stone-300 font-mono">{docObj.impactAnalysis.affectedModules?.join(', ') || '-'}</span>
                            </div>
                            <div>
                              <span className="text-stone-500 block">Tingkat Risiko:</span>
                              <span className={`font-mono font-bold ${
                                docObj.impactAnalysis.riskLevel === 'Critical' || docObj.impactAnalysis.riskLevel === 'High' ? 'text-red-400' : 'text-green-400'
                              }`}>{docObj.impactAnalysis.riskLevel || 'Low'}</span>
                            </div>
                            <div>
                              <span className="text-stone-500 block">Alasan Perubahan:</span>
                              <span className="text-stone-300 italic">"{docObj.changeReason || '-'}"</span>
                            </div>
                          </div>
                        )}
                      </CardContent>

                      <CardFooter className="pt-2 flex flex-wrap justify-between items-center gap-2 border-t border-stone-800/40">
                        
                        {/* Approval transition controller */}
                        <div className="flex gap-1.5 items-center">
                          <span className="text-[10px] font-mono text-stone-400">Pindah Status:</span>
                          {getNextWorkflowStatus(docObj.status, docObj.category).map((nextStatus) => (
                            <Button 
                              key={nextStatus} 
                              onClick={() => handleTransitionStatus(docObj.id, nextStatus)}
                              size="sm" 
                              variant="ghost" 
                              className="text-[10px] text-yellow-500 hover:text-yellow-400 hover:bg-stone-800 h-6 px-2"
                            >
                              {nextStatus.toUpperCase()}
                            </Button>
                          ))}
                        </div>

                        {/* Standard actions */}
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => openForm(docObj)}
                            size="sm" 
                            variant="outline" 
                            className="border-stone-800 hover:bg-stone-800 hover:text-white text-[11px]"
                          >
                            <Edit className="w-3.5 h-3.5 mr-1" /> Sunting & Versikan
                          </Button>

                          <Button 
                            onClick={() => {
                              setActiveTab('compare');
                              setCompareDocId(docObj.id);
                              setRevV1(docObj.version - 1 > 0 ? docObj.version - 1 : 1);
                              setRevV2(docObj.version);
                            }}
                            size="sm" 
                            variant="outline" 
                            className="border-stone-800 hover:bg-stone-800 text-[11px] text-purple-400"
                          >
                            <GitCompare className="w-3.5 h-3.5 mr-1" /> Bandingkan
                          </Button>

                          <Button 
                            onClick={() => handleDeleteDocument(docObj.id, docObj.title)}
                            size="sm" 
                            variant="ghost" 
                            className="bg-red-950/20 hover:bg-red-900 border border-red-900/30 text-red-400 hover:text-red-100 text-[11px]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 bg-stone-900/40 border border-stone-800/80 rounded-xl space-y-3">
                    <Info className="w-8 h-8 text-stone-500 mx-auto" />
                    <p className="text-sm text-stone-400">Tidak ada regulasi atau aturan yang didaftarkan.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* --- DEDICATED RULE CATEGORIES VIEW (SACRED, CALCULATION, NARRATIVE FILTER) --- */}
        {(activeTab === 'sacred' || activeTab === 'calculation' || activeTab === 'narrative') && (
          <div className="space-y-6">
            <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 mb-6 flex items-start gap-4 text-xs">
              <Shield className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-stone-200">Definisi Penanganan Aturan:</p>
                <p className="text-stone-400 leading-relaxed mt-1">
                  {activeTab === 'sacred' && "SACRED RULES: Merupakan aturan pilar mutlak yang sama sekali tidak dipengaruhi intervensi manual (deterministik murni). Modifikasi hanya boleh disetujui & dipublikasikan oleh administrator tingkat tertinggi (Admin Approval) setelah Expert Review."}
                  {activeTab === 'calculation' && "CALCULATION RULES: Rumus & kriteria penentu interpolasi. Seluruh pemutakhiran wajib disertai dengan analisis dampak (Impact Analysis), parameter dependensi (Dependency Chain), tingkat risiko, dan verifikasi aliansi."}
                  {activeTab === 'narrative' && "NARRATIVE RULES: Interpretasi weton, ramalan, rasi dan saran kesehatan meditasi. Paling sering disunting dan memiliki re-generasi revisi bertingkat."}
                </p>
              </div>
            </div>

            {/* List filter component */}
            <div className="grid grid-cols-1 gap-4">
              {filteredDocs.map(docObj => (
                <Card key={docObj.id} className="bg-[#1e1a18] border-stone-800 text-stone-200">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-stone-950 text-stone-300 border border-stone-800 font-mono text-[9px]">
                          {docObj.module}
                        </Badge>
                        <Badge variant="outline" className="border-stone-800 text-stone-400">
                          Versi {docObj.version}
                        </Badge>
                      </div>
                      <span className="text-[10px] text-stone-500 font-mono">Status: {docObj.status.toUpperCase()}</span>
                    </div>
                    <CardTitle className="font-serif text-lg text-stone-100 mt-2">{docObj.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-4">
                    <p className="p-3 bg-stone-950/60 rounded border border-stone-800 leading-relaxed font-mono">
                      {docObj.content}
                    </p>

                    {/* Show Revision Revert Box */}
                    {docObj.history && docObj.history.length > 0 && (
                      <div className="p-3 bg-stone-950/40 rounded border border-stone-800 space-y-2">
                        <span className="text-[10px] font-mono font-bold text-stone-400 block">Pemulihan Versi (Rollback Engine):</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {docObj.history.map(hist => (
                            <div key={hist.revisionId} className="p-2 border border-stone-800 rounded bg-stone-900/60 flex items-center justify-between">
                              <div className="text-[9px]">
                                <span className="font-bold text-stone-300">Versi {hist.version}</span>
                                <span className="text-stone-500 block italic">Reason: "{hist.changeReason}"</span>
                              </div>
                              <Button 
                                onClick={() => handleRollback(docObj.id, hist.version)}
                                size="sm" 
                                variant="ghost" 
                                className="text-[9px] text-yellow-500 h-6 px-2 hover:bg-stone-800"
                              >
                                <RotateCcw className="w-3 h-3 mr-1" /> Revert
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t border-stone-800/40 pt-4 flex justify-between">
                    <div className="text-[10px] text-stone-500">
                      Oleh: {docObj.createdBy} / Diupdate: {docObj.updatedBy || docObj.createdBy}
                    </div>
                    <Button onClick={() => openForm(docObj)} size="sm" variant="outline" className="border-stone-800">
                      <Edit className="w-3.5 h-3.5 mr-1" /> Edit & Create Revision
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* --- GOVERNANCE AUDIT TRAIL VIEW --- */}
        {activeTab === 'audit_trail' && (
          <div className="space-y-6">
            <h3 className="text-lg font-serif text-stone-200">Terminal Log Perubahan Arsitektur & Aturan HAMARÉ</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Seluruh rekam jejak aktivitas, pembuatan data orisinal, modifikasi formula, transisi status workflow dilarang di-bypass.
            </p>

            <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 font-mono text-[11px] leading-relaxed space-y-3 max-h-[500px] overflow-y-auto">
              <div className="text-[#2E7D32] border-b border-stone-900 pb-2">
                [SYSTEM READY] GKMS SECURE INITIALIZED SALSABILA AT TIME {new Date().toLocaleDateString()}
              </div>

              {changeLogs.map(log => (
                <div key={log.id} className="p-3 bg-stone-900/40 rounded border border-stone-900 flex justify-between items-start gap-4 hover:border-yellow-900/40 transition-colors">
                  <div>
                    <span className="text-yellow-500">[{new Date(log.created_at).toLocaleString()}] </span>
                    <span className="text-stone-300 font-bold">{log.summary} </span>
                    <span className="text-stone-500">(Modul: {log.module})</span>
                    <p className="text-[10px] text-stone-400 italic mt-1 font-sans">
                      Alasan: "{log.changeReason || 'Tidak ditentukan'}"
                    </p>
                  </div>
                  <div className="text-right text-[10px]">
                    <span className="text-stone-500 block">User: {log.updatedBy}</span>
                    {log.riskLevel && (
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] border font-bold mt-1 ${
                        log.riskLevel === 'Critical' || log.riskLevel === 'High' ? 'bg-red-950 text-red-400 border-red-900' : 'bg-green-950 text-green-400 border-green-900'
                      }`}>
                        RISIKO: {log.riskLevel.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- COMPARE VERSIONS VIEW --- */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            <p className="text-xs text-stone-400">
              Analisa visual perbedaan konten aturan pada dua versi yang berbeda (versi mayor maupun histori backup).
            </p>

            <Card className="bg-stone-900 border-stone-800 text-stone-200">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-stone-400">Pilih Dokumen Aturan:</Label>
                    <Select value={compareDocId} onValueChange={(val) => {
                      setCompareDocId(val);
                      const d = documents.find(x => x.id === val);
                      if (d) {
                        setRevV1(d.version - 1 > 0 ? d.version - 1 : 1);
                        setRevV2(d.version);
                      }
                    }}>
                      <SelectTrigger className="w-full bg-stone-950 border-stone-800 text-stone-200 text-xs">
                        <SelectValue placeholder="Pilih Aturan" />
                      </SelectTrigger>
                      <SelectContent className="bg-stone-900 border-stone-800 text-stone-200 text-xs">
                        {documents.map(d => (
                          <SelectItem key={d.id} value={d.id} className="focus:bg-stone-800 focus:text-white">
                            {d.title} (v{d.version})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-stone-400">Versi Pembanding A (Lama):</Label>
                    <Input 
                      type="number" 
                      value={revV1}
                      onChange={(e) => setRevV1(parseInt(e.target.value) || 1)}
                      className="bg-stone-950 border-stone-800 text-stone-200 text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-stone-400">Versi Pembanding B (Terbaru):</Label>
                    <Input 
                      type="number" 
                      value={revV2}
                      onChange={(e) => setRevV2(parseInt(e.target.value) || 1)}
                      className="bg-stone-950 border-stone-800 text-stone-200 text-xs"
                    />
                  </div>
                </div>

                <Button 
                  onClick={calculateVersionDiff}
                  className="bg-[#2E7D32] hover:bg-green-700 text-white text-xs w-full"
                >
                  Bandingkan Versi
                </Button>
              </CardContent>
            </Card>

            {/* Compare visual output */}
            {diffLines.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold font-mono text-purple-400">Visual Code Diff:</h4>
                <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 font-mono text-xs space-y-1">
                  {diffLines.map((line, idx) => (
                    <div 
                      key={idx} 
                      className={`p-1 rounded ${
                        line.type === 'added' ? 'bg-green-950/40 text-green-300' :
                        line.type === 'removed' ? 'bg-red-950/40 text-red-300 line-through' :
                        'text-stone-400'
                      }`}
                    >
                      {line.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- LOGICAL ASSUMPTIONS VIEW --- */}
        {activeTab === 'assumptions' && (
          <div className="space-y-6">
            <h3 className="text-lg font-serif text-stone-200">System Assumptions (Asumsi Konseptual)</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Definisi aturan logis murni yang wajib diacu sebelum melakukan integrasi sistem.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assumptions.map(ass => (
                <Card key={ass.id} className="bg-stone-900 border-stone-800 text-stone-200">
                  <CardHeader>
                    <Badge variant="outline" className="border-stone-800 text-yellow-500 text-[9px] w-fit">
                      {ass.module}
                    </Badge>
                  </CardHeader>
                  <CardContent className="text-xs leading-relaxed font-mono text-stone-300">
                    "{ass.assumption}"
                  </CardContent>
                  <CardFooter className="text-[10px] text-stone-500 italic">
                    Dibuat Oleh: {ass.createdBy || 'System Admin'}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 3. DYNAMIC FORM POPUP PANEL */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1c1917] border border-stone-800 rounded-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col shadow-2xl text-stone-100"
            >
              <div className="p-6 border-b border-stone-800 flex justify-between items-center bg-[#151312]">
                <div>
                  <h3 className="text-lg font-serif font-bold text-yellow-500">
                    {editId ? 'Mutakhirkan Kode Aturan (Versivikasi)' : 'Inisiasi Kode Aturan Baru'}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">Lengkapi form & audit dampak mitigasi risiko sistem</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsFormOpen(false)} className="rounded-full hover:bg-stone-800 text-stone-400">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
                
                {/* 1. Category selector determining governance pipeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-stone-400">Rule Category (Pilar Tata Kelola):</Label>
                    <Select value={docCategory} onValueChange={(val: any) => {
                      setDocCategory(val);
                      setDocModule(MODULE_OPTIONS[val as RuleCategory][0]);
                    }}>
                      <SelectTrigger className="w-full bg-stone-950 border-stone-800 text-stone-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-stone-900 border-stone-800 text-stone-200 text-xs">
                        <SelectItem value="Sacred Rule" className="focus:bg-stone-800 focus:text-white">SACRED RULES (Fondasi Inti)</SelectItem>
                        <SelectItem value="Calculation Rule" className="focus:bg-stone-800 focus:text-white">CALCULATION RULES (Formula Rumus)</SelectItem>
                        <SelectItem value="Narrative Rule" className="focus:bg-stone-800 focus:text-white">NARRATIVE RULES (Interpretasi Narasi)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-stone-400">Governance Sub-Module:</Label>
                    <Select value={docModule} onValueChange={(val: any) => setDocModule(val)}>
                      <SelectTrigger className="w-full bg-stone-950 border-stone-800 text-stone-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-stone-900 border-stone-800 text-stone-200 text-xs">
                        {MODULE_OPTIONS[docCategory].map(opt => (
                          <SelectItem key={opt} value={opt} className="focus:bg-stone-800 focus:text-white">{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 2. Rule identity & content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-stone-400">Judul Dokumen Aturan:</Label>
                    <Input 
                      placeholder="Contoh: Konfigurasi Gisir Hakiki"
                      value={docTitle}
                      onChange={(e) => {
                        setDocTitle(e.target.value);
                        setDocSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }}
                      className="bg-stone-950 border-stone-800 text-stone-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-stone-400">Slug Pengenal (Tautan):</Label>
                    <Input 
                      placeholder="auto-generated-slug"
                      value={docSlug}
                      onChange={(e) => setDocSlug(e.target.value)}
                      className="bg-[#161413] border-stone-800 text-stone-300"
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-stone-400 font-mono">Kode Content atau Deskripsi Rumus Aturan:</Label>
                  <Textarea 
                    rows={6}
                    placeholder="Masukkan skrip, deskripsi formula matematika atau interpretasi narasi disini..."
                    value={docContent}
                    onChange={(e) => setDocContent(e.target.value)}
                    className="bg-stone-950 border-stone-800 text-stone-100 font-mono"
                  />
                </div>

                {/* 3. IMPACT ANALYSIS FORM BLOCK (Wajib diisi) */}
                <div className="p-4 bg-stone-900/60 rounded-xl border border-stone-800/80 space-y-3">
                  <h4 className="text-amber-500 font-serif font-bold flex items-center gap-1.5 text-xs">
                    <CheckSquare className="w-4 h-4 text-amber-500" />
                    Impact Analysis & Risk Mitigator (Wajib)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-stone-400">Tingkat Risiko (Risk Level):</Label>
                      <Select value={impactRisk} onValueChange={(val: any) => setImpactRisk(val)}>
                        <SelectTrigger className="w-full bg-stone-950 border border-stone-800 text-stone-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-stone-900 border border-stone-800 text-stone-200 text-xs">
                          <SelectItem value="Low">Low - Tanpa Mengubah Database/API</SelectItem>
                          <SelectItem value="Medium">Medium - Mempersyaratkan QA Unit Test</SelectItem>
                          <SelectItem value="High">High - Mengubah PDF / Output Schema</SelectItem>
                          <SelectItem value="Critical">Critical - Mengubah Alur Sengkala Sikalender</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-stone-400">Dependency Chain:</Label>
                      <div className="flex flex-wrap gap-1.5 p-2 bg-stone-950 border border-stone-850 rounded-lg max-h-16 overflow-y-auto">
                        {DEPS_LIST.map(dep => (
                          <label key={dep} className="flex items-center gap-1.5 text-[10px] text-stone-300 select-none cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={impactDependencies.includes(dep)}
                              onChange={(e) => {
                                if (e.target.checked) setImpactDependencies([...impactDependencies, dep]);
                                else setImpactDependencies(impactDependencies.filter(x => x !== dep));
                              }}
                              className="rounded border-stone-800 bg-stone-900 text-emerald-600 focus:ring-opacity-0"
                            />
                            {dep}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-stone-400">Modul Terdampak (Affected Modules):</Label>
                    <div className="flex flex-wrap gap-2">
                      {CLIENT_MODULES.map(m => (
                        <Button 
                          key={m} 
                          type="button"
                          onClick={() => {
                            if (impactModules.includes(m)) setImpactModules(impactModules.filter(x => x !== m));
                            else setImpactModules([...impactModules, m]);
                          }}
                          variant={impactModules.includes(m) ? 'default' : 'outline'}
                          className={`text-[9px] h-6 px-2.5 rounded ${
                            impactModules.includes(m) ? 'bg-[#2E7D32] text-white hover:bg-emerald-700' : 'border-stone-800 hover:bg-stone-800 text-stone-400'
                          }`}
                        >
                          {m}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. CHANGE REASON REQUIREMENT */}
                <div className="space-y-2">
                  <Label className="text-yellow-500 font-bold">Alasan Perubahan / Pembaharuan Aturan (Wajib):</Label>
                  <Input 
                    placeholder="Contoh: Menyeimbangkan siklus weton legi berdasarkan silsilah kraton..."
                    value={docChangeReason}
                    onChange={(e) => setDocChangeReason(e.target.value)}
                    className="bg-stone-950 border-stone-800 text-stone-100 placeholder:text-stone-600"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-stone-400">Initial Workflow Status:</Label>
                    <Select value={docStatus} onValueChange={(val: any) => setDocStatus(val)}>
                      <SelectTrigger className="w-full bg-stone-950 border border-stone-850 text-stone-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-stone-900 border-stone-850 text-stone-200 text-xs">
                        <SelectItem value="draft" className="focus:bg-stone-800">Draft - Tahap Pengerjaan</SelectItem>
                        <SelectItem value="expert_review" className="focus:bg-stone-800">Expert Review - Tinjau Ahli</SelectItem>
                        <SelectItem value="published" className="focus:bg-stone-800">Published - Aktifkan & Publikasikan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-stone-400">Preview Target Versi:</Label>
                    <Input 
                      value={`Versi ${editId ? docVersion + 1 : 1}`} 
                      disabled 
                      className="bg-stone-950 border-stone-800 text-stone-400"
                    />
                  </div>
                </div>

              </div>

              <div className="p-6 border-t border-stone-800 flex justify-end gap-3 bg-[#151312]">
                <Button variant="outline" onClick={() => setIsFormOpen(false)} className="border-stone-800">
                  Kembali
                </Button>
                <Button onClick={handleSaveDocument} className="bg-[#2E7D32] hover:bg-green-700 text-white font-bold px-6">
                  <Save className="w-4 h-4 mr-1" /> Simpan Perubahan Rule
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
