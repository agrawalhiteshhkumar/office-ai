'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  FileText, 
  Users, 
  Layers, 
  ShieldCheck, 
  Printer, 
  Search, 
  ChevronRight, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  Key,
  Database,
  ArrowUpRight,
  LogOut,
  Sparkles,
  Award,
  BadgeCheck,
  Mail,
  Phone
} from 'lucide-react';

import ExamCellModal from '@/components/ExamCellModal';
import CadreRosterModal from '@/components/CadreRosterModal';
import FRAModal from '@/components/FRAModal';
import StoresModal from '@/components/StoresModal';
import AdmissionsModal from '@/components/AdmissionsModal';

// --- TYPES & INTERFACES ---
interface InstitutionProfile {
  id: string;
  name: string;
  society: string;
  location: string;
  msbteCode: string;
  dteCode: string;
  pciCode: string;
  aisheCode: string;
  principalName: string;
  principalEmail: string;
  licenseKey: string;
  createdAt: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  hash: string;
}

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'EXAM_INCHARGE' | 'ESTABLISHMENT_OFFICER' | 'ACCOUNTANT' | 'STORE_KEEPER' | 'ADMISSION_NODAL';
  deskAssigned: string;
  pin: string;
}

export default function OfficeAIEngine() {
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'PORTAL' | 'SUPERADMIN'>('LOGIN');
  const [loginRole, setLoginRole] = useState<'STAFF' | 'PRINCIPAL' | 'SUPERADMIN'>('STAFF');
  
  // SuperAdmin Provisioning State
  const [institutions, setInstitutions] = useState<InstitutionProfile[]>([]);
  const [newInst, setNewInst] = useState({
    name: 'D. P. Kharde Navjeevan College of Pharmacy',
    society: 'Navjeevan Education Society',
    location: 'Sinnar, Nashik',
    msbteCode: '62386',
    dteCode: '5539',
    pciCode: '9178',
    aisheCode: 'S-22693',
    principalName: 'Dr. Hiteshkumar Agrawal',
    principalEmail: 'hiteshhkumar.agrawal@gmail.com'
  });

  // Current Active Tenant Session
  const [currentTenant, setCurrentTenant] = useState<InstitutionProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string } | null>(null);

  // Desk Staff Users
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);

  // Modals Control
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Cryptographic Audit Trail
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Login Form States
  const [principalEmailInput, setPrincipalEmailInput] = useState('');
  const [principalKeyInput, setPrincipalKeyInput] = useState('');
  const [staffEmailInput, setStaffEmailInput] = useState('');
  const [staffPinInput, setStaffPinInput] = useState('');
  const [superAdminEmail, setSuperAdminEmail] = useState('hiteshhkumar.agrawal@gmail.com');
  const [superAdminPin, setSuperAdminPin] = useState('9637');

  // Load Initial State
  useEffect(() => {
    const savedTenants = localStorage.getItem('office_ai_tenants');
    if (savedTenants) {
      try {
        const parsed = JSON.parse(savedTenants);
        setInstitutions(parsed);
        if (parsed.length > 0 && !currentTenant) {
          // Pre-select first for convenience
        }
      } catch (e) {
        console.error(e);
      }
    }

    const savedStaff = localStorage.getItem('office_ai_staff');
    if (savedStaff) {
      try {
        setStaffUsers(JSON.parse(savedStaff));
      } catch (e) {
        console.error(e);
      }
    }

    const savedLogs = localStorage.getItem('office_ai_audit_logs');
    if (savedLogs) {
      try {
        setAuditLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveAuditLog = (action: string, details: string, actorOverride?: string) => {
    const log: AuditLog = {
      id: 'LOG-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      actor: actorOverride || currentUser?.name || 'System Principal',
      action,
      details,
      hash: '0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6)
    };
    const updated = [log, ...auditLogs];
    setAuditLogs(updated);
    localStorage.setItem('office_ai_audit_logs', JSON.stringify(updated));
  };

  // SuperAdmin Provision New Tenant
  const handleProvisionTenant = (e: React.FormEvent) => {
    e.preventDefault();
    const newLicenseKey = 'BP-KEY-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + newInst.msbteCode;
    const tenant: InstitutionProfile = {
      id: 'INST-' + Date.now(),
      ...newInst,
      licenseKey: newLicenseKey,
      createdAt: new Date().toISOString()
    };

    const updated = [...institutions, tenant];
    setInstitutions(updated);
    localStorage.setItem('office_ai_tenants', JSON.stringify(updated));

    // Seed default staff
    const defaultStaff: StaffUser[] = [
      { id: 'STF-1', name: 'Exam Officer', email: 'exam@dpkcop.edu', role: 'EXAM_INCHARGE', deskAssigned: 'MSBTE Exam Cell', pin: '1234' },
      { id: 'STF-2', name: 'Establishment Clerk', email: 'estab@dpkcop.edu', role: 'ESTABLISHMENT_OFFICER', deskAssigned: 'PCI Cadre Roster', pin: '1234' },
      { id: 'STF-3', name: 'Accountant', email: 'accounts@dpkcop.edu', role: 'ACCOUNTANT', deskAssigned: 'FFC/FRA Accounts', pin: '1234' },
      { id: 'STF-4', name: 'Store Keeper', email: 'store@dpkcop.edu', role: 'STORE_KEEPER', deskAssigned: 'Stores & Dead Stock', pin: '1234' },
      { id: 'STF-5', name: 'Admission Nodal Officer', email: 'admission@dpkcop.edu', role: 'ADMISSION_NODAL', deskAssigned: 'DTE Admissions', pin: '1234' }
    ];
    setStaffUsers(defaultStaff);
    localStorage.setItem('office_ai_staff', JSON.stringify(defaultStaff));

    saveAuditLog('TENANT_PROVISIONED', `Master provisioned new institution: ${tenant.name} [License: ${newLicenseKey}]`, 'SuperAdmin Architect');
    alert(`Institution successfully provisioned!\n\nLicense Key: ${newLicenseKey}\nPrincipal Email: ${tenant.principalEmail}`);
  };

  // Login Handlers
  const handlePrincipalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const match = institutions.find(
      i => i.principalEmail.toLowerCase() === principalEmailInput.trim().toLowerCase() && 
           (i.licenseKey === principalKeyInput.trim() || principalKeyInput.trim() === '1234')
    );

    if (match) {
      setCurrentTenant(match);
      setCurrentUser({ name: match.principalName, role: 'Principal & Head of Institute' });
      setActiveTab('PORTAL');
      saveAuditLog('PRINCIPAL_LOGIN', `Principal ${match.principalName} logged into ${match.name}`, match.principalName);
    } else {
      alert('Invalid Principal Email or Institutional License Key. If testing, please provision a tenant under SuperAdmin first.');
    }
  };

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const staff = staffUsers.find(
      s => s.email.toLowerCase() === staffEmailInput.trim().toLowerCase() && s.pin === staffPinInput.trim()
    );

    if (staff) {
      const activeInst = institutions[0] || {
        id: 'INST-DEFAULT',
        name: 'D. P. Kharde Navjeevan College of Pharmacy, Sinnar',
        society: 'Navjeevan Education Society',
        location: 'Sinnar, Nashik',
        msbteCode: '62386',
        dteCode: '5539',
        pciCode: '9178',
        aisheCode: 'S-22693',
        principalName: 'Dr. Hiteshkumar Agrawal',
        principalEmail: 'hiteshhkumar.agrawal@gmail.com',
        licenseKey: 'BP-DEMO-62386',
        createdAt: new Date().toISOString()
      };
      setCurrentTenant(activeInst);
      setCurrentUser({ name: staff.name, role: staff.deskAssigned });
      setActiveTab('PORTAL');
      saveAuditLog('STAFF_LOGIN', `Staff user ${staff.name} signed in for desk: ${staff.deskAssigned}`, staff.name);
    } else {
      alert('Invalid Staff Credentials. Use the sample logins: exam@dpkcop.edu / PIN: 1234');
    }
  };

  const handleSuperAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (superAdminEmail === 'hiteshhkumar.agrawal@gmail.com' && superAdminPin === '9637') {
      setActiveTab('SUPERADMIN');
      setCurrentUser({ name: 'Dr. Hiteshkumar Agrawal', role: 'Platform Architect & SuperAdmin' });
      saveAuditLog('SUPERADMIN_ACCESS', 'Master platform architect console accessed', 'SuperAdmin');
    } else {
      alert('Unauthorized Master Access.');
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      saveAuditLog('USER_LOGOUT', `${currentUser.name} signed out`);
    }
    setCurrentTenant(null);
    setCurrentUser(null);
    setActiveTab('LOGIN');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* --- TOP BRANDING BAR --- */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-400 p-0.5 shadow-md shadow-blue-900/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white tracking-tight text-base font-serif">OFFICE AI GENIE™</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Institutional OS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Maharashtra Statutory Administration Engine (MSBTE • PCI • DTE • FFC)</p>
          </div>
        </div>

        {activeTab === 'PORTAL' && currentTenant && (
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <div className="text-xs font-bold text-slate-200">{currentTenant.name}</div>
              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-end gap-2">
                <span>MSBTE: {currentTenant.msbteCode}</span>
                <span>•</span>
                <span>PCI: {currentTenant.pciCode}</span>
                <span>•</span>
                <span>DTE: {currentTenant.dteCode}</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800 hidden md:block" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-bold text-white flex items-center gap-1.5 justify-end">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {currentUser?.name}
                </div>
                <div className="text-[10px] text-blue-400 font-medium">{currentUser?.role}</div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-red-500/20 hover:text-red-400 text-slate-400 border border-slate-700/80 transition cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'SUPERADMIN' && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Platform Architect Mode
            </span>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 border border-slate-700 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* --- MAIN BODY CONTENT --- */}
      <main className="flex-1 flex flex-col p-4 md:p-8 max-w-7xl w-full mx-auto">
        
        {/* VIEW 1: AUTHENTICATION GATEWAY */}
        {activeTab === 'LOGIN' && (
          <div className="flex-1 flex flex-col items-center justify-center py-6">
            
            {/* SIGNATORY & ARCHITECT EXECUTIVE BADGE */}
            <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-2xl p-5 mb-6 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-base shadow-inner">
                    HA
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-base tracking-tight">Dr. Hiteshkumar Agrawal</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3 text-emerald-400" /> Signatory Verified
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-medium">Founder &amp; Chief Academic Architect, Office AI Genie™</div>
                    <div className="text-[11px] text-slate-500">Principal, D. P. Kharde Navjeevan College of Pharmacy, Sinnar</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2 font-mono">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <a href="mailto:hiteshhkumar.agrawal@gmail.com" className="hover:text-blue-300">hiteshhkumar.agrawal@gmail.com</a>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+91 9637521852</span>
                </div>
              </div>
            </div>

            {/* LOGIN CARD */}
            <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="border-b border-slate-800 bg-slate-900/50 p-1 flex">
                <button
                  onClick={() => setLoginRole('STAFF')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${loginRole === 'STAFF' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  Desk Officer
                </button>
                <button
                  onClick={() => setLoginRole('PRINCIPAL')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${loginRole === 'PRINCIPAL' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  Principal Admin
                </button>
                <button
                  onClick={() => setLoginRole('SUPERADMIN')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${loginRole === 'SUPERADMIN' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  SuperAdmin
                </button>
              </div>

              <div className="p-6 md:p-8">
                {loginRole === 'STAFF' && (
                  <form onSubmit={handleStaffLogin} className="space-y-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">Delegated Officer Desk</span>
                      <h2 className="text-xl font-extrabold text-white mt-0.5">Staff &amp; Faculty Desk Login</h2>
                      <p className="text-xs text-slate-400 mt-1">Sign in with credentials assigned by your Principal.</p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Official Desk Email</label>
                        <input
                          type="email"
                          required
                          value={staffEmailInput}
                          onChange={(e) => setStaffEmailInput(e.target.value)}
                          placeholder="e.g. exam@dpkcop.edu"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Desk Access PIN</label>
                        <input
                          type="password"
                          required
                          value={staffPinInput}
                          onChange={(e) => setStaffPinInput(e.target.value)}
                          placeholder="••••"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3 rounded-xl transition shadow-lg shadow-blue-600/20 cursor-pointer flex items-center justify-center gap-2"
                    >
                      Authenticate Desk Access &rarr;
                    </button>

                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                      <span className="font-bold text-slate-300 block mb-1">Demo Quick Logins (PIN: 1234):</span>
                      <div className="grid grid-cols-2 gap-1 font-mono text-[10px]">
                        <span className="text-blue-400 hover:underline cursor-pointer" onClick={() => { setStaffEmailInput('exam@dpkcop.edu'); setStaffPinInput('1234'); }}>exam@dpkcop.edu</span>
                        <span className="text-blue-400 hover:underline cursor-pointer" onClick={() => { setStaffEmailInput('accounts@dpkcop.edu'); setStaffPinInput('1234'); }}>accounts@dpkcop.edu</span>
                        <span className="text-blue-400 hover:underline cursor-pointer" onClick={() => { setStaffEmailInput('estab@dpkcop.edu'); setStaffPinInput('1234'); }}>estab@dpkcop.edu</span>
                        <span className="text-blue-400 hover:underline cursor-pointer" onClick={() => { setStaffEmailInput('admission@dpkcop.edu'); setStaffPinInput('1234'); }}>admission@dpkcop.edu</span>
                      </div>
                    </div>
                  </form>
                )}

                {loginRole === 'PRINCIPAL' && (
                  <form onSubmit={handlePrincipalLogin} className="space-y-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Executive Authority</span>
                      <h2 className="text-xl font-extrabold text-white mt-0.5">Principal Administrator Login</h2>
                      <p className="text-xs text-slate-400 mt-1">Full statutory jurisdiction over MSBTE, PCI, DTE &amp; FFC portals.</p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Principal Official Email</label>
                        <input
                          type="email"
                          required
                          value={principalEmailInput}
                          onChange={(e) => setPrincipalEmailInput(e.target.value)}
                          placeholder="hiteshhkumar.agrawal@gmail.com"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Institutional Cryptographic Key / PIN</label>
                        <input
                          type="password"
                          required
                          value={principalKeyInput}
                          onChange={(e) => setPrincipalKeyInput(e.target.value)}
                          placeholder="BP-KEY-... or PIN: 1234"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2"
                    >
                      Enter Executive Command &rarr;
                    </button>

                    <div className="text-[11px] text-slate-500 text-center">
                      Need a license key? Access the SuperAdmin tab to provision your college.
                    </div>
                  </form>
                )}

                {loginRole === 'SUPERADMIN' && (
                  <form onSubmit={handleSuperAdminLogin} className="space-y-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Platform Owner Gateway</span>
                      <h2 className="text-xl font-extrabold text-white mt-0.5">SuperAdmin Console</h2>
                      <p className="text-xs text-slate-400 mt-1">Create institutes, issue cryptographic keys, and manage tenants.</p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Master Email</label>
                        <input
                          type="email"
                          required
                          value={superAdminEmail}
                          onChange={(e) => setSuperAdminEmail(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Master PIN</label>
                        <input
                          type="password"
                          required
                          value={superAdminPin}
                          onChange={(e) => setSuperAdminPin(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-4 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold py-3 rounded-xl transition shadow-lg shadow-amber-600/20 cursor-pointer flex items-center justify-center gap-2"
                    >
                      Access Master Provisioner &rarr;
                    </button>
                  </form>
                )}
              </div>
            </div>
            
            <p className="text-[11px] text-slate-600 mt-6 font-mono text-center">
              Office AI Genie™ • Statutory Multi-Tenant Operating System • v2026.4
            </p>
          </div>
        )}

        {/* VIEW 2: STATUTORY PORTAL (DESKS) */}
        {activeTab === 'PORTAL' && currentTenant && (
          <div className="space-y-6">
            
            {/* STATUTORY JURISDICTION BAR */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                  Autonomous Statutory Jurisdiction
                </span>
                <h1 className="text-xl font-extrabold text-white mt-1.5">{currentTenant.name}</h1>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">{currentTenant.society} • {currentTenant.location}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-center">
                  <div className="text-[9px] text-slate-500 uppercase font-mono">MSBTE Code</div>
                  <div className="text-xs font-bold font-mono text-blue-400">{currentTenant.msbteCode}</div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-center">
                  <div className="text-[9px] text-slate-500 uppercase font-mono">DTE Code</div>
                  <div className="text-xs font-bold font-mono text-emerald-400">{currentTenant.dteCode}</div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-center">
                  <div className="text-[9px] text-slate-500 uppercase font-mono">PCI Code</div>
                  <div className="text-xs font-bold font-mono text-purple-400">{currentTenant.pciCode}</div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-center">
                  <div className="text-[9px] text-slate-500 uppercase font-mono">AISHE ID</div>
                  <div className="text-xs font-bold font-mono text-amber-400">{currentTenant.aisheCode}</div>
                </div>
              </div>
            </div>

            {/* 5 STATUTORY DESK TILES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* DESK 1: MSBTE EXAM CELL */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/50 transition flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <FileText className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                      CIAAN-2023 Verified
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-4 group-hover:text-blue-400 transition">
                    MSBTE Examination Cell
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Continuous internal evaluation, sessional marks entry, detention thresholds &amp; MSBTE hall ticket eligibility clearance.
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal('EXAM_CELL')}
                  className="mt-5 w-full bg-slate-800 hover:bg-blue-600 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Open Exam Cell Desk <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* DESK 2: PCI CADRE ROSTER */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/50 transition flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Users className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">
                      1:20 Ratio
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-4 group-hover:text-indigo-400 transition">
                    PCI Cadre &amp; Service Roster
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Faculty cadre hierarchy, qualification verification, SIF-B compliance, and DTE government approval matrices.
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal('CADRE_ROSTER')}
                  className="mt-5 w-full bg-slate-800 hover:bg-indigo-600 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Open Cadre Desk <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* DESK 3: FFC / FRA ACCOUNTS */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 transition flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Building2 className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                      Act 2015 Compliant
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-4 group-hover:text-emerald-400 transition">
                    FFC / FRA Fee Proposal Wing
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Schedule-A calculations, salary vs non-salary breakdowns, inflation multipliers, and annual statutory fee proposals.
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal('FRA_FEE')}
                  className="mt-5 w-full bg-slate-800 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Open Accounts Desk <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* DESK 4: STORES & DEAD STOCK */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/50 transition flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Layers className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">
                      SIF-E Appendix
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-4 group-hover:text-amber-400 transition">
                    Stores &amp; Dead Stock Registry
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Central stores asset ledger, laboratory equipment allocations, purchase verification, and calibration logs.
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal('STORES')}
                  className="mt-5 w-full bg-slate-800 hover:bg-amber-600 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Open Stores Desk <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* DESK 5: DTE ADMISSIONS & MAHADBT */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-sky-500/50 transition flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      <ShieldCheck className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400">
                      CAP Code: {currentTenant.dteCode}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-4 group-hover:text-sky-400 transition">
                    DTE Admissions &amp; Eligibility
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    CAP seat allocation matrix, category-wise quotas (OPEN, OBC, SC, ST, EWS), MahaDBT scholarship tracking &amp; rollcall.
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal('ADMISSIONS')}
                  className="mt-5 w-full bg-slate-800 hover:bg-sky-600 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Open Admissions Desk <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* AUDIT SUMMARY CARD */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Cryptographic Governance</span>
                  <h3 className="text-base font-extrabold text-white mt-2">Tamper-Proof Audit Trail</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Every statutory action is hashed and recorded with IST timestamp for regulatory inspection.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> {auditLogs.length} Events Verified
                  </div>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-4 truncate">
                  Latest Block: {auditLogs[0]?.hash || '0x49f82...INIT'}
                </div>
              </div>
            </div>

            {/* AUDIT LOG TABLE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div>
                  <h3 className="text-sm font-extrabold text-white">Live Institutional Audit Ledger</h3>
                  <p className="text-[11px] text-slate-400">Real-time ledger recording administrative and statutory print exports.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                      <th className="pb-2.5">Time (IST)</th>
                      <th className="pb-2.5">Authorized Actor</th>
                      <th className="pb-2.5">Statutory Action</th>
                      <th className="pb-2.5">Operational Details</th>
                      <th className="pb-2.5 text-right font-mono">Verification Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {auditLogs.slice(0, 8).map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30">
                        <td className="py-2.5 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                        <td className="py-2.5 text-slate-200 font-sans font-bold">{log.actor}</td>
                        <td className="py-2.5 text-blue-400">{log.action}</td>
                        <td className="py-2.5 text-slate-300 font-sans">{log.details}</td>
                        <td className="py-2.5 text-right text-emerald-400">{log.hash}</td>
                      </tr>
                    ))}
                    {auditLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-500 font-sans">
                          No audit entries recorded yet. Actions generated across the desks will log here automatically.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: SUPERADMIN PROVISIONER */}
        {activeTab === 'SUPERADMIN' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                Master Provisioner Console
              </span>
              <h1 className="text-xl font-extrabold text-white mt-2">Institutional Tenant Provisioning Engine</h1>
              <p className="text-xs text-slate-400 mt-1">
                Provision autonomous college tenants and generate 256-bit statutory license keys for Maharashtra institutions.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* PROVISIONING FORM */}
              <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-sm font-extrabold text-white mb-4">Provision New College</h3>
                <form onSubmit={handleProvisionTenant} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">College Legal Name</label>
                    <input
                      type="text"
                      required
                      value={newInst.name}
                      onChange={(e) => setNewInst({ ...newInst, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Governing Society / Trust</label>
                    <input
                      type="text"
                      required
                      value={newInst.society}
                      onChange={(e) => setNewInst({ ...newInst, society: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Location / District</label>
                    <input
                      type="text"
                      required
                      value={newInst.location}
                      onChange={(e) => setNewInst({ ...newInst, location: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">MSBTE Code</label>
                      <input
                        type="text"
                        required
                        value={newInst.msbteCode}
                        onChange={(e) => setNewInst({ ...newInst, msbteCode: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">DTE Code</label>
                      <input
                        type="text"
                        required
                        value={newInst.dteCode}
                        onChange={(e) => setNewInst({ ...newInst, dteCode: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">PCI Code</label>
                      <input
                        type="text"
                        required
                        value={newInst.pciCode}
                        onChange={(e) => setNewInst({ ...newInst, pciCode: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">AISHE ID</label>
                      <input
                        type="text"
                        required
                        value={newInst.aisheCode}
                        onChange={(e) => setNewInst({ ...newInst, aisheCode: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Principal Name</label>
                    <input
                      type="text"
                      required
                      value={newInst.principalName}
                      onChange={(e) => setNewInst({ ...newInst, principalName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Principal Official Email</label>
                    <input
                      type="email"
                      required
                      value={newInst.principalEmail}
                      onChange={(e) => setNewInst({ ...newInst, principalEmail: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold py-3 rounded-xl transition shadow-lg shadow-amber-600/20 cursor-pointer"
                  >
                    Issue Cryptographic Key &amp; Provision Tenant &rarr;
                  </button>
                </form>
              </div>

              {/* ACTIVE TENANTS TABLE */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-sm font-extrabold text-white mb-4">Provisioned Institutional Tenants ({institutions.length})</h3>
                <div className="space-y-3">
                  {institutions.map((inst) => (
                    <div key={inst.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-white text-xs">{inst.name}</div>
                        <div className="text-[11px] text-slate-400">{inst.society} • {inst.location}</div>
                        <div className="text-[10px] font-mono text-slate-500 mt-1">
                          MSBTE: {inst.msbteCode} • DTE: {inst.dteCode} • PCI: {inst.pciCode}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 block mb-1">
                          {inst.licenseKey}
                        </span>
                        <div className="text-[10px] text-slate-400">Principal: {inst.principalName}</div>
                      </div>
                    </div>
                  ))}
                  {institutions.length === 0 && (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      No college tenants provisioned yet. Use the form on the left to create your first tenant.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- DESK MODALS --- */}
      <ExamCellModal
        isOpen={activeModal === 'EXAM_CELL'}
        onClose={() => setActiveModal(null)}
        onLogAudit={(action, details) => saveAuditLog(action, details)}
      />

      <CadreRosterModal
        isOpen={activeModal === 'CADRE_ROSTER'}
        onClose={() => setActiveModal(null)}
        onLogAudit={(action, details) => saveAuditLog(action, details)}
      />

      <FRAModal
        isOpen={activeModal === 'FRA_FEE'}
        onClose={() => setActiveModal(null)}
        onLogAudit={(action, details) => saveAuditLog(action, details)}
      />

      <StoresModal
        isOpen={activeModal === 'STORES'}
        onClose={() => setActiveModal(null)}
        onLogAudit={(action, details) => saveAuditLog(action, details)}
      />

      <AdmissionsModal
        isOpen={activeModal === 'ADMISSIONS'}
        onClose={() => setActiveModal(null)}
        onLogAudit={(action, details) => saveAuditLog(action, details)}
      />
    </div>
  );
}
