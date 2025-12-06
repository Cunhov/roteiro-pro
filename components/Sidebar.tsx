
import React, { useState } from 'react';
import { Film, TrendingUp, ChevronLeft, ChevronRight, Lightbulb, Image as ImageIcon, Settings, AlignLeft, ImagePlus } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  disabled: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, disabled }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: AppView; icon: any; label: string }) => (
    <button
      onClick={() => !disabled && setActiveView(view)}
      disabled={disabled}
      className={`
        w-full flex items-center p-3 mb-2 rounded-lg transition-all duration-200 group relative
        ${activeView === view 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <Icon size={24} className={`min-w-[24px] ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
      
      {!isCollapsed && (
        <span className="font-medium whitespace-nowrap overflow-hidden transition-all duration-300 text-left">
          {label}
        </span>
      )}

      {/* Tooltip for collapsed mode */}
      {isCollapsed && (
        <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
          {label}
        </div>
      )}
    </button>
  );

  return (
    <div 
      className={`
        h-screen bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 relative z-20
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Header / Logo Area */}
      <div className="h-20 flex items-center justify-center border-b border-slate-800 p-4">
        {isCollapsed ? (
           <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
             <span className="font-bold text-white text-xl">R</span>
           </div>
        ) : (
          <div className="flex items-center space-x-3 w-full">
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg shadow-lg">
                <Film size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white leading-tight">Roteiro Pro</h1>
              <p className="text-[10px] text-blue-400 font-medium tracking-wide">GEMINI EDITION</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-6 px-3 overflow-y-auto">
        <NavItem view="script-generator" icon={Film} label="Gerador de Roteiro" />
        <NavItem view="niche-analyzer" icon={TrendingUp} label="Analisador de Nichos" />
        <NavItem view="theme-creator" icon={Lightbulb} label="Criador de Temas" />
        <NavItem view="title-description" icon={AlignLeft} label="Título & Descrição" />
        <div className="my-2 border-t border-slate-800 mx-2" />
        <NavItem view="broll-creator" icon={ImageIcon} label="B-Roll Creator" />
        <NavItem view="thumbnail-creator" icon={ImagePlus} label="Criador de Thumbnail" />
      </div>

      {/* Settings & Collapse */}
      <div className="p-4 border-t border-slate-800 flex flex-col gap-2">
         <NavItem view="settings" icon={Settings} label="Configurações AI" />
         
        <div className="flex justify-end mt-2">
            <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
