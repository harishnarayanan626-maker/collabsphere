import React, { useState } from 'react';
import { MYSQL_SCHEMA_SQL, SCHEMA_TABLES } from '../data/mysqlSchema';
import { SPRING_BOOT_FILES, SpringFile } from '../data/springBootProject';

export const MySQLSchemaView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'springboot' | 'sql' | 'erd' | 'tables' | 'query'>('springboot');
  const [selectedTable, setSelectedTable] = useState<string>('Task');
  const [selectedSpringFile, setSelectedSpringFile] = useState<SpringFile>(SPRING_BOOT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [fileCopied, setFileCopied] = useState(false);
  const [customQuery, setCustomQuery] = useState('SELECT * FROM Task WHERE status = "To Do";');
  const [queryResult, setQueryResult] = useState<string | null>(null);

  const handleCopySQL = () => {
    navigator.clipboard.writeText(MYSQL_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopySpringFile = () => {
    navigator.clipboard.writeText(selectedSpringFile.content);
    setFileCopied(true);
    setTimeout(() => setFileCopied(false), 2500);
  };

  const handleDownloadSpringFile = () => {
    const blob = new Blob([selectedSpringFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedSpringFile.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadSQL = () => {
    const blob = new Blob([MYSQL_SCHEMA_SQL], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'collabsphere_schema.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRunQuery = () => {
    if (customQuery.toLowerCase().includes('task')) {
      setQueryResult(
        JSON.stringify(
          [
            { id: 1, project_id: 1, title: 'Literature Review: Deep Learning', assigned_to: 1, status: 'To Do', due_date: '2024-10-12', ideal_progress_pct: '100.00', actual_progress_pct: '30.00' },
            { id: 2, project_id: 1, title: 'Data Pre-processing Script', assigned_to: 2, status: 'To Do', due_date: '2024-10-15', ideal_progress_pct: '80.00', actual_progress_pct: '75.00' },
          ],
          null,
          2
        )
      );
    } else if (customQuery.toLowerCase().includes('student')) {
      setQueryResult(
        JSON.stringify(
          [
            { id: 1, name: 'Alex Chen', email: 'alex.chen@university.edu', role: 'Team Lead' },
            { id: 2, name: 'Sarah Johnson', email: 'sarah.j@university.edu', role: 'Student' },
          ],
          null,
          2
        )
      );
    } else {
      setQueryResult('Query executed successfully. 4 rows affected (0.02 sec).');
    }
  };

  const currentTableObj = SCHEMA_TABLES.find((t) => t.name === selectedTable) || SCHEMA_TABLES[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-lg">
              <span className="material-symbols-outlined text-xl">database</span>
            </div>
            <h1 className="font-bold text-2xl text-slate-900 tracking-tight">CollabSphere MySQL Schema</h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Complete MySQL DDL statements with Foreign Keys, Composite Keys, B-Tree Indexes, and Seed Data.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopySQL}
            className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 font-medium text-xs rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-slate-500">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL'}</span>
          </button>

          <button
            onClick={handleDownloadSQL}
            className="px-4 py-2 bg-indigo-600 text-white font-medium text-xs rounded-lg shadow-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">file_download</span>
            <span>Download .sql File</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold overflow-x-auto custom-scroll">
        <button
          onClick={() => setActiveTab('springboot')}
          className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'springboot'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-base">local_cafe</span>
          <span>Spring Boot JPA (Java)</span>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold ml-1">
            NEW
          </span>
        </button>

        <button
          onClick={() => setActiveTab('sql')}
          className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'sql'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-base">code</span>
          <span>Raw DDL CREATE Statements</span>
        </button>

        <button
          onClick={() => setActiveTab('tables')}
          className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'tables'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-base">table_chart</span>
          <span>Entity Table Inspector</span>
        </button>

        <button
          onClick={() => setActiveTab('erd')}
          className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'erd'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-base">account_tree</span>
          <span>ERD Relationship Diagram</span>
        </button>

        <button
          onClick={() => setActiveTab('query')}
          className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'query'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-base">terminal</span>
          <span>SQL Query Simulator</span>
        </button>
      </div>

      {/* TAB 0: SPRING BOOTS JPA PROJECT */}
      {activeTab === 'springboot' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* File Explorer Tree */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  CollabSphere Project Structure
                </h3>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded">
                  Java 17 / JPA
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Spring Data JPA entities, repositories & application.properties for MySQL.
              </p>
            </div>

            <div className="space-y-1 max-h-[550px] overflow-y-auto custom-scroll pr-1">
              {SPRING_BOOT_FILES.map((f) => {
                const isSelected = selectedSpringFile.path === f.path;
                return (
                  <button
                    key={f.path}
                    onClick={() => setSelectedSpringFile(f)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="material-symbols-outlined text-base shrink-0">
                        {f.type === 'entity'
                          ? 'data_object'
                          : f.type === 'config'
                          ? 'settings'
                          : f.type === 'controller'
                          ? 'api'
                          : f.type === 'service'
                          ? 'auto_awesome'
                          : f.type === 'dto'
                          ? 'dataset'
                          : f.type === 'repository'
                          ? 'database'
                          : f.type === 'pom'
                          ? 'inventory_2'
                          : 'code'}
                      </span>
                      <span className="truncate">{f.filename}</span>
                    </div>
                    {f.type === 'entity' && (
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-indigo-500 text-white'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        @Entity
                      </span>
                    )}
                    {f.type === 'dto' && (
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-indigo-500 text-white'
                            : 'bg-cyan-100 text-cyan-800'
                        }`}
                      >
                        DTO
                      </span>
                    )}
                    {f.type === 'service' && (
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-indigo-500 text-white'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        @Service
                      </span>
                    )}
                    {f.type === 'controller' && (
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-indigo-500 text-white'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        REST
                      </span>
                    )}
                    {f.type === 'repository' && (
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-indigo-500 text-white'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        Repo
                      </span>
                    )}
                    {f.type === 'config' && (
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-indigo-500 text-white' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        Props
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer */}
          <div className="lg:col-span-8 bg-slate-900 text-slate-100 rounded-xl p-6 shadow-md border border-slate-800 space-y-4 font-mono text-xs overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-400 text-lg">
                    {selectedSpringFile.type === 'entity' ? 'data_object' : 'description'}
                  </span>
                  <span className="font-sans font-bold text-sm text-slate-100">
                    {selectedSpringFile.path}
                  </span>
                </div>
                <p className="font-sans text-[11px] text-slate-400 mt-0.5">
                  {selectedSpringFile.description}
                </p>
              </div>

              <div className="flex items-center gap-2 font-sans shrink-0">
                <button
                  onClick={handleCopySpringFile}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">
                    {fileCopied ? 'check' : 'content_copy'}
                  </span>
                  <span>{fileCopied ? 'Copied' : 'Copy Code'}</span>
                </button>

                <button
                  onClick={handleDownloadSpringFile}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span>Save File</span>
                </button>
              </div>
            </div>

            <pre className="max-h-[500px] overflow-y-auto custom-scroll text-slate-300 leading-relaxed p-2 select-all whitespace-pre">
              {selectedSpringFile.content}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 1: RAW SQL STATEMENTS */}
      {activeTab === 'sql' && (
        <div className="bg-slate-900 text-slate-100 rounded-xl p-6 shadow-md border border-slate-800 space-y-4 font-mono text-xs overflow-hidden">
          <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-3">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="font-sans text-xs ml-2 font-semibold text-slate-200">collabsphere_schema.sql</span>
            </span>
            <span className="text-[10px] text-slate-400">MySQL 8.0 Compatible</span>
          </div>

          <pre className="max-h-[600px] overflow-y-auto custom-scroll text-slate-300 leading-relaxed p-2 select-all">
            {MYSQL_SCHEMA_SQL}
          </pre>
        </div>
      )}

      {/* TAB 2: TABLE INSPECTOR */}
      {activeTab === 'tables' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Table List Sidebar */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 px-2 mb-2">
              Schema Tables ({SCHEMA_TABLES.length})
            </h3>
            {SCHEMA_TABLES.map((t) => (
              <button
                key={t.name}
                onClick={() => setSelectedTable(t.name)}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-left text-xs font-semibold transition-all cursor-pointer ${
                  selectedTable === t.name
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">table_rows</span>
                  <span>{t.name}</span>
                </div>
                <span className="text-[10px] opacity-80">{t.columns.length} cols</span>
              </button>
            ))}
          </div>

          {/* Table Detail View */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-xl text-slate-900">{currentTableObj.name}</h2>
                <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-md">
                  Table
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{currentTableObj.description}</p>
            </div>

            {/* Column Schema Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Column Name</th>
                    <th className="py-2.5 px-4">Data Type</th>
                    <th className="py-2.5 px-4">Key</th>
                    <th className="py-2.5 px-4">Nullable</th>
                    <th className="py-2.5 px-4">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentTableObj.columns.map((col) => (
                    <tr key={col.name} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{col.name}</td>
                      <td className="py-3 px-4 font-mono text-indigo-600">{col.type}</td>
                      <td className="py-3 px-4">
                        {col.key === 'PRI' && (
                          <span className="bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded">
                            PRIMARY KEY
                          </span>
                        )}
                        {col.key === 'MUL' && (
                          <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded">
                            FOREIGN KEY
                          </span>
                        )}
                        {col.key === 'UNI' && (
                          <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
                            UNIQUE
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{col.nullable ? 'YES' : 'NO'}</td>
                      <td className="py-3 px-4 text-slate-600">{col.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Indexes & FK Constraints */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-bold text-xs text-slate-900 mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-indigo-600">tag</span>
                  Indexes
                </h4>
                <ul className="space-y-1 font-mono text-[11px] text-slate-600">
                  {currentTableObj.indexes.map((idx, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <span className="text-indigo-600">•</span>
                      <span>{idx}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-bold text-xs text-slate-900 mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-indigo-600">link</span>
                  Foreign Key Constraints
                </h4>
                {currentTableObj.foreignKeys.length > 0 ? (
                  <ul className="space-y-1 font-mono text-[11px] text-slate-600">
                    {currentTableObj.foreignKeys.map((fk, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <span className="text-indigo-600">•</span>
                        <span>{fk}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400">No Foreign Keys on this table.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ERD DIAGRAM */}
      {activeTab === 'erd' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600">account_tree</span>
              <span>Entity Relationship Diagram (ERD)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Visual breakdown of primary keys, foreign key references, and table cardinality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {/* Student */}
            <div className="p-4 bg-slate-50 rounded-lg border-2 border-indigo-500 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="font-bold text-sm text-indigo-700">Student</span>
                <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded">PK: id</span>
              </div>
              <ul className="text-xs font-mono space-y-1 text-slate-600">
                <li>• id (INT)</li>
                <li>• name (VARCHAR)</li>
                <li>• email (UNIQUE)</li>
                <li>• password_hash</li>
                <li>• role (VARCHAR)</li>
              </ul>
            </div>

            {/* Team */}
            <div className="p-4 bg-slate-50 rounded-lg border-2 border-indigo-500 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="font-bold text-sm text-indigo-700">Team</span>
                <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded">PK: id</span>
              </div>
              <ul className="text-xs font-mono space-y-1 text-slate-600">
                <li>• id (INT)</li>
                <li>• team_name (VARCHAR)</li>
                <li>• created_at</li>
              </ul>
            </div>

            {/* Team_Member */}
            <div className="p-4 bg-slate-50 rounded-lg border-2 border-emerald-500 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="font-bold text-sm text-emerald-700">Team_Member</span>
                <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded">Composite PK</span>
              </div>
              <ul className="text-xs font-mono space-y-1 text-slate-600">
                <li className="font-bold text-indigo-600">• team_id (FK → Team)</li>
                <li className="font-bold text-indigo-600">• student_id (FK → Student)</li>
                <li>• joined_date</li>
              </ul>
            </div>

            {/* Project */}
            <div className="p-4 bg-slate-50 rounded-lg border-2 border-indigo-500 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="font-bold text-sm text-indigo-700">Project</span>
                <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded">PK: id</span>
              </div>
              <ul className="text-xs font-mono space-y-1 text-slate-600">
                <li>• id (INT)</li>
                <li className="font-bold text-indigo-600">• team_id (FK → Team)</li>
                <li>• project_name</li>
                <li className="font-bold text-indigo-600">• faculty_id (FK → Faculty)</li>
              </ul>
            </div>

            {/* Task */}
            <div className="p-4 bg-slate-50 rounded-lg border-2 border-rose-500 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="font-bold text-sm text-rose-700">Task</span>
                <span className="text-[10px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded">PK: id</span>
              </div>
              <ul className="text-xs font-mono space-y-1 text-slate-600">
                <li>• id (INT)</li>
                <li className="font-bold text-indigo-600">• project_id (FK → Project)</li>
                <li>• title, description</li>
                <li className="font-bold text-indigo-600">• assigned_to (FK → Student)</li>
                <li>• status, priority</li>
                <li>• ideal_progress_pct</li>
                <li>• actual_progress_pct</li>
              </ul>
            </div>

            {/* File */}
            <div className="p-4 bg-slate-50 rounded-lg border-2 border-indigo-500 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="font-bold text-sm text-indigo-700">File</span>
                <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded">PK: id</span>
              </div>
              <ul className="text-xs font-mono space-y-1 text-slate-600">
                <li>• id (INT)</li>
                <li className="font-bold text-indigo-600">• project_id (FK → Project)</li>
                <li>• filename, version</li>
                <li className="font-bold text-indigo-600">• uploaded_by (FK → Student)</li>
              </ul>
            </div>

            {/* Contribution_Log */}
            <div className="p-4 bg-slate-50 rounded-lg border-2 border-amber-500 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="font-bold text-sm text-amber-700">Contribution_Log</span>
                <span className="text-[10px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded">PK: id</span>
              </div>
              <ul className="text-xs font-mono space-y-1 text-slate-600">
                <li>• id (INT)</li>
                <li className="font-bold text-indigo-600">• student_id (FK → Student)</li>
                <li className="font-bold text-indigo-600">• project_id (FK → Project)</li>
                <li>• action_type</li>
                <li>• timestamp</li>
              </ul>
            </div>

            {/* Faculty */}
            <div className="p-4 bg-slate-50 rounded-lg border-2 border-indigo-500 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="font-bold text-sm text-indigo-700">Faculty</span>
                <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded">PK: id</span>
              </div>
              <ul className="text-xs font-mono space-y-1 text-slate-600">
                <li>• id (INT)</li>
                <li>• name (VARCHAR)</li>
                <li>• email (UNIQUE)</li>
                <li>• department</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: QUERY SIMULATOR */}
      {activeTab === 'query' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div>
            <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600">terminal</span>
              <span>SQL Live Query Simulator</span>
            </h2>
            <p className="text-xs text-slate-500">
              Test SQL commands against the seed database schema in real time.
            </p>
          </div>

          <div className="space-y-2">
            <textarea
              rows={3}
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              className="w-full bg-slate-900 text-slate-100 font-mono text-xs p-4 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCustomQuery('SELECT * FROM Task WHERE status = "To Do";')}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-md hover:bg-slate-200 cursor-pointer"
              >
                Reset Example
              </button>
              <button
                onClick={handleRunQuery}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg shadow-xs hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">play_arrow</span>
                <span>Execute Query</span>
              </button>
            </div>
          </div>

          {queryResult && (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 font-mono text-xs">
              <p className="font-bold text-slate-900">Execution Output:</p>
              <pre className="text-indigo-600 overflow-x-auto whitespace-pre-wrap">{queryResult}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
