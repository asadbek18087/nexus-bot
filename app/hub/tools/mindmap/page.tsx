"use client";

import { useState, useCallback, useRef } from 'react';
import SuperAppLayout from '@/components/SuperAppLayout';
import { useSecureEconomyStore } from '@/stores/secureEconomyStore';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import { Brain, Plus, Trash2, Save, Download, Zap, Sparkles } from 'lucide-react';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    data: { label: 'Main Idea' },
    position: { x: 250, y: 50 },
    style: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
    },
  },
];

const initialEdges: Edge[] = [];

const nodeTypes = {
  default: ({ data, selected }: { data: any; selected: boolean }) => (
    <div
      className={`px-4 py-2 rounded-lg text-white font-medium ${
        selected ? 'ring-2 ring-violet-400' : ''
      }`}
      style={{
        background: data.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {data.label}
    </div>
  ),
};

export default function MindMapPage() {
  const { coins, refreshBalance } = useSecureEconomyStore();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [title, setTitle] = useState('My Mind Map');
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onInit = useCallback((rfi: any) => {
    setReactFlowInstance(rfi);
  }, []);

  const addNode = () => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'default',
      data: { 
        label: 'New Idea',
        background: `linear-gradient(135deg, #${Math.floor(Math.random()*16777215).toString(16)} 0%, #${Math.floor(Math.random()*16777215).toString(16)} 100%)`
      },
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const generateWithAI = async () => {
    if (!title || coins < 5) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/mindmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic: title,
          telegramId: "123456789" // TODO: Get from Telegram WebApp
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.nodes && data.edges) {
          setNodes(data.nodes);
          setEdges(data.edges);
          await refreshBalance("123456789");
        }
      } else {
        console.error('Failed to generate mind map');
      }
    } catch (error) {
      console.error('Error generating mind map:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteSelected = () => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
  };

  const saveMindMap = async () => {
    // In a real app, this would save to the backend
    // For now, we'll just simulate a save and maybe charge coins if that was the intent
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const flow = reactFlowInstance.toObject();
    localStorage.setItem(`mindmap-${Date.now()}`, JSON.stringify(flow));
    setIsSaving(false);
    alert('Mind map saved locally!');
  };

  const exportMindMap = () => {
    const flow = reactFlowInstance.toObject();
    const dataStr = JSON.stringify(flow, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${title.replace(/\s+/g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <SuperAppLayout>
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Mind Map Creator
            </h1>
            <p className="text-slate-400">Create beautiful mind maps for your ideas</p>
          </div>

          {/* Coins Status */}
          <div className="flex items-center gap-2 mb-6 p-3 bg-slate-800/50 rounded-lg border border-violet-500/20">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-sm">Coins: {coins}</span>
            <span className="text-xs text-slate-400 ml-auto">AI Generation costs 5 coins</span>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700 focus:border-violet-500/50 focus:outline-none"
              placeholder="Enter topic..."
            />
            
            <button
              onClick={generateWithAI}
              disabled={isGenerating || coins < 5 || !title}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? 'Generating...' : 'AI Generate'}
            </button>

            <div className="w-px h-8 bg-slate-700 mx-2" />

            <button
              onClick={addNode}
              className="flex items-center gap-2 px-3 py-2 bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Node
            </button>
            
            <button
              onClick={deleteSelected}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            
            <button
              onClick={saveMindMap}
              disabled={isSaving}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            
            <button
              onClick={exportMindMap}
              className="flex items-center gap-2 px-3 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Mind Map Canvas */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden" style={{ height: '600px' }}>
            <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={onInit}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-left"
              >
                <Background color="#667eea" gap={16} />
                <Controls 
                  className="bg-slate-800 border border-slate-700"
                  showInteractive={false}
                />
                <MiniMap 
                  className="bg-slate-800"
                  nodeColor={(node) => {
                    return node?.data?.background || '#667eea';
                  }}
                />
              </ReactFlow>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-slate-800/30 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Brain className="w-5 h-5 text-violet-400" />
              How to use:
            </h3>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• Enter a topic and click &quot;AI Generate&quot; to auto-create a map</li>
              <li>• Click &quot;Add Node&quot; to manually add ideas</li>
              <li>• Drag from node handles to connect ideas</li>
              <li>• Double-click nodes to edit text</li>
              <li>• Select nodes and press Delete to remove</li>
            </ul>
          </div>
        </div>
      </div>
    </SuperAppLayout>
  );
}
