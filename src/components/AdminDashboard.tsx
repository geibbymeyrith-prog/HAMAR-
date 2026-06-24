import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  getDoc,
  serverTimestamp,
  where,
  addDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { useAuth } from '../lib/AuthContext';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { KbmsDashboard } from './KbmsDashboard';
// Logo imports removed
import { 
  Check, 
  X, 
  Clock, 
  ExternalLink, 
  MessageCircle, 
  ArrowLeft,
  Calendar,
  User,
  Package as PackageIcon,
  Search,
  Filter,
  Plus,
  FileText,
  Save,
  Send,
  Trash,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react';

interface Payment {
  id: string;
  userId: string;
  name: string;
  email: string;
  whatsapp: string;
  package: string;
  packageName: string;
  uniqueAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

interface Article {
  id: string;
  title: string;
  author: string;
  content: string;
  contentHtml: string;
  visibility: 'public' | 'member';
  status: 'draft' | 'published';
  createdAt: any;
}

import { 
  JAVA_MONTHS,
  PM_ORDERED,
  getJavaDate,
  getPMDate,
  getPasaran,
  getNagadina,
  getDewaHarian,
  getWuku,
  getPadewan,
  getPadangon,
  getSifatHari,
  getNeptu,
  getSTValue,
  checkIs40,
  getJavaneseMonthName,
  getJavaneseYearDetails
} from '../lib/calendar-utils';

export const AdminDashboard: React.FC<{ 
  onBack: () => void;
  visitorStats?: {
    totalVisitorsAllTime: number;
    totalVisitorsCurrentMonth: number;
    returningVisitorsAllTime: number;
    returningVisitorsCurrentMonth: number;
  };
}> = ({ onBack, visitorStats }) => {
  const { isAdmin } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<'payments' | 'blog' | 'calendar' | 'kbms' | 'payment_monitoring'>('payments');

  // Payment Verification Monitoring States
  const [monitoringPayments, setMonitoringPayments] = useState<any[]>([]);
  const [monitoringTransactions, setMonitoringTransactions] = useState<any[]>([]);
  const [monitoringUsers, setMonitoringUsers] = useState<any[]>([]);
  const [monitoringWebhookLogs, setMonitoringWebhookLogs] = useState<any[]>([]);
  const [monitoringLoading, setMonitoringLoading] = useState(true);
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [monitoringSearchTerm, setMonitoringSearchTerm] = useState('');
  const [webhookLogSearchTerm, setWebhookLogSearchTerm] = useState('');
  const [expandedWebhookLogId, setExpandedWebhookLogId] = useState<string | null>(null);
  const [monitoringSubTab, setMonitoringSubTab] = useState<'overview' | 'payments' | 'users' | 'transactions' | 'webhook_logs'>('overview');
  const [showUnmappedWebhooksOnly, setShowUnmappedWebhooksOnly] = useState<boolean>(false);
  
  // Calendar state
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    const element = calendarRef.current;
    if (!element) {
      alert("Elemen kalender tidak ditemukan.");
      return;
    }
    
    setLoading(true);
    const originalId = element.getAttribute('id');
    const tempId = "report-container-pdf";
    element.setAttribute('id', tempId);

    const originalGetComputedStyle = window.getComputedStyle;

    const linkTags = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];
    const originalLinkStates: { link: HTMLLinkElement; disabled: boolean }[] = [];
    const tempStyles: HTMLStyleElement[] = [];

    const liveStyleTags = Array.from(document.querySelectorAll('style:not(.temp-pdf-sanitized-style)')) as HTMLStyleElement[];
    const originalStylesContents = new Map<HTMLStyleElement, string>();

    // Redefine document.styleSheets temporarily
    const originalStyleSheetsDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'styleSheets');

    try {
      // Color translation helpers inside download code block to prevent pollution
      const parseOklchLocal = (str: string) => {
        const regex = /oklch\s*\(\s*([\d.]+\%?)\s+([\d.]+)\s+([\d.]+(?:deg|rad)?)\s*(?:\/\s*([\d.]+\%?))?\s*\)/i;
        const commaRegex = /oklch\s*\(\s*([\d.]+\%?)\s*,\s*([\d.]+)\s*,\s*([\d.]+(?:deg|rad)?)\s*(?:,\s*([\d.]+\%?))?\s*\)/i;
        const match = str.match(regex) || str.match(commaRegex);
        if (!match) return null;
        const L_str = match[1];
        const C_str = match[2];
        const H_str = match[3];
        const A_str = match[4] || "1";
        const L = L_str.endsWith('%') ? parseFloat(L_str) / 100 : parseFloat(L_str);
        const C = parseFloat(C_str);
        let H = parseFloat(H_str);
        if (H_str.endsWith('rad')) H = H * (180 / Math.PI);
        const A = A_str.endsWith('%') ? parseFloat(A_str) / 100 : parseFloat(A_str);
        const theta = H * (Math.PI / 180);
        const a_ok = C * Math.cos(theta);
        const b_ok = C * Math.sin(theta);
        const l_ = L + 0.3963377774 * a_ok + 0.2158037573 * b_ok;
        const m_ = L - 0.1055613458 * a_ok - 0.0638541728 * b_ok;
        const s_ = L - 0.0894841775 * a_ok - 1.2914855480 * b_ok;
        const l = Math.pow(Math.max(0, l_), 3);
        const m = Math.pow(Math.max(0, m_), 3);
        const s = Math.pow(Math.max(0, s_), 3);
        const r_linear = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
        const g_linear = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
        const b_linear = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
        const f = (u: number) => u <= 0.0031308 ? 12.92 * u : 1.055 * Math.pow(u, 1 / 2.4) - 0.055;
        const r = Math.min(255, Math.max(0, Math.round(f(r_linear) * 255)));
        const g = Math.min(255, Math.max(0, Math.round(f(g_linear) * 255)));
        const b = Math.min(255, Math.max(0, Math.round(f(b_linear) * 255)));
        return { r, g, b, a: A };
      };

      const parseOklabLocal = (str: string) => {
        const regex = /oklab\s*\(\s*([\d.]+\%?)\s+([+-]?[\d.]+)\s+([+-]?[\d.]+)\s*(?:\/\s*([\d.]+\%?))?\s*\)/i;
        const commaRegex = /oklab\s*\(\s*([\d.]+\%?)\s*,\s*([+-]?[\d.]+)\s*,\s*([+-]?[\d.]+)\s*(?:,\s*([\d.]+\%?))?\s*\)/i;
        const match = str.match(regex) || str.match(commaRegex);
        if (!match) return null;
        const L_str = match[1];
        const a_str = match[2];
        const b_str = match[3];
        const A_str = match[4] || "1";
        const L = L_str.endsWith('%') ? parseFloat(L_str) / 100 : parseFloat(L_str);
        const a_ok = parseFloat(a_str);
        const b_ok = parseFloat(b_str);
        const A = A_str.endsWith('%') ? parseFloat(A_str) / 100 : parseFloat(A_str);
        const l_ = L + 0.3963377774 * a_ok + 0.2158037573 * b_ok;
        const m_ = L - 0.1055613458 * a_ok - 0.0638541728 * b_ok;
        const s_ = L - 0.0894841775 * a_ok - 1.2914855480 * b_ok;
        const l = Math.pow(Math.max(0, l_), 3);
        const m = Math.pow(Math.max(0, m_), 3);
        const s = Math.pow(Math.max(0, s_), 3);
        const r_linear = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
        const g_linear = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
        const b_linear = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
        const f = (u: number) => u <= 0.0031308 ? 12.92 * u : 1.055 * Math.pow(u, 1 / 2.4) - 0.055;
        const r = Math.min(255, Math.max(0, Math.round(f(r_linear) * 255)));
        const g = Math.min(255, Math.max(0, Math.round(f(g_linear) * 255)));
        const b = Math.min(255, Math.max(0, Math.round(f(b_linear) * 255)));
        return { r, g, b, a: A };
      };

      const cleanModernColorsStr = (str: string): string => {
        if (!str) return str;
        let res = str;
        
        // List of targets to process
        const targets = ['oklch(', 'oklab(', 'OKLCH(', 'OKLAB('];
        
        for (const target of targets) {
          let idx = res.indexOf(target);
          while (idx !== -1) {
            // Find matching closing parenthesis by tracking bracket depth
            let depth = 1;
            let i = idx + target.length;
            while (i < res.length && depth > 0) {
              if (res[i] === '(') {
                depth++;
              } else if (res[i] === ')') {
                depth--;
              }
              i++;
            }
            
            if (depth === 0) {
              const fullMatch = res.substring(idx, i);
              let replacement = 'rgba(41, 37, 36, 1)'; // general dark stone-950 fallback
              
              let parsedColor = null;
              try {
                // Only parse if it does not contain nested function blocks like var() or calc()
                if (!fullMatch.includes('var(') && !fullMatch.includes('calc(')) {
                  if (target.toLowerCase().startsWith('oklch')) {
                    parsedColor = parseOklchLocal(fullMatch);
                  } else {
                    parsedColor = parseOklabLocal(fullMatch);
                  }
                }
              } catch (e) {
                // Ignore parse exception, rely on smart fallback
              }
              
              if (parsedColor) {
                replacement = `rgba(${parsedColor.r}, ${parsedColor.g}, ${parsedColor.b}, ${parsedColor.a})`;
              } else {
                // High-fidelity smart color mappings for beautiful layouts
                const numRegex = /[\d.]+/g;
                const numbers = fullMatch.match(numRegex);
                if (numbers && numbers.length >= 1) {
                  const L = parseFloat(numbers[0]);
                  const C = numbers[1] ? parseFloat(numbers[1]) : 0;
                  const H = numbers[2] ? parseFloat(numbers[2]) : 0;
                  
                  if (L >= 0.90) {
                    replacement = 'rgba(245, 245, 240, 1)'; // beautiful light cream
                  } else if (L <= 0.25) {
                    replacement = 'rgba(28, 25, 23, 1)'; // dark stone
                  } else if (H >= 110 && H <= 165) {
                    // Javanese Primbon green shades
                    replacement = L > 0.6 ? 'rgba(74, 163, 80, 1)' : 'rgba(46, 125, 50, 1)';
                  } else if (H >= 340 || H <= 45) {
                    // Majestic warning / gold or warm accent tones
                    replacement = L > 0.65 ? 'rgba(251, 192, 45, 1)' : 'rgba(180, 83, 9, 1)';
                  } else {
                    // Grayscaled neutrals
                    if (L > 0.7) {
                      replacement = 'rgba(244, 244, 245, 1)';
                    } else if (L > 0.4) {
                      replacement = 'rgba(120, 113, 108, 1)';
                    } else {
                      replacement = 'rgba(41, 37, 36, 1)';
                    }
                  }
                }
              }
              
              res = res.substring(0, idx) + replacement + res.substring(i);
              idx = res.indexOf(target, idx + replacement.length);
            } else {
              // If unmatched parentheses, do replacement of word to guarantee no infinite loops
              res = res.substring(0, idx) + 'rgba(41, 37, 36, 1)' + res.substring(idx + target.length);
              idx = res.indexOf(target, idx);
            }
          }
        }
        
        return res;
      };

      const patchWindowStyle = (w: any) => {
        try {
          const orig = w.getComputedStyle;
          if (!orig) return;
          w.getComputedStyle = function(el: any, pseudo: any) {
            const style = orig.call(w, el, pseudo);
            return new Proxy(style, {
              get(targetStyle, prop) {
                const val = (targetStyle as any)[prop];
                if (typeof val === 'string' && (val.includes('oklch') || val.includes('oklab') || val.includes('OKLCH') || val.includes('OKLAB'))) {
                  return cleanModernColorsStr(val);
                }
                if (typeof val === 'function') {
                  if (prop === 'getPropertyValue') {
                    return function(propertyName: string) {
                      const originalVal = targetStyle.getPropertyValue(propertyName);
                      if (typeof originalVal === 'string' && (originalVal.includes('oklch') || originalVal.includes('oklab') || originalVal.includes('OKLCH') || originalVal.includes('OKLAB'))) {
                        return cleanModernColorsStr(originalVal);
                      }
                      return originalVal;
                    };
                  }
                  return val.bind(targetStyle);
                }
                return val;
              }
            });
          };
        } catch (patchErr) {
          console.error("Error patching window style", patchErr);
        }
      };

      patchWindowStyle(window);

      // Sanitize all live style tags in the head/body of the actual page temporarily to prevent html2canvas crashes
      for (const style of liveStyleTags) {
        if (style.innerHTML && (style.innerHTML.includes('oklch') || style.innerHTML.includes('oklab') || style.innerHTML.includes('OKLCH') || style.innerHTML.includes('OKLAB'))) {
          originalStylesContents.set(style, style.innerHTML);
          style.innerHTML = cleanModernColorsStr(style.innerHTML);
        }
      }

      // Capture and clean all in-memory CSS rules from the original stylesheets
      let aggregatedCSS = '';
      const originalSheets = Array.from(document.styleSheets);
      for (const sheet of originalSheets) {
        try {
          if (!sheet.disabled) {
            const rules = sheet.cssRules || sheet.rules;
            if (rules) {
              for (let i = 0; i < rules.length; i++) {
                aggregatedCSS += rules[i].cssText + '\n';
              }
            }
          }
        } catch (e) {
          // Cross-origin sheets error ignored
        }
      }

      // Create a major sanitized style element
      const sanitizedAggregatedCss = cleanModernColorsStr(aggregatedCSS);
      const mainSanitizedStyle = document.createElement('style');
      mainSanitizedStyle.className = 'temp-pdf-sanitized-style';
      mainSanitizedStyle.innerHTML = sanitizedAggregatedCss;
      document.head.appendChild(mainSanitizedStyle);
      tempStyles.push(mainSanitizedStyle);

      // Build the custom fake StyleSheetList
      const fakeSheetsList: CSSStyleSheet[] = [];
      if (mainSanitizedStyle.sheet) {
        fakeSheetsList.push(mainSanitizedStyle.sheet);
      }
      
      const fakeStyleSheetsList = Object.create(StyleSheetList.prototype);
      fakeSheetsList.forEach((sheet, idx) => {
        fakeStyleSheetsList[idx] = sheet;
      });
      Object.defineProperty(fakeStyleSheetsList, 'length', {
        get: () => fakeSheetsList.length,
        configurable: true
      });
      fakeStyleSheetsList.item = (index: number) => fakeSheetsList[index] || null;

      // Redefine document.styleSheets temporarily
      try {
        Object.defineProperty(document, 'styleSheets', {
          get: () => fakeStyleSheetsList,
          configurable: true
        });
      } catch (err) {
        console.error("Error setting custom document.styleSheets getter", err);
      }

      // Disable original stylesheet links to ensure fallback
      for (const link of linkTags) {
        try {
          if (link.href) {
            originalLinkStates.push({ link, disabled: link.disabled });
            link.disabled = true;
          }
        } catch (fetchErr) {
          console.error("Error disabling link tag:", link.href, fetchErr);
        }
      }

      // html2canvas capture logic with enhanced clarity and precise sizing settings
      let canvas;
      // Stage 1: html2canvas
      try {
        canvas = await html2canvas(element, {
          scale: 1.8, // Elegant, extremely stable high-resolution scale
          useCORS: true,
          allowTaint: false,
          logging: true,
          backgroundColor: '#ffffff',
          windowWidth: 2600, // Generous capture canvas viewport preventing unwanted wrap
          onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.getElementById(tempId);
            if (!clonedElement) {
              console.error("Cloned report container not found in onclone!");
              return;
            }

            if (clonedDoc.defaultView) {
              patchWindowStyle(clonedDoc.defaultView);
            }

            // Redefine clonedDoc.styleSheets getter
            try {
              Object.defineProperty(clonedDoc, 'styleSheets', {
                get: () => fakeStyleSheetsList,
                configurable: true
              });
            } catch (e) {
              console.error("Error setting custom clonedDoc.styleSheets getter", e);
            }

            // 1. Sanitize all style tags inside the cloned document as well
            try {
              const styleTags = clonedDoc.querySelectorAll('style');
              styleTags.forEach(style => {
                try {
                  if (style.innerHTML && (style.innerHTML.includes('oklch') || style.innerHTML.includes('oklab'))) {
                    const cleaned = cleanModernColorsStr(style.innerHTML);
                    if (cleaned !== style.innerHTML) {
                      style.innerHTML = cleaned;
                    }
                  }
                } catch (err) {}
              });
            } catch (e) {}

            // Sanitize oklch colors from styleSheets rules inside the cloned document
            try {
              const styleSheets = clonedDoc.styleSheets;
              for (let i = 0; i < styleSheets.length; i++) {
                try {
                  const sheet = styleSheets[i];
                  const rules = sheet.cssRules || sheet.rules;
                  if (rules) {
                    for (let j = 0; j < rules.length; j++) {
                      const rule = rules[j] as CSSStyleRule;
                      if (rule.style && rule.style.cssText) {
                        if (rule.style.cssText.includes('oklch') || rule.style.cssText.includes('oklab')) {
                          const cleaned = cleanModernColorsStr(rule.style.cssText);
                          if (cleaned !== rule.style.cssText) {
                            rule.style.cssText = cleaned;
                          }
                        }
                      }
                    }
                  }
                } catch (sheetErr) {
                  // Suppress cross-origin stylesheet errors
                }
              }
            } catch (e) {
              console.error("Error in stylesheet sanitization:", e);
            }

            // Translate all custom inline colors safely from oklch elements of the clone
            try {
              const allWebElements = clonedElement.getElementsByTagName("*");
              for (let i = 0; i < allWebElements.length; i++) {
                const el = allWebElements[i] as HTMLElement;
                try {
                  const styleAttr = el.getAttribute('style');
                  if (styleAttr && (styleAttr.includes('oklch') || styleAttr.includes('oklab'))) {
                    const clean = cleanModernColorsStr(styleAttr);
                    if (clean !== styleAttr) {
                      el.style.cssText = clean;
                    }
                  }
                } catch (elErr) {}
              }
            } catch (e) {}

            // 2. Format the print-only header elements correctly
            const printHeader = clonedElement.querySelector('.print-header-content');
            if (printHeader) {
              (printHeader as HTMLElement).style.display = 'block';
              (printHeader as HTMLElement).style.visibility = 'visible';
              (printHeader as HTMLElement).style.opacity = '1';
              (printHeader as HTMLElement).style.textAlign = 'center';
              (printHeader as HTMLElement).style.marginBottom = '40px';
              (printHeader as HTMLElement).style.width = '100%';
              (printHeader as HTMLElement).style.color = '#1c1917';
              (printHeader as HTMLElement).style.borderBottom = '2px solid #1c1917';
              (printHeader as HTMLElement).style.paddingBottom = '15px';
            }

            // 3. Remove/Hide bottom page selection buttons (pagination) entirely from PDF
            const paginationBlock = clonedElement.querySelector('.mt-8');
            if (paginationBlock) {
              (paginationBlock as HTMLElement).style.display = 'none';
            }

            // 4. Force a magnificent large sheet layout inside the clone for 100% column visibility
            clonedElement.style.width = '2400px'; 
            clonedElement.style.padding = '60px';
            clonedElement.style.height = 'auto';
            clonedElement.style.background = '#ffffff';

            const tableContainer = clonedElement.querySelector('.overflow-x-auto');
            if (tableContainer) {
              (tableContainer as HTMLElement).style.overflow = 'visible';
              (tableContainer as HTMLElement).style.width = '100%';
              (tableContainer as HTMLElement).style.maxWidth = 'none';
              (tableContainer as HTMLElement).style.border = 'none';
            }

            const table = clonedElement.querySelector('table');
            if (table) {
              (table as HTMLElement).style.width = '100%';
              (table as HTMLElement).style.tableLayout = 'auto'; // auto layout computes columns gracefully based on text sizes
              (table as HTMLElement).style.borderCollapse = 'collapse';
            }

            // Ensure pristine cells headers and alternate days colors are applied explicitly
            const tableRows = clonedElement.querySelectorAll('tr');
            tableRows.forEach(row => {
              const trElement = row as HTMLElement;
              const hasHeaders = trElement.querySelector('th') !== null;
              
              if (hasHeaders) {
                trElement.style.backgroundColor = '#1c1917';
                trElement.style.color = '#ffffff';
                const headers = trElement.querySelectorAll('th');
                headers.forEach(h => {
                  const headerCell = h as HTMLElement;
                  headerCell.style.backgroundColor = '#1c1917';
                  headerCell.style.color = '#ffffff';
                  headerCell.style.fontSize = '13px';
                  headerCell.style.fontWeight = 'bold';
                  headerCell.style.padding = '12px 6px';
                  headerCell.style.border = '1px solid #1c1917';
                  headerCell.style.textAlign = 'center';
                });
              } else {
                // Alternate row coloring (isThirdDay row) check
                const isThirdDay = trElement.classList.contains('bg-[#928f8e]');
                if (isThirdDay) {
                  trElement.style.backgroundColor = '#e4e4e7'; // Beautiful light zinc gray
                } else {
                  trElement.style.backgroundColor = '#ffffff';
                }

                const cells = trElement.querySelectorAll('td');
                cells.forEach(c => {
                  const cell = c as HTMLElement;
                  cell.style.fontSize = '12px';
                  cell.style.padding = '10px 8px';
                  cell.style.border = '1px solid #e4e4e7';
                  cell.style.whiteSpace = 'nowrap';
                  
                  // Keep text-red-600 colored Sundays clearly red
                  if (cell.classList.contains('text-red-600')) {
                    cell.style.color = '#dc2626';
                    cell.style.fontWeight = 'bold';
                  } else {
                    // Standard black table cells text color
                    cell.style.color = '#0c0a09';
                    cell.style.fontWeight = 'bold';
                  }

                  // Explicitly render Nagadina directions colored cells
                  if (cell.classList.contains('bg-black')) {
                    cell.style.backgroundColor = '#000000';
                    cell.style.color = '#ffffff';
                  } else if (cell.classList.contains('bg-yellow-300')) {
                    cell.style.backgroundColor = '#fde047';
                    cell.style.color = '#000000';
                  } else if (cell.classList.contains('bg-red-500')) {
                    cell.style.backgroundColor = '#fca5a5'; // Softer red highlight for clean printing
                    cell.style.color = '#7f1d1d';
                  }
                });
              }
            });
          }
        });
      } catch (error: any) {
        console.error("PDF Stage Failed:", {
          stage: "html2canvas",
          error,
          stack: error?.stack
        });
        throw error;
      }

      // Stage 2: generate HTML / image conversion
      let imgData;
      try {
        imgData = canvas.toDataURL('image/png', 1.0);
      } catch (error: any) {
        console.error("PDF Stage Failed:", {
          stage: "generate HTML",
          error,
          stack: error?.stack
        });
        throw error;
      }

      // Stage 3: create PDF
      let pdf;
      try {
        pdf = new jsPDF('l', 'mm', 'a2'); // landscape A2 provides massive resolution for professional printing
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        // Calculate scaling to fill the a2 page with elegant 15mm margins
        const margin = 15; 
        const availableWidth = pdfWidth - (margin * 2);
        const availableHeight = pdfHeight - (margin * 2);
        
        // scale parameter is 1.8
        const sourceWidth = imgWidth / 1.8;
        const sourceHeight = imgHeight / 1.8;
        
        const ratio = Math.min(availableWidth / sourceWidth, availableHeight / sourceHeight);
        const finalWidth = sourceWidth * ratio;
        const finalHeight = sourceHeight * ratio;
        
        const x = (pdfWidth - finalWidth) / 2;
        const y = (pdfHeight - finalHeight) / 2;

        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
        
        const drawWatermark = (pObj: typeof pdf, w: number, h: number) => {
          try {
            // Professional subtle branded margins/corners
            pObj.setFont("Helvetica", "normal");
            pObj.setFontSize(18);
            pObj.setTextColor(180, 185, 178);
            pObj.text("HAMARÉ BRANDING - DATABASE CALENDAR EXPORT", 25, h - 20);
            pObj.text(`Halaman ${pObj.getNumberOfPages()}`, w - 40, h - 20);
          } catch (err) {
            console.error("Watermark drawing error:", err);
          }
        };
        
        drawWatermark(pdf, pdfWidth, pdfHeight);
      } catch (error: any) {
        console.error("PDF Stage Failed:", {
          stage: "create PDF",
          error,
          stack: error?.stack
        });
        throw error;
      }

      // Stage 4: save PDF
      try {
        const filename = `HAMARE-Database_Calendar-${getJavaneseMonthName(calendarMonth)}-${calendarYear}.pdf`;
        pdf.save(filename);
      } catch (error: any) {
        console.error("PDF Stage Failed:", {
          stage: "save PDF",
          error,
          stack: error?.stack
        });
        throw error;
      }
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert(`Gagal mengunduh PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      // Restore window.getComputedStyle
      if (originalGetComputedStyle) {
        window.getComputedStyle = originalGetComputedStyle;
      }

      // Restore document.styleSheets
      if (originalStyleSheetsDescriptor) {
        try {
          Object.defineProperty(document, 'styleSheets', originalStyleSheetsDescriptor);
        } catch (restoreErr) {
          console.error("Error restoring document.styleSheets descriptor in AdminDashboard:", restoreErr);
        }
      } else {
        try {
          delete (document as any).styleSheets;
        } catch (restoreErr) {
          console.error("Error deleting custom document.styleSheets in AdminDashboard:", restoreErr);
        }
      }

      // Restore live style original contents
      for (const [style, originalContent] of originalStylesContents.entries()) {
        try {
          style.innerHTML = originalContent;
        } catch (restoreErr) {
          console.error("Error restoring live style in AdminDashboard:", restoreErr);
        }
      }

      // Restore CSS link states and remove temp stylesheet styles
      for (const state of originalLinkStates) {
        state.link.disabled = state.disabled;
      }
      for (const style of tempStyles) {
        style.remove();
      }
      if (element) {
        if (originalId) {
          element.setAttribute('id', originalId);
        } else {
          element.removeAttribute('id');
        }
      }
      setLoading(false);
    }
  };

  // Blog form state
  const [isCreating, setIsCreating] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleAuthor, setArticleAuthor] = useState('Geibby Meyrith');
  const [articleContent, setArticleContent] = useState('');
  const [articleVisibility, setArticleVisibility] = useState<'public' | 'member'>('member');

  useEffect(() => {
    if (!isAdmin) return;

    if (activeView === 'payments') {
      let q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
      if (filter === 'pending') {
        q = query(collection(db, 'payments'), where('status', '==', 'pending'), orderBy('createdAt', 'desc'));
      }
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setPayments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Payment[]);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setArticles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Article[]);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [isAdmin, filter, activeView]);

  useEffect(() => {
    if (!isAdmin || activeView !== 'payment_monitoring') return;

    setMonitoringLoading(true);

    // Listens to payments
    const paymentsQ = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
    const unsubscribePayments = onSnapshot(paymentsQ, (snapshot) => {
      setMonitoringPayments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Listens to transactions
    const transactionsQ = query(collection(db, 'transactions'), orderBy('receivedAt', 'desc'));
    const unsubscribeTransactions = onSnapshot(transactionsQ, (snapshot) => {
      setMonitoringTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Listens to users
    const usersQ = query(collection(db, 'users'), orderBy('email', 'asc'));
    const unsubscribeUsers = onSnapshot(usersQ, (snapshot) => {
      setMonitoringUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Listens to webhook_logs
    const webhookLogsQ = query(collection(db, 'webhook_logs'), orderBy('receivedAt', 'desc'));
    const unsubscribeWebhookLogs = onSnapshot(webhookLogsQ, (snapshot) => {
      setMonitoringWebhookLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setMonitoringLoading(false);
    });

    return () => {
      unsubscribePayments();
      unsubscribeTransactions();
      unsubscribeUsers();
      unsubscribeWebhookLogs();
    };
  }, [isAdmin, activeView]);

  const handleApprove = async (payment: Payment) => {
    try {
      const paymentRef = doc(db, 'payments', payment.id);
      const userRef = doc(db, 'users', payment.userId);
      await updateDoc(paymentRef, { status: 'approved', updatedAt: serverTimestamp() });
      const now = new Date();
      if (payment.package === '11000' || payment.package === '15000') {
        await updateDoc(userRef, { temporaryUnlock: true });
      } else if (payment.package === '111000' || payment.package === '150000') {
        const expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        await updateDoc(userRef, { subscriptionStatus: 'monthly', premiumExpiredAt: expiry, temporaryUnlock: false });
      } else if (payment.package === '1111000' || payment.package === '1150000') {
        const expiry = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
        await updateDoc(userRef, { subscriptionStatus: 'yearly', premiumExpiredAt: expiry, temporaryUnlock: false });
      }
      alert(`Pembayaran ${payment.name} berhasil disetujui!`);
    } catch (error) {
      console.error("Error approving payment:", error);
      alert("Gagal menyetujui pembayaran.");
    }
  };

  const handleReject = async (paymentId: string) => {
    if (!confirm("Yakin ingin menolak pembayaran ini?")) return;
    try {
      await updateDoc(doc(db, 'payments', paymentId), { status: 'rejected', updatedAt: serverTimestamp() });
    } catch (error) {
      console.error("Error rejecting payment:", error);
      alert("Gagal menolak pembayaran.");
    }
  };

  const handleSaveArticle = async (status: 'draft' | 'published') => {
    if (!articleTitle || !articleContent) {
      alert("Judul dan isi artikel wajib diisi!");
      return;
    }
    if (articleContent.length > 10000) {
      alert("Artikel maksimal 10000 karakter!");
      return;
    }

    try {
      const data = {
        title: articleTitle,
        author: articleAuthor,
        content: articleContent,
        contentHtml: articleContent, // Simple for now, could be enhanced
        visibility: articleVisibility,
        status,
        createdAt: editingArticle ? editingArticle.createdAt : serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      if (editingArticle) {
        await updateDoc(doc(db, 'articles', editingArticle.id), data);
      } else {
        await addDoc(collection(db, 'articles'), data);
      }

      setIsCreating(false);
      setEditingArticle(null);
      setArticleTitle('');
      setArticleContent('');
      alert(status === 'draft' ? "Artikel disimpan sebagai draft." : "Artikel berhasil dipublish!");
    } catch (error) {
      console.error("Error saving article:", error);
      alert("Gagal menyimpan artikel.");
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Yakin ingin menghapus artikel ini?")) return;
    try {
      await deleteDoc(doc(db, 'articles', id));
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Gagal menghapus artikel.");
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <X className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold">Akses Ditolak</h1>
        <p className="text-stone-500">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        <Button onClick={onBack} className="mt-6">Kembali</Button>
      </div>
    );
  }

  if (activeView === 'kbms') {
    return <KbmsDashboard onBack={() => setActiveView('payments')} />;
  }

  return (
    <div className={cn(
      "mx-auto p-4 md:p-8 space-y-8 transition-all duration-300",
      activeView === 'calendar' || activeView === 'payment_monitoring' ? "max-w-[1400px]" : "max-w-6xl"
    )}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900">Admin Dashboard</h1>
            <p className="text-sm text-stone-500">Kelola pembayaran dan konten blog</p>
          </div>
        </div>
        
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="bg-stone-100 p-1 rounded-lg">
          <TabsList className="bg-transparent flex flex-wrap gap-1">
            <TabsTrigger value="payments" className="data-[state=active]:bg-white shadow-none text-xs">Pembayaran</TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:bg-white shadow-none text-xs">Konten Blog</TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-white shadow-none text-xs">Database Calendar</TabsTrigger>
            <TabsTrigger value="payment_monitoring" className="data-[state=active]:bg-stone-900 data-[state=active]:text-white shadow-none text-stone-700 font-bold text-xs">PAYMENT MONITORING</TabsTrigger>
            <TabsTrigger value="kbms" className="data-[state=active]:bg-stone-900 data-[state=active]:text-white shadow-none text-stone-700 font-bold text-xs">KNOWLEDGE BASE (KBMS)</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {visitorStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-stone-50 border border-stone-200/80 p-4 rounded-2xl shadow-sm">
          <div className="p-4 bg-white rounded-xl border border-stone-100 shadow-sm">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Visitor Bulan Ini</p>
            <h4 className="text-2xl font-serif font-bold text-[#2E7D32]">{visitorStats.totalVisitorsCurrentMonth.toLocaleString('id-ID')}</h4>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-100 shadow-sm">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Total Visitor</p>
            <h4 className="text-2xl font-serif font-bold text-stone-900">{visitorStats.totalVisitorsAllTime.toLocaleString('id-ID')}</h4>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-100 shadow-sm">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Visitor Berulang Bulan Ini</p>
            <h4 className="text-2xl font-serif font-bold text-amber-600">{visitorStats.returningVisitorsCurrentMonth.toLocaleString('id-ID')}</h4>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-100 shadow-sm">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Total Visitor Berulang</p>
            <h4 className="text-2xl font-serif font-bold text-stone-700">{visitorStats.returningVisitorsAllTime.toLocaleString('id-ID')}</h4>
          </div>
        </div>
      )}

      <Separator />

      {activeView === 'payment_monitoring' ? (
        <div className="space-y-6 pb-20 font-sans">
          {/* Header & Sub-Tabs */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-900">PAYMENT MONITORING</h2>
              <p className="text-xs text-stone-500">Dasbor verifikasi pembayaran realtime, penelusuran transaksi, dan technical webhook logs.</p>
            </div>
            
            <div className="flex bg-stone-100 p-1 rounded-lg flex-wrap gap-1">
              <Button size="sm" variant={monitoringSubTab === 'overview' ? 'default' : 'ghost'} onClick={() => setMonitoringSubTab('overview')}>Ringkasan & Metrik</Button>
              <Button size="sm" variant={monitoringSubTab === 'payments' ? 'default' : 'ghost'} onClick={() => setMonitoringSubTab('payments')}>Koleksi Payments</Button>
              <Button size="sm" variant={monitoringSubTab === 'users' ? 'default' : 'ghost'} onClick={() => setMonitoringSubTab('users')}>Status Premium User</Button>
              <Button size="sm" variant={monitoringSubTab === 'transactions' ? 'default' : 'ghost'} onClick={() => setMonitoringSubTab('transactions')}>Transactions Business</Button>
              <Button size="sm" variant={monitoringSubTab === 'webhook_logs' ? 'default' : 'ghost'} onClick={() => setMonitoringSubTab('webhook_logs')}>Webhook Technical Logs</Button>
            </div>
          </div>

          {monitoringLoading ? (
            <Card className="p-20 text-center flex flex-col justify-center items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-stone-900 border-t-transparent animate-spin" />
              <p className="text-sm font-medium text-stone-500 font-sans">Menghubungkan ke database realtime...</p>
            </Card>
          ) : (
            <>
              {/* 1. METRICS OVERVIEW PAGE */}
              {monitoringSubTab === 'overview' && (
                <div className="space-y-6 text-sans">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4">
                    {/* Card 1: Total Revenue */}
                    {(() => {
                      const totalRevenue = monitoringPayments
                        .filter(p => p.status === 'completed' || p.status === 'approved')
                        .reduce((sum, p) => sum + (Number(p.uniqueAmount) || 0), 0);
                      return (
                        <Card className="p-4 bg-white border border-stone-200/80 shadow-sm relative overflow-hidden">
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Total Pendapatan</p>
                          <h4 className="text-lg font-mono font-bold text-green-600">Rp {totalRevenue.toLocaleString('id-ID')}</h4>
                          <span className="absolute bottom-2 right-2 text-stone-100 font-serif text-3xl select-none pointer-events-none font-bold">Rp</span>
                        </Card>
                      );
                    })()}

                    {/* Card 2: Total Transactions */}
                    <Card className="p-4 bg-white border border-stone-200/80 shadow-sm">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1 font-sans">Total Transaksi</p>
                      <h4 className="text-xl font-mono font-bold text-stone-800">{monitoringTransactions.length}</h4>
                    </Card>

                    {/* Card 3: Pending Payments */}
                    {(() => {
                      const countPending = monitoringPayments.filter(p => p.status === 'pending').length;
                      return (
                        <Card className="p-4 bg-white border border-stone-200/80 shadow-sm relative overflow-hidden">
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Pending Payments</p>
                          <h4 className={cn("text-xl font-mono font-bold", countPending > 0 ? "text-amber-600" : "text-stone-500")}>
                            {countPending}
                          </h4>
                        </Card>
                      );
                    })()}

                    {/* Card 4: Active Monthly Subscribers */}
                    {(() => {
                      const countMonthly = monitoringUsers.filter(u => u.subscriptionStatus === 'monthly').length;
                      return (
                        <Card className="p-4 bg-white border border-stone-200/80 shadow-sm">
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Bulanan Aktif</p>
                          <h4 className="text-xl font-mono font-bold text-indigo-600">{countMonthly}</h4>
                        </Card>
                      );
                    })()}

                    {/* Card 5: Active Yearly Subscribers */}
                    {(() => {
                      const countYearly = monitoringUsers.filter(u => u.subscriptionStatus === 'yearly').length;
                      return (
                        <Card className="p-4 bg-white border border-stone-200/80 shadow-sm">
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Tahunan Aktif</p>
                          <h4 className="text-xl font-mono font-bold text-teal-600">{countYearly}</h4>
                        </Card>
                      );
                    })()}

                    {/* Card 6: Single Unlock Purchases */}
                    {(() => {
                      const countSingle = monitoringPayments.filter(p => p.package === '15000' && p.status === 'completed').length;
                      return (
                        <Card className="p-4 bg-white border border-stone-200/80 shadow-sm">
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Unlock Rp15K</p>
                          <h4 className="text-xl font-mono font-bold text-purple-600">{countSingle}</h4>
                        </Card>
                      );
                    })()}

                    {/* Card 7: Unmapped Payments */}
                    {(() => {
                      const countUnmapped = monitoringWebhookLogs.filter(log => log.processingResult === 'UNMAPPED_PAYMENT').length;
                      return (
                        <Card 
                          className={cn(
                            "p-4 bg-white border shadow-sm relative overflow-hidden cursor-pointer hover:border-red-300 transition-all",
                            countUnmapped > 0 ? "border-red-200 bg-red-50/10" : "border-stone-200"
                          )}
                          onClick={() => {
                            setMonitoringSubTab('webhook_logs');
                            setShowUnmappedWebhooksOnly(true);
                          }}
                        >
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Unmapped Payments</p>
                          <h4 className={cn("text-xl font-mono font-bold", countUnmapped > 0 ? "text-red-600 animate-pulse" : "text-stone-500")}>
                            {countUnmapped}
                          </h4>
                          {countUnmapped > 0 && (
                            <span className="absolute top-1 right-2 flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                          )}
                        </Card>
                      );
                    })()}
                  </div>

                  {/* Operational Status Panel */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
                    {/* Quick Diagnostic Checker */}
                    <Card className="p-6">
                      <CardTitle className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-4 flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500" /> STATUS SINKRONISASI REALTIME
                      </CardTitle>
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between p-2.5 bg-stone-50 rounded-lg border border-stone-100">
                          <span className="font-semibold text-stone-700">Lisensi Terdaftar di Users:</span>
                          <span className="font-mono">{monitoringUsers.length} profile</span>
                        </div>
                        <div className="flex justify-between p-2.5 bg-stone-50 rounded-lg border border-stone-100">
                          <span className="font-semibold text-stone-700">Audit Trace di Webhook Logs (Technical):</span>
                          <span className="font-mono">{monitoringWebhookLogs.length} events</span>
                        </div>
                        <div className="flex justify-between p-2.5 bg-stone-50 rounded-lg border border-stone-100">
                          <span className="font-semibold text-stone-700">Manual & Auto payments:</span>
                          <span className="font-mono">{monitoringPayments.length} traces</span>
                        </div>
                        <div className="flex justify-between p-2.5 bg-stone-50 rounded-lg border border-stone-100">
                          <span className="font-semibold text-stone-700">Rasio Unlocked Results:</span>
                          <span className="font-mono">
                            {monitoringUsers.filter(u => u.unlockedResults && u.unlockedResults.length > 0).length} users ({
                              monitoringUsers.reduce((sum, u) => sum + (u.unlockedResults ? u.unlockedResults.length : 0), 0)
                            } total unlocks)
                          </span>
                        </div>
                      </div>
                    </Card>

                    {/* Developer Sandbox Simulator */}
                    <Card className="p-6 flex flex-col justify-between">
                      <div>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-2">
                          MOCK WEBHOOK TRANSACTION SIMULATOR
                        </CardTitle>
                        <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                          Kunjungi atau trigger endpoint dari terminal Anda untuk mensimulasikan callback sukses Mayar. Anda juga dapat menggunakan manual approval pada tab "Koleksi Payments" jika pembeli melakukan transfer via ATM manual.
                        </p>
                      </div>
                      <div className="text-stone-600 text-xs bg-stone-50 p-4 rounded-xl border border-stone-200 font-mono space-y-1.5 overflow-auto">
                        <p className="font-bold text-stone-700">Payload template simulasi:</p>
                        <p className="text-[10px] text-stone-400">// POST ke /api/webhook/mayar</p>
                        <p className="text-[10px] text-stone-500 leading-relaxed max-w-[500px]">
                          &#123;<br />
                          &nbsp;&nbsp;&quot;payment_id&quot;: &quot;mock_pm_123&quot;,<br />
                          &nbsp;&nbsp;&quot;amount&quot;: 15000<br />
                          &#125;
                        </p>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* 2. PAYMENTS COLLECTION PANEL */}
              {monitoringSubTab === 'payments' && (
                <div className="space-y-4 font-sans">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Search & Filters */}
                    <div className="relative flex-1 max-w-md w-full">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <Input 
                        placeholder="Cari email, userId, ID..." 
                        className="pl-10 bg-white"
                        value={monitoringSearchTerm}
                        onChange={(e) => setMonitoringSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center gap-4 flex-wrap">
                      {/* Counter totals */}
                      <span className="text-xs font-semibold text-stone-500">
                        Total Pending: <b className="text-amber-600 font-bold font-mono">{monitoringPayments.filter(p => p.status === 'pending').length}</b> | 
                        Completed: <b className="text-green-600 font-bold font-mono">{monitoringPayments.filter(p => p.status === 'completed' || p.status === 'approved').length}</b>
                      </span>
                      
                      <div className="flex bg-stone-100 p-1 rounded-lg">
                        <Button size="sm" className="h-8 text-xs px-3" variant={paymentFilter === 'all' ? 'default' : 'ghost'} onClick={() => setPaymentFilter('all')}>Semua</Button>
                        <Button size="sm" className="h-8 text-xs px-3" variant={paymentFilter === 'pending' ? 'default' : 'ghost'} onClick={() => setPaymentFilter('pending')}>Pending</Button>
                        <Button size="sm" className="h-8 text-xs px-3" variant={paymentFilter === 'completed' ? 'default' : 'ghost'} onClick={() => setPaymentFilter('completed')}>Completed</Button>
                      </div>
                    </div>
                  </div>

                  {(() => {
                    const filtered = monitoringPayments.filter(p => {
                      const matchesSearch = 
                        (p.email || '').toLowerCase().includes(monitoringSearchTerm.toLowerCase()) ||
                        (p.name || '').toLowerCase().includes(monitoringSearchTerm.toLowerCase()) ||
                        (p.id || '').toLowerCase().includes(monitoringSearchTerm.toLowerCase()) ||
                        (p.userId || '').toLowerCase().includes(monitoringSearchTerm.toLowerCase());
                      
                      if (paymentFilter === 'all') return matchesSearch;
                      if (paymentFilter === 'pending') return matchesSearch && p.status === 'pending';
                      if (paymentFilter === 'completed') return matchesSearch && (p.status === 'completed' || p.status === 'approved');
                      return matchesSearch;
                    });

                    return (
                      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-stone-50 border-b border-stone-200 text-xs text-stone-500 font-semibold uppercase tracking-wider">
                              <th className="p-4">PaymentId / Doc ID</th>
                              <th className="p-4">User ID & Email</th>
                              <th className="p-4">Package</th>
                              <th className="p-4 text-right">Amount</th>
                              <th className="p-4">Status</th>
                              <th className="p-4">Created At / Paid At</th>
                              <th className="p-4 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100 text-sm">
                            {filtered.length === 0 ? (
                              <tr>
                                <td colSpan={7} className="p-10 text-center text-stone-400">
                                  Tidak ada data pembayaran yang sesuai kriteria.
                                </td>
                              </tr>
                            ) : (
                              filtered.map(p => (
                                <tr key={p.id} className="hover:bg-stone-50">
                                  <td className="p-4 font-mono text-xs font-bold text-stone-700 truncate max-w-[200px]" title={p.id}>
                                    <div className="font-semibold text-stone-900">{p.mayarPaymentId || 'N/A'}</div>
                                    <div className="text-[10px] text-stone-400">DocID: {p.id}</div>
                                  </td>
                                  <td className="p-4 text-xs">
                                    <div className="font-bold text-stone-800">{p.name || 'N/A'}</div>
                                    <div className="text-[11px] text-stone-500">{p.email || 'N/A'}</div>
                                    <div className="text-[10px] text-stone-400 font-mono">UID: {p.userId}</div>
                                  </td>
                                  <td className="p-4 text-xs font-medium text-stone-600">
                                    <Badge variant="outline" className="text-[11px] font-sans">
                                      {p.package || 'N/A'}
                                    </Badge>
                                    <div className="text-[10px] text-stone-400 mt-0.5">{p.packageName || 'Premium Package'}</div>
                                  </td>
                                  <td className="p-4 text-right font-mono font-bold text-stone-900 text-xs">
                                    Rp {(p.uniqueAmount || 0).toLocaleString('id-ID')}
                                  </td>
                                  <td className="p-4">
                                    <Badge className={cn(
                                      "text-[10px] font-bold font-sans",
                                      p.status === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-200' : 
                                      p.status === 'completed' || p.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800'
                                    )} variant="outline">
                                      {p.status.toUpperCase()}
                                    </Badge>
                                  </td>
                                  <td className="p-4 text-[11px] text-stone-500 whitespace-nowrap">
                                    <div><b>Dibuat:</b> {p.createdAt ? p.createdAt.substring(0, 16).replace('T', ' ') : '-'}</div>
                                    {p.paidAt && <div><b>Dibayar:</b> {p.paidAt.substring(0, 16).replace('T', ' ')}</div>}
                                  </td>
                                  <td className="p-4 text-center">
                                    {p.status === 'pending' ? (
                                      <div className="flex gap-1 justify-center">
                                        <button 
                                          className="bg-green-600 hover:bg-green-700 text-white font-bold h-7 text-[10px] px-2.5 rounded-lg transition-colors" 
                                          onClick={() => handleApprove(p)}
                                        >
                                          Approve
                                        </button>
                                        <button 
                                          className="text-red-600 hover:bg-red-50 font-bold border border-red-200 h-7 text-[10px] px-2 rounded-lg transition-colors bg-white hover:border-red-300" 
                                          onClick={() => handleReject(p.id)}
                                        >
                                          Reject
                                        </button>
                                      </div>
                                    ) : (
                                      <span className="text-stone-300 pointer-events-none select-none text-[11px] font-sans">Sudah Diproses</span>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* 3. PREMIUM USER STATUS PANEL */}
              {monitoringSubTab === 'users' && (
                <div className="space-y-4 font-sans">
                  <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-stone-50 border-b border-stone-200 text-xs text-stone-500 font-semibold uppercase tracking-wider">
                          <th className="p-4">User</th>
                          <th className="p-4">Email Address</th>
                          <th className="p-4">Status Langganan</th>
                          <th className="p-4">Expired At</th>
                          <th className="p-4 text-right">Unlocked Single Results</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-sm">
                        {monitoringUsers.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-10 text-center text-stone-400">
                              Tidak ada profile user terdaftar.
                            </td>
                          </tr>
                        ) : (
                          monitoringUsers.map(u => {
                            const subStatus = u.subscriptionStatus || 'free';
                            return (
                              <tr key={u.id} className="hover:bg-stone-50">
                                <td className="p-4">
                                  <div className="font-bold text-stone-800">{u.displayName || u.fullName || 'Nama Kosong'}</div>
                                  <div className="text-[10px] font-mono text-stone-400 font-bold">UID: {u.id || u.uid}</div>
                                </td>
                                <td className="p-4">
                                  <div className="text-stone-700 text-xs font-bold">{u.email || '-'}</div>
                                </td>
                                <td className="p-4">
                                  <Badge className={cn(
                                    "font-bold text-[10px] uppercase",
                                    subStatus === 'free' ? 'bg-stone-100 text-stone-600 border-stone-200' :
                                    subStatus === 'monthly' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
                                    'bg-teal-100 text-teal-800 border-teal-200'
                                  )} variant="outline">
                                    {subStatus.toUpperCase()}
                                  </Badge>
                                </td>
                                <td className="p-4 text-xs text-stone-600 font-mono">
                                  {u.premiumExpiredAt ? (
                                    <div className={cn(
                                      "font-bold",
                                      new Date(u.premiumExpiredAt) < new Date() ? "text-red-500 font-bold" : "text-green-600 font-semibold"
                                    )}>
                                      {u.premiumExpiredAt.replace('T', ' ').substring(0, 16)} 
                                      {new Date(u.premiumExpiredAt) < new Date() ? ' (Expired)' : ''}
                                    </div>
                                  ) : (
                                    <span className="text-stone-400">-</span>
                                  )}
                                </td>
                                <td className="p-4 text-right font-mono text-xs">
                                  {u.unlockedResults && u.unlockedResults.length > 0 ? (
                                    <div className="flex flex-col items-end gap-1">
                                      <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-[10px]" variant="outline">
                                        {u.unlockedResults.length} Unlocked
                                      </Badge>
                                      <div className="text-[9px] text-stone-400 max-w-[200px] truncate">
                                        {u.unlockedResults.map((it: any) => it.key).join(', ')}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-stone-400">0</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 4. BUSINESS TRANSACTIONS PANEL */}
              {monitoringSubTab === 'transactions' && (
                <div className="space-y-4 font-sans">
                  <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-stone-50 border-b border-stone-200 text-xs text-stone-500 font-semibold uppercase tracking-wider">
                          <th className="p-4">Transaction Doc ID</th>
                          <th className="p-4">Received At</th>
                          <th className="p-4">Verified Status</th>
                          <th className="p-4">Mayar Payment Reference</th>
                          <th className="p-4">Payload Summary</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-xs font-mono">
                        {monitoringTransactions.length === 0 ? (
                          <tr className="font-sans">
                            <td colSpan={5} className="p-10 text-center text-stone-400">
                              Belum ada rincian transaksi bisnis webhook Mayar.
                            </td>
                          </tr>
                        ) : (
                          monitoringTransactions.map(tx => {
                            const pl = tx.payload || {};
                            const refId = pl.payment_id || pl.id || (pl.data && (pl.data.payment_id || pl.data.id || pl.data.paymentId)) || 'N/A';
                            const detailPack = pl.description || (pl.data && pl.data.description) || `Pack Amount: Rp ${(pl.amount || pl.uniqueAmount || (pl.data && pl.data.amount) || 0).toLocaleString()}`;
                            const emailTx = pl.email || (pl.data && pl.data.email) || 'N/A';
                            return (
                              <tr key={tx.id} className="hover:bg-stone-50 text-stone-700">
                                <td className="p-4 text-xs font-bold text-stone-900 selection:bg-stone-200">{tx.id}</td>
                                <td className="p-4 whitespace-nowrap">{tx.receivedAt ? tx.receivedAt.replace('T', ' ').substring(0, 19) : '-'}</td>
                                <td className="p-4 font-sans">
                                  <span className={cn(
                                    "px-2 py-0.5 rounded text-[10px] font-bold tracking-wide",
                                    tx.verified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                  )}>
                                    {tx.verified ? 'VERIFIED' : 'UNVERIFIED'}
                                  </span>
                                </td>
                                <td className="p-4 text-stone-900 font-bold">{refId}</td>
                                <td className="p-4 font-sans text-xs">
                                  <div><b>Penerima:</b> {emailTx}</div>
                                  <div className="text-[11px] text-stone-400 mt-0.5">{detailPack}</div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 5. TECHNICAL WEBHOOK LOGS PANEL */}
              {monitoringSubTab === 'webhook_logs' && (
                <div className="space-y-4 font-sans">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-wrap items-center gap-3 flex-1 w-full">
                      <div className="relative max-w-xs w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <Input 
                          placeholder="Filter pencarian based on paymentId..." 
                          className="pl-10 bg-white"
                          value={webhookLogSearchTerm}
                          onChange={(e) => setWebhookLogSearchTerm(e.target.value)}
                        />
                      </div>
                      
                      <Button 
                        size="sm"
                        variant={showUnmappedWebhooksOnly ? 'default' : 'outline'}
                        className={cn(
                          "text-xs font-bold font-sans flex items-center gap-1.5 transition-all",
                          showUnmappedWebhooksOnly ? "bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-sm" : "text-stone-700 bg-white"
                        )}
                        onClick={() => setShowUnmappedWebhooksOnly(!showUnmappedWebhooksOnly)}
                      >
                        {showUnmappedWebhooksOnly ? 'Showing Unmapped Only' : 'Show Unmapped Webhooks'}
                        <Badge className={cn(
                          "px-1.5 py-0 text-[9px] font-mono",
                          showUnmappedWebhooksOnly ? "bg-white text-red-600" : "bg-stone-100 text-stone-600"
                        )}>
                          {monitoringWebhookLogs.filter(log => log.processingResult === 'UNMAPPED_PAYMENT').length}
                        </Badge>
                      </Button>

                      {showUnmappedWebhooksOnly && (
                        <Button 
                          size="xs" 
                          variant="ghost" 
                          className="text-stone-500 text-[10px] underline hover:text-stone-800"
                          onClick={() => setShowUnmappedWebhooksOnly(false)}
                        >
                          Reset Filter
                        </Button>
                      )}
                    </div>
                    <span className="text-xs font-medium text-stone-400 leading-relaxed max-w-sm">
                      Klik salah satu baris log untuk memeriksa payload header, metadata dan raw JSON yang dikirimkan oleh Mayar.
                    </span>
                  </div>

                  {(() => {
                    const filteredLogs = monitoringWebhookLogs.filter(log => {
                      if (showUnmappedWebhooksOnly && log.processingResult !== 'UNMAPPED_PAYMENT') {
                        return false;
                      }
                      if (!webhookLogSearchTerm) return true;
                      const term = webhookLogSearchTerm.toLowerCase();
                      return (
                        (log.paymentId || '').toLowerCase().includes(term) ||
                        (log.id || '').toLowerCase().includes(term) ||
                        (log.processingResult || '').toLowerCase().includes(term)
                      );
                    });

                    return (
                      <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-stone-50 border-b border-stone-200 text-xs text-stone-500 font-semibold uppercase tracking-wider">
                              <th className="p-4 w-10"></th>
                              <th className="p-4">Log Doc ID</th>
                              <th className="p-4">Received At</th>
                              <th className="p-4">Verification</th>
                              <th className="p-4">Payment Ref</th>
                              <th className="p-4">Processing Result</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100 text-xs font-mono">
                            {filteredLogs.length === 0 ? (
                              <tr className="font-sans">
                                <td colSpan={6} className="p-10 text-center text-stone-400">
                                  Tidak ada rekaman technical webhook logs yang sesuai pencarian.
                                </td>
                              </tr>
                            ) : (
                              filteredLogs.map(log => {
                                const isExpanded = expandedWebhookLogId === log.id;
                                return (
                                  <React.Fragment key={log.id}>
                                    <tr 
                                      className="hover:bg-stone-50/80 cursor-pointer transition-colors" 
                                      onClick={() => setExpandedWebhookLogId(isExpanded ? null : log.id)}
                                    >
                                      <td className="p-4 text-center font-sans font-bold text-stone-400 text-sm">
                                        {isExpanded ? '▼' : '▶'}
                                      </td>
                                      <td className="p-4 text-stone-500 font-semibold">{log.id}</td>
                                      <td className="p-4 whitespace-nowrap">{log.receivedAt ? log.receivedAt.replace('T', ' ').substring(0, 19) : '-'}</td>
                                      <td className="p-4 font-sans">
                                        <Badge className={cn(
                                          "text-[9px] font-bold font-sans",
                                          log.verified ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"
                                        )} variant="outline">
                                          {log.verified ? 'Verified' : 'False'}
                                        </Badge>
                                      </td>
                                      <td className="p-4 font-bold text-stone-900">{log.paymentId || 'N/A'}</td>
                                      <td className="p-4 text-stone-800 font-sans font-medium line-clamp-1 max-w-[350px]">
                                        {log.processingResult}
                                      </td>
                                    </tr>
                                    {isExpanded && (
                                      <tr>
                                        <td colSpan={6} className="p-6 bg-stone-50/50 border-t border-b border-stone-100 text-xs font-mono">
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Headers Column */}
                                            <div className="space-y-1 bg-white p-4 rounded-xl border border-stone-200/60 shadow-sm">
                                              <p className="font-bold text-stone-500 text-[10px] uppercase tracking-wider mb-2 border-b pb-1 font-sans">HTTP Request Headers</p>
                                              <pre className="text-[10px] text-stone-600 max-h-[250px] overflow-auto whitespace-pre-wrap leading-relaxed">
                                                {JSON.stringify(log.headers, null, 2)}
                                              </pre>
                                            </div>

                                            {/* Payload Column */}
                                            <div className="space-y-1 bg-white p-4 rounded-xl border border-stone-200/60 shadow-sm">
                                              <p className="font-bold text-stone-500 text-[10px] uppercase tracking-wider mb-2 border-b pb-1 font-sans">Request Payload Body</p>
                                              <pre className="text-[10px] text-emerald-700 max-h-[250px] overflow-auto whitespace-pre-wrap leading-relaxed">
                                                {JSON.stringify(log.payload, null, 2)}
                                              </pre>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>
              )}
            </>
          )}
        </div>
      ) : activeView === 'payments' ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <Input 
                placeholder="Cari nama, email..." 
                className="pl-10 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex bg-stone-100 p-1 rounded-lg">
              <Button size="sm" variant={filter === 'pending' ? 'default' : 'ghost'} onClick={() => setFilter('pending')}>Pending</Button>
              <Button size="sm" variant={filter === 'all' ? 'default' : 'ghost'} onClick={() => setFilter('all')}>Semua</Button>
            </div>
          </div>

          <div className="grid gap-4">
            {loading ? <div className="p-20 text-center">Loading...</div> : payments.length === 0 ? <div className="p-20 text-center text-stone-400">Tidak ada data.</div> : 
              payments.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(payment => (
                <Card key={payment.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row divide-x divide-stone-100">
                    <div className="flex-1 p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg flex items-center gap-2">
                            {payment.name}
                            <Badge className={cn(payment.status === 'pending' ? 'bg-amber-100 text-amber-700' : payment.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                              {payment.status.toUpperCase()}
                            </Badge>
                          </h3>
                          <div className="text-xs text-stone-500 mt-1 flex gap-4">
                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {payment.email}</span>
                            <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {payment.whatsapp}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-stone-400 uppercase">Total</p>
                          <p className="text-xl font-mono font-bold">Rp {payment.uniqueAmount.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </div>
                    {payment.status === 'pending' && (
                      <div className="bg-stone-50 p-6 flex flex-col gap-2 w-48 justify-center">
                        <Button className="w-full bg-green-600" onClick={() => handleApprove(payment)}><Check className="w-4 h-4 mr-2" /> Approve</Button>
                        <Button variant="outline" className="w-full border-red-200 text-red-600" onClick={() => handleReject(payment.id)}><X className="w-4 h-4 mr-2" /> Reject</Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))
            }
          </div>
        </div>
      ) : activeView === 'blog' ? (
        <div className="space-y-6">
          {isCreating || editingArticle ? (
            <Card className="bg-white shadow-xl">
              <CardHeader>
                <CardTitle className="font-serif">{editingArticle ? 'Edit Artikel' : 'Tulis Artikel Baru'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Judul Artikel</Label>
                    <Input value={articleTitle} onChange={e => setArticleTitle(e.target.value)} placeholder="Masukkan judul..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Penulis</Label>
                    <Input value={articleAuthor} onChange={e => setArticleAuthor(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Isi Artikel (Maks 10000 karakter)</Label>
                    <span className="text-[10px] text-stone-400">{articleContent.length}/10000</span>
                  </div>
                  
                  {/* Mock Toolbar */}
                  <div className="flex flex-wrap gap-1 p-2 bg-stone-100 rounded-t-lg border border-stone-200 border-b-0">
                    <Button variant="ghost" size="icon" className="w-8 h-8"><Bold className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8"><Italic className="w-4 h-4" /></Button>
                    <Separator orientation="vertical" className="h-6 mx-1" />
                    <Button variant="ghost" size="icon" className="w-8 h-8"><AlignLeft className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8"><AlignCenter className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8"><AlignRight className="w-4 h-4" /></Button>
                    <Separator orientation="vertical" className="h-6 mx-1" />
                    <Button variant="ghost" size="icon" className="w-8 h-8"><List className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8"><ImageIcon className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8"><LinkIcon className="w-4 h-4" /></Button>
                  </div>
                  
                  <Textarea 
                    value={articleContent} 
                    onChange={e => setArticleContent(e.target.value.slice(0, 10000))} 
                    className="min-h-[300px] rounded-t-none border-stone-200"
                    placeholder="Tulis artikel di sini..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Visibilitas</Label>
                    <Select value={articleVisibility} onValueChange={(v: any) => setArticleVisibility(v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih target" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Umum (Beranda)</SelectItem>
                        <SelectItem value="member">Member Saja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => { setIsCreating(false); setEditingArticle(null); }}>Batal</Button>
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => handleSaveArticle('draft')}><Save className="w-4 h-4" /> Simpan Draft</Button>
                  <Button className="flex-1 bg-[#2E7D32] gap-2" onClick={() => handleSaveArticle('published')}><Send className="w-4 h-4" /> Publish</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input placeholder="Cari artikel..." className="pl-10" />
                </div>
                <Button className="bg-[#2E7D32] gap-2" onClick={() => setIsCreating(true)}>
                  <Plus className="w-4 h-4" /> Tulis Artikel
                </Button>
              </div>

              <div className="grid gap-4">
                {articles.length === 0 ? <div className="p-20 text-center text-stone-400">Belum ada artikel.</div> : articles.map(article => (
                  <Card key={article.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{article.title}</h3>
                          <Badge variant="outline" className={cn(article.status === 'published' ? 'border-green-200 text-green-700' : 'border-stone-200 text-stone-500')}>
                            {article.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-stone-500">
                          Oleh {article.author} • {article.createdAt ? format(article.createdAt.toDate(), 'dd MMM yyyy, HH:mm') : '-'}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge className="bg-stone-100 text-stone-700 hover:bg-stone-100">
                            {article.visibility === 'public' ? 'Umum' : 'Member Only'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => {
                          setEditingArticle(article);
                          setArticleTitle(article.title);
                          setArticleContent(article.content);
                          setArticleAuthor(article.author);
                          setArticleVisibility(article.visibility);
                        }}>
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteArticle(article.id)}>
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-6 pb-20">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-stone-100 mb-4">
              <div>
                <CardTitle className="font-serif text-2xl text-stone-800">
                  {getJavaneseMonthName(calendarMonth)}, {getJavaneseYearDetails(calendarYear).year} {getJavaneseYearDetails(calendarYear).name} ({new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(calendarYear, calendarMonth))}, {calendarYear})
                </CardTitle>
              </div>
              <div className="flex gap-2 items-center">
                <Button 
                  onClick={handleDownloadPDF} 
                  variant="outline" 
                  size="sm" 
                  className="bg-red-50 text-red-700 border-red-100 hover:bg-red-100 mr-2"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Select value={calendarYear.toString()} onValueChange={v => setCalendarYear(parseInt(v))}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Tahun" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {Array.from({ length: 2200 - 1582 + 1 }, (_, i) => 1582 + i).map(y => (
                      <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={calendarMonth.toString()} onValueChange={v => setCalendarMonth(parseInt(v))}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map((m, i) => (
                      <SelectItem key={i} value={i.toString()}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent ref={calendarRef} id="calendar-to-export" className="bg-white p-6">
              <div className="mb-4 hidden print-header-content">
                <h1 className="text-2xl font-serif font-bold text-center mb-2">
                  HAMARÉ - DATABASE CALENDAR
                </h1>
                <p className="text-center text-sm mb-4">
                  {getJavaneseMonthName(calendarMonth)}, {getJavaneseYearDetails(calendarYear).year} {getJavaneseYearDetails(calendarYear).name} ({new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(calendarYear, calendarMonth))}, {calendarYear})
                </p>
              </div>
              <div className="overflow-x-auto rounded-xl border border-stone-200">
                <table className="w-full text-left border-collapse table-auto">
                  <thead>
                    {(() => {
                      const PM_INFO_DETAILS = [
                        { mStart: 5, mEnd: 7, text: "Kasa - Kartika || 41 Hari || Bathara Wisnu || Domba || Sapi Gumarang" },
                        { mStart: 7, mEnd: 7, text: "Pusa - Karo || 23 hari || Bathara Sambu || Banteng || Tagih" },
                        { mStart: 7, mEnd: 8, text: "Katelu - Manggasri || 24 Hari || Bathara Rudra || Kehidupan Tanaman Tumbuh Bertunas || Lumbung" },
                        { mStart: 8, mEnd: 9, text: "Kapat - Sitra | 25 Hari || Bathara Nyamadipati || Kepiting || Jaran Dawuk" },
                        { mStart: 9, mEnd: 10, text: "Kalima - Manggala || 27 Hari || Bathara Metri || Singa || Banyak Angrem" },
                        { mStart: 10, mEnd: 11, text: "Kanem - Naya || 43 Hari || Bathara Guru || Perempuan Roro Kenya || Gotong Mayit" },
                        { mStart: 11, mEnd: 1, text: "Palguna - Kapitu || 43 Hari || Bathara Indra || Neraca Keseimbangan || Bimasekti" },
                        { mStart: 1, mEnd: 1, text: "Wasika - Kawolu || 25 Hari || Bathara Brahma || Kelabang || Wulanjar Angirian" },
                        { mStart: 2, mEnd: 2, text: "Jita - Kasanga || 25 Hari || Bathara Bayu || Garuda || Wuluh" },
                        { mStart: 2, mEnd: 3, text: "Srawana - Kasedasa || 24 Hari || Rsi Bisma || Kambing || Waluku" },
                        { mStart: 3, mEnd: 4, text: "Destha - Padrawana || 23 Hari || Bathara Antaboga || Air Tertumpah" },
                        { mStart: 4, mEnd: 5, text: "Sadda - Asuji || 41 Hari || Bathari Sri || Mino" },
                      ];
                      
                      const active = PM_INFO_DETAILS.filter(pm => {
                        if (pm.mStart <= pm.mEnd) {
                          return calendarMonth >= pm.mStart && calendarMonth <= pm.mEnd;
                        } else {
                          return calendarMonth >= pm.mStart || calendarMonth <= pm.mEnd;
                        }
                      });

                      return active.map((pm, idx) => (
                        <tr key={`pm-header-${idx}`} className="bg-[#211e1d] text-white border-b border-stone-800">
                          <th colSpan={16} className="p-1 px-4 text-[9px] font-bold text-center tracking-wide uppercase">
                            {pm.text}
                          </th>
                        </tr>
                      ));
                    })()}
                    <tr className="bg-[#211e1d] text-[6.5px] font-bold uppercase tracking-tighter text-white border-b border-stone-200">
                      <th className="p-0.5 w-6 text-center">40</th>
                      <th className="p-0.5 w-6 text-center">S/T</th>
                      <th className="p-0.5 w-6 text-center">Tgl</th>
                      <th className="p-0.5 text-center">Hari</th>
                      <th className="p-0.5 text-center">Jawa</th>
                      <th className="p-0.5 text-center">Bulan Jawa</th>
                      <th className="p-0.5 text-center">Pranata Mangsa</th>
                      <th className="p-0.5 text-center">Tgl PM</th>
                      <th className="p-0.5 text-center">Pasaran</th>
                      <th className="p-0.5 text-center">Neptu</th>
                      <th className="p-0.5 text-center">Nagadina</th>
                      <th className="p-0.5 text-center">Dewa Harian</th>
                      <th className="p-0.5 text-center">Sifat Hari</th>
                      <th className="p-0.5 text-center">Wuku</th>
                      <th className="p-0.5 text-center">Padewan</th>
                      <th className="p-0.5 text-center">Padangon</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 uppercase">
                    {(() => {
                      const daysInMonthResult = new Date(calendarYear, calendarMonth + 1, 0).getDate();
                      const rows = [];
                      for (let i = 1; i <= daysInMonthResult; i++) {
                        const date = new Date(calendarYear, calendarMonth, i);
                        const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(date);
                        const java = getJavaDate(date);
                        const pm = getPMDate(date);
                        const pasaran = getPasaran(date);
                        const neptu = getNeptu(dayName, pasaran);
                        const nagaDina = getNagadina(neptu);
                        const dewaHarian = getDewaHarian(nagaDina);
                        const sifatHari = getSifatHari(date);
                        const wuku = getWuku(date);
                        const padewan = getPadewan(date);
                        const padangon = getPadangon(date);
                        
                        // Perhitungan background color setiap 3 hari sekali
                        const refBase = new Date(2025, 1, 3); // 3 Feb 2025
                        const diffDays3Val = Math.round((date.getTime() - refBase.getTime()) / (1000 * 60 * 60 * 24));
                        let mod3 = diffDays3Val % 3;
                        if (mod3 < 0) mod3 += 3;
                        const isThirdDay = mod3 === 0;
                        
                        const stValue = getSTValue(java.day);
                        const is40 = checkIs40(dayName, pasaran);
                        const fortyValue = is40 ? '40' : '';
                        
                        rows.push(
                          <tr key={i} className={cn(
                            "transition-colors text-[6.5px] leading-none",
                            isThirdDay ? "bg-[#928f8e]" : "bg-white",
                            "hover:opacity-80"
                          )}>
                            <td className="p-0.5 font-mono text-black font-bold text-center">{fortyValue}</td>
                            <td className="p-0.5 font-mono text-black font-bold text-center">{stValue}</td>
                            <td className="p-0.5 font-mono text-black font-bold text-center">{i}</td>
                            <td className={cn(
                              "p-0.5 font-serif font-bold whitespace-nowrap",
                              dayName === 'Minggu' ? "text-red-600" : "text-black"
                            )}>{dayName}</td>
                            <td className="p-0.5 font-mono text-black font-bold text-center">{java.day}</td>
                            <td className="p-0.5 font-serif font-bold text-black whitespace-nowrap">{java.month}</td>
                            <td className="p-0.5 font-serif font-bold text-black whitespace-nowrap">{pm.name}</td>
                            <td className="p-0.5 font-mono font-bold text-black text-center">{pm.day}</td>
                            <td className="p-0.5 font-serif font-bold text-black whitespace-nowrap">{pasaran}</td>
                            <td className="p-0.5 font-mono font-bold text-black text-center">{neptu}</td>
                            <td className={cn(
                              "p-0.5 font-serif font-bold border-x border-stone-100 text-center",
                              nagaDina === 'Utara' && "bg-black text-white",
                              nagaDina === 'Selatan' && "bg-yellow-300 text-black",
                              nagaDina === 'Barat' && "bg-red-500 text-black",
                              nagaDina === 'Timur' && (isThirdDay ? "bg-[#928f8e] text-black" : "bg-white text-black")
                            )}>{nagaDina}</td>
                            <td className="p-0.5 font-serif font-bold text-black whitespace-nowrap">{dewaHarian}</td>
                            <td className="p-0.5 font-serif font-bold text-black whitespace-nowrap">{sifatHari}</td>
                            <td className="p-0.5 font-serif font-bold text-black whitespace-nowrap">{wuku}</td>
                            <td className="p-0.5 font-serif font-bold text-black whitespace-nowrap">{padewan}</td>
                            <td className="p-0.5 font-serif font-bold text-black whitespace-nowrap text-center">{padangon}</td>
                          </tr>
                        );
                      }
                      return rows;
                    })()}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 flex justify-between items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-100">
                <Button 
                  variant="outline" 
                  disabled={calendarYear === 1582 && calendarMonth === 0}
                  onClick={() => {
                    if (calendarMonth === 0) {
                      setCalendarYear(v => v - 1);
                      setCalendarMonth(11);
                    } else {
                      setCalendarMonth(v => v - 1);
                    }
                  }}
                >
                  Bulan Sebelumnya
                </Button>
                <span className="text-xs font-bold text-stone-400">PAGE {calendarMonth + 1} / 12 ({calendarYear})</span>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (calendarMonth === 11) {
                      setCalendarYear(v => v + 1);
                      setCalendarMonth(0);
                    } else {
                      setCalendarMonth(v => v + 1);
                    }
                  }}
                >
                  Bulan Berikutnya
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
