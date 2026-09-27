"use client";

import React, { useState, useEffect } from "react";
import { 
  InstituteTenant, 
  InstitutionalUser, 
  SUPER_ADMIN_CREDENTIALS, 
  STORAGE_KEYS 
} from "@/data/authData";

import { 
  Building2, 
  ShieldCheck, 
  Layers, 
  History, 
  CheckCircle2, 
  Sparkles, 
  LogOut, 
  KeyRound, 
  ArrowRight, 
  PlusCircle, 
  Lock, 
  Users, 
  FileText, 
  Cpu, 
  Boxes, 
  GraduationCap, 
  IndianRupee, 
  UserCheck, 
  BookOpen, 
  Printer, 
  ShieldAlert,
  Trash2
} from "lucide-react";

export default function OfficeAIEngine() {
  const [mounted, setMounted] = useState(false);

  // Persistence State
  const [tenants, setTenants] = useState<InstituteTenant[]>([]);
  const [users, setUsers] = useState<InstitutionalUser[]>([]);
  
  // Auth Session State
  const [sessionUser, setSessionUser] = useState<InstitutionalUser | null>(null);
  const [sessionTenant, setSessionTenant] = useState<InstituteTenant | null>(null);
  const [isSuperAdminSession, setIsSuperAdminSession] = useState(false);

  // Login Form States
  const [portalMode, setPortalMode] = useState<"STAFF_LOGIN" | "SUPER_ADMIN">("STAFF_LOGIN");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [authError, setAuthError] = useState("");

  // Super Admin Tenant Creator Form
  const [newInstName, setNewInstName] = useState("");
  const [newTrustName, setNewTrustName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newPrincipal, setNewPrincipal] = useState("");
  const [newPrincipalEmail, setNewPrincipalEmail] = useState("");
  const [newMsbte, setNewMsbte] = useState("");
  const [newDte, setNewDte] = useState("");
  const [newPci, setNewPci] = useState("");
  const [newAishe, setNewAishe] = useState("");
  const [generatedKeyNotice, setGeneratedKeyNotice] = useState("");

  // Institute Admin: Role Creator Form State
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffDesignation, setNewStaffDesignation] = useState("");
  const [newStaffPin, setNewStaffPin] = useState("");
  const [selectedDeskScope, setSelectedDeskScope] = useState<string>("EXAM_CELL");

  // Operational desk selected
  const [activeDesk, setActiveDesk] = useState<string>("OVERVIEW");
  const [deskRecords, setDeskRecords] = useState<any[]>([]);
  const [auditLedger, setAuditLedger] = useState<any[]>([]);

  // Modals / Entry forms
  const [showAddEntryModal, setShowAddEntryModal] = useState(false);
  const [entryField1, setEntryField1] = useState("");
  const [entryField2, setEntryField2] = useState("");
  const [entryField3, setEntryField3] = useState("");

  // Load persistence
  useEffect(() => {
    setMounted(true);
    try {
      const storedTenants = localStorage.getItem(STORAGE_KEYS.TENANTS);
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      if (storedTenants) setTenants(JSON.parse(storedTenants));
      if (storedUsers) setUsers(JSON.parse(storedUsers));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveTenants = (newTenants: InstituteTenant[]) => {
    setTenants(newTenants);
    localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(newTenants));
  };

  const saveUsers = (newUsers: InstitutionalUser[]) => {
    setUsers(newUsers);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(newUsers));
  };

  // 1. Super Admin: Provision Tenant & Generate Key
  const handleCreateTenant = () => {
    if (!newInstName || !newPrincipalEmail) {
      alert("Institute Name and Principal Email are required.");
      return;
    }

    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const licenseKey = `BP-KEY-${newMsbte || "INST"}-${randomSuffix}`;

    const newTenant: InstituteTenant = {
      id: "TENANT-" + Date.now(),
      name: newInstName,
      trustName: newTrustName,
      location: newLocation,
      licenseKey: licenseKey,
      msbteCode: newMsbte,
      dteCode: newDte,
      pciCode: newPci,
      aisheCode: newAishe,
      createdAt: new Date().toLocaleDateString("en-IN"),
      principalName: newPrincipal || "Principal",
      principalEmail: newPrincipalEmail,
    };

    // Automatically create the Institute Admin user
    const principalUser: InstitutionalUser = {
      id: "USR-" + Date.now(),
      instituteId: newTenant.id,
      name: newTenant.principalName,
      email: newTenant.principalEmail,
      role: "INSTITUTE_ADMIN",
      designationTitle: "Principal & Head of Institute",
      accessPin: "1234",
      allowedDesks: ["ALL"],
    };

    const updatedTenants = [...tenants, newTenant];
    const updatedUsers = [...users, principalUser];

    saveTenants(updatedTenants);
    saveUsers(updatedUsers);

    setGeneratedKeyNotice(licenseKey);
    // Reset inputs
    setNewInstName("");
    setNewTrustName("");
    setNewLocation("");
    setNewPrincipal("");
    setNewPrincipalEmail("");
    setNewMsbte("");
    setNewDte("");
    setNewPci("");
    setNewAishe("");
  };

  // 2. Institute Admin: Create Staff / Officer Roles
  const handleCreateRole = () => {
    if (!sessionTenant || !newStaffName || !newStaffEmail || !newStaffPin) {
      alert("Name, email, and access PIN are mandatory.");
      return;
    }

    const newUser: InstitutionalUser = {
      id: "USR-" + Date.now(),
      instituteId: sessionTenant.id,
      name: newStaffName,
      email: newStaffEmail,
      role: "OFFICER_DESK",
      designationTitle: newStaffDesignation || "Desk Officer",
      accessPin: newStaffPin,
      allowedDesks: [selectedDeskScope],
    };

    const updated = [...users, newUser];
    saveUsers(updated);

    setNewStaffName("");
    setNewStaffEmail("");
    setNewStaffDesignation("");
    setNewStaffPin("");
    alert(`Officer account created successfully for ${newUser.name}. PIN: ${newUser.accessPin}`);
  };

  // 3. Login Handlers
  const handleStaffLogin = () => {
    setAuthError("");
    const matchedUser = users.find(
      (u) => u.email.toLowerCase().trim() === loginEmail.toLowerCase().trim() && u.accessPin === loginPin
    );

    if (!matchedUser) {
      setAuthError("No matching credentials found. Verify email and PIN.");
      return;
    }

    const tenant = tenants.find((t) => t.id === matchedUser.instituteId);
    if (!tenant) {
      setAuthError("Associated institute tenant not found.");
      return;
    }

    setSessionUser(matchedUser);
    setSessionTenant(tenant);
    setIsSuperAdminSession(false);
  };

  const handleSuperAdminLogin = () => {
    setAuthError("");
    if (
      loginEmail.trim() === SUPER_ADMIN_CREDENTIALS.email &&
      loginPin.trim() === SUPER_ADMIN_CREDENTIALS.masterPin
    ) {
      setIsSuperAdminSession(true);
      setSessionUser({
        id: "ROOT",
        instituteId: "ROOT",
        name: "Dr. Hiteshkumar Agrawal",
        email: SUPER_ADMIN_CREDENTIALS.email,
        role: "PLATFORM_SUPER_ADMIN",
        designationTitle: "Platform Owner & Chief Architect",
        accessPin: SUPER_ADMIN_CREDENTIALS.masterPin,
        allowedDesks: ["ALL"],
      });
    } else {
      setAuthError("Invalid Platform Owner credentials.");
    }
  };

  const handleLogout = () => {
    setSessionUser(null);
    setSessionTenant(null);
    setIsSuperAdminSession(false);
    setLoginEmail("");
    setLoginPin("");
    setAuthError("");
  };

  // Record creator for blank registers
  const handleAddBlankRecord = () => {
    if (!entryField1) return;
    const newRecord = {
      id: "REC-" + Date.now().toString().slice(-4),
      field1: entryField1,
      field2: entryField2,
      field3: entryField3,
      createdAt: new Date().toLocaleTimeString(),
      officer: sessionUser?.name || "Officer",
    };
    setDeskRecords([newRecord, ...deskRecords]);

    const log = {
      id: "LOG-" + Math.random().toString(16).substring(2, 8).toUpperCase(),
      timestamp: new Date().toLocaleTimeString(),
      actor: `${sessionUser?.name} (${sessionUser?.designationTitle})`,
      action: "RECORD_CREATED",
      details: `Created entry: ${entryField1}`,
      hash: "0x" + Math.random().toString(16).substring(2, 10),
    };
    setAuditLedger([log, ...auditLedger]);

    setEntryField1("");
    setEntryField2("");
    setEntryField3("");
    setShowAddEntryModal(false);
  };

  if (!mounted) return null;

  // =========================================================================
  // VIEW 1: AUTHENTICATION / PROVISIONING GATEWAY
  // =========================================================================
  if (!sessionUser) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-6">
        <header className="max-w-6xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white p-1 flex items-center justify-center">
              <img 
                src="https://raw.githubusercontent.com/agrawalhiteshhkumar/faculty-ai-genie/main/brightpath-logo.png" 
                alt="Logo" 
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight text-white uppercase">OFFICE AI GENIE™</div>
              <div className="text-[9px] font-black tracking-widest text-amber-400 uppercase">LEARN. SKILL. SUCCEED.</div>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono">v2026.4 Multi-Tenant Engine</span>
        </header>

        <main className="max-w-md w-full mx-auto my-8 bg-white text-slate-900 rounded-3xl p-8 shadow-2xl">
          {/* Gateway Tabs */}
          <div className="flex border-b border-slate-200 mb-6 text-xs font-bold">
            <button
              onClick={() => { setPortalMode("STAFF_LOGIN"); setAuthError(""); }}
              className={`flex-1 pb-3 text-center border-b-2 transition ${
                portalMode === "STAFF_LOGIN" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400"
              }`}
            >
              Desk Login
            </button>
            <button
              onClick={() => { setPortalMode("SUPER_ADMIN"); setAuthError(""); }}
              className={`flex-1 pb-3 text-center border-b-2 transition ${
                portalMode === "SUPER_ADMIN" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400"
              }`}
            >
              Platform Owner
            </button>
          </div>

          {/* Mode 1: Staff / Institute Login */}
          {portalMode === "STAFF_LOGIN" && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">INSTITUTIONAL GATEWAY</span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">Sign In to Your Desk</h2>
                <p className="text-xs text-slate-500">Enter your assigned institutional email and access PIN.</p>
              </div>

              {tenants.length === 0 ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  <div className="font-bold flex items-center gap-1.5"><ShieldAlert className="w-4 h-4 text-amber-600" /> System Unprovisioned</div>
                  <div className="text-[11px] mt-1">
                    No institute tenant exists yet. The <strong>Platform Owner</strong> must log in first to create an Institute and generate its license key.
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Official Email</label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. principal@college.edu or exam@college.edu"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Access PIN</label>
                    <input
                      type="password"
                      value={loginPin}
                      onChange={(e) => setLoginPin(e.target.value)}
                      placeholder="Enter assigned PIN"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {authError && (
                    <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" /> {authError}
                    </div>
                  )}

                  <button
                    onClick={handleStaffLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
                  >
                    Authenticate Desk <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Mode 2: Super Admin Access */}
          {portalMode === "SUPER_ADMIN" && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">MASTER ROOT ACCESS</span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">Platform Owner Login</h2>
                <p className="text-xs text-slate-500">Create institutes, issue license keys, and manage global tenants.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Master Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="hiteshhkumar.agrawal@gmail.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Master Platform PIN</label>
                <input
                  type="password"
                  value={loginPin}
                  onChange={(e) => setLoginPin(e.target.value)}
                  placeholder="Default Master PIN: 9637"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {authError && (
                <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> {authError}
                </div>
              )}

              <button
                onClick={handleSuperAdminLogin}
                className="w-full bg-slate-900 hover:bg-black text-white font-extrabold text-xs py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
              >
                Enter Platform SuperAdmin <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>

        <footer className="text-center text-xs text-slate-500">
          Office AI Genie™ • Secure Multi-Tenant Governance
        </footer>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: SUPER ADMIN WORKSPACE (PROVISION INSTITUTES & KEYS)
  // =========================================================================
  if (isSuperAdminSession) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
        <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
              PLATFORM OWNER
            </span>
            <h1 className="font-extrabold text-sm uppercase">Global Tenant Provisioning Console</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </header>

        <main className="max-w-6xl w-full mx-auto p-6 space-y-6 flex-1">
          {/* Tenant Creator Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h2 className="text-base font-extrabold text-slate-900 mb-1">Provision New Institute Tenant</h2>
            <p className="text-xs text-slate-500 mb-4">
              Enter college details to generate its official cryptographic license key and provision the Principal's initial account.
            </p>

            {generatedKeyNotice && (
              <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                <div className="font-bold">License Key Generated Successfully!</div>
                <div className="font-mono font-bold text-sm bg-white p-2 rounded border border-emerald-300 mt-1 inline-block">
                  {generatedKeyNotice}
                </div>
                <div className="text-[11px] text-emerald-700 mt-1">
                  Default Principal Account Created. PIN is <code>1234</code>.
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">College Legal Name *</label>
                <input
                  type="text"
                  value={newInstName}
                  onChange={(e) => setNewInstName(e.target.value)}
                  placeholder="e.g. D. P. Kharde Navjeevan College of Pharmacy"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Governing Trust / Society</label>
                <input
                  type="text"
                  value={newTrustName}
                  onChange={(e) => setNewTrustName(e.target.value)}
                  placeholder="e.g. Navjeevan Education Society"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Location / District</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Sinnar, Nashik"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Principal Name</label>
                <input
                  type="text"
                  value={newPrincipal}
                  onChange={(e) => setNewPrincipal(e.target.value)}
                  placeholder="e.g. Dr. Hiteshkumar Agrawal"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Principal Email (Admin Login) *</label>
                <input
                  type="email"
                  value={newPrincipalEmail}
                  onChange={(e) => setNewPrincipalEmail(e.target.value)}
                  placeholder="e.g. principal@college.org.in"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">MSBTE Code</label>
                <input
                  type="text"
                  value={newMsbte}
                  onChange={(e) => setNewMsbte(e.target.value)}
                  placeholder="e.g. 62386"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">DTE Code</label>
                <input
                  type="text"
                  value={newDte}
                  onChange={(e) => setNewDte(e.target.value)}
                  placeholder="e.g. 5539"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">PCI Code</label>
                <input
                  type="text"
                  value={newPci}
                  onChange={(e) => setNewPci(e.target.value)}
                  placeholder="e.g. 9178"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">AISHE Code</label>
                <input
                  type="text"
                  value={newAishe}
                  onChange={(e) => setNewAishe(e.target.value)}
                  placeholder="e.g. S-22693"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleCreateTenant}
              className="mt-4 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              <PlusCircle className="w-4 h-4" /> Provision Institute & Issue Key
            </button>
          </div>

          {/* Active Tenants List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h2 className="text-base font-extrabold text-slate-900 mb-3">Provisioned Institutional Tenants ({tenants.length})</h2>
            {tenants.length === 0 ? (
              <div className="text-xs text-slate-400 py-6 text-center">No college tenants provisioned yet. Use the form above.</div>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {tenants.map((t) => (
                  <div key={t.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                      <div className="text-slate-500">{t.location} • Principal: {t.principalName} ({t.principalEmail})</div>
                      <div className="text-[10px] text-blue-600 font-mono mt-0.5">
                        Codes: MSBTE: {t.msbteCode || "-"} | DTE: {t.dteCode || "-"} | PCI: {t.pciCode || "-"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Cryptographic License Key</div>
                      <code className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200 inline-block font-mono">
                        {t.licenseKey}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: AUTHENTICATED DESK WORKSPACE (PRINCIPAL & STAFF)
  // =========================================================================
  const isPrincipal = sessionUser.role === "INSTITUTE_ADMIN";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40 px-6 py-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center">
              <img 
                src="https://raw.githubusercontent.com/agrawalhiteshhkumar/faculty-ai-genie/main/brightpath-logo.png" 
                alt="Logo" 
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="font-black text-sm text-slate-900">{sessionTenant?.name}</div>
              <div className="text-[10px] font-mono text-slate-500">
                MSBTE: {sessionTenant?.msbteCode || "N/A"} • DTE: {sessionTenant?.dteCode || "N/A"} • PCI: {sessionTenant?.pciCode || "N/A"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block text-xs">
              <div className="font-bold text-slate-900">{sessionUser.name}</div>
              <div className="text-[10px] text-blue-600 font-semibold">{sessionUser.designationTitle}</div>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1.5 transition border border-red-200"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Operational Desk Navigation */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center flex-wrap gap-2 text-xs">
          <button
            onClick={() => setActiveDesk("OVERVIEW")}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeDesk === "OVERVIEW" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Dashboard
          </button>

          {isPrincipal && (
            <button
              onClick={() => setActiveDesk("ROLE_MANAGEMENT")}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeDesk === "ROLE_MANAGEMENT" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Delegate Officer Roles
            </button>
          )}

          {(sessionUser.allowedDesks.includes("ALL") || sessionUser.allowedDesks.includes("EXAM_CELL")) && (
            <button
              onClick={() => setActiveDesk("EXAM_CELL")}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeDesk === "EXAM_CELL" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> MSBTE Exam Cell
            </button>
          )}

          {(sessionUser.allowedDesks.includes("ALL") || sessionUser.allowedDesks.includes("ACCOUNTS")) && (
            <button
              onClick={() => setActiveDesk("ACCOUNTS")}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeDesk === "ACCOUNTS" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <IndianRupee className="w-3.5 h-3.5" /> FFC & FRA Accounts
            </button>
          )}

          {(sessionUser.allowedDesks.includes("ALL") || sessionUser.allowedDesks.includes("PHARMACY_STORES")) && (
            <button
              onClick={() => setActiveDesk("PHARMACY_STORES")}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeDesk === "PHARMACY_STORES" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Boxes className="w-3.5 h-3.5" /> Stores & Dead Stock
            </button>
          )}

          {(sessionUser.allowedDesks.includes("ALL") || sessionUser.allowedDesks.includes("STUDENT_ADMISSIONS")) && (
            <button
              onClick={() => setActiveDesk("STUDENT_ADMISSIONS")}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeDesk === "STUDENT_ADMISSIONS" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" /> Admissions & MahaDBT
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="p-6 max-w-6xl w-full mx-auto space-y-6 flex-1">
        {/* VIEW A: ROLE DELEGATION (PRINCIPAL ONLY) */}
        {activeDesk === "ROLE_MANAGEMENT" && isPrincipal && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <h2 className="text-base font-extrabold text-slate-900 mb-1">Create Institutional Desk Role</h2>
              <p className="text-xs text-slate-500 mb-4">
                Delegate departmental access to your faculty or administrative staff. They will log in using their email and assigned PIN.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Officer Name *</label>
                  <input
                    type="text"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    placeholder="e.g. Prof. S. R. Deshmukh"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Officer Email *</label>
                  <input
                    type="email"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    placeholder="e.g. exam@college.edu"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Designation Title</label>
                  <input
                    type="text"
                    value={newStaffDesignation}
                    onChange={(e) => setNewStaffDesignation(e.target.value)}
                    placeholder="e.g. MSBTE Exam Officer"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Delegated Desk</label>
                  <select
                    value={selectedDeskScope}
                    onChange={(e) => setSelectedDeskScope(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold"
                  >
                    <option value="EXAM_CELL">MSBTE Exam Cell</option>
                    <option value="ACCOUNTS">FFC/FRA Accounts</option>
                    <option value="PHARMACY_STORES">Stores & Solvents</option>
                    <option value="STUDENT_ADMISSIONS">Admissions & MahaDBT</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assign Access PIN *</label>
                  <input
                    type="password"
                    value={newStaffPin}
                    onChange={(e) => setNewStaffPin(e.target.value)}
                    placeholder="e.g. 5678"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold"
                  />
                </div>
              </div>

              <button
                onClick={handleCreateRole}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                <PlusCircle className="w-4 h-4" /> Issue Officer Credentials
              </button>
            </div>

            {/* Existing Roles in this Institute */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <h3 className="text-sm font-extrabold text-slate-900 mb-3">
                Active Staff & Desk Officers for {sessionTenant?.name}
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {users.filter((u) => u.instituteId === sessionTenant?.id).map((u) => (
                  <div key={u.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{u.name}</span>
                      <span className="text-slate-400 ml-2">({u.email})</span>
                      <div className="text-[11px] text-blue-600 font-medium">{u.designationTitle}</div>
                    </div>
                    <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-bold">
                      Scope: {u.allowedDesks.join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW B: BLANK OPERATIONAL DESK VIEW (NO MOCK DATA) */}
        {activeDesk !== "OVERVIEW" && activeDesk !== "ROLE_MANAGEMENT" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  LIVE OPERATIONAL DESK
                </span>
                <h2 className="text-lg font-extrabold text-slate-900">{activeDesk.replace("_", " ")} Register</h2>
                <p className="text-xs text-slate-500">Official live statutory register. Starts completely blank.</p>
              </div>

              <button
                onClick={() => setShowAddEntryModal(true)}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Add New Record
              </button>
            </div>

            {/* Blank State Table */}
            {deskRecords.length === 0 ? (
              <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-xl">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <div className="text-xs font-bold text-slate-700">No Records Found in {activeDesk}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  All mock records have been removed. Click "Add New Record" to log your first verified statutory entry.
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                      <th className="pb-2">Record ID</th>
                      <th className="pb-2">Primary Title / Item</th>
                      <th className="pb-2">Category / Spec</th>
                      <th className="pb-2">Reference / Amount</th>
                      <th className="pb-2">Logged By</th>
                      <th className="pb-2 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {deskRecords.map((r) => (
                      <tr key={r.id} className="text-slate-700">
                        <td className="py-2.5 font-mono font-bold text-slate-900">{r.id}</td>
                        <td className="py-2.5 font-semibold text-slate-900">{r.field1}</td>
                        <td className="py-2.5 text-slate-600">{r.field2 || "-"}</td>
                        <td className="py-2.5 text-slate-600 font-mono">{r.field3 || "-"}</td>
                        <td className="py-2.5 text-blue-600 font-medium">{r.officer}</td>
                        <td className="py-2.5 text-slate-400 text-right">{r.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* VIEW C: OVERVIEW & LEDGER */}
        {activeDesk === "OVERVIEW" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase">Institutional Summary</span>
                <h2 className="text-xl font-black text-slate-900 mt-0.5">{sessionTenant?.name}</h2>
                <div className="text-xs text-slate-500 mt-1">
                  Trust: {sessionTenant?.trustName} • Location: {sessionTenant?.location}
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-mono">
                <div className="text-[10px] text-slate-400 font-sans font-bold uppercase">License Key</div>
                <div className="font-bold text-slate-800">{sessionTenant?.licenseKey}</div>
              </div>
            </div>

            {/* Audit Trail */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-emerald-600" /> Tamper-Evident Ledger
                </h3>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                  Append-Only Chained
                </span>
              </div>
              {auditLedger.length === 0 ? (
                <div className="text-xs text-slate-400 py-6 text-center">
                  Ledger active. Any entries created by desk officers will appear here with cryptographic hashes.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 text-xs">
                  {auditLedger.map((l) => (
                    <div key={l.id} className="py-2 flex items-center justify-between text-slate-600">
                      <div>
                        <span className="font-bold text-slate-800">{l.actor}</span>
                        <span className="text-slate-400 mx-1.5">•</span>
                        <span>{l.details}</span>
                      </div>
                      <code className="text-[10px] text-emerald-600 font-mono font-bold">{l.hash}</code>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Entry Creator Modal */}
      {showAddEntryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-sm font-black text-slate-900 mb-1">Add Entry to {activeDesk}</h3>
            <p className="text-xs text-slate-500 mb-4">Logged directly under {sessionUser.name}</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Primary Title / Subject / Name *</label>
                <input
                  type="text"
                  value={entryField1}
                  onChange={(e) => setEntryField1(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Specification / Classification / Category</label>
                <input
                  type="text"
                  value={entryField2}
                  onChange={(e) => setEntryField2(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Reference No / Serial / Amount</label>
                <input
                  type="text"
                  value={entryField3}
                  onChange={(e) => setEntryField3(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowAddEntryModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBlankRecord}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
