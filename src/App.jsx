import React, { useState, useEffect } from 'react'; 
import { Plus, Trash2, CheckCircle2, Circle, MessageCircle, ChevronLeft, ChevronRight, Flag }
export default function MillerFamilyDashboard() { 
 const [currentMonth, setCurrentMonth] = useState('2026-05'); 
 const [person, setPerson] = useState('Kacy'); 
 const [allData, setAllData] = useState({}); 
 const [newTaskInputs, setNewTaskInputs] = useState({}); 
 const [expandedAlley, setExpandedAlley] = useState(null); 
 const [showAddMonth, setShowAddMonth] = useState(false); 
 const categories = [ 
 { id: 'legal', name: 'Legal & Administrative', icon: ' ', color: '#8B4513' },  { id: 'career', name: 'Career & Opportunities', icon: ' ', color: '#6B5B95' },  { id: 'home', name: 'Home & Design', icon: ' ', color: '#C1666B' },  { id: 'financial', name: 'Financial Planning', icon: ' ', color: '#D4AF37' },  { id: 'anniversary', name: 'Anniversary & Romance', icon: ' ', color: '#E88B8B' },  { id: 'travel', name: 'Travel & Adventure', icon: ' ', color: '#4A90E2' },  { id: 'family', name: 'Family & Extended Network', icon: ' ', color: '#2D6A4F' },  { id: 'health', name: 'Health & Wellness', icon: ' ', color: '#52B788' },  { id: 'learning', name: 'Learning & Personal Growth', icon: ' ', color: '#9B59B6' },  { id: 'professional', name: 'Professional & Board Exams', icon: ' ', color: '#3498DB' }  { id: 'marriage', name: 'Marriage & Relationship', icon: ' ', color: '#F39C12' },  { id: 'social', name: 'Social & Friendships', icon: ' ', color: '#E74C3C' },  ]; 
 const priorityLevels = [ 
 { level: 'critical', label: 'Critical', color: '#E74C3C' }, 
 { level: 'important', label: 'Important', color: '#F39C12' }, 
 { level: 'nice', label: 'Nice-to-have', color: '#95A5A6' }, 
 ]; 
 // Load data from shared storage 
 useEffect(() => { 
 const loadData = async () => { 
 try { 
 const result = await window.storage.get('miller-family-data');  if (result) setAllData(JSON.parse(result.value)); 
 } catch (e) { 
 console.log('Initializing new storage'); 
 } 
 }; 
 loadData(); 
 }, []);
 // Save data to shared storage 
 const saveData = async (newData) => { 
 setAllData(newData); 
 try { 
 await window.storage.set('miller-family-data', JSON.stringify(newData), true);  } catch (e) { 
 console.error('Save failed:', e); 
 } 
 }; 
 // Ensure month structure exists 
 const ensureMonth = (monthKey) => { 
 const newData = { ...allData }; 
 if (!newData[monthKey]) { 
 newData[monthKey] = { 
 tasks: {}, 
 notes: '', 
 milestones: [], 
 }; 
 categories.forEach((cat) => { 
 newData[monthKey].tasks[cat.id] = []; 
 }); 
 } 
 return newData; 
 }; 
 const monthData = allData[currentMonth] || (() => { 
 const initialized = ensureMonth(currentMonth); 
 saveData(initialized); 
 return initialized[currentMonth]; 
 })(); 
 const addTask = (categoryId) => { 
 const taskText = newTaskInputs[categoryId]?.trim(); 
 if (!taskText) return; 
 const newData = ensureMonth(currentMonth); 
 const priority = 'important'; 
 newData[currentMonth].tasks[categoryId].push({ 
 id: Date.now(), 
 text: taskText, 
 completed: false, 
 completedBy: person, 
 priority, 
 createdAt: new Date().toLocaleDateString(),
 createdBy: person, 
 dueDate: null, 
 }); 
 saveData(newData); 
 setNewTaskInputs({ ...newTaskInputs, [categoryId]: '' }); 
 }; 
 const toggleTask = (categoryId, taskId) => { 
 const newData = { ...allData }; 
 const task = newData[currentMonth].tasks[categoryId].find((t) => t.id === taskId);  if (task) { 
 task.completed = !task.completed; 
 task.completedBy = person; 
 task.completedAt = new Date().toLocaleDateString(); 
 } 
 saveData(newData); 
 }; 
 const deleteTask = (categoryId, taskId) => { 
 const newData = { ...allData }; 
 newData[currentMonth].tasks[categoryId] = newData[currentMonth].tasks[categoryId].filter  (t) => t.id !== taskId 
 ); 
 saveData(newData); 
 }; 
 const updateNotes = (newNotes) => { 
 const newData = { ...allData }; 
 newData[currentMonth].notes = newNotes; 
 saveData(newData); 
 }; 
 const getProgress = (categoryId) => { 
 const categoryTasks = monthData?.tasks[categoryId] || []; 
 if (categoryTasks.length === 0) return 0; 
 const completed = categoryTasks.filter((t) => t.completed).length;  return Math.round((completed / categoryTasks.length) * 100); 
 }; 
 const getTotalProgress = () => { 
 let totalTasks = 0; 
 let completedTasks = 0; 
 Object.keys(monthData?.tasks || {}).forEach((catId) => { 
 const tasks = monthData.tasks[catId]; 
 totalTasks += tasks.length; 
 completedTasks += tasks.filter((t) => t.completed).length;
 }); 
 return totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);  }; 
 const changeMonth = (direction) => { 
 const [year, month] = currentMonth.split('-'); 
 let newMonth = parseInt(month) + direction; 
 let newYear = parseInt(year); 
 if (newMonth > 12) { 
 newMonth = 1; 
 newYear++; 
 } else if (newMonth < 1) { 
 newMonth = 12; 
 newYear--; 
 } 
 const newMonthKey = `${newYear}-${String(newMonth).padStart(2, '0')}`;  setCurrentMonth(newMonthKey); 
 setExpandedAlley(null); 
 }; 
 const formatMonthYear = (monthKey) => { 
 const [year, month] = monthKey.split('-'); 
 const date = new Date(year, parseInt(month) - 1); 
 return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });  }; 
 const getTasksByPriority = (categoryId) => { 
 const tasks = monthData?.tasks[categoryId] || []; 
 return { 
 critical: tasks.filter((t) => t.priority === 'critical'), 
 important: tasks.filter((t) => t.priority === 'important'),  nice: tasks.filter((t) => t.priority === 'nice'), 
 }; 
 }; 
 return ( 
 <div 
 style={{ 
 background: 'linear-gradient(135deg, #faf8f6 0%, #f5f0eb 50%, #ede8e3 100%)',  minHeight: '100vh', 
 fontFamily: '"Garamond", "Georgia", serif', 
 color: '#2b2520', 
 padding: '1.5rem', 
 }} 
 >
 {/* Header */} 
 <div 
 style={{ 
 textAlign: 'center', 
 marginBottom: '2rem', 
 borderBottom: '2px solid #D4AF37',  paddingBottom: '1.5rem', 
 }} 
 > 
 <h1 
 style={{ 
 fontSize: '2.5rem', 
 fontWeight: '300', 
 letterSpacing: '2px', 
 margin: '0 0 0.5rem 0', 
 }} 
 > 
 Miller Family Dashboard 
 </h1> 
 <p 
 style={{ 
 fontSize: '0.95rem', 
 color: '#665544', 
 letterSpacing: '1px', 
 margin: 0, 
 }} 
 > 
 Kacy & Shanice • Building our life together  </p> 
 </div> 
 {/* Month Navigation */} 
 <div 
 style={{ 
 display: 'flex', 
 justifyContent: 'space-between',  alignItems: 'center', 
 marginBottom: '2rem', 
 background: 'white', 
 padding: '1.25rem', 
 border: '2px solid #D4AF37', 
 borderRadius: '0', 
 }} 
 > 
 <button 
 onClick={() => changeMonth(-1)}  style={{
 background: 'none',  border: 'none', 
 cursor: 'pointer', 
 padding: '0.5rem', 
 color: '#D4AF37', 
 }} 
 > 
 <ChevronLeft size={24} />  </button> 
 <h2 
 style={{ 
 fontSize: '1.4rem',  fontWeight: '500', 
 margin: 0, 
 flex: 1, 
 textAlign: 'center',  }} 
 > 
 {formatMonthYear(currentMonth)}  </h2> 
 <button 
 onClick={() => changeMonth(1)}  style={{ 
 background: 'none',  border: 'none', 
 cursor: 'pointer', 
 padding: '0.5rem', 
 color: '#D4AF37', 
 }} 
 > 
 <ChevronRight size={24} />  </button> 
 {/* Progress Ring */} 
 <div 
 style={{ 
 marginLeft: '2rem',  textAlign: 'center',  display: 'flex', 
 flexDirection: 'column',  alignItems: 'center',  }} 
 > 
 <div 
 style={{
 width: '60px', 
 height: '60px', 
 borderRadius: '50%', 
 background: `conic-gradient(#D4AF37 0deg ${getTotalProgress() * 3.6}deg, #eee  display: 'flex', 
 alignItems: 'center', 
 justifyContent: 'center', 
 marginBottom: '0.5rem', 
 }} 
 > 
 <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{getTotalProgress()}%< </div> 
 <span style={{ fontSize: '0.75rem', color: '#999' }}>Month Progress</span>  </div> 
 </div> 
 {/* Person Toggle */} 
 <div 
 style={{ 
 display: 'flex', 
 justifyContent: 'center', 
 gap: '1rem', 
 marginBottom: '2rem', 
 }} 
 > 
 {['Kacy', 'Shanice'].map((p) => ( 
 <button 
 key={p} 
 onClick={() => setPerson(p)} 
 style={{ 
 padding: '0.75rem 1.5rem', 
 fontSize: '0.95rem', 
 fontFamily: 'inherit', 
 border: person === p ? '2px solid #2b2520' : '2px solid #ddd',  backgroundColor: person === p ? '#2b2520' : 'transparent',  color: person === p ? '#faf8f6' : '#2b2520', 
 cursor: 'pointer', 
 letterSpacing: '0.5px', 
 transition: 'all 0.3s ease', 
 borderRadius: '0', 
 }} 
 > 
 {p} 
 </button> 
 ))} 
 </div>
 {/* Categories Grid */} 
 <div 
 style={{ 
 display: 'grid', 
 gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',  gap: '1.5rem', 
 marginBottom: '2rem', 
 }} 
 > 
 {categories.map((category) => { 
 const tasksByPriority = getTasksByPriority(category.id);  const allCategoryTasks = monthData?.tasks[category.id] || []; 
 return ( 
 <div 
 key={category.id} 
 style={{ 
 background: 'white', 
 border: `3px solid ${category.color}`, 
 padding: '1.25rem', 
 borderRadius: '0', 
 boxShadow: '0 4px 12px rgba(0,0,0,0.08)', 
 }} 
 > 
 {/* Category Header */} 
 <div 
 onClick={() => 
 setExpandedAlley(expandedAlley === category.id ? null : category.id)  } 
 style={{ 
 cursor: 'pointer', 
 display: 'flex', 
 justifyContent: 'space-between', 
 alignItems: 'center', 
 marginBottom: '0.75rem', 
 paddingBottom: '0.75rem', 
 borderBottom: `1px solid ${category.color}30`, 
 }} 
 > 
 <h3 
 style={{ 
 margin: 0, 
 fontSize: '1.1rem', 
 fontWeight: '500', 
 display: 'flex', 
 gap: '0.5rem', 
 alignItems: 'center',
 }} 
 > 
 <span style={{ fontSize: '1.5rem' }}>{category.icon}</span>  <span style={{ fontSize: '0.95rem' }}>{category.name}</span>  </h3> 
 <span 
 style={{ 
 fontSize: '0.85rem', 
 fontWeight: 'bold', 
 color: category.color, 
 }} 
 > 
 {getProgress(category.id)}% 
 </span> 
 </div> 
 {/* Progress Bar */} 
 <div 
 style={{ 
 width: '100%', 
 height: '5px', 
 background: '#eee', 
 marginBottom: '0.75rem', 
 borderRadius: '0', 
 overflow: 'hidden', 
 }} 
 > 
 <div 
 style={{ 
 width: `${getProgress(category.id)}%`, 
 height: '100%', 
 background: category.color, 
 transition: 'width 0.4s ease', 
 }} 
 /> 
 </div> 
 {/* Collapsed Stats */} 
 {expandedAlley !== category.id && ( 
 <div style={{ fontSize: '0.85rem', color: '#999' }}>  {allCategoryTasks.length} items 
 {allCategoryTasks.filter((t) => t.completed).length > 0 && (  <span> 
 {' '} 
 • {allCategoryTasks.filter((t) => t.completed).length} complete  </span> 
 )}
 </div> 
 )} 
 {/* Expanded Content */} 
 {expandedAlley === category.id && (  <div style={{ marginBottom: '0.75rem' }}>  {/* Critical Tasks */} 
 {tasksByPriority.critical.length > 0 && (  <div style={{ marginBottom: '0.75rem' }}>  <div 
 style={{ 
 fontSize: '0.75rem', 
 fontWeight: 'bold', 
 color: '#E74C3C', 
 textTransform: 'uppercase',  marginBottom: '0.5rem',  display: 'flex', 
 gap: '0.25rem', 
 alignItems: 'center', 
 }} 
 > 
 <Flag size={12} /> Critical  </div> 
 {tasksByPriority.critical.map((task) => (  <TaskItem 
 key={task.id} 
 task={task} 
 categoryId={category.id}  onToggle={toggleTask} 
 onDelete={deleteTask} 
 /> 
 ))} 
 </div> 
 )} 
 {/* Important Tasks */} 
 {tasksByPriority.important.length > 0 && (  <div style={{ marginBottom: '0.75rem' }}>  {tasksByPriority.critical.length > 0 && (  <div 
 style={{ 
 fontSize: '0.75rem',  fontWeight: 'bold', 
 color: '#F39C12', 
 textTransform: 'uppercase',  marginBottom: '0.5rem',  marginTop: '0.5rem',
 }} 
 > 
 Important 
 </div> 
 )} 
 {tasksByPriority.important.map((task) => (  <TaskItem 
 key={task.id} 
 task={task} 
 categoryId={category.id}  onToggle={toggleTask} 
 onDelete={deleteTask} 
 /> 
 ))} 
 </div> 
 )} 
 {/* Nice-to-have Tasks */} 
 {tasksByPriority.nice.length > 0 && (  <div> 
 {(tasksByPriority.critical.length > 0 ||  tasksByPriority.important.length > 0) && (  <div 
 style={{ 
 fontSize: '0.75rem', 
 fontWeight: 'bold', 
 color: '#95A5A6', 
 textTransform: 'uppercase',  marginBottom: '0.5rem',  marginTop: '0.5rem', 
 }} 
 > 
 Nice-to-have 
 </div> 
 )} 
 {tasksByPriority.nice.map((task) => (  <TaskItem 
 key={task.id} 
 task={task} 
 categoryId={category.id}  onToggle={toggleTask} 
 onDelete={deleteTask} 
 /> 
 ))} 
 </div> 
 )}
 {/* Add Task Input */} 
 <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>  <input 
 type="text" 
 placeholder="Add a task..." 
 value={newTaskInputs[category.id] || ''} 
 onChange={(e) => 
 setNewTaskInputs({ 
 ...newTaskInputs, 
 [category.id]: e.target.value, 
 }) 
 } 
 onKeyPress={(e) => { 
 if (e.key === 'Enter') addTask(category.id);  }} 
 style={{ 
 flex: 1, 
 padding: '0.5rem', 
 border: `1px solid ${category.color}40`, 
 fontFamily: 'inherit', 
 fontSize: '0.9rem', 
 borderRadius: '0', 
 }} 
 /> 
 <button 
 onClick={() => addTask(category.id)} 
 style={{ 
 padding: '0.5rem 0.75rem', 
 background: category.color, 
 color: 'white', 
 border: 'none', 
 cursor: 'pointer', 
 borderRadius: '0', 
 display: 'flex', 
 alignItems: 'center', 
 }} 
 > 
 <Plus size={18} /> 
 </button> 
 </div> 
 </div> 
 )} 
 </div> 
 ); 
 })} 
 </div>
 {/* Monthly Notes */} 
 <div 
 style={{ 
 background: 'white', 
 border: '3px solid #4A90E2', 
 padding: '1.5rem', 
 borderRadius: '0', 
 boxShadow: '0 4px 12px rgba(0,0,0,0.08)', 
 marginBottom: '2rem', 
 }} 
 > 
 <h2 
 style={{ 
 margin: '0 0 1rem 0', 
 fontSize: '1.2rem', 
 fontWeight: '500', 
 display: 'flex', 
 gap: '0.5rem', 
 alignItems: 'center', 
 }} 
 > 
 <MessageCircle size={20} style={{ color: '#4A90E2' }} /> 
 {formatMonthYear(currentMonth)} Notes & Messages 
 </h2> 
 <textarea 
 value={monthData?.notes || ''} 
 onChange={(e) => updateNotes(e.target.value)} 
 placeholder="Updates, reminders, wins, dates to remember, love notes, ideas... any style={{ 
 width: '100%', 
 minHeight: '120px', 
 padding: '1rem', 
 border: '1px solid #ddd', 
 fontFamily: 'inherit', 
 fontSize: '0.95rem', 
 lineHeight: '1.6', 
 boxSizing: 'border-box', 
 borderRadius: '0', 
 marginBottom: '0.75rem', 
 }} 
 /> 
 <p style={{ margin: 0, fontSize: '0.85rem', color: '#999' }}> 
 Saves automatically 
 </p> 
 </div> 
 {/* Footer */}
 <div 
 style={{ 
 textAlign: 'center', 
 paddingTop: '2rem', 
 borderTop: '2px solid #D4AF37', 
 color: '#999', 
 fontSize: '0.85rem', 
 }} 
 > 
 <p style={{ margin: 0 }}> 
 Built for you two. Changes sync instantly. One dashboard, infinite possibilities.  </p> 
 </div> 
 </div> 
 ); 
} 
function TaskItem({ task, categoryId, onToggle, onDelete }) { 
 return ( 
 <div 
 style={{ 
 display: 'flex', 
 gap: '0.5rem', 
 marginBottom: '0.5rem', 
 padding: '0.5rem', 
 backgroundColor: task.completed ? '#f9f9f9' : 'transparent', 
 alignItems: 'flex-start', 
 }} 
 > 
 <button 
 onClick={() => onToggle(categoryId, task.id)} 
 style={{ 
 background: 'none', 
 border: 'none', 
 cursor: 'pointer', 
 padding: '0', 
 display: 'flex', 
 color: task.completed ? '#D4AF37' : '#ddd', 
 marginTop: '2px', 
 }} 
 > 
 {task.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}  </button> 
 <div style={{ flex: 1, minWidth: 0 }}> 
 <p 
 style={{ 
 margin: '0 0 0.25rem 0',
 textDecoration: task.completed ? 'line-through' : 'none', 
 color: task.completed ? '#999' : 'inherit', 
 fontSize: '0.9rem', 
 }} 
 > 
 {task.text} 
 </p> 
 <span style={{ fontSize: '0.7rem', color: '#bbb' }}> 
 {task.completedAt ? `✓ ${task.completedBy} • ${task.completedAt}` : `Added by ${ta </span> 
 </div> 
 <button 
 onClick={() => onDelete(categoryId, task.id)} 
 style={{ 
 background: 'none', 
 border: 'none', 
 cursor: 'pointer', 
 color: '#eee', 
 padding: '0', 
 marginTop: '2px', 
 }} 
 > 
 <Trash2 size={14} /> 
 </button> 
 </div> 
 ); 
}
