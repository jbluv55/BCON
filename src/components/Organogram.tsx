import { useState } from 'react';
import { ArrowDown, ShieldCheck, HelpCircle } from 'lucide-react';

interface TreeNodeProps {
  title: string;
  role: string;
  isActive: boolean;
  onHover: () => void;
}

function NodeCard({ title, role, isActive, onHover }: TreeNodeProps) {
  return (
    <button
      onMouseEnter={onHover}
      onClick={onHover}
      className={`p-4 rounded-none shadow-sm border-2 text-center transition-all duration-300 w-full max-w-[240px] focus:outline-none cursor-pointer text-left sm:text-center ${
        isActive
          ? 'bg-teal-950 text-white border-amber-500 shadow-md scale-[1.03] z-10'
          : 'bg-white text-teal-950 border-teal-950/80 hover:border-amber-500 hover:bg-amber-50/20'
      }`}
    >
      <span className={`text-[9px] font-mono font-black uppercase tracking-widest block mb-1 ${isActive ? 'text-amber-400' : 'text-amber-600'}`}>
        {title}
      </span>
      <p className="text-xs sm:text-sm font-extrabold font-sans uppercase tracking-wide leading-snug">
        {role}
      </p>
    </button>
  );
}

export default function OrganogramHierarchy() {
  const [activeNode, setActiveNode] = useState<string>('governing');

  const nodes = {
    governing: {
      title: 'Supreme Governing Body',
      role: 'Governing Council',
      desc: 'Formulates college policies, regulates academic standards, coordinates budgets, and oversees national accreditation alignments.'
    },
    provost: {
      title: 'Chief Academic Executive',
      role: 'Provost',
      desc: 'Directs the administrative and academic operations of the college, ensuring high quality instructional delivery and student outcomes.'
    },
    bursar: {
      title: 'Financial Management',
      role: 'Bursar',
      desc: 'Maintains institutional treasury, processes student tuition accounts, and coordinates college fiscal assets.'
    },
    registrar: {
      title: 'Administrative Registry',
      role: 'Registrar',
      desc: 'Maintains admissions criteria, administers transcripts and academic archives, and oversees institutional record keeping.'
    },
    admin: {
      title: 'Support & Records',
      role: 'Administrative Officers',
      desc: 'Coordinates human resources, organizes logistics, and processes general student admissions archives.'
    },
    secretaries: {
      title: 'Administrative Office Support',
      role: 'Secretaries',
      desc: 'Assists with correspondence, maintains executive office schedules, and drafts formal communication folders.'
    },
    clerks: {
      title: 'Registry & Operations',
      role: 'Clerks',
      desc: 'Handles routine registry entries, organizes files, and assists with storage, mail, and library desk services.'
    },
    cleaners: {
      title: 'Maintenance & Security',
      role: 'Cleaners, Drivers, Security Guards etc.',
      desc: 'Keeps facilities hygienic, executes safe campus transport systems, and maintains perimeter protection protocols.'
    },
    deputy: {
      title: 'Academic Administration',
      role: 'Deputy Provost',
      desc: 'Supervises departmental course frameworks, designs exam schedules, and directly monitors tutor assignments.'
    },
    hods: {
      title: 'Academic Headship',
      role: 'Head of Departments',
      desc: 'Oversees specialized training divisions such as General Nursing, Midwifery, and basic medical sciences.'
    },
    tutors: {
      title: 'Instructional Staff',
      role: 'Tutors',
      desc: 'Delivers curriculum lessons, directs simulation clinic practices, and mentors hospital ward postings.'
    },
    students: {
      title: 'Academic Body',
      role: 'Students',
      desc: 'Undergoes instructional study, engages in laboratory clinical practice, and fulfills real hospital care duties.'
    }
  };

  return (
    <div className="bg-white py-12 px-4 rounded-3xl border border-teal-100 shadow-xs" id="organogram_interactive">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
          Institutional Hierarchy
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-teal-950 tracking-tight mt-2 font-display">
          Leadership & Governance Structure
        </h3>
        <p className="text-sm text-gray-600 mt-2 max-w-2xl mx-auto leading-relaxed">
          The chart below represents the official organogram displayed in the reception of the administrative offices. Click or hover on any administrative node to view their role and scope.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* INTERACTIVE HIERARCHY TREE */}
        <div className="lg:col-span-8 flex flex-col items-center py-4 relative" id="organogram_tree_visual">
          
          {/* Main Title Banner matching physical board exactly */}
          <div className="w-full max-w-2xl text-center border-4 border-teal-950 p-4 sm:p-6 mb-8 bg-white shadow-md relative">
            <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-teal-950 tracking-wider uppercase font-display leading-tight">
              Bridge College of Nursing and Health Sciences
            </h2>
            <div className="w-full h-0.5 bg-teal-950 my-2" />
            <h3 className="text-xs sm:text-sm font-bold text-teal-950 font-mono tracking-widest uppercase">
              Organogram
            </h3>
          </div>

          {/* LEVEL 1: GOVERNING COUNCIL */}
          <div className="flex flex-col items-center w-full">
            <NodeCard
              title="Level 1"
              role={nodes.governing.role}
              isActive={activeNode === 'governing'}
              onHover={() => setActiveNode('governing')}
            />
            {/* Arrow down to Level 2 */}
            <div className="w-0.5 h-10 bg-teal-950 relative flex items-end justify-center">
              <span className="border-l-4 border-r-4 border-t-4 border-transparent border-t-teal-950 absolute -bottom-1" />
            </div>
          </div>

          {/* LEVEL 2: PROVOST */}
          <div className="flex flex-col items-center w-full">
            <NodeCard
              title="Level 2"
              role={nodes.provost.role}
              isActive={activeNode === 'provost'}
              onHover={() => setActiveNode('provost')}
            />
          </div>

          {/* Desktop connecting lines system */}
          <div className="hidden md:flex flex-col items-center w-full max-w-3xl">
            {/* Vertical drop from Provost to horizontal bar */}
            <div className="w-0.5 h-8 bg-teal-950" />
            
            {/* Horizontal branch bar */}
            <div className="w-[80%] h-0.5 bg-teal-950 flex justify-between relative">
              {/* Drop arrow on Left to BURSAR */}
              <div className="absolute left-0 w-0.5 h-8 bg-teal-950 -bottom-8 flex items-end justify-center">
                <span className="border-l-4 border-r-4 border-t-4 border-transparent border-t-teal-950 absolute -bottom-1" />
              </div>
              
              {/* Drop arrow in Center to REGISTRAR */}
              <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-8 bg-teal-950 -bottom-8 flex items-end justify-center">
                <span className="border-l-4 border-r-4 border-t-4 border-transparent border-t-teal-950 absolute -bottom-1" />
              </div>
              
              {/* Drop arrow on Right to DEPUTY PROVOST */}
              <div className="absolute right-0 w-0.5 h-8 bg-teal-950 -bottom-8 flex items-end justify-center">
                <span className="border-l-4 border-r-4 border-t-4 border-transparent border-t-teal-950 absolute -bottom-1" />
              </div>
            </div>
            
            {/* Spacer for vertical drops */}
            <div className="h-8" />
          </div>

          {/* Mobile vertical line connecting down */}
          <div className="flex md:hidden w-0.5 h-8 bg-teal-950 relative items-end justify-center">
            <span className="border-l-4 border-r-4 border-t-4 border-transparent border-t-teal-950 absolute -bottom-1" />
          </div>

          {/* Level 3 and lower: Tree columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 w-full mt-2" id="organogram_columns_group">
            
            {/* COLUMN 1: BURSAR BRANCH */}
            <div className="flex flex-col items-center">
              {/* Mobile connector line */}
              <div className="flex md:hidden w-0.5 h-4 bg-teal-950 relative items-end justify-center mb-1">
                <span className="border-l-3 border-r-3 border-t-3 border-transparent border-t-teal-950 absolute -bottom-1" />
              </div>
              <NodeCard
                title="Bursary"
                role={nodes.bursar.role}
                isActive={activeNode === 'bursar'}
                onHover={() => setActiveNode('bursar')}
              />
              <div className="hidden md:block text-[10px] font-mono text-gray-400 mt-4 italic text-center max-w-[160px]">
                (Terminal Office)
              </div>
            </div>

            {/* COLUMN 2: REGISTRAR BRANCH (MIDDLE COLUMN) */}
            <div className="flex flex-col items-center">
              {/* Mobile connector line */}
              <div className="flex md:hidden w-0.5 h-4 bg-teal-950 relative items-end justify-center mb-1">
                <span className="border-l-3 border-r-3 border-t-3 border-transparent border-t-teal-950 absolute -bottom-1" />
              </div>
              
              {/* Registrar Node */}
              <NodeCard
                title="Secretariat"
                role={nodes.registrar.role}
                isActive={activeNode === 'registrar'}
                onHover={() => setActiveNode('registrar')}
              />

              <div className="w-0.5 h-10 bg-teal-950 relative flex items-end justify-center">
                <span className="border-l-4 border-r-4 border-t-4 border-transparent border-t-teal-950 absolute -bottom-1" />
              </div>

              {/* Administrative Officers Node */}
              <NodeCard
                title="Administration"
                role={nodes.admin.role}
                isActive={activeNode === 'admin'}
                onHover={() => setActiveNode('admin')}
              />

              <div className="w-0.5 h-10 bg-teal-950 relative flex items-end justify-center">
                <span className="border-l-4 border-r-4 border-t-4 border-transparent border-t-teal-950 absolute -bottom-1" />
              </div>

              {/* Secretaries Node */}
              <NodeCard
                title="Support Core"
                role={nodes.secretaries.role}
                isActive={activeNode === 'secretaries'}
                onHover={() => setActiveNode('secretaries')}
              />

              <div className="w-0.5 h-10 bg-teal-950 relative flex items-end justify-center">
                <span className="border-l-4 border-r-4 border-t-4 border-transparent border-t-teal-950 absolute -bottom-1" />
              </div>

              {/* Clerks Node */}
              <NodeCard
                title="Office Clerks"
                role={nodes.clerks.role}
                isActive={activeNode === 'clerks'}
                onHover={() => setActiveNode('clerks')}
              />

              <div className="w-0.5 h-10 bg-teal-950 relative flex items-end justify-center">
                <span className="border-l-4 border-r-4 border-t-4 border-transparent border-t-teal-950 absolute -bottom-1" />
              </div>

              {/* Cleaners, Drivers, Security Guards etc. Node */}
              <NodeCard
                title="Services & Security"
                role={nodes.cleaners.role}
                isActive={activeNode === 'cleaners'}
                onHover={() => setActiveNode('cleaners')}
              />
            </div>

            {/* COLUMN 3: DEPUTY PROVOST BRANCH (RIGHT COLUMN) */}
            <div className="flex flex-col items-center">
              {/* Mobile connector line */}
              <div className="flex md:hidden w-0.5 h-4 bg-teal-950 relative items-end justify-center mb-1">
                <span className="border-l-3 border-r-3 border-t-3 border-transparent border-t-teal-950 absolute -bottom-1" />
              </div>

              {/* Deputy Provost Node */}
              <NodeCard
                title="Academic Lead"
                role={nodes.deputy.role}
                isActive={activeNode === 'deputy'}
                onHover={() => setActiveNode('deputy')}
              />

              <div className="w-0.5 h-10 bg-teal-950 relative flex items-end justify-center">
                <span className="border-l-4 border-r-4 border-t-4 border-transparent border-t-teal-950 absolute -bottom-1" />
              </div>

              {/* Head of Departments Node */}
              <NodeCard
                title="Faculty HODs"
                role={nodes.hods.role}
                isActive={activeNode === 'hods'}
                onHover={() => setActiveNode('hods')}
              />

              <div className="w-0.5 h-10 bg-teal-950 relative flex items-end justify-center">
                <span className="border-l-4 border-r-4 border-t-4 border-transparent border-t-teal-950 absolute -bottom-1" />
              </div>

              {/* Tutors Node */}
              <NodeCard
                title="Lecturer Guild"
                role={nodes.tutors.role}
                isActive={activeNode === 'tutors'}
                onHover={() => setActiveNode('tutors')}
              />

              <div className="w-0.5 h-10 bg-teal-950 relative flex items-end justify-center">
                <span className="border-l-4 border-r-4 border-t-4 border-transparent border-t-teal-950 absolute -bottom-1" />
              </div>

              {/* Students Node */}
              <NodeCard
                title="Nurses in Training"
                role={nodes.students.role}
                isActive={activeNode === 'students'}
                onHover={() => setActiveNode('students')}
              />
            </div>

          </div>

        </div>

        {/* NODE DESCRIPTION DISCLOSURE */}
        <div className="lg:col-span-4 sticky top-24 bg-teal-950 text-teal-50 p-6 rounded-2xl shadow-xl border-2 border-teal-900" id="nodes_helper_box">
          <div className="flex items-center gap-2 text-amber-400 mb-4">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <h4 className="font-bold text-xs font-mono uppercase tracking-widest">
              Functional Scope
            </h4>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-extrabold font-sans text-white border-b border-teal-900 pb-2 capitalize tracking-tight">
              {nodes[activeNode as keyof typeof nodes].role}
            </h3>
            <span className="text-[10px] font-mono text-amber-400 font-extrabold uppercase tracking-widest block">
              {nodes[activeNode as keyof typeof nodes].title}
            </span>
            <p className="text-sm text-teal-100 leading-relaxed font-sans">
              {nodes[activeNode as keyof typeof nodes].desc}
            </p>
            
            <div className="bg-teal-900/60 p-4 rounded-xl border border-teal-800 text-[10px] leading-relaxed font-sans text-teal-200 mt-4">
              <span className="font-bold text-amber-400 block mb-1">PROMPT ALIGNED:</span>
              This structure corresponds precisely to the official Organogram board displayed inside the physical administrative offices reception of Bridge College of Nursing.
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs font-sans text-teal-300">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Hover or tap other nodes to examine work scopes.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
