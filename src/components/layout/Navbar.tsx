import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  PlusCircle, 
  Sparkles, 
  Bell, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronDown,
  Layers,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const Navbar: React.FC = () => {
  const { currentUser, switchUser, availableProfiles } = useAuth();
  const { matches, notifications, claims, markNotificationRead, markAllNotificationsRead } = useData();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Active matches count for current user
  const userMatchesCount = matches.filter(m => 
    m.status === 'active' && 
    (m.lostItem?.userId === currentUser?.id || m.foundItem?.userId === currentUser?.id)
  ).length;

  // Active claims for current user
  const userClaimsCount = claims.filter(c => 
    c.claimantId === currentUser?.id || c.reporterId === currentUser?.id
  ).length;

  const unreadNotifs = notifications.filter(n => !n.read);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
                Findora
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  Network
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block -mt-1 font-medium">Smart Lost & Found</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/browse"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive('/browse')
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Browse Items
            </Link>

            <Link
              to="/matches"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium relative transition-colors flex items-center gap-1.5 ${
                isActive('/matches')
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Possible Matches
              {userMatchesCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full leading-none">
                  {userMatchesCount}
                </span>
              )}
            </Link>

            <Link
              to="/claims"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium relative transition-colors flex items-center gap-1.5 ${
                isActive('/claims')
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 text-slate-500" />
              Claims
              {userClaimsCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-full leading-none">
                  {userClaimsCount}
                </span>
              )}
            </Link>

            <Link
              to="/dashboard"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/dashboard')
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4 text-slate-500" />
              Analytics
            </Link>

            <Link
              to="/how-it-works"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive('/how-it-works')
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              How It Works
            </Link>
          </div>

          {/* Action CTAs & Profile Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick Report Buttons */}
            <div className="hidden sm:flex items-center gap-1.5">
              <Link
                to="/report-lost"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Report Lost
              </Link>
              <Link
                to="/report-found"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                Report Found
              </Link>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {/* Notification Drawer Popover */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-semibold text-sm text-slate-800">
                      Notifications ({unreadNotifs.length} new)
                    </span>
                    {unreadNotifs.length > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 py-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 text-center">No notifications yet.</p>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            setNotifDropdownOpen(false);
                          }}
                          className={`p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                            n.read ? 'hover:bg-slate-50' : 'bg-teal-50/60 hover:bg-teal-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-900">{n.title}</span>
                            {!n.read && <span className="w-2 h-2 rounded-full bg-teal-500"></span>}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Persona Switcher / Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white shadow-sm transition-all text-left"
              >
                {currentUser?.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                    {currentUser?.fullName.charAt(0) || 'U'}
                  </div>
                )}
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-semibold text-slate-900 leading-tight flex items-center gap-1">
                    {currentUser?.fullName}
                    {currentUser?.isVerified && (
                      <CheckCircle2 className="w-3 h-3 text-teal-600 inline" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide">
                    {currentUser?.role === 'moderator' ? 'Campus Officer' : 'Verified User'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Persona Selector Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Active Persona (Demo)
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Test both sides of reporting, AI matching, and claims.
                    </p>
                  </div>

                  <div className="py-1">
                    {availableProfiles.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          switchUser(p.id);
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg text-xs transition-colors ${
                          currentUser?.id === p.id
                            ? 'bg-teal-50 text-teal-900 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <img
                          src={p.avatarUrl}
                          alt={p.fullName}
                          className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                        />
                        <div className="flex-1 truncate">
                          <p className="font-semibold text-slate-900 truncate">{p.fullName}</p>
                          <p className="text-[10px] text-slate-500 truncate">{p.community}</p>
                        </div>
                        {currentUser?.id === p.id && (
                          <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-2">
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                    >
                      <User className="w-3.5 h-3.5" />
                      View Full Profile
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/browse"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Browse All Items
          </Link>
          <Link
            to="/matches"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Possible Matches
            </span>
            {userMatchesCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full">
                {userMatchesCount}
              </span>
            )}
          </Link>
          <Link
            to="/claims"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              Claims & Proof
            </span>
            {userClaimsCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-full">
                {userClaimsCount}
              </span>
            )}
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Analytics & Reports
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            How It Works
          </Link>
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
            <Link
              to="/report-lost"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2 text-sm font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg"
            >
              Report Lost
            </Link>
            <Link
              to="/report-found"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2 text-sm font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg"
            >
              Report Found
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
