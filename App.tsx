
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabase';
import { Todo, AISuggestion } from './types';
import TodoItem from './components/TodoItem';
import { getAITaskInsights } from './services/geminiService';
import { Plus, Loader2, BrainCircuit, Sparkles, CheckSquare, ListTodo, Ghost } from 'lucide-react';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isLoading, setIsLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState<AISuggestion | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const fetchTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ title: newTodo, priority, is_completed: false }])
        .select();

      if (error) throw error;
      setTodos([data[0], ...todos]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id: string, is_completed: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ is_completed })
        .eq('id', id);

      if (error) throw error;
      setTodos(todos.map(t => t.id === id ? { ...t, is_completed } : t));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTodos(todos.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const getAIHelp = async () => {
    if (todos.length === 0) return;
    setIsAiLoading(true);
    const insights = await getAITaskInsights(todos);
    setAiInsight(insights);
    setIsAiLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-2xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">SmartTask</h1>
          </div>
          <button 
            onClick={getAIHelp}
            disabled={isAiLoading || todos.length === 0}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full font-medium text-sm shadow-md hover:shadow-lg disabled:opacity-50 transition-all active:scale-95"
          >
            {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
            <span>AI 추천</span>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 mt-8">
        {/* AI Insight Card */}
        {aiInsight && (
          <div className="mb-8 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center space-x-2 text-indigo-600 mb-3">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold">AI의 스마트 제안</span>
            </div>
            <p className="text-slate-700 italic mb-4">"{aiInsight.message}"</p>
            <div className="bg-white/60 p-4 rounded-xl border border-white/80">
              <p className="text-slate-600 text-sm leading-relaxed">
                <span className="font-semibold text-indigo-700">추천: </span>
                {aiInsight.recommendation}
              </p>
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className="bg-white rounded-2xl border p-6 shadow-sm mb-8">
          <form onSubmit={addTodo} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="오늘 무엇을 하시나요?"
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-lg"
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-slate-500">우선순위:</span>
              <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-3 py-1 text-xs rounded-md transition-all ${
                      priority === p 
                        ? 'bg-white shadow-sm text-indigo-600 font-bold border border-slate-100' 
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {p.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center space-x-2 font-bold text-slate-700">
              <ListTodo className="w-5 h-5" />
              <span>할 일 목록 ({todos.length})</span>
            </h2>
            <div className="text-xs text-slate-400">
              {todos.filter(t => t.is_completed).length}개 완료됨
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
              <p className="text-slate-400 animate-pulse">데이터를 불러오는 중...</p>
            </div>
          ) : todos.length > 0 ? (
            <div className="pb-10">
              {todos.map(todo => (
                <TodoItem 
                  key={todo.id} 
                  todo={todo} 
                  onToggle={toggleTodo} 
                  onDelete={deleteTodo} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300 border-2 border-dashed border-slate-200 rounded-2xl">
              <Ghost className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">할 일이 없습니다. 새로 추가해보세요!</p>
            </div>
          )}
        </div>
      </main>

      {/* Quick SQL Helper Modal or Tip (Visual only) */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t px-4 py-3">
        <div className="max-w-2xl mx-auto flex justify-between items-center text-[10px] text-slate-400 font-mono">
          <span>Supabase Realtime Sync Enabled</span>
          <span className="hidden sm:inline">Check source code for SQL setup script</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
